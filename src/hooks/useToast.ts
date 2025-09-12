import { useState, useCallback } from 'react';

export interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

export function useToast() {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'error') => {
    const id = Date.now();
    setToast({ message, type, id });
  }, []);

  const hideToast = useCallback((id?: number) => {
    setToast(null);
  }, []);

  return {
    toast,
    showToast,
    hideToast
  };
}