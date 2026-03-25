import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  describeDiscount,
  formatCurrency,
  getDiscountAmount,
  normalizeDiscount,
} from '../../../shared/sales';

function parseNumericInput(value) {
  const parsedValue = Number.parseFloat(String(value).replace(',', '.'));
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export default function SaleDiscountModal({
  discountBase,
  initialDiscount,
  onConfirm,
  onCancel,
}) {
  const discountInputRef = useRef(null);
  const [mode, setMode] = useState(initialDiscount?.mode ?? 'amount');
  const [valueInput, setValueInput] = useState(
    initialDiscount ? String(initialDiscount.value).replace('.', ',') : '',
  );

  const draftDiscount = useMemo(() => {
    if (valueInput.trim() === '') {
      return null;
    }

    return normalizeDiscount({
      mode,
      value: parseNumericInput(valueInput),
    });
  }, [mode, valueInput]);

  const previewDiscount = getDiscountAmount(discountBase, draftDiscount);
  const previewTotal = Math.max(0, discountBase - previewDiscount);
  const canSubmit = draftDiscount !== null;

  useEffect(() => {
    discountInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      }

      if (event.key === 'Enter' && canSubmit) {
        event.preventDefault();
        onConfirm(draftDiscount);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canSubmit, draftDiscount, onCancel, onConfirm]);

  return (
    <div className="pos-modal-overlay">
      <div
        className="pos-modal-card card glass flex-col"
        style={{ width: '560px', padding: '32px', gap: '24px' }}
      >
        <div className="flex-col gap-2">
          <h2 style={{ fontSize: '1.9rem', color: 'var(--text-primary)' }}>
            Desconto na venda
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Este desconto é aplicado depois dos descontos por item.
          </p>
        </div>

        <div className="card" style={{ padding: '20px', backgroundColor: 'var(--surface-200)' }}>
          <div className="flex justify-between items-center">
            <span style={{ color: 'var(--text-secondary)' }}>Base para desconto</span>
            <strong style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>
              R$ {formatCurrency(discountBase)}
            </strong>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            className={`btn ${mode === 'amount' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1, padding: '14px' }}
            onClick={() => setMode('amount')}
          >
            Valor
          </button>
          <button
            className={`btn ${mode === 'percent' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1, padding: '14px' }}
            onClick={() => setMode('percent')}
          >
            Percentual
          </button>
        </div>

        <div className="flex-col gap-2">
          <label htmlFor="sale-discount-input" style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>
            {mode === 'amount' ? 'Valor do desconto' : 'Percentual do desconto'}
          </label>
          <input
            ref={discountInputRef}
            id="sale-discount-input"
            type="text"
            inputMode="decimal"
            value={valueInput}
            onChange={(event) => setValueInput(event.target.value)}
            placeholder={mode === 'amount' ? '10,00' : '5'}
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

        <div className="card flex-col gap-3" style={{ padding: '20px', backgroundColor: 'var(--surface-100)' }}>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>Desconto informado</span>
            <strong style={{ color: 'var(--primary)' }}>{describeDiscount(draftDiscount)}</strong>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>Desconto aplicado</span>
            <strong style={{ color: 'var(--danger)' }}>R$ {formatCurrency(previewDiscount)}</strong>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>Novo total</span>
            <strong style={{ color: 'var(--success)', fontSize: '1.2rem' }}>
              R$ {formatCurrency(previewTotal)}
            </strong>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            className="btn btn-outline"
            style={{ flex: 1, padding: '16px' }}
            onClick={() => onConfirm(null)}
          >
            Remover desconto
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
            onClick={() => onConfirm(draftDiscount)}
          >
            Aplicar [ENTER]
          </button>
        </div>
      </div>
    </div>
  );
}
