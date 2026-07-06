'use client';

import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import { useClickOutside } from '@/hooks/use-click-outside';
import { Polaroid } from '@/types/api';
import { useLocale } from 'next-intl';
import { useAutoFitText } from '@/hooks/use-auto-fit-text';
import CanvasImage, { type ImageEffect } from '@/components/extra/canvas-image';

const POLAROID_EFFECTS: ImageEffect[] = [
  {
    type: 'pixelate',
    enabled: true,
    params: { size: 6, maintainAspect: true },
  },
  {
    type: 'posterize',
    enabled: true,
    params: { levels: 12, preserveHue: false },
  },
  {
    type: 'vibrance',
    enabled: true,
    params: { vibrance: 0.35, saturation: 0.15 },
  },
  { type: 'exposure', enabled: true, params: { exposure: 0, contrast: 0.1 } },
];

interface FolderProps {
  color?: string;
  size?: number;
  items?: React.ReactNode[];
  polaroids?: Polaroid[];
  className?: string;
}

const paperIds = ['paper-0', 'paper-1', 'paper-2'];

const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = Number.parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return (
    '#' +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
};

const getOpenTransform = (index: number, total: number) => {
  if (total === 1) {
    if (index === 0) return 'translate(-50%, -90%) rotate(0deg)';
  }
  if (total === 2) {
    if (index === 0) return 'translate(-110%, -80%) rotate(-10deg)';
    if (index === 1) return 'translate(10%, -80%) rotate(10deg)';
  }
  if (index === 0) return 'translate(-120%, -70%) rotate(-15deg)';
  if (index === 1) return 'translate(10%, -70%) rotate(15deg)';
  if (index === 2) return 'translate(-50%, -100%) rotate(5deg)';
  return '';
};

const AutoFitText = memo(function AutoFitText({
  text,
  maxWidth,
  maxHeight,
}: {
  text: string;
  maxWidth: number;
  maxHeight: number;
}) {
  const fontSize = useAutoFitText({
    text,
    maxWidth,
    maxHeight,
    baseSize: 32,
    minSize: 10,
    lineHeightMultiplier: 1.3,
    fontFamily: '"Permanent Marker", cursive',
  });

  return (
    <span
      className='font-marker text-black text-center px-1 wrap-break-word w-full block'
      style={{ fontSize: `${fontSize}px`, lineHeight: 1.3 }}
    >
      {text}
    </span>
  );
});

interface PaperItemProps {
  item: React.ReactNode;
  text?: string;
  index: number;
  total: number;
  open: boolean;
  paperColor: string;
  zoomedIndex: number | null;
  onZoom: (index: number) => void;
  onClickFolder: () => void;
}

const PaperItem = memo(function PaperItem({
  item,
  text,
  index,
  total,
  open,
  paperColor,
  zoomedIndex,
  onZoom,
  onClickFolder,
}: PaperItemProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!open) {
      setOffset({ x: 0, y: 0 });
    }
  }, [open]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!open) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const offsetX = (e.clientX - centerX) * 0.15;
      const offsetY = (e.clientY - centerY) * 0.15;
      setOffset({ x: offsetX, y: offsetY });
    },
    [open],
  );

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (open) {
        onZoom(index);
      } else {
        onClickFolder();
      }
    },
    [open, index, onZoom, onClickFolder],
  );

  const transformStyle = open
    ? `${getOpenTransform(index, total)} translate(${offset.x}px, ${offset.y}px)`
    : undefined;

  return (
    <button
      type='button'
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`absolute z-20 bottom-[10%] left-1/2 transition-all duration-300 ease-in-out focus:outline-none border-0 p-[4px] flex flex-col ${
        open
          ? 'hover:scale-110 hover:z-40 cursor-pointer shadow-md'
          : 'transform -translate-x-1/2 translate-y-[10%] group-hover:translate-y-0 shadow-sm'
      } aspect-4/5 w-[60px]`}
      style={{
        ...(open ? { transform: transformStyle } : {}),
        backgroundColor: paperColor,
        opacity: zoomedIndex === index ? 0 : 1,
        pointerEvents: zoomedIndex === index ? 'none' : 'auto',
      }}
    >
      <div className='w-full aspect-square bg-black overflow-hidden relative flex items-center justify-center shrink-0 shadow-inner'>
        {item}
      </div>
      {text && (
        <div className='flex-1 flex items-center justify-center overflow-hidden mt-1 px-[2px]'>
          <span className='font-marker text-[6px] text-black leading-tight line-clamp-1 wrap-break-word overflow-hidden text-ellipsis'>
            {text}
          </span>
        </div>
      )}
    </button>
  );
});

