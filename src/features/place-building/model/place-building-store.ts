import { create } from "zustand";
import {
  nextRotation,
  useBoardStore,
  usePlacedBuildingsStore,
  type Rotation,
  type Tile,
} from "@entities/board";
import { getDef } from "@entities/building";
import { anchorTile, computePlan, occupiedKeys, type DragRun } from "./placement";

/**
 * Placement interaction state: which def is pending for placement, the
 * pending rotation (R), the tile under the pointer, and the active drag for
 * run/paint placing. Rendering (ghost preview) and pointer wiring are views
 * of this state — the store is headless.
 */
interface PlaceBuildingState {
  pending: { defId: string; rot: Rotation } | null;
  hover: Tile | null;
  drag: DragRun | null;

  /** Start placing a def (from the sidebar). */
  setPending: (defId: string) => void;
  rotatePending: () => void;
  cancel: () => void;

  hoverAt: (tile: Tile | null) => void;
  dragStart: (tile: Tile) => void;
  dragMove: (tile: Tile) => void;
  dragEnd: () => void;
}

export const usePlaceBuildingStore = create<PlaceBuildingState>()((set, get) => ({
  pending: null,
  hover: null,
  drag: null,

  setPending: (defId) => {
    // A pending def and a selected building would both react to `R` —
    // keep the two interactions mutually exclusive.
    usePlacedBuildingsStore.getState().select(null);
    set({ pending: { defId, rot: 0 }, hover: null, drag: null });
  },

  rotatePending: () =>
    set((state) =>
      state.pending
        ? { ...state, pending: { ...state.pending, rot: nextRotation(state.pending.rot) } }
        : state,
    ),

  cancel: () => set({ pending: null, hover: null, drag: null }),

  hoverAt: (tile) => {
    const state = get();
    if (!state.pending) return;
    set({ hover: tile });
  },

  dragStart: (tile) => {
    const state = get();
    if (!state.pending) return;
    set({ drag: { start: tile, current: tile } });
  },

  dragMove: (tile) => {
    const state = get();
    if (!state.pending) return;
    if (state.drag) set({ drag: { ...state.drag, current: tile } });
    else set({ hover: tile });
  },

  dragEnd: () => {
    const state = get();
    const { pending, drag } = state;
    if (!pending || !drag) return;

    const def = getDef(pending.defId);
    if (!def) {
      set({ drag: null });
      return;
    }

    const grid = useBoardStore.getState();
    const placedStore = usePlacedBuildingsStore.getState();
    const plan = computePlan({
      def,
      rot: pending.rot,
      drag,
      gridW: grid.width,
      gridH: grid.height,
      occupied: occupiedKeys(placedStore.items),
    });
    if (!plan.valid) {
      set({ drag: null });
      return;
    }

    if (plan.commit === "paint") {
      // One instance per tile — the anchor of each is the tile itself.
      for (const tile of plan.tiles) {
        placedStore.place(def.id, tile.x, tile.y, plan.rot, [tile]);
      }
    } else {
      const anchor = anchorTile(plan.tiles);
      placedStore.place(def.id, anchor.x, anchor.y, plan.rot, plan.tiles);
    }

    // Keep the def pending (drawing road chains back-to-back stays light);
    // end the gesture only.
    set({ drag: null, hover: null });
  },
}));
