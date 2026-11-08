import { useState } from "react";
import {
  CATEGORIES,
  getCatalog,
  groupByCategory,
  searchBuildings,
  type BuildingDef,
} from "@entities/building";
import type { GameId } from "@entities/game";
import { useBulldozeStore } from "@features/bulldoze";
import { usePlaceBuildingStore } from "@features/place-building";
import { Button } from "@shared/ui";
import { Input } from "@shared/ui";

interface BuildingSidebarProps {
  gameId: GameId;
}

/**
 * Build menu: search field, then the game catalog grouped by category in
 * display order. Clicking a building arms the placement flow (ghost preview
 * on the board); the currently pending def is highlighted.
 */
const BuildingSidebar = ({ gameId }: BuildingSidebarProps) => {
  const [query, setQuery] = useState("");
  const bulldoze = useBulldozeStore((s) => s.enabled);
  const disableBulldoze = useBulldozeStore((s) => s.enable);
  const pendingDefId = usePlaceBuildingStore((s) => s.pending?.defId ?? null);

  const catalog = getCatalog(gameId);
  const categories = CATEGORIES[gameId];

  if (catalog.length === 0) {
    return (
      <div className="w-64 shrink-0 border-r bg-background p-3">
        <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Buildings</h2>
        <p className="text-sm text-muted-foreground">
          No catalog for this game yet.
        </p>
      </div>
    );
  }

  const filtered = query.trim()
    ? searchBuildings(catalog, query)
    : [...catalog];
  const groups = groupByCategory(filtered, categories);

  const armPlacement = (def: BuildingDef) => {
    if (bulldoze) disableBulldoze(false);
    usePlaceBuildingStore.getState().setPending(def.id);
  };

  return (
    <div className="w-64 shrink-0 border-r bg-background p-3">
      <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Buildings</h2>
      <Input
        aria-label="Search buildings"
        placeholder="Search…"
        className="h-8 mb-3"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {groups.map((group) => (
        <section key={group.category} className="mb-3">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {group.category}
          </h3>
          <ul className="flex flex-col items-stretch gap-0.5">
            {group.buildings.map((building) => (
              <li key={building.id}>
                <SidebarButton
                  building={building}
                  active={building.id === pendingDefId}
                  onClick={() => armPlacement(building)}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No buildings match the search.</p>
      ) : null}
    </div>
  );
};

const SidebarButton = ({
  building,
  active,
  onClick,
}: {
  building: BuildingDef;
  active: boolean;
  onClick: () => void;
}) => (
  <Button
    variant="ghost"
    size="sm"
    className={`justify-between px-2 font-normal ${active ? "bg-accent" : ""}`}
    aria-pressed={active}
    onClick={onClick}
  >
    <span className="truncate">{building.name}</span>
    <span className="ml-2 shrink-0 font-mono text-[10px] text-muted-foreground">
      {building.size.w}×{building.size.h}
    </span>
  </Button>
);

export { BuildingSidebar };