export default function Folder({
  color = '#5227FF',
  size = 1,
  items = [],
  polaroids = [],
  className = '',
}: Readonly<FolderProps>) {
  const locale = useLocale();
  const maxItems = 3;
  const papers = useMemo(() => {
    let arr: { node: React.ReactNode; text?: string }[] = [];
    if (polaroids.length > 0) {
      arr = polaroids.map((p) => ({
        node: (
          <CanvasImage
            key={p.id}
            src={p.photoUrl}
            alt={locale === 'en' ? (p.textEn || 'polaroid') : (p.textPt || 'polaroid')}
            effects={POLAROID_EFFECTS}
          />
        ),
        text: locale === 'en' ? p.textEn : p.textPt,
      }));
    } else {
      arr = items.map((item) => ({ node: item }));
    }
    const finalArr = arr.slice(0, maxItems);
    return finalArr;
  }, [items, polaroids, locale]);

  const [open, setOpen] = useState(false);
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(
    containerRef,
    () => {
      setOpen(false);
    },
    open && zoomedIndex === null,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const { folderBackColor, paperColors, folderStyle } = useMemo(() => {
    const backColor = darkenColor(color, 0.08);
    const pColors = [
      darkenColor('#ffffff', 0.1),
      darkenColor('#ffffff', 0.05),
      '#ffffff',
    ];
    return {
      folderBackColor: backColor,
      paperColors: pColors,
      folderStyle: {
        '--folder-color': color,
        '--folder-back-color': backColor,
        '--paper-1': pColors[0],
        '--paper-2': pColors[1],
        '--paper-3': pColors[2],
      } as React.CSSProperties,
    };
  }, [color]);

  const scaleStyle = useMemo(() => ({ transform: `scale(${size})` }), [size]);

  const handleClick = useCallback(() => {
    if (zoomedIndex !== null) return;
    setOpen((prev) => !prev);
  }, [zoomedIndex]);

  return (
    <div ref={containerRef} style={scaleStyle} className={className}>
      <div
        className={`group relative transition-all duration-200 ease-in text-left ${
          open ? '' : 'hover:-translate-y-2'
        }`}
        style={{
          ...folderStyle,
          transform: open ? 'translateY(-8px)' : undefined,
        }}
      >
        <div
          className='relative w-[100px] h-[80px] rounded-tl-0 rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px]'
          style={{ backgroundColor: folderBackColor }}
        >
          <span
            className='absolute z-0 bottom-[98%] left-0 w-[30px] h-[10px] rounded-tl-[5px] rounded-tr-[5px] rounded-bl-0 rounded-br-0'
            style={{ backgroundColor: folderBackColor }}
          ></span>
          {papers.map((paper, i) => (
            <PaperItem
              key={paperIds[i]}
              item={paper.node}
              text={paper.text}
              index={i}
              total={papers.length}
              open={open}
              paperColor={paperColors[i]}
              zoomedIndex={zoomedIndex}
              onZoom={setZoomedIndex}
              onClickFolder={handleClick}
            />
          ))}
          <div
            className={`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out ${
              open ? '' : 'group-hover:transform-[skew(15deg)_scaleY(0.6)]'
            }`}
            style={{
              backgroundColor: color,
              borderRadius: '5px 10px 10px 10px',
              ...(open && { transform: 'skew(15deg) scaleY(0.6)' }),
            }}
          ></div>
          <div
            className={`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out ${
              open ? '' : 'group-hover:transform-[skew(-15deg)_scaleY(0.6)]'
            }`}
            style={{
              backgroundColor: color,
              borderRadius: '5px 10px 10px 10px',
              ...(open && { transform: 'skew(-15deg) scaleY(0.6)' }),
            }}
          ></div>
        </div>

        {/* Folder Toggle Button (overlay covering the folder area) */}
        <button
          type='button'
          aria-label={open ? 'Close folder' : 'Open folder'}
          className='absolute inset-0 w-full h-full bg-transparent border-0 cursor-pointer focus:outline-none'
          style={{
            zIndex: open ? 10 : 40,
          }}
          onClick={handleClick}
        />
      </div>
      {mounted &&
        zoomedIndex !== null &&
        createPortal(
          <button
            type='button'
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.stopPropagation();
                setZoomedIndex(null);
              }
            }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md cursor-zoom-out animate-in fade-in duration-300 w-full h-full border-none m-0 p-0 focus:outline-none'
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                e.stopPropagation();
                setZoomedIndex(null);
              }
            }}
          >
            <div
              className='p-[16px] shadow-2xl flex flex-col transition-transform scale-100 hover:scale-[1.02] max-h-[95vh] overflow-y-auto scrollbar-hide text-left cursor-default'
              style={{
                width: '328px',
                minHeight: '400px',
                height: 'auto',
                backgroundColor: paperColors[zoomedIndex],
              }}
            >
              <div className='w-full aspect-square bg-black overflow-hidden relative flex items-center justify-center shrink-0 shadow-inner'>
                {papers[zoomedIndex].node}
              </div>
              {papers[zoomedIndex].text && (
                <div className='flex-1 flex flex-col items-center justify-center mt-3 pb-2 w-full'>
                  <AutoFitText
                    text={papers[zoomedIndex].text}
                    maxWidth={296}
                    maxHeight={50}
                  />
                </div>
              )}
            </div>
          </button>,
          document.body,
        )}
    </div>
  );
}
