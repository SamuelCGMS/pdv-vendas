import { memo, type FocusEvent, type FormEvent, type RefObject } from 'react';
import type { CatalogProduct } from '../../../../shared/sales';
import { formatCurrency } from '../../../../shared/sales';

interface SaleSearchPanelProps {
  barcodeInput: string;
  highlightedProductIndex: number;
  filteredProducts: readonly CatalogProduct[];
  parsedQuantity: number;
  scaleConnected: boolean;
  searchInputRef: RefObject<HTMLInputElement | null>;
  showDropdown: boolean;
  onBarcodeChange: (value: string) => void;
  onBarcodeSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCloseDropdown: () => void;
  onHighlightProduct: (index: number) => void;
  onOpenDropdown: () => void;
  onSelectProduct: (product: CatalogProduct, quantity: number) => void;
}

function SaleSearchPanelComponent({
  barcodeInput,
  highlightedProductIndex,
  filteredProducts,
  parsedQuantity,
  scaleConnected,
  searchInputRef,
  showDropdown,
  onBarcodeChange,
  onBarcodeSubmit,
  onCloseDropdown,
  onHighlightProduct,
  onOpenDropdown,
  onSelectProduct,
}: SaleSearchPanelProps) {
  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    event.currentTarget.style.borderColor = 'var(--primary)';
    event.currentTarget.style.boxShadow = '0 0 0 4px rgba(15, 98, 254, 0.1)';

    if (barcodeInput.length > 0) {
      onOpenDropdown();
    }
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    event.currentTarget.style.borderColor = 'var(--border)';
    event.currentTarget.style.boxShadow = 'none';
    window.setTimeout(onCloseDropdown, 180);
  };

  return (
    <div style={{ position: 'relative' }} className="w-full">
      <form onSubmit={onBarcodeSubmit} className="flex gap-4 w-full">
        <div style={{ flex: 1, position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '1.5rem',
              opacity: 0.5,
            }}
          >
            🔎
          </span>
          <input
            ref={searchInputRef}
            type="text"
            value={barcodeInput}
            onChange={(event) => onBarcodeChange(event.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Código de barras ou nome do produto..."
            style={{
              width: '100%',
              padding: '20px 20px 20px 60px',
              fontSize: '1.2rem',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--border)',
              outline: 'none',
              transition: 'border-color 0.3s, box-shadow 0.3s',
              backgroundColor: 'var(--surface-100)',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ padding: '0 40px', fontSize: '1.1rem', borderRadius: 'var(--radius-lg)' }}
        >
          ✚ INSERIR [ENTER]
        </button>

        <div
          className={`scale-status-badge ${scaleConnected ? 'connected' : 'disconnected'}`}
          title={
            scaleConnected
              ? 'Balança conectada'
              : 'Balança desconectada — configure em Configurações'
          }
        >
          <span className="scale-status-dot" />
          ⚖️ {scaleConnected ? 'Balança' : 'Sem Balança'}
        </div>
      </form>

      {showDropdown && filteredProducts.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: '230px',
            backgroundColor: 'var(--surface-100)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 20,
            maxHeight: '300px',
            overflowY: 'auto',
            marginTop: '8px',
          }}
        >
          {filteredProducts.map((product, index) => {
            const isHighlighted = index === highlightedProductIndex;

            return (
              <button
                key={product.id}
                type="button"
                className="flex justify-between items-center"
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  borderBottom: '1px solid var(--border-light)',
                  cursor: 'pointer',
                  transition: 'background-color 0.1s',
                  backgroundColor: isHighlighted ? 'var(--surface-200)' : 'transparent',
                }}
                onMouseEnter={() => onHighlightProduct(index)}
                onClick={() => onSelectProduct(product, parsedQuantity)}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {product.name}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>
                    Cód: {product.id}
                  </div>
                </div>
                <div
                  style={{
                    fontWeight: 'bold',
                    color: 'var(--primary)',
                    fontSize: '1.2rem',
                  }}
                >
                  R$ {formatCurrency(product.price)}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default memo(SaleSearchPanelComponent);
