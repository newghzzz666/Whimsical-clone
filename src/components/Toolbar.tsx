import React, { useCallback } from 'react';
import { NoteColor } from '../types';
import { NOTE_COLORS } from '../constants';

interface ToolbarProps {
  onAddNote: (color: NoteColor) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onOpenSettings: () => void;
  onExportPDF: () => void;
  onSync: () => void;
  isSyncing: boolean;
  scale: number;
  onToggleConnectMode: () => void;
  isConnecting: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onAddNote,
  onZoomIn,
  onZoomOut,
  onOpenSettings,
  onExportPDF,
  onSync,
  isSyncing,
  scale,
  onToggleConnectMode,
  isConnecting,
}) => {
  const handleAddNote = useCallback((index: number) => {
    onAddNote(NOTE_COLORS[index] as NoteColor);
  }, [onAddNote]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg p-3 flex gap-2 z-40 border border-gray-200">
      {/* Note colors */}
      {NOTE_COLORS.map((color, index) => (
        <button
          key={color}
          onClick={() => handleAddNote(index)}
          className="w-8 h-8 rounded-full hover:scale-110 transition-transform"
          style={{ backgroundColor: color }}
          title={`Add note (${['Yellow', 'Blue', 'Pink', 'Green', 'Purple'][index]})`}
        />
      ))}

      <div className="w-px bg-gray-200" />

      {/* Zoom controls */}
      <button
        onClick={onZoomOut}
        className="px-3 py-1 hover:bg-gray-100 rounded transition-colors text-sm font-medium"
        title="Zoom out"
      >
        −
      </button>
      <span className="px-3 py-1 text-sm font-medium text-gray-600 min-w-12 text-center">
        {Math.round(scale * 100)}%
      </span>
      <button
        onClick={onZoomIn}
        className="px-3 py-1 hover:bg-gray-100 rounded transition-colors text-sm font-medium"
        title="Zoom in"
      >
        +
      </button>

      <div className="w-px bg-gray-200" />

      {/* PDF Export */}

      <button
        onClick={onExportPDF}
        className="px-3 py-1 hover:bg-gray-100 rounded transition-colors text-sm font-medium"
        title="Export as PDF"
      >
        📄 PDF
      </button>

      {/* Connection Mode */}
      <button
        onClick={onToggleConnectMode}
        className={`px-3 py-1 rounded transition-colors text-sm font-medium ${
          isConnecting ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
        }`}
        title="Click to enter connection mode, then click two notes to connect them"
      >
        ➜
      </button>

      {/* Sync */}
      <button
        onClick={onSync}
        disabled={isSyncing}
        className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 rounded transition-colors text-sm font-medium"
        title="Sync to R2"
      >
        {isSyncing ? '⏳' : '☁️'} Sync
      </button>

      {/* Settings */}
      <button
        onClick={onOpenSettings}
        className="px-3 py-1 hover:bg-gray-100 rounded transition-colors text-sm font-medium"
        title="Settings"
      >
        ⚙️
      </button>
    </div>
  );
};

export default Toolbar;
