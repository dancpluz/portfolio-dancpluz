'use client';

import Image from 'next/image';
import { m } from 'motion/react';
import Magnet from '../extra/magnet';
import TransitionLink from '../transition-link';

export default function Logo() {
  return (
    <Magnet padding={50} magnetStrength={2}>
      <m.div
        whileTap={{ scale: 0.85 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <TransitionLink href='/'>
          <Image
            priority
            src='/logo.svg'
            alt='Logo'
            width={80}
            height={80}
            className='size-12 hover:brightness-120 transition-all duration-600 block'
          />
        </TransitionLink>
      </m.div>
    </Magnet>
  );
}
