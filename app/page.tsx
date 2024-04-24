'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Inicio() {
  const [isVisible, setIsVisible] = useState(true)

  return (
    <main>
      <AnimatePresence mode='popLayout'>
        {isVisible && 
        <motion.div 
          initial={{
            rotate: '0deg',
            scale: 0,
            y: 0,
          }}
          animate={{
            rotate: '900deg',
            scale: 1,
            y: [0, 50, -50, 250, 0],
          }}
          exit={{
            rotate: '0deg',
            scale: 0,
            y: 0,
          }}
          transition={{
            duration: 5,
            ease: 'backInOut',
            times: [0, 0.2, 0.5, 0.85, 1],
          }}
          className='mt-24 m-auto h-32 w-32 bg-foreground'/>}
      </AnimatePresence>
      <motion.button layout onClick={() => setIsVisible((curr) => !curr)}>Teste</motion.button>
    </main>
  )
}
