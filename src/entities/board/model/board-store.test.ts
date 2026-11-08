import { beforeEach, describe, expect, it } from "vitest";
import { GRID_MAX, GRID_MIN, GRID_START, useBoardStore } from "..";

describe("board store grid clamping", () => {
  beforeEach(() => {
    useBoardStore.setState({
      width: GRID_START.width,
      height: GRID_START.height,
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
