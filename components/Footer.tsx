import { motion, useCycle, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import useMeasure from "react-use-measure";

export default function Footer() {
  return (
    <>
        <div className='px-40 items-center ml-[100px] py-32 flex gap-16'>
          <div className='flex flex-col'>
            <p className='text-2xl font-extrabold'>VAMOS</p>
            <p className='text-2xl font-extrabold'>FAZER</p>
            <p className='text-2xl font-extrabold'>UM</p>
          </div>
          <RevealLinks />
          {/* <h1 className='text-center text-8xl font-extrabold'>PROJETO UI/UX</h1> */}
          {/* <h1 layout className='text-center text-8xl font-extrabold'>?</h1> */}
        </div>
        <div className='w-full bg-foreground py-1'>
          <p className='text-center font-regular text-background'>TODOS OS DIRETOS RESERVADOS DANIEL LUZ </p>
        </div>
    </>
  )
}

export const RevealLinks = () => {
  return (
    <motion.section layout className="gridplace-content-left gap-2 text-foreground">
      <FlipLinks />
    </motion.section>
  );
};

const DURATION = 0.25;
const STAGGER = 0.025;
const INTERVAL = 4;

export function FlipLinks() {
  const texts = ["Site", "vídeo", "curso", "Portfolio", "Ecommerce", "aplicativo"];

  const [animationState, cycleAnimationState] = useCycle(...texts.map((_, i) => i.toString()));

  useEffect(() => {
    const interval = setInterval(() => {
      cycleAnimationState();
    }, INTERVAL * 1000);

    // Clear interval when component unmounts
    return () => clearInterval(interval);
  }, [cycleAnimationState]);

  return (
    <motion.div
      animate={animationState}
      className="relative base overflow-hidden whitespace-nowrap text-8xl font-black uppercase"
      style={{
        lineHeight: 1,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div className='flex' layout>
          <motion.h1 className='w-auto text-transparent tracking-widest' layout>
            {texts[Number(animationState)]}
          </motion.h1>
          <motion.h1 className='w-auto text-foreground tracking-widest' layout>
            ?
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
          console.log(variant)
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