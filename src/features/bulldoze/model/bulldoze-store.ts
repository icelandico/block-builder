import { create } from "zustand";

/**
 * Bulldoze tool state: while the tool is on, clicking a placed building
 * removes it (pointer wiring in the board widget — not here). The tool is
 * mutually exclusive with the placement flow (the toolbar toggles one off
 * when the other is armed).
 */
interface BulldozeState {
  enabled: boolean;
  toggle: () => void;
  enable: (value: boolean) => void;
}

export const useBulldozeStore = create<BulldozeState>()((set) => ({
  enabled: false,
  toggle: () => set((state) => ({ enabled: !state.enabled })),
  enable: (value) => set({ enabled: value }),
}));
