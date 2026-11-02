import type { GameId } from "@entities/game";
import type { BuildingDef } from "./building";
import { ZEUS_CATALOG } from "./zeus";

/**
 * Per-game catalogs. Each game = its own data file (model/zeus.ts now,
 * caesar3.ts / pharaoh.ts / emperor.ts later), registered here — adding a
 * game means adding data, not changing the core.
 */
export const CATALOGS: Record<GameId, readonly BuildingDef[]> = {
  zeus: ZEUS_CATALOG,
  caesar3: [],
  pharaoh: [],
  emperor: [],
};

/** Category group in a fixed order (sidebar lists categories top-down). */
export interface CategoryGroup {
  category: string;
  buildings: BuildingDef[];
}

export const getCatalog = (gameId: GameId): readonly BuildingDef[] => CATALOGS[gameId];

/** Find a building by its id, or `undefined` for unknown ids. */
export const getBuilding = (
  catalog: readonly BuildingDef[],
  id: string,
): BuildingDef | undefined => catalog.find((building) => building.id === id);

/**
 * Group a catalog by category, preserving the caller's category order.
 * Categories with no buildings are skipped; catalog entries outside the
 * known categories are appended as one "uncategorized" group at the end.
 */
export const groupByCategory = (
  catalog: readonly BuildingDef[],
  categories: readonly string[],
): CategoryGroup[] => {
  const groups: CategoryGroup[] = categories.map((category) => ({
    category,
    buildings: [],
  }));
  const byCategory = new Map(groups.map((group) => [group.category, group]));

  const uncategorized: BuildingDef[] = [];
  for (const building of catalog) {
    const group = byCategory.get(building.category);
    if (group) group.buildings.push(building);
    else uncategorized.push(building);
  }

  const result = groups.filter((group) => group.buildings.length > 0);
  if (uncategorized.length > 0) {
    result.push({ category: "uncategorized", buildings: uncategorized });
  }
  return result;
};

/** Case-insensitive substring search over names and ids (sidebar filter, Phase 4). */
export const searchBuildings = (
  catalog: readonly BuildingDef[],
  query: string,
): BuildingDef[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [...catalog];
  return catalog.filter(
    (building) =>
      building.name.toLowerCase().includes(q) || building.id.toLowerCase().includes(q),
  );
};
