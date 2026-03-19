import React, { useState } from 'react';

export default function Settings() {
  const [storeName, setStoreName] = useState('Supermercado Gravity LTDA');
  const [cnpj, setCnpj] = useState('00.000.000/0001-00');
  const [address, setAddress] = useState('Avenida React, 1024 - Web');
  const [primaryColor, setPrimaryColor] = useState('#0f62fe'); // Padrão
  const [defaultMargin, setDefaultMargin] = useState('35');

  const saveSettings = () => {
    // Injeção de CSS dinâmico no :root do sistema inteiro de forma performática
    document.documentElement.style.setProperty('--primary', primaryColor);
    
    // Feedback visual
    alert('✅ Configurações salvas provisoriamente em sessão!\n(Esta mudança afeta toda a interface do sistema).');
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
    boxSizing: 'border-box'
  };

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
             <label style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>Razão Social / Nome Fantasia</label>
             <input type="text" style={inputStyle} value={storeName} onChange={e => setStoreName(e.target.value)} />
           </div>

           <div className="flex-col gap-2">
             <label style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>CNPJ Emissor da Nota</label>
             <input type="text" style={inputStyle} value={cnpj} onChange={e => setCnpj(e.target.value)} />
           </div>

           <div className="flex-col gap-2">
             <label style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>Endereço Padrão do Cupom</label>
             <input type="text" style={inputStyle} value={address} onChange={e => setAddress(e.target.value)} />
           </div>
        </div>

        {/* Painel: Preferências do Sistema */}
        <div className="card glass flex-col" style={{ padding: '32px', gap: '24px' }}>
           <h2 style={{ color: 'var(--primary)', fontSize: '1.5rem', marginBottom: '8px' }}>🖌️ Preferências Visuais e Contábeis</h2>
           
           <div className="flex-col gap-2">
             <label style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>Cor da Marca (Substitui o Azul Global)</label>
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
             <label style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>Margem de Lucro Padrão Global (%)</label>
             <div className="flex items-center gap-4">
               <input type="number" style={{...inputStyle, width: '120px'}} value={defaultMargin} onChange={e => setDefaultMargin(e.target.value)} />
               <span style={{ color: 'var(--text-tertiary)' }}>Aplicada auto para novos produtos cadastrados</span>
             </div>
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
