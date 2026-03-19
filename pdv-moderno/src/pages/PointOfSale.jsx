import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Reports from './Reports';
import PaymentModal from '../components/PaymentModal';
import ReceiptModal from '../components/ReceiptModal';
import CpfModal from '../components/CpfModal';
import Catalog from '../pages/Catalog';
import HistoricalReports from '../pages/HistoricalReports';
import CashManagement from '../pages/CashManagement';
import { products } from '../data/mock';
import Settings from '../pages/Settings';

export default function PointOfSale({ operator, onLogout }) {
  const [activeTab, setActiveTab] = useState('vendas'); // vendas, relatorios
  const [cart, setCart] = useState([]);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [completedSaleData, setCompletedSaleData] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCpfModal, setShowCpfModal] = useState(false);
  const [customerCpf, setCustomerCpf] = useState('');
  const [shiftSales, setShiftSales] = useState([]);
  const [movements, setMovements] = useState([]);
  const [parkedSales, setParkedSales] = useState([]);
  const [showParkedModal, setShowParkedModal] = useState(false);

  // Parse multiplier (e.g. 5*codigo)
  const parseBarcode = (input) => {
    const match = input.match(/^(\d+(?:\.\d+)?)\*(.+)$/);
    if (match) return { qty: parseFloat(match[1]), query: match[2] };
    return { qty: 1, query: input };
  };
  const parsed = parseBarcode(barcodeInput);

  const filteredProducts = products.filter(p =>
    parsed.query && (p.id.includes(parsed.query) || p.name.toLowerCase().includes(parsed.query.toLowerCase()))
  );

  const handleProductSelect = useCallback((product, quantity) => {
    setCart(prev => [...prev, { ...product, quantity, cartId: Date.now() }]);
    setBarcodeInput('');
    setShowDropdown(false);
  }, []);

  const handleRemoveItem = useCallback((cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  }, []);

  // Auto-scroll list when cart grows
  useEffect(() => {
    const tableContainer = document.getElementById('cart-table-container');
    if (tableContainer) {
      tableContainer.scrollTop = tableContainer.scrollHeight;
    }
  }, [cart]);

  // Simulating barcode scanner or search
  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    if (filteredProducts.length > 0) {
      handleProductSelect(filteredProducts[0], parsed.qty);
    } else {
      alert('Produto não encontrado! Tente pesquisar "Arroz" ou "Maçã".');
    }
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const parkCurrentSale = useCallback(() => {
    if (cart.length === 0) return;
    const newParked = {
      id: `ESP-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString(),
      cart: [...cart],
      cpf: customerCpf,
      total: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    };
    setParkedSales(prev => [...prev, newParked]);
    setCart([]);
    setCustomerCpf('');
  }, [cart, customerCpf]);

  const resumeParkedSale = useCallback((parkedSale) => {
    if (cart.length > 0) {
      parkCurrentSale();
    }
    setCart(parkedSale.cart);
    setCustomerCpf(parkedSale.cpf || '');
    setParkedSales(prev => prev.filter(p => p.id !== parkedSale.id));
    setShowParkedModal(false);
  }, [cart, parkCurrentSale]);

  useEffect(() => {
    const handleGlobalKey = (e) => {
      // Abre CPF ao apertar F2
      if (e.key === 'F2' && activeTab === 'vendas' && !showPaymentModal && !showCpfModal && !showParkedModal) {
        e.preventDefault();
        setShowCpfModal(true);
      }
      // Estacionar ao apertar F4
      if (e.key === 'F4' && activeTab === 'vendas' && cart.length > 0 && !showPaymentModal && !showParkedModal) {
        e.preventDefault();
        parkCurrentSale();
      }
      // Ver Listagem F5
      if (e.key === 'F5' && activeTab === 'vendas' && parkedSales.length > 0 && !showPaymentModal && !showParkedModal) {
        e.preventDefault();
        setShowParkedModal(true);
      }
      // Fechar modal com esc
      if (e.key === 'Escape' && showParkedModal) {
        e.preventDefault();
        setShowParkedModal(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [activeTab, showPaymentModal, showCpfModal, cart.length, parkedSales.length, showParkedModal, parkCurrentSale]);

  return (
    <div className="flex h-full w-full">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

      <div className="flex-col w-full" style={{ backgroundColor: 'var(--surface-200)', height: '100vh', overflow: 'hidden' }}>
        <Header operator={operator} />

        {activeTab === 'vendas' && (
          <div className="flex w-full" style={{ height: 'calc(100vh - 64px)', padding: '16px', gap: '16px' }}>
            {/* Lado Esquerdo - Busca e Cupom */}
            <div className="flex-col w-full card glass" style={{ flex: 2, padding: '32px', gap: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', borderTop: '4px solid var(--primary)' }}>

              <div style={{ position: 'relative' }} className="w-full">
                <form onSubmit={handleBarcodeSubmit} className="flex gap-4 w-full">
                  <div style={{ flex: 1, position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.5rem', opacity: 0.5 }}>🔎</span>
                    <input
                      autoFocus
                      type="text"
                      value={barcodeInput}
                      onChange={(e) => {
                        setBarcodeInput(e.target.value);
                        setShowDropdown(e.target.value.trim().length > 0);
                      }}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 4px rgba(15, 98, 254, 0.1)'; if (barcodeInput.length > 0) setShowDropdown(true); }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border)';
                        e.target.style.boxShadow = 'none';
                        setTimeout(() => setShowDropdown(false), 200);
                      }}
                      placeholder="Código de barras ou nome do produto..."
                      style={{ width: '100%', padding: '20px 20px 20px 60px', fontSize: '1.2rem', borderRadius: 'var(--radius-lg)', border: '2px solid var(--border)', outline: 'none', transition: 'all 0.3s', backgroundColor: 'var(--surface-100)', boxSizing: 'border-box' }}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0 40px', fontSize: '1.1rem', borderRadius: 'var(--radius-lg)' }}>✚ INSERIR [ENTER]</button>
                </form>

                {showDropdown && filteredProducts.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: '230px', backgroundColor: 'var(--surface-100)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 20, maxHeight: '300px', overflowY: 'auto', marginTop: '8px' }}>
                    {filteredProducts.map(p => (
                      <div
                        key={p.id}
                        className="flex justify-between items-center"
                        style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-light)', cursor: 'pointer', transition: '0.1s' }}
                        onClick={() => handleProductSelect(p, parsed.qty)}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-200)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{p.name}</div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>Cód: {p.id}</div>
                        </div>
                        <div style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.2rem' }}>R$ {p.price.toFixed(2).replace('.', ',')}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div id="cart-table-container" className="flex-col" style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--surface-100)', borderRadius: 'var(--radius-lg)', padding: '16px', border: '1px solid var(--border-light)', scrollBehavior: 'smooth' }}>
                {cart.length === 0 ? (
                  <div className="flex-col items-center justify-center" style={{ height: '100%', color: 'var(--text-tertiary)', opacity: 0.7, padding: '64px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🛒</div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '500' }}>Caixa Livre</h3>
                    <p>Passe o leitor de código de barras para iniciar</p>
                  </div>
                ) : (
                  <div className="flex-col gap-3">
                    <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 100px 120px 120px 40px', gap: '16px', padding: '0 24px 8px 24px', color: 'var(--text-tertiary)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid var(--border-light)', marginBottom: '4px' }}>
                      <div style={{ textAlign: 'center' }}>Nº</div>
                      <div>Produto</div>
                      <div style={{ textAlign: 'center' }}>QTD</div>
                      <div style={{ textAlign: 'right' }}>V. Unit</div>
                      <div style={{ textAlign: 'right' }}>Subtotal</div>
                      <div style={{ textAlign: 'center' }}></div>
                    </div>
                    {cart.map((item, idx) => (
                      <div key={item.cartId} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 100px 120px 120px 40px', gap: '16px', alignItems: 'center', padding: '16px 24px', backgroundColor: 'var(--surface-200)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary)', transition: 'transform 0.2s', animation: 'slideIn 0.2s ease-out' }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--text-tertiary)', textAlign: 'center' }}>{String(idx + 1).padStart(3, '0')}</div>
                        
                        <div className="flex-col">
                          <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{item.name}</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Cód: {item.id}</span>
                        </div>
                        
                        <div style={{ fontWeight: '500', color: 'var(--text-secondary)', textAlign: 'center', fontSize: '1.1rem' }}>
                          {item.quantity} {item.unit}
                        </div>
                        
                        <div style={{ textAlign: 'right', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '1.1rem' }}>
                          R$ {item.price.toFixed(2).replace('.', ',')}
                        </div>

                        <div style={{ fontWeight: '900', fontSize: '1.25rem', color: 'var(--primary)', textAlign: 'right' }}>
                          R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                        </div>

                        <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                          <button onClick={() => handleRemoveItem(item.cartId)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', fontSize: '1.2rem', cursor: 'pointer', padding: '8px', borderRadius: '50%', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Remover item" title="Excluir Item" onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(218,30,40,0.1)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Lado Direito - Totais e Pagamento */}
            <div className="flex-col card glass" style={{ width: '480px', minWidth: '480px', padding: '32px 24px', backgroundColor: 'var(--surface-100)', justifyContent: 'space-between', borderTop: '8px solid var(--primary)', boxShadow: 'var(--shadow-lg)' }}>
              <div className="flex-col gap-6">
                <h2 style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600', borderBottom: '2px solid var(--border-light)', paddingBottom: '16px', margin: 0 }}>
                  Resumo da Venda
                </h2>
                <div className="flex-col gap-3">
                  <div className="flex justify-between items-end" style={{ borderBottom: '1px dashed var(--border-light)', paddingBottom: '12px' }}>
                    <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Itens</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>{cart.length}</span>
                  </div>
                  <div className="flex justify-between items-end" style={{ borderBottom: '1px dashed var(--border-light)', paddingBottom: '12px' }}>
                    <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Subtotal</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between items-end" style={{ borderBottom: '1px dashed var(--border-light)', paddingBottom: '12px' }}>
                    <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Descontos</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--danger)' }}>R$ 0,00</span>
                  </div>
                </div>

                <div className="flex-col items-center justify-center" style={{ marginTop: '16px', padding: '32px 0', backgroundColor: 'var(--surface-200)', borderRadius: 'var(--radius-lg)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '1px' }}>TOTAL A PAGAR</span>
                  <span style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--success)', lineHeight: 1, letterSpacing: '-2px' }}>
                    <span style={{ fontSize: '1.5rem', marginRight: '8px', opacity: 0.8, fontWeight: '600' }}>R$</span>
                    {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <div className="flex-col gap-4" style={{ marginBottom: '16px' }}>
                <div className="flex gap-4">
                  {parkedSales.length > 0 && (
                    <button
                      className="btn btn-warning flex justify-between items-center"
                      style={{ flex: 1, padding: '16px', backgroundColor: 'var(--warning)', color: '#000', borderRadius: 'var(--radius-md)', fontWeight: 'bold' }}
                      onClick={() => setShowParkedModal(true)}
                    >
                      <span>Espera ({parkedSales.length})</span>
                      <span style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>[F5]</span>
                    </button>
                  )}
                  <button
                    className="btn btn-outline flex justify-between items-center"
                    style={{ flex: 1, padding: '16px', borderRadius: 'var(--radius-md)' }}
                    disabled={cart.length === 0}
                    onClick={parkCurrentSale}
                  >
                    <span>Estacionar</span>
                    <span style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>[F4]</span>
                  </button>
                </div>
              </div>

              <div className="flex-col gap-4">
                <button
                  className="btn btn-success flex justify-between items-center"
                  style={{ width: '100%', fontSize: '1.3rem', padding: '24px', borderRadius: 'var(--radius-lg)', fontWeight: 'bold', boxShadow: '0 8px 16px rgba(36, 161, 72, 0.2)' }}
                  disabled={cart.length === 0}
                  onClick={() => setShowPaymentModal(true)}
                >
                  <span>RECEBER PAGAMENTO</span>
                  <span style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem' }}>★</span>
                </button>
                <div className="flex gap-4">
                  <button
                    className="btn btn-primary flex justify-between items-center"
                    style={{ flex: 1, padding: '16px', borderRadius: 'var(--radius-md)' }}
                    onClick={() => setShowCpfModal(true)}
                  >
                    <span>{customerCpf ? 'CPF ✓' : 'Cpf na Nota'}</span>
                    <span style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>[F2]</span>
                  </button>
                  <button
                    className="btn btn-danger flex justify-between items-center"
                    style={{ flex: 1, padding: '16px', borderRadius: 'var(--radius-md)' }}
                    onClick={() => setCart([])}
                    disabled={cart.length === 0}
                  >
                    <span>Cancelar Compra</span>
                    <span style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>[ESC]</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sub Telas */}
        {activeTab === 'relatorios' && <Reports operator={operator} shiftSales={shiftSales} />}
        {activeTab === 'historico' && <HistoricalReports />}
        {activeTab === 'catalogo' && <Catalog />}
        {activeTab === 'caixa' && <CashManagement operator={operator} shiftSales={shiftSales} movements={movements} onAddMovement={m => setMovements([...movements, m])} onCloseRegister={onLogout} />}
        {activeTab === 'configuracoes' && <Settings />}

        {/* Modais flutuantes */}
        {showCpfModal && (
          <CpfModal
            currentCpf={customerCpf}
            onConfirm={(cpf) => { setCustomerCpf(cpf); setShowCpfModal(false); }}
            onCancel={() => setShowCpfModal(false)}
          />
        )}

        {/* Modal de Pagamento */}
        {showPaymentModal && (
          <PaymentModal
            total={total}
            onCancel={() => setShowPaymentModal(false)}
            onConfirm={(payments) => {
              const changeAmount = Math.max(0, payments.reduce((a, p) => a + p.amount, 0) - total);
              const saleData = { cart, payments, total, change: changeAmount, operator, customerCpf, id: Date.now() };
              setCompletedSaleData(saleData);
              setShiftSales(prev => [...prev, saleData]);
              setShowPaymentModal(false);
              setCustomerCpf('');
            }}
          />
        )}

        {/* Modal da Impressão do Recibo / Cupom Fical */}
        {completedSaleData && (
          <ReceiptModal
            data={completedSaleData}
            onClose={() => {
              setCompletedSaleData(null);
              setCart([]);
            }}
          />
        )}

        {/* Modal de Vendas Estacionadas */}
        {showParkedModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card glass flex-col" style={{ width: '600px', padding: '32px' }}>
              <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '2rem' }}>Vendas em Espera</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Clique em uma venda para retomar o atendimento.</p>

              <div className="flex-col gap-4" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
                {parkedSales.map(p => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center card"
                    style={{ padding: '16px', backgroundColor: 'var(--surface-100)', cursor: 'pointer', border: '2px solid transparent', transition: '0.2s' }}
                    onClick={() => resumeParkedSale(p)}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '4px' }}>Comanda {p.id}</div>
                      <div style={{ color: 'var(--text-secondary)' }}>{p.cart.length} itens • {p.time}</div>
                      {p.cpf && <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', marginTop: '4px' }}>CPF/CNPJ: {p.cpf}</div>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--success)', marginBottom: '8px' }}>R$ {p.total.toFixed(2).replace('.', ',')}</div>
                      <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>Retomar Venda</button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-outline" style={{ marginTop: '24px', width: '100%', padding: '16px' }} onClick={() => setShowParkedModal(false)}>VOLTAR [ESC]</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
