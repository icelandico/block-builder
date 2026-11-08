import { useState } from "react";
import { Rect } from "react-konva";
import {
  usePlacedBuildingsStore,
  type BuildingInstance,
} from "@entities/board";
import { getDef } from "@entities/building";
import { useBuildingSelect } from "@features/select-building";
import { TILE } from "@shared/konva-helpers";

const SELECTED_STROKE = "#1e293b";
const BULLDOZE_STROKE = "#ef4444";

/**
 * Placed buildings, one rect per instance (anchor tile + precomputed
 * footprint tiles). Interactive only in selection/bulldoze modes; the layer's
 * `listening` is controlled by the board.
 */
const BuildingsLayer = ({ bulldoze }: { bulldoze: boolean }) => {
  const items = usePlacedBuildingsStore((s) => s.items);
  const selectedId = usePlacedBuildingsStore((s) => s.selectedId);
  const remove = usePlacedBuildingsStore((s) => s.remove);
  const { onSelectBuilding } = useBuildingSelect();
  const [hoverId, setHoverId] = useState<string | null>(null);

  const handleClick = (item: BuildingInstance) => () => {
    if (bulldoze) remove(item.id);
    else onSelectBuilding(item.id);
  };

  return items.map((item) => {
    const strokeColor =
      bulldoze && hoverId === item.id
        ? BULLDOZE_STROKE
        : !bulldoze && selectedId === item.id
          ? SELECTED_STROKE
          : undefined;

    const minX = Math.min(...item.tiles.map((t) => t.x));
    const minY = Math.min(...item.tiles.map((t) => t.y));
    const maxX = Math.max(...item.tiles.map((t) => t.x));
    const maxY = Math.max(...item.tiles.map((t) => t.y));

    return (
      <Rect
        key={item.id}
        x={minX * TILE}
        y={minY * TILE}
        width={(maxX - minX + 1) * TILE}
        height={(maxY - minY + 1) * TILE}
        fill={getDef(item.defId)?.color ?? "#8b8b8b"}
        dash={strokeColor ? [2, 2] : undefined}
        stroke={strokeColor}
        strokeWidth={strokeColor ? 3 / TILE : undefined}
        onMouseOver={() => bulldoze && setHoverId(item.id)}
        onMouseOut={() => setHoverId(null)}
        onClick={handleClick(item)}
      />
    );
  });
};

export { BuildingsLayer };
