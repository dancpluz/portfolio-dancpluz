'use client'

import Image from 'next/image';
import { motion, MotionValue, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

type SectionProps = {
  scroll: MotionValue<number>,
  icon?: string,
  id: string,
}

export default function Header({ sections }: { sections: Record<string, SectionProps> }) {
  return (
    <nav className='sticky z-20 top-0 w-full flex flex-col gap-8 lg:flex-row justify-between py-6 px-8 lg:px-40 bg-background/30 backdrop-blur-sm items-center'>
      <Link href='#inicio'>
        <Image alt={'Logo Lumentosh'} src={'logo.svg'} className='w-[50px] lg:w-[70px] h-auto' height={40} width={66} />
      </Link>
      <div className='w-full px-4 xl:px-80'>
        <ul className='flex grow gap-10'>
          <Section section={sections.inicio} />
          <Section section={sections.projetos} />
          <Section section={sections.sobre} />
          <Section section={sections.habilidades} />
          <Section section={sections.contato} />
        </ul>
      </div>
      <div>
        {/* <Image alt={'Ícone câmera'} src={'camera.svg'} width={40} height={40} /> */}
      </div>
    </nav>
  )
}

export function Section({ section: { scroll, icon, id } }: { section: SectionProps }) {


  let percent = ["0%", "100%"];

  const scale = useTransform(scroll, [0, 1], percent)
  const textOpacity = useTransform(scroll, [0, 0.1, 0.4, 0.5], [0, 1, 1, 0])
  const iconOpacity = useTransform(scroll, [0.1, 0], [1, 0.7])
  
  const [hovered, setHovered] = useState(false)

  return (
    <li className={`flex relative w-full items-center`}>
      {icon &&
        <Link onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className={`-left-8 absolute transition-opacity rounded-full`} href={'#' + id}>
          <motion.p style={{ opacity: hovered ? 1 : textOpacity  }} className='absolute font-normal transition-opacity left-1/2 transform -translate-x-1/2 bottom-7 text-xs'>
            {id.toUpperCase()}
          </motion.p>
          <motion.div style={{ opacity: hovered ? 1 : iconOpacity }}>
            <Image priority className={'transition-opacity'} alt={'Ícone ' + id} src={icon} height={24} width={24} />
          </motion.div>
        </Link>
      }
      <div className='absolute w-full h-0.5 bg-alternate flex-1' />
      <motion.div style={{ width: scale }} className='relative z-10 w-3 h-0.5 bg-foreground' >
        {/* <div style={{ width: scrollYProgress.get() < 1 ? '0' : '' }} className='rounded-full -right-2 top-1/2 transform -translate-y-1/2 bg-foreground absolute w-2 h-2' /> */}
      </motion.div>
    </li>
  )
}