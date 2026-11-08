import { Group, Label, Tag, Text } from "react-konva";
import { usePlacedBuildingsStore } from "@entities/board";
import { getDef } from "@entities/building";
import { useBuildingInfoStore } from "@features/building-info";
import { useCameraStore } from "@shared/camera";
import { TILE } from "@shared/konva-helpers";

const BACKGROUND = "#1e293b";
const TEXT = "#f8fafc";
const FONT_SIZE = 12;
const PADDING = 6;
/** Gap between the tooltip and the structure's top edge (screen px). */
const OFFSET = 4;

/**
 * Canvas-native tooltip for hover inspection (button off): the name of the
 * hovered structure, floating just above its footprint. Scaled so it is
 * always FONT_SIZE px tall on screen.
 */
const InfoTooltip = () => {
  const items = usePlacedBuildingsStore((s) => s.items);
  const hoveredId = useBuildingInfoStore((s) => s.hoveredId);
  const zoom = useCameraStore((s) => s.zoom);

  const item = items.find((candidate) => candidate.id === hoveredId);
  const name = item === undefined ? undefined : getDef(item.defId)?.name;
  if (!item || !name || zoom <= 0) return null;

  const minX = Math.min(...item.tiles.map((t) => t.x));
  const minY = Math.min(...item.tiles.map((t) => t.y));

  return (
    <Group
      listening={false}
      x={minX * TILE}
      y={minY * TILE}
      scaleX={1 / zoom}
      scaleY={1 / zoom}
    >
      <Label y={-(FONT_SIZE + 2 * PADDING + OFFSET)}>
        <Tag fill={BACKGROUND} cornerRadius={4} />
        <Text
          text={name}
          fill={TEXT}
          fontSize={FONT_SIZE}
          padding={PADDING}
        />
      </Label>
    </Group>
  );
};

export { InfoTooltip };
