'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const [locale, setLocale] = useState<'en' | 'pt'>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(/(^| )locale=([^;]+)/);
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

  if (!mounted) {
    return (
      <button className="relative w-[4.5rem] h-8 rounded-full bg-foreground/10 p-1 flex items-center shrink-0 cursor-default opacity-50" />
    );
  }

  return (
    <button
      onClick={toggleLocale}
      className="relative w-[4.5rem] h-8 rounded-full bg-foreground/10 p-1 flex items-center shrink-0 cursor-pointer overflow-hidden transition-colors hover:bg-foreground/15"
      aria-label="Toggle language"
    >
      <div 
        className="absolute left-1 top-1 w-[2rem] h-6 bg-background rounded-full shadow-sm transition-transform duration-300 ease-in-out"
        style={{ transform: locale === 'pt' ? 'translateX(0)' : 'translateX(100%)' }}
      />
      <div className="relative z-10 flex w-full justify-between items-center px-2 text-xs font-bold tracking-widest text-foreground">
        <span className={`transition-opacity duration-300 ${locale === 'pt' ? 'opacity-100' : 'opacity-50'}`}>PT</span>
        <span className={`transition-opacity duration-300 ${locale === 'en' ? 'opacity-100' : 'opacity-50'}`}>EN</span>
      </div>
    </button>
  );
}
