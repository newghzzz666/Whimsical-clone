import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Note from './components/Note';
import Toolbar from './components/Toolbar';
import SettingsModal from './components/SettingsModal';
import AIModal from './components/AIModal';
import Connection from './components/Connection';
import { Note as NoteType, NoteColor, Settings, Connection as ConnectionType } from './types';
import {
  CANVAS_SIZE,
  INITIAL_NOTE_CONTENT,
  DEFAULT_NOTE_WIDTH,
  DEFAULT_NOTE_HEIGHT,
  MIN_SCALE,
  MAX_SCALE,
  SCALE_STEP,
} from './constants';
import { saveToLocalStorage, loadFromLocalStorage } from './services/storageService';
import { generateAIContent } from './services/aiService';

const App: React.FC = () => {
  // --- State ---
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [connections, setConnections] = useState<ConnectionType[]>([]);
  const [scale, setScale] = useState(1);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [linkingSourceId, setLinkingSourceId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Loading States
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiGeneratedContent, setAiGeneratedContent] = useState<string | null>(null);

  // Configuration
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('mindcanvas_settings');
    return saved
      ? JSON.parse(saved)
      : {
          r2AccountId: '',
          r2AccessKeyId: '',
          r2SecretAccessKey: '',
          r2BucketName: '',
          r2Endpoint: '',
          autosaveInterval: 30000,
        };
  });

  const boardRef = useRef<HTMLDivElement>(null);
  const autosaveTimerRef = useRef<NodeJS.Timeout>();

  // --- Effects ---

  // Initialize with saved data or welcome note
  useEffect(() => {
    const { notes: savedNotes, connections: savedConnections } = loadFromLocalStorage();

    if (savedNotes.length > 0) {
      setNotes(savedNotes);
    } else {
      setNotes([
        {
          id: uuidv4(),
          x: CANVAS_SIZE / 2 - DEFAULT_NOTE_WIDTH / 2,
          y: CANVAS_SIZE / 2 - DEFAULT_NOTE_HEIGHT / 2,
          content: INITIAL_NOTE_CONTENT,
          color: NoteColor.YELLOW,
          zIndex: 1,
          width: DEFAULT_NOTE_WIDTH,
          height: DEFAULT_NOTE_HEIGHT,
        },
      ]);
    }

    if (savedConnections.length > 0) {
      setConnections(savedConnections);
    }
  }, []);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('mindcanvas_settings', JSON.stringify(settings));
  }, [settings]);

  // Autosave notes and connections
  useEffect(() => {
    autosaveTimerRef.current = setTimeout(() => {
      if (notes.length > 0) {
        saveToLocalStorage(notes, connections);
      }
    }, settings.autosaveInterval || 30000);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [notes, connections, settings.autosaveInterval]);

  // --- Handlers ---

  const handleAddNote = useCallback((color: NoteColor) => {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const viewportCenterX = scrollX + window.innerWidth / 2;
    const viewportCenterY = scrollY + window.innerHeight / 2;

    const newNote: NoteType = {
      id: uuidv4(),
      x: viewportCenterX - DEFAULT_NOTE_WIDTH / 2,
      y: viewportCenterY - DEFAULT_NOTE_HEIGHT / 2,
      content: '',
      color,
      zIndex: Math.max(...notes.map((n) => n.zIndex), 0) + 1,
      width: DEFAULT_NOTE_WIDTH,
      height: DEFAULT_NOTE_HEIGHT,
    };

    setNotes((prev) => [...prev, newNote]);
    setSelectedNoteId(newNote.id);
  }, [notes]);

  const handleUpdateNote = useCallback((id: string, updates: Partial<NoteType>) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)));
  }, []);

  const handleDeleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setConnections((prev) => prev.filter((c) => c.fromId !== id && c.toId !== id));
    if (selectedNoteId === id) setSelectedNoteId(null);
  }, [selectedNoteId]);

  const handleSelectNote = useCallback(
    (id: string) => {
      setSelectedNoteId(id);
      const maxZ = Math.max(...notes.map((n) => n.zIndex), 0);
      setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, zIndex: maxZ + 1 } : n)));
    },
    [notes]
  );

  const handleToggleConnectMode = useCallback(() => {
    setIsConnecting((prev) => !prev);
    setConnectingFromId(null);
  }, []);

  // Handle arrow connection mode clicks
  const handleNoteClickForConnection = useCallback(
    (id: string) => {
      if (connectingFromId === null) {
        // First click: select source note
        setConnectingFromId(id);
      } else if (connectingFromId === id) {
        // Click same note again: deselect
        setConnectingFromId(null);
      } else {
        // Second click: create connection
        setConnections((prev) => {
          const exists = prev.some((c) => c.fromId === connectingFromId && c.toId === id);
          if (!exists) {
            return [
              ...prev,
              {
                id: uuidv4(),
                fromId: connectingFromId,
                toId: id,
              },
            ];
          }
          return prev;
        });
        setConnectingFromId(null);
      }
    },
    [connectingFromId]
  );

  // Linking Logic
  const handleLinkStart = useCallback((id: string) => {
    setLinkingSourceId(id);
  }, []);

  const handleLinkEnd = useCallback((targetId: string) => {
    if (linkingSourceId && linkingSourceId !== targetId) {
      setConnections((prev) => {
        const exists = prev.some((c) => c.fromId === linkingSourceId && c.toId === targetId);
        if (!exists) {
          return [
            ...prev,
            {
              id: uuidv4(),
              fromId: linkingSourceId,
              toId: targetId,
            },
          ];
        }
        return prev;
      });
    }
    setLinkingSourceId(null);
  }, [linkingSourceId]);

  const handleDeleteConnection = useCallback((id: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handleCanvasClick = useCallback(() => {
    setSelectedNoteId(null);
    setLinkingSourceId(null);
  }, []);

  // Update Note component onClick handling
  const handleNoteSelect = useCallback(
    (id: string) => {
      if (isConnecting) {
        handleNoteClickForConnection(id);
      } else {
        handleSelectNote(id);
      }
    },
    [isConnecting, handleNoteClickForConnection, handleSelectNote]
  );

  const handleSync = useCallback(async () => {
    if (!settings.r2BucketName || !settings.r2AccessKeyId) {
      alert('请先配置 R2 存储设置');
      setIsSettingsOpen(true);
      return;
    }

    setIsSyncing(true);
    try {
      await fetch('/api/r2/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes,
          connections,
          settings,
        }),
      });
      alert('看板已成功同步到 R2!');
    } catch (error: any) {
      console.error('Sync error:', error);
      alert(`同步失败: ${error.message}`);
    } finally {
      setIsSyncing(false);
    }
  }, [notes, connections, settings]);

  const handleExportPDF = useCallback(async () => {
    if (!boardRef.current || notes.length === 0) return;

    const minX = Math.min(...notes.map((n) => n.x));
    const minY = Math.min(...notes.map((n) => n.y));
    const maxX = Math.max(...notes.map((n) => n.x + n.width));
    const maxY = Math.max(...notes.map((n) => n.y + n.height));

    const padding = 50;
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;

    const originalScale = scale;

    try {
      if (boardRef.current) {
        boardRef.current.style.transform = 'scale(1)';
      }

      const canvas = await html2canvas(boardRef.current, {
        x: minX - padding,
        y: minY - padding,
        width,
        height,
        scale: 2,
        useCORS: true,
        backgroundColor: '#f8f9fa',
        logging: false,
        windowWidth: CANVAS_SIZE,
        windowHeight: CANVAS_SIZE,
      });

      if (boardRef.current) {
        boardRef.current.style.transform = `scale(${originalScale})`;
      }

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: width > height ? 'l' : 'p',
        unit: 'px',
        format: [width, height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save('mindcanvas-export.pdf');
    } catch (error) {
      console.error('PDF export error:', error);
      alert('导出 PDF 失败');
      if (boardRef.current) {
        boardRef.current.style.transform = `scale(${originalScale})`;
      }
    }
  }, [notes, scale]);

  // AI Handlers
  const handleOpenAI = useCallback((noteId: string) => {
    setSelectedNoteId(noteId);
    setAiGeneratedContent(null);
    setIsAIModalOpen(true);
  }, []);

  const handleAISubmit = useCallback(
    async (prompt: string) => {
      setIsAILoading(true);
      const note = notes.find((n) => n.id === selectedNoteId);

      try {
        const context = notes
          .filter((n) => n.id !== selectedNoteId)
          .map((n) => n.content)
          .join('\n---\n');

        const fullPrompt = `
Current Note Content: "${note?.content || ''}"
User Request: ${prompt}
        `.trim();

        const result = await generateAIContent(fullPrompt, context);
        setAiGeneratedContent(result);
      } catch (error: any) {
        alert(`AI 生成失败: ${error.message}`);
      } finally {
        setIsAILoading(false);
      }
    },
    [notes, selectedNoteId]
  );

  const handleApplyAIContent = useCallback(
    (content: string) => {
      if (selectedNoteId) {
        handleUpdateNote(selectedNoteId, { content });
      }
    },
    [selectedNoteId, handleUpdateNote]
  );

  // Memoize connection elements for performance
  const connectionElements = useMemo(
    () =>
      connections.map((conn) => {
        const fromNote = notes.find((n) => n.id === conn.fromId);
        const toNote = notes.find((n) => n.id === conn.toId);
        if (!fromNote || !toNote) return null;
        return (
          <g key={conn.id} style={{ pointerEvents: 'auto' }}>
            <Connection
              fromNote={fromNote}
              toNote={toNote}
              onDelete={() => handleDeleteConnection(conn.id)}
            />
          </g>
        );
      }),
    [connections, notes, handleDeleteConnection]
  );

  return (
    <div className="w-full h-full bg-[#f8f9fa] relative overflow-hidden">
      {/* Infinite Canvas */}
      <div
        ref={boardRef}
        className={`relative ${linkingSourceId ? 'cursor-crosshair' : ''}`}
        style={{
          width: CANVAS_SIZE,
          height: CANVAS_SIZE,
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
        onClick={handleCanvasClick}
      >
        {/* Connection Layer (SVG) */}
        <svg
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="absolute top-0 left-0 pointer-events-none z-0"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="12"
              markerHeight="12"
              refX="10"
              refY="6"
              orient="auto"
            >
              <path d="M2,2 L10,6 L2,10 L4,6 Z" fill="#94a3b8" />
            </marker>
            <marker
              id="circle-start"
              markerWidth="8"
              markerHeight="8"
              refX="4"
              refY="4"
              orient="auto"
            >
              <circle cx="4" cy="4" r="3" fill="#94a3b8" />
            </marker>
          </defs>
          {connectionElements}
        </svg>

        {/* Notes Layer */}
        {notes.map((note) => (
          <Note
            key={note.id}
            note={note}
            scale={scale}
            isSelected={selectedNoteId === note.id}
            isLinking={linkingSourceId !== null}
            onUpdate={handleUpdateNote}
            onDelete={handleDeleteNote}
            onSelect={handleNoteSelect}
            isConnecting={isConnecting}
            isConnectingFrom={connectingFromId === note.id}
            onAIRequest={handleOpenAI}
            onLinkStart={handleLinkStart}
            onLinkEnd={handleLinkEnd}
          />
        ))}
      </div>

      {/* Toolbar */}
      <Toolbar
        onAddNote={handleAddNote}
        onZoomIn={() => setScale((s) => Math.min(s + SCALE_STEP, MAX_SCALE))}
        onZoomOut={() => setScale((s) => Math.max(s - SCALE_STEP, MIN_SCALE))}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onExportPDF={handleExportPDF}
        onSync={handleSync}
        isSyncing={isSyncing}
          onToggleConnectMode={handleToggleConnectMode}
          isConnecting={isConnecting}
        scale={scale}
      />

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={setSettings}
        initialSettings={settings}
      />

      <AIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onSubmit={handleAISubmit}
        isLoading={isAILoading}
        generatedContent={aiGeneratedContent}
        onApplyContent={handleApplyAIContent}
      />

      {/* Linking Mode Toast */}
      {linkingSourceId && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-brand-600 text-white px-4 py-2 rounded-full shadow-lg z-50 text-sm font-medium animate-bounce">
          选择另一个笔记进行连接
        </div>
      )}
    </div>
  );
};

export default App;
