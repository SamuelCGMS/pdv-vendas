import React, { useEffect } from 'react';

const toneStyles = {
  danger: {
    accent: 'var(--danger)',
    surface: 'rgba(218, 30, 40, 0.08)',
  },
  warning: {
    accent: 'var(--warning)',
    surface: 'rgba(241, 194, 27, 0.18)',
  },
  info: {
    accent: 'var(--primary)',
    surface: 'rgba(15, 98, 254, 0.08)',
  },
};

export default function ConfirmDialog({
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Voltar',
  tone = 'danger',
  onConfirm,
  onCancel,
}) {
  const appearance = toneStyles[tone] ?? toneStyles.info;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        onConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel, onConfirm]);

  return (
    <div className="pos-modal-overlay">
      <div
        className="pos-modal-card card glass flex-col"
        style={{ width: '520px', padding: '32px', gap: '24px' }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: appearance.surface,
            border: `2px solid ${appearance.accent}`,
            color: appearance.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
          }}
        >
          !
        </div>

        <div className="flex-col gap-3">
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>{title}</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{description}</p>
        </div>

        <div className="flex gap-4" style={{ marginTop: '8px' }}>
          <button
            className="btn btn-outline"
            style={{ flex: 1, padding: '16px' }}
            onClick={onCancel}
          >
            {cancelLabel} [ESC]
          </button>
          <button
            className="btn btn-danger"
            style={{ flex: 1, padding: '16px' }}
            onClick={onConfirm}
          >
            {confirmLabel} [ENTER]
          </button>
        </div>
      </div>
    </div>
  );
}
