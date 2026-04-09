'use client';

import Loader from "@/components/ui/loader";
import { m } from "motion/react";
import { useTranslations } from "next-intl";

export default function Loading() {
  const t = useTranslations('common');

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      className="fixed inset-0 z-99999 flex flex-col items-center justify-center bg-background pointer-events-auto"
    >
      <m.div
         initial={{ scale: 0.9, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         transition={{ duration: 0.5 }}
         className="flex flex-col items-center"
      >
        <Loader />
        
        <m.p 
          className="mt-16 font-heading text-foreground/50 uppercase text-xs tracking-[0.25em]"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {t('loader')}
        </m.p>
      </m.div>
    </m.div>
  );
}
