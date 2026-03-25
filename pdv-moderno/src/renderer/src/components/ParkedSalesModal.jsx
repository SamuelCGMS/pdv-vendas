import React, { useEffect } from 'react';
import { formatCurrency } from '../../../shared/sales';

export default function ParkedSalesModal({ sales, onResume, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
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
        style={{ width: '600px', padding: '32px', gap: '24px' }}
      >
        <div className="flex-col gap-2">
          <h2 style={{ color: 'var(--text-primary)', fontSize: '2rem' }}>Vendas em espera</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Clique em uma venda para retomar o atendimento.
          </p>
        </div>

        <div className="flex-col gap-4" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
          {sales.map((sale) => (
            <div
              key={sale.id}
              className="flex justify-between items-center card"
              style={{
                padding: '16px',
                backgroundColor: 'var(--surface-100)',
                cursor: 'pointer',
                border: '2px solid transparent',
                transition: '0.2s',
              }}
              role="button"
              tabIndex={0}
              onClick={() => onResume(sale)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onResume(sale);
                }
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '4px' }}>
                  Espera {sale.id}
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  {sale.cart.length} itens • {sale.time}
                </div>
                {sale.cpf && (
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', marginTop: '4px' }}>
                    CPF/CNPJ: {sale.cpf}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--success)', marginBottom: '8px' }}>
                  R$ {formatCurrency(sale.total)}
                </div>
                <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>
                  Retomar venda
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn btn-outline"
          style={{ width: '100%', padding: '16px' }}
          onClick={onClose}
        >
          Voltar [ESC]
        </button>
      </div>
    </div>
  );
}
