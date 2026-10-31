import { getGame, type GameId } from "@entities/game";
import { PlannerLayout } from "@widgets/planner-layout";

interface PlannerPageProps {
  gameId: GameId;
  onBack: () => void;
}

const PlannerPage = ({ gameId, onBack }: PlannerPageProps) => (
  <PlannerLayout gameId={gameId} gameTitle={getGame(gameId).title} onBack={onBack} />
);

export { PlannerPage };
