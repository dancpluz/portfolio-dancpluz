import Matter from 'matter-js';
import { Peg } from './Peg';
import {
  INITIAL_BALLS, BALL_SPEED, BALL_RADIUS,
  CANNON_WIDTH, CANNON_HEIGHT, HEADING_FONT,
  PEG_ROWS, PEG_COLS, PEG_SPACING_Y, PEG_START_Y,
  RECT_PEG_WIDTH, CANVAS_WIDTH, CANVAS_HEIGHT,
  PEG_COLORS, PEG_DISTRIBUTION,
  getComboMultiplier,
} from './constants';

interface ScoreParticle {
  x: number;
  y: number;
  text: string;
  color: string;
  age: number;
  maxAge: number;
}

export type GameState = 'playing' | 'won' | 'lost';

export interface GameHUDState {
  balls: number;
  score: number;
  gameState: GameState;
  pinkLeft: number;
  comboCount: number;
  multiplier: number;
  shotScore: number;
}

export class PeggleSystem {
  public engine: Matter.Engine;
  public world: Matter.World;
  public runner: Matter.Runner;
  public render: Matter.Render;
  
  private readonly container: HTMLElement;
  private readonly width: number;
  private readonly height: number;

  private cannon: Matter.Body | null = null;
  private readonly cannonImg: HTMLImageElement;
  private mousePos = { x: 0, y: 0 };
  private pegs: Peg[] = [];

  // Game state
  private ballsRemaining: number = INITIAL_BALLS;
  private score: number = 0;
  private gameState: GameState = 'playing';
  private scoreParticles: ScoreParticle[] = [];

  // Combo state (per shot)
  private comboCount: number = 0;
  private cyanMultiplierBoost: number = 0;
  private shotBaseScore: number = 0;

  private onStateChange?: (state: GameHUDState) => void;

