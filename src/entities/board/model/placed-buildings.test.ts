import { beforeEach, describe, expect, it } from "vitest";
import {
  conflictsWith,
  instanceAt,
  usePlacedBuildingsStore,
  type BuildingInstance,
} from "..";

const resetStore = () => {
  usePlacedBuildingsStore.setState({
    items: [] as BuildingInstance[],
    selectedId: null,
  });
};

describe("placed buildings store", () => {
  beforeEach(resetStore);

  it("places instances with unique, stable ids", () => {
    const idA = usePlacedBuildingsStore.getState().place("zeus_park", 2, 2, 0, [
      { x: 2, y: 2 },
    ]);
    const idB = usePlacedBuildingsStore.getState().place("zeus_road", 3, 2, 0, [
      { x: 3, y: 2 },
    ]);
    expect(idA).not.toBe(idB);
    expect(usePlacedBuildingsStore.getState().items).toHaveLength(2);
  });

  it("removal keeps the rest and clears the selection when removed", () => {
    const placed = usePlacedBuildingsStore.getState();
    const idA = placed.place("zeus_park", 0, 0, 0, [{ x: 0, y: 0 }]);
    const idB = placed.place("zeus_road", 1, 0, 0, [{ x: 1, y: 0 }]);
    placed.select(idA);
    placed.remove(idB);
    let state = usePlacedBuildingsStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.selectedId).toBe(idA);

    placed.remove(idA);
    state = usePlacedBuildingsStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.selectedId).toBeNull();
  });

  it("updates position/rotation/tiles in place", () => {
    const placed = usePlacedBuildingsStore.getState();
    const id = placed.place("zeus_granary", 1, 1, 0, [
      { x: 1, y: 1 },
    ]);
    placed.update(id, {
      x: 4, y: 5, rot: 90,
      tiles: [{ x: 4, y: 5 }, { x: 4, y: 6 }],
    });
    const item = usePlacedBuildingsStore.getState().items[0];
    expect(item.x).toBe(4);
    expect(item.y).toBe(5);
    expect(item.rot).toBe(90);
    expect(item.tiles).toEqual([{ x: 4, y: 5 }, { x: 4, y: 6 }]);
    expect(item.defId).toBe("zeus_granary");
  });

  it("select only accepts known items", () => {
    const placed = usePlacedBuildingsStore.getState();
    const id = placed.place("zeus_park", 0, 0, 0, [{ x: 0, y: 0 }]);
    placed.select("ghost-id");
    expect(usePlacedBuildingsStore.getState().selectedId).toBeNull();
    placed.select(id);
    expect(usePlacedBuildingsStore.getState().selectedId).toBe(id);
    placed.select(null);
    expect(usePlacedBuildingsStore.getState().selectedId).toBeNull();
  });
});

describe("instance helpers", () => {
  beforeEach(resetStore);

  it("finds the instance covering a tile", () => {
    const placed = usePlacedBuildingsStore.getState();
    placed.place("zeus_granary", 2, 2, 0, [
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
    ]);
    expect(instanceAt(usePlacedBuildingsStore.getState().items, 3, 3)).toBeDefined();
    expect(instanceAt(usePlacedBuildingsStore.getState().items, 0, 0)).toBeUndefined();
  });

  it("reports conflicts with placed buildings, optionally ignoring one", () => {
    const id = usePlacedBuildingsStore.getState().place("zeus_granary", 0, 0, 0, [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ]);
    const items = usePlacedBuildingsStore.getState().items;
    expect(conflictsWith(items, [{ x: 1, y: 1 }])).toHaveLength(1);
    expect(conflictsWith(items, [{ x: 1, y: 1 }], id)).toHaveLength(0);
    expect(conflictsWith(items, [{ x: 5, y: 5 }])).toHaveLength(0);
  });

  it("conflict for empty board is nothing", () => {
    expect(conflictsWith([], [{ x: 1, y: 1 }])).toHaveLength(0);
  });
});
