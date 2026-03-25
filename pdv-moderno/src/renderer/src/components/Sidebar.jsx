import React from 'react';

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const getTabStyle = (tabId) => ({
    padding: '24px 16px',
    cursor: 'pointer',
    textAlign: 'center',
    fontWeight: 'bold',
    borderLeft: activeTab === tabId ? '4px solid var(--primary)' : '4px solid transparent',
    backgroundColor: activeTab === tabId ? 'var(--surface-200)' : 'transparent',
    color: activeTab === tabId ? 'var(--primary)' : 'var(--text-secondary)',
    transition: 'all 0.2s',
  });

  return (
    <div className="flex-col justify-between" style={{ 
      width: '100px', 
      height: '100vh', 
      backgroundColor: 'var(--surface-100)',
      borderRight: '1px solid var(--border)'
    }}>
      <div className="flex-col">
        <div style={{ padding: '24px 0', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
          <h1 style={{ color: 'var(--primary)', fontSize: '2rem', margin: 0, lineHeight: 1, letterSpacing: '-2px' }}>G.</h1>
        </div>
        
        <div 
          onClick={() => setActiveTab('vendas')}
          style={getTabStyle('vendas')}
          onMouseEnter={(e) => { if (activeTab !== 'vendas') e.currentTarget.style.backgroundColor = 'var(--surface-200)'; }}
          onMouseLeave={(e) => { if (activeTab !== 'vendas') e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🛒</div>
          <div style={{ fontSize: '0.8rem' }}>Vendas</div>
        </div>

        <div 
          onClick={() => setActiveTab('caixa')}
          style={getTabStyle('caixa')}
          onMouseEnter={(e) => { if (activeTab !== 'caixa') e.currentTarget.style.backgroundColor = 'var(--surface-200)'; }}
          onMouseLeave={(e) => { if (activeTab !== 'caixa') e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>💰</div>
          <div style={{ fontSize: '0.8rem' }}>Caixa</div>
        </div>

        <div  
          onClick={() => setActiveTab('catalogo')}
          style={getTabStyle('catalogo')}
          onMouseEnter={(e) => { if (activeTab !== 'catalogo') e.currentTarget.style.backgroundColor = 'var(--surface-200)'; }}
          onMouseLeave={(e) => { if (activeTab !== 'catalogo') e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📦</div>
          <div style={{ fontSize: '0.8rem' }}>Estoque</div>
        </div>

        <div 
          onClick={() => setActiveTab('relatorios')}
          style={getTabStyle('relatorios')}
          onMouseEnter={(e) => { if (activeTab !== 'relatorios') e.currentTarget.style.backgroundColor = 'var(--surface-200)'; }}
          onMouseLeave={(e) => { if (activeTab !== 'relatorios') e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📊</div>
          <div style={{ fontSize: '0.8rem' }}>Resumo</div>
        </div>

        <div 
          onClick={() => setActiveTab('historico')}
          style={getTabStyle('historico')}
          onMouseEnter={(e) => { if (activeTab !== 'historico') e.currentTarget.style.backgroundColor = 'var(--surface-200)'; }}
          onMouseLeave={(e) => { if (activeTab !== 'historico') e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📈</div>
          <div style={{ fontSize: '0.8rem' }}>Relatórios</div>
        </div>

        <div 
          onClick={() => setActiveTab('configuracoes')}
          style={getTabStyle('configuracoes')}
          onMouseEnter={(e) => { if (activeTab !== 'configuracoes') e.currentTarget.style.backgroundColor = 'var(--surface-200)'; }}
          onMouseLeave={(e) => { if (activeTab !== 'configuracoes') e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⚙️</div>
          <div style={{ fontSize: '0.8rem' }}>Ajustes</div>
        </div>
      </div>

      <div 
        onClick={onLogout}
        style={{ padding: '32px 16px', cursor: 'pointer', textAlign: 'center', color: 'var(--danger)', borderTop: '1px solid var(--border)', transition: '0.2s' }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--danger)'; e.currentTarget.style.color = 'white'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--danger)'; }}
      >
        <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🚪</div>
        <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Sair</div>
      </div>
    </div>
  );
}
