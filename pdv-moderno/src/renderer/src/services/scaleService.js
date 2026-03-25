/**
 * scaleService.js
 * 
 * Serial communication service for Toledo scales via Web Serial API.
 * Supports multiple Toledo protocols (PRT2, PRT3) through a strategy pattern.
 * Designed for easy migration to Electron/Tauri native serial later.
 */

// ─── ASCII Control Characters ────────────────────────────────
const ENQ = 0x05; // Enquiry — triggers scale to send weight
const STX = 0x02; // Start of text
const ETX = 0x03; // End of text

// ─── Protocol Parsers (Strategy Pattern) ─────────────────────

/**
 * Toledo PRT2 Protocol Parser
 * 
 * Flow: Send ENQ → Receive STX + PPPPP + ETX
 * PPPPP = 5 ASCII chars representing weight (e.g., "01525" = 15.25 kg)
 * Weight has 3 decimal places implied (divide by 1000) OR 2 depending on config.
 * Most common: last 3 digits are decimal → "01525" = 1.525 kg
 */
class ToledoPRT2Parser {
  name = 'PRT2';
  description = 'Toledo PRT2 — Peso bruto simples (5 dígitos)';

  parse(rawBytes) {
    const data = new Uint8Array(rawBytes);

    // Find STX and ETX positions
    const stxIdx = data.indexOf(STX);
    const etxIdx = data.indexOf(ETX);

    if (stxIdx === -1 || etxIdx === -1 || etxIdx <= stxIdx) {
      return { success: false, error: 'Resposta inválida — STX/ETX não encontrados', weight: 0 };
    }

    const payload = data.slice(stxIdx + 1, etxIdx);
    const weightStr = new TextDecoder().decode(payload).trim();

    // Extract numeric weight — Toledo sends weight with implied decimals
    const weightRaw = parseInt(weightStr, 10);
    if (isNaN(weightRaw)) {
      return { success: false, error: 'Peso inválido recebido da balança', weight: 0 };
    }

    // PRT2: 5 digits, 3 decimal places → divide by 1000
    const weight = weightRaw / 1000;

    return {
      success: true,
      weight,
      stable: true, // PRT2 doesn't report stability
      raw: weightStr,
    };
  }
}

/**
 * Toledo PRT3 Protocol Parser
 * 
 * Flow: Send ENQ → Receive STX + S + PPPPP + ETX
 * S = status character:
 *   'P' (0x50) = Stable positive weight
 *   'I' (0x49) = Unstable (still moving)
 *   'N' (0x4E) = Negative weight
 *   'S' (0x53) = Overweight (sobrecarga)
 * PPPPP = 5 ASCII chars representing weight
 */
class ToledoPRT3Parser {
  name = 'PRT3';
  description = 'Toledo PRT3 — Peso com status (estável/instável)';

  parse(rawBytes) {
    const data = new Uint8Array(rawBytes);

    const stxIdx = data.indexOf(STX);
    const etxIdx = data.indexOf(ETX);

    if (stxIdx === -1 || etxIdx === -1 || etxIdx <= stxIdx) {
      return { success: false, error: 'Resposta inválida — STX/ETX não encontrados', weight: 0 };
    }

    const payload = data.slice(stxIdx + 1, etxIdx);
    const payloadStr = new TextDecoder().decode(payload);

    if (payloadStr.length < 6) {
      return { success: false, error: 'Resposta curta demais da balança', weight: 0 };
    }

    const statusChar = payloadStr[0];
    const weightStr = payloadStr.slice(1).trim();

    const weightRaw = parseInt(weightStr, 10);
    if (isNaN(weightRaw)) {
      return { success: false, error: 'Peso inválido recebido da balança', weight: 0 };
    }

    const weight = weightRaw / 1000;

    // Handle status
    const statusMap = {
      P: { stable: true, error: null },
      I: { stable: false, error: null },
      N: { stable: true, error: 'Peso negativo detectado' },
      S: { stable: false, error: 'Sobrecarga — peso acima do limite' },
    };

    const status = statusMap[statusChar] || { stable: false, error: `Status desconhecido: ${statusChar}` };

    return {
      success: !status.error,
      weight: status.error ? 0 : weight,
      stable: status.stable,
      raw: payloadStr,
      error: status.error || null,
      statusChar,
    };
  }
}

// ─── Protocol Factory ────────────────────────────────────────

const PROTOCOLS = {
  PRT2: new ToledoPRT2Parser(),
  PRT3: new ToledoPRT3Parser(),
};

function getProtocol(name) {
  return PROTOCOLS[name] || PROTOCOLS.PRT2;
}

function getAvailableProtocols() {
  return Object.values(PROTOCOLS).map(p => ({ name: p.name, description: p.description }));
}

