import React, { useState } from 'react';
import { operators } from '../data/mock';

export default function CashierSelect({ onSelect, runtime }) {
  const [initialCash, setInitialCash] = useState('100.00');
  const footerLabel = runtime?.isElectron
    ? `Desktop ${runtime.version} • ${runtime.platform}`
    : 'Prévia local';

  return (
    <div className="flex-col items-center justify-center h-full w-full" style={{ padding: '2rem', backgroundImage: 'radial-gradient(circle at top right, var(--surface-300), var(--surface-200))' }}>
      <div className="card glass" style={{ padding: '3rem', width: '100%', maxWidth: '900px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--primary)', letterSpacing: '-0.02em' }}>
          Gravity.PDV
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.2rem' }}>
          Selecione o operador para efetuar a abertura do caixa
        </p>

        <div className="flex-col items-center" style={{ marginBottom: '3rem' }}>
          <label style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Fundo de Troco Inicial (R$)</label>
          <input 
            type="number" 
            value={initialCash} 
            onChange={e => setInitialCash(e.target.value)} 
            style={{ padding: '16px', fontSize: '1.5rem', textAlign: 'center', width: '200px', borderRadius: 'var(--radius-md)', border: '2px solid var(--border)', outline: 'none', backgroundColor: 'var(--surface-100)', color: 'var(--text-primary)', fontWeight: 'bold' }} 
            min="0"
            step="0.01"
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
          {operators.map(op => (
            <button 
              key={op.id}
              className="card flex-col items-center btn-outline"
              style={{ 
                padding: '32px 16px', 
                gap: '16px', 
                border: '1px solid var(--border)',
                background: 'var(--surface-100)'
              }}
              onClick={() => onSelect({ ...op, initialCash: parseFloat(initialCash) || 0 })}
            >
              <img 
                src={op.avatar} 
                alt={op.name} 
                style={{ 
                  width: '90px', 
                  height: '90px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--surface-200)',
                  border: '3px solid var(--border-light)'
                }} 
              />
              <div>
                <strong style={{ display: 'block', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {op.name}
                </strong>
                <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                  {op.role}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ position: 'absolute', bottom: '2rem', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
        {footerLabel} • {new Date().toLocaleDateString('pt-BR')}
      </div>
    </div>
  );
}
