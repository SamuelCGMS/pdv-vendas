import { memo } from 'react';
import type { CartItem } from '../../../../shared/sales';
import {
  describeDiscount,
  formatCurrency,
  formatQuantity,
  getItemSubtotal,
  getItemTotal,
} from '../../../../shared/sales';
import type { SalesLayoutProfile } from './salesLayout.ts';

interface SaleCartPanelProps {
  cart: readonly CartItem[];
  layout: SalesLayoutProfile;
  selectedCartId: string | null;
  onEditItem: (item: CartItem) => void;
  onRemoveItem: (cartId: string) => void;
  onSelectItem: (cartId: string) => void;
}

function SaleCartPanelComponent({
  cart,
  layout,
  selectedCartId,
  onEditItem,
  onRemoveItem,
  onSelectItem,
}: SaleCartPanelProps) {
  const isCompact = layout.cartDensity === 'compact';

  return (
    <div
      id="cart-table-container"
      className="flex-col"
      style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        backgroundColor: 'var(--surface-100)',
        borderRadius: 'var(--radius-lg)',
        padding: isCompact ? '14px' : '16px',
        border: '1px solid var(--border-light)',
        scrollBehavior: 'smooth',
      }}
    >
      {cart.length === 0 ? (
        <div
          className="flex-col items-center justify-center"
          style={{
            height: '100%',
            color: 'var(--text-tertiary)',
            opacity: 0.7,
            padding: isCompact ? '40px 24px' : '64px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: isCompact ? '3.2rem' : '4rem', marginBottom: '16px' }}>🛒</div>
          <h3 style={{ fontSize: isCompact ? '1.35rem' : '1.5rem', fontWeight: '500' }}>Caixa livre</h3>
          <p>Passe o leitor de código de barras para iniciar</p>
        </div>
      ) : (
        <div className="flex-col gap-3 pos-cart-list">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: layout.cartColumns,
              gap: `${layout.cartColumnGap}px`,
              padding: `0 ${layout.cartRowPaddingX}px 8px ${layout.cartRowPaddingX}px`,
              color: 'var(--text-tertiary)',
              fontWeight: 'bold',
              fontSize: isCompact ? '0.76rem' : '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              borderBottom: '1px solid var(--border-light)',
              marginBottom: '4px',
            }}
          >
            <div style={{ textAlign: 'center' }}>Nº</div>
            <div>Produto</div>
            <div style={{ textAlign: 'center' }}>Qtd</div>
            <div style={{ textAlign: 'right' }}>V. Unit</div>
            <div style={{ textAlign: 'right' }}>Total</div>
            <div style={{ textAlign: 'center' }}>Ações</div>
          </div>

          {cart.map((item, index) => {
            const itemSubtotal = getItemSubtotal(item);
            const itemTotal = getItemTotal(item);
            const isSelected = item.cartId === selectedCartId;

            return (
              <div
                key={item.cartId}
                className={`pos-cart-row ${isSelected ? 'selected' : ''}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: layout.cartColumns,
                  gap: `${layout.cartColumnGap}px`,
                  alignItems: 'center',
                  padding: isCompact
                    ? `14px ${layout.cartRowPaddingX}px`
                    : `16px ${layout.cartRowPaddingX}px`,
                  backgroundColor: 'var(--surface-200)',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '4px solid var(--primary)',
                }}
                role="button"
                tabIndex={0}
                onClick={() => onSelectItem(item.cartId)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    onSelectItem(item.cartId);
                    onEditItem(item);
                  }

                  if (event.key === ' ') {
                    event.preventDefault();
                    onSelectItem(item.cartId);
                  }
                }}
                onDoubleClick={() => {
                  onSelectItem(item.cartId);
                  onEditItem(item);
                }}
              >
                <div
                  style={{
                    fontWeight: 'bold',
                    color: 'var(--text-tertiary)',
                    textAlign: 'center',
                    fontSize: isCompact ? '0.88rem' : undefined,
                  }}
                >
                  {String(index + 1).padStart(3, '0')}
                </div>

                <div className="flex-col" style={{ minWidth: 0 }}>
                  <span
                    style={{
                      fontWeight: 'bold',
                      fontSize: isCompact ? '0.98rem' : '1.1rem',
                      color: 'var(--text-primary)',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {item.name}
                  </span>
                  <span style={{ fontSize: isCompact ? '0.78rem' : '0.85rem', color: 'var(--text-secondary)' }}>
                    Cód: {item.id}
                  </span>
                  {item.discount && (
                    <span className="pos-item-note">
                      Desconto: {describeDiscount(item.discount)}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                    textAlign: 'center',
                    fontSize: isCompact ? '0.94rem' : '1.05rem',
                  }}
                >
                  {formatQuantity(item.quantity, item.unit)}
                </div>

                <div
                  style={{
                    textAlign: 'right',
                    color: 'var(--text-secondary)',
                    fontWeight: '500',
                    fontSize: isCompact ? '0.96rem' : '1.1rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  R$ {formatCurrency(item.price)}
                </div>

                <div style={{ textAlign: 'right', minWidth: 0 }}>
                  {item.discount && (
                    <div
                      style={{
                        color: 'var(--text-tertiary)',
                        fontSize: isCompact ? '0.74rem' : '0.85rem',
                        textDecoration: 'line-through',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      R$ {formatCurrency(itemSubtotal)}
                    </div>
                  )}
                  <div
                    style={{
                      fontWeight: '900',
                      fontSize: isCompact ? '1.05rem' : '1.25rem',
                      color: 'var(--primary)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    R$ {formatCurrency(itemTotal)}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelectItem(item.cartId);
                      onEditItem(item);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: isCompact ? '1rem' : '1.15rem',
                      cursor: 'pointer',
                      padding: isCompact ? '6px' : '8px',
                      borderRadius: '50%',
                    }}
                    aria-label="Editar item"
                    title="Editar item [F3]"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onRemoveItem(item.cartId);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--danger)',
                      fontSize: isCompact ? '1.02rem' : '1.2rem',
                      cursor: 'pointer',
                      padding: isCompact ? '6px' : '8px',
                      borderRadius: '50%',
                    }}
                    aria-label="Remover item"
                    title="Excluir item"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default memo(SaleCartPanelComponent);
