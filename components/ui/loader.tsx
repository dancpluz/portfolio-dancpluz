'use client';

import { m } from 'motion/react';

const pulse = (delay = 0, duration = 1.2) => ({
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8] },
  transition: {
    duration,
    delay,
    ease: 'easeInOut' as const,
    repeat: Infinity,
    repeatDelay: 0.2,
  },
});

const glow = (from: string, to: string, delay = 0, duration = 1.4) => ({
  initial: { fill: from },
  animate: { fill: [from, to, from] },
  transition: {
    duration,
    delay,
    ease: 'easeInOut' as const,
    repeat: Infinity,
  },
});

export default function Loader() {
  return (
    <m.svg
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 16 16'
      className='h-20 w-20'
      animate={{ y: [0, -8, 0], scale: 1 }}
      initial={{ scale: 0 }}
      transition={{
        y: { duration: 2, ease: 'easeInOut', repeat: Infinity },
        scale: { duration: 0.5, delay: 0.3, type: 'spring' },
      }}
    >
      <g id='Background'>
        <path
          fill='#FFFFFF'
          d='M14,5h-1v2v2h-1v1h-1v1H9v1H8H7v1H5v1H3V2h8V1h-1H9H8H7H6H5H4H3H2v1v1v1v1v1v1v1v1v1v1v1v1v1v1h1v1h6v-1h1h1h1
    h1h1v-1v-1v-1v-1v-1h1V7h-1V5z M13,12v1v1h-1h-1h-1v-1h1h1v-1v-1h1V12z'
        />
        <polygon fill='#FFFFFF' points='13,2 12,2 12,4 14,4 14,3 13,3' />
      </g>

      <g id='TopRightGrey'>
        <polygon
          fill='#878787'
          points='13,1 13,2 12,2 12,4 11,4 11,0 12,0 12,1'
        />
        <rect x='13' y='2' fill='#878787' width='1' height='1' />
        <rect x='14' y='3' fill='#878787' width='1' height='1' />
      </g>

      <polygon fill='#000000' points='15,4 15,7 14,7 14,5 11,5 11,4' />
      <polygon
        fill='#000000'
        points='10,0 9,0 8,0 7,0 6,0 5,0 4,0 3,0 2,0 1,0 1,1 1,2 1,3 1,4 1,5 1,6 1,7 1,8 1,9 1,10 1,11 1,12
  1,13 1,14 1,15 1,16 2,16 3,16 3,15 2,15 2,14 2,13 2,12 2,11 2,10 2,9 2,8 2,7 2,6 2,5 2,4 2,3 2,2 2,1 3,1 4,1 5,1 6,1 7,1 8,1
  9,1 10,1 11,1 11,0'
      />
      <polygon
        fill='#000000'
        points='14,10 14,11 14,12 14,13 14,14 14,15 13,15 12,15 11,15 10,15 9,15 9,16 10,16 11,16 12,16
  13,16 14,16 15,16 15,15 15,14 15,13 15,12 15,11 15,10'
      />

      <path
        fill='#BCBCC3'
        d='M11,5V2H3v12h2v-1H4V8h1v1h1v1h1v1h1v1h1V7h4V5H11z M8,6v1H6V6H5V4h1V3h2v1h1v2H8z'
      />
      <polygon
        fill='#BCBCC3'
        points='12,11 12,12 12,13 11,13 10,13 10,14 11,14 12,14 13,14 13,13 13,12 13,11'
      />

      {/* ── Animated color elements ── */}

      {/* Green Neon — fastest, first pulse */}
      <m.rect
        x='6'
        y='4'
        width='1'
        height='1'
        shapeRendering='crispEdges'
        {...glow('#005010', '#00F248', 0, 1)}
      />

      {/* Green polygon */}
      <m.polygon
        points='8,3 8,6 5,6 5,4 6,4 6,5 7,5 7,4 6,4 6,3'
        {...glow('#003010', '#00891E', 0.1, 1.2)}
      />

      {/* Bottom Green rects */}
      <m.g {...pulse(0.15, 1.2)} style={{ fill: '#205030' }}>
        <rect x='8' y='4' width='1' height='2' />
        <rect x='6' y='6' width='2' height='1' />
      </m.g>

      {/* Blue Cyan — second wave */}
      <m.rect
        x='10'
        y='8'
        width='1'
        height='1'
        shapeRendering='crispEdges'
        {...glow('#003844', '#00FBFE', 0.35, 1.1)}
      />

      {/* Blue right */}
      <m.rect
        x='12'
        y='7'
        width='1'
        height='2'
        {...glow('#001530', '#0064FB', 0.4, 1.2)}
      />

      {/* Blue polygon */}
      <m.polygon
        points='12,7 12,9 11,9 11,8 10,8 10,9 11,9 11,10 9,10 9,7'
        {...glow('#001030', '#0064FB', 0.4, 1.2)}
      />

      {/* Dark Blue */}
      <m.rect
        x='11'
        y='9'
        width='1'
        height='1'
        shapeRendering='crispEdges'
        {...glow('#000820', '#003293', 0.45, 1.1)}
      />

      {/* Blue Bottom */}
      <m.rect
        x='9'
        y='10'
        width='2'
        height='1'
        {...glow('#001030', '#0064FB', 0.5, 1.2)}
      />

      {/* Magenta — third wave */}
      <m.polygon
        points='7,11 7,12 4,12 4,9 5,9 5,10 6,10 6,11'
        {...glow('#2a0025', '#F73AE1', 0.6, 1.2)}
      />

      <m.rect
        x='4'
        y='12'
        width='3'
        height='1'
        {...glow('#1a0018', '#F73AE1', 0.65, 1.2)}
      />

      {/* Red diagonal — fourth wave */}
      <m.g {...glow('#3a0800', '#FF3900', 0.75, 1.1)}>
        <rect x='4' y='8' width='1' height='1' />
        <rect x='5' y='9' width='1' height='1' />
        <rect x='6' y='10' width='1' height='1' />
        <rect x='7' y='11' width='1' height='1' />
      </m.g>
    </m.svg>
  );
}
