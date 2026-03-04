'use client';

import { useMenu } from '@/hooks/use-menu';
import Link from 'next/link';
import Image from 'next/image';
import { buildImageUrl } from '@/lib/api';
import { useTheme } from 'next-themes';
import { m } from 'motion/react';
import { Reveal } from '../motion/reveal';
import { useState, useEffect } from 'react';

const MotionImage = m.create(Image);

export default function Socials() {
  const { contacts, isOpen } = useMenu();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const delay = isOpen ? 1 : 0.3;

  return (
    <div className='px-6 py-4 border-t border-foreground text-foreground flex flex-col items-center justify-center h-full'>
      <ul className='w-full flex items-center justify-between gap-2 h-full flex'>
        {contacts.map((contact) => (
          <m.li
            key={contact.id}
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.2, type: 'spring', stiffness: 100 }}
            whileTap={{ scale: 0.9 }}
          >
            <Link
              href={contact.link}
              target='_blank'
              className='flex items-center justify-center gap-2'
            >
              <MotionImage
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -180 }}
                transition={{
                  delay: delay - 0.4,
                  duration: 0.4,
                  type: 'spring',
                  stiffness: 60,
                }}
                width={24}
                height={24}
                src={buildImageUrl(contact, contact.icon)}
                style={{
                  filter: mounted && theme === 'dark' ? '' : 'invert(1)',
                }}
                alt={contact.alt}
              />
              <Reveal
                delay={delay}
                duration={0.6}
                direction='up'
                exit={{ opacity: 0, y: 40 }}
              >
                <p className='underline-magical'>{contact.text}</p>
              </Reveal>
            </Link>
          </m.li>
        ))}
      </ul>
      <div className='w-full flex items-center justify-center'>
        <Reveal
          delay={delay + 0.6}
          duration={1}
          direction='up'
          exit={{ opacity: 0, y: 40 }}
        >
          <p className='text-sm align-bottom w-full text-center'>
            Todos os direitos reservados Daniel Luz &copy;{' '}
            {new Date().getFullYear()}
          </p>
        </Reveal>
      </div>
    </div>
  );
}
