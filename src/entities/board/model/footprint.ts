/**
 * Footprint geometry for placed buildings: rotations, tile sets, and grid
 * bounds. Pure functions — no store, no React, no Konva. Consumers (features,
 * widgets) resolve defs and pass sizes in, keeping this slice decoupled from
 * @entities/building.
 */

/** Rotation of a footprint, in degrees clockwise. */
export type Rotation = 0 | 90 | 180 | 270;

/** One tile on the board grid (0-based index from the top-left corner). */
export interface Tile {
  x: number;
  y: number;
}

/** Base (unrotated) footprint size in tiles. */
export interface FootprintSize {
  w: number;
  h: number;
}

/**
 * Size of a footprint after a clockwise rotation — 90/270 swap the axes.
 */
export const rotatedSize = (
  size: FootprintSize,
  rot: Rotation,
): FootprintSize =>
  rot === 90 || rot === 270 ? { w: size.h, h: size.w } : { ...size };

/** All tiles covered by a rect footprint anchored at (x, y) (top-left). */
export const rectTiles = (
  x: number,
  y: number,
  size: FootprintSize,
): Tile[] => {
  const tiles: Tile[] = [];
  for (let dy = 0; dy < size.h; dy++) {
    for (let dx = 0; dx < size.w; dx++) {
      tiles.push({ x: x + dx, y: y + dy });
    }
  }
  return tiles;
};

/** Tiles covered by a building of the given (unrotated) size and rotation. */
export const tilesFor = (
  x: number,
  y: number,
  size: FootprintSize,
  rot: Rotation,
): Tile[] => rectTiles(x, y, rotatedSize(size, rot));

/**
 * A straight run of tiles from `a` to `b` along the dominant drag axis
 * (horizontal when |dx| >= |dy|), `thickness` tiles wide. This is the ghost
 * geometry for drag-drawing roads/walls: single-row/column runs only, anchor
 * on tile `a` for the cross axis.
 */
export const runTiles = (a: Tile, b: Tile, thickness: number): Tile[] => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return rectTiles(Math.min(a.x, b.x), a.y, {
      w: Math.abs(dx) + 1,
      h: thickness,
    });
  }
  return rectTiles(a.x, Math.min(a.y, b.y), {
    w: thickness,
    h: Math.abs(dy) + 1,
  });
};

/** Axis (and direction) of a drag run — used to derive rotation for variableLength defs. */
export const runAxis = (a: Tile, b: Tile): "horizontal" | "vertical" =>
  Math.abs(b.x - a.x) >= Math.abs(b.y - a.y) ? "horizontal" : "vertical";

/** Every tile is inside the [0..width) × [0..height) grid. */
export const isWithinGrid = (
  tiles: Tile[],
  width: number,
  height: number,
): boolean =>
  tiles.every(
    (t) => t.x >= 0 && t.y >= 0 && t.x < width && t.y < height,
  );

/** Deduplicated colon-joined tile keys ("x:y"), used for set math. */
export const tileKeys = (tiles: Tile[]): string[] =>
  tiles.map((t) => `${t.x}:${t.y}`);

/** `true` when two tile sets share at least one tile. */
export const tilesOverlap = (a: Tile[], b: Tile[]): boolean => {
  const keysB = new Set(tileKeys(b));
  return tileKeys(a).some((key) => keysB.has(key));
};

/** Rotation cycling for the R shortcut (0 → 90 → 180 → 270 → 0). */
export const nextRotation = (rot: Rotation): Rotation =>
  (((rot + 90) % 360) as Rotation);
