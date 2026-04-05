import { roundCurrency, type CatalogProduct } from '../../../../shared/sales.ts';
import type {
  AdjustmentMode,
  CatalogProductRecord,
  InventoryCountDraft,
  ManualAdjustmentDraft,
  ProductModeFilter,
  ProductFormDraft,
  StockMovement,
  StockStatus,
  StockStatusFilter,
} from './types.ts';

const PRODUCT_ID_PREFIX = 'prd-';
const BARCODE_SPLIT_PATTERN = /[\s,;\n]+/;

function parseNumberInput(rawValue: string): number {
  const value = rawValue.trim();

  if (!value) {
    return 0;
  }

  if (value.includes(',') && value.includes('.')) {
    return Number(value.replace(/\./g, '').replace(',', '.'));
  }

  return Number(value.replace(',', '.'));
}

function hasInvalidNumberInput(rawValue: string): boolean {
  return rawValue.trim().length > 0 && !Number.isFinite(parseNumberInput(rawValue));
}

function sortCatalogProductsByName(products: readonly CatalogProductRecord[]): CatalogProductRecord[] {
  return products.toSorted((leftProduct, rightProduct) => leftProduct.name.localeCompare(rightProduct.name));
}

function normalizeBarcodeList(primaryBarcode: string, extraBarcodesText: string): string[] {
  return [primaryBarcode, ...extraBarcodesText.split(BARCODE_SPLIT_PATTERN)]
    .map((barcode) => barcode.trim())
    .filter(Boolean)
    .filter((barcode, index, allBarcodes) => allBarcodes.indexOf(barcode) === index);
}

function createProductId(products: readonly CatalogProductRecord[]): string {
  const lastId = products.reduce((currentMax, product) => {
    const numericPart = Number(product.productId.replace(PRODUCT_ID_PREFIX, ''));

    if (!Number.isFinite(numericPart)) {
      return currentMax;
    }

    return Math.max(currentMax, numericPart);
  }, 0);

  return `${PRODUCT_ID_PREFIX}${String(lastId + 1).padStart(3, '0')}`;
}

function normalizeStockQuantity(value: number, unit: string): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  if (unit === 'kg') {
    return roundCurrency(value);
  }

  return Math.round(value);
}

function isFractionalUnitQuantity(value: number, unit: string): boolean {
  return unit !== 'kg' && !Number.isInteger(value);
}

function applyAdjustmentMode(before: number, quantity: number, mode: AdjustmentMode): number {
  if (mode === 'set') {
    return quantity;
  }

  if (mode === 'increase') {
    return before + quantity;
  }

  return before - quantity;
}

function createStockMovement(
  product: CatalogProductRecord,
  kind: StockMovement['kind'],
  quantityDelta: number,
  stockBefore: number,
  stockAfter: number,
  reason: string,
  operator: string,
  timestamp: string,
): StockMovement {
  return {
    movementId: `${kind}-${product.productId}-${timestamp}`,
    productId: product.productId,
    productName: product.name,
    kind,
    quantityDelta,
    stockBefore,
    stockAfter,
    reason,
    operator,
    createdAt: timestamp,
  };
}

export function createEmptyProductDraft(): ProductFormDraft {
  return {
    productId: null,
    primaryBarcode: '',
    extraBarcodesText: '',
    name: '',
    category: '',
    unit: 'un',
    costPrice: '',
    salePrice: '',
    suggestedMargin: '',
    saleMode: 'unit',
    stockMinimum: '0',
  };
}

export function createProductDraft(product?: CatalogProductRecord): ProductFormDraft {
  if (!product) {
    return createEmptyProductDraft();
  }

  return {
    productId: product.productId,
    primaryBarcode: product.id,
    extraBarcodesText: product.barcodes.slice(1).join(', '),
    name: product.name,
    category: product.category,
    unit: product.saleMode === 'weight' ? 'un' : product.unit,
    costPrice: product.costPrice.toFixed(2).replace('.', ','),
    salePrice: product.price.toFixed(2).replace('.', ','),
    suggestedMargin: product.suggestedMargin.toFixed(2).replace('.', ','),
    saleMode: product.saleMode,
    stockMinimum: String(product.stockMinimum),
  };
}

export function calculateSuggestedMargin(costPrice: number, salePrice: number): number {
  if (costPrice <= 0 || salePrice <= 0) {
    return 0;
  }

  return roundCurrency(((salePrice - costPrice) / costPrice) * 100);
}

