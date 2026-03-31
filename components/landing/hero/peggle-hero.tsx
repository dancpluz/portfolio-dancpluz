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
  const cannonRef = useRef<Matter.Body | null>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

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

    // 4. Walls & Cannon
    const wallOptions = { isStatic: true, render: { fillStyle: '#333' } };
    const ground = Matter.Bodies.rectangle(width / 2, height + 50, width, 100, wallOptions); // Below screen so ball falls through if we remove it, or keep it as floor for now
    const leftWall = Matter.Bodies.rectangle(-25, height / 2, 50, height, wallOptions);
    const rightWall = Matter.Bodies.rectangle(width + 25, height / 2, 50, height, wallOptions);
    const ceiling = Matter.Bodies.rectangle(width / 2, -25, width, 50, wallOptions);

    const cannonWidth = 80;
    const cannonHeight = 25;
    const cannonPos = { x: width / 2, y: 0 };

    const cannon = Matter.Bodies.rectangle(cannonPos.x, cannonPos.y, cannonWidth, cannonHeight, {
      isStatic: true,
      label: 'cannon',
      render: {
        fillStyle: '#334155', // slate-700
        strokeStyle: '#94a3b8', // slate-400
        lineWidth: 2,
      }
    });
    cannonRef.current = cannon;

    Matter.Composite.add(world, [leftWall, rightWall, ceiling, cannon]); // no ground so ball falls off

    // 5. Pegs (Pattern generation)
    const pegs: Matter.Body[] = [];
    const rows = 7;
    const cols = 12;
    const spacingX = width / cols;
    const spacingY = 65;
    const startY = 150;

    for (let row = 0; row < rows; row++) {
      // Make every 3rd row a line of rectangles
      const isRectRow = row % 3 === 2; 

      for (let col = 0; col < cols; col++) {
        // Offset alternating rows for circles, keep rectangles aligned
        const offsetX = (!isRectRow && row % 2 === 0) ? spacingX / 2 : 0;
        const x = col * spacingX + offsetX + spacingX / 2;
        const y = startY + row * spacingY;

        // Skip edges
        if (x > width - 20 || x < 20) continue;
        
        // Randomly skip some circles to make patterns
        if (!isRectRow && Math.random() > 0.8) continue;
        
        // Create regular gaps in rectangle lines so the ball doesn't get stuck forever
        if (isRectRow && col % 4 === 0) continue; 

        // Determine color
        const rand = Math.random();
        let color = PEG_COLORS.electricGreen;
        if (rand > 0.85) color = PEG_COLORS.neonPink;
        else if (rand > 0.7) color = PEG_COLORS.cyanBlue;

        const pegOptions = {
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
            hit: false,
            isRectRow: isRectRow
          }
        };

        let peg;
        if (isRectRow) {
          // Bigger rectangles, close to each other, forming a line, no rotation
          const rectWidth = spacingX - 6; // 6px gap between them
          const rectHeight = 22;
          peg = Matter.Bodies.rectangle(x, y, rectWidth, rectHeight, { 
            ...pegOptions, 
            chamfer: { radius: 2 } // Still with rounded corners
          });
        } else {
          // Circles
          peg = Matter.Bodies.circle(x, y, 14, pegOptions);
        }

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

    // 6.5. Stuck Ball Event
    Matter.Events.on(engine, 'collisionActive', (event: Matter.IEventCollision<Matter.Engine>) => {
      event.pairs.forEach((pair: Matter.Pair) => {
        const { bodyA, bodyB } = pair;
        const peg = bodyA.label === 'peg' ? bodyA : bodyB.label === 'peg' ? bodyB : null;
        const ball = bodyA.label === 'ball' ? bodyA : bodyB.label === 'ball' ? bodyB : null;

        if (peg && ball && peg.plugin?.isRectRow) {
          // If the ball is resting/stuck on a rectangle, destroy the rectangle so it drops
          const speed = Matter.Vector.magnitude(ball.velocity);
          if (speed < 0.01) {
            Matter.Composite.remove(world, peg);
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

    // 8. Update cannon angle based on mouse
    Matter.Events.on(engine, 'beforeUpdate', () => {
      if (cannonRef.current) {
        let angle = Math.atan2(
          mousePosRef.current.y - cannonPos.y,
          mousePosRef.current.x - cannonPos.x
        );
        
        // Constrain cannon angle to shoot downwards (optional but looks nice)
        if (angle < 0 && angle > -Math.PI / 2) angle = 0; // limit aiming right-up
        if (angle < -Math.PI / 2) angle = Math.PI; // limit aiming left-up

        // Offset position so it rotates around the cannonPos (anchor) rather than its center
        // canonWidth/2 shifts the center to make the left edge touch the anchor.
        const pivotOffset = cannonWidth / 2 - 10; // -10 embeds it slightly in the ceiling
        Matter.Body.setPosition(cannonRef.current, {
          x: cannonPos.x + Math.cos(angle) * pivotOffset,
          y: cannonPos.y + Math.sin(angle) * pivotOffset
        });

        Matter.Body.setAngle(cannonRef.current, angle);
      }
    });

    // 9. Draw trajectory preview
    Matter.Events.on(render, 'afterRender', () => {
      if (!cannonRef.current || !render.context) return;
      
      const context = render.context;
      const angle = cannonRef.current.angle;
      
      const startX = cannonPos.x + Math.cos(angle) * cannonWidth;
      const startY = cannonPos.y + Math.sin(angle) * cannonWidth;
      
      context.beginPath();
      context.moveTo(startX, startY);
      context.setLineDash([10, 10]);
      context.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      context.lineWidth = 2;
      
      let currX = startX;
      let currY = startY;
      let vx = Math.cos(angle) * 15;
      let vy = Math.sin(angle) * 15;
      
      // Matter.js applies force over time squared. 
      // Default engine.timing.timeScale is 1. (1000/60)^2 ~ 277.77
      const gravityY = engine.gravity.y * engine.gravity.scale * 277.77; 
      const frictionAir = 1 - 0.001; // 1 - ball.frictionAir
      
      const bodiesToCheck = Matter.Composite.allBodies(world).filter(
        (b: Matter.Body) => b.label !== 'cannon' && b.label !== 'ball'
      );
      
      // Simulate frames of movement for the preview
      for (let i = 0; i < 40; i++) {
        vy += gravityY; // Apply gravity force
        vx *= frictionAir; // Apply air friction
        vy *= frictionAir;
        
        const nextX = currX + vx;
        const nextY = currY + vy;
        
        // Raycast line segment to see if trajectory hits objects
        const rayWidth = 30; // approx ball diameter to make the collision prediction thicker
        const collisions = Matter.Query.ray(bodiesToCheck, { x: currX, y: currY }, { x: nextX, y: nextY }, rayWidth);
        
        context.lineTo(nextX, nextY);
        
        currX = nextX;
        currY = nextY;
        
        if (collisions.length > 0) {
          // If we hit a peg or wall, draw a small circle at the hit point and stop
          context.stroke(); // Draw the dashed line up to this point
          context.beginPath();
          context.setLineDash([]); // Solid border for impact circle
          context.arc(currX, currY, 15, 0, 2 * Math.PI);
          context.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          context.stroke();
          
          context.beginPath(); // Start a new path so the subsequent stroke() at the end doesn't redraw this
          break; // Stop predicting further
        }
      }
      
      context.stroke();
      context.setLineDash([]); // Reset
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

  const handleSpawnBall = () => {
    if (!engineRef.current || !cannonRef.current || !sceneRef.current) return;
    
    // Only one ball active at a time
    const balls = Matter.Composite.allBodies(engineRef.current.world).filter((b: Matter.Body) => b.label === 'ball');
    if (balls.length > 0) return; 

    const angle = cannonRef.current.angle;
    const width = sceneRef.current.clientWidth;
    const anchorPos = { x: width / 2, y: 20 }; // Original anchor position
    
    // We want to spawn past the barrel tip
    const cannonWidth = 80;
    const spawnDistance = cannonWidth + 10;
    const x = anchorPos.x + Math.cos(angle) * spawnDistance;
    const y = anchorPos.y + Math.sin(angle) * spawnDistance;

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

    // Apply shooting force/velocity
    const speed = 15;
    Matter.Body.setVelocity(ball, {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    });

    Matter.Composite.add(engineRef.current.world, ball);
  };

  return (
    <div 
      className="relative w-full h-[600px] cursor-crosshair overflow-hidden rounded-xl"
      onClick={handleSpawnBall}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute top-4 left-4 z-10 pointer-events-none select-none">
        <h2 className="text-2xl font-bold text-white tracking-widest uppercase">Peggle Hero</h2>
        <p className="text-slate-400 text-sm">Clique no topo para soltar a bola!</p>
      </div>
      <div ref={sceneRef} className="w-full h-full" />
    </div>
  );
}
