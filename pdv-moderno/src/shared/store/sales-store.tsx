import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import type { Dispatch, ReactElement, ReactNode } from "react";
import type { CartItem, Discount, Product } from "@shared/domain/pos";
import { applyDiscount, calculateCartSummary, roundMoney } from "@shared/domain/pos";

// ─── Types ───────────────────────────────────────────────────────────

export type PaymentMethod = "card" | "cash" | "pix" | "ticket";

export type CompletedSale = {
  id: number;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  completedAt: Date;
};

export type CashSession = {
  operatorId: string;
  operatorName: string;
  cashFund: number;
  openedAt: Date;
};

export type ParkedSale = {
  id: number;
  items: CartItem[];
  discount: Discount | null;
  paymentMethod: PaymentMethod;
  parkedAt: Date;
  label: string;
};

export type SalesState = {
  session: CashSession | null;
  cart: CartItem[];
  discount: Discount | null;
  paymentMethod: PaymentMethod;
  completedSales: CompletedSale[];
  parkedSales: ParkedSale[];
  nextSaleId: number;
  nextParkedId: number;
};

// ─── Actions ─────────────────────────────────────────────────────────

export type SalesAction =
  | { type: "OPEN_SESSION"; operator: { id: string; name: string }; cashFund: number }
  | { type: "CLOSE_SESSION" }
  | { type: "ADD_TO_CART"; product: Product; quantity?: number }
  | { type: "REMOVE_FROM_CART"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "SET_ITEM_WEIGHT"; productId: string; weightKg: number }
  | { type: "CLEAR_CART" }
  | { type: "SET_DISCOUNT"; discount: Discount }
  | { type: "CLEAR_DISCOUNT" }
  | { type: "SET_PAYMENT_METHOD"; method: PaymentMethod }
  | { type: "COMPLETE_SALE" }
  | { type: "NEW_SALE" }
  | { type: "PARK_SALE"; label?: string }
  | { type: "RESUME_SALE"; parkedId: number }
  | { type: "DISCARD_PARKED"; parkedId: number };

// ─── Reducer ─────────────────────────────────────────────────────────

const initialState: SalesState = {
  session: null,
  cart: [],
  discount: null,
  paymentMethod: "card",
  completedSales: [],
  parkedSales: [],
  nextSaleId: 4093,
  nextParkedId: 1,
};

function salesReducer(state: SalesState, action: SalesAction): SalesState {
  switch (action.type) {
    case "OPEN_SESSION":
      return {
        ...state,
        session: {
          operatorId: action.operator.id,
          operatorName: action.operator.name,
          cashFund: action.cashFund,
          openedAt: new Date(),
        },
      };

    case "CLOSE_SESSION":
      return { ...initialState };

    case "ADD_TO_CART": {
      const qty = action.quantity ?? 1;
      const existing = state.cart.find((item) => item.product.id === action.product.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.product.id === action.product.id
              ? { ...item, quantity: item.quantity + qty }
              : item,
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { product: action.product, quantity: qty }],
      };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.product.id !== action.productId),
      };

    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter((item) => item.product.id !== action.productId),
        };
      }
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.product.id === action.productId ? { ...item, quantity: action.quantity } : item,
        ),
      };
    }

    case "SET_ITEM_WEIGHT": {
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.product.id === action.productId
            ? { ...item, quantity: action.weightKg }
            : item,
        ),
      };
    }

    case "CLEAR_CART":
      return { ...state, cart: [], discount: null };

    case "SET_DISCOUNT":
      return { ...state, discount: action.discount };

    case "CLEAR_DISCOUNT":
      return { ...state, discount: null };

    case "SET_PAYMENT_METHOD":
      return { ...state, paymentMethod: action.method };

    case "COMPLETE_SALE": {
      if (state.cart.length === 0) return state;

      const summary = calculateCartSummary(state.cart);
      const discountResult = state.discount
        ? applyDiscount(summary.subtotal, state.discount)
        : { discountAmount: 0, total: summary.subtotal };

      const sale: CompletedSale = {
        id: state.nextSaleId,
        items: [...state.cart],
        subtotal: summary.subtotal,
        discountAmount: discountResult.discountAmount,
        total: discountResult.total,
        paymentMethod: state.paymentMethod,
        completedAt: new Date(),
      };

      return {
        ...state,
        cart: [],
        discount: null,
        paymentMethod: "card",
        completedSales: [...state.completedSales, sale],
        nextSaleId: state.nextSaleId + 1,
      };
    }

    case "NEW_SALE":
      return { ...state, cart: [], discount: null, paymentMethod: "card" };

    case "PARK_SALE": {
      if (state.cart.length === 0) return state;
      const parked: ParkedSale = {
        id: state.nextParkedId,
        items: [...state.cart],
        discount: state.discount,
        paymentMethod: state.paymentMethod,
        parkedAt: new Date(),
        label: action.label ?? `Venda #${state.nextParkedId}`,
      };
      return {
        ...state,
        cart: [],
        discount: null,
        paymentMethod: "card",
        parkedSales: [...state.parkedSales, parked],
        nextParkedId: state.nextParkedId + 1,
      };
    }

    case "RESUME_SALE": {
      const target = state.parkedSales.find((s) => s.id === action.parkedId);
      if (!target) return state;
      return {
        ...state,
        cart: target.items,
        discount: target.discount,
        paymentMethod: target.paymentMethod,
        parkedSales: state.parkedSales.filter((s) => s.id !== action.parkedId),
      };
    }

    case "DISCARD_PARKED":
      return {
        ...state,
        parkedSales: state.parkedSales.filter((s) => s.id !== action.parkedId),
      };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────

