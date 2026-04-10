import type { CompletedSale } from '../sales/types';
import type { OperationalTransaction } from './operationalSummary';

export interface TurnReportTransaction {
  displayId: string;
  items: number;
  rowId: string;
  status: 'CONCLUIDO';
  time: string;
  total: number;
}

export interface TurnReportData {
  averageTicket: number;
  totalRevenue: number;
  totalTransactions: number;
  transactions: TurnReportTransaction[];
}

interface BuildTurnReportOptions {
  liveSales?: readonly CompletedSale[];
  workstationId: string;
  workstationTransactions: readonly OperationalTransaction[];
}

function mapLiveSaleToTransaction(sale: CompletedSale): TurnReportTransaction {
  return {
    displayId: `TRX-${sale.id.toString().slice(-4)}`,
    items: sale.cart.reduce((accumulator, item) => accumulator + item.quantity, 0),
    rowId: `live-${sale.id}`,
    status: 'CONCLUIDO',
    time: new Date(sale.id).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    total: sale.total,
  };
}

function mapOperationalTransactionToTurnTransaction(
  transaction: OperationalTransaction,
): TurnReportTransaction {
  return {
    displayId: transaction.id,
    items: transaction.items,
    rowId: `base-${transaction.id}`,
    status: 'CONCLUIDO',
    time: transaction.time,
    total: transaction.total,
  };
}

export function buildTurnReport({
  liveSales = [],
  workstationId,
  workstationTransactions,
}: BuildTurnReportOptions): TurnReportData {
  const filteredLiveSales = liveSales
    .filter((sale) => sale.operator.workstation.id === workstationId)
    .map(mapLiveSaleToTransaction)
    .reverse();
  const filteredBaseTransactions = workstationTransactions
    .filter((transaction) => transaction.workstationId === workstationId)
    .map(mapOperationalTransactionToTurnTransaction)
    .reverse();
  const transactions = [...filteredLiveSales, ...filteredBaseTransactions];
  const totalRevenue = transactions.reduce((accumulator, transaction) => {
    return accumulator + transaction.total;
  }, 0);
  const totalTransactions = transactions.length;

  return {
    averageTicket: totalTransactions === 0 ? 0 : totalRevenue / totalTransactions,
    totalRevenue,
    totalTransactions,
    transactions,
  };
}
