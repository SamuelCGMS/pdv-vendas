import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { PanelLeft } from "lucide-react";

import { MaterialIcon } from "@shared/components/MaterialIcon";
import { filterProducts, formatCurrency } from "@shared/domain/pos";
import { operators, products } from "@shared/mocks/pos";
import { SalesProvider, useClock, useSales } from "@shared/store/sales-store";
import type { PaymentMethod } from "@shared/store/sales-store";
import { useScale } from "@shared/hooks/use-scale";
import type { ScaleStatus } from "@shared/hooks/use-scale";

type SalesScreen = "opening" | "sales" | "payment" | "closing";

export function SalesApp(): ReactElement {
  return (
    <SalesProvider>
      <SalesAppContent />
    </SalesProvider>
  );
}

function SalesAppContent(): ReactElement {
  const [screen, setScreen] = useState<SalesScreen>(() => getInitialSalesScreen());
  const [query, setQuery] = useState("");
  const [discountOpen, setDiscountOpen] = useState(() => shouldOpenDiscountModal());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [parkedDrawerOpen, setParkedDrawerOpen] = useState(false);

  const { state, dispatch } = useSales();
  const scale = useScale();

  const handleConfirmPayment = useCallback(() => {
    dispatch({ type: "COMPLETE_SALE" });
    setScreen("sales");
  }, [dispatch]);

  const handleNewSale = useCallback(() => {
    dispatch({ type: "NEW_SALE" });
    setQuery("");
  }, [dispatch]);

  const handleCloseSession = useCallback(() => {
    dispatch({ type: "CLOSE_SESSION" });
    setScreen("opening");
  }, [dispatch]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (screen === "opening") return;

      switch (event.key) {
        case "Escape":
          if (discountOpen) {
            setDiscountOpen(false);
          } else if (screen === "sales") {
            dispatch({ type: "CLEAR_CART" });
            setQuery("");
          }
          break;
        case "F1":
          event.preventDefault();
          setScreen("sales");
          break;
        case "F3":
          event.preventDefault();
          dispatch({ type: "CLEAR_CART" });
          setQuery("");
          break;
        case "F6":
          event.preventDefault();
          dispatch({ type: "SET_PAYMENT_METHOD", method: "card" });
          break;
        case "F7":
          event.preventDefault();
          dispatch({ type: "SET_PAYMENT_METHOD", method: "cash" });
          break;
        case "F8":
          event.preventDefault();
          dispatch({ type: "SET_PAYMENT_METHOD", method: "pix" });
          break;
        case "F10":
          event.preventDefault();
          if (screen === "sales" && state.cart.length > 0) {
            dispatch({ type: "PARK_SALE" });
            setQuery("");
          } else if (screen === "sales") {
            setParkedDrawerOpen(true);
          }
          break;
        case "F11":
          event.preventDefault();
          if (screen === "sales") setDiscountOpen(true);
          break;
        case "F12":
          event.preventDefault();
          if (screen === "sales" && state.cart.length > 0) {
            setScreen("payment");
          }
          break;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screen, discountOpen, dispatch, state.cart.length]);

  if (screen === "opening") {
    return <OpeningScreen onOpen={() => setScreen("sales")} />;
  }

  if (screen === "payment") {
    return (
      <PaymentScreen
        onBack={() => setScreen("sales")}
        onConfirm={handleConfirmPayment}
      />
    );
  }

  if (screen === "closing") {
    return <ClosingScreen onBack={() => setScreen("sales")} onCloseSession={handleCloseSession} />;
  }

  return (
    <div className="sales-shell app-shell">
      <SalesSidebar isCollapsed={isSidebarCollapsed} onClose={() => setScreen("closing")} onNewSale={handleNewSale} />
      <main className="sales-main">
        <SalesTopbar onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        <section className="checkout-stage">
          <div className="scan-panel">
            {/* HTML: w-20 h-20 rounded-full bg-primary-container → barcode_scanner text-4xl */}
            <div className="scan-orb">
              <MaterialIcon name="barcode_scanner" size={36} />
            </div>
            <div className="search-box">
              {/* HTML: left-6 material-symbols-outlined text-primary text-2xl → search */}
              <MaterialIcon name="search" size={24} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Buscar produto" placeholder="Buscar produto" />
              <kbd>ESC</kbd>
              {query.length > 0 ? <SearchResults query={query} onSelect={() => setQuery("")} /> : null}
            </div>
            <CartList scale={scale} />
          </div>
          <CheckoutPanel
            onPayment={() => setScreen("payment")}
            onDiscount={() => setDiscountOpen(true)}
            onClearCart={() => { dispatch({ type: "CLEAR_CART" }); setQuery(""); }}
            onParkSale={() => { dispatch({ type: "PARK_SALE" }); setQuery(""); }}
            onShowParked={() => setParkedDrawerOpen(true)}
            parkedCount={state.parkedSales.length}
          />
        </section>
      </main>
      {discountOpen ? <DiscountModal onClose={() => setDiscountOpen(false)} /> : null}
      {parkedDrawerOpen ? (
        <ParkedSalesDrawer
          onClose={() => setParkedDrawerOpen(false)}
          onResume={(id) => { dispatch({ type: "RESUME_SALE", parkedId: id }); setParkedDrawerOpen(false); }}
          onDiscard={(id) => dispatch({ type: "DISCARD_PARKED", parkedId: id })}
        />
      ) : null}
    </div>
  );
}

