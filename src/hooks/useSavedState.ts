"use client";

import { useCallback, useEffect, useState } from "react";
import type { BracketState, SavedState } from "@/src/types/bracket";
import {
  clearState,
  createEmptyState,
  loadState,
  saveBracket,
  saveSelection,
} from "@/src/lib/storage";

export function useSavedState() {
  const [state, setState] = useState<SavedState>(createEmptyState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setState(loadState());
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const updateSelection = useCallback((trackIds: string[]) => {
    setState(saveSelection(trackIds));
  }, []);

  const updateBracket = useCallback((bracket: BracketState) => {
    setState(saveBracket(bracket));
  }, []);

  const reset = useCallback(() => {
    clearState();
    setState(createEmptyState());
  }, []);

  return { state, hydrated, updateSelection, updateBracket, reset };
}
