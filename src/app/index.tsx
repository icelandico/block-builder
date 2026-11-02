import { ChooserPage } from "@pages/chooser";
import { PlannerPage } from "@pages/planner";
import { TooltipProvider } from "@shared/ui";
import { useViewStore } from "./model/view-store";

const App = () => {
  const view = useViewStore((s) => s.view);
  const selectedGameId = useViewStore((s) => s.selectedGameId);
  const chooseGame = useViewStore((s) => s.chooseGame);
  const backToChooser = useViewStore((s) => s.backToChooser);

  return (
    <TooltipProvider delayDuration={200}>
      {view === "planner" && selectedGameId ? (
        <PlannerPage gameId={selectedGameId} onBack={backToChooser} />
      ) : (
        <ChooserPage onChooseGame={chooseGame} />
      )}
    </TooltipProvider>
  );
};

export { App };
