// Snow effect rendered entirely in a Web Worker via OffscreenCanvas
export {};

interface SnowInitMessage {
  type: 'init';
  canvas: OffscreenCanvas;
  width: number;
  height: number;
}

interface SnowResizeMessage {
  type: 'resize';
  width: number;
  height: number;
}

interface SnowStopMessage {
  type: 'stop';
}

type SnowMessage = SnowInitMessage | SnowResizeMessage | SnowStopMessage;

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let noiseCanvas: OffscreenCanvas | null = null;
let rafId: number = 0;
let canvasW = 0;
let canvasH = 0;

function generateNoise(w: number, h: number): OffscreenCanvas {
  const offscreenW = w * 2;
  const offscreenH = h * 2;
  const oc = new OffscreenCanvas(offscreenW, offscreenH);
  const octx = oc.getContext('2d', { alpha: true });
  if (!octx) return oc;

  const d = octx.createImageData(offscreenW, offscreenH);
  const b = new Uint32Array(d.data.buffer);
  for (let i = 0; i < b.length; i++) {
    b[i] = Math.trunc(255 * Math.random()) << 24;
  }
  octx.putImageData(d, 0, 0);
  return oc;
}

function startAnimation() {
  if (!canvas || !ctx) return;

  let lastTime = 0;
  const fps = 24;
  const interval = 1000 / fps;

  const draw = (time: number) => {
    rafId = requestAnimationFrame(draw);

    const delta = time - lastTime;
    if (delta < interval) return;
    lastTime = time - (delta % interval);

    if (!noiseCanvas || !canvas || !ctx || canvasW === 0 || canvasH === 0) return;

    const dx = -(Math.random() * canvasW);
    const dy = -(Math.random() * canvasH);

    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.drawImage(noiseCanvas, dx, dy);
  };

  rafId = requestAnimationFrame(draw);
}

function handleResize(w: number, h: number) {
  canvasW = Math.max(1, Math.floor(w / 2));
  canvasH = Math.max(1, Math.floor(h / 2));

  if (canvas) {
    canvas.width = canvasW;
    canvas.height = canvasH;
  }

  noiseCanvas = generateNoise(canvasW, canvasH);
}

self.onmessage = (e: MessageEvent<SnowMessage>) => {
  const msg = e.data;

  switch (msg.type) {
    case 'init': {
      canvas = msg.canvas;
      ctx = canvas.getContext('2d', { alpha: true });
      handleResize(msg.width, msg.height);
      startAnimation();
      break;
    }
    case 'resize': {
      handleResize(msg.width, msg.height);
      break;
    }
    case 'stop': {
      cancelAnimationFrame(rafId);
      canvas = null;
      ctx = null;
      noiseCanvas = null;
      break;
    }
  }
};
