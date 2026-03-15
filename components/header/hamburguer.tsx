'use client';

import { m } from 'motion/react';
import Magnet from '@/components/extra/magnet';
import { useMenu } from '@/hooks/use-menu';
import { useHotkeys } from 'react-hotkeys-hook';

export default function Hamburguer() {
  const { isOpen, toggleMenu, closeMenu } = useMenu();

  useHotkeys('esc', () => closeMenu(), { enabled: isOpen }, [
    isOpen,
    closeMenu,
  ]);

  return (
    <Magnet padding={50} magnetStrength={2} className='z-50'>
      <button
        type='button'
        className={`flex flex-col items-center justify-center pixel-corners-small p-2 size-14 pointer-events-auto border-0 cursor-pointer will-change-transform transition-colors duration-1000 delay-300 ${isOpen ? 'bg-background' : ''}`}
        onClick={toggleMenu}
        aria-label='Toggle menu'
        aria-pressed={isOpen}
      >
        <m.span
          className='block w-10 h-[2px] origin-center bg-foreground'
          animate={{
            translateY: isOpen ? 5 : 0,
            rotate: isOpen ? 45 : 0,
            width: isOpen ? 25 : 40,
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
        <m.span
          className='block w-10 h-[2px] origin-center mt-[8px] bg-foreground'
          animate={{
            translateY: isOpen ? -5 : 0,
            rotate: isOpen ? -45 : 0,
            width: isOpen ? 25 : 40,
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </button>
    </Magnet>
  );
}
