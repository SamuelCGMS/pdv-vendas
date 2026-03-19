import React, { useState, useEffect } from 'react';

export default function TefModal({ amount, method, onApproved, onCancel }) {
  const [status, setStatus] = useState('Iniciando comunicação...');

  useEffect(() => {
    let timeout1, timeout2, timeout3;
    
    timeout1 = setTimeout(() => setStatus('Aguardando inserção ou aproximação do cartão...'), 1500);
    timeout2 = setTimeout(() => setStatus('Processando transação com a adquirente...'), 4000);
    timeout3 = setTimeout(() => {
      setStatus('TRANSAÇÃO APROVADA');
      setTimeout(() => onApproved(), 2000);
    }, 6500);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [onApproved]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="flex-col card glass" style={{ width: '450px', padding: '48px', alignItems: 'center', border: '2px solid var(--primary)', boxShadow: '0 0 60px rgba(15, 98, 254, 0.2)' }}>
        
        {status !== 'TRANSAÇÃO APROVADA' ? (
          <div style={{ padding: '24px', backgroundColor: 'var(--surface-100)', borderRadius: '50%', marginBottom: '32px' }}>
            <div style={{ width: '48px', height: '48px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div style={{ padding: '24px', backgroundColor: 'rgba(25, 128, 56, 0.1)', borderRadius: '50%', marginBottom: '32px', color: 'var(--success)', fontSize: '4rem', lineHeight: 1 }}>
            ✓
          </div>
        )}

        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '2px' }}>
          PinPad {method}
        </h2>
        <h3 style={{ fontSize: '3rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '32px' }}>
          R$ {amount.toFixed(2).replace('.', ',')}
        </h3>

        <div style={{ backgroundColor: '#0a0a0a', color: status === 'TRANSAÇÃO APROVADA' ? '#0f0' : '#0fb', fontFamily: '"Courier New", Courier, monospace', padding: '24px', width: '100%', borderRadius: '12px', textAlign: 'center', fontSize: '1.2rem', letterSpacing: '1px', textTransform: 'uppercase', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)' }}>
          {status}
        </div>

        {status !== 'TRANSAÇÃO APROVADA' && (
          <button className="btn btn-outline" style={{ width: '100%', marginTop: '32px', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={onCancel}>
            ✘ Cancelar Operação [ESC]
          </button>
        )}
      </div>
    </div>
  );
}
