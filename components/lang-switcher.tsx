'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { Globe } from '@/components/ui/svg';

export default function LanguageSwitcher() {
  const router = useRouter();
  const [locale, setLocale] = useState<'en' | 'pt'>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const match = new RegExp(/(^| )locale=([^;]+)/).exec(document.cookie);
    if (match) {
      setLocale(match[2] as 'en' | 'pt');
    } else {
      const browserLang = navigator.language.startsWith('pt') ? 'pt' : 'en';
      setLocale(browserLang);
    }
    setMounted(true);
  }, []);

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'pt' : 'en';
    setLocale(newLocale);

    document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    router.refresh();
  };

  if (!mounted) return null;

  return (
    <m.button
      onClick={toggleLocale}
      className='group flex items-center gap-2 px-2 py-1 focus:outline-none'
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label='Toggle language'
    >
      <div className='relative overflow-hidden'>
        <Globe className='size-5 text-foreground transition-colors group-hover:text-accent-1' />
      </div>

      <div className='flex flex-col h-4 overflow-hidden relative items-center'>
        <AnimatePresence mode='wait' initial={false}>
          <m.span
            key={locale}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className='font-heading font-black text-base uppercase leading-tight tracking-widest text-foreground'
          >
            {locale}
          </m.span>
        </AnimatePresence>
      </div>
    </m.button>
  );
}
