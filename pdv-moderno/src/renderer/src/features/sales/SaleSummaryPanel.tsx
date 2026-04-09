import { memo } from 'react';
import type { SaleSummary } from '../../../../shared/sales';
import { formatCurrency } from '../../../../shared/sales';
import type { SalesLayoutProfile } from './salesLayout.ts';

interface SaleSummaryPanelProps {
  customerCpf: string;
  hasCartItems: boolean;
  hasSelectedCartItem: boolean;
  layout: SalesLayoutProfile;
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
  layout,
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
  const isCompact = layout.density === 'compact';
  const isStacked = layout.workspaceMode === 'stacked';
  const shouldWrapActions = isCompact || layout.summaryWidth < 420;

  return (
    <div
      className="flex-col card glass"
      style={{
        width: isStacked ? '100%' : `${layout.summaryWidth}px`,
        minWidth: isStacked ? 0 : `${layout.summaryWidth}px`,
        padding: isCompact ? '24px 18px' : '32px 24px',
        backgroundColor: 'var(--surface-100)',
        justifyContent: 'space-between',
        borderTop: '8px solid var(--primary)',
        boxShadow: 'var(--shadow-lg)',
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      <div className="flex-col gap-6">
        <h2
          style={{
            color: 'var(--text-secondary)',
            fontSize: isCompact ? '1rem' : '1.1rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontWeight: '600',
            borderBottom: '2px solid var(--border-light)',
            paddingBottom: isCompact ? '12px' : '16px',
            margin: 0,
          }}
        >
          Resumo da venda
        </h2>

        <div className="flex-col gap-3">
          <div
            className="flex justify-between items-end"
            style={{ borderBottom: '1px dashed var(--border-light)', paddingBottom: isCompact ? '10px' : '12px' }}
          >
            <span style={{ fontSize: isCompact ? '1rem' : '1.1rem', color: 'var(--text-secondary)' }}>Itens</span>
            <span style={{ fontSize: isCompact ? '1.05rem' : '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              {summary.itemCount}
            </span>
          </div>
          <div
            className="flex justify-between items-end"
            style={{ borderBottom: '1px dashed var(--border-light)', paddingBottom: isCompact ? '10px' : '12px' }}
          >
            <span style={{ fontSize: isCompact ? '1rem' : '1.1rem', color: 'var(--text-secondary)' }}>Subtotal</span>
            <span
              style={{
                fontSize: isCompact ? '1.05rem' : '1.2rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
              }}
            >
              R$ {formatCurrency(summary.subtotal)}
            </span>
          </div>
          <div
            className="flex justify-between items-end"
            style={{ borderBottom: '1px dashed var(--border-light)', paddingBottom: isCompact ? '10px' : '12px' }}
          >
            <span style={{ fontSize: isCompact ? '1rem' : '1.1rem', color: 'var(--text-secondary)' }}>Desc. itens</span>
            <span
              style={{
                fontSize: isCompact ? '1.05rem' : '1.2rem',
                fontWeight: '600',
                color: 'var(--danger)',
                whiteSpace: 'nowrap',
              }}
            >
              R$ {formatCurrency(summary.itemDiscountTotal)}
            </span>
          </div>
          <div
            className="flex justify-between items-end"
            style={{ borderBottom: '1px dashed var(--border-light)', paddingBottom: isCompact ? '10px' : '12px' }}
          >
            <span style={{ fontSize: isCompact ? '1rem' : '1.1rem', color: 'var(--text-secondary)' }}>Desc. venda</span>
            <span
              style={{
                fontSize: isCompact ? '1.05rem' : '1.2rem',
                fontWeight: '600',
                color: 'var(--danger)',
                whiteSpace: 'nowrap',
              }}
            >
              R$ {formatCurrency(summary.saleDiscountTotal)}
            </span>
          </div>
          <div
            className="flex justify-between items-end"
            style={{ borderBottom: '1px dashed var(--border-light)', paddingBottom: isCompact ? '10px' : '12px' }}
          >
            <span style={{ fontSize: isCompact ? '1rem' : '1.1rem', color: 'var(--text-secondary)' }}>Descontos</span>
            <span
              style={{
                fontSize: isCompact ? '1.05rem' : '1.2rem',
                fontWeight: '700',
                color: 'var(--danger)',
                whiteSpace: 'nowrap',
              }}
            >
              R$ {formatCurrency(summary.totalDiscount)}
            </span>
          </div>
        </div>

        <div
          className="flex-col items-center justify-center"
          style={{
            marginTop: isCompact ? '12px' : '16px',
            padding: isCompact ? '22px 0' : '32px 0',
            backgroundColor: 'var(--surface-200)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          <span
            style={{
              fontSize: isCompact ? '1rem' : '1.1rem',
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
              fontSize: isCompact ? '3rem' : '3.5rem',
              fontWeight: '900',
              color: 'var(--success)',
              lineHeight: 1,
              letterSpacing: '-2px',
            }}
          >
            <span
              style={{
                fontSize: isCompact ? '1.35rem' : '1.5rem',
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
          <div
            className="flex"
            style={{ gap: isCompact ? '12px' : '16px', flexWrap: shouldWrapActions ? 'wrap' : 'nowrap' }}
          >
            <button
              className="btn btn-outline"
              style={{ flex: shouldWrapActions ? '1 1 160px' : 1, padding: isCompact ? '12px' : '14px' }}
              disabled={!hasSelectedCartItem}
              onClick={onOpenSelectedItemEditor}
            >
              Editar Item [F3]
            </button>
            <button
              className="btn btn-outline"
              style={{ flex: shouldWrapActions ? '1 1 160px' : 1, padding: isCompact ? '12px' : '14px' }}
              disabled={!hasCartItems}
              onClick={onOpenSaleDiscount}
            >
              Desconto [F7]
            </button>
          </div>
          <button
            className="btn btn-outline"
            style={{ width: '100%', padding: isCompact ? '12px' : '14px' }}
            onClick={onOpenShortcuts}
          >
            Ver atalhos [F6]
          </button>
        </div>
      </div>

      <div className="flex-col gap-4" style={{ marginBottom: isCompact ? '8px' : '16px' }}>
        <div
          className="flex"
          style={{ gap: isCompact ? '12px' : '16px', flexWrap: shouldWrapActions ? 'wrap' : 'nowrap' }}
        >
          {parkedSalesCount > 0 && (
            <button
              className="btn btn-warning flex justify-between items-center"
              style={{
                flex: shouldWrapActions ? '1 1 180px' : 1,
                padding: isCompact ? '14px' : '16px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 'bold',
              }}
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
            style={{
              flex: shouldWrapActions ? '1 1 180px' : 1,
              padding: isCompact ? '14px' : '16px',
              borderRadius: 'var(--radius-md)',
            }}
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
            fontSize: isCompact ? '1.1rem' : '1.3rem',
            padding: isCompact ? '18px' : '24px',
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
              fontSize: isCompact ? '0.8rem' : '0.9rem',
            }}
          >
            [F9]
          </span>
        </button>
        <div
          className="flex"
          style={{ gap: isCompact ? '12px' : '16px', flexWrap: shouldWrapActions ? 'wrap' : 'nowrap' }}
        >
          <button
            className="btn btn-primary flex justify-between items-center"
            style={{
              flex: shouldWrapActions ? '1 1 180px' : 1,
              minWidth: 0,
              padding: isCompact ? '14px' : '16px',
              borderRadius: 'var(--radius-md)',
            }}
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
            style={{
              flex: shouldWrapActions ? '1 1 180px' : 1,
              minWidth: 0,
              padding: isCompact ? '14px' : '16px',
              borderRadius: 'var(--radius-md)',
            }}
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
