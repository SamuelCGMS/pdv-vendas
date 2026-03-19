import React, { useState, useEffect, useCallback, useMemo } from 'react';
import TefModal from './TefModal';

// Sub-componente extraído: Resumo Financeiro
// Melhora a legibilidade do código e isola a renderização do painel da esquerda.
const FinancialSummary = ({ total, remaining, change, paymentMethods, onRemovePayment }) => (
  <div className="flex-col" style={{ flex: 1.5, padding: '48px', backgroundColor: 'var(--surface-100)', color: 'var(--text-primary)', overflowY: 'auto', borderRight: '1px solid var(--border-light)' }}>
    <div className="flex-col gap-8 h-full">
      
      {/* Total Section */}
      <div className="flex-col items-center justify-center p-8 border-radius-lg" style={{ backgroundColor: 'var(--surface-200)', borderRadius: 'var(--radius-lg)', padding: '48px 32px', textAlign: 'center', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600', marginBottom: '16px' }}>Total a Pagar</h2>
        <div className="flex items-center justify-center" style={{ color: 'var(--primary)' }}>
          <span style={{ fontSize: '2.5rem', marginRight: '12px', fontWeight: '600', opacity: 0.8 }}>R$</span>
          <span style={{ fontSize: '6rem', fontWeight: '900', lineHeight: 1, letterSpacing: '-3px' }}>{total.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>
      
      {/* Métodos Aplicados */}
      <div className="flex-col gap-4 flex-1">
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Valores Recebidos</h3>
        {paymentMethods.length === 0 ? (
          <div className="flex items-center justify-center" style={{ flex: 1, backgroundColor: 'var(--surface-200)', borderRadius: 'var(--radius-md)', border: '2px dashed var(--border)', color: 'var(--text-tertiary)', fontSize: '1.2rem', fontStyle: 'italic', padding: '32px' }}>
            Nenhum pagamento registrado
          </div>
        ) : (
          <div className="flex-col gap-3">
            {paymentMethods.map(p => (
              <div key={p.id} className="flex justify-between items-center card glass" style={{ padding: '24px 32px', borderLeft: '6px solid var(--success)', borderRadius: 'var(--radius-md)', animation: 'slideIn 0.2s ease-out' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: '600', color: 'var(--text-primary)' }}>{p.method}</span>
                <div className="flex items-center gap-6">
                  <span style={{ fontSize: '1.6rem', color: 'var(--success)', fontWeight: '800' }}>R$ {p.amount.toFixed(2).replace('.', ',')}</span>
                  <button 
                    onClick={() => onRemovePayment(p.id)} 
                    style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1.5rem', padding: '8px', borderRadius: '50%', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(218,30,40,0.1)'} 
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Restante/Troco */}
      <div className="flex justify-between items-center" style={{ padding: '32px', backgroundColor: remaining > 0 ? 'rgba(241, 194, 27, 0.1)' : 'rgba(36, 161, 72, 0.1)', borderRadius: 'var(--radius-lg)', border: `2px solid ${remaining > 0 ? 'var(--warning)' : 'var(--success)'}` }}>
        <div className="flex-col">
          <span style={{ fontSize: '1.2rem', color: remaining > 0 ? 'var(--warning)' : 'var(--success)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {remaining > 0 ? 'Falta Pagar' : 'Troco Gerado'}
          </span>
          <span style={{ fontSize: '3rem', fontWeight: '900', color: remaining > 0 ? 'var(--warning)' : 'var(--success)', letterSpacing: '-1px' }}>
            R$ {(remaining > 0 ? remaining : change).toFixed(2).replace('.', ',')}
          </span>
        </div>
        <div style={{ opacity: 0.2, color: remaining > 0 ? 'var(--warning)' : 'var(--success)' }}>
          {remaining > 0 ? (
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ) : (
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          )}
        </div>
      </div>

    </div>
  </div>
);

const getMethodIcon = (method) => {
  if (method.includes('Dinheiro')) return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>;
  if (method.includes('Crédito') || method.includes('Débito')) return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>;
  if (method.includes('Pix')) return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h7v7h-7z"/><path d="M14 14v1h1v-1h-1z"/><path d="M17 17v1h1v-1h-1z"/></svg>;
  if (method.includes('Vale')) return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>;
  return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
};

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
  <div className="flex-col" style={{ flex: 1, padding: '48px', backgroundColor: 'var(--surface-200)', display: 'flex' }}>
    <h2 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600', marginBottom: '32px' }}>Modo de Pagamento</h2>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '48px' }}>
      {methods.map(m => (
        <button 
          key={m} 
          className="btn" 
          onClick={() => onSelectMethod(m)}
          style={{
            padding: '24px 16px',
            border: '2px solid',
            borderColor: selectedMethod === m ? 'var(--primary)' : 'var(--border)',
            backgroundColor: selectedMethod === m ? 'var(--primary)' : 'var(--surface-100)',
            color: selectedMethod === m ? '#fff' : 'var(--text-primary)',
            fontSize: '1.2rem',
            fontWeight: '600',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            transform: selectedMethod === m ? 'scale(1.02)' : 'scale(1)',
            boxShadow: selectedMethod === m ? '0 8px 16px rgba(15, 98, 254, 0.2)' : 'var(--shadow-sm)'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{getMethodIcon(m)}</span>
          <span style={{ textAlign: 'center' }}>{m}</span>
        </button>
      ))}
    </div>

    {remaining > 0 ? (
      <div className="flex-col gap-4" style={{ marginTop: 'auto', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Valor a receber</label>
          <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{selectedMethod}</span>
        </div>
        <div className="flex items-center" style={{ backgroundColor: 'var(--surface-100)', borderRadius: 'var(--radius-lg)', padding: '8px 24px', border: '3px solid var(--primary)', boxShadow: '0 4px 12px rgba(15, 98, 254, 0.15)' }}>
          <span style={{ fontSize: '2.5rem', fontWeight: '600', marginRight: '16px', color: 'var(--primary)', opacity: 0.8 }}>R$</span>
          <input 
            autoFocus
            type="text" 
            value={amountInput}
            onChange={(e) => onAmountChange(e.target.value)}
            style={{ width: '100%', padding: '16px 0', fontSize: '3.5rem', fontWeight: '900', border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-primary)', textAlign: 'right', letterSpacing: '-1px' }}
          />
        </div>
      </div>
    ) : (
      <div className="flex-col items-center justify-center p-8" style={{ marginTop: 'auto', marginBottom: '32px', backgroundColor: 'rgba(36, 161, 72, 0.1)', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ textAlign: 'center', color: 'var(--success)', fontSize: '1.3rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Pagamento Coberto
        </div>
      </div>
    )}

    <div className="flex-col gap-4">
      <button 
        className="btn btn-success" 
        style={{ width: '100%', padding: '24px', fontSize: '1.4rem', fontWeight: 'bold', borderRadius: 'var(--radius-lg)', transition: 'all 0.2s', boxShadow: '0 8px 24px rgba(36, 161, 72, 0.3)' }} 
        disabled={remaining > 0 && !(parseFloat(amountInput.replace(',', '.')) > 0)}
        onClick={onAction}
      >
        CONFIRMAR PAGAMENTO [ENTER]
      </button>
      <button className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)', padding: '20px', fontSize: '1.2rem', fontWeight: '600', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-100)' }} onClick={onCancel}>
        VOLTAR PARA VENDA [ESC]
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
