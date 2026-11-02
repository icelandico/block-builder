import { PlannerLayout } from "@widgets/planner-layout";
import { Board } from "@widgets/board";
import { BoardToolbar } from "@widgets/board-toolbar";
import { BuildingSidebar } from "@widgets/building-sidebar";
import { getGame, type GameId } from "@entities/game";

interface PlannerPageProps {
  gameId: GameId;
  onBack: () => void;
}

const PlannerPage = ({ gameId, onBack }: PlannerPageProps) => (
  <PlannerLayout
    gameId={gameId}
    gameTitle={getGame(gameId).title}
    onBack={onBack}
    sidebar={<BuildingSidebar />}
    toolbar={<BoardToolbar />}
    board={<Board />}
  />
);

export { PlannerPage };
