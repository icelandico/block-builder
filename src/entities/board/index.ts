export { useBoardStore, GRID_MIN, GRID_MAX, GRID_START } from "./model/board-store";
export type { BoardState } from "./model/board-store";
export {
  runAxis,
  isWithinGrid,
  nextRotation,
  rectTiles,
  rotatedSize,
  runTiles,
  tileKeys,
  tilesFor,
  tilesOverlap,
} from "./model/footprint";
export type { FootprintSize, Rotation, Tile } from "./model/footprint";
export {
  conflictsWith,
  instanceAt,
  usePlacedBuildingsStore,
} from "./model/placed-buildings";
export type { BuildingInstance } from "./model/placed-buildings";
