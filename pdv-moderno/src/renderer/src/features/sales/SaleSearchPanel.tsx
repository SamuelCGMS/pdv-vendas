import { memo, type FocusEvent, type FormEvent, type RefObject } from 'react';
import type { CatalogProduct } from '../../../../shared/sales';
import { formatCurrency } from '../../../../shared/sales';
import type { SalesLayoutProfile } from './salesLayout.ts';

interface SaleSearchPanelProps {
  barcodeInput: string;
  highlightedProductIndex: number;
  filteredProducts: readonly CatalogProduct[];
  layout: SalesLayoutProfile;
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

function getProductPresentation(product: CatalogProduct) {
  const barcodes = product.barcodes?.filter(Boolean) ?? [];
  const primaryBarcode = barcodes[0] ?? product.id;
  const additionalBarcodes = Math.max(0, barcodes.length - 1);

  return {
    additionalBarcodes,
    categoryLabel: product.category?.trim() || 'Sem categoria',
    primaryBarcode,
    unitLabel: product.unit === 'kg' ? 'Pesável' : product.unit.toUpperCase(),
  };
}

function SaleSearchPanelComponent({
  barcodeInput,
  highlightedProductIndex,
  filteredProducts,
  layout,
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
  const areActionsWrapped = layout.searchActionsMode === 'wrapped';

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
    <div className="w-full" style={{ position: 'relative' }}>
      <form
        onSubmit={onBarcodeSubmit}
        className="flex w-full"
        style={{
          gap: '16px',
          flexWrap: areActionsWrapped ? 'wrap' : 'nowrap',
          alignItems: areActionsWrapped ? 'stretch' : 'center',
        }}
      >
        <div style={{ flex: '1 1 0%', minWidth: 0, position: 'relative' }}>
          <span
            aria-hidden="true"
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
            autoComplete="off"
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
          style={{
            padding: '0 40px',
            fontSize: '1.1rem',
            borderRadius: 'var(--radius-lg)',
            minHeight: '62px',
            flex: areActionsWrapped ? '1 1 220px' : '0 0 auto',
            whiteSpace: 'nowrap',
          }}
        >
          ✚ INSERIR [ENTER]
        </button>

        <div
          className={`scale-status-badge ${scaleConnected ? 'connected' : 'disconnected'}`}
          title={
            scaleConnected
              ? 'Balança conectada'
              : 'Balança desconectada - configure em Configurações'
          }
          style={areActionsWrapped ? { flex: '1 1 180px', justifyContent: 'center' } : undefined}
        >
          <span className="scale-status-dot" />
          ⚖️ {scaleConnected ? 'Balança' : 'Sem Balança'}
        </div>
      </form>

      {showDropdown && filteredProducts.length > 0 && (
        <div
          className="pos-search-dropdown"
          style={{ right: areActionsWrapped ? 0 : undefined }}
        >
          <div className="pos-search-dropdown-header">
            <span>
              {filteredProducts.length} resultado{filteredProducts.length > 1 ? 's' : ''}
            </span>
            <span>Enter para inserir</span>
          </div>

          {filteredProducts.map((product, index) => {
            const isHighlighted = index === highlightedProductIndex;
            const presentation = getProductPresentation(product);

            return (
              <button
                key={product.id}
                type="button"
                className={`pos-search-result ${isHighlighted ? 'highlighted' : ''}`}
                onMouseEnter={() => onHighlightProduct(index)}
                onClick={() => onSelectProduct(product, parsedQuantity)}
              >
                <div className="pos-search-result-main">
                  <div className="pos-search-result-title">{product.name}</div>

                  <div className="pos-search-result-meta">
                    <span className="pos-search-result-code">
                      Cód: {presentation.primaryBarcode}
                    </span>
                    <span className="pos-search-result-tag">
                      {presentation.categoryLabel}
                    </span>
                    <span
                      className={`pos-search-result-tag ${
                        product.unit === 'kg' ? 'weighed' : ''
                      }`}
                    >
                      {presentation.unitLabel}
                    </span>
                    {presentation.additionalBarcodes > 0 && (
                      <span className="pos-search-result-tag">
                        +{presentation.additionalBarcodes} código
                        {presentation.additionalBarcodes > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pos-search-result-price">
                  <span className="pos-search-result-price-value">
                    R$ {formatCurrency(product.price)}
                  </span>
                  <span className="pos-search-result-price-unit">por {product.unit}</span>
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
