import type { FormEvent, RefObject } from 'react';
import type {
  CartItem,
  CatalogProduct,
  DiscountDefinition,
  SaleSummary,
} from '../../../../shared/sales';
import type { WeighableProduct } from './saleHelpers';
import type { ToastItem } from './useToastQueue';

export interface OperatorSession {
  id: number;
  name: string;
  role: string;
  avatar: string;
  initialCash: number;
}

export interface SalePayment {
  id: number;
  method: string;
  amount: number;
}

export interface CompletedSale {
  id: number;
  cart: CartItem[];
  payments: SalePayment[];
  total: number;
  change: number;
  operator: OperatorSession;
  customerCpf: string;
  summary: SaleSummary;
  saleDiscount: DiscountDefinition;
}

export interface CashMovement {
  id: number;
  type: 'sangria' | 'suprimento';
  amount: number;
  reason: string;
  time: Date;
}

export interface ParkedSale {
  id: string;
  time: string;
  cart: CartItem[];
  cpf: string;
  saleDiscount: DiscountDefinition;
  total: number;
}

export interface PointOfSaleController {
  barcodeInput: string;
  cart: CartItem[];
  completedSaleData: CompletedSale | null;
  customerCpf: string;
  editingCartItem: CartItem | null;
  filteredProducts: readonly CatalogProduct[];
  highlightedProductIndex: number;
  movements: CashMovement[];
  parkedSales: ParkedSale[];
  parsedQuantity: number;
  pendingWeighProduct: WeighableProduct | null;
  scaleConnected: boolean;
  saleDiscount: DiscountDefinition;
  saleSummary: SaleSummary;
  searchInputRef: RefObject<HTMLInputElement | null>;
  selectedCartId: string | null;
  selectedCartItem: CartItem | null;
  shiftSales: CompletedSale[];
  showCancelSaleConfirm: boolean;
  showCpfModal: boolean;
  showDropdown: boolean;
  showParkedModal: boolean;
  showPaymentModal: boolean;
  showSaleDiscountModal: boolean;
  showShortcutsModal: boolean;
  showWeighModal: boolean;
  toasts: ToastItem[];
  dismissToast: (toastId: string) => void;
  focusSearchInput: () => void;
  handleAddMovement: (movement: CashMovement) => void;
  handleApplySaleDiscount: (discount: DiscountDefinition) => void;
  handleBarcodeChange: (value: string) => void;
  handleBarcodeSubmit: (event: FormEvent<HTMLFormElement>) => void;
  handleCancelSale: () => void;
  handleCloseCancelSaleConfirm: () => void;
  handleCloseCartItemEditor: () => void;
  handleCloseCpfModal: () => void;
  handleCloseDropdown: () => void;
  handleCloseParkedModal: () => void;
  handleClosePaymentModal: () => void;
  handleCloseSaleDiscountModal: () => void;
  handleCloseShortcutsModal: () => void;
  handleConfirmCpf: (cpf: string) => void;
  handleOpenCancelSaleConfirm: () => void;
  handleOpenCartItemEditor: (item: CartItem) => void;
  handleOpenCpfModal: () => void;
  handleOpenDropdown: () => void;
  handleOpenParkedModal: () => void;
  handleOpenPaymentModal: () => void;
  handleOpenSaleDiscountModal: () => void;
  handleOpenSelectedItemEditor: () => void;
  handleOpenShortcutsModal: () => void;
  handleParkCurrentSale: () => void;
  handleProductSelect: (
    product: CatalogProduct,
    quantity: number,
  ) => void;
  handleRemoveItem: (cartId: string) => void;
  handleResumeParkedSale: (parkedSale: ParkedSale) => void;
  handleSaveCartItem: (
    quantity: number,
    discount: DiscountDefinition,
  ) => void;
  handleSelectCartItem: (cartId: string | null) => void;
  handleSelectHighlightedProduct: (index: number) => void;
  handleWeighCancel: () => void;
  handleWeighConfirm: (weight: number) => void;
  handlePaymentConfirm: (payments: SalePayment[]) => void;
  handleReceiptClose: () => void;
  handleReceiptPrint: () => void;
}
