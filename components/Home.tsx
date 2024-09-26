'use client'

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className='min-h-screen relative'>
      <div
        className={`absolute top-12 left-0 w-full transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
      >
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
      {!imageLoaded && (
        <div className="absolute top-12 left-0 w-full max-w-[900px] aspect-square flex items-center justify-center ">
          <Image alt='Carregando' className='animate-spin' src='/loader.svg' width={48} height={48} />
        </div>
      )}
    </div>
  )
}