import React, { useMemo, useState } from 'react';
import { operationalTransactions } from '../data/mock';
import { buildOperationalSummary } from '../features/reports/operationalSummary.ts';

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function SummaryTile({ accentColor, label, value, helper }) {
  return (
    <div
      className="card glass"
      style={{
        padding: '28px',
        borderTop: `4px solid ${accentColor}`,
      }}
    >
      <div
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.95rem',
          fontWeight: '700',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '14px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: 'var(--text-primary)',
          fontSize: '2.6rem',
          fontWeight: '800',
          lineHeight: 1,
          marginBottom: '10px',
        }}
      >
        {value}
      </div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{helper}</div>
    </div>
  );
}

function RankingCard({ accentColor, description, emptyState, entries, title }) {
  const leaderRevenue = entries[0]?.totalRevenue ?? 1;

  return (
    <div className="card glass flex-col" style={{ padding: '28px', gap: '20px' }}>
      <div>
        <h3
          style={{
            color: 'var(--text-primary)',
            fontSize: '1.5rem',
            marginBottom: '8px',
            fontWeight: '800',
          }}
        >
          {title}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{description}</p>
      </div>

      {entries.length === 0 ? (
        <div
          style={{
            border: '1px dashed var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--surface-200)',
          }}
        >
          {emptyState}
        </div>
      ) : (
        <div className="flex-col" style={{ gap: '14px' }}>
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              style={{
                backgroundColor: 'var(--surface-100)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px 18px 16px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div className="flex justify-between items-center" style={{ marginBottom: '12px', gap: '16px' }}>
                <div>
                  <div className="flex items-center gap-2" style={{ marginBottom: '6px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '30px',
                        height: '30px',
                        borderRadius: '999px',
                        backgroundColor: index === 0 ? accentColor : 'var(--surface-200)',
                        color: index === 0 ? 'var(--text-white)' : 'var(--text-primary)',
                        fontSize: '0.85rem',
                        fontWeight: '800',
                      }}
                    >
                      #{index + 1}
                    </span>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '1.05rem' }}>
                      {entry.label}
                    </strong>
                  </div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {entry.salesCount} vendas • Ticket medio R$ {formatCurrency(entry.averageTicket)}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: accentColor, fontWeight: '800', fontSize: '1.2rem' }}>
                    R$ {formatCurrency(entry.totalRevenue)}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {Math.round(entry.share * 100)}% do dia
                  </div>
                </div>
              </div>

              <div
                style={{
                  width: '100%',
                  height: '10px',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  backgroundColor: 'var(--surface-200)',
                }}
              >
                <div
                  style={{
                    width: `${Math.max((entry.totalRevenue / leaderRevenue) * 100, 8)}%`,
                    height: '100%',
                    borderRadius: '999px',
                    background: `linear-gradient(90deg, ${accentColor}, rgba(15, 98, 254, 0.16))`,
                  }}
                />
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
  const todayLabel = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const summary = useMemo(() => {
    return buildOperationalSummary({
      baseTransactions: operationalTransactions,
      liveSales: shiftSales,
    });
  }, [shiftSales]);

  const topOperator = summary.operatorSummary[0];
  const topWorkstation = summary.workstationSummary[0];
  const currentWorkstation = operator.workstation?.name ?? 'Caixa principal';

  return (
    <div className="flex-col w-full" style={{ padding: '32px', overflowY: 'auto', gap: '24px' }}>
      <div className="flex justify-between items-center" style={{ gap: '24px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
            Relatorios Gerenciais
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '760px' }}>
            Area gerencial do dia com comparativo rapido por operador e por caixa.
            Aqui, caixa representa estacao ou ponto de venda.
          </p>
        </div>

        <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
          <div
            className="card glass"
            style={{
              padding: '14px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              minWidth: '220px',
            }}
          >
            <span
              style={{
                color: 'var(--text-tertiary)',
                fontSize: '0.78rem',
                fontWeight: '700',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Recorte do dia
            </span>
            <strong style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>{todayLabel}</strong>
          </div>
          <button className="btn btn-outline" style={{ padding: '12px 24px', fontWeight: '700' }}>
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="flex gap-4" style={{ borderBottom: '2px solid var(--border)', paddingBottom: '16px' }}>
        <button
          onClick={() => setReportType('vendas')}
          style={{
            backgroundColor: 'transparent',
            color: reportType === 'vendas' ? 'var(--primary)' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: reportType === 'vendas' ? '4px solid var(--primary)' : '4px solid transparent',
            borderRadius: 0,
            padding: '8px 16px',
            fontSize: '1.1rem',
            fontWeight: reportType === 'vendas' ? '800' : '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Resumo Operacional
        </button>
        <button
          onClick={() => setReportType('produtos')}
          style={{
            backgroundColor: 'transparent',
            color: reportType === 'produtos' ? 'var(--primary)' : 'var(--text-secondary)',
            border: 'none',
            borderBottom: reportType === 'produtos' ? '4px solid var(--primary)' : '4px solid transparent',
            borderRadius: 0,
            padding: '8px 16px',
            fontSize: '1.1rem',
            fontWeight: reportType === 'produtos' ? '800' : '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Curva ABC de Produtos
        </button>
      </div>

      {reportType === 'vendas' && (
        <div className="flex-col" style={{ gap: '24px' }}>
          <div
            className="card glass"
            style={{
              padding: '28px',
              background:
                'linear-gradient(135deg, rgba(15, 98, 254, 0.12), rgba(255, 255, 255, 0.92) 48%, rgba(25, 128, 56, 0.08))',
            }}
          >
            <div className="flex justify-between" style={{ gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ maxWidth: '720px' }}>
                <div
                  style={{
                    color: 'var(--primary)',
                    fontSize: '0.82rem',
                    fontWeight: '800',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '10px',
                  }}
                >
                  Sprint 2 • Resumo Operacional
                </div>
                <h2
                  style={{
                    color: 'var(--text-primary)',
                    fontSize: '2rem',
                    lineHeight: 1.1,
                    marginBottom: '12px',
                  }}
                >
                  Resumo por operador e por caixa na mesma area gerencial
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
                  O comparativo abaixo mistura a base operacional do dia com as vendas da sessao atual.
                  Isso permite leitura rapida do desempenho por pessoa e por estacao sem confundir caixa
                  com abertura ou fechamento.
                </p>
              </div>

              <div className="flex-col" style={{ gap: '12px', minWidth: '260px' }}>
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.76)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px 18px',
                    border: '1px solid rgba(15, 98, 254, 0.12)',
                  }}
                >
                  <div
                    style={{
                      color: 'var(--text-tertiary)',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                    }}
                  >
                    Sessao atual
                  </div>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>{operator.name}</strong>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {currentWorkstation} • {shiftSales.length} venda(s) na sessao
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.76)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px 18px',
                    border: '1px solid rgba(25, 128, 56, 0.12)',
                  }}
                >
                  <div
                    style={{
                      color: 'var(--text-tertiary)',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                    }}
                  >
                    Leitura rapida
                  </div>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>
                    Lider atual: {topOperator?.label ?? 'Sem vendas'}
                  </strong>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Estacao mais forte: {topWorkstation?.label ?? 'Sem dados'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
            }}
          >
            <SummaryTile
              accentColor="var(--primary)"
              label="Faturamento do dia"
              value={`R$ ${formatCurrency(summary.totalRevenue)}`}
              helper="Base operacional do dia + sessao atual"
            />
            <SummaryTile
              accentColor="var(--success)"
              label="Vendas concluidas"
              value={summary.totalSales.toLocaleString('pt-BR')}
              helper="Comparativo consolidado entre operadores e estacoes"
            />
            <SummaryTile
              accentColor="var(--warning)"
              label="Ticket medio"
              value={`R$ ${formatCurrency(summary.averageTicket)}`}
              helper="Media por venda no recorte atual"
            />
            <SummaryTile
              accentColor="#5E35B1"
              label="Operador lider"
              value={topOperator?.label ?? 'Sem vendas'}
              helper={
                topOperator
                  ? `${topOperator.salesCount} vendas • R$ ${formatCurrency(topOperator.totalRevenue)}`
                  : 'Aguardando a primeira venda'
              }
            />
            <SummaryTile
              accentColor="#E8590C"
              label="Caixa lider"
              value={topWorkstation?.label ?? 'Sem vendas'}
              helper={
                topWorkstation
                  ? `${topWorkstation.salesCount} vendas • R$ ${formatCurrency(topWorkstation.totalRevenue)}`
                  : 'Nenhuma estacao movimentada'
              }
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '24px',
            }}
          >
            <RankingCard
              accentColor="var(--primary)"
              description="Comparativo do dia atual com total vendido, volume e ticket medio por operador."
              emptyState="Nenhuma venda registrada por operador no recorte atual."
              entries={summary.operatorSummary}
              title="Resumo por operador"
            />
            <RankingCard
              accentColor="var(--success)"
              description="Caixa aqui significa estacao ou ponto de venda, separado da sessao de abertura e fechamento."
              emptyState="Nenhuma estacao movimentada no recorte atual."
              entries={summary.workstationSummary}
              title="Resumo por caixa"
            />
          </div>
        </div>
      )}

      {reportType === 'produtos' && (
        <div className="card glass flex-col" style={{ padding: '32px' }}>
          <h3
            style={{
              color: 'var(--text-primary)',
              fontSize: '1.5rem',
              marginBottom: '12px',
              fontWeight: '800',
            }}
          >
            Curva ABC de Produtos
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '720px' }}>
            Visao complementar para o gerente priorizar sortimento e margem sem sair da area de relatorios.
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px' }}>PRODUTO</th>
                <th style={{ padding: '16px' }}>QTD VENDIDA</th>
                <th style={{ padding: '16px' }}>RECEITA GERADA</th>
                <th style={{ padding: '16px' }}>SHARE %</th>
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
                <tr key={product.name} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td
                    style={{
                      padding: '24px 16px',
                      fontWeight: '700',
                      fontSize: '1.05rem',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {index + 1}. {product.name}
                  </td>
                  <td style={{ padding: '24px 16px', fontSize: '1rem' }}>
                    {product.quantity.toLocaleString('pt-BR')} un.
                  </td>
                  <td
                    style={{
                      padding: '24px 16px',
                      color: 'var(--success)',
                      fontWeight: '800',
                      fontSize: '1rem',
                    }}
                  >
                    R$ {formatCurrency(product.revenue)}
                  </td>
                  <td style={{ padding: '24px 16px' }}>
                    <span
                      style={{
                        backgroundColor: 'var(--surface-200)',
                        color: 'var(--text-primary)',
                        padding: '6px 16px',
                        borderRadius: '16px',
                        fontWeight: '700',
                      }}
                    >
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
  );
}
