"use client";

import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Hook to warn users before leaving a page with unsaved changes
 * @param isDirty - Whether the form has unsaved changes
 * @param message - Custom warning message (optional)
 */
export function useUnsavedChangesWarning(
  isDirty: boolean,
  message: string = "You have unsaved changes. Are you sure you want to leave?"
) {
  const router = useRouter();
  const isDirtyRef = useRef(isDirty);

  // Keep ref in sync with isDirty
  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  // Handle browser beforeunload event (refresh, close tab)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirtyRef.current) return;

      e.preventDefault();
      // Modern browsers require returnValue to be set
      e.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [message]);

  // Function to safely navigate (with confirmation if dirty)
  const safeNavigate = useCallback(
    (url: string) => {
      if (isDirtyRef.current) {
        const confirmed = window.confirm(message);
        if (!confirmed) return false;
      }
      router.push(url);
      return true;
    },
    [router, message]
  );

  // Function to check and confirm before action
  const confirmLeave = useCallback(() => {
    if (!isDirtyRef.current) return true;
    return window.confirm(message);
  }, [message]);

  return {
    /** Safely navigate to a URL (shows confirmation if dirty) */
    safeNavigate,
    /** Check if it's safe to leave (shows confirmation if dirty) */
    confirmLeave,
  };
}

export default useUnsavedChangesWarning;
