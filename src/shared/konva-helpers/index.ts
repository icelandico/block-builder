/**
 * Constants and coordinate helpers shared by the Konva board widgets.
 *
 * The board is a tile grid: 1 tile = `TILE` px at zoom 1, board origin (tile
 * 0,0) at world coordinate (0,0). Camera pan/zoom is handled by @shared/camera.
 */

/** Size of one tile in world pixels (zoom 1). */
export const TILE = 32;

/** Pixel size of a grid `tiles` wide. */
export const tilesToPx = (tiles: number): number => tiles * TILE;

/** Tile coordinate (index) from a world-space x (tile 0 starts at 0). */
export const pxToTile = (px: number): number => Math.floor(px / TILE);

/** Snap a world-space coordinate to the nearest tile boundary. */
export const snapToTile = (px: number): number => Math.round(px / TILE) * TILE;
