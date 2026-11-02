import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@shared/ui";

interface PlannerLayoutProps {
  gameId: string;
  gameTitle: string;
  onBack: () => void;
  sidebar?: ReactNode;
  toolbar?: ReactNode;
  board?: ReactNode;
}

/**
 * Planner screen shell: header with back button, grid/selectable sidebar and
 * the board column (toolbar row over the board). The slots (sidebar, toolbar,
 * board) are composed by the page — widgets stay cross-import-free.
 */
const PlannerLayout = ({ gameId, gameTitle, onBack, sidebar, toolbar, board }: PlannerLayoutProps) => {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex h-12 shrink-0 items-center gap-3 border-b bg-background px-3">
        <Button variant="ghost" size="icon" aria-label="Back to game chooser" onClick={onBack}>
          <ArrowLeft className="size-5" />
        </Button>
        <span className="font-semibold">Block Builder</span>
        <span className="text-muted-foreground">
          — {gameTitle} <span className="text-xs">({gameId})</span>
        </span>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="min-h-0 overflow-y-auto">{sidebar}</aside>

        <section className="flex min-w-0 flex-1 flex-col">
          {toolbar ? (
            <div className="flex h-12 shrink-0 items-center border-b bg-background px-3">
              {toolbar}
            </div>
          ) : null}
          <div className="relative min-h-0 flex-1">{board}</div>
        </section>
      </div>
    </div>
  );
};

export { PlannerLayout };
