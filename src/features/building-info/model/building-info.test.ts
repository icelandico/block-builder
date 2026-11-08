import { beforeEach, describe, expect, it } from "vitest";
import {
  ghostedFill,
  LABEL_TEXT_COLOR,
  readableTextColor,
  useBuildingInfoStore,
} from "..";

describe("ghosted fill", () => {
  it("mixes the def color toward grey", () => {
    expect(ghostedFill("#000000")).toBe("#565656");
    expect(ghostedFill("#ffffff")).toBe("#bcbcbc");
    expect(ghostedFill("#333333", 0)).toBe("#333333");
  });
});

describe("readable text color", () => {
  it("picks dark text on light fills and light text on dark fills", () => {
    expect(readableTextColor("#c9a37a")).toBe("dark");
    expect(LABEL_TEXT_COLOR.dark).toBe("#1e293b");
    expect(readableTextColor("#b04a4a")).toBe("light");
    expect(LABEL_TEXT_COLOR.light).toBe("#f8fafc");
  });
});

describe("building info store", () => {
  beforeEach(() => {
    useBuildingInfoStore.setState({ enabled: false, hoveredId: null });
  });

  it("starts with hover inspection active and nothing hovered", () => {
    const { enabled, hoveredId } = useBuildingInfoStore.getState();
    expect(enabled).toBe(false);
    expect(hoveredId).toBe(null);
  });

  it("toggles name labels on and off", () => {
    useBuildingInfoStore.getState().toggle();
    expect(useBuildingInfoStore.getState().enabled).toBe(true);
    useBuildingInfoStore.getState().toggle();
    expect(useBuildingInfoStore.getState().enabled).toBe(false);
  });

  it("tracks the hovered structure", () => {
    useBuildingInfoStore.getState().setHovered("b1");
    expect(useBuildingInfoStore.getState().hoveredId).toBe("b1");
    useBuildingInfoStore.getState().setHovered(null);
    expect(useBuildingInfoStore.getState().hoveredId).toBe(null);
  });
});
