import Matter from 'matter-js';
import { Peg } from './Peg';

export class PeggleSystem {
  public engine: Matter.Engine;
  public world: Matter.World;
  public runner: Matter.Runner;
  public render: Matter.Render;
  
  private container: HTMLElement;
  private width: number;
  private height: number;

  private cannon: Matter.Body | null = null;
  private cannonImg: HTMLImageElement;
  private mousePos = { x: 0, y: 0 };
  private pegs: Peg[] = [];

  constructor(container: HTMLElement) {
    this.container = container;
    this.width = container.clientWidth;
    this.height = container.clientHeight || 600;

    this.engine = Matter.Engine.create();
    this.world = this.engine.world;

    this.render = Matter.Render.create({
      element: this.container,
      engine: this.engine,
      options: {
        width: this.width,
        height: this.height,
        wireframes: false,
        background: 'transparent',
      },
    });

    this.runner = Matter.Runner.create();

    // Cache the image for drawing the cannon
    this.cannonImg = new Image();
    this.cannonImg.src = '/cannon.png';
  }

  public init() {
    this.createWalls();
    this.createCannon();
    this.createPegs();
    this.attachEvents();

    Matter.Render.run(this.render);
    Matter.Runner.run(this.runner, this.engine);
  }

  public destroy() {
    Matter.Render.stop(this.render);
    Matter.Runner.stop(this.runner);
    Matter.Engine.clear(this.engine);
    if (this.render.canvas) this.render.canvas.remove();
  }

  public updateMousePos(x: number, y: number) {
    this.mousePos = { x, y };
  }

  private createWalls() {
    const wallOptions = { isStatic: true, render: { fillStyle: '#1e293b' } }; // slate-800 walls
    const ground = Matter.Bodies.rectangle(this.width / 2, this.height + 50, this.width, 100, wallOptions);
    const leftWall = Matter.Bodies.rectangle(-25, this.height / 2, 50, this.height, wallOptions);
    const rightWall = Matter.Bodies.rectangle(this.width + 25, this.height / 2, 50, this.height, wallOptions);
    const ceiling = Matter.Bodies.rectangle(this.width / 2, -25, this.width, 50, wallOptions);

    Matter.Composite.add(this.world, [leftWall, rightWall, ceiling]); 
  }

  private createCannon() {
    const cannonWidth = 80;
    const cannonHeight = 25;
    const cannonPos = { x: this.width / 2, y: 0 };

    this.cannon = Matter.Bodies.rectangle(cannonPos.x, cannonPos.y, cannonWidth, cannonHeight, {
      isStatic: true,
      label: 'cannon',
      render: { visible: false } // Hidden for custom 3D parsing
    });

    Matter.Composite.add(this.world, this.cannon);
  }

  private createPegs() {
    const rows = 7;
    const cols = 12;
    const spacingX = this.width / cols;
    const spacingY = 65;
    const startY = 150;

    for (let row = 0; row < rows; row++) {
      const isRectRow = row % 3 === 2;
      // Double the column count for rectangle rows to make them shorter but closer
      const currentCols = isRectRow ? cols * 2.5 : cols; 
      const spacingX = this.width / currentCols;

      for (let col = 0; col < currentCols; col++) {
        const offsetX = (!isRectRow && row % 2 === 0) ? spacingX / 2 : 0;
        const x = col * spacingX + offsetX + spacingX / 2;
        const y = startY + row * spacingY;

        if (x > this.width - 20 || x < 20) continue;
        if (!isRectRow && Math.random() > 0.8) continue;
        if (isRectRow && col % 5 === 0) continue; // Gap every 5 tiny blocks to let ball pass

        const peg = new Peg(x, y, isRectRow, this.width, spacingX);
        this.pegs.push(peg);
        Matter.Composite.add(this.world, peg.body);
      }
    }
  }

  public spawnBall() {
    if (!this.cannon) return;

    const balls = Matter.Composite.allBodies(this.world).filter(b => b.label === 'ball');
    if (balls.length > 0) return;

    const angle = this.cannon.angle;
    const cannonPos = { x: this.width / 2, y: 0 };
    const spawnDistance = 90;
    
    const x = cannonPos.x + Math.cos(angle) * spawnDistance;
    const y = cannonPos.y + Math.sin(angle) * spawnDistance;

    const ball = Matter.Bodies.circle(x, y, 15, {
      restitution: 0.85,
      friction: 0.001,
      frictionAir: 0.001,
      density: 0.05,
      label: 'ball',
      render: { visible: false }
    });

    const speed = 15;
    Matter.Body.setVelocity(ball, {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    });

    Matter.Composite.add(this.world, ball);
  }

