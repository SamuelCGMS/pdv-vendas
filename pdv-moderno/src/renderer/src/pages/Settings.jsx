import React, { useState, useEffect } from 'react';
import scaleService, { getAvailableProtocols, BAUD_RATES } from '../services/scaleService';

export default function Settings() {
  const [storeName, setStoreName] = useState('Supermercado Gravity LTDA');
  const [cnpj, setCnpj] = useState('00.000.000/0001-00');
  const [address, setAddress] = useState('Avenida React, 1024 - Web');
  const [primaryColor, setPrimaryColor] = useState('#0f62fe');
  const [defaultMargin, setDefaultMargin] = useState('35');

  // Scale config state
  const [scaleConfig, setScaleConfig] = useState(scaleService.getConfig());
  const [scaleConnected, setScaleConnected] = useState(scaleService.isConnected());
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const unsub = scaleService.onStatusChange((status) => {
      setScaleConnected(status === 'connected');
    });
    return unsub;
  }, []);

  const saveSettings = () => {
    document.documentElement.style.setProperty('--primary', primaryColor);
    alert('✅ Configurações salvas provisoriamente em sessão!\n(Esta mudança afeta toda a interface do sistema).');
  };

  const handleScaleConfigChange = (key, value) => {
    const updated = { ...scaleConfig, [key]: value };
    setScaleConfig(updated);
    scaleService.saveConfig(updated);
  };

  const handleConnectScale = async () => {
    try {
      setTestResult(null);
      if (scaleConnected) {
        await scaleService.disconnect();
      } else {
        await scaleService.connect();
      }
    } catch (error) {
      setTestResult({ success: false, message: `❌ ${error.message}` });
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await scaleService.testConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({ success: false, message: `❌ ${error.message}` });
    } finally {
      setIsTesting(false);
    }
  };

  const inputStyle = {
    padding: '12px 16px',
    fontSize: '1.1rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--surface-100)',
    color: 'var(--text-primary)',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'auto',
  };

  const protocols = getAvailableProtocols();

  return (
    <div className="flex-col w-full h-full" style={{ padding: '32px 64px', overflowY: 'auto' }}>
      <h1 style={{ color: 'var(--text-primary)', marginBottom: '32px', fontSize: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
        Configurações do Sistema
      </h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
        
        {/* Painel: Dados da Empresa */}
        <div className="card glass flex-col" style={{ padding: '32px', gap: '24px' }}>
           <h2 style={{ color: 'var(--primary)', fontSize: '1.5rem', marginBottom: '8px' }}>🏪 Dados da Empresa</h2>
           
           <div className="flex-col gap-2">
             <label style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Razão Social / Nome Fantasia</label>
             <input type="text" style={inputStyle} value={storeName} onChange={e => setStoreName(e.target.value)} />
           </div>

           <div className="flex-col gap-2">
             <label style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>CNPJ Emissor da Nota</label>
             <input type="text" style={inputStyle} value={cnpj} onChange={e => setCnpj(e.target.value)} />
           </div>

           <div className="flex-col gap-2">
             <label style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Endereço Padrão do Cupom</label>
             <input type="text" style={inputStyle} value={address} onChange={e => setAddress(e.target.value)} />
           </div>
        </div>

        {/* Painel: Preferências do Sistema */}
        <div className="card glass flex-col" style={{ padding: '32px', gap: '24px' }}>
           <h2 style={{ color: 'var(--primary)', fontSize: '1.5rem', marginBottom: '8px' }}>🖌️ Preferências Visuais e Contábeis</h2>
           
           <div className="flex-col gap-2">
             <label style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Cor da Marca (Substitui o Azul Global)</label>
             <div className="flex gap-4">
               <input 
                 type="color" 
                 value={primaryColor} 
                 onChange={e => setPrimaryColor(e.target.value)} 
                 style={{ width: '80px', height: '48px', cursor: 'pointer', padding: 0, border: '1px solid var(--border)', borderRadius: '8px' }} 
               />
               <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setPrimaryColor('#0f62fe')}>Restaurar Azul Original</button>
             </div>
             <span style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>A cor muda botões, bordas, gráficos e destaques do PDV.</span>
           </div>

           <div className="flex-col gap-2" style={{ marginTop: '16px' }}>
             <label style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Margem de Lucro Padrão Global (%)</label>
             <div className="flex items-center gap-4">
               <input type="number" style={{...inputStyle, width: '120px'}} value={defaultMargin} onChange={e => setDefaultMargin(e.target.value)} />
               <span style={{ color: 'var(--text-tertiary)' }}>Aplicada auto para novos produtos cadastrados</span>
             </div>
           </div>
        </div>

        {/* Painel: Balança Serial */}
        <div className="card glass flex-col" style={{ padding: '32px', gap: '24px', gridColumn: '1 / -1' }}>
          <div className="flex justify-between items-center">
            <h2 style={{ color: 'var(--primary)', fontSize: '1.5rem', margin: 0 }}>⚖️ Balança Serial (Toledo)</h2>
            <div className={`scale-status-badge ${scaleConnected ? 'connected' : 'disconnected'}`}>
              <span className="scale-status-dot" />
              {scaleConnected ? 'Conectada' : 'Desconectada'}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
            {/* Protocol */}
            <div className="flex-col gap-2">
              <label style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Protocolo</label>
              <select
                style={selectStyle}
                value={scaleConfig.protocol}
                onChange={e => handleScaleConfigChange('protocol', e.target.value)}
              >
                {protocols.map(p => (
                  <option key={p.name} value={p.name}>{p.name} — {p.description.split('—')[1]?.trim()}</option>
                ))}
              </select>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                Protocolo de comunicação da balança (verifique no menu C14)
              </span>
            </div>

            {/* Baud Rate */}
            <div className="flex-col gap-2">
              <label style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Baud Rate (Velocidade)</label>
              <select
                style={selectStyle}
                value={scaleConfig.baudRate}
                onChange={e => handleScaleConfigChange('baudRate', parseInt(e.target.value))}
              >
                {BAUD_RATES.map(rate => (
                  <option key={rate} value={rate}>{rate.toLocaleString()} bps</option>
                ))}
              </select>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                Velocidade de transmissão (verifique no menu C15)
              </span>
            </div>

            {/* Connect Button */}
            <div className="flex-col gap-2">
              <label style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Porta Serial</label>
              <button
                className={`btn ${scaleConnected ? 'btn-danger' : 'btn-primary'}`}
                style={{ width: '100%', padding: '12px', fontSize: '1.05rem' }}
                onClick={handleConnectScale}
              >
                {scaleConnected ? '🔌 Desconectar' : '🔗 Selecionar Porta e Conectar'}
              </button>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                {scaleConnected
                  ? 'Balança conectada — pronta para pesagem'
                  : 'Clique para selecionar a porta COM da balança'}
              </span>
            </div>
          </div>

          {/* Test Connection */}
          <div className="flex-col gap-3" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
            <div className="flex gap-4 items-center">
              <button
                className="btn btn-outline"
                style={{ padding: '12px 32px' }}
                onClick={handleTestConnection}
                disabled={!scaleConnected || isTesting}
              >
                {isTesting ? '⏳ Lendo peso...' : '🧪 Testar Conexão'}
              </button>

              {testResult && (
                <div style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: testResult.success ? 'rgba(25, 128, 56, 0.08)' : 'rgba(218, 30, 40, 0.08)',
                  color: testResult.success ? 'var(--success)' : 'var(--danger)',
                  fontWeight: '600',
                  fontSize: '1rem',
                  flex: 1,
                }}>
                  {testResult.message}
                </div>
              )}
            </div>

            {!scaleService.isSupported() && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(218, 30, 40, 0.08)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--danger)',
                fontSize: '0.95rem',
                fontWeight: '500',
              }}>
                ⚠️ Web Serial API não suportada neste navegador. Use <strong>Google Chrome</strong> ou <strong>Microsoft Edge</strong>.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end" style={{ marginTop: '32px', borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
         <button className="btn btn-primary" style={{ padding: '16px 48px', fontSize: '1.2rem', boxShadow: 'var(--shadow-md)' }} onClick={saveSettings}>
           💾 Salvar Configurações
         </button>
      </div>
    </div>
  );
}
