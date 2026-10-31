import { GAMES, GameCard, type GameId } from "@entities/game";

interface ChooserPageProps {
  onChooseGame: (gameId: GameId) => void;
}

const ChooserPage = ({ onChooseGame }: ChooserPageProps) => (
  <div className="min-h-svh bg-muted/40 px-4 py-12">
    <div className="mx-auto max-w-4xl">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Block Builder</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          City block planner for Impressions Games city-builders.
        </p>
        <p className="mt-1 text-muted-foreground">Choose the game you want to plan for:</p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {GAMES.map((game) => (
          <GameCard key={game.id} game={game} onSelect={() => onChooseGame(game.id)} />
        ))}
      </div>
    </div>
  </div>
);

export { ChooserPage };
