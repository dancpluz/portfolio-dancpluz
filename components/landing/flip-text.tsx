"use client";

import { useMemo } from "react";
import { m, type Variants } from "motion/react";
import { stagger } from "motion";
import TransitionLink from '../transition-link';

export default function FlipText({
  text,
  href,
  className = "",
  duration = 0.5,
  staggerDelay = 0.05,
}: Readonly<{
  text: string;
  href?: string;
  className?: string;
  duration?: number;
  staggerDelay?: number;
}>) {
  const { parentContainerVariants, topLetterVariants, bottomLetterVariants } =
    useMemo(() => {
      const parentContainerVariants: Variants = {
        initial: {
          transition: { delayChildren: stagger(staggerDelay) },
        },
        hovered: {
          transition: { delayChildren: stagger(staggerDelay) },
        },
      };

      const topLetterVariants: Variants = {
        initial: {
          y: 0,
          transition: { duration, ease: "easeInOut" },
        },
        hovered: {
          y: "-100%",
          transition: { duration, ease: "easeInOut" },
        },
      };

      const bottomLetterVariants: Variants = {
        initial: {
          y: "100%",
          transition: { duration, ease: "easeInOut" },
        },
        hovered: {
          y: 0,
          transition: { duration, ease: "easeInOut" },
        },
      };

      return { parentContainerVariants, topLetterVariants, bottomLetterVariants };
    }, [duration, staggerDelay]);

  const Component = href ? TransitionLink : m.div;

  return (
    <Component
      initial="initial"
      whileHover="hovered"
      href={href}
      className={`relative block whitespace-nowrap text-4xl font-black uppercase sm:text-7xl md:text-8xl lg:text-9xl ${className}`}
      style={{
        lineHeight: 1.2,
        clipPath: "inset(0)",
      }}
    >
      <m.div variants={parentContainerVariants}>
        {text.split("").map((l, i) => (
          <m.span
            variants={topLetterVariants}
            className="inline-block"
            key={`top-${l}-${i}`}
          >
            {l === " " ? "\u00A0" : l}
          </m.span>
        ))}
      </m.div>
      <m.div
        className="absolute inset-0"
        variants={parentContainerVariants}
      >
        {text.split("").map((l, i) => (
          <m.span
            variants={bottomLetterVariants}
            className="inline-block"
            key={`bottom-${l}-${i}`}
          >
            {l === " " ? "\u00A0" : l}
          </m.span>
        ))}
      </m.div>
    </Component>
  );
}
