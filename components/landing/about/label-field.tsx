'use client';

import { m, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ABOUT_LABELS } from '@/lib/constant';

// A tuple range [min, max]; every balloon samples a random value within it.
type Range = [number, number];

export interface LabelFieldConfig {
  /** Pool of labels to draw from — rendered between quotes. */
  labels?: string[];
  /** How many labels float at once. */
  count?: number;
  /** Peak opacity a balloon reaches (kept low, ambient). */
  opacity?: Range;
  /** Resting scale while it holds before popping. */
  scale?: Range;
  /** Full appear → hold → pop cycle length, in seconds. */
  duration?: Range;
  /** Idle gap before a slot respawns a new label, in seconds. */
  gap?: Range;
  /** Upward drift while rising, in px (balloons float up). */
  drift?: Range;
  /** Spread of the initial spawn so the field never pops in unison. */
  spawnSpread?: number;
  /** Tailwind text-size classes to pick from. */
  sizeClasses?: string[];
  /** CSS color values cycled across labels. */
  colors?: string[];
  /** Font class for the labels (quotes are always kept). */
  fontClassName?: string;
  /** Draw a faint expanding ring on the pop. */
  showBurst?: boolean;
  className?: string;
}

type ResolvedConfig = Required<LabelFieldConfig>;

const DEFAULTS: ResolvedConfig = {
  labels: ABOUT_LABELS,
  count: 6, // Spaced out count
  opacity: [0.15, 0.35],
  scale: [0.85, 1.15],
  duration: [3.4, 6.2], // Restored slow duration
  gap: [0.4, 2.6],
  drift: [16, 64],
  spawnSpread: 4,
  sizeClasses: ['text-2xl', 'text-3xl', 'text-4xl', 'text-5xl'],
  colors: [
    'var(--color-neon-pink)',
    'var(--color-electric-green)',
    'var(--color-cyan-blue)',
    'var(--color-foreground)',
  ],
  fontClassName: 'font-heading font-bold',
  showBurst: false, // Keep burst circle disabled
  className: '',
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

let idCounter = 0;
const nextId = () => `label-${idCounter++}`;

interface Seed {
  id: string;
  label: string;
  xPct: number;
  yPct: number;
  size: string;
  color: string;
  opacity: number;
  scale: number;
  duration: number;
  drift: number;
  rotate: number;
  delay: number;
}

function pickUniqueLabel(labels: string[], activeSet: Set<string>): string {
  const available = labels.filter((l) => !activeSet.has(l));
  if (available.length > 0) {
    return pick(available);
  }
  return pick(labels);
}

function makeSeed(cfg: ResolvedConfig, initial: boolean, activeSet?: Set<string>): Seed {
  const label = activeSet ? pickUniqueLabel(cfg.labels, activeSet) : pick(cfg.labels);
  if (activeSet) {
    activeSet.add(label);
  }

  // Zoned spawn positions to avoid the center area of the photo and folders
  const zone = pick([1, 2, 3]); // 1: Left, 2: Right, 3: Center Top/Bottom
  let xPct = 50;
  let yPct = 50;

  if (zone === 1) {
    // Left column
    xPct = rand(5, 30);
    yPct = rand(15, 95);
  } else if (zone === 2) {
    // Right column
    xPct = rand(70, 95);
    yPct = rand(15, 95);
  } else {
    // Center column (strictly top or bottom only, avoiding [25%, 80%] vertical span)
    xPct = rand(30, 70);
    const isTop = Math.random() < 0.5;
    yPct = isTop ? rand(15, 25) : rand(80, 95);
  }

  return {
    id: nextId(),
    label,
    xPct,
    yPct,
    size: pick(cfg.sizeClasses),
    color: pick(cfg.colors),
    opacity: rand(cfg.opacity[0], cfg.opacity[1]),
    scale: rand(cfg.scale[0], cfg.scale[1]),
    duration: rand(cfg.duration[0], cfg.duration[1]),
    drift: rand(cfg.drift[0], cfg.drift[1]),
    rotate: rand(-6, 6),
    delay: initial ? rand(0, cfg.spawnSpread) : 0,
  };
}

function LabelBalloon({
  config,
  activeSet,
}: Readonly<{
  config: ResolvedConfig;
  activeSet: Set<string>;
}>) {
  const [seed, setSeed] = useState<Seed>(() => makeSeed(config, true, activeSet));
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const respawn = useCallback(() => {
    activeSet.delete(seed.label);
    const wait = rand(config.gap[0], config.gap[1]) * 1000;
    timer.current = setTimeout(() => {
      setSeed(makeSeed(config, false, activeSet));
    }, wait);
  }, [config, seed.label, activeSet]);

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
      activeSet.delete(seed.label);
    };
  }, [seed.label, activeSet]);

  return (
    <m.div
      key={seed.id}
      className='absolute -translate-x-1/2 -translate-y-1/2'
      style={{ left: `${seed.xPct}%`, top: `${seed.yPct}%` }}
    >
      <m.span
        className={cn(
          'block whitespace-nowrap tracking-tight select-none',
          config.fontClassName,
          seed.size,
        )}
        style={{ color: seed.color, rotate: seed.rotate }}
        initial={{ opacity: 0, scale: 0.3, y: 0 }}
        animate={{
          opacity: [0, seed.opacity, seed.opacity, 0],
          scale: [0.3, seed.scale, seed.scale * 1.04, seed.scale * 1.32],
          y: [0, -seed.drift * 0.5, -seed.drift, -seed.drift * 1.25],
        }}
        transition={{
          duration: seed.duration,
          delay: seed.delay,
          times: [0, 0.22, 0.8, 1],
          ease: 'easeInOut',
        }}
        onAnimationComplete={respawn}
      >
        &quot;{seed.label}&quot;
      </m.span>
    </m.div>
  );
}

export default function LabelField(props: Readonly<LabelFieldConfig>) {
  const reduce = useReducedMotion();

  // Seeds are randomized, so the field is client-only to avoid an SSR
  // hydration mismatch. It is purely decorative (aria-hidden).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const config = useMemo<ResolvedConfig>(
    () => ({ ...DEFAULTS, ...props }),
    [props],
  );

  const activeLabelsRef = useRef<Set<string>>(new Set());

  const slots = useMemo(
    () => Array.from({ length: config.count }, (_, i) => i),
    [config.count],
  );

  // Reduced motion: render a quiet, static scatter — no looping, no pop.
  const staticSeeds = useMemo(
    () => (reduce ? slots.map(() => makeSeed(config, false)) : []),
    [reduce, slots, config],
  );

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 overflow-visible',
        config.className,
      )}
    >
      {!mounted
        ? null
        : reduce
        ? staticSeeds.map((seed) => (
            <span
              key={seed.id}
              className={cn(
                'absolute block -translate-x-1/2 -translate-y-1/2 whitespace-nowrap',
                config.fontClassName,
                seed.size,
              )}
              style={{
                left: `${seed.xPct}%`,
                top: `${seed.yPct}%`,
                color: seed.color,
                opacity: seed.opacity,
                rotate: `${seed.rotate}deg`,
              }}
            >
              &quot;{seed.label}&quot;
            </span>
          ))
        : slots.map((i) => (
            <LabelBalloon key={i} config={config} activeSet={activeLabelsRef.current} />
          ))}
    </div>
  );
}
