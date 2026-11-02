import { useEffect, useRef } from "react";
import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { Layer, Stage } from "react-konva";
import { useBoardStore } from "@entities/board";
import { useCameraStore } from "@shared/camera";
import { tilesToPx } from "@shared/konva-helpers";
import { useContainerSize } from "../model/use-container-size";
import { GridBackground } from "./grid-layer";

const WHEEL_ZOOM_STEP = 1.15;

const Board = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const { width: viewportW, height: viewportH } = useContainerSize(containerRef);

  const gridW = useBoardStore((s) => s.width);
  const gridH = useBoardStore((s) => s.height);

  const cameraX = useCameraStore((s) => s.x);
  const cameraY = useCameraStore((s) => s.y);
  const cameraZoom = useCameraStore((s) => s.zoom);
  const setViewport = useCameraStore((s) => s.setViewport);
  const setPan = useCameraStore((s) => s.setPan);
  const zoomAt = useCameraStore((s) => s.zoomAt);
  const centerBoard = useCameraStore((s) => s.centerBoard);

  // Stage sized to the container; fit-center the board once on first measure.
  const centeredRef = useRef(false);
  useEffect(() => {
    setViewport(viewportW, viewportH);
    if (!centeredRef.current && viewportW > 0 && viewportH > 0) {
      centeredRef.current = true;
      centerBoard(tilesToPx(gridW), tilesToPx(gridH));
    }
  }, [viewportW, viewportH, gridW, gridH, setViewport, centerBoard]);

  const handleWheel = (event: KonvaEventObject<globalThis.WheelEvent>) => {
    event.evt.preventDefault();
    const pointer = stageRef.current?.getPointerPosition();
    const factor = event.evt.deltaY < 0 ? WHEEL_ZOOM_STEP : 1 / WHEEL_ZOOM_STEP;
    zoomAt(factor, pointer?.x, pointer?.y);
  };

  const handleDragEnd = () => {
    const position = stageRef.current?.position();
    if (position) {
      setPan(position.x, position.y);
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <Stage
        ref={stageRef}
        width={viewportW}
        height={viewportH}
        x={cameraX}
        y={cameraY}
        scaleX={cameraZoom}
        scaleY={cameraZoom}
        draggable
        onWheel={handleWheel}
        onDragEnd={handleDragEnd}
      >
        {/* Static: background, grid lines, border — redraws only on grid resize */}
        <Layer listening={false}>
          <GridBackground />
        </Layer>

        {/* Placed buildings (Phase 3) */}
        <Layer />

        {/* Interaction: ghost preview, selection outlines, hover (Phase 4) */}
        <Layer />
      </Stage>
    </div>
  );
};

export { Board };
