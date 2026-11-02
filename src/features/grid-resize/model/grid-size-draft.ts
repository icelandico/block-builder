import { create } from "zustand";

/**
 * Local draft state for grid size editing: lets the user type freely and keeps
 * visible values in sync with the store (which clamps them to GRID_MIN..MAX).
 */
interface GridSizeDraftState {
  widthDraft: string | null;
  heightDraft: string | null;
  setWidthDraft: (value: string | null) => void;
  setHeightDraft: (value: string | null) => void;
}

export const useGridSizeDraftStore = create<GridSizeDraftState>()((set) => ({
  widthDraft: null,
  heightDraft: null,
  setWidthDraft: (value) => set({ widthDraft: value }),
  setHeightDraft: (value) => set({ heightDraft: value }),
}));

interface ClampResult {
  value: number;
  valid: boolean;
}

/** Parse a draft string; invalid input falls back to the current value. */
export const parseDraft = (text: string, fallback: number, min: number, max: number): ClampResult => {
  const parsed = Number.parseInt(text, 10);
  if (Number.isNaN(parsed)) {
    return { value: fallback, valid: false };
  }
  return { value: Math.min(max, Math.max(min, parsed)), valid: true };
};
