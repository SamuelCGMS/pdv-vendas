import { startTransition, useDeferredValue, useMemo, useState } from 'react';
import { createMockCatalogProducts, createMockStockMovements } from './catalogMock.ts';
import {
  applyInventoryCount,
  applyManualAdjustment,
  calculateSuggestedMargin,
  createEmptyProductDraft,
  createProductDraft,
  filterCatalogProducts,
  getInventoryProducts,
  getStockStatus,
  upsertCatalogProduct,
  toSalesCatalogProducts,
} from './catalogModel.ts';
import type {
  AdjustmentMode,
  CatalogNotice,
  CatalogProductRecord,
  CatalogSummary,
  CatalogTab,
  InventoryCountDraft,
  ManualAdjustmentDraft,
  ProductFormDraft,
  ProductModeFilter,
  StockMovement,
  StockStatusFilter,
} from './types.ts';

type DraftKey<T> = Extract<keyof T, string>;

function updateDraftField<T extends object, K extends DraftKey<T>>(
  currentDraft: T,
  key: K,
  value: T[K],
): T {
  return {
    ...currentDraft,
    [key]: value,
  };
}

function createEmptyAdjustmentDraft(operator: string): ManualAdjustmentDraft {
  return {
    productId: '',
    mode: 'increase',
    quantity: '',
    reason: '',
    operator,
  };
}

function createEmptyInventoryDraft(operator: string): InventoryCountDraft {
  return {
    counts: {},
    operator,
    reason: 'Inventário visual do PDV',
  };
}

function shouldAutoSyncMargin(field: keyof ProductFormDraft): boolean {
  return field === 'costPrice' || field === 'salePrice' || field === 'saleMode';
}

function syncSuggestedMargin(nextDraft: ProductFormDraft): ProductFormDraft {
  const costPrice = Number(nextDraft.costPrice.replace(',', '.'));
  const salePrice = Number(nextDraft.salePrice.replace(',', '.'));

  if (!Number.isFinite(costPrice) || !Number.isFinite(salePrice)) {
    return nextDraft;
  }

  return {
    ...nextDraft,
    suggestedMargin: calculateSuggestedMargin(costPrice, salePrice).toFixed(2).replace('.', ','),
  };
}

export interface CatalogController {
  activeTab: CatalogTab;
  adjustmentDraft: ManualAdjustmentDraft;
  filteredMovements: StockMovement[];
  filteredProducts: CatalogProductRecord[];
  inventoryProducts: CatalogProductRecord[];
  inventoryDraft: InventoryCountDraft;
  isProductModalOpen: boolean;
  movementKindFilter: StockMovement['kind'] | 'all';
  movementSearch: string;
  notice: CatalogNotice | null;
  productDraft: ProductFormDraft;
  productModeFilter: ProductModeFilter;
  productSearch: string;
  products: CatalogProductRecord[];
  salesCatalogProducts: ReturnType<typeof toSalesCatalogProducts>;
  statusFilter: StockStatusFilter;
  summary: CatalogSummary;
  handleAdjustmentFieldChange: <K extends DraftKey<ManualAdjustmentDraft>>(
    field: K,
    value: ManualAdjustmentDraft[K],
  ) => void;
  handleApplyInventory: () => void;
  handleApplyManualAdjustment: () => void;
  handleClearNotice: () => void;
  handleCloseProductModal: () => void;
  handleInventoryCountChange: (productId: string, value: string) => void;
  handleInventoryReasonChange: (value: string) => void;
  handleMovementKindFilterChange: (value: StockMovement['kind'] | 'all') => void;
  handleMovementSearchChange: (value: string) => void;
  handleOpenAdjustmentForProduct: (product: CatalogProductRecord) => void;
  handleOpenEditProduct: (product: CatalogProductRecord) => void;
  handleOpenInventoryForProduct: (product: CatalogProductRecord) => void;
  handleOpenNewProduct: () => void;
  handleProductFieldChange: <K extends DraftKey<ProductFormDraft>>(
    field: K,
    value: ProductFormDraft[K],
  ) => void;
  handleProductModeFilterChange: (value: ProductModeFilter) => void;
  handleProductSearchChange: (value: string) => void;
  handleSaveProduct: () => void;
  handleStatusFilterChange: (value: StockStatusFilter) => void;
  handleTabChange: (tab: CatalogTab) => void;
}

