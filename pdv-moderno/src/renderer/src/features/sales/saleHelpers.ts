import type { CatalogProduct } from '../../../../shared/sales';

export interface ParsedBarcode {
  qty: number;
  query: string;
}

const quantityAndQueryPattern = /^(\d+(?:\.\d+)?)\*(.+)$/;

export function createCartId(): string {
  return `CART-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function parseBarcodeInput(input: string): ParsedBarcode {
  const match = input.match(quantityAndQueryPattern);

  if (match) {
    return {
      qty: Number.parseFloat(match[1]),
      query: match[2].trim(),
    };
  }

  return {
    qty: 1,
    query: input.trim(),
  };
}

export type WeighableProduct = CatalogProduct & {
  requestedQty: number;
};

export function createWeighableProduct(
  product: CatalogProduct,
  requestedQty: number,
): WeighableProduct {
  return {
    ...product,
    requestedQty,
  };
}
