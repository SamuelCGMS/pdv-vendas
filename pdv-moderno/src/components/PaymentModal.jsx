import React, { useState, useEffect, useCallback, useMemo } from 'react';
import TefModal from './TefModal';

// Sub-componente extraído: Resumo Financeiro
// Melhora a legibilidade do código e isola a renderização do painel da esquerda.
const FinancialSummary = ({ total, remaining, change, paymentMethods, onRemovePayment }) => (
  <div className="flex-col justify-between" style={{ flex: 1.5, padding: '48px 64px', backgroundColor: 'var(--surface-100)', color: 'var(--text-primary)', overflowY: 'auto' }}>
    <div className="flex-col gap-6">
      <div>
        <h1 style={{ fontSize: '3rem', marginBottom: '8px', color: 'var(--text-primary)' }}>Resumo Financeiro</h1>
        <div style={{ color: 'var(--text-secondary)', fontSize: '1.5rem', marginBottom: '8px' }}>Total da Compra</div>
        <div className="flex items-center">
          <span style={{ fontSize: '2.5rem', color: 'var(--text-secondary)', marginRight: '16px', fontWeight: '500' }}>R$</span>
          <span style={{ fontSize: '6rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1 }}>{total.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>
      
      <div style={{ padding: '32px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '24px' }}>Pagamentos Realizados</div>
        {paymentMethods.length === 0 ? (
          <div style={{ color: 'var(--text-tertiary)', fontSize: '1.2rem', fontStyle: 'italic' }}>Aguardando pagamento do cliente...</div>
        ) : (
          <div className="flex-col gap-4">
            {paymentMethods.map(p => (
              <div key={p.id} className="flex justify-between items-center" style={{ fontSize: '1.5rem', borderBottom: '1px dashed var(--border)', paddingBottom: '12px', color: 'var(--text-primary)' }}>
                <span>{p.method}</span>
                <div className="flex items-center gap-4">
                  <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>R$ {p.amount.toFixed(2).replace('.', ',')}</span>
                  <button 
                    onClick={() => onRemovePayment(p.id)} 
                    aria-label="Remover pagamento" 
                    style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1.5rem', padding: '0 8px' }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center" style={{ fontSize: '2rem', marginTop: '16px' }}>
        <span style={{ color: remaining > 0 ? 'var(--warning)' : 'var(--text-secondary)' }}>Falta Pagar</span>
        <span style={{ color: remaining > 0 ? 'var(--warning)' : 'var(--text-secondary)', fontWeight: 'bold' }}>R$ {remaining.toFixed(2).replace('.', ',')}</span>
      </div>

      <div className="flex justify-between items-center" style={{ fontSize: '2rem' }}>
        <span style={{ color: change > 0 ? 'var(--success)' : 'var(--text-secondary)' }}>Troco Gerado</span>
        <span style={{ color: change > 0 ? 'var(--success)' : 'var(--text-secondary)', fontWeight: 'bold' }}>R$ {change.toFixed(2).replace('.', ',')}</span>
      </div>
    </div>
  </div>
);

// Sub-componente extraído: Área Interativa (Pagamentos e Ações)
const PaymentMethodsControls = ({ 
  methods, 
  selectedMethod, 
  onSelectMethod, 
  remaining, 
  amountInput, 
  onAmountChange, 
  onAction, 
  onCancel 
}) => (
  <div className="flex-col" style={{ flex: 1, padding: '48px', backgroundColor: 'var(--surface-200)', borderLeft: '1px solid var(--border)', display: 'flex' }}>
    <h2 style={{ fontSize: '2rem', marginBottom: '32px', color: 'var(--text-primary)' }}>Método de Pagamento</h2>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '48px' }}>
      {methods.map(m => (
        <button 
          key={m} 
          className="btn" 
          onClick={() => onSelectMethod(m)}
          style={{
            padding: '24px 20px',
            border: '2px solid',
            borderColor: selectedMethod === m ? 'var(--primary)' : 'var(--border)',
            backgroundColor: selectedMethod === m ? 'var(--primary)' : 'var(--surface-100)',
            color: selectedMethod === m ? 'var(--text-white)' : 'var(--text-primary)',
            fontSize: '1.2rem',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'left',
            justifyContent: 'flex-start',
            transition: 'all 0.15s ease'
          }}
        >
          {m}
        </button>
      ))}
    </div>

    {remaining > 0 ? (
      <div className="flex-col gap-4" style={{ marginTop: 'auto', marginBottom: '32px' }}>
        <label style={{ color: 'var(--primary)', marginBottom: '8px', fontSize: '1.2rem', fontWeight: 'bold' }}>Valor em {selectedMethod}</label>
        <div className="flex items-center" style={{ backgroundColor: 'var(--surface-100)', color: 'var(--text-primary)', borderRadius: 'var(--radius-md)', padding: '0 24px', border: '3px solid var(--border-focus)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', marginRight: '16px', color: 'var(--text-secondary)' }}>R$</span>
          <input 
            autoFocus
            type="text" 
            value={amountInput}
            onChange={(e) => onAmountChange(e.target.value)}
            style={{ width: '100%', padding: '20px 0', fontSize: '2.5rem', fontWeight: '800', border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-primary)' }}
          />
        </div>
      </div>
    ) : (
      <div style={{ marginTop: 'auto', marginBottom: '32px', textAlign: 'center', color: 'var(--success)', fontSize: '1.2rem', fontWeight: 'bold' }}>
        Pagamento completamente coberto.
      </div>
    )}

    <div className="flex-col gap-4">
      <button 
        className="btn btn-success" 
        style={{ width: '100%', padding: '24px', fontSize: '1.5rem', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }} 
        disabled={remaining > 0 && !(parseFloat(amountInput.replace(',', '.')) > 0)}
        onClick={onAction}
      >
        CONFIRMAR [ENTER]
      </button>
      <button className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)', padding: '20px', fontSize: '1.2rem', backgroundColor: 'var(--surface-100)' }} onClick={onCancel}>
        Voltar para Venda [ESC]
      </button>
    </div>
  </div>
);

// Componente Principal Modernizado
export default function PaymentModal({ total, onCancel, onConfirm }) {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState('Cartão de Crédito');
  const [amountInput, setAmountInput] = useState('');
  const [showTef, setShowTef] = useState(false);
  const [tefData, setTefData] = useState(null);

  // Utilizando useMemo para cálculos derivados (Performance gain em listas grandes)
  const totalPaid = useMemo(() => paymentMethods.reduce((acc, p) => acc + p.amount, 0), [paymentMethods]);
  const remaining = Math.max(0, total - totalPaid);
  const change = Math.max(0, totalPaid - total);

  // Efeito isolado para auto-fill
  useEffect(() => {
    if (remaining > 0) {
      setAmountInput(remaining.toFixed(2));
    } else {
      setAmountInput('');
    }
  }, [remaining]);

  // Funções estabilizadas com useCallback previnem re-renderizações filhas desnecessárias
  const handleRemovePayment = useCallback((id) => {
    setPaymentMethods(prev => prev.filter(p => p.id !== id));
  }, []);

  const handleAction = useCallback(() => {
    // Se não há mais valor, ou seja completou o total
    if (remaining === 0) {
      const requiresPinpad = paymentMethods.find(p => p.method.includes('Cartão') || p.method === 'Pix');
      if (requiresPinpad) {
        setTefData(requiresPinpad);
        setShowTef(true);
      } else {
        onConfirm(paymentMethods);
      }
      return;
    }
    const val = parseFloat(amountInput.replace(',', '.'));
    if (val > 0) {
      setPaymentMethods(prev => [...prev, { method: selectedMethod, amount: val, id: Date.now() }]);
    }
  }, [amountInput, remaining, selectedMethod, paymentMethods, onConfirm]);

  const methods = useMemo(() => ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix', 'Vale Alimentação'], []);

  // Keyboard events wrapper
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAction();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAction, onCancel]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex' }}>
      
      {/* Esquerda: Resumo Financeiro agora está em Destaque! (Maior Flex 1.5) */}
      <FinancialSummary 
        total={total}
        remaining={remaining}
        change={change}
        paymentMethods={paymentMethods}
        onRemovePayment={handleRemovePayment}
      />

      {/* Direita: Seleção de Pagamentos (Menor Flex 1) */}
      <PaymentMethodsControls 
        methods={methods}
        selectedMethod={selectedMethod}
        onSelectMethod={setSelectedMethod}
        remaining={remaining}
        amountInput={amountInput}
        onAmountChange={setAmountInput}
        onAction={handleAction}
        onCancel={onCancel}
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
