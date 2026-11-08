import { useBoardStore } from "@entities/board";
import { Shape, Rect } from "react-konva";
import { TILE, tilesToPx } from "@shared/konva-helpers";

/**
 * Static board content: parchment background, grid lines (visibility follows
 * the `showGrid` toggle), and the board border. Rendered on a non-listening
 * Konva layer — redraws on grid size / visibility changes.
 */
const GridBackground = () => {
  const width = useBoardStore((s) => s.width);
  const height = useBoardStore((s) => s.height);
  const showGrid = useBoardStore((s) => s.showGrid);
  const boardPxW = tilesToPx(width);
  const boardPxH = tilesToPx(height);

  return (
    <>
      <Rect x={0} y={0} width={boardPxW} height={boardPxH} fill="#f5f1e4" />
      {showGrid ? (
        <Shape
          x={0}
          y={0}
          listening={false}
          sceneFunc={(ctx, shape) => {
            ctx.save();
            ctx.lineWidth = 1 / TILE; // compensate camera scale: keep 1px on screen
            ctx.strokeStyle = "#d8cbab";

            ctx.beginPath();
            for (let i = 0; i <= width; i++) {
              ctx.moveTo(i * TILE, 0);
              ctx.lineTo(i * TILE, boardPxH);
            }
            for (let j = 0; j <= height; j++) {
              ctx.moveTo(0, j * TILE);
              ctx.lineTo(boardPxW, j * TILE);
            }
            ctx.stroke();
            ctx.restore();

            // Required by Konva even when we draw manually.
            ctx.fillStrokeShape(shape);
          }}
        />
      ) : null}
      <Rect
        x={0}
        y={0}
        width={boardPxW}
        height={boardPxH}
        stroke="#8a7f63"
        strokeWidth={2 / TILE}
        listening={false}
      />
    </>
  );
};

export { GridBackground };
