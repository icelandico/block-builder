import { useEffect } from "react";
import { PlannerLayout } from "@widgets/planner-layout";
import { Board } from "@widgets/board";
import { BoardToolbar } from "@widgets/board-toolbar";
import { BuildingSidebar } from "@widgets/building-sidebar";
import { getGame } from "@entities/game";
import { getCatalog } from "@entities/building";
import type { GameId } from "@entities/game";
import { usePlacedBuildingsStore } from "@entities/board";
import { useBulldozeStore } from "@features/bulldoze";
import { useBuildingInfoStore } from "@features/building-info";
import { useRotateShortcut } from "@features/rotate";
import { usePlaceBuildingStore } from "@features/place-building";
import { usePlannerShortcuts } from "../model/planner-shortcuts";

interface PlannerPageProps {
  gameId: GameId;
  onBack: () => void;
}

/**
 * Reset transient interaction state when leaving the planner (or switching
 * games) so the board always starts clean.
 */
const resetPlannerState = () => {
  usePlaceBuildingStore.getState().cancel();
  useBulldozeStore.getState().enable(false);
  useBuildingInfoStore.getState().setHovered(null);
  usePlacedBuildingsStore.getState().select(null);
};

const PlannerPage = ({ gameId, onBack }: PlannerPageProps) => {
  usePlannerShortcuts();
  useRotateShortcut();
  useEffect(() => resetPlannerState, [gameId]);

  return (
    <PlannerLayout
      gameId={gameId}
      gameTitle={getGame(gameId).title}
      onBack={() => {
        resetPlannerState();
        onBack();
      }}
      sidebar={getCatalog(gameId).length ? <BuildingSidebar gameId={gameId} /> : undefined}
      toolbar={<BoardToolbar />}
      board={<Board />}
    />
  );
};

export { PlannerPage };