  constructor(container: HTMLElement) {
    this.container = container;
    
    const containerW = container.clientWidth;
    const containerH = container.clientHeight;
    const scale = Math.min(containerW / CANVAS_WIDTH, containerH / CANVAS_HEIGHT, 1);
    this.width = Math.floor(CANVAS_WIDTH * scale);
    this.height = Math.floor(CANVAS_HEIGHT * scale);

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
        pixelRatio: window.devicePixelRatio || 1,
      },
    });

    this.runner = Matter.Runner.create();

    this.cannonImg = new Image();
    this.cannonImg.src = '/cannon.webp';
  }

  public setStateChangeCallback(cb: (state: GameHUDState) => void) {
    this.onStateChange = cb;
  }

  private getCurrentMultiplier() {
    return getComboMultiplier(this.comboCount) + this.cyanMultiplierBoost;
  }

  private notifyStateChange() {
    const pinkLeft = this.pegs.filter(p => p.isNeonPink && !p.isHit).length;
    const multiplier = this.getCurrentMultiplier();
    this.onStateChange?.({
      balls: this.ballsRemaining,
      score: this.score,
      gameState: this.gameState,
      pinkLeft,
      comboCount: this.comboCount,
      multiplier,
      shotScore: this.shotBaseScore,
    });
  }

  public init() {
    this.createWalls();
    this.createCannon();
    this.createPegs();
    this.attachEvents();

    Matter.Render.run(this.render);
    Matter.Runner.run(this.runner, this.engine);

    if (this.render.canvas) {
      this.render.canvas.style.display = 'block';
      this.render.canvas.style.margin = '0 auto';
    }
    this.notifyStateChange();
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

  public resetGame() {
    const allBodies = Matter.Composite.allBodies(this.world);
    allBodies.forEach(b => {
      if (b.label === 'peg' || b.label === 'ball') {
        Matter.Composite.remove(this.world, b);
      }
    });
    this.pegs = [];
    this.scoreParticles = [];
    this.ballsRemaining = INITIAL_BALLS;
    this.score = 0;
    this.comboCount = 0;
    this.shotBaseScore = 0;
    this.gameState = 'playing';
    this.createPegs();
    this.notifyStateChange();
  }

  public getCanvasElement(): HTMLCanvasElement | null {
    return this.render.canvas ?? null;
  }

  private createWalls() {
    const wallOptions = { isStatic: true, render: { fillStyle: '#1e293b' }, label: 'wall' };
    const leftWall = Matter.Bodies.rectangle(-25, this.height / 2, 50, this.height, wallOptions);
    const rightWall = Matter.Bodies.rectangle(this.width + 25, this.height / 2, 50, this.height, wallOptions);
    const ceiling = Matter.Bodies.rectangle(this.width / 2, -25, this.width, 50, wallOptions);
    Matter.Composite.add(this.world, [leftWall, rightWall, ceiling]); 
  }

  private createCannon() {
    const cannonPos = { x: this.width / 2, y: 0 };
    this.cannon = Matter.Bodies.rectangle(cannonPos.x, cannonPos.y, CANNON_WIDTH, CANNON_HEIGHT, {
      isStatic: true,
      label: 'cannon',
      render: { visible: false }
    });
    Matter.Composite.add(this.world, this.cannon);
  }

  private createPegs() {
    const cols = PEG_COLS;
    const rows = PEG_ROWS;
    const startY = PEG_START_Y;
    const spacingY = PEG_SPACING_Y;

    // Pass 1: collect all valid peg positions
    const positions: { x: number; y: number; isRectRow: boolean }[] = [];

    for (let row = 0; row < rows; row++) {
      const isRectRow = row % 3 === 2;

      let currentCols: number;
      let spacingX: number;

      if (isRectRow) {
        const gap = 6;
        currentCols = Math.floor(this.width / (RECT_PEG_WIDTH + gap));
        spacingX = this.width / (currentCols + 1);
      } else {
        currentCols = cols;
        spacingX = this.width / (currentCols + 1);
      }

      for (let col = 0; col < currentCols; col++) {
        const offsetX = (!isRectRow && row % 2 === 0) ? spacingX / 2 : 0;
        const x = (col + 1) * spacingX + offsetX;
        const y = startY + row * spacingY;

        if (x > this.width - 15 || x < 15) continue;
        if (!isRectRow && Math.random() > 0.8) continue;
        if (isRectRow && col % 5 === 0) continue;

        positions.push({ x, y, isRectRow });
      }
    }

    // Pass 2: build color array with exact distribution
    const total = positions.length;
    const pinkCount = Math.round(total * PEG_DISTRIBUTION.pink);
    const cyanCount = Math.round(total * PEG_DISTRIBUTION.cyan);
    const greenCount = total - pinkCount - cyanCount;

    const colors: string[] = [
      ...new Array(pinkCount).fill(PEG_COLORS.neonPink),
      ...new Array(cyanCount).fill(PEG_COLORS.cyanBlue),
      ...new Array(greenCount).fill(PEG_COLORS.electricGreen),
    ];

    // Fisher-Yates shuffle for random placement
    for (let i = colors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colors[i], colors[j]] = [colors[j], colors[i]];
    }

    // Pass 3: create pegs with assigned colors
    positions.forEach((pos, i) => {
      const peg = new Peg(pos.x, pos.y, pos.isRectRow, colors[i]);
      this.pegs.push(peg);
      Matter.Composite.add(this.world, peg.body);
    });
  }

  // Called when a new ball is fired — resets combo for the new shot
  private startShot() {
    this.comboCount = 0;
    this.cyanMultiplierBoost = 0;
    this.shotBaseScore = 0;
  }

  // Called when ball exits the screen — finalize shot and clean up
  private endShot() {
    // Show a summary particle in the center if combo > 2 or cyan boost was obtained
    const multiplier = this.getCurrentMultiplier();
    if (this.comboCount >= 3 || this.cyanMultiplierBoost > 0) {
      this.scoreParticles.push({
        x: this.width / 2,
        y: this.height / 2,
        text: `+${this.shotBaseScore * multiplier}`,
        color: '#ffffff',
        age: 0,
        maxAge: 90,
      });
    }

    // Remove hit pegs after the shot ends (delayed removal like real Peggle)
    const hitPegs = this.pegs.filter(p => p.isHit);
    hitPegs.forEach(peg => this.removePeg(peg.body));

    this.comboCount = 0;
    this.shotBaseScore = 0;

    this.checkGameEnd();
    this.notifyStateChange();
  }

  public spawnBall() {
    if (!this.cannon || this.gameState !== 'playing') return;
    if (this.ballsRemaining <= 0) return;

    const balls = Matter.Composite.allBodies(this.world).filter(b => b.label === 'ball');
    if (balls.length > 0) return;

    this.startShot(); // Reset combo for the new shot

    const angle = this.cannon.angle;
    const cannonPos = { x: this.width / 2, y: 0 };
    const spawnDistance = CANNON_WIDTH + 10;
    
    const x = cannonPos.x + Math.cos(angle) * spawnDistance;
    const y = cannonPos.y + Math.sin(angle) * spawnDistance;

    const ball = Matter.Bodies.circle(x, y, BALL_RADIUS, {
      restitution: 0.85,
      friction: 0.001,
      frictionAir: 0.001,
      density: 0.05,
      label: 'ball',
      render: { visible: false }
    });

    Matter.Body.setVelocity(ball, {
      x: Math.cos(angle) * BALL_SPEED,
      y: Math.sin(angle) * BALL_SPEED
    });

    this.ballsRemaining--;
    Matter.Composite.add(this.world, ball);
    this.notifyStateChange();
  }

  private spawnScoreParticle(x: number, y: number, value: number | string, color: string) {
    const text = typeof value === 'number' ? `+${value}` : value;
    this.scoreParticles.push({ x, y, text, color, age: 0, maxAge: 60 });
  }

  private handlePegHit(pegObj: Peg, pegBody: Matter.Body) {
    const points = pegObj.markHit();
    if (points > 0) {
      // Calculate what the shot score WAS before this hit
      const prevMultiplier = this.getCurrentMultiplier();
      const prevShotScore = this.shotBaseScore * prevMultiplier;

      // Update base stats
      this.comboCount++;
      this.shotBaseScore += points;

      // Check for cyan boost
      if (pegObj.baseColor === PEG_COLORS.cyanBlue) {
        this.cyanMultiplierBoost++;
        this.scoreParticles.push({
          x: pegBody.position.x,
          y: pegBody.position.y - 25,
          text: 'MULTI UP!',
          color: pegObj.baseColor,
          age: 0,
          maxAge: 70
        });
      }

      // Calculate what the shot score IS now
      const newMultiplier = this.getCurrentMultiplier();
      const newShotScore = this.shotBaseScore * newMultiplier;

      // The difference is what we just earned, reflecting retroactive multiplier gains!
      const earnedThisHit = newShotScore - prevShotScore;
      
      this.score += earnedThisHit;

      this.spawnScoreParticle(pegBody.position.x, pegBody.position.y, earnedThisHit, pegObj.baseColor);
      this.notifyStateChange();
    }
  }

  private attachEvents() {
    // Collision Start — track combo hits and show base score particles
    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      event.pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        const pegBody = bodyA.label === 'peg' ? bodyA : (bodyB.label === 'peg' ? bodyB : null);
        const ball = bodyA.label === 'ball' ? bodyA : (bodyB.label === 'ball' ? bodyB : null);

        if (pegBody && ball) {
          const pegObj = (pegBody.plugin as Record<string, unknown>).gameObject as Peg | undefined;
          if (pegObj) {
            this.handlePegHit(pegObj, pegBody);
          }
        }
      });
    });

    // Collision Active — unstick balls from any peg
    Matter.Events.on(this.engine, 'collisionActive', (event) => {
      event.pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        const pegBody = bodyA.label === 'peg' ? bodyA : (bodyB.label === 'peg' ? bodyB : null);
        const ball = bodyA.label === 'ball' ? bodyA : (bodyB.label === 'ball' ? bodyB : null);

        if (pegBody && ball) {
          const speed = Matter.Vector.magnitude(ball.velocity);
          if (speed < 0.05) {
            const pegObj = (pegBody.plugin as Record<string, unknown>).gameObject as Peg | undefined;
            if (pegObj) {
              this.handlePegHit(pegObj, pegBody);
            }
            this.removePeg(pegBody);
          }
        }
      });
    });

    // After Update — detect ball exit and end the shot
    Matter.Events.on(this.engine, 'afterUpdate', () => {
      const bodies = Matter.Composite.allBodies(this.world);
      const balls = bodies.filter(b => b.label === 'ball');
      
      balls.forEach(ball => {
        if (ball.position.y > this.height + 100) {
          Matter.Composite.remove(this.world, ball);
          this.endShot(); // Finalize combo score and remove hit pegs
        }
      });

      this.scoreParticles.forEach(p => p.age++);
      this.scoreParticles = this.scoreParticles.filter(p => p.age < p.maxAge);
    });

    // Before Update — cannon aim
    Matter.Events.on(this.engine, 'beforeUpdate', () => {
      if (!this.cannon) return;
      const cannonPos = { x: this.width / 2, y: 0 };

      let angle = Math.atan2(
        this.mousePos.y - cannonPos.y,
        this.mousePos.x - cannonPos.x
      );
      
      if (angle < 0 && angle > -Math.PI / 2) angle = 0; 
      if (angle < -Math.PI / 2) angle = Math.PI; 

      const pivotOffset = CANNON_WIDTH / 2 - 10; 
      Matter.Body.setPosition(this.cannon, {
        x: cannonPos.x + Math.cos(angle) * pivotOffset,
        y: cannonPos.y + Math.sin(angle) * pivotOffset
      });
      Matter.Body.setAngle(this.cannon, angle);
    });

    // After Render — custom drawing
    Matter.Events.on(this.render, 'afterRender', () => {
      const ctx = this.render.context;
      if (!ctx || !this.cannon) return;

      const worldBodies = Matter.Composite.allBodies(this.world);
      this.pegs.forEach(peg => {
        if (worldBodies.includes(peg.body)) {
          peg.renderCustom(ctx);
        }
      });

      this.renderCannon(ctx);
      this.renderBalls(ctx);

      if (this.gameState === 'playing') {
        const activeBalls = worldBodies.filter(b => b.label === 'ball');
        if (activeBalls.length === 0) {
          this.renderTrajectory(ctx);
        }
      }

      this.renderScoreParticles(ctx);

      if (this.gameState !== 'playing') {
        this.renderGameOverlay(ctx);
      }
    });
  }

  private renderCannon(ctx: CanvasRenderingContext2D) {
    if (!this.cannon) return;
    ctx.save();
    ctx.translate(this.cannon.position.x, this.cannon.position.y);
    ctx.rotate(this.cannon.angle);
    
    if (this.cannonImg.complete && this.cannonImg.width > 0) {
      ctx.rotate(45 * Math.PI / 180);
      const w = CANNON_WIDTH + 10;
      const h = w * (this.cannonImg.height / this.cannonImg.width);
      ctx.drawImage(this.cannonImg, -CANNON_WIDTH / 2, -h / 2, w, h);
    } else {
      ctx.fillStyle = '#334155';
      ctx.fillRect(-CANNON_WIDTH / 2, -CANNON_HEIGHT / 2, CANNON_WIDTH, CANNON_HEIGHT);
    }
    ctx.restore();
  }

  private renderBalls(ctx: CanvasRenderingContext2D) {
    const balls = Matter.Composite.allBodies(this.world).filter(b => b.label === 'ball');
    balls.forEach(ball => {
      const { x: bx, y: by } = ball.position;
      const r = BALL_RADIUS;
      
      ctx.beginPath();
      ctx.arc(bx, by, r, 0, Math.PI * 2);
      
      const gradX = bx - r * 0.3; 
      const gradY = by - r * 0.7; 
      const grad = ctx.createRadialGradient(gradX, gradY, 1, bx, by, r);
      grad.addColorStop(0, 'white');
      grad.addColorStop(0.03, '#d1d5db');
      grad.addColorStop(0.6, '#374151');
      grad.addColorStop(1, '#9ca3af');
      
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#000000';
      ctx.stroke();
    });
  }

  private renderTrajectory(ctx: CanvasRenderingContext2D) {
    if (!this.cannon) return;

    const angle = this.cannon.angle;
    const cannonPos = { x: this.width / 2, y: 0 };
    
    const startX = cannonPos.x + Math.cos(angle) * CANNON_WIDTH;
    const startY = cannonPos.y + Math.sin(angle) * CANNON_WIDTH;
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.setLineDash([10, 10]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    
    let currX = startX;
    let currY = startY;
    let vx = Math.cos(angle) * BALL_SPEED;
    let vy = Math.sin(angle) * BALL_SPEED;
    
    const gravityY = this.engine.gravity.y * this.engine.gravity.scale * 277.77; 
    const frictionAir = 1 - 0.001; 
    
    const bodiesToCheck = Matter.Composite.allBodies(this.world).filter(b => b.label === 'peg');
    
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
        ctx.arc(currX, currY, BALL_RADIUS, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.stroke();
        ctx.beginPath(); 
        break; 
      }
    }
    
    ctx.stroke();
    ctx.setLineDash([]); 
  }

  private renderScoreParticles(ctx: CanvasRenderingContext2D) {
    this.scoreParticles.forEach(particle => {
      const progress = particle.age / particle.maxAge;
      const yOffset = progress * 40; 
      const alpha = progress > 0.6 ? 1 - ((progress - 0.6) / 0.4) : 1;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = `bold 16px ${HEADING_FONT}`;
      ctx.textAlign = 'center';

      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
      ctx.strokeText(particle.text, particle.x, particle.y - yOffset);

      ctx.fillStyle = particle.color;
      ctx.fillText(particle.text, particle.x, particle.y - yOffset);
      ctx.restore();
    });
  }


  private renderGameOverlay(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.textAlign = 'center';

    if (this.gameState === 'won') {
      ctx.font = `bold 42px ${HEADING_FONT}`;
      ctx.fillStyle = '#00f248';
      ctx.fillText('YOU WIN!', this.width / 2, this.height / 2 - 30);
    } else {
      ctx.font = `bold 42px ${HEADING_FONT}`;
      ctx.fillStyle = '#ff00ff';
      ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 30);
    }

    ctx.font = `bold 22px ${HEADING_FONT}`;
    ctx.fillStyle = 'white';
    ctx.fillText(`SCORE: ${this.score}`, this.width / 2, this.height / 2 + 20);
    
    ctx.font = `14px ${HEADING_FONT}`;
    ctx.fillStyle = '#9ca3af';
    ctx.fillText('CLICK TO RESTART', this.width / 2, this.height / 2 + 55);

    ctx.restore();
  }

  private checkGameEnd() {
    const pinkLeft = this.pegs.filter(p => p.isNeonPink && !p.isHit).length;

    if (pinkLeft === 0) {
      this.gameState = 'won';
      this.notifyStateChange();
      return;
    }

    const activeBalls = Matter.Composite.allBodies(this.world).filter(b => b.label === 'ball');
    if (this.ballsRemaining <= 0 && activeBalls.length === 0) {
      this.gameState = 'lost';
      this.notifyStateChange();
    }
  }

  public handleClick() {
    if (this.gameState === 'playing') {
      this.spawnBall();
    } else {
      this.resetGame();
    }
  }

  private removePeg(body: Matter.Body) {
    Matter.Composite.remove(this.world, body);
    this.pegs = this.pegs.filter(p => p.body !== body);
  }
}
