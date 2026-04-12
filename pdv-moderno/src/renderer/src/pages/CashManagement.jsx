import React, { useState } from 'react';

export default function CashManagement({ operator, shiftSales, movements, onAddMovement, onCloseRegister }) {
  const [activeTab, setActiveTab] = useState('resumo'); // resumo, nova_sangria, novo_suprimento, fechamento

  const getCashInDrawer = () => {
    let total = operator.initialCash || 0;
    
    // Sum only "Dinheiro" payments, minus change
    shiftSales.forEach(sale => {
      const cashPayments = sale.payments.filter(p => p.method === 'Dinheiro');
      const cashTotal = cashPayments.reduce((acc, p) => acc + p.amount, 0);
      
      if (cashTotal > 0) {
        if (sale.change > 0 && cashTotal >= sale.change) {
          total += (cashTotal - sale.change); // Cash paid minus change given
        } else {
          total += cashTotal; // Though change is covered by other methods technically, POS assumes change is given from Cash Drawer
        }
      }
    });

    movements.forEach(m => {
      if (m.type === 'suprimento') total += m.amount;
      if (m.type === 'sangria') total -= m.amount;
    });

    return total;
  };

  const getCardTotal = () => {
     let total = 0;
     shiftSales.forEach(s => {
       s.payments.filter(p => ['Cartão de Crédito', 'Cartão de Débito', 'Pix'].includes(p.method)).forEach(p => total += p.amount);
     });
     return total;
  };

  const cashInDrawer = getCashInDrawer();
  const cardsInDrawer = getCardTotal();
  const [amountInput, setAmountInput] = useState('');
  const [reasonInput, setReasonInput] = useState('');

  const handleAction = (type) => {
    const val = parseFloat(amountInput.replace(',', '.'));
    if (val > 0) {
      if (type === 'sangria' && val > cashInDrawer) {
        alert("Valor da sangria maior que o dinheiro esperado na gaveta!");
        return;
      }
      onAddMovement({ id: Date.now(), type, amount: val, reason: reasonInput || (type === 'sangria' ? 'Retirada Avulsa' : 'Entrada Avulsa'), time: new Date() });
      setAmountInput('');
      setReasonInput('');
      setActiveTab('resumo');
    }
  };

  return (
    <div className="flex-col h-full w-full" style={{ padding: '32px', overflowY: 'auto' }}>
      
      {activeTab === 'fechamento' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="card glass flex-col" style={{ width: '500px', padding: '32px', border: '2px solid var(--primary)', alignItems: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '16px', fontWeight: '600' }}>Leitura Z (Fechamento)</h2>
            <div style={{ width: '100%', backgroundColor: '#fff', padding: '24px', borderRadius: 'var(--radius-md)', marginBottom: '32px', fontFamily: '"Courier New", Courier, monospace', fontSize: '1.2rem', color: '#000', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)' }}>
              <div style={{ textAlign: 'center', fontWeight: '600', marginBottom: '16px', fontSize: '1.5rem' }}>GRAVITY MERCADO</div>
              <div className="flex justify-between" style={{ borderBottom: '1px dashed #000', paddingBottom: '8px', marginBottom: '8px' }}>
                <span>Operador:</span> <span>{operator.name}</span>
              </div>
              <div className="flex justify-between" style={{ marginBottom: '4px' }}>
                <span>Fundo Abertura:</span> <span>R$ {(operator.initialCash || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between" style={{ marginBottom: '4px' }}>
                <span>Total Vendas Dinheiro:</span> <span>R$ {(cashInDrawer - (operator.initialCash || 0) - movements.reduce((acc, m) => acc + (m.type === 'suprimento' ? m.amount : -m.amount), 0)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between" style={{ marginBottom: '4px', opacity: 0.8 }}>
                <span>Sangrias/Suprimentos Líg:</span> <span>R$ {(movements.reduce((acc, m) => acc + (m.type === 'suprimento' ? m.amount : -m.amount), 0)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between" style={{ borderTop: '1px dashed #000', paddingTop: '8px', marginTop: '8px', fontWeight: '600' }}>
                <span>= SALDO ESPERADO (GAVETA):</span> <span>R$ {cashInDrawer.toFixed(2)}</span>
              </div>
              <div className="flex justify-between" style={{ borderBottom: '1px dashed #000', paddingBottom: '8px', marginBottom: '8px', marginTop: '16px' }}>
                <span>Vendas em Cartão / Pix:</span> <span>R$ {cardsInDrawer.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <button className="btn btn-outline" style={{ flex: 1, padding: '16px' }} onClick={() => setActiveTab('resumo')}>Cancelar</button>
              <button className="btn btn-danger" style={{ flex: 2, fontWeight: '600', padding: '16px' }} onClick={onCloseRegister}>Imprimir Z e Encerrar Turno</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center" style={{ marginBottom: '32px' }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Gestão de Caixa</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Fundo de troco, Sangrias, Suprimentos e Fechamento (Relatório X/Z)</p>
        </div>
        <button className="btn btn-danger" style={{ fontWeight: '600', padding: '16px 24px', fontSize: '1.2rem' }} onClick={() => setActiveTab('fechamento')}>
          🔒 Encerrar Turno (Fechamento Z)
        </button>
      </div>

      <div className="flex gap-4" style={{ marginBottom: '32px' }}>
        <button className={`btn ${activeTab === 'resumo' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('resumo')} style={{ padding: '16px 24px' }}>Visão Geral (Gaveta)</button>
        <button className={`btn ${activeTab === 'nova_sangria' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('nova_sangria')} style={{ padding: '16px 24px' }}>Nova Sangria (Retirada)</button>
        <button className={`btn ${activeTab === 'novo_suprimento' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('novo_suprimento')} style={{ padding: '16px 24px' }}>Novo Suprimento (Entrada)</button>
      </div>

      {activeTab === 'resumo' && (
        <div className="flex gap-6 h-full">
          <div className="card glass flex-col" style={{ flex: 1, padding: '40px' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '16px' }}>Dinheiro em Gaveta (Esperado)</h3>
            <div style={{ fontSize: '4rem', fontWeight: '600', color: 'var(--success)', letterSpacing: '-1px' }}>
              R$ {cashInDrawer.toFixed(2).replace('.', ',')}
            </div>
            
            <div style={{ marginTop: '32px', padding: '32px', backgroundColor: 'var(--surface-100)', borderRadius: 'var(--radius-md)' }}>
              <div className="flex justify-between" style={{ marginBottom: '16px', fontSize: '1.2rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Fundo de Abertura Inicial</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>R$ {(operator.initialCash || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between" style={{ marginBottom: '16px', fontSize: '1.2rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Vendas Líquidas em Dinheiro</span>
                <span style={{ fontWeight: '600', color: 'var(--success)' }}>+ R$ {(cashInDrawer - (operator.initialCash || 0) - movements.reduce((acc, m) => acc + (m.type === 'suprimento' ? m.amount : -m.amount), 0)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between" style={{ marginBottom: '16px', color: 'var(--danger)', fontSize: '1.2rem' }}>
                <span>Sangrias Realizadas</span>
                <span style={{ fontWeight: '600' }}>- R$ {movements.filter(m => m.type === 'sangria').reduce((a, m) => a + m.amount, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between" style={{ color: 'var(--success)', fontSize: '1.2rem' }}>
                <span>Suprimentos Adicionados</span>
                <span style={{ fontWeight: '600' }}>+ R$ {movements.filter(m => m.type === 'suprimento').reduce((a, m) => a + m.amount, 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="card glass flex-col" style={{ flex: 1, padding: '40px' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '16px' }}>Histórico de Movimentações (Turno)</h3>
            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '8px' }}>
              {movements.length === 0 ? (
                <div style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', textAlign: 'center', padding: '40px', fontSize: '1.2rem' }}>Nenhuma ocorrência física de dinheiro no turno.</div>
              ) : (
                <div className="flex-col gap-4">
                  {/* Revert array for latest first */}
                  {[...movements].reverse().map(m => (
                     <div key={m.id} className="flex justify-between items-center" style={{ padding: '24px', backgroundColor: 'var(--surface-100)', borderRadius: 'var(--radius-sm)', borderLeft: `6px solid ${m.type === 'sangria' ? 'var(--danger)' : 'var(--success)'}` }}>
                       <div>
                         <div style={{ fontWeight: '600', textTransform: 'uppercase', fontSize: '1.1rem', color: m.type === 'sangria' ? 'var(--danger)' : 'var(--success)', marginBottom: '4px' }}>
                           {m.type}
                         </div>
                         <div style={{ fontSize: '1rem', color: 'var(--text-primary)', marginTop: '4px' }}>{m.reason}</div>
                         <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>{m.time.toLocaleTimeString()}</div>
                       </div>
                       <div style={{ fontWeight: '600', fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                         R$ {m.amount.toFixed(2)}
                       </div>
                     </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {(activeTab === 'nova_sangria' || activeTab === 'novo_suprimento') && (
        <div className="flex justify-center" style={{ paddingTop: '32px' }}>
          <div className="card glass flex-col items-center justify-center" style={{ padding: '40px', width: '500px', border: `2px solid ${activeTab === 'nova_sangria' ? 'var(--danger)' : 'var(--success)'}` }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: activeTab === 'nova_sangria' ? 'var(--danger)' : 'var(--success)', fontWeight: '600' }}>
              Registrar {activeTab === 'nova_sangria' ? 'Sangria (Retirada)' : 'Suprimento (Entrada)'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', textAlign: 'center', fontSize: '1rem' }}>
              {activeTab === 'nova_sangria' ? 'Retirada de segurança de dinheiro em espécie da gaveta do caixa.' : 'Adição de troco extra ou outras entradas avulsas.'}
            </p>
            
            <div className="flex items-center" style={{ backgroundColor: 'var(--surface-100)', color: 'var(--text-primary)', borderRadius: 'var(--radius-md)', padding: '0 20px', border: '2px solid var(--border-focus)', marginBottom: '16px', width: '100%' }}>
              <span style={{ fontSize: '2rem', fontWeight: '600', marginRight: '16px', color: 'var(--text-secondary)' }}>R$</span>
              <input 
                autoFocus
                type="number" 
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                placeholder="0,00"
                style={{ width: '100%', padding: '20px 0', fontSize: '2.5rem', fontWeight: '600', border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-primary)' }}
              />
            </div>

            <div style={{ width: '100%', marginBottom: '24px' }}>
              <label style={{ color: 'var(--text-secondary)', marginBottom: '8px', display: 'block', fontSize: '1rem', fontWeight: '600', textAlign: 'left' }}>
                Motivo da {activeTab === 'nova_sangria' ? 'Retirada' : 'Entrada'}
              </label>
              <input 
                type="text" 
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder={activeTab === 'nova_sangria' ? 'Ex: Pagamento Fornecedor...' : 'Ex: Fundo extra de moedas...'}
                style={{ width: '100%', padding: '16px', fontSize: '1.2rem', borderRadius: 'var(--radius-md)', border: '2px solid var(--border)', outline: 'none', backgroundColor: 'var(--surface-100)', color: 'var(--text-primary)' }}
              />
            </div>

            <button className={`btn ${activeTab === 'nova_sangria' ? 'btn-danger' : 'btn-success'}`} style={{ width: '100%', padding: '16px', fontSize: '1.2rem', fontWeight: '600' }} onClick={() => handleAction(activeTab === 'nova_sangria' ? 'sangria' : 'suprimento')}>
              [ENTER] Confirmar Operação
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
