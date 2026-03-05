'use client';

import { IconsResponse } from '@/types/pocketbase';
import { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface MenuContextType {
  isOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  openMenu: () => void;
  contacts: IconsResponse[];
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children, contacts }: Readonly<{ children: ReactNode, contacts: IconsResponse[] }>) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);
  const openMenu = () => setIsOpen(true);

  return (
    <MenuContext.Provider value={useMemo(() => ({ isOpen, toggleMenu, closeMenu, openMenu, contacts }), [isOpen, toggleMenu, closeMenu, openMenu, contacts])}>
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
