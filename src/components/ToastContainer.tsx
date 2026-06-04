import { useState, useEffect } from 'react';

export default function ToastContainer() {
  const [toast, setToast] = useState<{ message: string, visible: boolean } | null>(null);

  useEffect(() => {
    const handleAdd = (e: CustomEvent) => {
      setToast({ message: e.detail, visible: true });
      setTimeout(() => setToast(prev => prev ? { ...prev, visible: false } : null), 3000);
    };

    window.addEventListener('toast' as any, handleAdd);
    return () => window.removeEventListener('toast' as any, handleAdd);
  }, []);

  if (!toast?.visible) return null;

  return (
    <div className="fixed bottom-16 lg:bottom-6 left-1/2 -translate-x-1/2 lg:left-6 lg:translate-x-0 bg-[#212121] text-white px-6 py-3 rounded-sm shadow-xl z-50 text-[14px] flex items-center min-w-[250px] animate-[slideUp_0.2s_ease-out]">
      {toast.message}
    </div>
  );
}

// Custom hook to trigger toast
export const useToast = () => {
  return (message: string) => {
    window.dispatchEvent(new CustomEvent('toast', { detail: message }));
  };
};
