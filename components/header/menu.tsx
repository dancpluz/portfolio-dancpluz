'use client';

import { AnimatePresence, m } from 'motion/react';
import FlowingMenu, { type MenuItemData } from './flowing-menu';
import { useMenu } from '@/hooks/use-menu';

const demoItems: MenuItemData[] = [
  {
    link: '#',
    text: 'Início',
    image: 'https://picsum.photos/600/400?random=1',
  },
  {
    link: '#',
    text: 'Blog',
    image: 'https://picsum.photos/600/400?random=4',
  },
  {
    link: '#',
    text: 'Sobre',
    image: 'https://picsum.photos/600/400?random=2',
  },
  {
    link: '#',
    text: 'Projetos',
    image: 'https://picsum.photos/600/400?random=3',
  },
  {
    link: '#',
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
          className={`h-screen w-full fixed inset-0 bg-surface z-20 origin-top flex flex-col lg:flex-row`}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 1.2, ease: 'circInOut' }}
        >
          <div className='w-full lg:w-1/2 relative h-full border-r border-foreground'>
            <FlowingMenu items={demoItems} onItemClick={closeMenu} />
          </div>
          <div className='hidden lg:flex w-full lg:w-1/2 items-center justify-center text-9xl'>
            IMAGE
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