function getInitialSalesScreen(): SalesScreen {
  const searchParams = new URLSearchParams(window.location.search);
  const screen = searchParams.get("screen");

  if (screen === "sales" || screen === "payment" || screen === "closing") {
    return screen;
  }

  return "opening";
}

function shouldOpenDiscountModal(): boolean {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get("discount") === "1";
}

function OpeningScreen({ onOpen }: { onOpen: () => void }): ReactElement {
  const [selectedOperator, setSelectedOperator] = useState(operators[0].id);
  const [cashFund, setCashFund] = useState("");
  const { dispatch } = useSales();
  const clock = useClock();

  const handleOpen = (): void => {
    const operator = operators.find((op) => op.id === selectedOperator);
    if (!operator) return;
    const fundValue = parseFloat(cashFund.replace(",", ".")) || 0;
    dispatch({ type: "OPEN_SESSION", operator: { id: operator.id, name: operator.name }, cashFund: fundValue });
    onOpen();
  };

  return (
    <div className="opening-screen">
      <header className="opening-header">
        <div className="opening-brand">LINEN & LEAF</div>
        <div className="opening-time">
          {/* HTML: clock icon → material-symbols */}
          <MaterialIcon name="schedule" size={20} />
          <span>{clock}</span>
        </div>
      </header>
      <main className="opening-content">
        <section className="opening-title">
          <h1>Entrada de Turno</h1>
          <p>Selecione o operador responsável para iniciar as atividades do dia na Estação 01.</p>
        </section>
        <section className="operator-grid" aria-label="Operadores">
          {operators.map((operator) => (
            <button
              className={`operator-card ${operator.id === selectedOperator ? "selected" : ""}`}
              key={operator.id}
              onClick={() => setSelectedOperator(operator.id)}
            >
              <img className="operator-avatar" src={operator.image} alt={operator.name} />
              <strong>{operator.name}</strong>
              <span>{operator.role}</span>
              <i />
            </button>
          ))}
        </section>
        <section className="opening-cash">
          <label htmlFor="cash-fund">FUNDO DE TROCO INICIAL (R$)</label>
          <div className="cash-input">
            <span>R$</span>
            <input id="cash-fund" value={cashFund} onChange={(e) => setCashFund(e.target.value)} placeholder="0,00" inputMode="decimal" />
          </div>
          <button className="open-register gradient-action" onClick={handleOpen}>
            {/* HTML: lock_open_right */}
            <MaterialIcon name="lock_open_right" size={24} />
            Abrir Caixa
          </button>
        </section>
      </main>
      <footer className="opening-footer">
        <div>
          <span>AMBIENTE SEGURO</span>
          <span>ACESSO RESTRITO A COLABORADORES</span>
        </div>
        <span>POS TERMINAL V4.2.0</span>
      </footer>
    </div>
  );
}

