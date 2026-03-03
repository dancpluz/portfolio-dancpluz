"use client";

import { m } from "motion/react";
import { useEffect, useState } from "react";
import { pageTransitionEvent } from "@/components/motion/events";

export default function Container({ children, divClassName='', mainClassName='' }: { children: React.ReactNode, divClassName?: string, mainClassName?: string }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const handleExit = (e: any) => {
      setIsExiting(true);
      setTimeout(() => {
        e.detail.resolve();
      }, 600);
    };

    pageTransitionEvent.addEventListener("exit", handleExit as EventListener);
    return () => {
      pageTransitionEvent.removeEventListener("exit", handleExit as EventListener);
    };
  }, []);

  return (
    <div className={`flex w-full flex-col min-h-svh pt-16 items-center ${divClassName}`}>
      <m.main 
        initial={{ opacity: 0, y: 100 }}
        animate={isExiting ? { opacity: 0, y: 100, z: 50, scale: 0.95, boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)' } : { opacity: 1, y: 0, z: 0, scale: 1, boxShadow: '0 0 0 0 rgba(255, 255, 255, 0)' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className={`perspective-1000 flex w-full min-h-[calc(100svh-4rem)] max-w-5xl flex-col gap-4 border border-b-0 border-foreground/20 p-10 origin-bottom ${mainClassName}`}
      >
        {children}
      </m.main>
    </div>
  );
}
