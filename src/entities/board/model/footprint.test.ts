import { describe, expect, it } from "vitest";
import {
  isWithinGrid,
  nextRotation,
  rectTiles,
  rotatedSize,
  runAxis,
  runTiles,
  tileKeys,
  tilesFor,
  tilesOverlap,
  type Rotation,
} from "..";

describe("rotatedSize", () => {
  it("keeps 0/180 unchanged and swaps at 90/270", () => {
    const size = { w: 2, h: 4 };
    expect(rotatedSize(size, 0)).toEqual({ w: 2, h: 4 });
    expect(rotatedSize(size, 180)).toEqual({ w: 2, h: 4 });
    expect(rotatedSize(size, 90)).toEqual({ w: 4, h: 2 });
    expect(rotatedSize(size, 270)).toEqual({ w: 4, h: 2 });
  });

  it("does not mutate the input size", () => {
    const size = { w: 2, h: 4 };
    rotatedSize(size, 90);
    expect(size).toEqual({ w: 2, h: 4 });
  });
});

describe("rectTiles / tilesFor", () => {
  it("expands an anchor into the full footprint", () => {
    expect(rectTiles(1, 1, { w: 2, h: 2 })).toEqual([
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ]);
  });

  it("applies rotation through tilesFor", () => {
    expect(tilesFor(0, 0, { w: 3, h: 1 }, 0)).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ]);
    expect(tilesFor(0, 0, { w: 3, h: 1 }, 90)).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
    ]);
  });
});

describe("runTiles / runAxis", () => {
  it("draws horizontal runs with thickness rows", () => {
    expect(runTiles({ x: 0, y: 2 }, { x: 2, y: 2 }, 1)).toEqual([
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ]);
    expect(runTiles({ x: 0, y: 2 }, { x: 1, y: 2 }, 2)).toEqual([
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 0, y: 3 },
      { x: 1, y: 3 },
    ]);
  });

  it("draws vertical runs with thickness columns", () => {
    expect(runTiles({ x: 5, y: 1 }, { x: 5, y: 3 }, 2)).toEqual([
      { x: 5, y: 1 },
      { x: 6, y: 1 },
      { x: 5, y: 2 },
      { x: 6, y: 2 },
      { x: 5, y: 3 },
      { x: 6, y: 3 },
    ]);
  });

  it("rejects backward arms by picking the dominant axis (beginning of stroke)", () => {
    // tie on ties → horizontal
    expect(runAxis({ x: 0, y: 0 }, { x: 3, y: 0 })).toBe("horizontal");
    expect(runAxis({ x: 0, y: 0 }, { x: 0, y: 4 })).toBe("vertical");
  });
});

describe("grid helpers", () => {
  it("checks grid bounds", () => {
    expect(isWithinGrid([{ x: 0, y: 0 }], 10, 10)).toBe(true);
    expect(isWithinGrid([{ x: 9, y: 9 }], 10, 10)).toBe(true);
    expect(isWithinGrid([{ x: 10, y: 9 }], 10, 10)).toBe(false);
    expect(isWithinGrid([{ x: -1, y: 0 }], 10, 10)).toBe(false);
  });

  it("cycle rotation metadata 0→90→180→270→0", () => {
    const rotateBy = (from: Rotation) => nextRotation(from);
    expect(rotateBy(0)).toBe(90);
    expect(rotateBy(90)).toBe(180);
    expect(rotateBy(180)).toBe(270);
    expect(rotateBy(270)).toBe(0);
  });

  it("overlaps share tiles and tile keys dedupe sets", () => {
    const a = [{ x: 1, y: 1 }, { x: 2, y: 1 }];
    const b = [{ x: 2, y: 1 }, { x: 3, y: 1 }];
    expect(tilesOverlap(a, b)).toBe(true);
    expect(tilesOverlap(a, [{ x: 0, y: 0 }])).toBe(false);
    expect(tileKeys(a)).toEqual(["1:1", "2:1"]);
  });

  it("rotates multi-tile footprints", () => {
    expect(tilesFor(0, 0, { w: 2, h: 3 }, 0)).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ]);
  });
});
