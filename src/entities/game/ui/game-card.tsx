import { Badge } from "@shared/ui";
import { Button } from "@shared/ui";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@shared/ui";
import type { GameInfo } from "../model/games";

interface GameCardProps {
  game: GameInfo;
  onSelect?: () => void;
}

export const GameCard = ({ game, onSelect }: GameCardProps) => (
  <Card className="flex w-full flex-col data-[disabled=true]:opacity-60 transition-shadow hover:shadow-md data-[disabled=true]:hover:shadow-none shadow-sm">
    <CardHeader>
      <CardTitle className="flex items-center justify-between text-xl">
        {game.title}
        {game.available ? (
          <Badge variant="default">Available</Badge>
        ) : (
          <Badge variant="secondary">Coming soon</Badge>
        )}
      </CardTitle>
    </CardHeader>
    <CardContent className="flex-1 text-muted-foreground">{game.description}</CardContent>
    <CardFooter>
      <Button
        className="w-full"
        data-disabled={!game.available}
        disabled={!game.available}
        onClick={onSelect}
      >
        {game.available ? "Start planning" : "Not yet"}
      </Button>
    </CardFooter>
  </Card>
);
