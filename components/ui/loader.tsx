"use client";

import { m } from "motion/react"; 
import { useTranslations } from "next-intl";

export default function Loader() {
  const t = useTranslations('common');

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="flex flex-col items-center gap-2 text-center"
    >
      <m.div
        className="size-8 border-4 border-foreground/20 border-t-accent rounded-full animate-spin"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: [0, 0.71, 0.2, 1.01]}}
      />
      <p className="text-foreground text-sm font-semibold animate-pulse uppercase loading-dots">
        {t('loader').replace('...', '')}
      </p>
    </m.div>
  );
}