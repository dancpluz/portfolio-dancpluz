import { useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";
import useMeasure from "react-use-measure";

export default function useVerticalScroll(initialDuration: number, height: number) {

  const [duration, setDuration] = useState(initialDuration);

  const yTranslation = useMotionValue(0);

  const [mustFinish, setMustFinish] = useState(false);

  useEffect(() => {
    let controls;
    let finalPosition = -height / 2 - 24;

    if (mustFinish) {
      controls = animate(yTranslation, [finalPosition, yTranslation.get()], {
        ease: 'linear',
        duration: duration * (yTranslation.get() / finalPosition),
        onComplete: () => {
          setMustFinish(false)
        },
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
      });
    } else {
      controls = animate(yTranslation, [finalPosition, 0], {
        ease: 'linear',
        duration: duration,
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
      });
    }


    return controls?.stop
  }, [yTranslation, height, duration, mustFinish])

  return {
    yTranslation,
    setDuration,
    setMustFinish,
  }
}