'use client';

import { AnimatePresence, m } from 'motion/react';
import FlowingNav, { type MenuItemData } from './flowing-nav';
import { useMenu } from '@/hooks/use-menu';
import Socials from './socials';

const demoItems: MenuItemData[] = [
  {
    link: '/',
    text: 'Início',
    image: 'https://picsum.photos/600/400?random=1',
  },
  {
    link: '/blog',
    text: 'Blog',
    image: 'https://picsum.photos/600/400?random=4',
  },
  {
    link: '#about',
    text: 'Sobre',
    image: 'https://picsum.photos/600/400?random=2',
  },
  {
    link: '#projects',
    text: 'Projetos',
    image: 'https://picsum.photos/600/400?random=3',
  },
  {
    link: '#contact',
    text: 'Contato',
    image: 'https://picsum.photos/600/400?random=4',
  },
];

export default function Nav() {
  const { isOpen, closeMenu } = useMenu();

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          className={`h-screen w-full fixed inset-0 bg-surface z-30 origin-top flex flex-col lg:flex-row`}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 1.2, ease: 'circInOut' }}
        >
          <div className='w-full lg:w-1/2 relative border-r border-foreground pt-26'>
            <div className='w-full h-4/5'>
              <FlowingNav items={demoItems} onItemClick={closeMenu} />
            </div>
            <div className='w-full h-1/5'>
              <Socials />
            </div>
          </div>
          <div className='hidden lg:flex w-full lg:w-1/2 items-center justify-center text-9xl'>
            IMAGE
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
