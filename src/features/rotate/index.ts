import { useEffect } from "react";
import { getDef } from "@entities/building";
import {
  conflictsWith,
  isWithinGrid,
  nextRotation,
  tilesFor,
  useBoardStore,
  usePlacedBuildingsStore,
} from "@entities/board";

/**
 * R key rotates the selected placed building: the footprint is recomputed for
 * the new rotation around the same anchor tile. Illegal rotations (leaving
 * the grid or overlapping a neighbour) are rejected silently. Square
 * footprints only update the rotation metadata. When a placement ghost is
 * pending there is no selection (the sidebar clears it), so `R` naturally
 * belongs to the ghost's own shortcut — no cross-feature coupling needed.
 */
export const useRotateShortcut = () => {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "r" && event.key !== "R") return;
      const target = event.target as HTMLElement | null;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        return;
      }

      const placed = usePlacedBuildingsStore.getState();
      const selected = placed.items.find((item) => item.id === placed.selectedId);
      if (!selected) return;

      const def = getDef(selected.defId);
      if (!def || def.variableLength) return; // drawn runs rotate by redrawing

      const rot = nextRotation(selected.rot);
      const tiles = tilesFor(selected.x, selected.y, def.size, rot);
      const sameTiles =
        tiles.length === selected.tiles.length &&
        tiles.every((t, i) => t.x === selected.tiles[i].x && t.y === selected.tiles[i].y);
      if (sameTiles) {
        placed.update(selected.id, { rot });
        return;
      }
      const grid = useBoardStore.getState();
      if (!isWithinGrid(tiles, grid.width, grid.height)) return;
      if (conflictsWith(placed.items, tiles, selected.id).length > 0) return;

      placed.update(selected.id, { rot, tiles });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
};
