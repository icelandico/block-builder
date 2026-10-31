import { ArrowLeft } from "lucide-react";
import { Button } from "@shared/ui";

interface PlannerLayoutProps {
  gameId: string;
  gameTitle: string;
  onBack: () => void;
}

/**
 * Planner screen shell for Phase 1: fixed left sidebar (building categories —
 * populated in Phase 3) and the board zone (Konva grid — Phase 2).
 */
const PlannerLayout = ({ gameId, gameTitle, onBack }: PlannerLayoutProps) => {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex h-12 items-center gap-3 border-b bg-background px-3">
        <Button variant="ghost" size="icon" aria-label="Back to game chooser" onClick={onBack}>
          <ArrowLeft className="size-5" />
        </Button>
        <span className="font-semibold">Block Builder</span>
        <span className="text-muted-foreground">
          — {gameTitle} <span className="text-xs">({gameId})</span>
        </span>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 shrink-0 border-r bg-background p-3">
          <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Buildings</h2>
          <p className="text-sm text-muted-foreground">
            Building categories will appear here (Phase 3 — Zeus catalog).
          </p>
        </aside>

        <main className="flex flex-1 items-center justify-center bg-muted/30 p-4">
          <div className="text-center text-muted-foreground">
            <p className="font-medium text-foreground">Board area</p>
            <p>The game grid goes here (Phase 2 — Konva canvas).</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export { PlannerLayout };