  private attachEvents() {
    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      event.pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        const pegBody = bodyA.label === 'peg' ? bodyA : bodyB.label === 'peg' ? bodyB : null;
        const ball = bodyA.label === 'ball' ? bodyA : bodyB.label === 'ball' ? bodyB : null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (pegBody && ball && (pegBody.plugin as any).gameObject) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ((pegBody.plugin as any).gameObject as Peg).markHit();
        }
      });
    });

    Matter.Events.on(this.engine, 'collisionActive', (event) => {
      event.pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        const pegBody = bodyA.label === 'peg' ? bodyA : bodyB.label === 'peg' ? bodyB : null;
        const ball = bodyA.label === 'ball' ? bodyA : bodyB.label === 'ball' ? bodyB : null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (pegBody && ball && ((pegBody.plugin as any).gameObject as Peg)?.isRectRow) {
          const speed = Matter.Vector.magnitude(ball.velocity);
          if (speed < 0.01) {
            this.removePeg(pegBody);
          }
        }
      });
    });

    Matter.Events.on(this.engine, 'afterUpdate', () => {
      const bodies = Matter.Composite.allBodies(this.world);
      const balls = bodies.filter(b => b.label === 'ball');
      
      balls.forEach(ball => {
        if (ball.position.y > this.height + 100) {
          Matter.Composite.remove(this.world, ball);
          
          this.pegs.forEach(peg => {
            if (peg.isHit) {
              this.removePeg(peg.body);
            }
          });
        }
      });
    });

    Matter.Events.on(this.engine, 'beforeUpdate', () => {
      if (!this.cannon) return;
      const cannonPos = { x: this.width / 2, y: 0 };
      const cannonWidth = 80;

      let angle = Math.atan2(
        this.mousePos.y - cannonPos.y,
        this.mousePos.x - cannonPos.x
      );
      
      if (angle < 0 && angle > -Math.PI / 2) angle = 0; 
      if (angle < -Math.PI / 2) angle = Math.PI; 

      const pivotOffset = cannonWidth / 2 - 10; 
      Matter.Body.setPosition(this.cannon, {
        x: cannonPos.x + Math.cos(angle) * pivotOffset,
        y: cannonPos.y + Math.sin(angle) * pivotOffset
      });

      Matter.Body.setAngle(this.cannon, angle);
    });

    Matter.Events.on(this.render, 'afterRender', () => {
      const ctx = this.render.context;
      if (!ctx || !this.cannon) return;

      this.pegs.forEach(peg => {
        if (Matter.Composite.allBodies(this.world).includes(peg.body)) {
          peg.renderCustom(ctx);
        }
      });

      // Render Custom Cannon
      ctx.save();
      ctx.translate(this.cannon.position.x, this.cannon.position.y);
      ctx.rotate(this.cannon.angle);
      
      if (this.cannonImg && this.cannonImg.complete && this.cannonImg.width > 0) {
        // Apply base rotation of 45 degrees for the image
        ctx.rotate(45 * Math.PI / 180);
        
        // The physics cannon width is 80.
        // We anchor the left edge at -40 to match the physics rotation pivot.
        const w = 90; // slightly larger than physics bounds for a solid look
        const h = w * (this.cannonImg.height / this.cannonImg.width);
        ctx.drawImage(this.cannonImg, -40, -h / 2, w, h);
      } else {
        // Fallback wireframe just in case image is loading
        const w = 80;
        const h = 25;
        ctx.fillStyle = '#334155';
        ctx.fillRect(-w/2, -h/2, w, h);
      }
      
      ctx.restore();

      // Render Ball Loop
      const balls = Matter.Composite.allBodies(this.world).filter(b => b.label === 'ball');
      balls.forEach(ball => {
        const { x: bx, y: by } = ball.position;
        const r = 15;
        
        ctx.beginPath();
        ctx.arc(bx, by, r, 0, Math.PI * 2);
        
        // CSS converted metallic radial gradient
        const gradX = bx - r * 0.3; 
        const gradY = by - r * 0.7; 
        const grad = ctx.createRadialGradient(gradX, gradY, 1, bx, by, r);
        
        grad.addColorStop(0, "white");
        grad.addColorStop(0.03, "#d1d5db"); // light gray / silver reflection
        grad.addColorStop(0.6, "#374151");  // dark metallic gray core
        grad.addColorStop(1, "#9ca3af");    // soft gray rim
        
        ctx.fillStyle = grad;
        ctx.fill();
        
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
      });

      // Render Trajectory
      const angle = this.cannon.angle;
      const cannonPos = { x: this.width / 2, y: 0 };
      const cannonWidth = 80;
      
      const startX = cannonPos.x + Math.cos(angle) * cannonWidth;
      const startY = cannonPos.y + Math.sin(angle) * cannonWidth;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.setLineDash([10, 10]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      
      let currX = startX;
      let currY = startY;
      let vx = Math.cos(angle) * 15;
      let vy = Math.sin(angle) * 15;
      
      const gravityY = this.engine.gravity.y * this.engine.gravity.scale * 277.77; 
      const frictionAir = 1 - 0.001; 
      
      const bodiesToCheck = Matter.Composite.allBodies(this.world).filter(
        b => b.label !== 'cannon' && b.label !== 'ball'
      );
      
      for (let i = 0; i < 40; i++) {
        vy += gravityY; 
        vx *= frictionAir; 
        vy *= frictionAir;
        
        const nextX = currX + vx;
        const nextY = currY + vy;
        
        const collisions = Matter.Query.ray(bodiesToCheck, { x: currX, y: currY }, { x: nextX, y: nextY }, 30);
        
        ctx.lineTo(nextX, nextY);
        
        currX = nextX;
        currY = nextY;
        
        if (collisions.length > 0) {
          ctx.stroke(); 
          ctx.beginPath();
          ctx.setLineDash([]); 
          ctx.arc(currX, currY, 15, 0, 2 * Math.PI);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.stroke();
          ctx.beginPath(); 
          break; 
        }
      }
      
      ctx.stroke();
      ctx.setLineDash([]); 
    });
  }

  private removePeg(body: Matter.Body) {
    Matter.Composite.remove(this.world, body);
    this.pegs = this.pegs.filter(p => p.body !== body);
  }
}
