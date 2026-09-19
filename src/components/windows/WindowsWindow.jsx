import React, { useState, useEffect, useRef } from 'react';
import { Minus, Square, Copy, X, GripHorizontal } from 'lucide-react';
import { sounds } from '../../utils/sound';

export const WindowsWindow = ({
  id,
  title,
  subtitle,
  icon: IconComponent,
  isOpen,
  isMinimized,
  isMaximized,
  onMinimize,
  onMaximize,
  onClose,
  zIndex = 20,
  onFocus,
  soundEffectsEnabled = true,
  children,
}) => {
  const windowRef = useRef(null);
  const dragRef = useRef({
    isDragging: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    initialPosX: 0,
    initialPosY: 0,
  });

  const [isDragging, setIsDragging] = useState(false);

  // Synchronous initialization of window position
  const [position, setPosition] = useState(() => {
    if (typeof window === 'undefined') return { x: 24, y: 24, width: 960, height: 620 };
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = Math.min(1100, Math.max(340, vw - 48));
    const height = Math.min(740, Math.max(380, vh - 96));

    const offsetMap = {
      games: { x: 0, y: 0 },
      home: { x: -24, y: -20 },
      favorites: { x: 24, y: 20 },
      settings: { x: 36, y: 30 },
    };
    const offset = offsetMap[id] || { x: 0, y: 0 };

    const x = Math.max(12, Math.min(Math.round((vw - width) / 2 + offset.x), Math.max(12, vw - width - 16)));
    const y = Math.max(12, Math.min(Math.round((vh - 48 - height) / 2 + offset.y), Math.max(12, vh - 140)));

    return { x, y, width, height };
  });

  // Keep window in bounds if browser window resizes
  useEffect(() => {
    const handleResize = () => {
      if (isMaximized) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const maxX = Math.max(10, vw - 120);
      const maxY = Math.max(10, vh - 100);

      setPosition((prev) => ({
        ...prev,
        x: Math.min(Math.max(10, prev.x), maxX),
        y: Math.min(Math.max(10, prev.y), maxY),
        width: Math.min(prev.width, Math.max(320, vw - 24)),
        height: Math.min(prev.height, Math.max(300, vh - 72)),
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMaximized]);

  // Pointer Down (Mouse, Touch, Stylus) on Titlebar/Tab
  const handlePointerDown = (e) => {
    // Only primary button (left click) or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (e.target.closest('button')) return;

    onFocus?.();

    let startX = position.x;
    let startY = position.y;

    // If window is currently maximized, restore and place under pointer
    if (isMaximized) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const width = Math.min(1100, Math.max(340, vw - 48));
      const height = Math.min(740, Math.max(380, vh - 96));
      startX = Math.max(10, Math.min(e.clientX - width / 2, vw - width - 10));
      startY = Math.max(10, Math.min(e.clientY - 16, vh - 120));

      setPosition((prev) => ({
        ...prev,
        x: startX,
        y: startY,
        width,
        height,
      }));
      onMaximize(); // un-maximize
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {
      // Ignore if pointer capture is not supported
    }

    dragRef.current = {
      isDragging: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      initialPosX: startX,
      initialPosY: startY,
    };

    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.isDragging) return;

    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const winWidth = position.width || 800;

    // Constrain within visible viewport boundaries
    const minX = -(winWidth - 120);
    const maxX = vw - 80;
    const minY = 0;
    const maxY = vh - 60;

    const newX = Math.min(Math.max(minX, dragRef.current.initialPosX + deltaX), maxX);
    const newY = Math.min(Math.max(minY, dragRef.current.initialPosY + deltaY), maxY);

    setPosition((prev) => ({
      ...prev,
      x: newX,
      y: newY,
    }));
  };

  const handlePointerUp = (e) => {
    if (!dragRef.current.isDragging) return;
    dragRef.current.isDragging = false;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch (err) {
      // Ignore
    }

    setIsDragging(false);
  };

  if (!isOpen) return null;

  const handleTitleBarDoubleClick = (e) => {
    if (e.target.closest('button')) return;
    sounds.playClick(soundEffectsEnabled);
    onMaximize();
  };

  const windowStyle = isMaximized
    ? {
        zIndex,
        top: 0,
        left: 0,
        right: 0,
        bottom: '48px',
        width: '100%',
        height: 'calc(100vh - 48px)',
      }
    : {
        zIndex,
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${position.width}px`,
        height: `${position.height}px`,
      };

  return (
    <div
      ref={windowRef}
      id={`win-window-${id}`}
      onMouseDown={onFocus}
      onTouchStart={onFocus}
      style={windowStyle}
      className={`fixed flex flex-col ${
        isDragging
          ? 'transition-none shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-2 ring-sky-400/50 select-none'
          : 'transition-[opacity,transform] duration-150 ease-out'
      } ${
        isMinimized
          ? 'opacity-0 scale-90 pointer-events-none translate-y-12'
          : 'opacity-100 scale-100'
      } ${
        isMaximized
          ? 'rounded-none border-0'
          : 'rounded-xl sm:rounded-2xl border border-white/15 shadow-2xl'
      } bg-[#16161a]/95 backdrop-blur-2xl text-white overflow-hidden`}
    >
      {/* Windows 11 Draggable Tab & Title Bar */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={handleTitleBarDoubleClick}
        style={{ touchAction: 'none' }}
        className={`h-10 px-3 bg-[#1e1e24]/95 border-b border-white/10 flex items-center justify-between select-none shrink-0 cursor-grab active:cursor-grabbing ${
          isDragging ? 'cursor-grabbing bg-[#252530]' : 'hover:bg-[#22222a]'
        } transition-colors`}
        title="Click and drag anywhere on this title tab to move the window"
      >
        {/* Left: Window Icon, Drag Grip & Title */}
        <div className="flex items-center gap-2.5 min-w-0 pr-4 pointer-events-none">
          <GripHorizontal className="w-4 h-4 text-zinc-400 shrink-0" />
          {IconComponent && (
            <div className="w-6 h-6 rounded-md bg-white/[0.06] border border-white/10 flex items-center justify-center text-zinc-200 shrink-0 shadow-sm">
              <IconComponent className="w-3.5 h-3.5 stroke-[1.8]" />
            </div>
          )}
          <div className="flex items-baseline gap-2 truncate">
            <span className="text-xs sm:text-sm font-semibold text-white tracking-wide truncate">
              {title}
            </span>
            {subtitle && (
              <span className="hidden sm:inline text-[11px] text-zinc-400 font-normal truncate">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {/* Right: Windows 11 Window Controls */}
        <div className="flex items-center -mr-3 h-full pointer-events-auto">
          {/* Minimize */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              sounds.playClick(soundEffectsEnabled);
              onMinimize();
            }}
            title="Minimize"
            aria-label="Minimize"
            className="w-11 h-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Maximize / Restore */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              sounds.playClick(soundEffectsEnabled);
              onMaximize();
            }}
            title={isMaximized ? 'Restore Down' : 'Maximize'}
            aria-label={isMaximized ? 'Restore Down' : 'Maximize'}
            className="w-11 h-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {isMaximized ? (
              <Copy className="w-3 h-3 -rotate-90" />
            ) : (
              <Square className="w-3 h-3" />
            )}
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              sounds.playClick(soundEffectsEnabled);
              onClose();
            }}
            title="Close"
            aria-label="Close"
            className="w-11 h-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#e81123] active:bg-[#c40e1d] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Window Body Content */}
      <div className="flex-1 overflow-hidden relative flex flex-col bg-[var(--bg-base)]">
        {/* Pointer events shield during active dragging so iframes or canvas don't swallow mouse movements */}
        {isDragging && <div className="absolute inset-0 z-50 pointer-events-auto bg-transparent" />}
        {children}
      </div>
    </div>
  );
};


