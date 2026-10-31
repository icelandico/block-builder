export interface GameInfo {
  id: GameId;
  title: string;
  description: string;
  /** Whether the planner for this game is implemented. */
  available: boolean;
}

export type GameId = "zeus" | "caesar3" | "pharaoh" | "emperor";

export const GAMES: GameInfo[] = [
  {
    id: "zeus",
    title: "Zeus",
    description: "Plan housing blocks and city layouts for Zeus: Master of Olympus.",
    available: true,
  },
  {
    id: "caesar3",
    title: "Caesar III",
    description: "Plan your Roman provinces. Coming later.",
    available: false,
  },
  {
    id: "pharaoh",
    title: "Pharaoh",
    description: "Plan cities along the Nile. Coming later.",
    available: false,
  },
  {
    id: "emperor",
    title: "Emperor",
    description: "Plan your Chinese dynasties. Coming later.",
    available: false,
  },
];

export const getGame = (id: GameId): GameInfo => GAMES.find((g) => g.id === id)!;
