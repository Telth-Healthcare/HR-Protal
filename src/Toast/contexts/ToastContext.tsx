// contexts/ToastContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { Toast, ToastType } from '../../Toast/Toast';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  errors?: string[];
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
  showSuccess: (message: string) => void;
  showError: (message: string, errors?: string[]) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastOptions | null>(null);

  const showToast = (options: ToastOptions) => {
    setToast(options);
  };

  const showSuccess = (message: string) => {
    setToast({ message, type: 'success' });
  };

  const showError = (message: string, errors?: string[]) => {
    setToast({ message, type: 'error', errors, duration: 7000 });
  };

  const showWarning = (message: string) => {
    setToast({ message, type: 'warning' });
  };

  const showInfo = (message: string) => {
    setToast({ message, type: 'info' });
  };

  const hideToast = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning, showInfo }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          errors={toast.errors}
          onClose={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};