'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PeggleSystem, type GameHUDState } from './peggle/PeggleSystem';
import { CANVAS_HEIGHT, CANVAS_WIDTH, PEG_COLORS } from './peggle/constants';

export default function PeggleHero() {
  const sceneRef = useRef<HTMLButtonElement>(null);
  const gameRef = useRef<PeggleSystem | null>(null);
  const [hud, setHud] = useState<GameHUDState>({
    balls: 10, score: 0, gameState: 'playing', pinkLeft: 0,
    comboCount: 0, multiplier: 1, shotScore: 0,
  });

  let multiplierColor = 'grey';
  if (hud.multiplier >= 10) {
    multiplierColor = PEG_COLORS.neonPink;
  } else if (hud.multiplier >= 5) {
    multiplierColor = PEG_COLORS.cyanBlue;
  } else if (hud.multiplier >= 3) {
    multiplierColor = PEG_COLORS.electricGreen;
  }

  useEffect(() => {
    if (!sceneRef.current) return;
    
    const game = new PeggleSystem(sceneRef.current);
    game.setStateChangeCallback(setHud);
    game.init();
    gameRef.current = game;

    const canvas = game.getCanvasElement();
    if (!canvas) return;

    const getCanvasPos = (touch: Touch) => {
      const rect = canvas.getBoundingClientRect();
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const pos = getCanvasPos(e.touches[0]);
      game.updateMousePos(pos.x, pos.y);
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      game.handleClick();
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      game.updateMousePos(e.clientX - rect.left, e.clientY - rect.top);
    };

    canvas.addEventListener('touchstart', onTouchMove, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    globalThis.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      canvas.removeEventListener('touchstart', onTouchMove);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      globalThis.removeEventListener('mousemove', onMouseMove);
      game.destroy();
    };
  }, []);

  const handleClick = useCallback(() => {
    gameRef.current?.handleClick();
  }, []);

  return (
    <div
      className='relative w-full flex flex-col items-center gap-4 py-4'
    >
      {/* HUD */}
      <div className='w-full max-w-[420px] flex items-start justify-between px-2 select-none'>
        {/* Left: Score */}
        <div className='flex flex-col gap-0.5'>
          <span className='font-heading text-[10px] uppercase tracking-widest text-foreground/50'>
            Score
          </span>
          <span className='font-heading text-2xl sm:text-3xl font-bold text-foreground tabular-nums leading-none'>
            {hud.score.toLocaleString()}
          </span>
          <span
            className='font-heading text-xs font-bold leading-none transition-opacity duration-300 h-4'
            style={{
              opacity: hud.multiplier > 1 ? 1 : 0,
              color: multiplierColor,
            }}
          >
            {hud.comboCount} COMBO ×{hud.multiplier}
          </span>
        </div>

        {/* Right: Balls + Pink Pegs */}
        <div className='flex flex-col items-end gap-1'>
          <div className='flex flex-col items-end gap-0.5'>
            <span className='font-heading text-[10px] uppercase tracking-widest text-foreground/50'>
              Bolas
            </span>
            <div className='flex gap-0.5 items-center flex-wrap justify-end'>
              {(() => {
                const ballsList = [];
                for (let i = 0; i < hud.balls; i++) {
                  ballsList.push(
                    <div
                      key={`ball-hud-${i}`}
                      className='w-2.5 h-2.5 rounded-full bg-linear-to-br from-white to-gray-500 border border-black'
                    />
                  );
                }
                return ballsList;
              })()}
              {hud.balls === 0 && (
                <span className='font-heading text-xs text-red-400'>0</span>
              )}
            </div>
          </div>
          <div className='flex items-center gap-1.5'>
            <span className='font-heading text-[10px] uppercase tracking-widest text-[#ff00ff]/70'>
              Pegs
            </span>
            <span className='font-heading text-sm font-bold text-[#ff00ff] leading-none'>
              {hud.pinkLeft}
            </span>
          </div>
        </div>
      </div>

      {/* Game Canvas */}
      <button
        ref={sceneRef}
        type='button'
        aria-label='Peggle game canvas'
        className='w-full bg-surface pixel-corners-small cursor-crosshair touch-none outline-none block border-0 p-0 text-left'
        style={{ maxWidth: `${CANVAS_WIDTH}px`, aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
        onClick={handleClick}
      />
    </div>
  );
}
