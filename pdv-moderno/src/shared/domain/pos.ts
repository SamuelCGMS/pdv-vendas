export type ProductUnit = "un" | "kg" | "pct" | "cx";

export type Product = {
  id: string;
  name: string;
  code: string;
  category: string;
  unit: ProductUnit;
  price: number;
  stock?: number;
  image?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Discount =
  | { type: "percentage"; value: number }
  | { type: "fixed"; value: number };

export type CartSummary = {
  itemCount: number;
  weightKg: number;
  subtotal: number;
};

export type SaleWithTimeAndTotal = {
  completedAt: Date;
  total: number;
};

export type HourlySalesVolume = {
  hour: string;
  total: number;
  heightPercent: number;
};

export type CashFundInputResult = {
  value: string;
  error: string | null;
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(roundMoney(value)).replace(/\u00a0/g, " ");
}

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateCartSummary(items: readonly CartItem[]): CartSummary {
  return items.reduce<CartSummary>(
    (summary, item) => {
      const quantity = item.quantity;
      return {
        itemCount: summary.itemCount + 1,
        weightKg: item.product.unit === "kg" ? roundQuantity(summary.weightKg + quantity) : summary.weightKg,
        subtotal: roundMoney(summary.subtotal + item.product.price * quantity),
      };
    },
    { itemCount: 0, weightKg: 0, subtotal: 0 },
  );
}

export function parseCashFund(value: string): number | null {
  const parsed = Number.parseFloat(value.replace(",", "."));
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return roundMoney(parsed);
}

export function sanitizeCashFundInput(value: string): CashFundInputResult {
  let error: string | null = null;
  if (value.includes("-")) {
    error = "O fundo de troco precisa ser positivo.";
  }

  const withoutInvalidChars = value.replace(/[^\d,.]/g, "");
  if (!error && withoutInvalidChars !== value) {
    error = "Use apenas numeros e separador decimal.";
  }

  const firstSeparatorIndex = withoutInvalidChars.search(/[,.]/);
  if (firstSeparatorIndex === -1) {
    return { value: withoutInvalidChars, error };
  }

  const integerPart = withoutInvalidChars.slice(0, firstSeparatorIndex);
  const decimalSeparator = withoutInvalidChars[firstSeparatorIndex];
  const decimalPart = withoutInvalidChars.slice(firstSeparatorIndex + 1).replace(/[,.]/g, "").slice(0, 2);

  return { value: `${integerPart}${decimalSeparator}${decimalPart}`, error };
}

export function createSessionHourLabels(openedAt: Date, closedAt: Date): string[] {
  const labels: string[] = [];
  const cursor = new Date(openedAt);
  cursor.setMinutes(0, 0, 0);

  const end = new Date(closedAt);
  end.setMinutes(0, 0, 0);

  while (cursor <= end) {
    labels.push(`${String(cursor.getHours()).padStart(2, "0")}h`);
    cursor.setHours(cursor.getHours() + 1);
  }

  return labels;
}

export function calculateHourlySalesVolume(
  sales: readonly SaleWithTimeAndTotal[],
  hours: readonly string[],
): HourlySalesVolume[] {
  const totals = new Map<string, number>();

  for (const sale of sales) {
    const hour = `${String(sale.completedAt.getHours()).padStart(2, "0")}h`;
    totals.set(hour, roundMoney((totals.get(hour) ?? 0) + sale.total));
  }

  const maxTotal = Math.max(...hours.map((hour) => totals.get(hour) ?? 0), 0);

  return hours.map((hour) => {
    const total = totals.get(hour) ?? 0;
    const heightPercent = total > 0 && maxTotal > 0 ? Math.max(10, Math.round((total / maxTotal) * 100)) : 6;
    return { hour, total, heightPercent };
  });
}

export function applyDiscount(subtotal: number, discount: Discount): { discountAmount: number; total: number } {
  const rawDiscount = discount.type === "percentage" ? subtotal * (discount.value / 100) : discount.value;
  const discountAmount = Math.min(roundMoney(rawDiscount), subtotal);

  return {
    discountAmount,
    total: roundMoney(subtotal - discountAmount),
  };
}

export function filterProducts<T extends Product>(products: readonly T[], query: string): T[] {
  const normalizedQuery = normalizeSearch(query);

  if (!normalizedQuery) {
    return [...products];
  }

  return products.filter((product) => {
    const haystack = normalizeSearch(`${product.name} ${product.code} ${product.category}`);
    return haystack.includes(normalizedQuery);
  });
}

function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function roundQuantity(value: number): number {
  return Math.round((value + Number.EPSILON) * 1000) / 1000;
}