/* HTML sidebar: aside w-64 py-8 px-4 gap-6 bg-[#f1f4f2] font-medium text-sm */
function SalesSidebar({ onClose, onNewSale, active = "sales", isCollapsed = false }: { onClose: () => void; onNewSale?: () => void; active?: "sales" | "closing"; isCollapsed?: boolean }): ReactElement {
  return (
    <aside className={`sales-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header-row">
        <div className="store-head" style={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto', overflow: 'hidden', whiteSpace: 'nowrap', transition: 'all 300ms ease' }}>
          <div className="store-logo">
            <img src="/ui-assets/brand/sales-logo.png" alt="BonsFrutos" />
          </div>
          <div>
            <strong>BonsFrutos</strong>
            <span>Caixa 01</span>
          </div>
        </div>
      </div>
      <nav className="side-nav">
        {/* HTML: point_of_sale icon for Caixa */}
        <button className={active === "sales" ? "active" : ""}>
          <MaterialIcon name="point_of_sale" />
          <span className="nav-label">Caixa</span>
        </button>
        {/* HTML: settings icon */}
        <button>
          <MaterialIcon name="settings" />
          <span className="nav-label">Configurações</span>
        </button>
      </nav>
      <button className="new-sale gradient-action" onClick={onNewSale}>
        {isCollapsed ? <MaterialIcon name="add_shopping_cart" /> : "F12: Nova Venda"}
      </button>
      <div className="side-footer">
        {/* HTML: help icon */}
        <button>
          <MaterialIcon name="help" />
          <span className="nav-label">Suporte</span>
        </button>
        {/* HTML: lock icon */}
        <button onClick={onClose}>
          <MaterialIcon name="lock" />
          <span className={`nav-label ${active === "closing" ? "active-link" : ""}`}>Fechamento</span>
        </button>
      </div>
    </aside>
  );
}

/* HTML topbar: flex justify-between items-center px-8 py-4 bg-[#f8faf8] font-light */
function SalesTopbar({ onToggleSidebar }: { onToggleSidebar?: () => void }): ReactElement {
  const { state } = useSales();
  const operatorName = state.session?.operatorName ?? "Operador";

  return (
    <header className="sales-topbar">
      <div className="topbar-title-group">
        {onToggleSidebar && (
          <button className="topbar-sidebar-toggle" onClick={onToggleSidebar} aria-label="Alternar barra lateral">
            <PanelLeft size={22} strokeWidth={1.5} />
          </button>
        )}
        <h1>PDV Ethereal Harvest</h1>
      </div>
      <nav aria-label="Atalhos principais">
        <button className="active">F1: Caixa</button>
        <button>F2: Configurações</button>
        <button>F3: Cancelar Venda</button>
      </nav>
      <div className="topbar-status">
        {/* HTML: wifi icon text-[#386b02], notifications icon text-[#2d3432] */}
        <MaterialIcon name="wifi" className="topbar-wifi" />
        <MaterialIcon name="notifications" />
        <span>{operatorName}</span>
        <img className="mini-avatar" src="/ui-assets/brand/manager.png" alt={operatorName} />
      </div>
    </header>
  );
}

function SearchResults({ query, onSelect }: { query: string; onSelect: () => void }): ReactElement | null {
  const results = useMemo(() => filterProducts(products, query).slice(0, 5), [query]);
  const { dispatch } = useSales();

  if (!query || results.length === 0) {
    return null;
  }

  const handleAdd = (product: typeof products[number]): void => {
    dispatch({ type: "ADD_TO_CART", product });
    onSelect();
  };

  return (
    <div className="search-results">
      {results.map((product) => (
        <button key={product.id} onClick={() => handleAdd(product)}>
          <ProductImage product={product} className="product-thumb" />
          <span>
            <strong>{product.name}</strong>
            <small>{product.category}</small>
          </span>
          <em>{formatCurrency(product.price)}</em>
        </button>
      ))}
      <div className="search-result-foot">
        <span>{results.length} resultados encontrados</span>
        <button>Ver todos (F4)</button>
      </div>
    </div>
  );
}

function CartList({ scale }: { scale: ReturnType<typeof useScale> }): ReactElement {
  const { state, dispatch } = useSales();

  const handleWeigh = async (productId: string): Promise<void> => {
    if (scale.status !== "connected") {
      try { await scale.connect(); } catch { return; }
    }
    const reading = await scale.readWeight();
    if (reading.weightKg > 0 && !reading.error) {
      dispatch({ type: "SET_ITEM_WEIGHT", productId, weightKg: reading.weightKg });
    }
  };

  if (state.cart.length === 0) {
    return (
      <div className="cart-list" aria-label="Itens da venda">
        <p style={{ textAlign: 'center', opacity: 0.5, padding: '2rem 0', fontSize: '0.85rem' }}>Busque um produto para iniciar a venda</p>
      </div>
    );
  }

  return (
    <div className="cart-list" aria-label="Itens da venda">
      {state.cart.map((item) => {
        const isKg = item.product.unit === "kg";
        const unitLabel = isKg ? "kg" : item.product.unit;
        const unitPrice = `${formatCurrency(item.product.price).replace(" ", "")} / ${unitLabel}`;
        const qty = isKg ? `${item.quantity.toFixed(3)}` : String(item.quantity).padStart(2, "0");
        const lineTotal = formatCurrency(item.product.price * item.quantity).replace(" ", "");

        return (
          <article className="sale-item" key={item.product.id}>
            <ProductImage product={item.product} className="produce-tile" />
            <div className="sale-item-name">
              <strong>{item.product.name}</strong>
              <span>{unitPrice}</span>
            </div>
            {isKg ? (
              <div className="quantity-pill">
                <button
                  aria-label="Pesar"
                  className="weigh-btn"
                  onClick={() => handleWeigh(item.product.id)}
                  title="Ler balança"
                >
                  <MaterialIcon name="scale" size={16} />
                </button>
                <span>{qty}</span>
                <ScaleIndicator status={scale.status} />
              </div>
            ) : (
              <div className="quantity-pill">
                <button aria-label="Diminuir" onClick={() => dispatch({ type: "UPDATE_QUANTITY", productId: item.product.id, quantity: item.quantity - 1 })}>
                  <MaterialIcon name="remove" size={18} />
                </button>
                <span>{qty}</span>
                <button aria-label="Aumentar" onClick={() => dispatch({ type: "UPDATE_QUANTITY", productId: item.product.id, quantity: item.quantity + 1 })}>
                  <MaterialIcon name="add" size={18} />
                </button>
              </div>
            )}
            <strong className="line-total">{lineTotal}</strong>
          </article>
        );
      })}
    </div>
  );
}

function ScaleIndicator({ status }: { status: ScaleStatus }): ReactElement {
  const color = status === "connected" ? "#386b02" : status === "reading" ? "#c49a02" : "#999";
  return (
    <span style={{ fontSize: "0.6rem", color, display: "flex", alignItems: "center", gap: 2 }} title={`Balança: ${status}`}>
      <MaterialIcon name="scale" size={12} />
    </span>
  );
}

function CheckoutPanel({ onPayment, onDiscount, onClearCart, onParkSale, onShowParked, parkedCount }: {
  onPayment: () => void;
  onDiscount: () => void;
  onClearCart: () => void;
  onParkSale: () => void;
  onShowParked: () => void;
  parkedCount: number;
}): ReactElement {
  const { state, dispatch, cartSummary, cartTotal } = useSales();

  const totalFormatted = formatCurrency(cartTotal.total);
  const totalParts = totalFormatted.split(/\s/);
  const totalCurrency = totalParts[0] ?? "R$";
  const totalValue = totalParts.slice(1).join(" ") || "0,00";

  return (
    <aside className="checkout-panel">
      <div className="checkout-top-section">
        <div className="checkout-heading">
          <h2>Carrinho Atual</h2>
          <button onClick={onClearCart}>
            <MaterialIcon name="delete_sweep" size={14} />
            [ESC] Limpar
          </button>
        </div>
        <section className="total-card">
          <span>TOTAL A PAGAR</span>
          <strong>
            <small>{totalCurrency}</small>
            {totalValue}
          </strong>
        </section>
      </div>

      <div className="checkout-mid-section">
        <section className="summary-card">
          <h3>Resumo da Venda</h3>
          <dl>
            <div>
              <dt>Total de Itens</dt>
              <dd>{cartSummary.itemCount} unid.</dd>
            </div>
            <div>
              <dt>Peso Total</dt>
              <dd>{cartSummary.weightKg.toFixed(3)} kg</dd>
            </div>
            <div>
              <dt>Descontos</dt>
              <dd className="green">- {formatCurrency(cartTotal.discountAmount)}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="payment-shortcuts">
        <h3>SELECIONE O MÉTODO DE PAGAMENTO</h3>
        <div className="payment-methods-grid">
          <button className={state.paymentMethod === "card" ? "selected" : ""} onClick={() => dispatch({ type: "SET_PAYMENT_METHOD", method: "card" })}>
            <MaterialIcon name="credit_card" size={24} />
            Cartão [F6]
          </button>
          <button className={state.paymentMethod === "cash" ? "selected" : ""} onClick={() => dispatch({ type: "SET_PAYMENT_METHOD", method: "cash" })}>
            <MaterialIcon name="payments" size={24} />
            Dinheiro [F7]
          </button>
          <button className={state.paymentMethod === "pix" ? "selected" : ""} onClick={() => dispatch({ type: "SET_PAYMENT_METHOD", method: "pix" })}>
            <MaterialIcon name="qr_code_2" size={24} />
            Pix [F8]
          </button>
        </div>
        <div className="checkout-actions-wrapper">
          <button className="finish-sale" onClick={onPayment} disabled={state.cart.length === 0}>
            Finalizar Venda <span>[F12]</span>
          </button>
          <div className="checkout-actions">
            <button onClick={state.cart.length > 0 ? onParkSale : onShowParked}>
              <MaterialIcon name="pause_circle" size={18} />
              {state.cart.length > 0 ? "Estacionar [F10]" : `Estacionadas (${parkedCount})`}
            </button>
            <button onClick={onDiscount}>
              <MaterialIcon name="receipt" size={18} />
              Desconto[F11]
            </button>
          </div>
        </div>
      </section>
    </aside>
  );
}

function PaymentScreen({
  onBack,
  onConfirm,
}: {
  onBack: () => void;
  onConfirm: () => void;
}): ReactElement {
  const { state, dispatch, cartSummary, cartTotal } = useSales();

  const methods: Array<{ id: PaymentMethod; label: string; icon: ReactNode }> = [
    { id: "card", label: "Cartão", icon: <MaterialIcon name="credit_card" size={34} /> },
    { id: "pix", label: "Pix", icon: <MaterialIcon name="qr_code_2" size={34} /> },
    { id: "cash", label: "Dinheiro", icon: <MaterialIcon name="payments" size={34} /> },
    { id: "ticket", label: "Ticket", icon: <MaterialIcon name="receipt_long" size={34} /> },
  ];

  const discountLabel = state.discount
    ? state.discount.type === "percentage" ? `Desconto (${state.discount.value}%)` : "Desconto"
    : "Desconto";

  return (
    <div className="payment-screen">
      <header className="payment-header">
        <strong>BonsFrutos</strong>
        <nav>
          <button>
            <MaterialIcon name="help" size={22} />
          </button>
          <button onClick={onBack}>
            <MaterialIcon name="close" />
            <span>Cancelar Venda</span>
          </button>
        </nav>
      </header>
      <main className="payment-grid">
        <section className="payment-hero">
          <span>Total a Pagar</span>
          <strong>{formatCurrency(cartTotal.total)}</strong>
          <div>
            <small>
              <MaterialIcon name="receipt" size={18} />
              {cartSummary.itemCount} Itens
            </small>
            <small className="loyalty">
              <MaterialIcon name="eco" size={18} />
              Cliente Fidelidade
            </small>
          </div>
        </section>
        <section className="payment-form">
          <div className="payment-title-row">
            <h1>Pagamento</h1>
            <span>Pedido #{state.nextSaleId}</span>
          </div>
          <dl className="payment-lines">
            <div>
              <dt>Subtotal</dt>
              <dd>{formatCurrency(cartSummary.subtotal)}</dd>
            </div>
            <div className="green">
              <dt>{discountLabel}</dt>
              <dd>- {formatCurrency(cartTotal.discountAmount)}</dd>
            </div>
            <div className="final">
              <dt>Total Final</dt>
              <dd>{formatCurrency(cartTotal.total)}</dd>
            </div>
          </dl>
          <h2>Método de Pagamento</h2>
          <div className="method-grid">
            {methods.map((item) => (
              <button
                className={item.id === state.paymentMethod ? "selected" : ""}
                key={item.id}
                onClick={() => dispatch({ type: "SET_PAYMENT_METHOD", method: item.id })}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
          <div className="payment-actions">
            <button className="confirm-payment" onClick={onConfirm}>
              Confirmar Pagamento
              <MaterialIcon name="arrow_forward" size={28} />
            </button>
            <button className="back-payment" onClick={onBack}>Voltar ao Caixa</button>
          </div>
        </section>
      </main>
    </div>
  );
}

function ClosingScreen({ onBack, onCloseSession }: { onBack: () => void; onCloseSession: () => void }): ReactElement {
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const { state, sessionStats } = useSales();

  const breakdown = sessionStats.paymentBreakdown.length > 0
    ? sessionStats.paymentBreakdown
    : [{ label: "Nenhuma venda", value: 0 }];
  const expectedTotal = sessionStats.totalRevenue;

  return (
    <div className="closing-shell app-shell">
      <SalesSidebar isCollapsed={false} active="closing" onClose={onBack} />
      <main className="closing-main">
        <SalesTopbar />
        <section className="closing-heading">
          <div className="closing-heading-text">
            <h1>Fechamento de Caixa</h1>
            <p>Confira os valores antes de encerrar o turno de trabalho.</p>
          </div>
          <button className="view-receipt-button" onClick={() => setIsReceiptOpen(true)}>
            <MaterialIcon name="receipt_long" size={24} />
            Ver Comprovante
          </button>
        </section>
        <section className="closing-grid">
          <article className="conference-panel">
            <h2>Conferência de Valores</h2>
            <div className="ghost-divider" />
            <dl>
              {breakdown.map((item) => {
                let iconName = "payments";
                if (item.label.includes("Crédito")) iconName = "credit_card";
                if (item.label.includes("Débito")) iconName = "credit_card_heart";
                if (item.label.includes("Pix")) iconName = "qr_code_scanner";
                if (item.label.includes("Alimentação")) iconName = "restaurant";
                if (item.label.includes("Refeição")) iconName = "confirmation_number";

                return (
                  <div key={item.label}>
                    <dt>
                      <span>
                        <MaterialIcon name={iconName} size={24} />
                      </span>
                      {item.label}
                    </dt>
                    <dd>{formatCurrency(item.value)}</dd>
                  </div>
                );
              })}
            </dl>
            <div className="closing-total">
              <span>TOTAL ESPERADO</span>
              <strong>{formatCurrency(expectedTotal)}</strong>
              <span>TOTAL APURADO</span>
              <em>{formatCurrency(expectedTotal)}</em>
              <small>
                <MaterialIcon name="check_circle" size={18} />
                Caixa Batido (R$ 0,00)
              </small>
              <em className="closing-divergence">Nenhuma divergência calculada para este turno</em>
            </div>
          </article>
          <section className="performance-panel">
            <h2>Performance do Turno</h2>
            <div className="turn-stats">
              <div>
                <span>Atendimentos</span>
                <strong>{sessionStats.salesCount}</strong>
              </div>
              <div>
                <span>Ticket Médio</span>
                <strong>{sessionStats.averageTicket > 0 ? formatCurrency(sessionStats.averageTicket) : "R$ 0,00"}</strong>
              </div>
            </div>
            <div className="hour-volume">
              <span>Volume por Hora</span>
              <div>
                {["08h", "09h", "10h", "11h", "12h", "13h", "14h"].map((hour, index) => (
                  <i style={{ height: `${22 + index * 8}%` }} data-hour={hour} key={hour} />
                ))}
              </div>
              <small>
                <MaterialIcon name="local_florist" size={20} />
                Pico de vendas atingido às 11h. Foco em produtos frescos.
              </small>
            </div>
          </section>
        </section>
        {isReceiptOpen && (
          <div className="receipt-modal-overlay" onClick={() => setIsReceiptOpen(false)}>
            <section className="receipt-preview" onClick={(e) => e.stopPropagation()}>
              <button className="receipt-close-btn" onClick={() => setIsReceiptOpen(false)}>
                <MaterialIcon name="close" size={24} />
              </button>
              <h3>HORTIFRUTI PREMIUM</h3>
              <span>CNPJ: 00.000.000/0001-00</span>
              <small>Fechamento de Caixa</small>
              <small>{new Date().toLocaleDateString("pt-BR")} - {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</small>
              <div className="receipt-bar" />
              <p>
                <span>Operador:</span>
                <strong>{state.session?.operatorName ?? "Terminal 01"}</strong>
              </p>
              <p>
                <span>Abertura:</span>
                <strong>{state.session ? state.session.openedAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "--:--"}</strong>
              </p>
              <p>
                <span>Fundo de Troco:</span>
                <strong>{formatCurrency(state.session?.cashFund ?? 0)}</strong>
              </p>
              <div className="receipt-bar" />
              <h4>MEIOS DE PAGAMENTO</h4>
              {breakdown.map((item) => (
                <p key={item.label}>
                  <span>{item.label}</span>
                  <strong>{formatCurrency(item.value)}</strong>
                </p>
              ))}
              <div className="receipt-bar" />
              <p>
                <span>Total Recebido</span>
                <strong>{formatCurrency(expectedTotal)}</strong>
              </p>
              <p className="green">
                <span>Diferença</span>
                <strong>R$ 0,00</strong>
              </p>
              <div className="receipt-footer">
                <span>Ethereal Harvest POS</span>
                <span>Assinatura do Operador</span>
                <div className="receipt-signature" />
              </div>
            </section>
          </div>
        )}
        <div className="fab-container">
          <button className="close-turn gradient-action" onClick={onCloseSession}>
            <MaterialIcon name="receipt_long" size={24} />
            Encerrar Turno e Gerar Comprovante
          </button>
        </div>
      </main>
    </div>
  );
}

/* HTML discount-modal: bg-white rounded-xl p-8 w-[32rem] flex flex-col gap-8 */
function DiscountModal({ onClose }: { onClose: () => void }): ReactElement {
  const { dispatch, cartSummary } = useSales();
  const [step, setStep] = useState<"type" | "value">("type");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [inputValue, setInputValue] = useState("");

  const handleSelectType = (type: "percentage" | "fixed"): void => {
    setDiscountType(type);
    setStep("value");
  };

  const handleApply = (): void => {
    const parsed = parseFloat(inputValue.replace(",", "."));
    if (isNaN(parsed) || parsed <= 0) return;

    if (discountType === "percentage" && parsed > 100) return;
    if (discountType === "fixed" && parsed > cartSummary.subtotal) return;

    dispatch({ type: "SET_DISCOUNT", discount: { type: discountType, value: parsed } });
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") handleApply();
    if (e.key === "Escape") onClose();
  };

  return (
    <div className="modal-backdrop">
      <section className="discount-modal">
        <header>
          <h2>Aplicar Desconto</h2>
          <button onClick={onClose} aria-label="Fechar">
            <MaterialIcon name="close" size={24} />
          </button>
        </header>

        {step === "type" ? (
          <>
            <p>Tipo de Desconto</p>
            <div>
              {/* HTML: shopping_basket icon text-4xl for "Por Item" */}
              <button className="selected" onClick={() => handleSelectType("percentage")}>
                <MaterialIcon name="percent" size={38} />
                Percentual (%)
              </button>
              {/* HTML: receipt_long icon text-4xl for "No Subtotal" */}
              <button onClick={() => handleSelectType("fixed")}>
                <MaterialIcon name="payments" size={38} />
                Valor Fixo (R$)
              </button>
            </div>
          </>
        ) : (
          <>
            <p>
              {discountType === "percentage"
                ? "Informe a porcentagem de desconto:"
                : "Informe o valor do desconto em R$:"}
            </p>
            <div className="discount-input-row">
              <div className="discount-input-field">
                <span>{discountType === "percentage" ? "%" : "R$"}</span>
                <input
                  // biome-ignore lint: autofocus is intentional in modal context
                  autoFocus
                  type="text"
                  inputMode="decimal"
                  placeholder={discountType === "percentage" ? "5" : "10,00"}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="discount-input-actions">
                <button className="discount-back" onClick={() => setStep("type")}>
                  <MaterialIcon name="arrow_back" size={18} />
                  Voltar
                </button>
                <button className="discount-apply gradient-action" onClick={handleApply}>
                  <MaterialIcon name="check" size={18} />
                  Aplicar
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function ParkedSalesDrawer({ onClose, onResume, onDiscard }: {
  onClose: () => void;
  onResume: (id: number) => void;
  onDiscard: (id: number) => void;
}): ReactElement {
  const { state } = useSales();
  const parked = state.parkedSales;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="parked-drawer" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>
            <MaterialIcon name="pause_circle" size={24} />
            Vendas Estacionadas
          </h2>
          <button onClick={onClose} aria-label="Fechar">
            <MaterialIcon name="close" size={24} />
          </button>
        </header>

        {parked.length === 0 ? (
          <p className="parked-empty">
            <MaterialIcon name="shopping_cart_off" size={48} />
            Nenhuma venda estacionada no momento.
          </p>
        ) : (
          <div className="parked-list">
            {parked.map((sale) => {
              const itemCount = sale.items.reduce((sum, item) => sum + item.quantity, 0);
              const subtotal = sale.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
              const timeStr = sale.parkedAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

              return (
                <article key={sale.id} className="parked-card">
                  <div className="parked-card-info">
                    <strong>{sale.label}</strong>
                    <span>{itemCount} itens · {formatCurrency(subtotal)} · {timeStr}</span>
                  </div>
                  <div className="parked-card-actions">
                    <button className="parked-resume" onClick={() => onResume(sale.id)}>
                      <MaterialIcon name="play_arrow" size={20} />
                      Retomar
                    </button>
                    <button className="parked-discard" onClick={() => onDiscard(sale.id)}>
                      <MaterialIcon name="delete" size={20} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function ProductImage({ product, className }: { product: { name: string; image?: string }; className: string }): ReactElement {
  if (product.image) {
    return <img className={className} src={product.image} alt={product.name} />;
  }

  return <div className={className}>{product.name.slice(0, 1)}</div>;
}