// ─── Default Config ──────────────────────────────────────────

const DEFAULT_CONFIG = {
  baudRate: 9600,
  dataBits: 8,
  stopBits: 1,
  parity: 'none',
  flowControl: 'none',
  protocol: 'PRT2',
};

const BAUD_RATES = [2400, 4800, 9600, 19200, 115200];

const STORAGE_KEY = 'pdv_scale_config';

// ─── Scale Service (Singleton) ───────────────────────────────

class ScaleService {
  constructor() {
    this._port = null;
    this._reader = null;
    this._connected = false;
    this._listeners = new Set();
    this._config = this._loadConfig();
  }

  // ── Config Persistence ──

  _loadConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : { ...DEFAULT_CONFIG };
    } catch {
      return { ...DEFAULT_CONFIG };
    }
  }

  saveConfig(newConfig) {
    this._config = { ...this._config, ...newConfig };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._config));
  }

  getConfig() {
    return { ...this._config };
  }

  // ── Connection Management ──

  isSupported() {
    return 'serial' in navigator;
  }

  isConnected() {
    return this._connected && this._port !== null;
  }

  async connect() {
    if (!this.isSupported()) {
      throw new Error('Web Serial API não suportada. Use Chrome ou Edge.');
    }

    try {
      // Prompt user to select a serial port
      this._port = await navigator.serial.requestPort();

      await this._port.open({
        baudRate: this._config.baudRate,
        dataBits: this._config.dataBits,
        stopBits: this._config.stopBits,
        parity: this._config.parity,
        flowControl: this._config.flowControl,
      });

      this._connected = true;
      this._notifyListeners('connected');
      return true;
    } catch (error) {
      this._connected = false;
      this._port = null;

      if (error.name === 'NotFoundError') {
        throw new Error('Nenhuma porta serial selecionada.');
      }
      throw new Error(`Erro ao conectar: ${error.message}`);
    }
  }

  async disconnect() {
    try {
      if (this._reader) {
        await this._reader.cancel();
        this._reader.releaseLock();
        this._reader = null;
      }
      if (this._port) {
        await this._port.close();
        this._port = null;
      }
    } catch (error) {
      console.warn('Erro ao desconectar:', error);
    } finally {
      this._connected = false;
      this._notifyListeners('disconnected');
    }
  }

  // ── Weight Reading ──

  async requestWeight() {
    if (!this.isConnected()) {
      throw new Error('Balança não conectada.');
    }

    const protocol = getProtocol(this._config.protocol);

    try {
      // Send ENQ to request weight
      const writer = this._port.writable.getWriter();
      await writer.write(new Uint8Array([ENQ]));
      writer.releaseLock();

      // Read response with timeout
      const response = await this._readWithTimeout(2000);

      if (!response || response.length === 0) {
        return { success: false, error: 'Sem resposta da balança (timeout)', weight: 0 };
      }

      // Parse using selected protocol
      return protocol.parse(response);
    } catch (error) {
      if (error.message.includes('timeout')) {
        return { success: false, error: 'Balança não respondeu (verifique conexão)', weight: 0 };
      }
      return { success: false, error: `Erro de leitura: ${error.message}`, weight: 0 };
    }
  }

  async _readWithTimeout(timeoutMs) {
    if (!this._port?.readable) {
      throw new Error('Porta serial não está legível');
    }

    const reader = this._port.readable.getReader();
    const chunks = [];

    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('timeout')), timeoutMs);
      });

      // Collect data until we get ETX or timeout
      const readPromise = (async () => {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(...value);
            // Check if we got ETX — message is complete
            if (value.includes(ETX)) break;
          }
        }
        return new Uint8Array(chunks);
      })();

      return await Promise.race([readPromise, timeoutPromise]);
    } finally {
      reader.releaseLock();
    }
  }

  // ── Test Connection ──

  async testConnection() {
    try {
      const result = await this.requestWeight();
      return {
        success: result.success,
        message: result.success
          ? `✅ Conexão OK — Peso: ${result.weight.toFixed(3)} kg`
          : `⚠️ ${result.error}`,
        weight: result.weight,
        raw: result.raw,
      };
    } catch (error) {
      return { success: false, message: `❌ ${error.message}`, weight: 0 };
    }
  }

  // ── Event Subscription ──

  onStatusChange(callback) {
    this._listeners.add(callback);
    return () => this._listeners.delete(callback);
  }

  _notifyListeners(status) {
    this._listeners.forEach(cb => cb(status));
  }
}

// ─── Singleton Export ────────────────────────────────────────

const scaleService = new ScaleService();

export { scaleService, getAvailableProtocols, BAUD_RATES, DEFAULT_CONFIG };
export default scaleService;
