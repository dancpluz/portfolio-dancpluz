'use client';

import { useState } from 'react';
import { m } from 'motion/react';
import Magnet from '@/components/extra/magnet';

export default function Hamburguer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Magnet padding={50} magnetStrength={2}>
      <button
        type='button'
        className='flex flex-col items-center justify-center rounded-full p-2 size-12 pointer-events-auto border-0 cursor-pointer will-change-transform'
        onClick={() => setIsOpen(!isOpen)}
        aria-label='Toggle menu'
        aria-pressed={isOpen}
      >
        <m.span
          className='block w-10 h-[2px] origin-center'
          style={{ backgroundColor: 'currentColor' }}
          animate={{
            translateY: isOpen ? 5 : 0,
            rotate: isOpen ? 45 : 0,
            width: isOpen ? 25 : 40,
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
        <m.span
          className='block w-10 h-[2px] origin-center mt-[8px]'
          style={{ backgroundColor: 'currentColor' }}
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
