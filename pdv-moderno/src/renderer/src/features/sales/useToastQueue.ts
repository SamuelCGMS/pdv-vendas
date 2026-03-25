import { useCallback, useEffect, useRef, useState } from 'react';

export type ToastTone = 'info' | 'success' | 'warning' | 'danger';

export interface ToastItem {
  id: string;
  tone?: ToastTone;
  title?: string;
  message?: string;
}

export interface ToastInput extends Omit<ToastItem, 'id'> {
  duration?: number;
}

export function useToastQueue() {
  const timersRef = useRef(new Map<string, number>());
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((toastId: string) => {
    const timerId = timersRef.current.get(toastId);

    if (timerId) {
      window.clearTimeout(timerId);
      timersRef.current.delete(toastId);
    }

    setToasts((previousToasts) => {
      return previousToasts.filter((toast) => toast.id !== toastId);
    });
  }, []);

  const addToast = useCallback((toast: ToastInput) => {
    const toastId = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const duration = toast.duration ?? 2800;

    setToasts((previousToasts) => {
      return [...previousToasts, { ...toast, id: toastId }];
    });

    const timerId = window.setTimeout(() => {
      dismissToast(toastId);
    }, duration);

    timersRef.current.set(toastId, timerId);
  }, [dismissToast]);

  useEffect(() => {
    const activeTimers = timersRef.current;

    return () => {
      activeTimers.forEach((timerId) => {
        window.clearTimeout(timerId);
      });
      activeTimers.clear();
    };
  }, []);

  return {
    toasts,
    addToast,
    dismissToast,
  } as const;
}
