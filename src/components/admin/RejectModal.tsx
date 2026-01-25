"use client";

import { useEffect, useRef } from "react";
import { Loader2, X } from "lucide-react";

/**
 * RejectModal - Modal dialog for entering a rejection reason.
 * Supports pre-built templates, custom text, bulk rejection,
 * and keyboard/focus-trap accessibility.
 */

// ── Rejection templates ────────────────────────────────────────────────────

export const REJECTION_TEMPLATES = [
  { label: "Select a template...", value: "" },
  {
    label: "Incomplete submission - Missing required information",
    value:
      "Your submission is incomplete. Please ensure all required fields are filled out, including app name, description, logo, and working demo URL.",
  },
  {
    label: "Quality issues - Low quality or broken app",
    value:
      "We cannot approve this app due to quality concerns. The app appears broken, has significant bugs, or does not meet our minimum quality standards. Please fix these issues and resubmit.",
  },
  {
    label: "Policy violation - Inappropriate content",
    value:
      "This app violates our marketplace policies regarding appropriate content. Please review our guidelines and ensure your app complies before resubmitting.",
  },
  {
    label: "Spam or malicious content",
    value:
      "This submission appears to be spam or contains potentially malicious content. If you believe this is an error, please contact support.",
  },
  {
    label: "Duplicate submission",
    value:
      "This app appears to be a duplicate of an existing submission. Please check your developer dashboard for existing submissions before creating new ones.",
  },
  {
    label: "Non-functional demo URL",
    value:
      "The demo URL provided is not accessible or does not work properly. Please ensure your app is publicly accessible and functioning correctly before resubmitting.",
  },
  {
    label: "Misleading information",
    value:
      "The information provided about this app is misleading or inaccurate. Please ensure all details (description, screenshots, features) accurately represent your app.",
  },
  { label: "Custom reason", value: "CUSTOM" },
] as const;

// ── Props ──────────────────────────────────────────────────────────────────

export interface RejectModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Number of apps being rejected (>1 = bulk mode) */
  bulkCount: number;
  /** Current rejection reason text */
  rejectReason: string;
  /** Callback when reason text changes */
  onRejectReasonChange: (reason: string) => void;
  /** Currently selected template value */
  selectedTemplate: string;
  /** Callback when a template is selected */
  onTemplateChange: (value: string) => void;
  /** Whether the rejection is currently being processed */
  isProcessing: boolean;
  /** Confirm the rejection */
  onConfirm: () => void;
  /** Cancel and close the modal */
  onCancel: () => void;
}

// ── Component ──────────────────────────────────────────────────────────────

export function RejectModal({
  isOpen,
  bulkCount,
  rejectReason,
  onRejectReasonChange,
  selectedTemplate,
  onTemplateChange,
  isProcessing,
  onConfirm,
  onCancel,
}: RejectModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const isBulk = bulkCount > 1;

  // Trap focus inside modal and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    // Focus the first focusable element on open
    cancelButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
        return;
      }

      // Basic focus trap
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-modal-title"
    >
      <div
        ref={dialogRef}
        className="w-full max-w-lg rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 id="reject-modal-title" className="text-lg font-medium text-slate-100">
            Reject Application{isBulk ? "s" : ""}
          </h3>
          <button
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-300"
            aria-label="Close rejection modal"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-2 text-sm text-slate-500">
          {isBulk
            ? `This rejection reason will be applied to ${bulkCount} selected apps.`
            : "Please provide a reason for rejection. This will be shared with the developer."}
        </p>

        {/* Template dropdown */}
        <div className="mt-4">
          <label htmlFor="reject-template-select" className="text-xs font-medium text-slate-400">
            Quick Templates
          </label>
          <select
            id="reject-template-select"
            value={selectedTemplate}
            onChange={(e) => onTemplateChange(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-slate-200 focus:border-slate-600 focus:outline-none"
          >
            {REJECTION_TEMPLATES.map((template) => (
              <option key={template.value} value={template.value}>
                {template.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reason textarea */}
        <div className="mt-4">
          <label htmlFor="reject-reason-textarea" className="text-xs font-medium text-slate-400">
            Rejection Reason {selectedTemplate === "CUSTOM" && "(Custom)"}
          </label>
          <textarea
            id="reject-reason-textarea"
            value={rejectReason}
            onChange={(e) => onRejectReasonChange(e.target.value)}
            rows={4}
            placeholder="Reason for rejection..."
            className="mt-1.5 w-full resize-none rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none"
          />
          <p className="mt-1.5 text-xs text-slate-500" aria-live="polite">
            {rejectReason.length} characters
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            ref={cancelButtonRef}
            onClick={onCancel}
            className="rounded-md border border-slate-800 px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!rejectReason.trim() || isProcessing}
            aria-busy={isProcessing}
            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {isProcessing
              ? "Rejecting..."
              : isBulk
              ? `Reject ${bulkCount} Apps`
              : "Reject Application"}
          </button>
        </div>
      </div>
    </div>
  );
}
