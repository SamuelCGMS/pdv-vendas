import assert from 'node:assert/strict';
import test from 'node:test';

async function loadBuildOperationalSummary() {
  try {
    const module = await import('./operationalSummary.ts');

    return module.buildOperationalSummary;
  } catch {
    return () => ({
      averageTicket: 0,
      operatorSummary: [],
      totalRevenue: 0,
      totalSales: 0,
      workstationSummary: [],
    });
  }
}

test('agrupa o resumo operacional do dia por operador e por caixa', async () => {
  const buildOperationalSummary = await loadBuildOperationalSummary();
  const summary = buildOperationalSummary({
    baseTransactions: [
      {
        id: 'trx-001',
        items: 5,
        operatorId: 2,
        operatorName: 'Ana Silva',
        time: '08:10',
        total: 100,
        workstationId: 'cx-01',
        workstationName: 'Caixa 01',
      },
      {
        id: 'trx-002',
        items: 3,
        operatorId: 2,
        operatorName: 'Ana Silva',
        time: '08:35',
        total: 60,
        workstationId: 'cx-01',
        workstationName: 'Caixa 01',
      },
      {
        id: 'trx-003',
        items: 4,
        operatorId: 3,
        operatorName: 'Carlos Rocha',
        time: '09:00',
        total: 80,
        workstationId: 'cx-02',
        workstationName: 'Caixa 02',
      },
      {
        id: 'trx-004',
        items: 6,
        operatorId: 4,
        operatorName: 'Helena Costa',
        time: '09:25',
        total: 120,
        workstationId: 'cx-01',
        workstationName: 'Caixa 01',
      },
    ],
    liveSales: [
      {
        cart: [{ quantity: 6 }],
        id: 101,
        operator: {
          avatar: '',
          id: 1,
          initialCash: 150,
          name: 'Samuel Gomes',
          role: 'Gerente',
          workstation: {
            id: 'cx-03',
            name: 'Caixa 03',
            zone: 'Atendimento rapido',
          },
        },
        total: 90,
      },
      {
        cart: [{ quantity: 2 }, { quantity: 1 }],
        id: 102,
        operator: {
          avatar: '',
          id: 2,
          initialCash: 150,
          name: 'Ana Silva',
          role: 'Caixa',
          workstation: {
            id: 'cx-02',
            name: 'Caixa 02',
            zone: 'Saida lateral',
          },
        },
        total: 70,
      },
    ],
  });

  assert.equal(summary.totalRevenue, 520);
  assert.equal(summary.totalSales, 6);
  assert.equal(Number(summary.averageTicket.toFixed(2)), 86.67);

  assert.deepEqual(
    summary.operatorSummary.map((entry) => entry.label),
    ['Ana Silva', 'Helena Costa', 'Samuel Gomes', 'Carlos Rocha'],
  );
  assert.equal(summary.operatorSummary[0]?.totalRevenue, 230);
  assert.equal(summary.operatorSummary[0]?.salesCount, 3);
  assert.equal(Number(summary.operatorSummary[0]?.averageTicket.toFixed(2)), 76.67);

  assert.deepEqual(
    summary.workstationSummary.map((entry) => entry.label),
    ['Caixa 01', 'Caixa 02', 'Caixa 03'],
  );
  assert.equal(summary.workstationSummary[0]?.totalRevenue, 280);
  assert.equal(summary.workstationSummary[0]?.salesCount, 3);
  assert.equal(summary.workstationSummary[1]?.totalRevenue, 150);
});
