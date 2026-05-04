import {
  CalendarDays,
  FileDown,
  Leaf,
  MoreVertical,
  Plus,
  Star,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactElement } from "react";

import { MaterialIcon } from "@shared/components/MaterialIcon";
import { formatCurrency } from "@shared/domain/pos";
import { products, recentTransactions } from "@shared/mocks/pos";

type ManagementScreen = "inventory" | "reports";

type InventoryRow = {
  id: string;
  name: string;
  code: string;
  category: string;
  categoryTone: "secondary" | "tertiary";
  stockLabel: string;
  stockPercent: number;
  lowStock?: boolean;
  priceLabel: string;
  image?: string;
};

export function ManagementApp(): ReactElement {
  const [screen, setScreen] = useState<ManagementScreen>(() => getInitialManagementScreen());

  return (
    <div className="management-shell app-shell">
      <ManagementSidebar active={screen} onNavigate={setScreen} />
      <main className="management-main">
        <ManagementTopbar placeholder={screen === "inventory" ? "Buscar no estoque..." : "Buscar relatórios..."} />
        {screen === "inventory" ? <InventoryScreen /> : <ReportsScreen />}
      </main>
    </div>
  );
}

function getInitialManagementScreen(): ManagementScreen {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get("screen") === "reports" ? "reports" : "inventory";
}

