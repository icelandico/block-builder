import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  CATEGORIES,
  getCatalog,
  groupByCategory,
  searchBuildings,
  type BuildingDef,
  type CategoryGroup,
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
 * Build menu: search field pinned above the category list. The list area
 * scrolls within the fixed-height planner column; categories are accordion
 * sections with at most one expanded at a time (clicking another header
 * closes the open one). Clicking a building arms the placement flow; the
 * currently pending def is highlighted.
 */
const BuildingSidebar = ({ gameId }: BuildingSidebarProps) => {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const bulldoze = useBulldozeStore((s) => s.enabled);
  const disableBulldoze = useBulldozeStore((s) => s.enable);
  const pendingDefId = usePlaceBuildingStore((s) => s.pending?.defId ?? null);

  const catalog = getCatalog(gameId);
  const categories = CATEGORIES[gameId];

  if (catalog.length === 0) {
    return (
      <div className="flex h-full w-64 shrink-0 flex-col border-r bg-background p-3">
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

  const onToggleGroup = (group: CategoryGroup) => {
    setExpanded((current) => (current === group.category ? null : group.category));
  };

  return (
    <div className="flex h-full w-64 shrink-0 flex-col border-r bg-background p-3">
      <h2 className="mb-2 shrink-0 text-sm font-semibold text-muted-foreground">Buildings</h2>
      <Input
        aria-label="Search buildings"
        placeholder="Search…"
        className="h-8 mb-3 shrink-0"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <div className="min-h-0 flex-1 overflow-y-auto pr-0.5">
        {groups.map((group) => (
          <details
            key={group.category}
            className="mb-1 border-b border-border/60 last:mb-3"
            open={expanded === group.category}
          >
            <summary
              className="group flex cursor-pointer select-none list-none items-center justify-between py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground [&::-webkit-details-marker]:hidden"
              // Prevent the native details toggle: `open` is fully controlled
              // by React state, and the browser's async `toggle` events would
              // otherwise race with it (closing the previously open section
              // nulls the state, so a newly clicked section never opens).
              onClick={(event) => {
                event.preventDefault();
                onToggleGroup(group);
              }}
            >
              {group.category}
              <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" />
            </summary>
            <ul className="flex flex-col items-stretch gap-0.5 pb-2">
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
          </details>
        ))}

        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">No buildings match the search.</p>
        ) : null}
      </div>
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
