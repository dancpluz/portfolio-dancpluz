'use client'

import Image from 'next/image';
import useScrollProgress from '@/hooks/useScrollProgress';
import Link from 'next/link';
import { useState } from 'react';

export default function Header({ sections }: { sections: React.RefObject<HTMLDivElement>[] }) {

  return (
    <nav className='sticky z-10 top-0 w-screen flex justify-between py-6 px-40 bg-background/30 backdrop-blur-sm items-center'>
      <Link href='#inicio'>
        <Image alt={'Logo Lumentosh'} src={'logo.svg'} height={40} width={66} />
      </Link>
      <div className='w-full px-80'>
        <ul className='flex gap-1'>
          <Section section={sections.inicio} />
          <Section section={sections.projetos} />
          <Section section={sections.sobre} />
          <Section section={sections.habilidades} />
          <Section section={sections.contato} />
        </ul>
      </div>
      <div>
        <Image alt={'Ícone câmera'} src={'camera.svg'} width={40} height={40} />
      </div>
    </nav>
  )
}

export function Section({ section }) {
  const { ref, icon, id } = section; 
  const progress = useScrollProgress(ref);
  const [hovered, setHovered] = useState(false)

  return (
    <li className={`flex relative w-full items-center pl-8 gap-1 ${progress === 0 ? 'pl-[27px]' : ''}`}>
      {icon &&
        <Link className={`left-0 absolute transition-opacity rounded-full`} href={'#' + id}>
          <p style={{ opacity: hovered || progress > 0 && progress <= 20 ? 1 : 0 }} className='absolute transition-opacity left-1/2 transform -translate-x-1/2 bottom-7 text-xs'>
            {id.toUpperCase()}
          </p>
          <Image className={'transition-opacity'} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ opacity: progress > 0 ? 1 : 0.6 }} alt={'Ícone ' + id} src={icon} height={24} width={24} />
        </Link>
      }
      <div style={{ width: `${progress}%` }} className='h-0.5 bg-foreground w-full' /> {/* Progress bar */}
      {progress != 100 && progress != 0 && <div className='w-2 h-2 rounded-full bg-foreground' />} {/* Progress dot */}

      <div className='h-0.5 bg-alternate flex-1' /> {/* Background bar */}
    </li>
  )
}