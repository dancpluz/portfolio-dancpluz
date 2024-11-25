'use client'

import Image from "next/image";
import { useState } from "react";
import RevealWords from "@/components/RevealWords";
import MySkeleton from "./MySkeleton";

export default function Home() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className='relative'>
      <div className={`mt-48 w-full transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className='absolute w-full left-8 -top-7 md:top-[calc(50%-85px)] md:left-[50%]'>
          <RevealWords interval={6} words={["UI/UX", "Design","ecommerce", "aplicativo"]} />
        </div>
        <div className='absolute w-full left-8 -top-16 md:top-[calc(50%)] md:left-[50%]'>
          <RevealWords interval={2} invert words={["UI/UX", "Design", "ecommerce", "aplicativo"]} />
        </div>
        <Image
          priority
          unoptimized
          alt='Forma 3D Diamante Girando'
          src='/diamond.webp'
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 900px"
          className='w-full h-auto max-w-[500px] md:max-w-[900px] md:max-h-[900px]'
          width={900}
          height={900}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      {!imageLoaded && 
        <MySkeleton className='w-full h-full' containerClassName='absolute top-16 left-0 size-[900px]' />
      }
    </div>
  )
}