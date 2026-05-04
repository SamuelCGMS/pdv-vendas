import { useMemo, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { PanelLeft } from "lucide-react";

import { MaterialIcon } from "@shared/components/MaterialIcon";
import { filterProducts, formatCurrency } from "@shared/domain/pos";
import { cartItems, operators, paymentBreakdown, products } from "@shared/mocks/pos";

type SalesScreen = "opening" | "sales" | "payment" | "closing";
type PaymentMethod = "card" | "cash" | "pix" | "ticket";

export function SalesApp(): ReactElement {
  const [screen, setScreen] = useState<SalesScreen>(() => getInitialSalesScreen());
  const [query, setQuery] = useState("");
  const [discountOpen, setDiscountOpen] = useState(() => shouldOpenDiscountModal());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const payment = { discountAmount: 17.5, total: 342.5 };

  if (screen === "opening") {
    return <OpeningScreen onOpen={() => setScreen("sales")} />;
  }

  if (screen === "payment") {
    return (
      <PaymentScreen
        method={paymentMethod}
        payment={payment}
        onBack={() => setScreen("sales")}
        onChangeMethod={setPaymentMethod}
      />
    );
  }

  if (screen === "closing") {
    return <ClosingScreen onBack={() => setScreen("sales")} />;
  }

  return (
    <div className="sales-shell app-shell">
      <SalesSidebar isCollapsed={isSidebarCollapsed} onClose={() => setScreen("closing")} />
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
              {query.length > 24 ? <SearchResults query={query} /> : null}
            </div>
            <CartList />
          </div>
          <CheckoutPanel
            onPayment={() => setScreen("payment")}
            onDiscount={() => setDiscountOpen(true)}
          />
        </section>
      </main>
      {discountOpen ? <DiscountModal onClose={() => setDiscountOpen(false)} /> : null}
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

  return (
    <div className="opening-screen">
      <header className="opening-header">
        <div className="opening-brand">LINEN & LEAF</div>
        <div className="opening-time">
          {/* HTML: clock icon → material-symbols */}
          <MaterialIcon name="schedule" size={20} />
          <span>08:42 AM</span>
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
            <input id="cash-fund" placeholder="0,00" inputMode="decimal" />
          </div>
          <button className="open-register gradient-action" onClick={onOpen}>
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
function SalesSidebar({ onClose, active = "sales", isCollapsed = false }: { onClose: () => void; active?: "sales" | "closing"; isCollapsed?: boolean }): ReactElement {
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
      <button className="new-sale gradient-action">
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
        <span>João Silva</span>
        <img className="mini-avatar" src="/ui-assets/brand/manager.png" alt="João Silva" />
      </div>
    </header>
  );
}

function SearchResults({ query }: { query: string }): ReactElement | null {
  const results = useMemo(() => filterProducts(products, query).slice(0, 2), [query]);

  if (!query || results.length === 0) {
    return null;
  }

  return (
    <div className="search-results">
      {results.map((product) => (
        <button key={product.id}>
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

function CartList(): ReactElement {
  return (
    <div className="cart-list" aria-label="Itens da venda">
      {cartItems.map((item) => {
        const display = getCartItemDisplay(item);

        return (
          <article className="sale-item" key={item.product.id}>
            <ProductImage product={item.product} className="produce-tile" />
            <div className="sale-item-name">
              <strong>{item.product.name}</strong>
              <span>{display.unitPrice}</span>
            </div>
            <div className="quantity-pill">
              {/* HTML: remove icon text-lg */}
              <button aria-label="Diminuir">
                <MaterialIcon name="remove" size={18} />
              </button>
              <span>{display.quantity}</span>
              {/* HTML: add icon text-lg */}
              <button aria-label="Aumentar">
                <MaterialIcon name="add" size={18} />
              </button>
            </div>
            <strong className="line-total">{display.lineTotal}</strong>
          </article>
        );
      })}
    </div>
  );
}

function getCartItemDisplay(item: (typeof cartItems)[number]): { unitPrice: string; quantity: string; lineTotal: string } {
  if (item.product.id === "purple-grapes") {
    return {
      unitPrice: "R$6,90 / 500g",
      quantity: "01",
      lineTotal: "R$6,90",
    };
  }

  if (item.product.id === "organic-spinach") {
    return {
      unitPrice: "R$3,10 / maço",
      quantity: "02",
      lineTotal: "R$2,49",
    };
  }

  return {
    unitPrice: `${formatCurrency(item.product.price).replace(" ", "")} / ${item.product.unit}`,
    quantity: String(item.quantity).padStart(2, "0"),
    lineTotal: formatCurrency(item.product.price * item.quantity).replace(" ", ""),
  };
}

function CheckoutPanel({ onPayment, onDiscount }: { onPayment: () => void; onDiscount: () => void }): ReactElement {
  return (
    <aside className="checkout-panel">
      <div className="checkout-top-section">
        <div className="checkout-heading">
          <h2>Carrinho Atual</h2>
          <button>
            <MaterialIcon name="delete_sweep" size={14} />
            [ESC] Limpar
          </button>
        </div>
        <section className="total-card">
          <span>TOTAL A PAGAR</span>
          <strong>
            <small>R$</small>
            12,55
          </strong>
        </section>
      </div>

      <div className="checkout-mid-section">
        <section className="summary-card">
          <h3>Resumo da Venda</h3>
          <dl>
            <div>
              <dt>Total de Itens</dt>
              <dd>3 unid.</dd>
            </div>
            <div>
              <dt>Peso Total</dt>
              <dd>2.150 kg</dd>
            </div>
            <div>
              <dt>Descontos</dt>
              <dd className="green">- R$ 0,00</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="payment-shortcuts">
        <h3>SELECIONE O MÉTODO DE PAGAMENTO</h3>
        <div className="payment-methods-grid">
          <button className="selected">
            <MaterialIcon name="credit_card" size={24} />
            Cartão [F6]
          </button>
          <button>
            <MaterialIcon name="payments" size={24} />
            Dinheiro [F7]
          </button>
          <button>
            <MaterialIcon name="qr_code_2" size={24} />
            Pix [F8]
          </button>
        </div>
        <div className="checkout-actions-wrapper">
          <button className="finish-sale" onClick={onPayment}>
            Finalizar Venda <span>[F12]</span>
          </button>
          <div className="checkout-actions">
            <button>
              <MaterialIcon name="pause_circle" size={18} />
              Estacionar [F10]
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
  method,
  payment,
  onBack,
  onChangeMethod,
}: {
  method: PaymentMethod;
  payment: { discountAmount: number; total: number };
  onBack: () => void;
  onChangeMethod: (method: PaymentMethod) => void;
}): ReactElement {
  const methods: Array<{ id: PaymentMethod; label: string; icon: ReactNode }> = [
    { id: "card", label: "Cartão", icon: <MaterialIcon name="credit_card" size={34} /> },
    { id: "pix", label: "Pix", icon: <MaterialIcon name="qr_code_2" size={34} /> },
    { id: "cash", label: "Dinheiro", icon: <MaterialIcon name="payments" size={34} /> },
    { id: "ticket", label: "Ticket", icon: <MaterialIcon name="receipt_long" size={34} /> },
  ];

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
          <strong>{formatCurrency(payment.total)}</strong>
          <div>
            <small>
              <MaterialIcon name="receipt" size={18} />
              5 Itens
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
            <span>Pedido #4092</span>
          </div>
          <dl className="payment-lines">
            <div>
              <dt>Subtotal</dt>
              <dd>R$ 360,00</dd>
            </div>
            <div className="green">
              <dt>Desconto (5%)</dt>
              <dd>- {formatCurrency(payment.discountAmount)}</dd>
            </div>
            <div className="final">
              <dt>Total Final</dt>
              <dd>{formatCurrency(payment.total)}</dd>
            </div>
          </dl>
          <h2>Método de Pagamento</h2>
          <div className="method-grid">
            {methods.map((item) => (
              <button
                className={item.id === method ? "selected" : ""}
                key={item.id}
                onClick={() => onChangeMethod(item.id)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
          <div className="payment-actions">
            <button className="confirm-payment">
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

function ClosingScreen({ onBack }: { onBack: () => void }): ReactElement {
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const expectedTotal = paymentBreakdown.reduce((sum, item) => sum + item.value, 0);

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
              {paymentBreakdown.map((item) => {
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
                <strong>142</strong>
              </div>
              <div>
                <span>Ticket Médio</span>
                <strong>R$ 29,90</strong>
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
              <small>24/10/2023 - 18:45</small>
              <div className="receipt-bar" />
              <p>
                <span>Operador:</span>
                <strong>Terminal 01</strong>
              </p>
              <p>
                <span>Abertura:</span>
                <strong>08:00</strong>
              </p>
              <p>
                <span>Fundo de Troco:</span>
                <strong>R$ 100,00</strong>
              </p>
              <div className="receipt-bar" />
              <h4>MEIOS DE PAGAMENTO</h4>
              {paymentBreakdown.map((item) => (
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
          <button className="close-turn gradient-action">
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
  return (
    <div className="modal-backdrop">
      <section className="discount-modal">
        <header>
          <h2>Aplicar Desconto</h2>
          <button onClick={onClose} aria-label="Fechar">
            <MaterialIcon name="close" size={24} />
          </button>
        </header>
        <p>Tipo de Desconto: Item ou Subtotal?</p>
        <div>
          {/* HTML: shopping_basket icon text-4xl for "Por Item" */}
          <button className="selected" onClick={onClose}>
            <MaterialIcon name="shopping_basket" size={38} />
            Por Item
          </button>
          {/* HTML: receipt_long icon text-4xl for "No Subtotal" */}
          <button onClick={onClose}>
            <MaterialIcon name="receipt_long" size={38} />
            No Subtotal
          </button>
        </div>
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
