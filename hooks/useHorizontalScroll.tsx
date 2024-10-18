import { useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";

export default function useHorizontalScroll(initialDuration: number, width: number) {

  const [duration, setDuration] = useState(initialDuration);

  const xTranslation = useMotionValue(0);

  const [mustFinish, setMustFinish] = useState(false);

  useEffect(() => {
    let controls;
    let finalPosition = -width / 2 - 48;

    if (mustFinish) {
      controls = animate(xTranslation, [xTranslation.get(), finalPosition], {
        ease: 'linear',
        duration: duration * (1 - xTranslation.get() / finalPosition),
        onComplete: () => {
          setMustFinish(false)
        },
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
      });
    } else {
      controls = animate(xTranslation, [0, finalPosition], {
        ease: 'linear',
        duration: duration,
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
      });
    }


    return controls?.stop
  }, [xTranslation, width, duration, mustFinish])

  return {
    xTranslation,
    setDuration,
    setMustFinish,
  }
}