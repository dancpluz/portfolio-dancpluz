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

    // Touch devices never fire `mouseover` — cycle the accents on an interval
    // so the underlines still feel alive instead of frozen on one color.
    const isTouch = globalThis.matchMedia?.(
      '(hover: none), (pointer: coarse)',
    ).matches;
    let cycleTimer: ReturnType<typeof setInterval> | undefined;
    if (isTouch) {
      const colors = [
        'var(--color-accent-1)',
        'var(--color-accent-2)',
        'var(--color-accent-3)',
      ];
      cycleTimer = setInterval(() => {
        document
          .querySelectorAll('.underline-magical, .underline-magical-2')
          .forEach((el) => {
            const current = (el as HTMLElement).style.getPropertyValue(
              '--magical-accent',
            );
            let next;
            do {
              next = colors[Math.floor(Math.random() * colors.length)];
            } while (next === current);
            (el as HTMLElement).style.setProperty('--magical-accent', next);
          });
      }, 2500);
    }

    return () => {
      clearTimeout(initTimer);
      if (cycleTimer) clearInterval(cycleTimer);
      if (observer) observer.disconnect();
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);
}
