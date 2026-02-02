import React from 'react';
import { Note as NoteType } from '../types';

interface ConnectionProps {
  fromNote: NoteType;
  toNote: NoteType;
  onDelete: () => void;
}

const Connection: React.FC<ConnectionProps> = ({ fromNote, toNote, onDelete }) => {
  const x1 = fromNote.x + fromNote.width / 2;
  const y1 = fromNote.y + fromNote.height / 2;
  const x2 = toNote.x + toNote.width / 2;
  const y2 = toNote.y + toNote.height / 2;

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return (
    <>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#cbd5e1"
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
        markerStart="url(#circle-start)"
        className="connection-line"
        style={{ pointerEvents: 'stroke' }}
      />
      <circle
        cx={midX}
        cy={midY}
        r="6"
        fill="#f8f9fa"
        stroke="#cbd5e1"
        strokeWidth="1"
        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      />
    </>
  );
};

export default Connection;
