import React, { useMemo } from 'react';
import { operationalTransactions } from '../data/mock';
import { buildTurnReport } from '../features/reports/turnReport.ts';

export default function Reports({ operator, shiftSales = [] }) {
  const workstationLabel = operator.workstation?.name ?? 'Caixa principal';
  const workstationId = operator.workstation?.id ?? '';
  const report = useMemo(() => {
    return buildTurnReport({
      liveSales: shiftSales,
      workstationId,
      workstationTransactions: operationalTransactions,
    });
  }, [shiftSales, workstationId]);

  return (
    <div
      className="flex-col w-full"
      style={{
        height: 'calc(100vh - 64px)',
        padding: '32px',
        overflowY: 'auto',
        gap: '32px',
      }}
    >
      <div>
        <h1 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
          Visao Geral do Turno
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
          {workstationLabel} • Operador: {operator.name}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}
      >
        <div className="card glass" style={{ padding: '32px' }}>
          <h3
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.2rem',
              marginBottom: '16px',
            }}
          >
            Vendas Brutas
          </h3>
          <div style={{ fontSize: '3rem', fontWeight: '600', color: 'var(--text-primary)' }}>
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: '500',
                marginRight: '8px',
                color: 'var(--text-tertiary)',
              }}
            >
              R$
            </span>
            {report.totalRevenue.toFixed(2).replace('.', ',')}
          </div>
        </div>
        <div className="card glass" style={{ padding: '32px' }}>
          <h3
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.2rem',
              marginBottom: '16px',
            }}
          >
            Ticket Medio
          </h3>
          <div style={{ fontSize: '3rem', fontWeight: '600', color: 'var(--primary)' }}>
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: '500',
                marginRight: '8px',
                color: 'var(--text-tertiary)',
              }}
            >
              R$
            </span>
            {report.averageTicket.toFixed(2).replace('.', ',')}
          </div>
        </div>
        <div className="card glass" style={{ padding: '32px' }}>
          <h3
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.2rem',
              marginBottom: '16px',
            }}
          >
            Transacoes Emitidas
          </h3>
          <div style={{ fontSize: '3rem', fontWeight: '600', color: 'var(--success)' }}>
            {report.totalTransactions}{' '}
            <span
              style={{
                fontSize: '1.2rem',
                fontWeight: '500',
                color: 'var(--text-tertiary)',
              }}
            >
              vendas completas
            </span>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '32px', flex: 1 }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
          <h2 style={{ color: 'var(--text-primary)' }}>
            Ultimas Operacoes de {workstationLabel}
          </h2>
          <button className="btn btn-outline">Exportar para Excel</button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '16px 8px' }}>CODIGO TRX</th>
              <th style={{ padding: '16px 8px' }}>HORARIO</th>
              <th style={{ padding: '16px 8px' }}>TOTAL ITENS</th>
              <th style={{ padding: '16px 8px', textAlign: 'right' }}>VALOR TOTAL</th>
              <th style={{ padding: '16px 8px', textAlign: 'center' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {report.transactions.map((transaction) => (
              <tr
                key={transaction.rowId}
                style={{
                  borderBottom: '1px solid var(--border-light)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.backgroundColor = 'var(--surface-200)';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <td style={{ padding: '24px 8px', fontWeight: '600' }}>{transaction.displayId}</td>
                <td style={{ padding: '24px 8px', color: 'var(--text-secondary)' }}>
                  {transaction.time}
                </td>
                <td style={{ padding: '24px 8px' }}>{transaction.items} un.</td>
                <td
                  style={{
                    padding: '24px 8px',
                    textAlign: 'right',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                  }}
                >
                  R$ {transaction.total.toFixed(2).replace('.', ',')}
                </td>
                <td style={{ padding: '24px 8px', textAlign: 'center' }}>
                  <span
                    style={{
                      backgroundColor: 'rgba(25, 128, 56, 0.1)',
                      padding: '6px 12px',
                      borderRadius: '16px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: 'var(--success)',
                    }}
                  >
                    CONCLUIDO
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
