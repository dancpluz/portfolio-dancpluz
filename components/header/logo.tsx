'use client';

import Image from 'next/image';
import { m } from 'motion/react';
import Magnet from '../extra/magnet';
import TransitionLink from '../transition-link';
import { useMenu } from '@/hooks/use-menu';
import { useSectionScroll } from '@/hooks/use-section-scroll';
import { ROUTES } from '@/lib/constant';

export default function Logo() {
  const { closeMenu } = useMenu();
  const handleScroll = useSectionScroll();
  const onClickHandler = handleScroll(ROUTES.landing.path, closeMenu);

  return (
    <Magnet padding={50} magnetStrength={2}>
      <m.div
        whileTap={{ scale: 0.85 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <TransitionLink href={ROUTES.landing.path} onClick={onClickHandler}>
          <Image
            priority
            src='/img/logo.svg'
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
