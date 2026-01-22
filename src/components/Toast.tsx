"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  type: ToastType;
  title: string;
  message?: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({
  type,
  title,
  message,
  onClose,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: "bg-emerald-950/90 border-emerald-900",
      icon: <CheckCircle className="h-5 w-5 text-emerald-400" />,
      titleColor: "text-emerald-400",
      messageColor: "text-emerald-400/80",
    },
    error: {
      bg: "bg-red-950/90 border-red-900",
      icon: <XCircle className="h-5 w-5 text-red-400" />,
      titleColor: "text-red-400",
      messageColor: "text-red-400/80",
    },
    info: {
      bg: "bg-blue-950/90 border-blue-900",
      icon: <AlertCircle className="h-5 w-5 text-blue-400" />,
      titleColor: "text-blue-400",
      messageColor: "text-blue-400/80",
    },
  };

  const style = styles[type];

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border ${style.bg} p-4 shadow-lg backdrop-blur-sm animate-slide-in-right`}
      role="alert"
    >
      <div className="flex-shrink-0">{style.icon}</div>
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium ${style.titleColor}`}>{title}</h3>
        {message && (
          <p className={`mt-1 text-sm ${style.messageColor}`}>{message}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-slate-400 hover:text-slate-200 transition-colors"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{ id: string; type: ToastType; title: string; message?: string }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}
