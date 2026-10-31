import { ChooserPage } from "@pages/chooser";
import { PlannerPage } from "@pages/planner";
import { useViewStore } from "./model/view-store";

const App = () => {
  const view = useViewStore((s) => s.view);
  const selectedGameId = useViewStore((s) => s.selectedGameId);
  const chooseGame = useViewStore((s) => s.chooseGame);
  const backToChooser = useViewStore((s) => s.backToChooser);

  if (view === "planner" && selectedGameId) {
    return <PlannerPage gameId={selectedGameId} onBack={backToChooser} />;
  }

  return <ChooserPage onChooseGame={chooseGame} />;
};

export { App };
