// VCR tape-age / tracking effect rendered in a Web Worker via OffscreenCanvas
export type { VCRMessage };

function getRandomInt(min: number, max: number): number {
  return (
    Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) +
    Math.ceil(min)
  );
}

interface VCRInitMessage {
  type: 'init';
  canvas: OffscreenCanvas;
  width: number;
  height: number;
  blur: number;
  tracking: number;
  tapeAge: number;
}

interface VCRResizeMessage {
  type: 'resize';
  width: number;
  height: number;
}

interface VCRUpdateMessage {
  type: 'update';
  blur: number;
  tracking: number;
  tapeAge: number;
}

interface VCRStopMessage {
  type: 'stop';
}

type VCRMessage = VCRInitMessage | VCRResizeMessage | VCRUpdateMessage | VCRStopMessage;

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let rafId: number = 0;
let cW = 0;
let cH = 0;
let blur = 1;
let tracking = 220;
let tapeAge = 60;

function renderTail(
  ctx: OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
) {
  const n = getRandomInt(1, 50);
  const dir = Math.random() < 0.5 ? 1 : -1;
  for (let i = 0; i < n; i++) {
    const r = Math.max(0, radius - 0.1 * i);
    const dx = getRandomInt(1, 4) * dir;
    x += dx;
    ctx.fillRect(x, y, r, r);
  }
  ctx.fill();
}

function startAnimation() {
  if (!canvas || !ctx) return;

  let lastTime = 0;
  const fps = 16;
  const interval = 1000 / fps;

  const draw = (time: number) => {
    rafId = requestAnimationFrame(draw);

    const delta = time - lastTime;
    if (delta < interval) return;
    lastTime = time - (delta % interval);

    if (!canvas || !ctx || cW === 0 || cH === 0) return;

    // Note: canvas.style is not available in OffscreenCanvas,
    // blur filter is applied via CSS on the host <canvas> element instead.
    ctx.clearRect(0, 0, cW, cH);
    ctx.fillStyle = '#fff';

    ctx.beginPath();
    for (let i = 0; i <= tapeAge; i++) {
      const x = Math.random() * cW;
      const y1 = getRandomInt(Math.min(tracking + i * 3, cH), cH);
      const y2 = getRandomInt(0, Math.max(cH - tracking - i * 3, 0));
      ctx.fillRect(x, y1, 2, 2);
      ctx.fillRect(x, y2, 2, 2);
      ctx.fill();
      renderTail(ctx, x, y1, 2);
      renderTail(ctx, x, y2, 2);
    }
    ctx.closePath();
  };

  rafId = requestAnimationFrame(draw);
}

globalThis.onmessage = (e: MessageEvent<VCRMessage>) => {
  const msg = e.data;

  switch (msg.type) {
    case 'init': {
      canvas = msg.canvas;
      ctx = canvas.getContext('2d');
      cW = Math.max(1, msg.width);
      cH = Math.max(1, msg.height);
      canvas.width = cW;
      canvas.height = cH;
      blur = msg.blur;
      tracking = msg.tracking;
      tapeAge = msg.tapeAge;
      startAnimation();
      break;
    }
    case 'resize': {
      cW = Math.max(1, msg.width);
      cH = Math.max(1, msg.height);
      if (canvas) {
        canvas.width = cW;
        canvas.height = cH;
      }
      break;
    }
    case 'update': {
      blur = msg.blur;
      tracking = msg.tracking;
      tapeAge = msg.tapeAge;
      break;
    }
    case 'stop': {
      cancelAnimationFrame(rafId);
      canvas = null;
      ctx = null;
      break;
    }
  }
};
