// components/Toast/Toast.tsx
import { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
  errors?: string[]; // ✅ For multiple validation errors
}

export const Toast = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose,
  errors = []
}: ToastProps) => {
  
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  // ✅ Icon mapping based on toast type
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  // ✅ Color styling based on type
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const iconColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-[300px] w-full animate-slide-in`}>
      <div className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg ${styles[type]}`}>
        <div className={iconColors[type]}>
          {icons[type]}
        </div>
        
        <div className="flex-1">
          <p className="font-medium text-sm">{message}</p>
          
          {/* ✅ Display multiple errors if present */}
          {errors.length > 0 && (
            <ul className="mt-2 space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-xs flex items-start gap-1">
                  <span className="mt-0.5">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

