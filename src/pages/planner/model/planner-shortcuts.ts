import { useEffect } from "react";
import { usePlacedBuildingsStore } from "@entities/board";

/**
 * Planner keyboard shortcuts:
 * - Delete / Backspace — remove the selected building.
 * - Escape — clear the selection (canceling a pending placement is handled by
 *   the placement feature's own shortcut; both fire harmlessly together).
 */
export const usePlannerShortcuts = () => {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        return;
      }

      const placed = usePlacedBuildingsStore.getState();
      if (event.key === "Delete" || event.key === "Backspace") {
        if (!placed.selectedId) return;
        event.preventDefault();
        placed.remove(placed.selectedId);
      } else if (event.key === "Escape") {
        placed.select(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
};
