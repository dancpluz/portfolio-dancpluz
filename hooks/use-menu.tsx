'use client';

import { Social } from '@/types/api';
import { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface MenuContextType {
  isOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  openMenu: () => void;
  socials: Social[];
  imageHovering: string;
  setImageHovering: (image: string) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({
  children,
  socials,
}: Readonly<{ children: ReactNode; socials: Social[] }>) {
  const [isOpen, setIsOpen] = useState<MenuContextType['isOpen']>(false);
  const [imageHovering, setImageHovering] = useState<MenuContextType['imageHovering']>('https://picsum.photos/600/400?random=1'); // TODO: Change Later

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);
  const openMenu = () => setIsOpen(true);

  return (
    <MenuContext.Provider value={useMemo(() => ({
      isOpen,
      toggleMenu,
      closeMenu,
      openMenu,
      socials,
      imageHovering,
      setImageHovering
    }), [isOpen, toggleMenu, closeMenu, openMenu, socials, imageHovering, setImageHovering])}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
