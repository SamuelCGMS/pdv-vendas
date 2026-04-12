import React, { useMemo, useState } from 'react';
import { operationalTransactions } from '../data/mock';
import { buildOperationalSummary } from '../features/reports/operationalSummary.ts';

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function FinSummaryTile({ icon, label, value, helper, color, bgColor }) {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid var(--fin-border)',
      borderRadius: 'var(--fin-radius)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '36px', height: '36px', borderRadius: '8px',
          color: color, backgroundColor: bgColor
        }}>
          {icon}
        </div>
        <div style={{
          color: 'var(--fin-secondary)', fontSize: '0.75rem', fontWeight: '500',
          textTransform: 'uppercase', letterSpacing: '0.06em'
        }}>
          {label}
        </div>
      </div>
      <div style={{
        color: 'var(--fin-primary)', fontSize: '2.2rem', fontWeight: '300', letterSpacing: '-0.01em', marginBottom: '8px'
      }}>
        {value}
      </div>
      <div style={{ color: 'var(--fin-tertiary)', fontSize: '0.8rem', fontWeight: '400' }}>
        {helper}
      </div>
    </div>
  );
}

function FinRankingCard({ title, description, entries, emptyState }) {
  const leaderRevenue = entries[0]?.totalRevenue ?? 1;

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid var(--fin-border)',
      borderRadius: 'var(--fin-radius)',
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{
          color: 'var(--fin-primary)', fontSize: '1.05rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em'
        }}>
          {title}
        </h3>
      </div>

      {entries.length === 0 ? (
        <div style={{
          padding: '24px', border: '1px dashed var(--fin-border)', borderRadius: '8px', color: 'var(--fin-tertiary)', fontSize: '0.9rem'
        }}>
          {emptyState}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {entries.map((entry, idx) => (
            <div key={entry.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '6px',
                    backgroundColor: idx === 0 ? 'var(--fin-emerald-light)' : '#f8fafc',
                    color: idx === 0 ? 'var(--fin-emerald)' : 'var(--fin-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', fontWeight: '500'
                  }}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <div style={{ color: 'var(--fin-primary)', fontWeight: '500', fontSize: '0.95rem' }}>
                      {entry.label}
                    </div>
                    <div style={{ color: 'var(--fin-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>
                      {entry.salesCount} vendas • T.M. R$ {formatCurrency(entry.averageTicket)}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--fin-primary)', fontWeight: '400', fontSize: '1.05rem' }}>
                    R$ {formatCurrency(entry.totalRevenue)}
                  </div>
                  <div style={{ color: 'var(--fin-tertiary)', fontSize: '0.75rem', marginTop: '2px' }}>
                    {Math.round(entry.share * 100)}% dom.
                  </div>
                </div>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.max((entry.totalRevenue / leaderRevenue) * 100, 2)}%`,
                  height: '100%',
                  backgroundColor: idx === 0 ? 'var(--fin-emerald)' : 'var(--fin-indigo)',
                  borderRadius: '4px'
                }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HistoricalReports({ operator, shiftSales = [] }) {
  const [reportType, setReportType] = useState('vendas');

  const summary = useMemo(() => {
    return buildOperationalSummary({
      baseTransactions: operationalTransactions,
      liveSales: shiftSales,
    });
  }, [shiftSales]);

  const topOperator = summary.operatorSummary[0];
  const topWorkstation = summary.workstationSummary[0];

  return (
    <>
      <style>{`
        .fin-theme {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          --fin-bg: #ffffff;
          --fin-border: #e2e8f0;
          --fin-primary: #0f172a; 
          --fin-secondary: #475569;
          --fin-tertiary: #94a3b8;
          
          --fin-emerald: #10b981; 
          --fin-emerald-light: #ecfdf5; 
          --fin-indigo: #6366f1;
          --fin-indigo-light: #e0e7ff;
          --fin-amber: #f59e0b;
          --fin-amber-light: #fef3c7;
          --fin-rose: #f43f5e;
          --fin-rose-light: #ffe4e6;

          --fin-radius: 12px;
        }

        .fin-tab {
          padding: 10px 20px;
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--fin-secondary);
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
        }

        .fin-tab:hover {
          color: var(--fin-primary);
        }

        .fin-tab.active {
          color: var(--fin-primary);
          border-bottom-color: var(--fin-primary);
          font-weight: 600;
        }
      `}</style>

      <div className="flex-col w-full fin-theme" style={{
        padding: '32px 40px',
        overflowY: 'auto',
        backgroundColor: '#f8fafc', // Ultra clean slate-50 perfectly flat
        minHeight: '100%',
        gap: '32px'
      }}>

        {/* Tab Selector */}
        <div style={{ borderBottom: '1px solid var(--fin-border)', display: 'flex', gap: '8px' }}>
          <button
            className={`fin-tab ${reportType === 'vendas' ? 'active' : ''}`}
            onClick={() => setReportType('vendas')}
          >
            Resumo Financeiro
          </button>
          <button
            className={`fin-tab ${reportType === 'produtos' ? 'active' : ''}`}
            onClick={() => setReportType('produtos')}
          >
            Curva ABC
          </button>
        </div>

        {reportType === 'vendas' && (
          <div className="flex-col" style={{ gap: '24px' }}>

            {/* Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
            }}>
              <FinSummaryTile
                icon={<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm2 0v12h16V6H4zm10 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 8h1v1H7V8zm9 0h1v1h-1V8zM7 15h1v1H7v-1zm9 0h1v1h-1v-1z" /></svg>}
                label="Faturamento do Dia"
                value={`R$ ${formatCurrency(summary.totalRevenue)}`}
                helper={`${summary.totalSales} tickets emitidos`}
                color="var(--fin-emerald)"
                bgColor="var(--fin-emerald-light)"
              />
              <FinSummaryTile
                icon={<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" /><path d="M7 12h10v2H7zm0-4h10v2H7zm0 8h7v2H7z" /></svg>}
                label="Ticket Médio"
                value={`R$ ${formatCurrency(summary.averageTicket)}`}
                helper="Média consolidada do dia"
                color="var(--fin-indigo)"
                bgColor="var(--fin-indigo-light)"
              />
              <FinSummaryTile
                icon={<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>}
                label="Melhor Vendedor"
                value={topOperator?.label ?? '-'}
                helper={topOperator ? `${topOperator.salesCount} ops. • R$ ${formatCurrency(topOperator.totalRevenue)}` : 'Sem dados'}
                color="var(--fin-amber)"
                bgColor="var(--fin-amber-light)"
              />
              <FinSummaryTile
                icon={<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z" /><path d="M10 17h4v1h-4z" /></svg>}
                label="Terminal Destaque"
                value={topWorkstation?.label ?? '-'}
                helper={topWorkstation ? `R$ ${formatCurrency(topWorkstation.totalRevenue)} transacionados` : 'Sem dados'}
                color="var(--fin-rose)"
                bgColor="var(--fin-rose-light)"
              />
            </div>

            {/* Rankings Section */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '24px',
            }}>
              <FinRankingCard
                title="Performance por Operador"
                entries={summary.operatorSummary}
                emptyState="Nenhuma venda registrada."
              />
              <FinRankingCard
                title="Performance por Terminal (Caixa)"
                entries={summary.workstationSummary}
                emptyState="Nenhum terminal movimentado."
              />
            </div>

          </div>
        )}

        {reportType === 'produtos' && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--fin-radius)',
            border: '1px solid var(--fin-border)',
            padding: '32px'
          }}>
            <h3 style={{
              color: 'var(--fin-primary)', fontSize: '1.05rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '24px'
            }}>
              Curva ABC
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--fin-border)', color: 'var(--fin-tertiary)' }}>
                  <th style={{ padding: '12px 16px', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '500' }}>Produto</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '500' }}>Qtd Vendida</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '500' }}>Receita Gerada</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '500' }}>Share %</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Pao Frances Kg', quantity: 340, revenue: 2784.5, share: 28 },
                  { name: 'Coca-Cola 2L', quantity: 198, revenue: 1762.2, share: 21 },
                  { name: 'Leite Integral 1L', quantity: 286, revenue: 1310.7, share: 16 },
                  { name: 'Cerveja Lata 350ml', quantity: 244, revenue: 1195.6, share: 14 },
                  { name: 'Manteiga Extra 200g', quantity: 122, revenue: 968.4, share: 11 },
                ].map((product, index) => (
                  <tr key={product.name} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '20px 16px', fontWeight: '500', fontSize: '0.95rem', color: 'var(--fin-primary)' }}>
                      {index + 1}. {product.name}
                    </td>
                    <td style={{ padding: '20px 16px', fontSize: '0.90rem', color: 'var(--fin-secondary)' }}>
                      {product.quantity.toLocaleString('pt-BR')} un.
                    </td>
                    <td style={{ padding: '20px 16px', color: 'var(--fin-emerald)', fontWeight: '400', fontSize: '0.95rem' }}>
                      R$ {formatCurrency(product.revenue)}
                    </td>
                    <td style={{ padding: '20px 16px' }}>
                      <span style={{
                        backgroundColor: '#f8fafc',
                        color: 'var(--fin-secondary)',
                        padding: '4px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                      }}>
                        {product.share}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
