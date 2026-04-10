import type { CompletedSale } from '../sales/types';

export interface OperationalTransaction {
  id: string;
  items: number;
  operatorId: number;
  operatorName: string;
  time: string;
  total: number;
  workstationId: string;
  workstationName: string;
}

export interface OperationalSummaryEntry {
  averageTicket: number;
  id: string;
  itemsSold: number;
  label: string;
  salesCount: number;
  share: number;
  totalRevenue: number;
}

interface BuildOperationalSummaryOptions {
  baseTransactions: readonly OperationalTransaction[];
  liveSales?: readonly CompletedSale[];
}

interface SummaryAccumulator {
  id: string;
  itemsSold: number;
  label: string;
  salesCount: number;
  totalRevenue: number;
}

function mapLiveSalesToTransactions(
  liveSales: readonly CompletedSale[] = [],
): OperationalTransaction[] {
  return liveSales.map((sale) => ({
    id: `live-${sale.id}`,
    items: sale.cart.reduce((total, item) => total + item.quantity, 0),
    operatorId: sale.operator.id,
    operatorName: sale.operator.name,
    time: new Date(sale.id).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    total: sale.total,
    workstationId: sale.operator.workstation.id,
    workstationName: sale.operator.workstation.name,
  }));
}

function buildGroupedSummary(
  transactions: readonly OperationalTransaction[],
  getGroupKey: (transaction: OperationalTransaction) => { id: string; label: string },
  totalRevenue: number,
): OperationalSummaryEntry[] {
  const groups = new Map<string, SummaryAccumulator>();

  transactions.forEach((transaction) => {
    const group = getGroupKey(transaction);
    const current = groups.get(group.id) ?? {
      id: group.id,
      itemsSold: 0,
      label: group.label,
      salesCount: 0,
      totalRevenue: 0,
    };

    current.itemsSold += transaction.items;
    current.salesCount += 1;
    current.totalRevenue += transaction.total;

    groups.set(group.id, current);
  });

  return [...groups.values()]
    .map((entry) => ({
      averageTicket: entry.totalRevenue / entry.salesCount,
      id: entry.id,
      itemsSold: entry.itemsSold,
      label: entry.label,
      salesCount: entry.salesCount,
      share: totalRevenue === 0 ? 0 : entry.totalRevenue / totalRevenue,
      totalRevenue: entry.totalRevenue,
    }))
    .sort((left, right) => {
      if (right.totalRevenue !== left.totalRevenue) {
        return right.totalRevenue - left.totalRevenue;
      }

      if (right.salesCount !== left.salesCount) {
        return right.salesCount - left.salesCount;
      }

      return left.label.localeCompare(right.label, 'pt-BR');
    });
}

export function buildOperationalSummary({
  baseTransactions,
  liveSales = [],
}: BuildOperationalSummaryOptions) {
  const transactions = [
    ...baseTransactions,
    ...mapLiveSalesToTransactions(liveSales),
  ];
  const totalRevenue = transactions.reduce((total, transaction) => {
    return total + transaction.total;
  }, 0);
  const totalSales = transactions.length;

  return {
    averageTicket: totalSales === 0 ? 0 : totalRevenue / totalSales,
    operatorSummary: buildGroupedSummary(
      transactions,
      (transaction) => ({
        id: String(transaction.operatorId),
        label: transaction.operatorName,
      }),
      totalRevenue,
    ),
    totalRevenue,
    totalSales,
    workstationSummary: buildGroupedSummary(
      transactions,
      (transaction) => ({
        id: transaction.workstationId,
        label: transaction.workstationName,
      }),
      totalRevenue,
    ),
  };
}
