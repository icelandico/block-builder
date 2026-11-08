import { describe, expect, it } from "vitest";
import { ZEUS_CATALOG, getDef, type BuildingDef } from "@entities/building";
import type { Tile } from "@entities/board";
// Same-slice internal import: keeps the test free of `react-konva` (via the
// feature's index) in the node test environment.
import { computePlan, occupiedKeys } from "./placement";

const grid = { gridW: 40, gridH: 40 };

const findDefById = (id: string): BuildingDef => {
  const def = getDef(id);
  if (!def) throw new Error(`test needs def ${id} in the catalog`);
  return def;
};

const drag = (start: Tile, current: Tile) => ({ start, current });

describe("computePlan — ordinary footprints", () => {
  const granary = findDefById("zeus_granary"); // 4×4, non-rotatable

  it("places one instance anchored at the drag start tile", () => {
    const plan = computePlan({
      def: granary,
      rot: 0,
      drag: drag({ x: 2, y: 3 }, { x: 9, y: 9 }),
      gridW: 40,
      gridH: 40,
      occupied: new Set(),
    });
    expect(plan.commit).toBe("single");
    expect(plan.tiles).toHaveLength(16);
    expect(plan.tiles[0]).toEqual({ x: 2, y: 3 });
    expect(plan.valid).toBe(true);
  });

  it("is invalid outside the grid", () => {
    const plan = computePlan({
      def: granary,
      rot: 0,
      drag: drag({ x: 37, y: 37 }, { x: 37, y: 37 }),
      gridW: 40,
      gridH: 40,
      occupied: new Set(),
    });
    expect(plan.valid).toBe(false);
  });

  it("is invalid when overlapping a placed building", () => {
    const park = findDefById("zeus_park");
    const plan = computePlan({
      def: granary,
      rot: 0,
      drag: drag({ x: 0, y: 0 }, { x: 0, y: 0 }),
      gridW: 40,
      gridH: 40,
      occupied: occupiedKeys([
        { id: "b1", defId: park.id, x: 2, y: 2, rot: 0, tiles: [{ x: 2, y: 2 }] },
      ]),
    });
    expect(plan.valid).toBe(false);
  });
});

describe("computePlan — variableLength defs (roads, walls...)", () => {
  const boulevard = findDefById("zeus_boulevard"); // 3×1, variableLength

  it("draws one elongated instance along the horizontal axis", () => {
    const plan = computePlan({
      def: boulevard,
      rot: 0,
      drag: drag({ x: 1, y: 5 }, { x: 6, y: 5 }),
      ...grid,
      occupied: new Set(),
    });
    expect(plan.commit).toBe("single");
    expect(plan.rot).toBe(90);
    expect(plan.tiles).toHaveLength(6 * 3); // 6 long × 3 thick
    expect(plan.tiles.every((t) => t.y >= 5 && t.y <= 7)).toBe(true);
    expect(plan.valid).toBe(true);
  });

  it("follows the vertical axis, including upward drags", () => {
    const plan = computePlan({
      def: boulevard,
      rot: 0,
      drag: drag({ x: 7, y: 10 }, { x: 7, y: 2 }),
      ...grid,
      occupied: new Set(),
    });
    expect(plan.rot).toBe(0);
    expect(plan.tiles.every((t) => t.x >= 7 && t.x <= 9)).toBe(true);
    expect(plan.tiles.every((t) => t.y >= 2 && t.y <= 10)).toBe(true);
  });

  it("degrades to the click-only footprint when the pointer never moved", () => {
    const plan = computePlan({
      def: boulevard,
      rot: 0,
      drag: drag({ x: 3, y: 3 }, { x: 3, y: 3 }),
      ...grid,
      occupied: new Set(),
    });
    expect(plan.tiles).toHaveLength(3); // the 3×1 base footprint
    expect(plan.valid).toBe(true);
  });

  it("is invalid when the run leaves the grid", () => {
    const plan = computePlan({
      def: boulevard,
      rot: 0,
      drag: drag({ x: 39, y: 0 }, { x: 45, y: 0 }),
      gridW: 40,
      gridH: 40,
      occupied: new Set(),
    });
    expect(plan.valid).toBe(false);
  });
});

describe("computePlan — plain 1×1 roads", () => {
  const road = findDefById("zeus_road");

  it("paints one instance per drag tile (not an elongated single def)", () => {
    const plan = computePlan({
      def: road,
      rot: 0,
      drag: drag({ x: 0, y: 0 }, { x: 3, y: 0 }),
      ...grid,
      occupied: new Set(),
    });
    expect(plan.commit).toBe("paint");
    expect(plan.tiles).toHaveLength(4);
    expect(plan.valid).toBe(true);
  });

  it("clicking a road places a single tile", () => {
    const plan = computePlan({
      def: road,
      rot: 0,
      drag: drag({ x: 5, y: 5 }, { x: 5, y: 5 }),
      ...grid,
      occupied: new Set(),
    });
    expect(plan.tiles).toEqual([{ x: 5, y: 5 }]);
    expect(plan.valid).toBe(true);
  });

  it("stops at the first occupied tile", () => {
    // A parked granary in the middle of the run invalidates the whole unlock.
    const granary = findDefById("zeus_granary");
    const plan = computePlan({
      def: road,
      rot: 0,
      drag: drag({ x: 0, y: 0 }, { x: 10, y: 0 }),
      gridW: 40,
      gridH: 40,
      occupied: occupiedKeys([
        {
          id: "b0",
          defId: granary.id,
          x: 5,
          y: 0,
          rot: 0,
          tiles: [{ x: 5, y: 0 }],
        },
      ]),
    });
    expect(plan.valid).toBe(false);
  });
});

describe("catalog integrity for placement behavior", () => {
  it("uses variableLength only for run-drawing pieces", () => {
    const variable = ZEUS_CATALOG.filter((d) => d.variableLength);
    for (const def of variable) {
      expect(def.draggable).toBe(true);
      expect(Math.min(def.size.w, def.size.h)).toBe(1);
    }
  });
});
