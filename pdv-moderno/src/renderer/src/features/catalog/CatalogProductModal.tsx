import type { CSSProperties } from 'react';
import type { ProductFormDraft } from './types.ts';
import { CATALOG_UNITS } from './types.ts';

type ProductFieldChange = <K extends keyof ProductFormDraft>(
  field: K,
  value: ProductFormDraft[K],
) => void;

interface CatalogProductModalProps {
  draft: ProductFormDraft;
  isOpen: boolean;
  onChange: ProductFieldChange;
  onClose: () => void;
  onSave: () => void;
}

const labelStyle = {
  color: 'var(--text-secondary)',
  fontWeight: 700,
  marginBottom: '8px',
  fontSize: '0.95rem',
} satisfies CSSProperties;

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border)',
  backgroundColor: 'var(--surface-100)',
  color: 'var(--text-primary)',
  fontSize: '1rem',
  outline: 'none',
} satisfies CSSProperties;

const segmentStyle = {
  flex: 1,
  padding: '12px 16px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border)',
  backgroundColor: 'var(--surface-100)',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  fontWeight: 700,
} satisfies CSSProperties;

export default function CatalogProductModal({
  draft,
  isOpen,
  onChange,
  onClose,
  onSave,
}: CatalogProductModalProps) {
  if (!isOpen) {
    return null;
  }

  const isEditing = Boolean(draft.productId);

  return (
    <div className="pos-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="card pos-modal-card flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="catalog-product-modal-title"
        onClick={(event) => event.stopPropagation()}
        style={{
          width: 'min(920px, 100%)',
          maxHeight: 'calc(100vh - 48px)',
          overflowY: 'auto',
          padding: '32px',
          gap: '24px',
        }}
      >
        <div className="flex justify-between items-start gap-4">
          <div>
            <h2 id="catalog-product-modal-title" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
              {isEditing ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Cadastro visual completo com código, categoria, custos, preço e indicadores de venda.
            </p>
          </div>

          <button className="btn btn-outline" type="button" onClick={onClose}>
            Fechar
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
          }}
        >
          <div className="flex-col">
            <label htmlFor="product-primary-barcode" style={labelStyle}>Código principal</label>
            <input
              id="product-primary-barcode"
              style={inputStyle}
              value={draft.primaryBarcode}
              onChange={(event) => onChange('primaryBarcode', event.target.value)}
              placeholder="EAN / código interno"
            />
          </div>

          <div className="flex-col" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="product-extra-barcodes" style={labelStyle}>Códigos adicionais</label>
            <textarea
              id="product-extra-barcodes"
              style={{ ...inputStyle, minHeight: '88px', resize: 'vertical' }}
              value={draft.extraBarcodesText}
              onChange={(event) => onChange('extraBarcodesText', event.target.value)}
              placeholder="Separe por vírgula, espaço ou quebra de linha"
            />
          </div>

          <div className="flex-col" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="product-name" style={labelStyle}>Nome do produto</label>
            <input
              id="product-name"
              style={inputStyle}
              value={draft.name}
              onChange={(event) => onChange('name', event.target.value)}
              placeholder="Descrição comercial do item"
            />
          </div>

          <div className="flex-col">
            <label htmlFor="product-category" style={labelStyle}>Categoria</label>
            <input
              id="product-category"
              style={inputStyle}
              value={draft.category}
              onChange={(event) => onChange('category', event.target.value)}
              placeholder="Ex.: Hortifruti"
            />
          </div>

          <div className="flex-col">
            <span style={labelStyle}>Indicador de venda</span>
            <div className="flex gap-2">
              <button
                type="button"
                style={{
                  ...segmentStyle,
                  backgroundColor: draft.saleMode === 'unit' ? 'var(--primary)' : 'var(--surface-100)',
                  borderColor: draft.saleMode === 'unit' ? 'var(--primary)' : 'var(--border)',
                  color: draft.saleMode === 'unit' ? 'var(--text-white)' : 'var(--text-primary)',
                }}
                onClick={() => onChange('saleMode', 'unit')}
              >
                Produto por unidade
              </button>
              <button
                type="button"
                style={{
                  ...segmentStyle,
                  backgroundColor: draft.saleMode === 'weight' ? 'var(--success)' : 'var(--surface-100)',
                  borderColor: draft.saleMode === 'weight' ? 'var(--success)' : 'var(--border)',
                  color: draft.saleMode === 'weight' ? 'var(--text-white)' : 'var(--text-primary)',
                }}
                onClick={() => onChange('saleMode', 'weight')}
              >
                Produto pesável
              </button>
            </div>
          </div>

          <div className="flex-col">
            <label htmlFor="product-unit" style={labelStyle}>Unidade</label>
            <select
              id="product-unit"
              style={{ ...inputStyle, appearance: 'auto', cursor: draft.saleMode === 'weight' ? 'not-allowed' : 'pointer' }}
              value={draft.saleMode === 'weight' ? 'kg' : draft.unit}
              disabled={draft.saleMode === 'weight'}
              onChange={(event) => onChange('unit', event.target.value as ProductFormDraft['unit'])}
            >
              {CATALOG_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-col">
            <label htmlFor="product-cost" style={labelStyle}>Preço de custo</label>
            <input
              id="product-cost"
              style={inputStyle}
              value={draft.costPrice}
              onChange={(event) => onChange('costPrice', event.target.value)}
              placeholder="0,00"
              inputMode="decimal"
            />
          </div>

          <div className="flex-col">
            <label htmlFor="product-sale-price" style={labelStyle}>Preço de venda</label>
            <input
              id="product-sale-price"
              style={inputStyle}
              value={draft.salePrice}
              onChange={(event) => onChange('salePrice', event.target.value)}
              placeholder="0,00"
              inputMode="decimal"
            />
          </div>

          <div className="flex-col">
            <label htmlFor="product-margin" style={labelStyle}>Margem sugerida (%)</label>
            <input
              id="product-margin"
              style={inputStyle}
              value={draft.suggestedMargin}
              onChange={(event) => onChange('suggestedMargin', event.target.value)}
              placeholder="0,00"
              inputMode="decimal"
            />
          </div>

          <div className="flex-col">
            <label htmlFor="product-min-stock" style={labelStyle}>Estoque mínimo</label>
            <input
              id="product-min-stock"
              style={inputStyle}
              value={draft.stockMinimum}
              onChange={(event) => onChange('stockMinimum', event.target.value)}
              placeholder="0"
              inputMode="numeric"
            />
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: '18px 20px',
            background: 'linear-gradient(135deg, rgba(15, 98, 254, 0.08), rgba(25, 128, 56, 0.08))',
          }}
        >
          <div className="flex justify-between items-center gap-4" style={{ flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Resumo do cadastro
              </div>
              <div style={{ marginTop: '6px', fontSize: '1.15rem', fontWeight: 700 }}>
                {draft.name || 'Produto sem nome'}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(110px, 1fr))', gap: '12px', minWidth: 'min(100%, 420px)' }}>
              <div className="card" style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.92)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Código</div>
                <div style={{ marginTop: '4px', fontWeight: 700 }}>{draft.primaryBarcode || 'Pendente'}</div>
              </div>
              <div className="card" style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.92)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Modo</div>
                <div style={{ marginTop: '4px', fontWeight: 700 }}>
                  {draft.saleMode === 'weight' ? 'Pesável / kg' : `Unitário / ${draft.unit.toUpperCase()}`}
                </div>
              </div>
              <div className="card" style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.92)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Margem</div>
                <div style={{ marginTop: '4px', fontWeight: 700 }}>{draft.suggestedMargin || '0,00'}%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button className="btn btn-outline" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" type="button" onClick={onSave}>
            {isEditing ? 'Salvar Alterações' : 'Cadastrar Produto'}
          </button>
        </div>
      </div>
    </div>
  );
}
