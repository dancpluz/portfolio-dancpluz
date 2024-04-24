'use client'

import { motion, MotionConfig } from 'framer-motion';

export default function Projetos() {
  return (
    <main>
      <MotionConfig 
      transition={{
            duration: 1,
          }}>
        <motion.div
        whileHover={{
          scale: 2,
        }}
        whileTap={{
          scale: 0.95,
          rotate: '2.5deg',
        }}
          className='mt-24 m-auto h-32 w-32 bg-foreground' />
          <motion.div
          whileHover={{
          rotate: '50deg',
        }}
          className='mt-24 m-auto h-32 w-32 bg-foreground/40' />
      </MotionConfig>
    </main>
  )
}
