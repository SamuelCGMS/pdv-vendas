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
        itemCount: summary.itemCount + quantity,
        weightKg: item.product.unit === "kg" ? roundQuantity(summary.weightKg + quantity) : summary.weightKg,
        subtotal: roundMoney(summary.subtotal + item.product.price * quantity),
      };
    },
    { itemCount: 0, weightKg: 0, subtotal: 0 },
  );
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
