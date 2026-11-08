/**
 * Pure helpers for the Info flow: how the info-hover "ghost" look and label
 * text color are derived from a def's color. Rendering (Konva text/tooltip)
 * lives in the board widget — this file stays headless.
 */

/** Mix a 6-digit hex color toward grey — the info-hover "ghost" look. */
export const ghostedFill = (hex: string, amount = 0.6): string => {
  const [r, g, b] = parseHex(hex);
  const mix = (channel: number): number =>
    Math.round(channel + (0x8f - channel) * amount);
  return toHex(mix(r), mix(g), mix(b));
};

/** Dark text on light fills, white text on dark ones. */
export const readableTextColor = (hex: string): "dark" | "light" => {
  const [r, g, b] = parseHex(hex);
  const channel = (value: number): number => {
    const srgb = value / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  };
  const luminance =
    0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  /** Break-even between dark-text and white-text contrast (~#222 luminance). */
  return luminance > 0.23 ? "dark" : "light";
};

export const LABEL_TEXT_COLOR = {
  dark: "#1e293b",
  light: "#f8fafc",
} as const;

const parseHex = (hex: string): [number, number, number] => {
  const digits = hex.replace("#", "").slice(0, 6);
  const value = Number.parseInt(digits, 16);
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
};

const toHex = (r: number, g: number, b: number): string =>
  `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
