import { create } from "zustand";

export interface BoardState {
  /** Grid dimensions in tiles. */
  width: number;
  height: number;

  setGridSize: (width: number, height: number) => void;
}

/** Tile limits — sensible bounds for planners, adjustable in Phase 2 UI. */
export const GRID_MIN = 10;
export const GRID_MAX = 200;

export const GRID_START = { width: 40, height: 40 } as const;

/**
 * Pure data model of the board (headless, testable). Canvas rendering (Phase 2)
 * is only a view of this state.
 */
export const useBoardStore = create<BoardState>()((set) => ({
  width: GRID_START.width,
  height: GRID_START.height,
  setGridSize: (width, height) =>
    set({
      width: Math.min(GRID_MAX, Math.max(GRID_MIN, width)),
      height: Math.min(GRID_MAX, Math.max(GRID_MIN, height)),
    }),
}));
