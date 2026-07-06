'use client';

import { Social } from '@/types/api';
import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';

export type HoverMedia = {
  src: string;
  isVideo: boolean;
};

interface MenuContextType {
  isOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  openMenu: () => void;
  socials: Social[];
  hoverMedia: HoverMedia;
  setHoverMedia: (media: HoverMedia) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({
  children,
  socials,
}: Readonly<{ children: ReactNode; socials: Social[] }>) {
  const [isOpen, setIsOpen] = useState<MenuContextType['isOpen']>(false);
  const [hoverMedia, setHoverMedia] = useState<MenuContextType['hoverMedia']>({ src: '/video/universe.webm', isVideo: true });

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);
  const openMenu = useCallback(() => setIsOpen(true), []);

  return (
    <MenuContext.Provider value={useMemo(() => ({
      isOpen,
      toggleMenu,
      closeMenu,
      openMenu,
      socials,
      hoverMedia,
      setHoverMedia
    }), [isOpen, toggleMenu, closeMenu, openMenu, socials, hoverMedia, setHoverMedia])}>
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
