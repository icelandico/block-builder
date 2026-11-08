import { beforeEach, describe, expect, it } from "vitest";
import { GRID_MAX, GRID_MIN, GRID_START, useBoardStore } from "..";

describe("board store grid clamping", () => {
  beforeEach(() => {
    useBoardStore.setState({
      width: GRID_START.width,
      height: GRID_START.height,
      showGrid: true,
    });
  });

  it("starts with sensible grid dimensions", () => {
    const { width, height } = useBoardStore.getState();
    expect(width).toBe(40);
    expect(height).toBe(40);
  });

  it("accepts in-range sizes", () => {
    useBoardStore.getState().setGridSize(50, 60);
    expect(useBoardStore.getState().width).toBe(50);
    expect(useBoardStore.getState().height).toBe(60);
  });

  it("clamps below the minimum and above the maximum", () => {
    useBoardStore.getState().setGridSize(5, 1500);
    const { width, height } = useBoardStore.getState();
    expect(width).toBe(GRID_MIN);
    expect(height).toBe(GRID_MAX);
    expect(GRID_MIN).toBe(10);
    expect(GRID_MAX).toBe(200);
  });
});

describe("board store grid visibility toggle", () => {
  beforeEach(() => {
    useBoardStore.setState({ showGrid: true });
  });

  it("starts with the grid visible", () => {
    expect(useBoardStore.getState().showGrid).toBe(true);
  });

  it("toggles the grid on and off", () => {
    useBoardStore.getState().toggleShowGrid();
    expect(useBoardStore.getState().showGrid).toBe(false);
    useBoardStore.getState().toggleShowGrid();
    expect(useBoardStore.getState().showGrid).toBe(true);
  });
});