export function validateProductDraft(
  draft: ProductFormDraft,
  products: readonly CatalogProductRecord[] = [],
): string[] {
  const errors: string[] = [];
  const primaryBarcode = draft.primaryBarcode.trim();
  const name = draft.name.trim();
  const category = draft.category.trim();
  const costPrice = parseNumberInput(draft.costPrice);
  const salePrice = parseNumberInput(draft.salePrice);
  const suggestedMargin = parseNumberInput(draft.suggestedMargin);
  const stockMinimum = parseNumberInput(draft.stockMinimum);
  const candidateBarcodes = normalizeBarcodeList(primaryBarcode, draft.extraBarcodesText);

  if (!primaryBarcode) {
    errors.push('Informe o código principal do produto.');
  }

  if (!name) {
    errors.push('Informe o nome do produto.');
  }

  if (!category) {
    errors.push('Informe a categoria do produto.');
  }

  if (hasInvalidNumberInput(draft.costPrice)) {
    errors.push('Informe um preço de custo válido.');
  } else if (costPrice < 0) {
    errors.push('O preço de custo não pode ser negativo.');
  }

  if (hasInvalidNumberInput(draft.salePrice)) {
    errors.push('Informe um preço de venda válido.');
  } else if (salePrice <= 0) {
    errors.push('O preço de venda deve ser maior que zero.');
  }

  if (draft.suggestedMargin.trim().length > 0 && !Number.isFinite(suggestedMargin)) {
    errors.push('Informe uma margem sugerida válida.');
  }

  if (hasInvalidNumberInput(draft.stockMinimum)) {
    errors.push('Informe um estoque mínimo válido.');
  } else if (stockMinimum < 0) {
    errors.push('O estoque mínimo não pode ser negativo.');
  }

  const duplicatedBarcode = products.find((product) => {
    if (product.productId === draft.productId) {
      return false;
    }

    return product.barcodes.some((barcode) => candidateBarcodes.includes(barcode));
  });

  if (duplicatedBarcode) {
    errors.push(`Já existe um produto usando o código ${duplicatedBarcode.id}.`);
  }

  return errors;
}

export function upsertCatalogProduct(
  products: readonly CatalogProductRecord[],
  draft: ProductFormDraft,
  operator: string,
  timestamp: string,
): {
  products: CatalogProductRecord[];
  savedProduct: CatalogProductRecord;
  movement: StockMovement | null;
} {
  const validationErrors = validateProductDraft(draft, products);

  if (validationErrors.length > 0) {
    throw new Error(validationErrors[0]);
  }

  const existingProduct = products.find((product) => product.productId === draft.productId) ?? null;
  const barcodes = normalizeBarcodeList(draft.primaryBarcode.trim(), draft.extraBarcodesText);
  const costPrice = roundCurrency(parseNumberInput(draft.costPrice));
  const salePrice = roundCurrency(parseNumberInput(draft.salePrice));
  const suggestedMarginInput = parseNumberInput(draft.suggestedMargin);
  const suggestedMargin = suggestedMarginInput > 0
    ? roundCurrency(suggestedMarginInput)
    : calculateSuggestedMargin(costPrice, salePrice);
  const unit = draft.saleMode === 'weight'
    ? 'kg'
    : draft.unit === 'kg'
      ? 'un'
      : draft.unit;
  const savedProduct: CatalogProductRecord = {
    productId: existingProduct?.productId ?? createProductId(products),
    id: barcodes[0],
    barcodes,
    name: draft.name.trim(),
    category: draft.category.trim(),
    unit,
    price: salePrice,
    costPrice,
    suggestedMargin,
    saleMode: draft.saleMode,
    stockMinimum: Math.max(0, normalizeStockQuantity(parseNumberInput(draft.stockMinimum), 'un')),
    stockQuantity: existingProduct?.stockQuantity ?? 0,
    updatedAt: timestamp,
  };
  const nextProducts = existingProduct
    ? products.map((product) => product.productId === savedProduct.productId ? savedProduct : product)
    : [savedProduct, ...products];
  const movement = existingProduct
    ? null
    : createStockMovement(
        savedProduct,
        'catalog',
        0,
        savedProduct.stockQuantity,
        savedProduct.stockQuantity,
        'Produto cadastrado no catálogo visual',
        operator,
        timestamp,
      );

  return {
    products: nextProducts,
    savedProduct,
    movement,
  };
}

export function applyManualAdjustment(
  products: readonly CatalogProductRecord[],
  draft: ManualAdjustmentDraft,
  timestamp: string,
): { products: CatalogProductRecord[]; movement: StockMovement } {
  const targetProduct = products.find((product) => product.productId === draft.productId);

  if (!targetProduct) {
    throw new Error('Produto não encontrado para ajuste.');
  }

  const rawQuantity = parseNumberInput(draft.quantity);

  if (isFractionalUnitQuantity(Math.abs(rawQuantity), targetProduct.unit)) {
    throw new Error(`Informe uma quantidade inteira para ${targetProduct.name}.`);
  }

  const normalizedQuantity = normalizeStockQuantity(Math.abs(rawQuantity), targetProduct.unit);

  if (normalizedQuantity <= 0) {
    throw new Error('Informe uma quantidade válida para o ajuste.');
  }

  const stockBefore = targetProduct.stockQuantity;
  const stockAfter = applyAdjustmentMode(stockBefore, normalizedQuantity, draft.mode);
  const quantityDelta = roundCurrency(stockAfter - stockBefore);
  const updatedProduct: CatalogProductRecord = {
    ...targetProduct,
    stockQuantity: stockAfter,
    updatedAt: timestamp,
  };
  const movement = createStockMovement(
    updatedProduct,
    'adjustment',
    quantityDelta,
    stockBefore,
    stockAfter,
    draft.reason.trim() || 'Ajuste manual de estoque',
    draft.operator,
    timestamp,
  );

  return {
    products: products.map((product) => product.productId === updatedProduct.productId ? updatedProduct : product),
    movement,
  };
}

