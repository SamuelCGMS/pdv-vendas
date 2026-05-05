/**
 * Scale integration via Web Serial API.
 *
 * Supports Toledo scales with PRT2 and PRT3 protocols.
 * Configuration is persisted in localStorage.
 *
 * @see docs/balanca-web-serial-referencia.md
 */

// ─── Types ───────────────────────────────────────────────────────────

export type ScaleProtocol = "PRT2" | "PRT3";

export type ScaleConfig = {
  baudRate: number;
  dataBits: number;
  stopBits: number;
  parity: ParityType;
  flowControl: FlowControlType;
  protocol: ScaleProtocol;
};

export type ScaleReading = {
  weightKg: number;
  stable: boolean;
  error: string | null;
};

export type ScaleStatus = "disconnected" | "connecting" | "connected" | "reading" | "error";

// ─── Constants ───────────────────────────────────────────────────────

const ENQ = 0x05;
const STX = 0x02;
const ETX = 0x03;

const STORAGE_KEY = "pdv-scale-config";

const READ_TIMEOUT_MS = 2000;

export const BAUD_RATES = [2400, 4800, 9600, 19200, 115200] as const;

export const DEFAULT_CONFIG: ScaleConfig = {
  baudRate: 9600,
  dataBits: 8,
  stopBits: 1,
  parity: "none",
  flowControl: "none",
  protocol: "PRT2",
};

// ─── Config Persistence ──────────────────────────────────────────────

export function loadScaleConfig(): ScaleConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<ScaleConfig>;
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch {
    // Silently fallback
  }
  return { ...DEFAULT_CONFIG };
}

export function saveScaleConfig(config: ScaleConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

// ─── Web Serial API Check ────────────────────────────────────────────

export function isWebSerialSupported(): boolean {
  return "serial" in navigator;
}

// ─── Scale Connection ────────────────────────────────────────────────

export class ScaleConnection {
  private port: SerialPort | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private config: ScaleConfig;

  constructor(config?: ScaleConfig) {
    this.config = config ?? loadScaleConfig();
  }

  get isConnected(): boolean {
    return this.port !== null;
  }

  /** Prompt user to select a serial port and open it. */
  async connect(): Promise<void> {
    if (!isWebSerialSupported()) {
      throw new Error("Web Serial API não suportada neste navegador.");
    }

    const port = await navigator.serial.requestPort();
    await port.open({
      baudRate: this.config.baudRate,
      dataBits: this.config.dataBits,
      stopBits: this.config.stopBits,
      parity: this.config.parity,
      flowControl: this.config.flowControl,
    });

    this.port = port;
  }

  /** Close the serial port. */
  async disconnect(): Promise<void> {
    if (this.reader) {
      try { await this.reader.cancel(); } catch { /* ignore */ }
      this.reader = null;
    }
    if (this.port) {
      try { await this.port.close(); } catch { /* ignore */ }
      this.port = null;
    }
  }

  /** Send ENQ command and read the weight response. */
  async readWeight(): Promise<ScaleReading> {
    if (!this.port || !this.port.writable || !this.port.readable) {
      return { weightKg: 0, stable: false, error: "Balança não conectada." };
    }

    try {
      // Send ENQ
      const writer = this.port.writable.getWriter();
      await writer.write(new Uint8Array([ENQ]));
      writer.releaseLock();

      // Read response
      const buffer = await this.readUntilETX();
      if (!buffer) {
        return { weightKg: 0, stable: false, error: "Timeout ao ler balança." };
      }

      return this.parseResponse(buffer);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      return { weightKg: 0, stable: false, error: message };
    }
  }

  updateConfig(config: ScaleConfig): void {
    this.config = config;
    saveScaleConfig(config);
  }

  // ─── Private ─────────────────────────────────────────────────────

  private async readUntilETX(): Promise<Uint8Array | null> {
    if (!this.port?.readable) return null;

    this.reader = this.port.readable.getReader();
    const chunks: number[] = [];
    const deadline = Date.now() + READ_TIMEOUT_MS;

    try {
      while (Date.now() < deadline) {
        const { value, done } = await this.reader.read();
        if (done || !value) break;

        for (const byte of value) {
          chunks.push(byte);
          if (byte === ETX) {
            return new Uint8Array(chunks);
          }
        }
      }
    } finally {
      this.reader.releaseLock();
      this.reader = null;
    }

    return null;
  }

  private parseResponse(data: Uint8Array): ScaleReading {
    // Find STX and ETX positions
    const stxIndex = data.indexOf(STX);
    const etxIndex = data.indexOf(ETX);

    if (stxIndex === -1 || etxIndex === -1 || etxIndex <= stxIndex) {
      return { weightKg: 0, stable: false, error: "Resposta inválida da balança." };
    }

    const payload = data.slice(stxIndex + 1, etxIndex);

    if (this.config.protocol === "PRT3") {
      return this.parsePRT3(payload);
    }

    return this.parsePRT2(payload);
  }

  /** PRT2: STX + PPPPP + ETX — 5 ASCII chars, 3 implicit decimals */
  private parsePRT2(payload: Uint8Array): ScaleReading {
    const text = new TextDecoder().decode(payload).trim();
    const raw = parseInt(text, 10);

    if (isNaN(raw)) {
      return { weightKg: 0, stable: false, error: `PRT2: payload inválido "${text}"` };
    }

    return { weightKg: raw / 1000, stable: true, error: null };
  }

  /** PRT3: STX + S + PPPPP + ETX — S=status char, then 5 ASCII chars */
  private parsePRT3(payload: Uint8Array): ScaleReading {
    const text = new TextDecoder().decode(payload);

    if (text.length < 2) {
      return { weightKg: 0, stable: false, error: "PRT3: payload curto demais" };
    }

    const statusChar = text[0];
    const weightStr = text.slice(1).trim();
    const raw = parseInt(weightStr, 10);

    if (isNaN(raw)) {
      return { weightKg: 0, stable: false, error: `PRT3: peso inválido "${weightStr}"` };
    }

    const weightKg = raw / 1000;

    if (statusChar === "S") {
      return { weightKg, stable: false, error: "Sobrecarga na balança" };
    }
    if (statusChar === "N") {
      return { weightKg: -weightKg, stable: true, error: null };
    }
    if (statusChar === "I") {
      return { weightKg, stable: false, error: null };
    }

    // "P" = stable positive
    return { weightKg, stable: true, error: null };
  }
}
