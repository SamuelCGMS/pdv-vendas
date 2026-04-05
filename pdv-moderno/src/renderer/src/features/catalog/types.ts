import type { CatalogProduct } from '../../../../shared/sales.ts';

export const CATALOG_UNITS = ['un', 'kg', 'cx', 'pct', 'lt'] as const;
export type CatalogUnit = (typeof CATALOG_UNITS)[number];

export const PRODUCT_SALE_MODES = ['unit', 'weight'] as const;
export type ProductSaleMode = (typeof PRODUCT_SALE_MODES)[number];

export const STOCK_STATUS = ['normal', 'low', 'out', 'negative'] as const;
export type StockStatus = (typeof STOCK_STATUS)[number];

export const CATALOG_TABS = ['products', 'movements', 'inventory', 'adjustment'] as const;
export type CatalogTab = (typeof CATALOG_TABS)[number];

export type StockStatusFilter = StockStatus | 'all';
export type ProductModeFilter = ProductSaleMode | 'all';
export type NoticeTone = 'info' | 'success' | 'warning' | 'danger';

export interface CatalogProductRecord extends CatalogProduct {
  productId: string;
  barcodes: string[];
  category: string;
  unit: CatalogUnit;
  costPrice: number;
  suggestedMargin: number;
  saleMode: ProductSaleMode;
  stockMinimum: number;
  stockQuantity: number;
  updatedAt: string;
}

export interface ProductFormDraft {
  productId: string | null;
  primaryBarcode: string;
  extraBarcodesText: string;
  name: string;
  category: string;
  unit: CatalogUnit;
  costPrice: string;
  salePrice: string;
  suggestedMargin: string;
  saleMode: ProductSaleMode;
  stockMinimum: string;
}

export const ADJUSTMENT_MODES = ['increase', 'decrease', 'set'] as const;
export type AdjustmentMode = (typeof ADJUSTMENT_MODES)[number];

export interface ManualAdjustmentDraft {
  productId: string;
  mode: AdjustmentMode;
  quantity: string;
  reason: string;
  operator: string;
}

export const STOCK_MOVEMENT_KINDS = ['catalog', 'adjustment', 'inventory'] as const;
export type StockMovementKind = (typeof STOCK_MOVEMENT_KINDS)[number];

export interface StockMovement {
  movementId: string;
  productId: string;
  productName: string;
  kind: StockMovementKind;
  quantityDelta: number;
  stockBefore: number;
  stockAfter: number;
  reason: string;
  operator: string;
  createdAt: string;
}

export interface InventoryCountDraft {
  counts: Record<string, string>;
  operator: string;
  reason: string;
}

export interface CatalogNotice {
  tone: NoticeTone;
  title: string;
  message: string;
}

export interface CatalogSummary {
  totalProducts: number;
  lowStock: number;
  outOfStock: number;
  negativeStock: number;
  inventoryCost: number;
  inventoryRevenue: number;
}
