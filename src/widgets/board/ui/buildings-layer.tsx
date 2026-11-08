import { useState } from "react";
import { Rect, Text } from "react-konva";
import {
  usePlacedBuildingsStore,
  type BuildingInstance,
} from "@entities/board";
import { getDef } from "@entities/building";
import {
  ghostedFill,
  LABEL_TEXT_COLOR,
  readableTextColor,
  useBuildingInfoStore,
} from "@features/building-info";
import { useBuildingSelect } from "@features/select-building";
import { useCameraStore } from "@shared/camera";
import { TILE } from "@shared/konva-helpers";

const SELECTED_STROKE = "#1e293b";
const BULLDOZE_STROKE = "#ef4444";
/** Label size on screen (px); divided by zoom so it never scales with it. */
const LABEL_FONT_SIZE = 12;
/** ~em width per character of the default Konva font, for fitting checks. */
const LABEL_CHAR_RATIO = 0.62;

/**
 * Placed buildings, one rect per instance (anchor tile + precomputed
 * footprint tiles). Interactive only in selection/bulldoze modes; the layer's
 * `listening` is controlled by the board. Info behaviors (name labels,
 * hover-to-inspect) render around the same rects.
 */
const BuildingsLayer = ({ bulldoze }: { bulldoze: boolean }) => {
  const items = usePlacedBuildingsStore((s) => s.items);
  const selectedId = usePlacedBuildingsStore((s) => s.selectedId);
  const remove = usePlacedBuildingsStore((s) => s.remove);
  const { onSelectBuilding } = useBuildingSelect();
  const [hoverId, setHoverId] = useState<string | null>(null);

  const infoLabels = useBuildingInfoStore((s) => s.enabled);
  const infoHoveredId = useBuildingInfoStore((s) => s.hoveredId);
  const setInfoHovered = useBuildingInfoStore((s) => s.setHovered);
  const zoom = useCameraStore((s) => s.zoom);

  const handleClick = (item: BuildingInstance) => () => {
    if (bulldoze) remove(item.id);
    else onSelectBuilding(item.id);
  };

  return items.map((item) => {
    const def = getDef(item.defId);
    const infoHovered = !bulldoze && infoHoveredId === item.id;
    const showLabel = !!def && infoLabels;

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

    const width = (maxX - minX + 1) * TILE;
    const height = (maxY - minY + 1) * TILE;

    // 12px on screen, but never wider than the structure (world-space math).
    const fontSize = def
      ? Math.min(LABEL_FONT_SIZE / zoom, width / (def.name.length * LABEL_CHAR_RATIO))
      : 0;

    return [
      <Rect
        key={item.id}
        x={minX * TILE}
        y={minY * TILE}
        width={width}
        height={height}
        fill={
          def && infoHovered ? ghostedFill(def.color) : (def?.color ?? "#8b8b8b")
        }
        opacity={infoHovered ? 0.55 : undefined}
        dash={strokeColor ? [2, 2] : undefined}
        stroke={strokeColor}
        strokeWidth={strokeColor ? 3 / TILE : undefined}
        onMouseOver={() => {
          if (bulldoze) {
            setHoverId(item.id);
          } else if (!infoLabels && def) {
            setInfoHovered(item.id);
          }
        }}
        onMouseOut={() => {
          setHoverId(null);
          if (useBuildingInfoStore.getState().hoveredId === item.id) {
            setInfoHovered(null);
          }
        }}
        onClick={handleClick(item)}
      />,
      showLabel && fontSize > 0 ? (
        <Text
          key={`${item.id}-label`}
          listening={false}
          x={minX * TILE}
          y={minY * TILE}
          width={width}
          height={height}
          align="center"
          verticalAlign="middle"
          text={def!.name}
          fontSize={fontSize}
          fill={
            LABEL_TEXT_COLOR[readableTextColor(def!.color)]
          }
        />
      ) : null,
    ];
  });
};

export { BuildingsLayer };
