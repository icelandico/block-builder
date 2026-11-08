import { useEffect } from "react";
import type Konva from "konva";
import type React from "react";
import type { KonvaEventObject } from "konva/lib/Node";
import { pxToTile } from "@shared/konva-helpers";
import type { Tile } from "@entities/board";
import { useCameraStore } from "@shared/camera";
import { usePlaceBuildingStore } from "../model/place-building-store";

/**
 * Pointer wiring for the Konva Stage: converts screen pixels into board tiles
 * (accounting for camera pan/zoom) and drives the placement store.
 *
 * Panning is disabled by the board while a def is pending (see Stage
 * `draggable`), so a pointer-down always starts/updates a placement gesture —
 * plain click = zero-length drag (single placement), drag = run/paint.
 */
export const usePlacementEvents = (
  stageRef: React.RefObject<Konva.Stage | null>,
) => {
  // Read the stage node lazily: the ref is not set on first render.
  const tileAtPointer = (): Tile | null => {
    const pointer = stageRef.current?.getPointerPosition();
    if (!pointer) return null;
    const { x, y, zoom } = useCameraStore.getState();
    return {
      x: pxToTile((pointer.x - x) / zoom),
      y: pxToTile((pointer.y - y) / zoom),
    };
  };

  const onMouseDown = (event: KonvaEventObject<MouseEvent>) => {
    if (event.evt.button !== 0) return; // middle/right reserved (pan/cancel)
    const tile = tileAtPointer();
    if (tile) usePlaceBuildingStore.getState().dragStart(tile);
  };

  const onMouseMove = () => {
    const tile = tileAtPointer();
    if (tile) usePlaceBuildingStore.getState().dragMove(tile);
  };

  const onMouseUp = () => {
    usePlaceBuildingStore.getState().dragEnd();
  };

  const onMouseLeave = () => {
    // Pointer left the board: drop the hover ghost, keep any active drag.
    const store = usePlaceBuildingStore.getState();
    if (store.drag) store.dragEnd();
    else store.hoverAt(null);
  };

  const onContextMenu = (event: KonvaEventObject<PointerEvent>) => {
    event.evt.preventDefault();
    usePlaceBuildingStore.getState().cancel();
  };

  // R rotates the pending ghost; Escape cancels placing.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        return;
      }
      const isPending = usePlaceBuildingStore.getState().pending !== null;
      if (!isPending) return;
      if (event.key === "r" || event.key === "R") {
        usePlaceBuildingStore.getState().rotatePending();
      } else if (event.key === "Escape") {
        usePlaceBuildingStore.getState().cancel();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return { onMouseDown, onMouseMove, onMouseUp, onMouseLeave, onContextMenu, tileAtPointer };
};
