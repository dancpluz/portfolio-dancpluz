'use client';

import { Moon, Sun } from 'lucide-react';
import { m } from 'motion/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';

    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      document.startViewTransition(() => {
        setTheme(newTheme);
      });
    } else {
      setTheme(newTheme);
    }
  };

  return (
    <m.button
      aria-label='Toggle Dark Mode'
      type='button'
      whileTap={{
        scale: 0.7,
        rotate: 360,
        transition: { duration: 0.2 },
      }}
      whileHover={{ scale: 1.2 }}
      onClick={toggleTheme}
    >
      {mounted && (theme === 'dark' || resolvedTheme === 'dark') ? (
        <Sun className='size-6 text-foreground' />
      ) : (
        <Moon className='size-6 text-foreground' />
      )}
    </m.button>
  );
}
