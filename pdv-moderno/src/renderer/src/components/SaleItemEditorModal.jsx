import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  describeDiscount,
  formatCurrency,
  formatQuantity,
  getDiscountAmount,
  normalizeDiscount,
  normalizeQuantity,
  roundCurrency,
} from '../../../shared/sales';

function parseNumericInput(value) {
  const parsedValue = Number.parseFloat(String(value).replace(',', '.'));
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export default function SaleItemEditorModal({ item, onConfirm, onCancel }) {
  const quantityInputRef = useRef(null);
  const [quantityInput, setQuantityInput] = useState(() => String(item.quantity).replace('.', ','));
  const [discountMode, setDiscountMode] = useState(item.discount?.mode ?? 'amount');
  const [discountValueInput, setDiscountValueInput] = useState(() => {
    return item.discount ? String(item.discount.value).replace('.', ',') : '';
  });

  const normalizedQuantity = useMemo(() => {
    const nextQuantity = parseNumericInput(quantityInput);
    return normalizeQuantity(nextQuantity, item.unit);
  }, [item.unit, quantityInput]);

  const previewSubtotal = roundCurrency(item.price * normalizedQuantity);

  const draftDiscount = useMemo(() => {
    if (discountValueInput.trim() === '') {
      return null;
    }

    return normalizeDiscount({
      mode: discountMode,
      value: parseNumericInput(discountValueInput),
    });
  }, [discountMode, discountValueInput]);

  const previewDiscount = getDiscountAmount(previewSubtotal, draftDiscount);
  const previewTotal = Math.max(0, previewSubtotal - previewDiscount);
  const canSubmit = normalizedQuantity > 0;

  useEffect(() => {
    quantityInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      }

      if (event.key === 'Enter' && canSubmit) {
        event.preventDefault();
        onConfirm({
          quantity: normalizedQuantity,
          discount: draftDiscount,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canSubmit, draftDiscount, normalizedQuantity, onCancel, onConfirm]);

  return (
    <div className="pos-modal-overlay">
      <div
        className="pos-modal-card card glass flex-col"
        style={{ width: '620px', padding: '32px', gap: '24px' }}
      >
        <div className="flex-col gap-2">
          <h2 style={{ fontSize: '1.9rem', color: 'var(--text-primary)' }}>
            Editar item do cupom
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Ajuste quantidade e desconto do item selecionado.
          </p>
        </div>

        <div className="card flex-col gap-2" style={{ padding: '20px', backgroundColor: 'var(--surface-200)' }}>
          <strong style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{item.name}</strong>
          <span style={{ color: 'var(--text-secondary)' }}>Código: {item.id}</span>
          <span style={{ color: 'var(--text-secondary)' }}>
            Valor unitário: R$ {formatCurrency(item.price)}
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>
            Atual: {formatQuantity(item.quantity, item.unit)}
          </span>
        </div>

        <div className="flex gap-4">
          <div className="flex-col gap-2" style={{ flex: 1 }}>
            <label htmlFor="sale-item-quantity" style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>
              Quantidade
            </label>
            <input
              ref={quantityInputRef}
              id="sale-item-quantity"
              type="text"
              inputMode="decimal"
              value={quantityInput}
              onChange={(event) => setQuantityInput(event.target.value)}
              placeholder={item.unit === 'kg' ? '0,500' : '1'}
              style={{
                width: '100%',
                padding: '18px 20px',
                fontSize: '1.3rem',
                borderRadius: 'var(--radius-md)',
                border: '2px solid var(--border)',
                backgroundColor: 'var(--surface-100)',
                outline: 'none',
              }}
            />
          </div>

          <div className="flex-col gap-2" style={{ flex: 1.2 }}>
            <label htmlFor="sale-item-discount" style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>
              Tipo de desconto
            </label>
            <div className="flex gap-3">
              <button
                className={`btn ${discountMode === 'amount' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, padding: '14px' }}
                onClick={() => setDiscountMode('amount')}
              >
                Valor
              </button>
              <button
                className={`btn ${discountMode === 'percent' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, padding: '14px' }}
                onClick={() => setDiscountMode('percent')}
              >
                Percentual
              </button>
            </div>
            <input
              id="sale-item-discount"
              type="text"
              inputMode="decimal"
              value={discountValueInput}
              onChange={(event) => setDiscountValueInput(event.target.value)}
              placeholder={discountMode === 'amount' ? '0,00' : '0'}
              style={{
                width: '100%',
                padding: '18px 20px',
                fontSize: '1.1rem',
                borderRadius: 'var(--radius-md)',
                border: '2px solid var(--border)',
                backgroundColor: 'var(--surface-100)',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div className="card flex-col gap-3" style={{ padding: '20px', backgroundColor: 'var(--surface-100)' }}>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>Novo subtotal</span>
            <strong style={{ color: 'var(--text-primary)' }}>R$ {formatCurrency(previewSubtotal)}</strong>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>Desconto informado</span>
            <strong style={{ color: 'var(--primary)' }}>{describeDiscount(draftDiscount)}</strong>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>Desconto aplicado</span>
            <strong style={{ color: 'var(--danger)' }}>R$ {formatCurrency(previewDiscount)}</strong>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>Total do item</span>
            <strong style={{ color: 'var(--success)', fontSize: '1.2rem' }}>
              R$ {formatCurrency(previewTotal)}
            </strong>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            className="btn btn-outline"
            style={{ flex: 1, padding: '16px' }}
            onClick={() => onConfirm({ quantity: normalizedQuantity, discount: null })}
          >
            Limpar desconto
          </button>
          <button
            className="btn btn-outline"
            style={{ flex: 1, padding: '16px' }}
            onClick={onCancel}
          >
            Voltar [ESC]
          </button>
          <button
            className="btn btn-success"
            style={{ flex: 1.2, padding: '16px' }}
            disabled={!canSubmit}
            onClick={() => onConfirm({ quantity: normalizedQuantity, discount: draftDiscount })}
          >
            Salvar [ENTER]
          </button>
        </div>
      </div>
    </div>
  );
}
