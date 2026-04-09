import React, { useEffect } from 'react';

export default function ShortcutHelpModal({ shortcuts, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' || event.key === 'F1' || event.key === 'F6') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="pos-modal-overlay">
      <div
        className="pos-modal-card card glass flex-col"
        style={{ width: 'min(720px, calc(100vw - 32px))', maxHeight: '80vh', padding: '32px', gap: '24px' }}
      >
        <div className="flex justify-between items-center">
          <div className="flex-col gap-2">
            <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Atalhos do PDV</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Este mapa de teclas pode ser ajustado depois para bater com o sistema de referência.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '1.6rem',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        <div
          className="flex-col gap-3"
          style={{ overflowY: 'auto', paddingRight: '8px' }}
        >
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.keys}
              className="card"
              style={{
                padding: '16px 20px',
                display: 'grid',
                gridTemplateColumns: '180px 180px 1fr',
                gap: '16px',
                alignItems: 'center',
                backgroundColor: 'var(--surface-100)',
              }}
            >
              <span className="shortcut-key">{shortcut.keys}</span>
              <strong style={{ color: 'var(--text-primary)' }}>{shortcut.label}</strong>
              <span style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {shortcut.description}
              </span>
            </div>
          ))}
        </div>

        <button
          className="btn btn-outline"
          style={{ width: '100%', padding: '16px' }}
          onClick={onClose}
        >
          Fechar [ESC]
        </button>
      </div>
    </div>
  );
}
