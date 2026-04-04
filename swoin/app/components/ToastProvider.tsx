"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

const ToastContext = createContext<(msg: string) => void>(() => {});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState({ message: "", visible: false, key: 0 });

  const showToast = useCallback((message: string) => {
    setToast((prev) => ({ message, visible: true, key: prev.key + 1 }));
    setTimeout(
      () => setToast((prev) => ({ ...prev, visible: false })),
      2500
    );
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        className={`fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl bg-inverse-surface text-inverse-on-surface font-headline font-bold text-sm shadow-2xl transition-all duration-300 pointer-events-none whitespace-nowrap ${
          toast.visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95"
        }`}
      >
        {toast.message}
      </div>
    </ToastContext.Provider>
  );
}
