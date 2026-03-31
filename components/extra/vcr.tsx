'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface VCREffectProps {
  children?: ReactNode;
  className?: string;
}

export default function VCREffect({
  children,
  className = '',
}: Readonly<VCREffectProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const snowCanvasRef = useRef<HTMLCanvasElement>(null);
  const vcrCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const snowCtx = snowCanvasRef.current?.getContext('2d', { alpha: true });
    const vcrCtx = vcrCanvasRef.current?.getContext('2d', { alpha: true });

    const offscreenSnowCanvas = document.createElement('canvas');
    const offscreenSnowCtx = offscreenSnowCanvas.getContext('2d', { alpha: true });

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Variáveis para o Tracking (Linhas do VCR)
    let trackingY1 = 0;
    let trackingY2 = 0;

    const resizeCanvases = () => {
      if (
        !containerRef.current ||
        !snowCanvasRef.current ||
        !vcrCanvasRef.current
      )
        return;

      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      // O Snow é renderizado pela metade da resolução para criar o efeito pixel e melhorar perf.
      const w2 = width / 2;
      const h2 = height / 2;
      snowCanvasRef.current.width = w2;
      snowCanvasRef.current.height = h2;

      vcrCanvasRef.current.width = width;
      vcrCanvasRef.current.height = height;

      // Gera o buffer de estática 'Snow' UMA VEZ num offscreen canvas (2x o tamanho visual)
      if (offscreenSnowCtx) {
        const ow = w2 * 2;
        const oh = h2 * 2;
        offscreenSnowCanvas.width = ow;
        offscreenSnowCanvas.height = oh;
        const oData = offscreenSnowCtx.createImageData(ow, oh);
        const oBuf = new Uint32Array(oData.data.buffer);
        for (let i = 0; i < oBuf.length; i++) {
          oBuf[i] = (Math.trunc(255 * Math.random())) << 24;
        }
        offscreenSnowCtx.putImageData(oData, 0, 0);
      }

      trackingY2 = height; // Inicia a segunda linha de ruído no final da tela
    };

    // Observador para redimensionar dinamicamente caso a tela mude
    const observer = new ResizeObserver(resizeCanvases);
    if (containerRef.current) observer.observe(containerRef.current);

    // Função ultra-rápida para o ruído estático (Panning em vez de recalcular pixels)
    const renderSnow = () => {
      if (!snowCtx || offscreenSnowCanvas.width === 0) return;
      const w2 = width / 2;
      const h2 = height / 2;
      
      // Desenha o offscreen canvas com um deslocamento (offset) aleatório 
      // usando Aceleração de Hardware do drawImage, evitando gargalo de CPU
      const dx = -(Math.random() * w2);
      const dy = -(Math.random() * h2);
      
      snowCtx.clearRect(0, 0, w2, h2);
      snowCtx.drawImage(offscreenSnowCanvas, dx, dy);
    };

    // Ruído de rastreamento (aquelas linhas brancas distorcidas horizontais)
    const renderVCR = () => {
      if (!vcrCtx) return;
      vcrCtx.clearRect(0, 0, width, height);
      vcrCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';

      trackingY1 = (trackingY1 + 3) % height;
      trackingY2 = trackingY2 - 3;
      if (trackingY2 < 0) trackingY2 = height;

      vcrCtx.beginPath();
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * width;
        const radius = Math.random() * 2 + 1;

        // Renderiza blocos nas zonas de tracking
        const y1 = trackingY1 + (Math.random() * 30 - 15);
        const y2 = trackingY2 + (Math.random() * 30 - 15);

        vcrCtx.fillRect(x, y1, radius, radius);
        vcrCtx.fillRect(x, y2, radius, radius);

        // Cauda do glitch (Tail)
        const renderTail = (tx: number, ty: number, tr: number) => {
          const tailLen = Math.floor(Math.random() * 30);
          const dir = Math.random() > 0.5 ? 1 : -1;
          for (let j = 0; j < tailLen; j++) {
            tx += (Math.random() * 4 + 1) * dir;
            tr = Math.max(0, tr - 0.1);
            vcrCtx.fillRect(tx, ty, tr, tr);
          }
        };

        renderTail(x, y1, radius);
        renderTail(x, y2, radius);
      }
      vcrCtx.closePath();
    };

    let lastTime = performance.now();
    const fps = 24;
    const interval = 1000 / fps;

    const loop = (time: number) => {
      animationFrameId = requestAnimationFrame(loop);

      const delta = time - lastTime;
      if (delta >= interval) {
        lastTime = time - (delta % interval);
        renderSnow();
        renderVCR();
      }
    };

    // Inicializa
    resizeCanvases();
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-surface ${className}`}
    >
      {/* Container Principal que sofre o Glitch e o Wobble */}
      <div className='relative w-full h-full vcr-wobble-y'>
        <div className='relative w-full h-full vcr-wobble-x vcr-glitch'>
          {/* 1. Conteúdo Base (Filtros do Tailwind para parecer velha) */}
          <div className='absolute inset-0 w-full h-full blur-[1.2px] contrast-125 saturate-50 sepia-[.20] opacity-90 mix-blend-screen overflow-hidden'>
            {children}
          </div>

          {/* 2. Estática (Snow) */}
          <canvas
            ref={snowCanvasRef}
            className='absolute inset-0 w-full h-full opacity-20 pointer-events-none mix-blend-screen'
          />

          {/* 3. Linhas de Rastreamento (VCR Noise) */}
          <canvas
            ref={vcrCanvasRef}
            className='absolute inset-0 w-full h-full opacity-60 blur-[1px] pointer-events-none mix-blend-screen'
          />

          {/* 4. Scanlines de CRT */}
          <div className='vcr-scanlines absolute inset-0 pointer-events-none z-40' />

          {/* 5. Vinheta (Sombra das bordas de tubo) */}
          <div className='absolute inset-0 pointer-events-none z-50 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.8)_120%)] mix-blend-multiply' />
        </div>
      </div>
    </div>
  );
}
