export const PEG_COLORS = {
  neonPink: '#ff00ff',
  electricGreen: '#00f248',
  cyanBlue: '#00fbfe',
};

// Score values per peg color (Peggle-style base values)
export const PEG_SCORES: Record<string, number> = {
  [PEG_COLORS.neonPink]: 100,   // Orange equivalent — objective pegs, high value
  [PEG_COLORS.electricGreen]: 10, // Filler pegs, low value
  [PEG_COLORS.cyanBlue]: 10,     // Bonus pegs, low base but multiplier rewards hitting many
};

// Peg color distribution (must sum to 1.0)
export const PEG_DISTRIBUTION = {
  green: 0.8,  // ~80% green
  pink: 0.1,   // ~10% pink (objective)
  cyan: 0.1,   // ~10% cyan (bonus)
};

// Game config
export const INITIAL_BALLS = 4;
export const BALL_SPEED = 12;
export const BALL_RADIUS = 12;
export const CANNON_WIDTH = 60;
export const CANNON_HEIGHT = 18;

// Peg sizes (fixed, editable)
export const CIRCLE_PEG_RADIUS = 10;
export const RECT_PEG_WIDTH = 36;
export const RECT_PEG_HEIGHT = 16;

// Grid layout
export const PEG_ROWS = 8;
export const PEG_COLS = 8;
export const PEG_SPACING_Y = 55;
export const PEG_START_Y = 120;
export const RECT_COL_MULTIPLIER = 2;

// Portrait canvas dimensions (max)
export const CANVAS_WIDTH = 420;
export const CANVAS_HEIGHT = 700;

// Font for canvas text rendering (OffBit pixelated font)
export const HEADING_FONT = '"OffBit", "Courier New", monospace';

// Combo multiplier thresholds (Peggle-style)
export function getComboMultiplier(comboCount: number): number {
  if (comboCount < 3) return 1;
  if (comboCount < 6) return 2;
  if (comboCount < 10) return 3;
  if (comboCount < 15) return 5;
  if (comboCount < 20) return 10;
  return 25;
}
