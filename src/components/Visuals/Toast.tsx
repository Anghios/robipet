import { useEffect } from 'react';
import { Icon } from '@iconify/react';

export interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface ToastProps {
  toast: ToastData;
  onClose: (id: number) => void;
  duration?: number;
}

export default function Toast({ toast, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, onClose, duration]);

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-900/90 border-green-500/50 text-green-100';
      case 'warning':
        return 'bg-yellow-900/90 border-yellow-500/50 text-yellow-100';
      default:
        return 'bg-red-900/90 border-red-500/50 text-red-100';
    }
  };

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Icon icon="mdi:check-circle" className="w-6 h-6" />;
      case 'warning':
        return <Icon icon="mdi:alert" className="w-6 h-6" />;
      default:
        return <Icon icon="mdi:close-circle" className="w-6 h-6" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className={`max-w-md p-4 rounded-xl shadow-2xl border ${getToastStyles(toast.type)}`}>
        <div className="flex items-start gap-3">
          <div className="text-2xl">
            {getToastIcon(toast.type)}
          </div>
          <div className="flex-1">
            <p className="font-medium">{toast.message}</p>
          </div>
          <button
            onClick={() => onClose(toast.id)}
            className="text-white/70 hover:text-white transition-colors ml-2"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}