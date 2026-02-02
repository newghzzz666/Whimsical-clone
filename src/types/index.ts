export enum NoteColor {
  YELLOW = '#fef08a',
  BLUE = '#bfdbfe',
  PINK = '#fbcfe8',
  GREEN = '#bbf7d0',
  PURPLE = '#e9d5ff',
}

export interface Note {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  color: NoteColor;
  zIndex: number;
  archived?: boolean;
}

export interface Connection {
  id: string;
  fromId: string;
  toId: string;
  color?: string;
}

export interface Settings {
  r2AccountId: string;
  r2AccessKeyId: string;
  r2SecretAccessKey: string;
  r2BucketName: string;
  r2Endpoint: string;
  autosaveInterval?: number;
}

export interface Board {
  id: string;
  notes: Note[];
  connections: Connection[];
  createdAt: number;
  updatedAt: number;
  title: string;
}
