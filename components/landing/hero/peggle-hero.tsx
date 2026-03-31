'use client';

import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const PEG_COLORS = {
  neonPink: '#ff00ff',
  electricGreen: '#00f248',
  cyanBlue: '#00fbfe',
};

export default function PeggleHero() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    // 1. Engine & World
    const engine = Matter.Engine.create();
    const world = engine.world;
    engineRef.current = engine;

    // 2. Render
    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight || 600;

    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent',
      },
    });
    renderRef.current = render;

    // 3. Runner
    const runner = Matter.Runner.create();
    runnerRef.current = runner;

    // 4. Walls
    const wallOptions = { isStatic: true, render: { fillStyle: '#333' } };
    const ground = Matter.Bodies.rectangle(width / 2, height + 50, width, 100, wallOptions); // Below screen so ball falls through if we remove it, or keep it as floor for now
    const leftWall = Matter.Bodies.rectangle(-25, height / 2, 50, height, wallOptions);
    const rightWall = Matter.Bodies.rectangle(width + 25, height / 2, 50, height, wallOptions);
    const ceiling = Matter.Bodies.rectangle(width / 2, -25, width, 50, wallOptions);

    Matter.Composite.add(world, [leftWall, rightWall, ceiling]); // no ground so ball falls off

    // 5. Pegs (Pattern generation)
    const pegs: Matter.Body[] = [];
    const rows = 6;
    const cols = 12;
    const spacingX = width / cols;
    const spacingY = 60;
    const startY = 150;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Offset alternating rows
        const offsetX = row % 2 === 0 ? spacingX / 2 : 0;
        const x = col * spacingX + offsetX + spacingX / 2;
        const y = startY + row * spacingY;

        // Skip some to make a shape or randomize
        if (x > width - 20 || x < 20) continue;
        if (Math.random() > 0.7) continue;

        // Determine color based on probability
        const rand = Math.random();
        let color = PEG_COLORS.electricGreen;
        if (rand > 0.9) color = PEG_COLORS.neonPink;
        else if (rand > 0.8) color = PEG_COLORS.cyanBlue;

        const peg = Matter.Bodies.circle(x, y, 12, {
          isStatic: true,
          restitution: 0.6,
          render: {
            fillStyle: color,
            strokeStyle: '#fff',
            lineWidth: 2,
          },
          label: 'peg',
          plugin: {
            color: color,
            hit: false
          } // Store custom info
        });
        pegs.push(peg);
      }
    }
    Matter.Composite.add(world, pegs);

    // 6. Collision Events
    Matter.Events.on(engine, 'collisionStart', (event: Matter.IEventCollision<Matter.Engine>) => {
      event.pairs.forEach((pair: Matter.Pair) => {
        const { bodyA, bodyB } = pair;
        const peg = bodyA.label === 'peg' ? bodyA : bodyB.label === 'peg' ? bodyB : null;
        const ball = bodyA.label === 'ball' ? bodyA : bodyB.label === 'ball' ? bodyB : null;

        if (peg && ball) {
          // Mark peg as hit
          if (peg.plugin) {
            peg.plugin.hit = true;
            peg.render.fillStyle = '#ffffff'; // Flash white on hit
            peg.render.lineWidth = 4;
          }
        }
      });
    });

    // 7. Loop to clear fallen ball & pegs at round end
    Matter.Events.on(engine, 'afterUpdate', () => {
      const bodies = Matter.Composite.allBodies(world);
      const balls = bodies.filter((b: Matter.Body) => b.label === 'ball');
      
      balls.forEach((ball: Matter.Body) => {
        if (ball.position.y > height + 100) {
          // Ball fell out - End Shot
          Matter.Composite.remove(world, ball);

          // Remove hit pegs
          const allPegs = Matter.Composite.allBodies(world).filter((b: Matter.Body) => b.label === 'peg');
          const hitPegs = allPegs.filter((b: Matter.Body) => b.plugin?.hit);
          
          hitPegs.forEach((hitPeg: Matter.Body) => {
            Matter.Composite.remove(world, hitPeg);
          });
        }
      });
    });

    Matter.Render.run(render);
    Matter.Runner.run(runner, engine);

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
      render.canvas = null as any;
      render.context = null as any;
      render.textures = {};
    };
  }, []);

  const handleSpawnBall = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!engineRef.current || !sceneRef.current) return;
    
    // Only one ball active at a time
    const balls = Matter.Composite.allBodies(engineRef.current.world).filter((b: Matter.Body) => b.label === 'ball');
    if (balls.length > 0) return; 

    const rect = sceneRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = 20; // drop from top

    const ball = Matter.Bodies.circle(x, y, 15, {
      restitution: 0.85,
      friction: 0.001,
      frictionAir: 0.001,
      density: 0.05,
      label: 'ball',
      render: {
        fillStyle: '#fff',
        strokeStyle: '#666',
        lineWidth: 2
      }
    });

    Matter.Composite.add(engineRef.current.world, ball);
  };

  return (
    <div 
      className="relative w-full h-[600px] bg-slate-900 cursor-crosshair overflow-hidden rounded-xl border border-slate-800"
      onClick={handleSpawnBall}
    >
      <div className="absolute top-4 left-4 z-10 pointer-events-none select-none">
        <h2 className="text-2xl font-bold text-white tracking-widest uppercase">Peggle Hero</h2>
        <p className="text-slate-400 text-sm">Clique no topo para soltar a bola!</p>
      </div>
      <div ref={sceneRef} className="w-full h-full" />
    </div>
  );
}
