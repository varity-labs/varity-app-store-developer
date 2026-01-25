"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Hook to persist form data to localStorage with draft saving and dirty state tracking
 * @param key - Unique key for localStorage
 * @param initialData - Initial form data
 * @param options - Configuration options
 */
export function useFormPersistence<T extends Record<string, unknown>>(
  key: string,
  initialData: T,
  options: {
    /** Debounce delay in ms for auto-saving (default: 500) */
    debounceMs?: number;
    /** Whether to restore from localStorage on mount (default: true) */
    restoreOnMount?: boolean;
  } = {}
) {
  const { debounceMs = 500, restoreOnMount = true } = options;

  // Initialize with localStorage data if available and restoreOnMount is true
  const [data, setData] = useState<T>(() => {
    if (typeof window === "undefined") return initialData;
    if (!restoreOnMount) return initialData;

    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with initial data to ensure all fields exist
        return { ...initialData, ...parsed };
      }
    } catch (error) {
      console.warn(`Failed to restore form data from localStorage: ${error}`);
    }
    return initialData;
  });

  // Track the original data to determine dirty state
  const [originalData, setOriginalData] = useState<T>(initialData);

  // Track if form has been modified
  const [isDirty, setIsDirty] = useState(false);

  // Track if there was a restored draft
  const [hasDraft, setHasDraft] = useState(false);

  // Track last saved timestamp
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Debounce timer ref
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if form is dirty by comparing current data with original
  const checkDirty = useCallback(
    (currentData: T): boolean => {
      return JSON.stringify(currentData) !== JSON.stringify(originalData);
    },
    [originalData]
  );

  // Save to localStorage (debounced)
  const saveToStorage = useCallback(
    (dataToSave: T) => {
      if (typeof window === "undefined") return;

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = setTimeout(() => {
        try {
          localStorage.setItem(key, JSON.stringify(dataToSave));
          setLastSaved(new Date());
        } catch (error) {
          console.warn(`Failed to save form data to localStorage: ${error}`);
        }
      }, debounceMs);
    },
    [key, debounceMs]
  );

  // Update data and save to localStorage
  const updateData = useCallback(
    (newData: T | ((prev: T) => T)) => {
      setData((prev) => {
        const updated = typeof newData === "function" ? newData(prev) : newData;
        setIsDirty(checkDirty(updated));
        saveToStorage(updated);
        return updated;
      });
    },
    [checkDirty, saveToStorage]
  );

  // Update a single field
  const updateField = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      updateData((prev) => ({ ...prev, [field]: value }));
    },
    [updateData]
  );

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(key);
      setHasDraft(false);
      setLastSaved(null);
    } catch (error) {
      console.warn(`Failed to clear draft from localStorage: ${error}`);
    }
  }, [key]);

  // Reset form to initial/original data and clear draft
  const resetForm = useCallback(() => {
    setData(initialData);
    setIsDirty(false);
    clearDraft();
  }, [initialData, clearDraft]);

  // Reset form to new original data (e.g., after loading from server)
  const setOriginal = useCallback(
    (newOriginal: T) => {
      setOriginalData(newOriginal);
      setData(newOriginal);
      setIsDirty(false);
      clearDraft();
    },
    [clearDraft]
  );

  // Discard changes and restore original
  const discardChanges = useCallback(() => {
    setData(originalData);
    setIsDirty(false);
    clearDraft();
  }, [originalData, clearDraft]);

  // Check for existing draft on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!restoreOnMount) return;

    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if saved data differs from initial
        if (JSON.stringify(parsed) !== JSON.stringify(initialData)) {
          setHasDraft(true);
        }
      }
    } catch {
      // Ignore errors
    }
  }, [key, initialData, restoreOnMount]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  return {
    /** Current form data */
    data,
    /** Update the entire form data */
    setData: updateData,
    /** Update a single field */
    updateField,
    /** Whether the form has unsaved changes */
    isDirty,
    /** Whether a draft was restored from localStorage */
    hasDraft,
    /** Last time the draft was auto-saved */
    lastSaved,
    /** Clear the saved draft */
    clearDraft,
    /** Reset form to initial state */
    resetForm,
    /** Set new original data (e.g., after loading from server) */
    setOriginal,
    /** Discard changes and restore to original */
    discardChanges,
  };
}

export default useFormPersistence;
