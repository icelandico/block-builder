import { usePlacedBuildingsStore } from "@entities/board";

/**
 * Selection interaction for placed buildings (click to select/clear).
 * Selection state itself lives in @entities/board; this slice holds the
 * pointer wiring so widgets and features stay decoupled from the store
 * details.
 */
export const useBuildingSelect = () => {
  const select = usePlacedBuildingsStore((s) => s.select);

  /** Select a building, or clear it (`null`) when its def id mismatches. */
  return {
    onSelectBuilding: (id: string) => select(id),
    onClearSelection: () => select(null),
  };
};