function ManagementSidebar({
  active,
  onNavigate,
}: {
  active: ManagementScreen;
  onNavigate: (screen: ManagementScreen) => void;
}): ReactElement {
  return (
    <aside className="management-sidebar">
      <div className="management-brand">
        <div className="brand-mark">
          <Leaf size={24} fill="currentColor" />
        </div>
        <div>
          <strong>BonsFrutos</strong>
          <span>PREMIUM EDITORIAL</span>
        </div>
      </div>
      <nav className="management-nav">
        <button>
          <MaterialIcon name="receipt_long" size={22} />
          Vendas
        </button>
        <button className={active === "inventory" ? "active" : ""} onClick={() => onNavigate("inventory")}>
          <MaterialIcon
            name="inventory_2"
            size={22}
            style={{ fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}
          />
          Estoque
        </button>
        <button className={active === "reports" ? "active" : ""} onClick={() => onNavigate("reports")}>
          <MaterialIcon name="assessment" size={22} />
          Análise
        </button>
        <button>
          <MaterialIcon name="local_shipping" size={22} />
          Fornecedores
        </button>
        <button>
          <MaterialIcon name="settings" size={22} />
          Configurações
        </button>
      </nav>
      <button className="management-exit">
        <MaterialIcon name="logout" size={20} />
        Sair
      </button>
    </aside>
  );
}

function ManagementTopbar({ placeholder }: { placeholder: string }): ReactElement {
  return (
    <header className="management-topbar">
      <div className="management-topbar-main">
        <h1>Linen &amp; Leaf</h1>
        <label className="management-search">
          <MaterialIcon name="search" size={16} />
          <input placeholder={placeholder} />
        </label>
      </div>
      <nav>
        <button aria-label="Notificações">
          <MaterialIcon name="notifications" size={24} />
        </button>
        <button aria-label="Configurações">
          <MaterialIcon name="settings" size={24} />
        </button>
        <div className="manager-avatar-container">
          <img
            className="manager-avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrPv8Tyd601n5kNJuV8u9fChdqj4hNqYglLgrpT1jaUd1L08ta49m_Na3LoakvQ846D80fwm3QKJMsK0BjwPMeEk5a7hXrVcNtKKwjrNCxiMJS8usV5OL00lmDUacI6dwinJ_d7KVwjHifWp0X--lKXtDie64F56hoA_nQK7ufPwhbzhbs8gbrCccCK1zGHlJAYZM6lOOiIU53nxoGPG3dJ5s85W_widmvN7qFMR_vXHW4gVgkkt3L6zFfZXUC_V1tFcQXs32lxPE_"
            alt="Manager Profile"
          />
        </div>
      </nav>
    </header>
  );
}

function InventoryScreen(): ReactElement {
  const [query, setQuery] = useState("");
  const inventoryRows = useMemo<InventoryRow[]>(
    () => [
      {
        id: "couve-organica",
        name: "Couve Orgânica",
        code: "LL-VG-001",
        category: "Vegetais",
        categoryTone: "secondary",
        stockLabel: "142 un.",
        stockPercent: 85,
        priceLabel: "R$ 5,90",
        image: products.find((product) => product.id === "couve-organica")?.image,
      },
      {
        id: "tomato-heirloom",
        name: "Tomate Heirloom",
        code: "LL-VG-042",
        category: "Vegetais",
        categoryTone: "secondary",
        stockLabel: "8 kg",
        stockPercent: 12,
        lowStock: true,
        priceLabel: "R$ 18,40",
        image: products.find((product) => product.id === "tomato-heirloom")?.image,
      },
      {
        id: "mel-manuka",
        name: "Mel de Manuka Floral",
        code: "LL-PN-210",
        category: "Despensa",
        categoryTone: "tertiary",
        stockLabel: "24 un.",
        stockPercent: 45,
        priceLabel: "R$ 112,00",
        image: products.find((product) => product.id === "mel-manuka")?.image,
      },
      {
        id: "mix-folhas",
        name: "Mix de Folhas Baby",
        code: "LL-VG-015",
        category: "Vegetais",
        categoryTone: "secondary",
        stockLabel: "56 pct.",
        stockPercent: 68,
        priceLabel: "R$ 12,90",
        image: products.find((product) => product.id === "mix-folhas")?.image,
      },
    ],
    [],
  );

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return inventoryRows;
    }

    return inventoryRows.filter((product) => {
      const haystack = `${product.name} ${product.code} ${product.category}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [inventoryRows, query]);

  return (
    <section className="inventory-screen">
      <div className="management-title-row">
        <div>
          <h2>Gestão de Estoque</h2>
          <p>Visão geral e controle de suprimentos Linen &amp; Leaf</p>
        </div>
        <div className="inventory-actions">
          <button aria-label="Visualizar">
            <MaterialIcon name="visibility" size={18} />
          </button>
          <button>
            <MaterialIcon name="file_download" size={16} />
            Exportar
          </button>
          <button className="gradient-action">
            <MaterialIcon name="add" size={16} />
            Novo Produto
          </button>
        </div>
      </div>

      <label className="inventory-local-search">
        <MaterialIcon name="search" size={16} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar no estoque..." />
      </label>

      <div className="metric-grid">
        <MetricCard label="Total de Itens" value="1,284" tone="neutral" icon={<MaterialIcon name="inventory" size={96} />} />
        <MetricCard label="Alerta de Estoque Baixo" value="12" suffix="produtos" tone="error" icon={<MaterialIcon name="warning" size={96} />} />
        <MetricCard label="Valor Total em Estoque" value="R$ 42.190" tone="success" icon={<MaterialIcon name="payments" size={96} />} />
      </div>

      <div className="inventory-filter-row">
        <button className="inventory-filter">
          <MaterialIcon name="filter_list" size={16} />
          Filtrar
        </button>
      </div>

      <section className="inventory-table">
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Estoque</th>
              <th className="align-right">Preço</th>
              <th className="align-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="inventory-product">
                    <ProductImage product={product} className="inventory-thumb" />
                    <span>
                      <strong>{product.name}</strong>
                      <small>{product.code}</small>
                    </span>
                  </div>
                </td>
                <td>
                  <span className={`category-chip ${product.categoryTone}`}>{product.category}</span>
                </td>
                <td>
                  <div className="stock-cell">
                    <span className={product.lowStock ? "low-stock" : ""}>{product.stockLabel}</span>
                    <div className="stock-bar">
                      <i className={product.lowStock ? "low-stock" : ""} style={{ width: `${product.stockPercent}%` }} />
                    </div>
                  </div>
                </td>
                <td className="inventory-price-cell">{product.priceLabel}</td>
                <td className="inventory-action-cell">
                  <button aria-label={`Ações de ${product.name}`}>
                    <MaterialIcon name="more_vert" size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <footer>
          <span>Exibindo 1-4 de 1.284 produtos</span>
          <nav>
            <button aria-label="Página anterior">
              <MaterialIcon name="chevron_left" size={18} />
            </button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button aria-label="Próxima página">
              <MaterialIcon name="chevron_right" size={18} />
            </button>
          </nav>
        </footer>
      </section>
    </section>
  );
}

function MetricCard({
  label,
  value,
  suffix,
  tone,
  icon,
}: {
  label: string;
  value: string;
  suffix?: string;
  tone: "neutral" | "error" | "success";
  icon: ReactElement;
}): ReactElement {
  return (
    <article className={`metric-card ${tone}`}>
      <span>{label}</span>
      <div className="metric-value-row">
        <strong>{value}</strong>
        {suffix ? <small>{suffix}</small> : null}
      </div>
      <i aria-hidden="true">{icon}</i>
    </article>
  );
}

function ProductImage({
  product,
  className,
}: {
  product: { name: string; image?: string };
  className: string;
}): ReactElement {
  if (product.image) {
    return <img className={className} src={product.image} alt={product.name} />;
  }

  return <div className={className}>{product.name.slice(0, 1)}</div>;
}

function ReportsScreen(): ReactElement {
  return (
    <section className="reports-screen">
      <div className="management-title-row">
        <div>
          <h2>Relatórios Gerenciais</h2>
          <p>Visão consolidada do seu ecossistema comercial</p>
        </div>
        <div className="reports-actions">
          <button className="report-range-button">
            <MaterialIcon name="calendar_today" size={14} />
            Últimos 30 dias
          </button>
          <button className="report-export">
            <MaterialIcon name="download" size={14} />
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="report-metrics">
        <ReportMetric
          label="Total Vendido"
          prefix="R$"
          value="142.850"
          delta="+12%"
          sparkHeights={[30, 50, 40, 70, 90, 60, 100]}
          sparkTone="primary"
        />
        <ReportMetric
          label="Ticket Médio"
          prefix="R$"
          value="384,20"
          delta="+5.4%"
          sparkHeights={[60, 80, 50, 40, 95, 70, 85]}
          sparkTone="secondary"
        />
        <ReportMetric
          label="Novos Clientes"
          value="1.248"
          suffix="/mês"
          delta="-2%"
          negative
          sparkHeights={[40, 60, 85, 100, 70, 50, 35]}
          sparkTone="tertiary"
        />
      </div>

      <div className="report-grid">
        <article className="payment-chart-panel">
          <div className="report-panel-head">
            <h3>Vendas por Método de Pagamento</h3>
            <button aria-label="Mais opções">
              <MoreVertical size={18} />
            </button>
          </div>
          <div className="donut-chart">
            <span>842</span>
            <small>PEDIDOS</small>
          </div>
          <dl>
            <div>
              <dt>
                <i className="legend-dot primary" />
                Cartão
              </dt>
              <dd>45%</dd>
            </div>
            <div>
              <dt>
                <i className="legend-dot secondary" />
                Pix
              </dt>
              <dd>30%</dd>
            </div>
            <div>
              <dt>
                <i className="legend-dot tertiary" />
                Dinheiro
              </dt>
              <dd>15%</dd>
            </div>
          </dl>
        </article>

        <article className="performance-panel">
          <span>Análise de Performance</span>
          <h3>
            O faturamento aumentou <strong>24%</strong> nos fins de semana em relação ao mês passado
          </h3>
          <div>
            <section>
              <small>Produto Estrela</small>
              <div className="performance-inline">
                <i className="performance-badge star">
                  <Star size={16} />
                </i>
                <div>
                  <strong>Banana Prata</strong>
                  <span>245 unidades vendidas</span>
                </div>
              </div>
            </section>
            <section>
              <small>Conversão</small>
              <div className="performance-inline">
                <i className="performance-badge bolt">
                  <Zap size={16} />
                </i>
                <div>
                  <strong>8.4% Conversion Rate</strong>
                  <span>Acima da média setorial</span>
                </div>
              </div>
            </section>
          </div>
          <button className="performance-plus" aria-label="Mais detalhes">
            <Plus size={20} />
          </button>
        </article>
      </div>

      <section className="cash-flow-panel">
        <header>
          <div>
            <h3>Fluxo de Caixa</h3>
            <span>Entradas vs Saídas acumuladas por semana</span>
          </div>
          <div className="cash-flow-legend">
            <div>
              <i className="primary" />
              Entradas
            </div>
            <div>
              <i className="muted" />
              Saídas
            </div>
          </div>
        </header>
        <div className="bar-chart-grid" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="bar-chart">
          {[
            { entry: 50, exit: 30 },
            { entry: 65, exit: 25 },
            { entry: 45, exit: 40 },
            { entry: 75, exit: 20 },
            { entry: 60, exit: 15 },
          ].map((bar, index) => (
            <div className="bar-pair" key={`sem-${index + 1}`}>
              <div className="bar-stack">
                <em style={{ height: `${bar.exit}%` }} />
                <i style={{ height: `${bar.entry}%` }} />
              </div>
              <span>SEM 0{index + 1}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="transactions-panel">
        <h3>Últimas Transações</h3>
        <header className="transactions-head">
          <span>CLIENTE</span>
          <span>DATA</span>
          <span>STATUS</span>
          <span>VALOR</span>
        </header>
        {recentTransactions.map((transaction) => (
          <article key={`${transaction.customer}-${transaction.date}`}>
            <div className="transaction-customer">
              <span>{transaction.customer.slice(0, 2).toUpperCase()}</span>
              <strong>{transaction.customer}</strong>
            </div>
            <small>{transaction.date}</small>
            <em className={transaction.status === "Pendente" ? "pending" : ""}>{transaction.status}</em>
            <b>{formatCurrency(transaction.value)}</b>
          </article>
        ))}
      </section>
    </section>
  );
}

function ReportMetric({
  label,
  prefix,
  value,
  suffix,
  delta,
  negative,
  sparkHeights,
  sparkTone,
}: {
  label: string;
  prefix?: string;
  value: string;
  suffix?: string;
  delta: string;
  negative?: boolean;
  sparkHeights: number[];
  sparkTone: "primary" | "secondary" | "tertiary";
}): ReactElement {
  return (
    <article className="report-metric">
      <span>{label}</span>
      <strong>
        {prefix ? <small>{prefix}</small> : null}
        {value}
        {suffix ? <small>{suffix}</small> : null}
      </strong>
      <div className="report-metric-footer">
        <div className={`metric-spark ${sparkTone}`} aria-hidden="true">
          {sparkHeights.map((height, index) => (
            <b style={{ height: `${height}%` }} key={`${sparkTone}-${index}`} />
          ))}
        </div>
        <i className={negative ? "negative" : ""}>{delta}</i>
      </div>
    </article>
  );
}
