'use client'

import { useEffect, useRef } from "react";

export default function Início() {
  const wordRef = useRef<HTMLInputElement>(null);

  let interval: NodeJS.Timeout | null = null;
  const sleep = (ms: number) => {
    return new Promise<void>((resolve) => {
      interval = setTimeout(resolve, ms);
    });
  };

  useEffect(() => {
    const words = ["branding&", "test&", "design&"];
    const el = wordRef.current;
    
    let sleepTime = 200;
    let curWordIndex = 0;

    const writeLoop = async () => {
      while (true) {
        let curWord = words[curWordIndex];

        for (let i = 0; i < curWord.length; i++) {
          if (el) el.innerText = curWord.substring(0, i + 1);
          await sleep(sleepTime);
        }

        await sleep(sleepTime * 20);

        for (let i = curWord.length; i > 0; i--) {
          if (el) el.innerText = curWord.substring(0, i - 1);
          await sleep(sleepTime / 2);
        }

        await sleep(sleepTime * 5);
      }
    };

    writeLoop();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <main className='h-[200vh]'>
      <div className='absolute'>
        <h1 ref={wordRef} className='[font-size:_clamp(100px,16vw,350px)] inline-block tracking-tighter leading-none'/>
        <div className='absolute ml-10 h-full w-5 bg-foreground inline-block animate-perspective' />
      </div>
    </main>
  )
}