export function useCatalogController(operatorName: string): CatalogController {
  const [products, setProducts] = useState<CatalogProductRecord[]>(() => createMockCatalogProducts());
  const [movements, setMovements] = useState<StockMovement[]>(() => {
    const mockProducts = createMockCatalogProducts();

    return createMockStockMovements(mockProducts);
  });
  const [activeTab, setActiveTab] = useState<CatalogTab>('products');
  const [productSearch, setProductSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StockStatusFilter>('all');
  const [productModeFilter, setProductModeFilter] = useState<ProductModeFilter>('all');
  const [movementSearch, setMovementSearch] = useState('');
  const [movementKindFilter, setMovementKindFilter] = useState<StockMovement['kind'] | 'all'>('all');
  const [notice, setNotice] = useState<CatalogNotice | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productDraft, setProductDraft] = useState<ProductFormDraft>(() => createEmptyProductDraft());
  const [inventoryDraft, setInventoryDraft] = useState<InventoryCountDraft>(() => createEmptyInventoryDraft(operatorName));
  const [adjustmentDraft, setAdjustmentDraft] = useState<ManualAdjustmentDraft>(() => createEmptyAdjustmentDraft(operatorName));

  const deferredProductSearch = useDeferredValue(productSearch);
  const deferredMovementSearch = useDeferredValue(movementSearch);

  const summary = useMemo<CatalogSummary>(() => {
    return products.reduce<CatalogSummary>((currentSummary, product) => {
      const stockStatus = getStockStatus(product);
      const stockQuantity = Math.max(0, product.stockQuantity);

      return {
        totalProducts: currentSummary.totalProducts + 1,
        lowStock: currentSummary.lowStock + Number(stockStatus === 'low'),
        outOfStock: currentSummary.outOfStock + Number(stockStatus === 'out'),
        negativeStock: currentSummary.negativeStock + Number(stockStatus === 'negative'),
        inventoryCost: currentSummary.inventoryCost + (stockQuantity * product.costPrice),
        inventoryRevenue: currentSummary.inventoryRevenue + (stockQuantity * product.price),
      };
    }, {
      totalProducts: 0,
      lowStock: 0,
      outOfStock: 0,
      negativeStock: 0,
      inventoryCost: 0,
      inventoryRevenue: 0,
    });
  }, [products]);

  const filteredProducts = useMemo(() => {
    return filterCatalogProducts(products, {
      search: deferredProductSearch,
      saleMode: productModeFilter,
      status: statusFilter,
    });
  }, [deferredProductSearch, productModeFilter, products, statusFilter]);

  const inventoryProducts = useMemo(() => {
    return getInventoryProducts(products);
  }, [products]);

  const filteredMovements = useMemo(() => {
    const normalizedQuery = deferredMovementSearch.trim().toLowerCase();

    return movements
      .filter((movement) => {
        if (movementKindFilter === 'all') {
          return true;
        }

        return movement.kind === movementKindFilter;
      })
      .filter((movement) => {
        if (!normalizedQuery) {
          return true;
        }

        return movement.productName.toLowerCase().includes(normalizedQuery)
          || movement.reason.toLowerCase().includes(normalizedQuery)
          || movement.operator.toLowerCase().includes(normalizedQuery);
      })
      .toSorted((leftMovement, rightMovement) => {
        return rightMovement.createdAt.localeCompare(leftMovement.createdAt);
      });
  }, [deferredMovementSearch, movementKindFilter, movements]);

  const salesCatalogProducts = useMemo(() => {
    return toSalesCatalogProducts(products);
  }, [products]);

  const handleClearNotice = () => {
    setNotice(null);
  };

  const handleTabChange = (tab: CatalogTab) => {
    setActiveTab(tab);
  };

  const handleProductSearchChange = (value: string) => {
    startTransition(() => {
      setProductSearch(value);
    });
  };

  const handleStatusFilterChange = (value: StockStatusFilter) => {
    setStatusFilter(value);
  };

  const handleProductModeFilterChange = (value: ProductModeFilter) => {
    setProductModeFilter(value);
  };

  const handleMovementSearchChange = (value: string) => {
    startTransition(() => {
      setMovementSearch(value);
    });
  };

  const handleMovementKindFilterChange = (value: StockMovement['kind'] | 'all') => {
    setMovementKindFilter(value);
  };

  const handleOpenNewProduct = () => {
    setProductDraft(createEmptyProductDraft());
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: CatalogProductRecord) => {
    setProductDraft(createProductDraft(product));
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setProductDraft(createEmptyProductDraft());
  };

  const handleProductFieldChange = <K extends DraftKey<ProductFormDraft>>(
    field: K,
    value: ProductFormDraft[K],
  ) => {
    setProductDraft((currentDraft) => {
      const nextDraft = updateDraftField(currentDraft, field, value);

      if (shouldAutoSyncMargin(field)) {
        return syncSuggestedMargin(nextDraft);
      }

      return nextDraft;
    });
  };

  const handleSaveProduct = () => {
    try {
      const timestamp = new Date().toISOString();
      const result = upsertCatalogProduct(products, productDraft, operatorName, timestamp);

      setProducts(result.products);

      if (result.movement) {
        setMovements((currentMovements) => [result.movement as StockMovement, ...currentMovements]);
      }

      setNotice({
        tone: 'success',
        title: result.movement ? 'Produto cadastrado' : 'Produto atualizado',
        message: `${result.savedProduct.name} está pronto no catálogo visual.`,
      });
      setIsProductModalOpen(false);
      setProductDraft(createEmptyProductDraft());
    } catch (error) {
      setNotice({
        tone: 'danger',
        title: 'Não foi possível salvar o produto',
        message: error instanceof Error ? error.message : 'Revise os dados do formulário.',
      });
    }
  };

  const handleInventoryReasonChange = (value: string) => {
    setInventoryDraft((currentDraft) => ({
      ...currentDraft,
      reason: value,
    }));
  };

  const handleInventoryCountChange = (productId: string, value: string) => {
    startTransition(() => {
      setInventoryDraft((currentDraft) => ({
        ...currentDraft,
        counts: {
          ...currentDraft.counts,
          [productId]: value,
        },
      }));
    });
  };

  const handleOpenInventoryForProduct = (product: CatalogProductRecord) => {
    setActiveTab('inventory');
    setInventoryDraft((currentDraft) => ({
      ...currentDraft,
      counts: {
        ...currentDraft.counts,
        [product.productId]: String(product.stockQuantity),
      },
    }));
  };

  const handleApplyInventory = () => {
    try {
      const hasCounts = Object.values(inventoryDraft.counts).some((value) => value.trim().length > 0);

      if (!hasCounts) {
        setNotice({
          tone: 'warning',
          title: 'Inventário vazio',
          message: 'Preencha ao menos uma contagem antes de aplicar o inventário.',
        });
        return;
      }

      const timestamp = new Date().toISOString();
      const result = applyInventoryCount(products, inventoryDraft, timestamp);

      setProducts(result.products);
      setMovements((currentMovements) => [...result.movements, ...currentMovements]);
      setInventoryDraft(createEmptyInventoryDraft(operatorName));
      setNotice({
        tone: 'success',
        title: 'Inventário aplicado',
        message: `${result.movements.length} divergência(s) foram registradas na movimentação.`,
      });
    } catch (error) {
      setNotice({
        tone: 'danger',
        title: 'Não foi possível aplicar o inventário',
        message: error instanceof Error ? error.message : 'Revise as contagens informadas.',
      });
    }
  };

  const handleAdjustmentFieldChange = <K extends DraftKey<ManualAdjustmentDraft>>(
    field: K,
    value: ManualAdjustmentDraft[K],
  ) => {
    setAdjustmentDraft((currentDraft) => updateDraftField(currentDraft, field, value));
  };

  const handleOpenAdjustmentForProduct = (product: CatalogProductRecord) => {
    setActiveTab('adjustment');
    setAdjustmentDraft({
      productId: product.productId,
      mode: 'increase',
      quantity: '',
      reason: '',
      operator: operatorName,
    });
  };

  const handleApplyManualAdjustment = () => {
    try {
      const timestamp = new Date().toISOString();
      const result = applyManualAdjustment(products, adjustmentDraft, timestamp);

      setProducts(result.products);
      setMovements((currentMovements) => [result.movement, ...currentMovements]);
      setAdjustmentDraft(createEmptyAdjustmentDraft(operatorName));
      setNotice({
        tone: 'success',
        title: 'Ajuste aplicado',
        message: `${result.movement.productName} teve o estoque atualizado manualmente.`,
      });
    } catch (error) {
      setNotice({
        tone: 'danger',
        title: 'Não foi possível ajustar o estoque',
        message: error instanceof Error ? error.message : 'Revise o ajuste informado.',
      });
    }
  };

  return {
    activeTab,
    adjustmentDraft,
    filteredMovements,
    filteredProducts,
    inventoryProducts,
    inventoryDraft,
    isProductModalOpen,
    movementKindFilter,
    movementSearch,
    notice,
    productDraft,
    productModeFilter,
    productSearch,
    products,
    salesCatalogProducts,
    statusFilter,
    summary,
    handleAdjustmentFieldChange,
    handleApplyInventory,
    handleApplyManualAdjustment,
    handleClearNotice,
    handleCloseProductModal,
    handleInventoryCountChange,
    handleInventoryReasonChange,
    handleMovementKindFilterChange,
    handleMovementSearchChange,
    handleOpenAdjustmentForProduct,
    handleOpenEditProduct,
    handleOpenInventoryForProduct,
    handleOpenNewProduct,
    handleProductFieldChange,
    handleProductModeFilterChange,
    handleProductSearchChange,
    handleSaveProduct,
    handleStatusFilterChange,
    handleTabChange,
  };
}
