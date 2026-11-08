import { describe, expect, it } from "vitest";
import {
  CATALOGS,
  getBuilding,
  getCatalog,
  groupByCategory,
  searchBuildings,
  ZEUS_CATALOG,
  ZEUS_CATEGORIES,
} from "..";

describe("ZEUS_CATALOG data integrity", () => {
  it("uses unique ids with the zeus_ prefix", () => {
    const ids = ZEUS_CATALOG.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id.startsWith("zeus_")).toBe(true);
  });

  it("pin known counts (guards against accidental data drift)", () => {
    expect(ZEUS_CATALOG).toHaveLength(133);
    // 45 Poseidon-expansion entries beside 88 base-game ones
    expect(ZEUS_CATALOG.filter((b) => b.isExtension)).toHaveLength(45);
    expect(ZEUS_CATEGORIES).toHaveLength(14);
  });

  it("has positive, in-bounds footprints", () => {
    for (const b of ZEUS_CATALOG) {
      expect(b.size.w).toBeGreaterThanOrEqual(1);
      expect(b.size.w).toBeLessThanOrEqual(30);
      expect(b.size.h).toBeGreaterThanOrEqual(1);
      expect(b.size.h).toBeLessThanOrEqual(30);
      expect(b.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it("pins expected biggest footprints (Zeus's Stronghold w, Citadel of Poseidon h)", () => {
    expect(Math.max(...ZEUS_CATALOG.map((b) => b.size.w))).toBe(24);
    expect(Math.max(...ZEUS_CATALOG.map((b) => b.size.h))).toBe(20);
  });

  it("maps every building into ZEUS_CATEGORIES and used categories count to the catalog", () => {
    const groups = groupByCategory(ZEUS_CATALOG, ZEUS_CATEGORIES);
    const total = groups.reduce((sum, g) => sum + g.buildings.length, 0);
    expect(total).toBe(ZEUS_CATALOG.length);
    expect(groups).toHaveLength(ZEUS_CATEGORIES.length); // no uncategorized leftovers
    expect(groups.find((g) => g.category === "General")?.buildings).toHaveLength(2);
  });

  it("pins variableLength and attachments entries", () => {
    expect(
      ZEUS_CATALOG.filter((b) => b.variableLength).map((b) => b.id).sort(),
    ).toEqual(["zeus_avenue", "zeus_boulevard", "zeus_bridge", "zeus_wall"]);
    expect(
      ZEUS_CATALOG.filter((b) => b.attachments).map((b) => b.id).sort(),
    ).toEqual(["zeus_horse_ranch", "zeus_pier"]);
  });
});

describe("catalog helpers", () => {
  it("getBuilding finds by id and returns undefined otherwise", () => {
    const road = getBuilding(ZEUS_CATALOG, "zeus_road");
    expect(road?.name).toBe("Road");
    expect(getBuilding(ZEUS_CATALOG, "zeus_nonexistent")).toBeUndefined();
  });

  it("searchBuildings matches names and ids case-insensitively", () => {
    const hits = searchBuildings(ZEUS_CATALOG, "AGORA");
    const ids = hits.map((b) => b.id);
    expect(ids).toContain("zeus_common_agora");
    expect(ids).toContain("zeus_grand_agora");
    expect(searchBuildings(ZEUS_CATALOG, "zeus_hut")).toHaveLength(1);
    // empty/whitespace query returns the whole catalog
    expect(searchBuildings(ZEUS_CATALOG, "  ")).toHaveLength(ZEUS_CATALOG.length);
  });

  it("getCatalog serves each game id from CATALOGS", () => {
    expect(getCatalog("zeus")).toBe(ZEUS_CATALOG);
    expect(getCatalog("caesar3")).toHaveLength(0);
    expect(getCatalog("pharaoh")).toHaveLength(0);
    expect(getCatalog("emperor")).toHaveLength(0);
    expect(Object.keys(CATALOGS)).toHaveLength(4);
  });
});
