import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { getSalesLayoutProfile } from '../features/sales/salesLayout.ts';
import { useViewportSize } from '../hooks/useViewportSize.ts';
import TefModal from './TefModal';

const FinancialSummary = ({
  total,
  remaining,
  change,
  paymentMethods,
  onRemovePayment,
  compact,
}) => (
  <div
    className="flex-col"
    style={{
      flex: 1.5,
      minWidth: 0,
      padding: compact ? '28px 24px' : '48px',
      backgroundColor: 'var(--surface-100)',
      color: 'var(--text-primary)',
      overflowY: 'auto',
      borderRight: '1px solid var(--border-light)',
    }}
  >
    <div className="flex-col" style={{ gap: compact ? '20px' : '32px', minHeight: '100%' }}>
      <div
        className="flex-col items-center justify-center"
        style={{
          backgroundColor: 'var(--surface-200)',
          borderRadius: 'var(--radius-lg)',
          padding: compact ? '28px 20px' : '48px 32px',
          textAlign: 'center',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
        }}
      >
        <h2
          style={{
            fontSize: compact ? '1.25rem' : '1.5rem',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontWeight: '600',
            marginBottom: compact ? '12px' : '16px',
          }}
        >
          Total a Pagar
        </h2>
        <div className="flex items-center justify-center" style={{ color: 'var(--primary)' }}>
          <span
            style={{
              fontSize: compact ? '2rem' : '2.5rem',
              marginRight: compact ? '10px' : '12px',
              fontWeight: '600',
              opacity: 0.8,
            }}
          >
            R$
          </span>
          <span
            style={{
              fontSize: compact ? '4.4rem' : '6rem',
              fontWeight: '900',
              lineHeight: 1,
              letterSpacing: '-3px',
            }}
          >
            {total.toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>

      <div className="flex-col" style={{ gap: compact ? '12px' : '16px', flex: 1 }}>
        <h3
          style={{
            color: 'var(--text-secondary)',
            fontSize: compact ? '1rem' : '1.2rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Valores Recebidos
        </h3>
        {paymentMethods.length === 0 ? (
          <div
            className="flex items-center justify-center"
            style={{
              flex: 1,
              minHeight: compact ? '96px' : undefined,
              backgroundColor: 'var(--surface-200)',
              borderRadius: 'var(--radius-md)',
              border: '2px dashed var(--border)',
              color: 'var(--text-tertiary)',
              fontSize: compact ? '1rem' : '1.2rem',
              fontStyle: 'italic',
              padding: compact ? '20px' : '32px',
              textAlign: 'center',
            }}
          >
            Nenhum pagamento registrado
          </div>
        ) : (
          <div className="flex-col" style={{ gap: compact ? '10px' : '12px' }}>
            {paymentMethods.map((payment) => (
              <div
                key={payment.id}
                className="flex justify-between items-center card glass"
                style={{
                  padding: compact ? '16px 18px' : '24px 32px',
                  borderLeft: '6px solid var(--success)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <span
                  style={{
                    fontSize: compact ? '1.05rem' : '1.4rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                  }}
                >
                  {payment.method}
                </span>
                <div className="flex items-center" style={{ gap: compact ? '12px' : '24px' }}>
                  <span
                    style={{
                      fontSize: compact ? '1.15rem' : '1.6rem',
                      color: 'var(--success)',
                      fontWeight: '800',
                    }}
                  >
                    R$ {payment.amount.toFixed(2).replace('.', ',')}
                  </span>
                  <button
                    onClick={() => onRemovePayment(payment.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--danger)',
                      cursor: 'pointer',
                      fontSize: compact ? '1.2rem' : '1.5rem',
                      padding: compact ? '6px' : '8px',
                      borderRadius: '50%',
                    }}
                    aria-label={`Remover pagamento ${payment.method}`}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className="flex justify-between items-center"
        style={{
          padding: compact ? '22px 24px' : '32px',
          backgroundColor: remaining > 0 ? 'rgba(241, 194, 27, 0.1)' : 'rgba(36, 161, 72, 0.1)',
          borderRadius: 'var(--radius-lg)',
          border: `2px solid ${remaining > 0 ? 'var(--warning)' : 'var(--success)'}`,
        }}
      >
        <div className="flex-col">
          <span
            style={{
              fontSize: compact ? '1rem' : '1.2rem',
              color: remaining > 0 ? 'var(--warning)' : 'var(--success)',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {remaining > 0 ? 'Falta Pagar' : 'Troco Gerado'}
          </span>
          <span
            style={{
              fontSize: compact ? '2.4rem' : '3rem',
              fontWeight: '900',
              color: remaining > 0 ? 'var(--warning)' : 'var(--success)',
              letterSpacing: '-1px',
            }}
          >
            R$ {(remaining > 0 ? remaining : change).toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const getMethodIcon = (method) => {
  if (method.includes('Dinheiro')) return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>;
  if (method.includes('Crédito') || method.includes('Débito')) return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>;
  if (method.includes('Pix')) return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h7v7h-7z" /><path d="M14 14v1h1v-1h-1z" /><path d="M17 17v1h1v-1h-1z" /></svg>;
  if (method.includes('Vale')) return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>;
  return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
};

const PaymentMethodsControls = ({
  methods,
  selectedMethod,
  onSelectMethod,
  remaining,
  amountInput,
  amountInputRef,
  onAmountChange,
  onAction,
  onCancel,
  compact,
}) => (
  <div
    className="flex-col"
    data-payment-controls-scroll
    style={{
      flex: 1,
      minWidth: 0,
      padding: compact ? '28px 24px' : '48px',
      backgroundColor: 'var(--surface-200)',
      display: 'flex',
      overflowY: 'auto',
    }}
  >
    <h2
      style={{
        fontSize: compact ? '1.25rem' : '1.5rem',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        fontWeight: '600',
        marginBottom: compact ? '24px' : '32px',
      }}
    >
      Modo de Pagamento
    </h2>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: compact ? '12px' : '16px',
        marginBottom: compact ? '28px' : '48px',
      }}
    >
      {methods.map((method) => (
        <button
          key={method}
          className="btn"
          onClick={() => onSelectMethod(method)}
          style={{
            padding: compact ? '18px 12px' : '24px 16px',
            border: '2px solid',
            borderColor: selectedMethod === method ? 'var(--primary)' : 'var(--border)',
            backgroundColor: selectedMethod === method ? 'var(--primary)' : 'var(--surface-100)',
            color: selectedMethod === method ? '#fff' : 'var(--text-primary)',
            fontSize: compact ? '1rem' : '1.2rem',
            fontWeight: '600',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: compact ? '8px' : '12px',
            minHeight: compact ? '104px' : '132px',
            boxShadow: selectedMethod === method ? '0 8px 16px rgba(15, 98, 254, 0.2)' : 'var(--shadow-sm)',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{getMethodIcon(method)}</span>
          <span style={{ textAlign: 'center' }}>{method}</span>
        </button>
      ))}
    </div>

    {remaining > 0 ? (
      <div className="flex-col" style={{ gap: compact ? '10px' : '16px', marginTop: 'auto', marginBottom: compact ? '20px' : '32px' }}>
        <div className="flex justify-between items-center" style={{ gap: '12px' }}>
          <label
            htmlFor="payment-amount-input"
            style={{
              color: 'var(--text-secondary)',
              fontSize: compact ? '1rem' : '1.1rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Valor a receber
          </label>
          <span style={{ color: 'var(--primary)', fontWeight: 'bold', textAlign: 'right' }}>{selectedMethod}</span>
        </div>
        <div
          className="flex items-center"
          style={{
            backgroundColor: 'var(--surface-100)',
            borderRadius: 'var(--radius-lg)',
            padding: compact ? '8px 18px' : '8px 24px',
            border: '3px solid var(--primary)',
            boxShadow: '0 4px 12px rgba(15, 98, 254, 0.15)',
          }}
        >
          <span
            style={{
              fontSize: compact ? '2rem' : '2.5rem',
              fontWeight: '600',
              marginRight: '16px',
              color: 'var(--primary)',
              opacity: 0.8,
            }}
          >
            R$
          </span>
          <input
            ref={amountInputRef}
            id="payment-amount-input"
            type="text"
            value={amountInput}
            onChange={(event) => onAmountChange(event.target.value)}
            style={{
              width: '100%',
              padding: compact ? '12px 0' : '16px 0',
              fontSize: compact ? '2.8rem' : '3.5rem',
              fontWeight: '900',
              border: 'none',
              background: 'transparent',
              outline: 'none',
              color: 'var(--text-primary)',
              textAlign: 'right',
              letterSpacing: '-1px',
            }}
          />
        </div>
      </div>
    ) : (
      <div
        className="flex-col items-center justify-center"
        style={{
          marginTop: 'auto',
          marginBottom: compact ? '20px' : '32px',
          backgroundColor: 'rgba(36, 161, 72, 0.1)',
          borderRadius: 'var(--radius-lg)',
          padding: compact ? '20px' : '28px',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            color: 'var(--success)',
            fontSize: compact ? '1.05rem' : '1.3rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Pagamento Coberto
        </div>
      </div>
    )}

    <div className="flex-col" style={{ gap: compact ? '10px' : '16px' }}>
      <button
        className="btn btn-success"
        style={{
          width: '100%',
          padding: compact ? '18px' : '24px',
          fontSize: compact ? '1.15rem' : '1.4rem',
          fontWeight: 'bold',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 8px 24px rgba(36, 161, 72, 0.3)',
        }}
        disabled={remaining > 0 && !(parseFloat(amountInput.replace(',', '.')) > 0)}
        onClick={onAction}
      >
        CONFIRMAR PAGAMENTO [ENTER]
      </button>
      <button
        className="btn btn-outline"
        style={{
          color: 'var(--danger)',
          borderColor: 'var(--danger)',
          padding: compact ? '16px' : '20px',
          fontSize: compact ? '1rem' : '1.2rem',
          fontWeight: '600',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--surface-100)',
        }}
        onClick={onCancel}
      >
        VOLTAR PARA VENDA [ESC]
      </button>
    </div>
  </div>
);

export default function PaymentModal({ total, onCancel, onConfirm }) {
  const viewport = useViewportSize();
  const viewportHeight = viewport.height;
  const viewportWidth = viewport.width;
  const layout = useMemo(() => getSalesLayoutProfile({
    height: viewportHeight,
    width: viewportWidth,
  }), [viewportHeight, viewportWidth]);
  const compact = layout.modalDensity === 'compact';
  const amountInputRef = useRef(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState('Cartão de Crédito');
  const [amountInput, setAmountInput] = useState('');
  const [showTef, setShowTef] = useState(false);
  const [tefData, setTefData] = useState(null);

  const totalPaid = useMemo(() => paymentMethods.reduce((accumulator, payment) => accumulator + payment.amount, 0), [paymentMethods]);
  const remaining = Math.max(0, total - totalPaid);
  const change = Math.max(0, totalPaid - total);
  const suggestedAmount = remaining > 0 ? remaining.toFixed(2) : '';
  const displayedAmount = amountInput === '' ? suggestedAmount : amountInput;

  const handleRemovePayment = useCallback((id) => {
    setAmountInput('');
    setPaymentMethods((previous) => previous.filter((payment) => payment.id !== id));
  }, []);

  const handleAction = useCallback(() => {
    if (remaining === 0) {
      const requiresPinpad = paymentMethods.find((payment) => payment.method.includes('Cartão') || payment.method === 'Pix');

      if (requiresPinpad) {
        setTefData(requiresPinpad);
        setShowTef(true);
      } else {
        onConfirm(paymentMethods);
      }
      return;
    }

    const value = parseFloat(displayedAmount.replace(',', '.'));

    if (value > 0) {
      setAmountInput('');
      setPaymentMethods((previous) => [...previous, { method: selectedMethod, amount: value, id: Date.now() }]);
    }
  }, [displayedAmount, onConfirm, paymentMethods, remaining, selectedMethod]);

  const methods = useMemo(() => ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix', 'Vale Alimentação'], []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCancel();
      if (event.key === 'Enter') {
        event.preventDefault();
        handleAction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAction, onCancel]);

  useEffect(() => {
    if (remaining > 0) {
      const input = amountInputRef.current;

      if (!input) {
        return;
      }

      const scrollParent = input.closest('[data-payment-controls-scroll]');
      const previousScrollTop = scrollParent?.scrollTop ?? 0;

      try {
        input.focus({ preventScroll: true });
      } catch {
        input.focus();
      }

      if (scrollParent) {
        scrollParent.scrollTop = previousScrollTop;
      }
    }
  }, [remaining, selectedMethod]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        display: 'flex',
      }}
    >
      <FinancialSummary
        total={total}
        remaining={remaining}
        change={change}
        paymentMethods={paymentMethods}
        onRemovePayment={handleRemovePayment}
        compact={compact}
      />

      <PaymentMethodsControls
        methods={methods}
        selectedMethod={selectedMethod}
        onSelectMethod={setSelectedMethod}
        remaining={remaining}
        amountInput={displayedAmount}
        amountInputRef={amountInputRef}
        onAmountChange={setAmountInput}
        onAction={handleAction}
        onCancel={onCancel}
        compact={compact}
      />

      {showTef && tefData && (
        <TefModal
          amount={tefData.amount}
          method={tefData.method}
          onApproved={() => {
            setShowTef(false);
            onConfirm(paymentMethods);
          }}
          onCancel={() => {
            setShowTef(false);
            setTefData(null);
          }}
        />
      )}
    </div>
  );
}
