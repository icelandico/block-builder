import { Rect } from "react-konva";
import { useBoardStore, usePlacedBuildingsStore, type Tile } from "@entities/board";
import { getDef } from "@entities/building";
import { useCameraStore } from "@shared/camera";
import { TILE } from "@shared/konva-helpers";
import { usePlaceBuildingStore } from "../model/place-building-store";
import { computePlan, occupiedKeys } from "../model/placement";

const VALID_FILL = "#4ade80";
const INVALID_FILL = "#f87171";

/** World-px rect over one tile. */
const TileRect = ({ tile, fill, opacity }: { tile: Tile; fill: string; opacity: number }) => (
  <Rect
    x={tile.x * TILE}
    y={tile.y * TILE}
    width={TILE}
    height={TILE}
    fill={fill}
    opacity={opacity}
  />
);

/**
 * Ghost preview of the pending placement (green = legal, red = blocked).
 * Rendered on the interaction layer; it is a pure view of the placement
 * store, the board grid and the placed buildings.
 */
const GhostPreview = () => {
  const pending = usePlaceBuildingStore((s) => s.pending);
  const drag = usePlaceBuildingStore((s) => s.drag);
  const hover = usePlaceBuildingStore((s) => s.hover);
  const items = usePlacedBuildingsStore((s) => s.items);

  if (!pending) return null;
  const def = getDef(pending.defId);
  if (!def) return null;

  // While dragging the gesture drives the plan; otherwise follow the cursor.
  const start = drag?.start ?? hover;
  const current = drag?.current ?? hover;
  if (!start || !current) return null;

  const board = useBoardStore.getState();
  const plan = computePlan({
    def,
    rot: pending.rot,
    drag: { start, current },
    gridW: board.width,
    gridH: board.height,
    occupied: occupiedKeys(items),
  });

  const minX = Math.min(...plan.tiles.map((t) => t.x));
  const minY = Math.min(...plan.tiles.map((t) => t.y));
  const maxX = Math.max(...plan.tiles.map((t) => t.x));
  const maxY = Math.max(...plan.tiles.map((t) => t.y));
  const outlineColor = plan.valid ? VALID_FILL : INVALID_FILL;
  // Keep the outline ~2px on screen regardless of camera zoom.
  const zoom = useCameraStore.getState().zoom;
  const strokeWidth = 2 / zoom;

  return (
    <>
      {plan.tiles.map((tile, index) => (
        <TileRect key={`${tile.x}:${tile.y}:${index}`} tile={tile} fill={outlineColor} opacity={0.45} />
      ))}
      <Rect
        x={minX * TILE}
        y={minY * TILE}
        width={(maxX - minX + 1) * TILE}
        height={(maxY - minY + 1) * TILE}
        stroke={outlineColor}
        strokeWidth={strokeWidth}
        listening={false}
      />
    </>
  );
};

export { GhostPreview };
