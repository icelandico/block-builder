import { Trash2 } from "lucide-react";
import { useState, type ComponentProps } from "react";
import { usePlacedBuildingsStore } from "@entities/board";
import { useBulldozeStore } from "@features/bulldoze";
import { usePlaceBuildingStore } from "@features/place-building";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@shared/ui";

/**
 * Toolbar entry for wiping the board: asks for confirmation, then removes
 * every placed structure (bulldoze tool and placement flow are disarmed so
 * no stale interaction cross-reacts with an empty board).
 */
const ClearAllButton = ({ className, ...props }: ComponentProps<typeof Button>) => {
  const [open, setOpen] = useState(false);
  const hasBuildings = usePlacedBuildingsStore((s) => s.items.length > 0);

  const confirmClearAll = () => {
    setOpen(false);
    usePlaceBuildingStore.getState().cancel();
    useBulldozeStore.getState().enable(false);
    usePlacedBuildingsStore.getState().clearAll();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={className}
            aria-label="Clear all structures"
            disabled={!hasBuildings}
            onClick={() => setOpen(true)}
            {...props}
          >
            <Trash2 className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Clear all structures</TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear all structures from the board?</AlertDialogTitle>
          <AlertDialogDescription>
            This option will remove all structures from the board
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={confirmClearAll}
          >
            Clear all
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { ClearAllButton };
