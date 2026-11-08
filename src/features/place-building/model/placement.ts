import {
  isWithinGrid,
  runAxis,
  runTiles,
  tileKeys,
  tilesFor,
  type BuildingInstance,
  type Rotation,
  type Tile,
} from "@entities/board";
import type { BuildingDef } from "@entities/building";

/**
 * Pure planning logic for placing a pending def: what tiles a click/drag
 * gesture covers and whether the placement is legal (in-bounds, no overlap
 * with already placed buildings). Shared by the ghost preview and the commit
 * on pointer-up.
 */

export type DragRun = { start: Tile; current: Tile };

export interface PlacementPlan {
  defId: string;
  rot: Rotation;
  tiles: Tile[];
  /**
   * "single" — one instance of the def (ordinary footprint, or an elongated
   * variableLength specimen); "paint" — one 1×1 instance per tile
   * (plain roads: each tile remains a separate, linkable road).
   */
  commit: "single" | "paint";
  valid: boolean;
}

/** Tile keys occupied by placed buildings (for overlap checks). */
export const occupiedKeys = (items: readonly BuildingInstance[]): Set<string> => {
  const keys = new Set<string>();
  for (const item of items) {
    for (const key of tileKeys(item.tiles)) keys.add(key);
  }
  return keys;
};

const anchorTile = (tiles: Tile[]): Tile => ({
  x: Math.min(...tiles.map((t) => t.x)),
  y: Math.min(...tiles.map((t) => t.y)),
});

/**
 * Compute the placement plan for a gesture:
 * - variableLength defs → one elongated instance along the drag axis
 *   (rotation follows the axis); click-only places the minimum footprint.
 * - 1×1 defs (plain roads) → a run of detached instances, one per tile.
 * - everything else → one instance anchored at the drag start tile.
 *
 * A warm-up placement is invalid when any of its tiles leaves the grid or
 * covers an already-placed building.
 */
export const computePlan = (args: {
  def: BuildingDef;
  rot: Rotation;
  drag: DragRun;
  gridW: number;
  gridH: number;
  occupied: ReadonlySet<string>;
}): PlacementPlan => {
  const { def, rot, drag, gridW, gridH, occupied } = args;
  const start = drag.start;
  const moved =
    drag.current.x !== start.x || drag.current.y !== start.y;

  if (def.variableLength && moved) {
    // Player-defined length along the dominant drag axis; the cross-axis
    // thickness stays the def's fixed dimension (its "1-cell minimum" axis
    // grows). Rotation records the drawing orientation: the authored def
    // (thickness × 1) is portrait, so horizontal drawing = rot 90.
    const thickness = Math.max(def.size.w, def.size.h);
    const tiles = runTiles(start, drag.current, thickness);
    const runRotation: Rotation = runAxis(start, drag.current) === "horizontal" ? 90 : 0;
    return {
      defId: def.id,
      rot: runRotation,
      tiles,
      commit: "single",
      valid: isLegal(tiles, gridW, gridH, occupied),
    };
  }

  if (def.size.w === 1 && def.size.h === 1 && moved) {
    // Plain road piece: paint a detached instance on every drag tile, so runs
    // drawn along the axis remain individually selectable/linkable pieces.
    const tiles = runTiles(start, drag.current, 1);
    return {
      defId: def.id,
      rot: 0,
      tiles,
      commit: "paint",
      valid: isLegal(tiles, gridW, gridH, occupied),
    };
  }

  const tiles = tilesFor(start.x, start.y, def.size, rot);
  return {
    defId: def.id,
    rot,
    tiles,
    commit: "single",
    valid: isLegal(tiles, gridW, gridH, occupied),
  };
};

const isLegal = (
  tiles: Tile[],
  gridW: number,
  gridH: number,
  occupied: ReadonlySet<string>,
): boolean =>
  isWithinGrid(tiles, gridW, gridH) &&
  tileKeys(tiles).every((key) => !occupied.has(key));

export { anchorTile };
