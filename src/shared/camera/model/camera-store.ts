import { create } from "zustand";

export const MIN_ZOOM = 0.2;
export const MAX_ZOOM = 4;

interface CameraState {
  /** World-space offset of the viewport top-left corner. */
  x: number;
  y: number;
  /** Uniform scale factor. */
  zoom: number;
  /** Viewport size in screen px (set by the board container). */
  viewportW: number;
  viewportH: number;

  setViewport: (w: number, h: number) => void;
  setPan: (x: number, y: number) => void;
  /**
   * Zoom around a viewport point (screen px): the world point under (px, py)
   * stays under the cursor. Pivot defaults to the viewport center.
   */
  zoomAt: (factor: number, px?: number, py?: number) => void;
  /** Fit the given board pixel size into the viewport and center it. */
  centerBoard: (boardPxW: number, boardPxH: number) => void;
}

const clampZoom = (zoom: number): number =>
  Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));

/**
 * Camera of the Konva board: keeps pan/zoom purely in state so React re-renders
 * never move/lose the board position (Konva only applies these props).
 */
export const useCameraStore = create<CameraState>()((set, get) => ({
  x: 0,
  y: 0,
  zoom: 1,
  viewportW: 0,
  viewportH: 0,

  setViewport: (w, h) => set({ viewportW: w, viewportH: h }),

  setPan: (x, y) => set({ x, y }),

  zoomAt: (factor, px, py) => {
    const { zoom, x, y, viewportW, viewportH } = get();
    const newZoom = clampZoom(zoom * factor);
    const pivotX = px ?? viewportW / 2;
    const pivotY = py ?? viewportH / 2;
    set({
      zoom: newZoom,
      x: pivotX - (pivotX - x) * (newZoom / zoom),
      y: pivotY - (pivotY - y) * (newZoom / zoom),
    });
  },

  centerBoard: (boardPxW, boardPxH) => {
    const { viewportW, viewportH } = get();
    if (viewportW === 0 || viewportH === 0 || boardPxW === 0 || boardPxH === 0) {
      return;
    }
    const fit = Math.min(
      (viewportW * 0.92) / boardPxW,
      (viewportH * 0.92) / boardPxH,
    );
    const zoom = clampZoom(fit);
    set({
      zoom,
      x: (viewportW - boardPxW * zoom) / 2,
      y: (viewportH - boardPxH * zoom) / 2,
    });
  },
}));