export function applyInventoryCount(
  products: readonly CatalogProductRecord[],
  draft: InventoryCountDraft,
  timestamp: string,
): { products: CatalogProductRecord[]; movements: StockMovement[] } {
  const movements: StockMovement[] = [];
  const nextProducts = products.map((product) => {
    const rawCount = draft.counts[product.productId];

    if (!rawCount?.trim()) {
      return product;
    }

    const parsedCount = parseNumberInput(rawCount);

    if (!Number.isFinite(parsedCount)) {
      throw new Error(`Informe uma quantidade válida para ${product.name}.`);
    }

    if (parsedCount < 0) {
      throw new Error(`A contagem de ${product.name} não pode ser negativa.`);
    }

    if (isFractionalUnitQuantity(parsedCount, product.unit)) {
      throw new Error(`Informe uma quantidade inteira para ${product.name}.`);
    }

    const countedQuantity = normalizeStockQuantity(parsedCount, product.unit);
    const stockBefore = product.stockQuantity;

    if (countedQuantity === stockBefore) {
      return product;
    }

    const updatedProduct: CatalogProductRecord = {
      ...product,
      stockQuantity: countedQuantity,
      updatedAt: timestamp,
    };

    movements.push(
      createStockMovement(
        updatedProduct,
        'inventory',
        roundCurrency(countedQuantity - stockBefore),
        stockBefore,
        countedQuantity,
        draft.reason.trim() || 'Reconciliação de inventário',
        draft.operator,
        timestamp,
      ),
    );

    return updatedProduct;
  });

  return {
    products: nextProducts,
    movements,
  };
}

export function matchCatalogProducts(
  products: readonly CatalogProductRecord[],
  query: string,
): CatalogProductRecord[] {
  if (!query.trim()) {
    return [];
  }

  const normalizedQuery = query.trim().toLowerCase();

  return products.filter((product) => {
    return product.name.toLowerCase().includes(normalizedQuery)
      || product.category.toLowerCase().includes(normalizedQuery)
      || product.id.includes(normalizedQuery)
      || product.barcodes.some((barcode) => barcode.includes(normalizedQuery));
  });
}

export interface CatalogProductFilters {
  saleMode: ProductModeFilter;
  search: string;
  status: StockStatusFilter;
}

export function filterCatalogProducts(
  products: readonly CatalogProductRecord[],
  filters: CatalogProductFilters,
): CatalogProductRecord[] {
  const trimmedSearch = filters.search.trim();
  const baseProducts = trimmedSearch
    ? matchCatalogProducts(products, trimmedSearch)
    : products;

  return sortCatalogProductsByName(baseProducts)
    .filter((product) => {
      if (filters.status === 'all') {
        return true;
      }

      return getStockStatus(product) === filters.status;
    })
    .filter((product) => {
      if (filters.saleMode === 'all') {
        return true;
      }

      return product.saleMode === filters.saleMode;
    });
}

export function getInventoryProducts(products: readonly CatalogProductRecord[]): CatalogProductRecord[] {
  return sortCatalogProductsByName(products);
}

export function formatStockQuantity(quantity: number, unit: string): string {
  const safeQuantity = Number.isFinite(quantity) ? quantity : 0;

  if (unit === 'kg') {
    return `${roundCurrency(safeQuantity).toFixed(3).replace('.', ',')} ${unit}`;
  }

  if (Number.isInteger(safeQuantity)) {
    return `${safeQuantity} ${unit}`;
  }

  return `${roundCurrency(safeQuantity).toFixed(2).replace('.', ',')} ${unit}`;
}

export function getStockStatus(product: Pick<CatalogProductRecord, 'stockMinimum' | 'stockQuantity'>): StockStatus {
  if (product.stockQuantity < 0) {
    return 'negative';
  }

  if (product.stockQuantity === 0) {
    return 'out';
  }

  if (product.stockQuantity <= product.stockMinimum) {
    return 'low';
  }

  return 'normal';
}

export function toSalesCatalogProducts(
  products: readonly CatalogProductRecord[],
): CatalogProduct[] {
  return products.map((product) => ({
    ...product,
    barcodes: [...product.barcodes],
  }));
}
