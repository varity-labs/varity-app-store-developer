"use client";

import { useEffect, useState, useRef } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

/**
 * Toast Component
 *
 * Notification toast with auto-dismiss, pause-on-hover, and progress bar.
 * Includes accessibility features like pause-on-focus and optional sound.
 *
 * @example
 * ```tsx
 * <Toast
 *   type="success"
 *   title="App submitted"
 *   message="Your app is now under review"
 *   onClose={handleClose}
 *   duration={5000}
 *   playSound={true}
 * />
 * ```
 */

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  /** Type of notification */
  type: ToastType;
  /** Toast title */
  title: string;
  /** Optional detailed message */
  message?: string;
  /** Callback when toast is closed */
  onClose: () => void;
  /** Auto-dismiss duration in ms (0 for manual close only) */
  duration?: number;
  /** Play notification sound (optional) */
  playSound?: boolean;
}

export function Toast({
  type,
  title,
  message,
  onClose,
  duration = 5000,
  playSound = false,
}: ToastProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(duration);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Play sound on mount if enabled
  useEffect(() => {
    if (playSound && typeof Audio !== 'undefined') {
      try {
        // Browser notification sound (frequency based on type)
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Different frequencies for different types
        const frequencies: Record<ToastType, number> = { success: 800, error: 400, warning: 600, info: 700 };
        oscillator.frequency.value = frequencies[type];
        gainNode.gain.value = 0.1;

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch (e) {
        // Silently fail if audio not supported
      }
    }
  }, [playSound, type]);

  useEffect(() => {
    if (duration <= 0) return;

    const startTimer = () => {
      startTimeRef.current = Date.now();

      timerRef.current = setTimeout(() => {
        onClose();
      }, remainingTimeRef.current);

      // Update progress bar every 50ms
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const newProgress = Math.max(0, ((remainingTimeRef.current - elapsed) / duration) * 100);
        setProgress(newProgress);
      }, 50);
    };

    const pauseTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    };

    if (!isPaused) {
      startTimer();
    } else {
      pauseTimer();
    }

    return () => {
      pauseTimer();
    };
  }, [duration, onClose, isPaused]);

  const styles = {
    success: {
      bg: "bg-emerald-950/90 border-emerald-900",
      icon: <CheckCircle className="h-5 w-5 text-emerald-400" />,
      titleColor: "text-emerald-400",
      messageColor: "text-emerald-400/80",
      progressColor: "bg-emerald-400",
    },
    error: {
      bg: "bg-red-950/90 border-red-900",
      icon: <XCircle className="h-5 w-5 text-red-400" />,
      titleColor: "text-red-400",
      messageColor: "text-red-400/80",
      progressColor: "bg-red-400",
    },
    warning: {
      bg: "bg-amber-950/90 border-amber-900",
      icon: <AlertCircle className="h-5 w-5 text-amber-400" />,
      titleColor: "text-amber-400",
      messageColor: "text-amber-400/80",
      progressColor: "bg-amber-400",
    },
    info: {
      bg: "bg-blue-950/90 border-blue-900",
      icon: <AlertCircle className="h-5 w-5 text-blue-400" />,
      titleColor: "text-blue-400",
      messageColor: "text-blue-400/80",
      progressColor: "bg-blue-400",
    },
  };

  const style = styles[type];

  return (
    <div
      className={`flex flex-col gap-2 rounded-lg border ${style.bg} p-4 shadow-lg backdrop-blur-sm animate-slide-in-right relative overflow-hidden`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      tabIndex={0}
    >
      <div className="flex items-start gap-3">
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

      {/* Progress bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div
            className={`h-full ${style.progressColor} transition-all duration-50 ease-linear`}
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />
        </div>
      )}
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
