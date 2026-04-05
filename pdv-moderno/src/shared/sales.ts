export type DiscountMode = 'amount' | 'percent';

export type DiscountDefinition = {
  mode: DiscountMode;
  value: number;
} | null;

export interface CatalogProduct {
  id: string;
  barcodes?: readonly string[];
  name: string;
  price: number;
  unit: string;
  category?: string;
}

export type WithDiscount<T extends object> = T & {
  discount: NonNullable<DiscountDefinition> | null;
};

export type CartItem = WithDiscount<
  CatalogProduct & {
    cartId: string;
    quantity: number;
  }
>;

export interface SaleSummary {
  itemCount: number;
  subtotal: number;
  discountBase: number;
  itemDiscountTotal: number;
  saleDiscountTotal: number;
  totalDiscount: number;
  total: number;
}

const CURRENCY_FACTOR = 100;

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * CURRENCY_FACTOR) / CURRENCY_FACTOR;
}

export function normalizeQuantity(quantity: number, unit: string): number {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return unit === 'kg' ? 0.001 : 1;
  }

  if (unit === 'kg') {
    return Math.max(0.001, roundCurrency(quantity));
  }

  return Math.max(1, Math.round(quantity));
}

export function normalizeDiscount(discount: DiscountDefinition): DiscountDefinition {
  if (!discount || !Number.isFinite(discount.value) || discount.value <= 0) {
    return null;
  }

  if (discount.mode === 'percent') {
    return {
      mode: 'percent',
      value: Math.min(100, roundCurrency(discount.value)),
    };
  }

  return {
    mode: 'amount',
    value: roundCurrency(discount.value),
  };
}

export function createCartItem(
  product: CatalogProduct,
  quantity: number,
  cartId: string,
): CartItem {
  return {
    ...product,
    cartId,
    quantity: normalizeQuantity(quantity, product.unit),
    discount: null,
  };
}

export function getItemSubtotal(item: Pick<CartItem, 'price' | 'quantity'>): number {
  return roundCurrency(item.price * item.quantity);
}

export function getDiscountAmount(
  baseAmount: number,
  discount: DiscountDefinition,
): number {
  if (baseAmount <= 0) {
    return 0;
  }

  const normalizedDiscount = normalizeDiscount(discount);

  if (!normalizedDiscount) {
    return 0;
  }

  if (normalizedDiscount.mode === 'percent') {
    return roundCurrency(
      Math.min(baseAmount, (baseAmount * normalizedDiscount.value) / 100),
    );
  }

  return roundCurrency(Math.min(baseAmount, normalizedDiscount.value));
}

export function getItemDiscount(item: CartItem): number {
  return getDiscountAmount(getItemSubtotal(item), item.discount);
}

export function getItemTotal(item: CartItem): number {
  return roundCurrency(getItemSubtotal(item) - getItemDiscount(item));
}

export function getCartSubtotal(cart: readonly CartItem[]): number {
  return roundCurrency(cart.reduce((accumulator, item) => {
    return accumulator + getItemSubtotal(item);
  }, 0));
}

export function getCartItemDiscountTotal(cart: readonly CartItem[]): number {
  return roundCurrency(cart.reduce((accumulator, item) => {
    return accumulator + getItemDiscount(item);
  }, 0));
}

export function getSaleDiscountTotal(
  cart: readonly CartItem[],
  saleDiscount: DiscountDefinition,
): number {
  const discountBase = roundCurrency(
    getCartSubtotal(cart) - getCartItemDiscountTotal(cart),
  );

  return getDiscountAmount(discountBase, saleDiscount);
}

export function getSaleSummary(
  cart: readonly CartItem[],
  saleDiscount: DiscountDefinition,
): SaleSummary {
  const subtotal = getCartSubtotal(cart);
  const itemDiscountTotal = getCartItemDiscountTotal(cart);
  const discountBase = roundCurrency(subtotal - itemDiscountTotal);
  const saleDiscountTotal = getDiscountAmount(discountBase, saleDiscount);
  const totalDiscount = roundCurrency(itemDiscountTotal + saleDiscountTotal);

  return {
    itemCount: cart.length,
    subtotal,
    discountBase,
    itemDiscountTotal,
    saleDiscountTotal,
    totalDiscount,
    total: roundCurrency(discountBase - saleDiscountTotal),
  };
}

export function formatCurrency(value: number): string {
  return roundCurrency(value).toFixed(2).replace('.', ',');
}

export function formatQuantity(quantity: number, unit: string): string {
  const normalizedQuantity = normalizeQuantity(quantity, unit);

  if (unit === 'kg') {
    return `${normalizedQuantity.toFixed(3).replace('.', ',')} ${unit}`;
  }

  if (Number.isInteger(normalizedQuantity)) {
    return `${normalizedQuantity} ${unit}`;
  }

  return `${normalizedQuantity.toFixed(2).replace('.', ',')} ${unit}`;
}

export function describeDiscount(discount: DiscountDefinition): string {
  const normalizedDiscount = normalizeDiscount(discount);

  if (!normalizedDiscount) {
    return 'Sem desconto';
  }

  if (normalizedDiscount.mode === 'percent') {
    return `${normalizedDiscount.value.toFixed(2).replace('.', ',')}%`;
  }

  return `R$ ${formatCurrency(normalizedDiscount.value)}`;
}
