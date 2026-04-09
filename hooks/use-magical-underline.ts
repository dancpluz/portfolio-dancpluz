'use client';

import { useEffect } from 'react';
import { clientLogger } from '@/lib/logger';

export function useMagicalUnderline() {
  useEffect(() => {
    let lastColor = '';

    const applyEventHandlers = () => {
      document
        .querySelectorAll('.underline-magical, .underline-magical-2')
        .forEach((el) => {
          // Initialize color if not set
          if (!(el as HTMLElement).style.getPropertyValue('--magical-accent')) {
            const colors = [
              'var(--color-accent-1)',
              'var(--color-accent-2)',
              'var(--color-accent-3)',
            ];

            let randomColor;
            do {
              randomColor = colors[Math.floor(Math.random() * colors.length)];
            } while (randomColor === lastColor);

            lastColor = randomColor;

            (el as HTMLElement).style.setProperty(
              '--magical-accent',
              randomColor,
            );
          }
        });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const el = target.closest(
        '.underline-magical, .underline-magical-2',
      ) as HTMLElement;
      if (el) {
        const currentColor = el.style.getPropertyValue('--magical-accent');
        const colors = [
          'var(--color-accent-1)',
          'var(--color-accent-2)',
          'var(--color-accent-3)',
        ];

        let randomColor;
        do {
          randomColor = colors[Math.floor(Math.random() * colors.length)];
        } while (randomColor === currentColor);

        clientLogger.debug('Magical underline applied {randomColor}', { 
          randomColor,
        });

        el.style.setProperty('--magical-accent', randomColor);
      }
    };

    let observer: MutationObserver;

    // Delay initialization slightly to ensure React hydration has fully completed
    const initTimer = setTimeout(() => {
      applyEventHandlers();

      observer = new MutationObserver(applyEventHandlers);
      observer.observe(document.body, { childList: true, subtree: true });
    }, 150);

    // Event delegation dynamically handles any current or newly generated elements without direct iteration mapping!
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      clearTimeout(initTimer);
      if (observer) observer.disconnect();
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);
}
