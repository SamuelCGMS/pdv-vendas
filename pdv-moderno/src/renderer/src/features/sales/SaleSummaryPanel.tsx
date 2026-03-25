import { memo } from 'react';
import type { SaleSummary } from '../../../../shared/sales';
import { formatCurrency } from '../../../../shared/sales';

interface SaleSummaryPanelProps {
  customerCpf: string;
  hasCartItems: boolean;
  hasSelectedCartItem: boolean;
  parkedSalesCount: number;
  summary: SaleSummary;
  onConfirmCancelSale: () => void;
  onOpenCpf: () => void;
  onOpenParkedSales: () => void;
  onOpenPayment: () => void;
  onOpenSaleDiscount: () => void;
  onOpenSelectedItemEditor: () => void;
  onOpenShortcuts: () => void;
  onParkCurrentSale: () => void;
}

function SaleSummaryPanelComponent({
  customerCpf,
  hasCartItems,
  hasSelectedCartItem,
  parkedSalesCount,
  summary,
  onConfirmCancelSale,
  onOpenCpf,
  onOpenParkedSales,
  onOpenPayment,
  onOpenSaleDiscount,
  onOpenSelectedItemEditor,
  onOpenShortcuts,
  onParkCurrentSale,
}: SaleSummaryPanelProps) {
  return (
    <div
      className="flex-col card glass"
      style={{
        width: '480px',
        minWidth: '480px',
        padding: '32px 24px',
        backgroundColor: 'var(--surface-100)',
        justifyContent: 'space-between',
        borderTop: '8px solid var(--primary)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <div className="flex-col gap-6">
        <h2
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontWeight: '600',
            borderBottom: '2px solid var(--border-light)',
            paddingBottom: '16px',
            margin: 0,
          }}
        >
          Resumo da venda
        </h2>

        <div className="flex-col gap-3">
          <div
            className="flex justify-between items-end"
            style={{ borderBottom: '1px dashed var(--border-light)', paddingBottom: '12px' }}
          >
            <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Itens</span>
            <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              {summary.itemCount}
            </span>
          </div>
          <div
            className="flex justify-between items-end"
            style={{ borderBottom: '1px dashed var(--border-light)', paddingBottom: '12px' }}
          >
            <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Subtotal</span>
            <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              R$ {formatCurrency(summary.subtotal)}
            </span>
          </div>
          <div
            className="flex justify-between items-end"
            style={{ borderBottom: '1px dashed var(--border-light)', paddingBottom: '12px' }}
          >
            <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Desc. itens</span>
            <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--danger)' }}>
              R$ {formatCurrency(summary.itemDiscountTotal)}
            </span>
          </div>
          <div
            className="flex justify-between items-end"
            style={{ borderBottom: '1px dashed var(--border-light)', paddingBottom: '12px' }}
          >
            <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Desc. venda</span>
            <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--danger)' }}>
              R$ {formatCurrency(summary.saleDiscountTotal)}
            </span>
          </div>
          <div
            className="flex justify-between items-end"
            style={{ borderBottom: '1px dashed var(--border-light)', paddingBottom: '12px' }}
          >
            <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Descontos</span>
            <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--danger)' }}>
              R$ {formatCurrency(summary.totalDiscount)}
            </span>
          </div>
        </div>

        <div
          className="flex-col items-center justify-center"
          style={{
            marginTop: '16px',
            padding: '32px 0',
            backgroundColor: 'var(--surface-200)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          <span
            style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
              letterSpacing: '1px',
            }}
          >
            TOTAL A PAGAR
          </span>
          <span
            style={{
              fontSize: '3.5rem',
              fontWeight: '900',
              color: 'var(--success)',
              lineHeight: 1,
              letterSpacing: '-2px',
            }}
          >
            <span
              style={{
                fontSize: '1.5rem',
                marginRight: '8px',
                opacity: 0.8,
                fontWeight: '600',
              }}
            >
              R$
            </span>
            {formatCurrency(summary.total)}
          </span>
        </div>

        <div className="flex-col gap-3">
          <div className="flex gap-4">
            <button
              className="btn btn-outline"
              style={{ flex: 1, padding: '14px' }}
              disabled={!hasSelectedCartItem}
              onClick={onOpenSelectedItemEditor}
            >
              Editar Item [F3]
            </button>
            <button
              className="btn btn-outline"
              style={{ flex: 1, padding: '14px' }}
              disabled={!hasCartItems}
              onClick={onOpenSaleDiscount}
            >
              Desconto [F7]
            </button>
          </div>
          <button
            className="btn btn-outline"
            style={{ width: '100%', padding: '14px' }}
            onClick={onOpenShortcuts}
          >
            Ver atalhos [F6]
          </button>
        </div>
      </div>

      <div className="flex-col gap-4" style={{ marginBottom: '16px' }}>
        <div className="flex gap-4">
          {parkedSalesCount > 0 && (
            <button
              className="btn btn-warning flex justify-between items-center"
              style={{ flex: 1, padding: '16px', borderRadius: 'var(--radius-md)', fontWeight: 'bold' }}
              onClick={onOpenParkedSales}
            >
              <span>Espera ({parkedSalesCount})</span>
              <span
                style={{
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                }}
              >
                [F5]
              </span>
            </button>
          )}
          <button
            className="btn btn-outline flex justify-between items-center"
            style={{ flex: 1, padding: '16px', borderRadius: 'var(--radius-md)' }}
            disabled={!hasCartItems}
            onClick={onParkCurrentSale}
          >
            <span>Estacionar</span>
            <span
              style={{
                backgroundColor: 'rgba(0,0,0,0.1)',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.8rem',
              }}
            >
              [F4]
            </span>
          </button>
        </div>
      </div>

      <div className="flex-col gap-4">
        <button
          className="btn btn-success flex justify-between items-center"
          style={{
            width: '100%',
            fontSize: '1.3rem',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            fontWeight: 'bold',
            boxShadow: '0 8px 16px rgba(36, 161, 72, 0.2)',
          }}
          disabled={!hasCartItems}
          onClick={onOpenPayment}
        >
          <span>RECEBER PAGAMENTO</span>
          <span
            style={{
              backgroundColor: 'rgba(0,0,0,0.2)',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.9rem',
            }}
          >
            [F9]
          </span>
        </button>
        <div className="flex gap-4">
          <button
            className="btn btn-primary flex justify-between items-center"
            style={{ flex: 1, padding: '16px', borderRadius: 'var(--radius-md)' }}
            onClick={onOpenCpf}
          >
            <span>{customerCpf ? 'CPF ✓' : 'Cpf na Nota'}</span>
            <span
              style={{
                backgroundColor: 'rgba(0,0,0,0.2)',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.8rem',
              }}
            >
              [F2]
            </span>
          </button>
          <button
            className="btn btn-danger flex justify-between items-center"
            style={{ flex: 1, padding: '16px', borderRadius: 'var(--radius-md)' }}
            onClick={onConfirmCancelSale}
            disabled={!hasCartItems}
          >
            <span>Cancelar Compra</span>
            <span
              style={{
                backgroundColor: 'rgba(0,0,0,0.2)',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.8rem',
              }}
            >
              [ESC]
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(SaleSummaryPanelComponent);
