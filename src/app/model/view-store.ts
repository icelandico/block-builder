import { create } from "zustand";

import type { GameId } from "@entities/game";

export type View = "chooser" | "planner";

interface ViewState {
  view: View;
  selectedGameId: GameId | null;
  chooseGame: (gameId: GameId) => void;
  backToChooser: () => void;
}

/**
 * App-level navigation state. Phase 1 uses a simple view switch instead of a
 * router — the planner is the only destination reachable via `chooseGame`.
 */
export const useViewStore = create<ViewState>()((set) => ({
  view: "chooser",
  selectedGameId: null,
  chooseGame: (gameId) => set({ view: "planner", selectedGameId: gameId }),
  backToChooser: () => set({ view: "chooser" }),
}));
