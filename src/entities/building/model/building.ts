/**
 * Domain types for building definitions (catalog entries).
 * Pure data — no React, no Konva. Shared by all game catalogs
 * (Zeus now; Caesar III, Pharaoh, Emperor later means new data files
 * with the same shape, not changed types).
 */

/** Terrain the building must be placed on / adjacent to (validated in Phase 4). */
export type Placement = "meadow" | "agora" | "road" | "water_edge";

/** Footprint in game grid cells (tiles). */
export interface BuildingSize {
  w: number;
  h: number;
}

/**
 * Extra footprint part attached to the main one (e.g. Pier, Horse Ranch).
 * Sized separately; its placement is validated in Phase 4 together with
 * the main footprint.
 */
export interface BuildingAttachment {
  size: BuildingSize;
  placement?: Placement[];
}

export interface BuildingDef {
  id: string;
  name: string;
  category: string;
  size: BuildingSize;
  rotatable: boolean;
  draggable: boolean;
  color: string;
  /** true for buildings added by the Poseidon expansion. */
  isExtension: boolean;
  placement?: Placement[];
  /**
   * Length is player-defined (the "n" in the source table);
   * `size` holds the 1-cell minimum along that axis.
   */
  variableLength?: boolean;
  /** Extra footprint parts attached to the main one (e.g. Pier, Horse Ranch). */
  attachments?: BuildingAttachment[];
}
