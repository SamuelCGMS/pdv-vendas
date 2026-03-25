import { useCallback, useRef } from 'react';

export function useSearchInputFocus() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const focusInput = useCallback(() => {
    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, []);

  return {
    inputRef,
    focusInput,
  } as const;
}
