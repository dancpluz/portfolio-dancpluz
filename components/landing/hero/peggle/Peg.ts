import Matter from 'matter-js';
import { GameObject } from './GameObject';
import { PEG_COLORS, PEG_SCORES, CIRCLE_PEG_RADIUS, RECT_PEG_WIDTH, RECT_PEG_HEIGHT } from './constants';

export class Peg extends GameObject {
  public isHit: boolean = false;
  public baseColor: string;
  public isRectRow: boolean;
  public scoreValue: number;

  constructor(x: number, y: number, isRectRow: boolean) {
    const rand = Math.random();
    let color = PEG_COLORS.electricGreen;
    if (rand > 0.85) color = PEG_COLORS.neonPink;
    else if (rand > 0.7) color = PEG_COLORS.cyanBlue;

    let body: Matter.Body;

    const pegOptions = {
      isStatic: true,
      restitution: 0.6,
      render: { visible: false },
      label: 'peg',
    };

    if (isRectRow) {
      body = Matter.Bodies.rectangle(x, y, RECT_PEG_WIDTH, RECT_PEG_HEIGHT, {
        ...pegOptions,
        chamfer: { radius: 0 }, 
      });
    } else {
      body = Matter.Bodies.circle(x, y, CIRCLE_PEG_RADIUS, pegOptions);
    }

    super(body);
    this.baseColor = color;
    this.isRectRow = isRectRow;
    this.scoreValue = PEG_SCORES[color] ?? 100;
    
    (this.body.plugin as Record<string, unknown>).gameObject = this;
  }

  public markHit(): number {
    if (this.isHit) return 0;
    this.isHit = true;
    return this.scoreValue;
  }

  public get isNeonPink(): boolean {
    return this.baseColor === PEG_COLORS.neonPink;
  }

  public renderCustom(ctx: CanvasRenderingContext2D) {
    const accent = this.baseColor;
    
    let cLight = 'white';
    let cDark = accent; 
    let cFill = 'rgb(223, 223, 223)'; 
    
    if (this.isHit) {
      cLight = accent; 
      cDark = 'white'; 
      cFill = accent;  
    }

    if (this.isRectRow) {
      const bounds = this.body.bounds;
      const w = bounds.max.x - bounds.min.x;
      const h = bounds.max.y - bounds.min.y;
      const x = bounds.min.x;
      const y = bounds.min.y;

      ctx.fillStyle = 'black';
      ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
      
      ctx.fillStyle = cDark;
      ctx.fillRect(x, y, w, h);
      
      ctx.fillStyle = cLight;
      ctx.beginPath();
      ctx.moveTo(x, y + h); 
      ctx.lineTo(x, y); 
      ctx.lineTo(x + w, y);
      ctx.lineTo(x + w - 3, y + 3);
      ctx.lineTo(x + 3, y + 3);
      ctx.lineTo(x + 3, y + h - 3);
      ctx.fill();
      
      ctx.fillStyle = cFill;
      ctx.fillRect(x + 3, y + 3, w - 6, h - 6);

    } else {
      const r = CIRCLE_PEG_RADIUS;
      const x = this.body.position.x;
      const y = this.body.position.y;

      ctx.beginPath();
      ctx.arc(x, y, r + 2, 0, Math.PI * 2);
      ctx.fillStyle = 'black';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = cDark;
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(x, y, r, Math.PI, 1.5 * Math.PI);
      ctx.lineTo(x, y);
      ctx.fillStyle = cLight;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, r - 3, 0, Math.PI * 2);
      ctx.fillStyle = cFill;
      ctx.fill();
    }
  }
}
