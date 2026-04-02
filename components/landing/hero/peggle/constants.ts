export const PEG_COLORS = {
  neonPink: '#ff00ff',
  electricGreen: '#00f248',
  cyanBlue: '#00fbfe',
};

// Score values per peg color
export const PEG_SCORES: Record<string, number> = {
  [PEG_COLORS.neonPink]: 500,
  [PEG_COLORS.electricGreen]: 100,
  [PEG_COLORS.cyanBlue]: 250,
};

// Game config
export const INITIAL_BALLS = 10;
export const BALL_SPEED = 15;
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
export const RECT_COL_MULTIPLIER = 2; // Rectangle rows have cols * this many items

// Portrait canvas dimensions (max)
export const CANVAS_WIDTH = 420;
export const CANVAS_HEIGHT = 700;

// Font for canvas text rendering (OffBit pixelated font)
export const HEADING_FONT = '"OffBit", "Courier New", monospace';
