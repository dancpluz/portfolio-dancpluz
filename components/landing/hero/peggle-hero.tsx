'use client';

import React, { useEffect, useRef } from 'react';
import { PeggleSystem } from './peggle/PeggleSystem';

export default function PeggleHero() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<PeggleSystem | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Instantiate OOP Game Paradigm from the new folder structure
    const game = new PeggleSystem(sceneRef.current);
    game.init();
    gameRef.current = game;

    return () => {
      game.destroy();
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sceneRef.current || !gameRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    gameRef.current.updateMousePos(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleSpawnBall = () => {
    gameRef.current?.spawnBall();
  };

  return (
    <div 
      className="relative w-full h-[600px] cursor-crosshair overflow-hidden rounded-xl bg-[#1e1e1e]"
      onClick={handleSpawnBall}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute top-4 left-4 z-10 pointer-events-none select-none">
        <h2 className="text-2xl font-bold text-white tracking-widest uppercase mb-2" style={{ fontFamily: '"Courier New", Courier, monospace' }}>Peggle Hero</h2>
        <p className="text-slate-200 text-sm bg-black/40 px-3 py-1 rounded inline-block">Clique no topo para soltar a bola!</p>
      </div>
      <div ref={sceneRef} className="w-full h-full" />
    </div>
  );
}
