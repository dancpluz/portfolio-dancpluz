'use client'

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

type Props = {
  title: string;
  slug: string;
  counter?: number;
}

export default function Header() {
  const currentPage = usePathname().split('/')[1];
  const [visibility, setVisibility] = useState('start');
  const { scrollY } = useScroll();
  // const btnRef = useRef(null);
  // const spanRef = useRef(null);

  // useEffect(() => {
  //   const handleMouseMove = (e) => {
      
  //     const {width} = e.target.getBoundingClientRect();
  //     const offset = e.offsetX;
      
  //     const left = `${(offset / width) * 100}%`;

  //     spanRef.current.animate({left}, {duration: 250, fill: "forwards"});
      
  //     // if (e.currentTarget != e.target) return;
      
  //   }

  //   btnRef.current.addEventListener('mousemove', handleMouseMove);
  //   return () => {
  //     btnRef.current.removeEventListener('mousemove', handleMouseMove);
  //   }
  // }, [])

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();

    if (previous !== undefined) {
      if (latest > previous && latest > 150) {
        setVisibility('hidden');
      } else {
        setVisibility('visible');
        if (latest < 100) {
          setVisibility('start')
        }
      }
    }
  });

  function NavItem({ title, slug, counter }: Props) {
    const active = slug == '/' + currentPage;

    return (
      <Link href={slug}>
        <li className={`flex items-center gap-1 px-5 py-2 text-xl rounded-full ${active ? 'bg-foreground text-background' : 'text-tertiary'}`}>
          {counter && (
            <>
              <div className={`relative text-center text-sm rounded-full w-5 h-5 font-semibold ${active ? 'bg-secondary text-foreground' : 'bg-tertiary text-background'}`}>{!active && <span className="animate-ping absolute -left-[1.5px] right-0 w-5 h-5 rounded-full bg-foreground opacity-35" />}<span className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>{counter}</span></div>
            </>
          )}
          {title}
        </li>
      </Link>
    )
  }

  return (
    <>
      <motion.div 
        className='absolute top-6 left-1/2'
        initial={{
          scale: 0,
          x: '-50%',
        }}
        variants={{
          visible: {
            scale: 1,
          },
          hidden: {
            scale: 0,
          }
        }}
        transition={{
          type:'spring',
          duration: 1,
          delay: 0.7,
        }}
        animate={visibility == 'hidden' ? 'hidden' : 'visible'}
        >
        <Link href='/'>
          <Image src='/lumentosh.svg' alt='lumentosh' width={64} height={64}/>
        </Link>
      </motion.div>
      <motion.nav
        
        className='top-24 fixed left-1/2'
        initial={{
          y: -200,
          x: '-50%',
        }}
        variants={{
          start: {
            y: 0,
          },
          visible: {
            y: -70,
          },
          hidden: {
            y: -200
          }
        }}
        transition={{
          duration: 0.4,
          type:'spring'
        }}
        animate={visibility}
      >
        
        <div className='flex border-8 border-secondary bg-secondary rounded-full items-center gap-4'>
          <NavItem title='Início' slug='/'/>
          <NavItem title='Projetos' slug='/projetos' counter={5}/>
          <NavItem title='Sobre' slug='/sobre' />
          <NavItem title='Contato' slug='/contato' />
        </div>
        
      </motion.nav>
    </>
  )
}