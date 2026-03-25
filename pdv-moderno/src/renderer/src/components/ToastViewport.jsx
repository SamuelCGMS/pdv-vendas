import React from 'react';

const toneLabels = {
  info: 'Info',
  success: 'Sucesso',
  warning: 'Atenção',
  danger: 'Erro',
};

export default function ToastViewport({ items, onDismiss }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="pos-toast-viewport" aria-live="polite" aria-atomic="true">
      {items.map((toast) => (
        <div key={toast.id} className={`pos-toast pos-toast-${toast.tone ?? 'info'}`}>
          <div className="flex-col gap-1" style={{ flex: 1 }}>
            <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              {toast.title ?? toneLabels[toast.tone] ?? toneLabels.info}
            </strong>
            {toast.message && (
              <span style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {toast.message}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="Fechar notificação"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '0 0 0 12px',
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
