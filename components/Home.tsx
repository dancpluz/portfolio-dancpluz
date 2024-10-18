'use client'

import Image from "next/image";
import { useState } from "react";
import RevealWords from "@/components/RevealWords";

export default function Home() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className='min-h-screen relative'>
      <div className={`absolute top-12 left-0 w-full transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className='absolute w-full top-1/2 left-[50%]'>
          <RevealWords words={["site", "vídeo", "portfolio", "ecommerce", "aplicativo"]} />
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
      {!imageLoaded && (
        <div className="absolute top-12 left-0 w-full max-w-[900px] aspect-square flex items-center justify-center ">
          <Image alt='Carregando' className='animate-spin' src='/loader.svg' width={48} height={48} />
        </div>
      )}
    </div>
  )
}