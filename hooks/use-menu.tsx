'use client';

import { MenuItemData } from '@/components/header/flowing-nav';
import { IconsResponse } from '@/types/pocketbase';
import { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface MenuContextType {
  isOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  openMenu: () => void;
  contacts: IconsResponse[];
  imageHovering: MenuItemData['image'];
  setImageHovering: (image: MenuItemData['image']) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children, contacts }: Readonly<{ children: ReactNode, contacts: IconsResponse[] }>) {
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
      contacts,
      imageHovering,
      setImageHovering
    }), [isOpen, toggleMenu, closeMenu, openMenu, contacts, imageHovering, setImageHovering])}>
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
