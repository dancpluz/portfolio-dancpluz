'use client'

import Image from "next/image";
import { useState } from "react";
import RevealWords from "@/components/RevealWords";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

export default function Home() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className='min-h-screen relative'>
      <div className={`absolute top-0 left-0 w-full transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className='absolute w-full top-[calc(50%-85px)] left-[50%]'>
          <RevealWords interval={6} words={["UI/UX", "Design","ecommerce", "aplicativo"]} />
        </div>
        <div className='absolute w-full top-1/2 left-[50%]'>
          <RevealWords interval={2} invert words={["UI/UX", "Design", "ecommerce", "aplicativo"]} />
        </div>
        <Image
          priority
          unoptimized
          alt='Forma 3D Diamante Girando'
          src='/diamond.webp'
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 900px"
          style={{
            width: '100%',
            height: 'auto',
            maxWidth: '900px',
            maxHeight: '900px',
          }}
          width={900}
          height={900}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      {!imageLoaded && 
        <Skeleton className='w-full h-full' containerClassName='absolute top-16 left-0 size-[900px]' />
      }
    </div>
  )
}