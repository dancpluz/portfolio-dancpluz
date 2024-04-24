'use client'

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function Contato() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <>
      <main className='bg-foreground w-full h-[150vh]'>
        
      </main>
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className='mt-24 m-auto h-80 w-full bg-foreground'
      />
      <div 
        ref={ref}
        className={`transition-colors w-full h-screen ${isInView ? 'bg-red-900' : 'bg-foreground'}`}
      />
    </>
  )
}
