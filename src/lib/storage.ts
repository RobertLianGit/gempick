import type { BracketState, SavedState } from "@/src/types/bracket";

export const STORAGE_KEY = "gempick:lastsong:v1";

export function createEmptyState(): SavedState {
  return {
    schemaVersion: 1,
    selectedTrackIds: [],
    starterSeeded: false,
    updatedAt: new Date().toISOString(),
  };
}

export function loadState(): SavedState {
  if (typeof window === "undefined") return createEmptyState();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return createEmptyState();
  try {
    const parsed = JSON.parse(raw) as SavedState;
    if (parsed.schemaVersion !== 1 || !Array.isArray(parsed.selectedTrackIds)) {
      throw new Error("Unsupported storage schema");
    }
    return parsed;
  } catch {
    return createEmptyState();
  }
}

export function saveSelection(selectedTrackIds: string[]) {
  const current = loadState();
  const next: SavedState = {
    ...current,
    selectedTrackIds: [...new Set(selectedTrackIds)],
    starterSeeded: true,
    bracket: undefined,
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function saveBracket(bracket: BracketState) {
  const next: SavedState = {
    schemaVersion: 1,
    selectedTrackIds: bracket.selectedTrackIds,
    starterSeeded: true,
    bracket,
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function clearState() {
  if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
}
