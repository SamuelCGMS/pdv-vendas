import React, { useState, useEffect, useCallback } from 'react';

export default function CpfModal({ currentCpf, onConfirm, onCancel }) {
  const [cpf, setCpf] = useState(currentCpf || '');

  const handleKeyPress = useCallback((key) => {
    if (key === 'C') {
      setCpf('');
    } else if (key === 'B') {
      setCpf((previous) => previous.slice(0, -1));
    } else if (cpf.length < 14) {
      let newCpf = cpf.replace(/\D/g, '') + key;
      if (newCpf.length > 11) newCpf = newCpf.substring(0, 11);

      let formatted = newCpf;
      if (newCpf.length > 9) {
        formatted = newCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
      } else if (newCpf.length > 6) {
        formatted = newCpf.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
      } else if (newCpf.length > 3) {
        formatted = newCpf.replace(/(\d{3})(\d{1,3})/, '$1.$2');
      }
      setCpf(formatted);
    }
  }, [cpf]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCancel();
      if (event.key === 'Enter') onConfirm(cpf);
      if (/\d/.test(event.key)) handleKeyPress(event.key);
      if (event.key === 'Backspace') handleKeyPress('B');
      if (event.key === 'Delete') handleKeyPress('C');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cpf, onConfirm, onCancel, handleKeyPress]);

  const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', 'C', '0', 'B'];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 3000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="flex-col card glass"
        style={{
          width: 'min(400px, calc(100vw - 32px))',
          maxHeight: 'calc(100vh - 32px)',
          overflowY: 'auto',
          padding: '40px',
          gap: '32px',
          alignItems: 'center',
          border: '1px solid var(--border-focus)',
        }}
      >
        <h2 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 'bold' }}>CPF na Nota</h2>

        <input
          type="text"
          value={cpf}
          readOnly
          placeholder="000.000.000-00"
          style={{
            width: '100%',
            padding: '24px 16px',
            fontSize: '2.5rem',
            textAlign: 'center',
            fontWeight: 'bold',
            borderRadius: 'var(--radius-md)',
            border: '3px solid var(--border)',
            outline: 'none',
            letterSpacing: '2px',
            backgroundColor: 'var(--surface-100)',
            color: 'var(--text-primary)',
          }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', width: '100%' }}>
          {keys.map((key) => (
            <button
              key={key}
              className={`btn ${key === 'C' ? 'btn-danger' : (key === 'B' ? 'btn-outline' : '')}`}
              style={{
                padding: '24px 0',
                fontSize: '2rem',
                fontWeight: 'bold',
                background: (key !== 'C' && key !== 'B') ? 'var(--surface-100)' : undefined,
                color: (key !== 'C' && key !== 'B') ? 'var(--text-primary)' : undefined,
                border: '1px solid var(--border)',
              }}
              onClick={() => handleKeyPress(key)}
            >
              {key === 'B' ? '⌫' : key}
            </button>
          ))}
        </div>

        <div className="flex gap-4 w-full" style={{ marginTop: '16px' }}>
          <button className="btn btn-outline" style={{ flex: 1, padding: '16px' }} onClick={onCancel}>Cancelar [ESC]</button>
          <button className="btn btn-success" style={{ flex: 1, padding: '16px' }} onClick={() => onConfirm(cpf)}>Confirmar [ENTER]</button>
        </div>
      </div>
    </div>
  );
}
