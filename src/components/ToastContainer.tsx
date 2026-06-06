import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

const detectToastType = (message: string): 'success' | 'error' | 'warning' | 'info' => {
  const msg = message.toLowerCase();
  
  if (
    msg.includes('success') ||
    msg.includes('earned') ||
    msg.includes('added to cart') ||
    msg.includes('added to wishlist') ||
    msg.includes('updated') ||
    msg.includes('saved') ||
    msg.includes('deleted') ||
    msg.includes('downloaded') ||
    msg.includes('verified') ||
    msg.includes('order placed') ||
    msg.includes('loyalty points') ||
    msg.includes('registered') ||
    msg.includes('logged in') ||
    msg.includes('welcome')
  ) {
    return 'success';
  }
  
  if (
    msg.includes('fail') ||
    msg.includes('error') ||
    msg.includes('invalid') ||
    msg.includes('username') ||
    msg.includes('password') ||
    msg.includes('missing') ||
    msg.includes('cannot be shared') ||
    msg.includes('blocked')
  ) {
    return 'error';
  }
  
  if (
    msg.includes('warning') ||
    msg.includes('not enough') ||
    msg.includes('stock') ||
    msg.includes('select first') ||
    msg.includes('select a size') ||
    msg.includes('select a colour') ||
    msg.includes('delete again') ||
    msg.includes('not available yet')
  ) {
    return 'warning';
  }
  
  return 'info';
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleAdd = (e: CustomEvent) => {
      const detail = e.detail;
      let message = '';
      let type: 'success' | 'error' | 'warning' | 'info' = 'info';
      let duration = 3500;

      if (typeof detail === 'string') {
        message = detail;
        type = detectToastType(detail);
      } else if (detail && typeof detail === 'object') {
        message = detail.message || '';
        type = detail.type || detectToastType(message);
        duration = detail.duration || 3500;
      }

      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      // Automatically remove toast after its duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    };

    window.addEventListener('toast' as any, handleAdd);
    return () => window.removeEventListener('toast' as any, handleAdd);
  }, []);

  const handleManualClose = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-24 right-4 md:right-6 z-[9999] flex flex-col gap-3 w-full max-w-[360px] pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let IconComp = Info;
          let iconColor = 'text-blue-500';
          let borderClass = 'border-l-4 border-l-blue-500';
          let barBg = 'bg-blue-500';

          if (toast.type === 'success') {
            IconComp = CheckCircle2;
            iconColor = 'text-[#25D366]';
            borderClass = 'border-l-4 border-l-[#25D366]';
            barBg = 'bg-[#25D366]';
          } else if (toast.type === 'error') {
            IconComp = AlertCircle;
            iconColor = 'text-rose-500';
            borderClass = 'border-l-4 border-l-rose-500';
            barBg = 'bg-rose-500';
          } else if (toast.type === 'warning') {
            IconComp = AlertTriangle;
            iconColor = 'text-amber-500';
            borderClass = 'border-l-4 border-l-amber-500';
            barBg = 'bg-amber-500';
          } else {
            iconColor = 'text-[#1A1A5E]';
            borderClass = 'border-l-4 border-l-[#1A1A5E]';
            barBg = 'bg-[#1A1A5E]';
          }

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 50, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95, transition: { duration: 0.2 } }}
              className={`pointer-events-auto relative flex gap-3 p-4 rounded-md bg-white/95 backdrop-blur-md border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden ${borderClass}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                <IconComp className={`w-5 h-5 ${iconColor}`} />
              </div>
              <div className="flex-1 pr-4">
                <p className="text-xs font-semibold text-gray-800 leading-relaxed">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => handleManualClose(toast.id)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded-full hover:bg-gray-100/50 self-start"
              >
                <X className="w-4 h-4" />
              </button>
              
              {/* Progress Bar */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-[3px] opacity-60 ${barBg}`}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export const useToast = () => {
  return (
    message:
      | string
      | {
          message: string;
          type?: 'success' | 'error' | 'warning' | 'info';
          duration?: number;
        }
  ) => {
    window.dispatchEvent(new CustomEvent('toast', { detail: message }));
  };
};
