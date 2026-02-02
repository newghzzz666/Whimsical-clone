import React, { useRef, useEffect, useState } from 'react';
import { Note as NoteType } from '../types';

interface NoteProps {
  note: NoteType;
  scale: number;
  isSelected: boolean;
  isLinking: boolean;
  onUpdate: (id: string, updates: Partial<NoteType>) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  onAIRequest: (id: string) => void;
  onLinkStart: (id: string) => void;
  onLinkEnd: (targetId: string) => void;
}

const Note: React.FC<NoteProps> = ({
  note,
  scale: _scale,
  isSelected,
  isLinking,
  onUpdate,
  onDelete,
  onSelect,
  onAIRequest,
  onLinkStart,
  onLinkEnd,
}) => {
  const noteRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isSelected && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isSelected]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.note-actions')) return;
    if ((e.target as HTMLElement).closest('textarea')) return;

    onSelect(note.id);
    setIsDragging(true);
    setDragStart({
      x: e.clientX - note.x,
      y: e.clientY - note.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    onUpdate(note.id, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(note.id);
    setIsResizing(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
    });
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      onUpdate(note.id, {
        width: Math.max(150, note.width + deltaX),
        height: Math.max(100, note.height + deltaY),
      });
      setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleEnd = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
    };
  }, [isResizing, dragStart, note, onUpdate]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(note.id, { content: e.target.value });
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLinking) {
      onLinkEnd(note.id);
    } else {
      onLinkStart(note.id);
    }
  };

  return (
    <div
      ref={noteRef}
      className={`absolute transition-all ${isDragging ? 'note-dragging' : ''} ${
        isSelected ? 'note-selected' : ''
      }`}
      style={{
        left: `${note.x}px`,
        top: `${note.y}px`,
        width: `${note.width}px`,
        height: `${note.height}px`,
        backgroundColor: note.color,
        zIndex: note.zIndex,
        borderRadius: '8px',
        boxShadow: isSelected ? '0 0 0 2px #3b82f6, 0 10px 15px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.07)',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Toolbar */}
      <div className="absolute top-2 right-2 flex gap-1 note-actions opacity-0 hover:opacity-100 transition-opacity">
        <button
          onClick={handleLinkClick}
          className="w-6 h-6 flex items-center justify-center bg-white rounded hover:bg-gray-200 text-xs"
          title="Link to another note"
        >
          🔗
        </button>
        <button
          onClick={() => onAIRequest(note.id)}
          className="w-6 h-6 flex items-center justify-center bg-white rounded hover:bg-gray-200 text-xs"
          title="Generate content with AI"
        >
          ✨
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="w-6 h-6 flex items-center justify-center bg-white rounded hover:bg-red-200 text-xs"
          title="Delete note"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <textarea
        ref={textareaRef}
        value={note.content}
        onChange={handleContentChange}
        className="absolute inset-0 p-3 bg-transparent border-0 resize-none focus:outline-none text-sm"
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
        }}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Resize handle */}
      <div
        onMouseDown={handleResizeStart}
        className="absolute bottom-0 right-0 w-4 h-4 bg-gray-300 rounded-tl cursor-se-resize opacity-0 hover:opacity-100 transition-opacity"
        title="Resize note"
      />
    </div>
  );
};

export default Note;