type SalesContextValue = {
  state: SalesState;
  dispatch: Dispatch<SalesAction>;
  cartSummary: { itemCount: number; weightKg: number; subtotal: number };
  cartTotal: { discountAmount: number; total: number };
  sessionStats: {
    salesCount: number;
    totalRevenue: number;
    averageTicket: number;
    paymentBreakdown: Array<{ label: string; value: number }>;
  };
};

const SalesContext = createContext<SalesContextValue | null>(null);

export function SalesProvider({ children }: { children: ReactNode }): ReactElement {
  const [state, dispatch] = useReducer(salesReducer, initialState);

  const cartSummary = useMemo(() => calculateCartSummary(state.cart), [state.cart]);

  const cartTotal = useMemo(() => {
    if (state.discount) {
      return applyDiscount(cartSummary.subtotal, state.discount);
    }
    return { discountAmount: 0, total: cartSummary.subtotal };
  }, [cartSummary.subtotal, state.discount]);

  const sessionStats = useMemo(() => {
    const sales = state.completedSales;
    const totalRevenue = sales.reduce((sum, sale) => roundMoney(sum + sale.total), 0);
    const salesCount = sales.length;
    const averageTicket = salesCount > 0 ? roundMoney(totalRevenue / salesCount) : 0;

    const breakdownMap = new Map<string, number>();
    const methodLabels: Record<PaymentMethod, string> = {
      cash: "Dinheiro",
      card: "Cartão de Crédito",
      pix: "Pix",
      ticket: "Ticket Refeição",
    };

    for (const sale of sales) {
      const label = methodLabels[sale.paymentMethod];
      breakdownMap.set(label, roundMoney((breakdownMap.get(label) ?? 0) + sale.total));
    }

    const paymentBreakdown = Array.from(breakdownMap.entries()).map(([label, value]) => ({
      label,
      value,
    }));

    return { salesCount, totalRevenue, averageTicket, paymentBreakdown };
  }, [state.completedSales]);

  const value = useMemo<SalesContextValue>(
    () => ({ state, dispatch, cartSummary, cartTotal, sessionStats }),
    [state, dispatch, cartSummary, cartTotal, sessionStats],
  );

  return <SalesContext.Provider value={value}>{children}</SalesContext.Provider>;
}

export function useSales(): SalesContextValue {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error("useSales must be used within a SalesProvider");
  }
  return context;
}

// ─── Clock Hook ──────────────────────────────────────────────────────

export function useClock(): string {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatTime(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
