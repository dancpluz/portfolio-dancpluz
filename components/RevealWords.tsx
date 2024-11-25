import { motion, useCycle, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function RevealWords({ words, question, invert, interval }: { words: string[], question?: boolean, invert?: boolean, interval: number }) {
  const texts = words.sort((a, b) => a.length - b.length);
  const DURATION = 0.45;
  const STAGGER = 0.025;
  const INTERVAL = interval;

  const [animationState, cycleAnimationState] = useCycle(...texts.map((_, i) => i.toString()));

  useEffect(() => {
    const interval = setInterval(() => {
      cycleAnimationState();
    }, INTERVAL * 1000);

    return () => clearInterval(interval);
  }, [cycleAnimationState]);

  return (
    <motion.div
      animate={animationState}
      className={`relative base overflow-hidden whitespace-nowrap text-8xl font-black uppercase ${invert ? 'text-background text-stroke' : ''}`}
      style={{
        lineHeight: 0.75,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div className='flex' layout>
          <motion.h1 className={`text-transparent tracking-widest ${invert ? 'no-text-stroke' : ''}`} layout>
            {texts[Number(animationState)]}
          </motion.h1>
          <motion.h1 className='w-auto text-foreground' layout>
            {question ? '?' : ''}
          </motion.h1>
        </motion.div>
      </AnimatePresence>
      <div>
        {texts.map((text,index) => {
          const nextIndex = (index + 1) % texts.length
          const prevIndex = (index - 1 + texts.length) % texts.length;

          const variant = texts.reduce((acc, _, i) => {
            if (i === index) return { ...acc, [i]: { y: 0, opacity: 1 } }
            else if (i === prevIndex) return { ...acc, [i]: { y: "100%", opacity: 0 } }
            else if (i === nextIndex) return { ...acc, [i]: { y: "-100%", opacity: 0 } }
            else return { ...acc, [i]: { y: "-100%", opacity: 0 } }
          }, {});
        return (
          <div key={text} className='absolute inset-0'>
            {text.split("").map((l, i) => (
              <motion.span
                key={i}
                variants={variant}
                transition={{
                  duration: DURATION,
                  ease: "easeInOut",
                  delay: STAGGER * i,
                }}
                className="inline-block"
              >
                {l}
              </motion.span>
              )   
            )}
          </div>
        )}
      )}
      </div>
    </motion.div>
  );
};