import { memo } from 'react';
import type { CartItem } from '../../../../shared/sales';
import {
  describeDiscount,
  formatCurrency,
  formatQuantity,
  getItemSubtotal,
  getItemTotal,
} from '../../../../shared/sales';

interface SaleCartPanelProps {
  cart: readonly CartItem[];
  selectedCartId: string | null;
  onEditItem: (item: CartItem) => void;
  onRemoveItem: (cartId: string) => void;
  onSelectItem: (cartId: string) => void;
}

function SaleCartPanelComponent({
  cart,
  selectedCartId,
  onEditItem,
  onRemoveItem,
  onSelectItem,
}: SaleCartPanelProps) {
  return (
    <div
      id="cart-table-container"
      className="flex-col"
      style={{
        flex: 1,
        overflowY: 'auto',
        backgroundColor: 'var(--surface-100)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
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
            padding: '64px',
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🛒</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '500' }}>Caixa livre</h3>
          <p>Passe o leitor de código de barras para iniciar</p>
        </div>
      ) : (
        <div className="flex-col gap-3 pos-cart-list">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr 120px 120px 140px 88px',
              gap: '16px',
              padding: '0 24px 8px 24px',
              color: 'var(--text-tertiary)',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              borderBottom: '1px solid var(--border-light)',
              marginBottom: '4px',
            }}
          >
            <div style={{ textAlign: 'center' }}>Nº</div>
            <div>Produto</div>
            <div style={{ textAlign: 'center' }}>QTD</div>
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
                  gridTemplateColumns: '40px 1fr 120px 120px 140px 88px',
                  gap: '16px',
                  alignItems: 'center',
                  padding: '16px 24px',
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
                  }}
                >
                  {String(index + 1).padStart(3, '0')}
                </div>

                <div className="flex-col">
                  <span
                    style={{
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {item.name}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
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
                    fontSize: '1.05rem',
                  }}
                >
                  {formatQuantity(item.quantity, item.unit)}
                </div>

                <div
                  style={{
                    textAlign: 'right',
                    color: 'var(--text-secondary)',
                    fontWeight: '500',
                    fontSize: '1.1rem',
                  }}
                >
                  R$ {formatCurrency(item.price)}
                </div>

                <div style={{ textAlign: 'right' }}>
                  {item.discount && (
                    <div
                      style={{
                        color: 'var(--text-tertiary)',
                        fontSize: '0.85rem',
                        textDecoration: 'line-through',
                      }}
                    >
                      R$ {formatCurrency(itemSubtotal)}
                    </div>
                  )}
                  <div
                    style={{
                      fontWeight: '900',
                      fontSize: '1.25rem',
                      color: 'var(--primary)',
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
                      fontSize: '1.15rem',
                      cursor: 'pointer',
                      padding: '8px',
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
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      padding: '8px',
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
