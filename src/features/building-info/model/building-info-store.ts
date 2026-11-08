import { create } from "zustand";

/**
 * Structure Info toggle: one button, two behaviors.
 *
 * - Off — hover inspection: hovering a structure recolors it grey, switches
 *   the cursor to the info cursor, and shows the structure name in a tooltip.
 * - On — name labels: every structure shows its name inside its footprint;
 *   hover inspection is paused.
 *
 * `hoveredId` is transient pointer state (headless store so the canvas can
 * read it for the cursor and tooltip without prop drilling).
 */
interface BuildingInfoState {
  /** Whether name labels are always shown inside the structures. */
  enabled: boolean;
  /** Placed building id currently hovered for inspection (null = none). */
  hoveredId: string | null;

  toggle: () => void;
  setHovered: (id: string | null) => void;
}

export const useBuildingInfoStore = create<BuildingInfoState>()((set) => ({
  enabled: false,
  hoveredId: null,
  // Switching modes hides the tooltip so a stale hover can't linger.
  toggle: () =>
    set((state) => ({ enabled: !state.enabled, hoveredId: null })),
  setHovered: (id) => set({ hoveredId: id }),
}));
