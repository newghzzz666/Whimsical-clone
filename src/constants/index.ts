// Canvas configuration
export const CANVAS_SIZE = 5000;
export const DEFAULT_NOTE_WIDTH = 300;
export const DEFAULT_NOTE_HEIGHT = 200;

// UI configuration
export const INITIAL_NOTE_CONTENT = '输入笔记内容...';
export const MIN_SCALE = 0.3;
export const MAX_SCALE = 3;
export const SCALE_STEP = 0.1;

// Storage keys
export const STORAGE_KEYS = {
  NOTES: 'mindcanvas_notes',
  CONNECTIONS: 'mindcanvas_connections',
  SETTINGS: 'mindcanvas_settings',
  BOARD_METADATA: 'mindcanvas_board_metadata',
} as const;

// Animation durations (ms)
export const ANIMATION_DURATIONS = {
  SHORT: 200,
  MEDIUM: 300,
  LONG: 500,
} as const;

// Colors for notes
export const NOTE_COLORS = [
  '#fef08a', // yellow
  '#bfdbfe', // blue
  '#fbcfe8', // pink
  '#bbf7d0', // green
  '#e9d5ff', // purple
] as const;
