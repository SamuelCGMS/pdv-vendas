import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function HistoricalReports() {
  const [period, setPeriod] = useState('hoje');
  const [reportType, setReportType] = useState('vendas');

  const getMockData = () => {
    let multiplier = 1;
    if (period === 'semana') multiplier = 7;
    if (period === 'mes') multiplier = 30;
    if (period === 'ano') multiplier = 365;

    const revenue = 2450.00 * multiplier;
    
    // Gráfico Evolutivo Dinâmico respectivo ao período
    let chartData = [];
    if (period === 'hoje') {
      chartData = Array.from({ length: 8 }).map((_, i) => ({ name: `${8 + i * 2}h`, value: Math.floor(Math.random() * 500 + 100) }));
    } else if (period === 'semana') {
      chartData = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => ({ name: d, value: Math.floor(Math.random() * 3000 + 1000) }));
    } else if (period === 'mes') {
      chartData = Array.from({ length: 4 }).map((_, i) => ({ name: `Sem ${i + 1}`, value: Math.floor(Math.random() * 10000 + 5000) }));
    } else {
      chartData = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'].map(d => ({ name: d, value: Math.floor(Math.random() * 50000 + 20000) }));
    }

    return {
      totalRevenue: revenue,
      totalProfit: revenue * 0.35,
      totalSales: 45 * multiplier,
      avgTicket: revenue / (45 * multiplier),
      chartData,
      pixPercentage: 45,
      cardPercentage: 35,
      cashPercentage: 20
    };
  };

  const data = getMockData();

  return (
    <div className="flex-col w-full" style={{ padding: '32px', overflowY: 'auto' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '32px' }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Relatórios Gerenciais</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Análise de Histórico BI (Vendas, Produtos, Meios de Pagamento)</p>
        </div>
        
        <div className="flex gap-4">
          <select 
            value={period} 
            onChange={e => setPeriod(e.target.value)}
            style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', border: '2px solid var(--border)', backgroundColor: 'var(--surface-100)', color: 'var(--text-primary)', fontSize: '1.2rem', outline: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            <option value="hoje">Recorte: Hoje (19/03/2026)</option>
            <option value="semana">Recorte: Últimos 7 dias</option>
            <option value="mes">Recorte: Este Mês (Março/2026)</option>
            <option value="ano">Recorte: Este Ano (2026)</option>
          </select>
          <button className="btn btn-outline" style={{ padding: '12px 24px', fontWeight: 'bold' }}>
            📥 Exportar PDF
          </button>
        </div>
      </div>

      <div className="flex gap-4" style={{ marginBottom: '32px', borderBottom: '2px solid var(--border)', paddingBottom: '16px' }}>
        <button 
          onClick={() => setReportType('vendas')}
          style={{ 
            backgroundColor: 'transparent', color: reportType === 'vendas' ? 'var(--primary)' : 'var(--text-secondary)', 
            border: 'none', borderBottom: reportType === 'vendas' ? '4px solid var(--primary)' : '4px solid transparent', 
            borderRadius: 0, padding: '8px 16px', fontSize: '1.2rem', fontWeight: reportType === 'vendas' ? 'bold' : 'normal', cursor: 'pointer', transition: 'all 0.2s'
          }}
        >
          Resumo Inteligente
        </button>
        <button 
          onClick={() => setReportType('produtos')}
          style={{ 
            backgroundColor: 'transparent', color: reportType === 'produtos' ? 'var(--primary)' : 'var(--text-secondary)', 
            border: 'none', borderBottom: reportType === 'produtos' ? '4px solid var(--primary)' : '4px solid transparent', 
            borderRadius: 0, padding: '8px 16px', fontSize: '1.2rem', fontWeight: reportType === 'produtos' ? 'bold' : 'normal', cursor: 'pointer', transition: 'all 0.2s'
          }}
        >
          Curva ABC de Produtos
        </button>
      </div>

      {reportType === 'vendas' && (
        <div className="flex-col gap-6">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            <div className="card glass" style={{ padding: '32px', borderLeft: '6px solid var(--primary)' }}>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '16px' }}>Faturamento Geral Bruto</h3>
              <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '500', marginRight: '8px', color: 'var(--text-tertiary)' }}>R$</span>
                {data.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="card glass" style={{ padding: '32px', borderLeft: '6px solid var(--success)' }}>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '16px' }}>Lucro Líquido</h3>
              <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--success)' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '500', marginRight: '8px', opacity: 0.8 }}>R$</span>
                {data.totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="card glass" style={{ padding: '32px', borderLeft: '6px solid var(--success)' }}>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '16px' }}>Volume de Transações</h3>
              <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                {data.totalSales.toLocaleString('pt-BR')} <span style={{ fontSize: '1.2rem', fontWeight: '500', color: 'var(--text-tertiary)' }}>vendas</span>
              </div>
            </div>
            <div className="card glass" style={{ padding: '32px', borderLeft: '6px solid var(--warning)' }}>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '16px' }}>Ticket Médio</h3>
              <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '500', marginRight: '8px', color: 'var(--text-tertiary)' }}>R$</span>
                {data.avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginTop: '16px' }}>
             <div className="card glass flex-col" style={{ padding: '32px' }}>
                <h3 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginBottom: '24px', fontWeight: 'bold' }}>Mix de Pagamento</h3>
                
                <div className="flex-col gap-6" style={{ marginTop: '16px' }}>
                  <div className="flex-col gap-2">
                    <div className="flex justify-between">
                      <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Pix</span>
                      <span style={{ fontWeight: 'bold', color: '#20c997' }}>{data.pixPercentage}%</span>
                    </div>
                    <div style={{ width: '100%', height: '16px', backgroundColor: 'var(--surface-200)', borderRadius: '8px', overflow: 'hidden' }}>
                      <div style={{ width: `${data.pixPercentage}%`, height: '100%', backgroundColor: '#20c997', borderRadius: '8px' }}></div>
                    </div>
                  </div>

                  <div className="flex-col gap-2">
                    <div className="flex justify-between">
                      <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Cartão (C/D)</span>
                      <span style={{ fontWeight: 'bold', color: '#0f62fe' }}>{data.cardPercentage}%</span>
                    </div>
                    <div style={{ width: '100%', height: '16px', backgroundColor: 'var(--surface-200)', borderRadius: '8px', overflow: 'hidden' }}>
                      <div style={{ width: `${data.cardPercentage}%`, height: '100%', backgroundColor: '#0f62fe', borderRadius: '8px' }}></div>
                    </div>
                  </div>

                  <div className="flex-col gap-2">
                    <div className="flex justify-between">
                      <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Dinheiro Espécie</span>
                      <span style={{ fontWeight: 'bold', color: '#f1c21b' }}>{data.cashPercentage}%</span>
                    </div>
                    <div style={{ width: '100%', height: '16px', backgroundColor: 'var(--surface-200)', borderRadius: '8px', overflow: 'hidden' }}>
                      <div style={{ width: `${data.cashPercentage}%`, height: '100%', backgroundColor: '#f1c21b', borderRadius: '8px' }}></div>
                    </div>
                  </div>
                </div>
             </div>

             <div className="card glass flex-col" style={{ padding: '32px' }}>
                <h3 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginBottom: '24px', fontWeight: 'bold' }}>Evolução Gráfica - Faturamento Diário</h3>
                <div style={{ flex: 1, width: '100%', minHeight: '250px', marginTop: '16px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{fontSize: 12, fill: 'var(--text-secondary)'}} />
                      <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12, fill: 'var(--text-secondary)'}} tickFormatter={(val) => `R$ ${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`} />
                      <Tooltip 
                        formatter={(value) => [`R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, 'Faturamento']}
                        labelStyle={{ color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '8px' }}
                        contentStyle={{ backgroundColor: 'var(--surface-100)', borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
                        itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
                      />
                      <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={4} activeDot={{ r: 8, fill: 'var(--primary)', stroke: 'var(--surface-100)', strokeWidth: 2 }} dot={{ r: 4, strokeWidth: 2, fill: 'var(--surface-100)', stroke: 'var(--primary)' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
             </div>
          </div>
        </div>
      )}

      {reportType === 'produtos' && (
        <div className="card glass flex-col" style={{ padding: '32px' }}>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginBottom: '24px', fontWeight: 'bold' }}>Top 5 Produtos Mais Rentáveis (Curva A)</h3>
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
              {['Pão Francês Kg', 'Coca-Cola 2L', 'Leite Integral 1L', 'Cerveja Lata 350ml', 'Manteiga Extra 200g'].map((prod, index) => {
                const qty = Math.floor(1000 / (index + 1)) * (period === 'semana' ? 7 : period === 'mes' ? 30 : period === 'ano' ? 365 : 1);
                const rev = qty * (5 * (index + 1) * 0.7);
                return (
                  <tr key={prod} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '24px 16px', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{index + 1}. {prod}</td>
                    <td style={{ padding: '24px 16px', fontSize: '1.2rem' }}>{qty.toLocaleString('pt-BR')} un.</td>
                    <td style={{ padding: '24px 16px', color: 'var(--success)', fontWeight: 'bold', fontSize: '1.2rem' }}>R$ {rev.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td style={{ padding: '24px 16px' }}>
                      <span style={{ backgroundColor: 'var(--surface-200)', color: 'var(--text-primary)', padding: '6px 16px', borderRadius: '16px', fontWeight: 'bold' }}>{Math.max(1, 30 - index * 5)}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
