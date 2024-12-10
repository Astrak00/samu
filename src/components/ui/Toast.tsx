import { useEffect } from 'react';
import { XCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <AlertCircle className="w-5 h-5 text-blue-500" />,
  };

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg',
        {
          'bg-green-50 border border-green-200': type === 'success',
          'bg-red-50 border border-red-200': type === 'error',
          'bg-blue-50 border border-blue-200': type === 'info',
        }
      )}
    >
      {icons[type]}
      <p className={cn('text-sm font-medium', {
        'text-green-800': type === 'success',
        'text-red-800': type === 'error',
        'text-blue-800': type === 'info',
      })}>
        {message}
      </p>
      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-gray-600"
      >
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
}