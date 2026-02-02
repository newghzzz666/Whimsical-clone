import { Note, Connection, Settings, Board } from '../types';

const R2_API_BASE = '/api/r2';

/**
 * Save board to R2 storage
 */
export const saveBoardToR2 = async (
  notes: Note[],
  connections: Connection[],
  settings: Settings,
  boardTitle: string = 'Untitled Board'
): Promise<void> => {
  try {
    if (!settings.r2BucketName || !settings.r2AccessKeyId) {
      throw new Error('R2 credentials are not configured');
    }

    const board: Board = {
      id: Date.now().toString(),
      notes,
      connections,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      title: boardTitle,
    };

    const response = await fetch(`${R2_API_BASE}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        board,
        credentials: {
          accountId: settings.r2AccountId,
          accessKeyId: settings.r2AccessKeyId,
          secretAccessKey: settings.r2SecretAccessKey,
          bucketName: settings.r2BucketName,
          endpoint: settings.r2Endpoint,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save to R2');
    }
  } catch (error) {
    console.error('R2 save error:', error);
    throw error;
  }
};

/**
 * Load board from R2 storage
 */
export const loadBoardFromR2 = async (
  boardId: string,
  settings: Settings
): Promise<Board | null> => {
  try {
    if (!settings.r2BucketName || !settings.r2AccessKeyId) {
      throw new Error('R2 credentials are not configured');
    }

    const response = await fetch(`${R2_API_BASE}/load/${boardId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-R2-Config': JSON.stringify({
          accountId: settings.r2AccountId,
          accessKeyId: settings.r2AccessKeyId,
          secretAccessKey: settings.r2SecretAccessKey,
          bucketName: settings.r2BucketName,
          endpoint: settings.r2Endpoint,
        }),
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to load board from R2');
    }

    return await response.json();
  } catch (error) {
    console.error('R2 load error:', error);
    throw error;
  }
};

/**
 * Save to local storage (fallback)
 */
export const saveToLocalStorage = (
  notes: Note[],
  connections: Connection[]
): void => {
  try {
    localStorage.setItem('mindcanvas_notes', JSON.stringify(notes));
    localStorage.setItem('mindcanvas_connections', JSON.stringify(connections));
  } catch (error) {
    console.error('Local storage save error:', error);
  }
};

/**
 * Load from local storage
 */
export const loadFromLocalStorage = (): { notes: Note[]; connections: Connection[] } => {
  try {
    const notes = localStorage.getItem('mindcanvas_notes');
    const connections = localStorage.getItem('mindcanvas_connections');
    return {
      notes: notes ? JSON.parse(notes) : [],
      connections: connections ? JSON.parse(connections) : [],
    };
  } catch (error) {
    console.error('Local storage load error:', error);
    return { notes: [], connections: [] };
  }
};
