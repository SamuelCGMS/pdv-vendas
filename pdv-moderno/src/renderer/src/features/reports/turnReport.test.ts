import assert from 'node:assert/strict';
import test from 'node:test';

async function loadBuildTurnReport() {
  try {
    const module = await import('./turnReport.ts');

    return module.buildTurnReport;
  } catch {
    return () => ({
      averageTicket: 0,
      totalRevenue: 0,
      totalTransactions: 0,
      transactions: [],
    });
  }
}

test('filtra o resumo do turno pelo caixa atual e mantem ids internos unicos', async () => {
  const buildTurnReport = await loadBuildTurnReport();
  const report = buildTurnReport({
    liveSales: [
      {
        cart: [{ quantity: 2 }, { quantity: 1 }],
        change: 0,
        customerCpf: '',
        id: 1712800800000,
        operator: {
          avatar: '',
          id: 1,
          initialCash: 100,
          name: 'Samuel Gomes',
          role: 'Gerente',
          workstation: {
            id: 'cx-03',
            name: 'Caixa 03',
            zone: 'Atendimento rapido',
          },
        },
        payments: [],
        saleDiscount: { type: 'fixed', value: 0 },
        summary: {
          subtotal: 90,
          discountAmount: 0,
          total: 90,
          totalItems: 3,
        },
        total: 90,
      },
      {
        cart: [{ quantity: 1 }],
        change: 0,
        customerCpf: '',
        id: 1712804400000,
        operator: {
          avatar: '',
          id: 1,
          initialCash: 100,
          name: 'Samuel Gomes',
          role: 'Gerente',
          workstation: {
            id: 'cx-03',
            name: 'Caixa 03',
            zone: 'Atendimento rapido',
          },
        },
        payments: [],
        saleDiscount: { type: 'fixed', value: 0 },
        summary: {
          subtotal: 45,
          discountAmount: 0,
          total: 45,
          totalItems: 1,
        },
        total: 45,
      },
      {
        cart: [{ quantity: 5 }],
        change: 0,
        customerCpf: '',
        id: 1712800860000,
        operator: {
          avatar: '',
          id: 2,
          initialCash: 100,
          name: 'Ana Silva',
          role: 'Caixa',
          workstation: {
            id: 'cx-01',
            name: 'Caixa 01',
            zone: 'Frente principal',
          },
        },
        payments: [],
        saleDiscount: { type: 'fixed', value: 0 },
        summary: {
          subtotal: 150,
          discountAmount: 0,
          total: 150,
          totalItems: 5,
        },
        total: 150,
      },
    ],
    workstationId: 'cx-03',
    workstationTransactions: [
      {
        id: 'OP-2001',
        items: 11,
        operatorId: 2,
        operatorName: 'Ana Silva',
        time: '08:12',
        total: 148.2,
        workstationId: 'cx-01',
        workstationName: 'Caixa 01',
      },
      {
        id: 'OP-2005',
        items: 16,
        operatorId: 1,
        operatorName: 'Samuel Gomes',
        time: '09:32',
        total: 212.8,
        workstationId: 'cx-03',
        workstationName: 'Caixa 03',
      },
    ],
  });

  assert.equal(report.totalRevenue, 347.8);
  assert.equal(report.totalTransactions, 3);
  assert.equal(Number(report.averageTicket.toFixed(2)), 115.93);
  assert.deepEqual(
    report.transactions.map((transaction) => transaction.displayId),
    ['TRX-0000', 'TRX-0000', 'OP-2005'],
  );
  assert.deepEqual(
    report.transactions.map((transaction) => transaction.rowId),
    ['live-1712804400000', 'live-1712800800000', 'base-OP-2005'],
  );
  assert.equal(new Set(report.transactions.map((transaction) => transaction.rowId)).size, 3);
});
