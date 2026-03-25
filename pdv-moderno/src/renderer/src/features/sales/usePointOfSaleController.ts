import {
  useCallback,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
  type FormEvent,
} from 'react';
import {
  createCartItem,
  describeDiscount,
  getSaleSummary,
  type CartItem,
  type CatalogProduct,
  type DiscountDefinition,
} from '../../../../shared/sales';
import { products } from '../../data/mock';
import scaleService from '../../services/scaleService';
import { createCartId, createWeighableProduct, parseBarcodeInput } from './saleHelpers';
import { useSearchInputFocus } from './useSearchInputFocus';
import { useToastQueue } from './useToastQueue';
import type {
  CashMovement,
  CompletedSale,
  OperatorSession,
  ParkedSale,
  PointOfSaleController,
  SalePayment,
} from './types';

type ScaleConnectionStatus = 'connected' | 'disconnected';

interface UsePointOfSaleControllerOptions {
  isSalesTabActive: boolean;
  operator: OperatorSession;
}

export function usePointOfSaleController({
  isSalesTabActive,
  operator,
}: UsePointOfSaleControllerOptions): PointOfSaleController {
  const { inputRef: searchInputRef, focusInput: focusSearchInput } = useSearchInputFocus();
  const { toasts, addToast, dismissToast } = useToastQueue();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedProductIndex, setHighlightedProductIndex] = useState(0);
  const [selectedCartId, setSelectedCartId] = useState<string | null>(null);
  const [saleDiscount, setSaleDiscount] = useState<DiscountDefinition>(null);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [completedSaleData, setCompletedSaleData] = useState<CompletedSale | null>(null);
  const [showCpfModal, setShowCpfModal] = useState(false);
  const [showSaleDiscountModal, setShowSaleDiscountModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showParkedModal, setShowParkedModal] = useState(false);
  const [showCancelSaleConfirm, setShowCancelSaleConfirm] = useState(false);
  const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null);

  const [customerCpf, setCustomerCpf] = useState('');
  const [shiftSales, setShiftSales] = useState<CompletedSale[]>([]);
  const [movements, setMovements] = useState<CashMovement[]>([]);
  const [parkedSales, setParkedSales] = useState<ParkedSale[]>([]);

  const [pendingWeighProduct, setPendingWeighProduct] = useState<ReturnType<typeof createWeighableProduct> | null>(null);
  const [showWeighModal, setShowWeighModal] = useState(false);
  const [scaleConnected, setScaleConnected] = useState(() => scaleService.isConnected());

  const parsedBarcode = parseBarcodeInput(barcodeInput);
  const deferredQuery = useDeferredValue(parsedBarcode.query);
  const filteredProducts = useMemo(() => {
    if (!deferredQuery) {
      return [];
    }

    const normalizedQuery = deferredQuery.toLowerCase();

    return products.filter((product) => {
      return (
        product.id.includes(deferredQuery)
        || product.name.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [deferredQuery]);

  const resolvedHighlightedProductIndex = filteredProducts.length === 0
    ? 0
    : Math.min(highlightedProductIndex, filteredProducts.length - 1);
  const resolvedSelectedCartId = cart.some((item) => item.cartId === selectedCartId)
    ? selectedCartId
    : cart.at(-1)?.cartId ?? null;
  const selectedCartItem = useMemo(() => {
    return cart.find((item) => item.cartId === resolvedSelectedCartId) ?? null;
  }, [cart, resolvedSelectedCartId]);

  const saleSummary = useMemo(() => {
    return getSaleSummary(cart, saleDiscount);
  }, [cart, saleDiscount]);

  const isOverlayOpen = showPaymentModal
    || showCpfModal
    || showParkedModal
    || showWeighModal
    || showShortcutsModal
    || showSaleDiscountModal
    || showCancelSaleConfirm
    || Boolean(completedSaleData)
    || Boolean(editingCartItem);

  const handleBarcodeChange = useCallback((value: string) => {
    setBarcodeInput(value);
    setShowDropdown(value.trim().length > 0);
    setHighlightedProductIndex(0);
  }, []);

  const handleOpenDropdown = useCallback(() => {
    setShowDropdown(true);
  }, []);

  const handleCloseDropdown = useCallback(() => {
    setShowDropdown(false);
  }, []);

  const handleOpenCpfModal = useCallback(() => {
    setShowCpfModal(true);
  }, []);

  const handleCloseCpfModal = useCallback(() => {
    setShowCpfModal(false);
    focusSearchInput();
  }, [focusSearchInput]);

  const handleOpenParkedModal = useCallback(() => {
    setShowParkedModal(true);
  }, []);

  const handleCloseParkedModal = useCallback(() => {
    setShowParkedModal(false);
    focusSearchInput();
  }, [focusSearchInput]);

  const handleOpenSaleDiscountModal = useCallback(() => {
    setShowSaleDiscountModal(true);
  }, []);

  const handleCloseSaleDiscountModal = useCallback(() => {
    setShowSaleDiscountModal(false);
    focusSearchInput();
  }, [focusSearchInput]);

  const handleOpenShortcutsModal = useCallback(() => {
    setShowShortcutsModal(true);
  }, []);

  const handleCloseShortcutsModal = useCallback(() => {
    setShowShortcutsModal(false);
    focusSearchInput();
  }, [focusSearchInput]);

  const handleOpenCancelSaleConfirm = useCallback(() => {
    setShowCancelSaleConfirm(true);
  }, []);

  const handleCloseCancelSaleConfirm = useCallback(() => {
    setShowCancelSaleConfirm(false);
    focusSearchInput();
  }, [focusSearchInput]);

  const resetCurrentSale = useCallback(() => {
    setCart([]);
    setCustomerCpf('');
    setSaleDiscount(null);
    setBarcodeInput('');
    setShowDropdown(false);
    setHighlightedProductIndex(0);
    setSelectedCartId(null);
  }, []);

  const handleProductSelect = useCallback((product: CatalogProduct, quantity: number) => {
    if (product.unit === 'kg') {
      setPendingWeighProduct(createWeighableProduct(product, quantity));
      setShowWeighModal(true);
      setBarcodeInput('');
      setShowDropdown(false);
      return;
    }

    const nextCartItem = createCartItem(product, quantity, createCartId());

    setCart((previousCart) => [...previousCart, nextCartItem]);
    setSelectedCartId(nextCartItem.cartId);
    setBarcodeInput('');
    setShowDropdown(false);
    focusSearchInput();
  }, [focusSearchInput]);

  const handleWeighConfirm = useCallback((weight: number) => {
    if (pendingWeighProduct && weight > 0) {
      const nextCartItem = createCartItem(pendingWeighProduct, weight, createCartId());

      setCart((previousCart) => [...previousCart, nextCartItem]);
      setSelectedCartId(nextCartItem.cartId);
    }

    setPendingWeighProduct(null);
    setShowWeighModal(false);
    focusSearchInput();
  }, [focusSearchInput, pendingWeighProduct]);

  const handleWeighCancel = useCallback(() => {
    setPendingWeighProduct(null);
    setShowWeighModal(false);
    focusSearchInput();
  }, [focusSearchInput]);

  const handleRemoveItem = useCallback((cartId: string) => {
    setCart((previousCart) => {
      return previousCart.filter((item) => item.cartId !== cartId);
    });

    addToast({
      tone: 'warning',
      title: 'Item removido',
      message: 'O item foi retirado do cupom atual.',
    });
    focusSearchInput();
  }, [addToast, focusSearchInput]);

  const handleBarcodeSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (filteredProducts.length === 0) {
      addToast({
        tone: 'danger',
        title: 'Produto não encontrado',
        message: 'Tente pesquisar pelo nome ou pelo código de barras do item.',
      });
      handleCloseDropdown();
      return;
    }

    const selectedProduct = filteredProducts[resolvedHighlightedProductIndex] ?? filteredProducts[0];
    handleProductSelect(selectedProduct, parsedBarcode.qty);
  }, [
    addToast,
    filteredProducts,
    handleCloseDropdown,
    handleProductSelect,
    parsedBarcode.qty,
    resolvedHighlightedProductIndex,
  ]);

  const handleParkCurrentSale = useCallback(() => {
    if (cart.length === 0) {
      return;
    }

    const parkedSale: ParkedSale = {
      id: `ESP-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      cart: [...cart],
      cpf: customerCpf,
      saleDiscount,
      total: saleSummary.total,
    };

    setParkedSales((previousSales) => [...previousSales, parkedSale]);
    resetCurrentSale();
    addToast({
      tone: 'success',
      title: 'Venda estacionada',
      message: `${parkedSale.id} foi enviada para a lista de esperas.`,
    });
    focusSearchInput();
  }, [addToast, cart, customerCpf, focusSearchInput, resetCurrentSale, saleDiscount, saleSummary.total]);

  const handleResumeParkedSale = useCallback((parkedSale: ParkedSale) => {
    if (cart.length > 0) {
      handleParkCurrentSale();
    }

    setCart(parkedSale.cart);
    setCustomerCpf(parkedSale.cpf || '');
    setSaleDiscount(parkedSale.saleDiscount ?? null);
    setParkedSales((previousSales) => {
      return previousSales.filter((sale) => sale.id !== parkedSale.id);
    });
    setSelectedCartId(parkedSale.cart.at(-1)?.cartId ?? null);
    setShowParkedModal(false);
    addToast({
      tone: 'info',
      title: 'Venda retomada',
      message: `${parkedSale.id} voltou para o caixa atual.`,
    });
    focusSearchInput();
  }, [addToast, cart.length, focusSearchInput, handleParkCurrentSale]);

  const updateSelectedCartOffset = useCallback((offset: number) => {
    if (cart.length === 0) {
      return;
    }

    const currentIndex = cart.findIndex((item) => item.cartId === resolvedSelectedCartId);
    const safeIndex = currentIndex === -1 ? cart.length - 1 : currentIndex;
    const nextIndex = (safeIndex + offset + cart.length) % cart.length;

    setSelectedCartId(cart[nextIndex].cartId);
  }, [cart, resolvedSelectedCartId]);

  const handleOpenSelectedItemEditor = useCallback(() => {
    if (!selectedCartItem) {
      addToast({
        tone: 'warning',
        title: 'Nenhum item selecionado',
        message: 'Selecione um item do cupom para editar.',
      });
      return;
    }

    setEditingCartItem(selectedCartItem);
  }, [addToast, selectedCartItem]);

  const handleOpenCartItemEditor = useCallback((item: CartItem) => {
    setSelectedCartId(item.cartId);
    setEditingCartItem(item);
  }, []);

  const handleCloseCartItemEditor = useCallback(() => {
    setEditingCartItem(null);
    focusSearchInput();
  }, [focusSearchInput]);

  const handleSaveCartItem = useCallback((quantity: number, discount: DiscountDefinition) => {
    if (!editingCartItem) {
      return;
    }

    setCart((previousCart) => {
      return previousCart.map((item) => {
        if (item.cartId !== editingCartItem.cartId) {
          return item;
        }

        return {
          ...item,
          quantity,
          discount,
        };
      });
    });

    setEditingCartItem(null);
    addToast({
      tone: 'success',
      title: 'Item atualizado',
      message: 'Quantidade e desconto foram ajustados no cupom.',
    });
    focusSearchInput();
  }, [addToast, editingCartItem, focusSearchInput]);

  const handleApplySaleDiscount = useCallback((discount: DiscountDefinition) => {
    setSaleDiscount(discount);
    setShowSaleDiscountModal(false);
    addToast({
      tone: discount ? 'success' : 'info',
      title: discount ? 'Desconto aplicado' : 'Desconto removido',
      message: discount
        ? `Desconto geral configurado em ${describeDiscount(discount)}.`
        : 'O desconto sobre o total da venda foi removido.',
    });
    focusSearchInput();
  }, [addToast, focusSearchInput]);

  const handleCancelSale = useCallback(() => {
    resetCurrentSale();
    setShowCancelSaleConfirm(false);
    addToast({
      tone: 'warning',
      title: 'Compra cancelada',
      message: 'O cupom atual foi limpo.',
    });
    focusSearchInput();
  }, [addToast, focusSearchInput, resetCurrentSale]);

  const handleOpenPaymentModal = useCallback(() => {
    setShowPaymentModal(true);
  }, []);

  const handleClosePaymentModal = useCallback(() => {
    setShowPaymentModal(false);
    focusSearchInput();
  }, [focusSearchInput]);

  const handlePaymentConfirm = useCallback((payments: SalePayment[]) => {
    const paidTotal = payments.reduce((accumulator, payment) => {
      return accumulator + payment.amount;
    }, 0);
    const changeAmount = Math.max(0, paidTotal - saleSummary.total);
    const saleData: CompletedSale = {
      cart,
      payments,
      total: saleSummary.total,
      change: changeAmount,
      operator,
      customerCpf,
      id: Date.now(),
      summary: saleSummary,
      saleDiscount,
    };

    setCompletedSaleData(saleData);
    setShiftSales((previousSales) => [...previousSales, saleData]);
    setShowPaymentModal(false);
  }, [cart, customerCpf, operator, saleDiscount, saleSummary]);

  const handleReceiptPrint = useCallback(() => {
    addToast({
      tone: 'info',
      title: 'Impressão simulada',
      message: 'O recibo foi enviado para a bobina térmica simulada.',
    });
  }, [addToast]);

  const handleReceiptClose = useCallback(() => {
    setCompletedSaleData(null);
    resetCurrentSale();
    focusSearchInput();
  }, [focusSearchInput, resetCurrentSale]);

  const handleConfirmCpf = useCallback((cpf: string) => {
    setCustomerCpf(cpf);
    setShowCpfModal(false);
    focusSearchInput();
  }, [focusSearchInput]);

  const handleAddMovement = useCallback((movement: CashMovement) => {
    setMovements((previousMovements) => [...previousMovements, movement]);
  }, []);

  const handleGlobalKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (!isSalesTabActive || isOverlayOpen) {
      return;
    }

    if (event.key === 'ArrowDown' && showDropdown && filteredProducts.length > 0) {
      event.preventDefault();
      setHighlightedProductIndex((currentIndex) => {
        return Math.min(currentIndex + 1, filteredProducts.length - 1);
      });
      return;
    }

    if (event.key === 'ArrowUp' && showDropdown && filteredProducts.length > 0) {
      event.preventDefault();
      setHighlightedProductIndex((currentIndex) => Math.max(currentIndex - 1, 0));
      return;
    }

    if (event.ctrlKey && event.key === 'ArrowDown' && cart.length > 0) {
      event.preventDefault();
      updateSelectedCartOffset(1);
      return;
    }

    if (event.ctrlKey && event.key === 'ArrowUp' && cart.length > 0) {
      event.preventDefault();
      updateSelectedCartOffset(-1);
      return;
    }

    if (event.key === 'F2') {
      event.preventDefault();
      handleOpenCpfModal();
      return;
    }

    if (event.key === 'F3' && cart.length > 0) {
      event.preventDefault();
      handleOpenSelectedItemEditor();
      return;
    }

    if (event.key === 'F4' && cart.length > 0) {
      event.preventDefault();
      handleParkCurrentSale();
      return;
    }

    if (event.key === 'F5' && parkedSales.length > 0) {
      event.preventDefault();
      handleOpenParkedModal();
      return;
    }

    if (event.key === 'F6' || event.key === 'F1') {
      event.preventDefault();
      handleOpenShortcutsModal();
      return;
    }

    if (event.key === 'F7' && cart.length > 0) {
      event.preventDefault();
      handleOpenSaleDiscountModal();
      return;
    }

    if (event.key === 'F9' && cart.length > 0) {
      event.preventDefault();
      handleOpenPaymentModal();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();

      if (showDropdown) {
        handleCloseDropdown();
        return;
      }

      if (cart.length > 0) {
        handleOpenCancelSaleConfirm();
      }
    }
  });

  useEffect(() => {
    const unsubscribe = scaleService.onStatusChange((status: ScaleConnectionStatus) => {
      setScaleConnected(status === 'connected');
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isSalesTabActive) {
      handleCloseDropdown();
      return undefined;
    }

    const listener = (event: KeyboardEvent) => {
      handleGlobalKeyDown(event);
    };

    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [handleCloseDropdown, handleGlobalKeyDown, isSalesTabActive]);

  useEffect(() => {
    if (isSalesTabActive) {
      focusSearchInput();
    }
  }, [focusSearchInput, isSalesTabActive]);

  useEffect(() => {
    const tableContainer = document.getElementById('cart-table-container');

    if (tableContainer) {
      tableContainer.scrollTop = tableContainer.scrollHeight;
    }
  }, [cart.length]);

  return {
    barcodeInput,
    cart,
    completedSaleData,
    customerCpf,
    editingCartItem,
    filteredProducts,
    highlightedProductIndex: resolvedHighlightedProductIndex,
    movements,
    parkedSales,
    parsedQuantity: parsedBarcode.qty,
    pendingWeighProduct,
    scaleConnected,
    saleDiscount,
    saleSummary,
    searchInputRef,
    selectedCartId: resolvedSelectedCartId,
    selectedCartItem,
    shiftSales,
    showCancelSaleConfirm,
    showCpfModal,
    showDropdown,
    showParkedModal,
    showPaymentModal,
    showSaleDiscountModal,
    showShortcutsModal,
    showWeighModal,
    toasts,
    dismissToast,
    focusSearchInput,
    handleAddMovement,
    handleApplySaleDiscount,
    handleBarcodeChange,
    handleBarcodeSubmit,
    handleCancelSale,
    handleCloseCancelSaleConfirm,
    handleCloseCartItemEditor,
    handleCloseCpfModal,
    handleCloseDropdown,
    handleCloseParkedModal,
    handleClosePaymentModal,
    handleCloseSaleDiscountModal,
    handleCloseShortcutsModal,
    handleConfirmCpf,
    handleOpenCancelSaleConfirm,
    handleOpenCartItemEditor,
    handleOpenCpfModal,
    handleOpenDropdown,
    handleOpenParkedModal,
    handleOpenPaymentModal,
    handleOpenSaleDiscountModal,
    handleOpenSelectedItemEditor,
    handleOpenShortcutsModal,
    handleParkCurrentSale,
    handlePaymentConfirm,
    handleProductSelect,
    handleReceiptClose,
    handleReceiptPrint,
    handleRemoveItem,
    handleResumeParkedSale,
    handleSaveCartItem,
    handleSelectCartItem: setSelectedCartId,
    handleSelectHighlightedProduct: setHighlightedProductIndex,
    handleWeighCancel,
    handleWeighConfirm,
  } satisfies PointOfSaleController;
}
