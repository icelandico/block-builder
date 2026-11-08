/** Zeus build-menu categories, in sidebar display order (rendered in Phase 4). */
export const ZEUS_CATEGORIES = [
  "General",
  "Common Housing",
  "Elite Housing",
  "Husbandry",
  "Industry",
  "Distribution",
  "Hygiene/Safety",
  "Administration",
  "Culture",
  "Mythology",
  "Military",
  "Aesthetics",
  "Science",
  "Pyramids",
] as const;

export type ZeusCategory = (typeof ZEUS_CATEGORIES)[number];
