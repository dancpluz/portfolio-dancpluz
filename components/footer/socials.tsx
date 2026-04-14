'use client';

import { useMenu } from '@/hooks/use-menu';
import Link from 'next/link';
import { m } from 'motion/react';
import { Reveal } from '../motion/reveal';
import MotionImage from '../motion/motion-image';

export default function FooterSocials() {
  const { socials } = useMenu();

  return (
    <ul className='flex flex-wrap gap-4'>
      {socials.map((social) => (
        <m.li
          key={social.id}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2, type: 'spring', stiffness: 100 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href={social.url}
            target='_blank'
            className='flex items-center justify-center gap-2'
          >
            <MotionImage
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
              transition={{
                duration: 0.4,
                type: 'spring',
                stiffness: 60,
              }}
              width={20}
              height={20}
              src={social.iconUrl}
              className='theme-invert-0'
              alt={social.iconAlt}
            />
            <Reveal
              duration={0.6}
              direction='up'
              exit={{ opacity: 0, y: 40 }}
            >
              <p className='underline-magical font-heading text-sm tracking-wider'>
                {social.text}
              </p>
            </Reveal>
          </Link>
        </m.li>
      ))}
    </ul>
  );
}
