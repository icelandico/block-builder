import { FolderOpen, Hammer, Maximize2, Save, ZoomIn, ZoomOut } from "lucide-react";
import { useBoardStore } from "@entities/board";
import { useCameraStore } from "@shared/camera";
import { tilesToPx } from "@shared/konva-helpers";
import { Button } from "@shared/ui";
import { Separator } from "@shared/ui";
import { Tooltip, TooltipContent, TooltipTrigger } from "@shared/ui";
import type { ComponentProps } from "react";
import { useBulldozeStore } from "@features/bulldoze";
import { usePlaceBuildingStore } from "@features/place-building";
import { GridSizeControls } from "@features/grid-resize";

const StyledToolbarButton = ({
  label,
  children,
  ...props
}: ComponentProps<typeof Button> & { label: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon" aria-label={label} {...props}>
        {children}
      </Button>
    </TooltipTrigger>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
);

const BoardToolbar = () => {
  const gridW = useBoardStore((s) => s.width);
  const gridH = useBoardStore((s) => s.height);
  const zoomOut = useCameraStore((s) => s.zoomAt);
  const centerBoard = useCameraStore((s) => s.centerBoard);
  const bulldozeEnabled = useBulldozeStore((s) => s.enabled);

  // Bulldoze and placement are mutually exclusive: arming one disarms the other.
  const toggleBulldoze = () => {
    if (!bulldozeEnabled) {
      usePlaceBuildingStore.getState().cancel();
      useBulldozeStore.getState().enable(true);
    } else {
      useBulldozeStore.getState().enable(false);
    }
  };

  return (
    <div className="flex w-full items-center gap-2">
      <GridSizeControls />

      <div className="ml-auto flex items-center gap-1">
        <StyledToolbarButton
          label="Zoom out"
          onClick={() => zoomOut(1 / 1.25)}
        >
          <ZoomOut className="size-4" />
        </StyledToolbarButton>
        <StyledToolbarButton
          label="Zoom in"
          onClick={() => zoomOut(1.25)}
        >
          <ZoomIn className="size-4" />
        </StyledToolbarButton>
        <StyledToolbarButton
          label="Fit & center the grid"
          onClick={() => centerBoard(tilesToPx(gridW), tilesToPx(gridH))}
        >
          <Maximize2 className="size-4" />
        </StyledToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={bulldozeEnabled ? "destructive" : "ghost"}
              size="icon"
              aria-label="Bulldoze"
              aria-pressed={bulldozeEnabled}
              onClick={toggleBulldoze}
            >
              <Hammer className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{bulldozeEnabled ? "Bulldoze active" : "Bulldoze tool"}</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-1 h-6" />
        <StyledToolbarButton
          label="Save layout (Phase 5)"
          disabled
        >
          <Save className="size-4" />
        </StyledToolbarButton>
        <StyledToolbarButton
          label="Load layout (Phase 5)"
          disabled
        >
          <FolderOpen className="size-4" />
        </StyledToolbarButton>
      </div>
    </div>
  );
};

export { BoardToolbar };
