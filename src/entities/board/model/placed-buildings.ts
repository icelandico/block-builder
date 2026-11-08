import { create } from "zustand";
import { tileKeys, type Rotation, type Tile } from "./footprint";

/**
 * A building placed on the board. The catalog def is referenced by id
 * (@entities/building); the covered `tiles` are precomputed at placement time
 * so this headless store stays self-contained (no def-size dependency) for
 * rendering, overlap checks and selection.
 */
export interface BuildingInstance {
  /** Stable unique id within this store ("b1", "b2", …). */
  id: string;
  defId: string;
  /** Anchor tile — the top-left corner of the footprint at placement time. */
  x: number;
  y: number;
  rot: Rotation;
  tiles: Tile[];
}

interface PlacedBuildingsState {
  items: BuildingInstance[];
  selectedId: string | null;

  /** Anchor a building: store it with its precomputed footprint tiles. */
  place: (defId: string, x: number, y: number, rot: Rotation, tiles: Tile[]) => string;
  update: (id: string, patch: Partial<Omit<BuildingInstance, "id" | "defId">>) => void;
  remove: (id: string) => void;
  /** Remove every placed building at once (clear-all). */
  clearAll: () => void;

  select: (id: string | null) => void;
}

let nextId = 0;

/**
 * Pure data model of placed buildings (headless, testable). Canvas rendering
 * and interactions (ghost preview, bulldoze) are only views/controllers of
 * this state. Raised empty for a new call — callers clear first.
 */
export const usePlacedBuildingsStore = create<PlacedBuildingsState>()(
  (set) => ({
    items: [],
    selectedId: null,

    place: (defId, x, y, rot, tiles) => {
      const id = `b${++nextId}`;
      set((state) => ({
        items: [...state.items, { id, defId, x, y, rot, tiles }],
      }));
      return id;
    },

    update: (id, patch) =>
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, ...patch } : item,
        ),
      })),

    remove: (id) =>
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        selectedId: state.selectedId === id ? null : state.selectedId,
      })),

    clearAll: () => set({ items: [], selectedId: null }),

    select: (id) =>
      set((state) => ({
        selectedId: id === null || state.items.some((item) => item.id === id)
          ? id
          : null,
      })),
  }),
);

/** Find the instance covering a tile, if any. */
export const instanceAt = (
  items: BuildingInstance[],
  x: number,
  y: number,
): BuildingInstance | undefined =>
  items.find((item) => item.tiles.some((t) => t.x === x && t.y === y));

/** Instances whose precomputed footprint overlaps any of `tiles` (optionally ignoring one id). */
export const conflictsWith = (
  items: BuildingInstance[],
  tiles: Tile[],
  ignoreId?: string,
): BuildingInstance[] => {
  const keys = new Set(tileKeys(tiles));
  return items.filter(
    (item) =>
      item.id !== ignoreId &&
      item.tiles.some((t) => keys.has(`${t.x}:${t.y}`)),
  );
};
