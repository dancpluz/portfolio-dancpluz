'use client'
import { buildImageUrl, getProjects, IconsExpand } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { motion, useTransform, useScroll } from 'framer-motion'
import { ProjectsResponse } from '@/pocketbase-types'
import useVerticalScroll from '@/hooks/useVerticalScroll'
import useMeasure from 'react-use-measure'
import MySkeleton from './MySkeleton'

export default function Projects() {
  const { isPending, isError, data=[], error } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })
  const targetRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef
  })

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-95%"])

  if (isPending) {
    return (
      <div ref={targetRef} className='relative h-[300vh]'>
        <div className='px-40 h-screen overflow-hidden flex items-center sticky top-0'>
          <motion.div style={{ x }} className='flex gap-12'>
            {Array(4).fill(null).map((_, i) =>
              <MySkeleton key={i} className='h-full w-full' containerClassName='aspect-[3/2] h-auto w-[600px] overflow-hidden relative justify-center items-center flex border border-foreground rounded-3xl' />
            )}
          </motion.div>
        </div>
      </div>
    )
  }
  
  if (isError) {
    return (
      <div ref={targetRef} className='relative h-[300vh]'>
        <div className='px-40 h-screen overflow-hidden flex items-center sticky top-0'>
          <motion.div style={{ x }} className='flex gap-12'>
            {Array(4).fill(null).map((_, i) =>
              <div key={i} className='aspect-[3/2] h-auto w-[600px] overflow-hidden relative justify-center items-center flex border border-foreground rounded-3xl p-9'>
                Ocorreu um Erro Inesperado: {error.message}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div ref={targetRef} className='relative h-[300vh]'>
      <div className='px-4 md:px-40 h-screen overflow-hidden flex items-center sticky top-0'>
        <motion.div style={{ x }} className='flex gap-12'>
          {data.map((project) =>
            <Project key={project.title} project={project} />
          )}
        </motion.div>
      </div>
    </div>
  )
}

function Project({ project }: { project: ProjectsResponse<IconsExpand> }) {  
  const { title, subtitle, text, cover, link, start_date, end_date, expand } = project;

  const [onHover, setOnHover] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  let [ref, { height }] = useMeasure();

  const { yTranslation, setMustFinish, setDuration } = useVerticalScroll(8, height);

  return (
    <div onMouseEnter={() => setOnHover(true)} onMouseLeave={() => setOnHover(false)} className='aspect-[3/2] h-auto w-[450px] md:w-[600px] overflow-hidden relative flex border border-foreground rounded-3xl px-9 gap-9 pr-[100px]'>
      <div className={`flex flex-col py-9 z-10`}>
        <div className='flex flex-col'>
          <div className='flex gap-2'>
            <h1 className="overflow-hidden text-4xl leading-8 text-white">
              {title.toUpperCase().match(/./g)!.map((char: string, index: number) => (
                <span
                  className={`${onHover ? 'animate-text-reveal' : 'opacity-0'} transition-opacity base duration-[700ms] inline-block [animation-fill-mode:backwards]`}
                  key={`${char}-${index}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h1>
            {link && 
              <Link className='hover:-translate-y-1 transition-transform' href={link} target="_blank">
                <Image className={`transition-opacity delay-[800ms] duration-[700ms] ${onHover ? 'opacity-1' : 'opacity-0 delay-0'}`} src='link.svg' width={32} height={32} alt={'Ícone Link ' + title} />
              </Link>}
          </div>
          <h2 style={{ opacity: onHover ? 1 : 0, animationDelay: onHover ? '1000ms' : '0ms' }} className={`text-white text-2xl tracking-wider transition-opacity duration-[700ms]`}>{subtitle.toUpperCase()}</h2>
        </div>
        <p style={{ opacity: onHover ? 1 : 0, animationDelay: onHover ? '1200ms' : '0ms' }} className={`text-white text-xl tracking-wide py-6 grow transition-opacity duration-[700ms]`}>{text}</p>
        <div className='flex justify-between'>
          <span style={{ opacity: onHover ? 1 : 0, animationDelay: onHover ? '1400ms' : '0ms' }} className={`text-white text-2xl tracking-wider transition-opacity duration-[700ms]`}>{formatDate(start_date, end_date)}</span>
          <div className='flex gap-1'>
            {expand?.icon_refs?.map((icon) => (
                <Link key={icon.alt} href={icon.link} target="_blank">
                <Image className='hover:-translate-y-1 transition-transform animate-pulse' src={buildImageUrl(icon, icon.icon)} width={32} height={32} alt={'Ícone ' + icon.alt} />
                </Link>
              ))}
          </div>
        </div>
      </div>
      <motion.div
        ref={ref}
        style={{ y: yTranslation }}
        // onHoverStart={() => { setMustFinish(true); setDuration(8); }}
        // onHoverEnd={() => { setMustFinish(true); setDuration(12); }}
        className='right-8 w-max absolute flex flex-col whitespace-nowrap gap-[48px] z-10'
      >
        <h2 className='text-5xl base font-extrabold tracking-wide w-12 text-stroke [writing-mode:vertical-lr]'>{title.toUpperCase()}</h2>
        <h2 className='text-5xl base font-extrabold tracking-wide w-12 text-stroke [writing-mode:vertical-lr]'>{title.toUpperCase()}</h2>
      </motion.div>
      {cover &&
        <>
          <Image
            className='z-0'
            alt={'Fundo ' + title}
            src={buildImageUrl(project, cover)}
            style={{
            opacity: isLoaded ? 1 : 0,
            }}
            unoptimized
            fill
            onLoad={() => setIsLoaded(true)}
          />
          {!isLoaded && 
          <MySkeleton className='h-full w-full' containerClassName='absolute top-0 left-0 h-full w-full' />
          }
        </>
      }
      <div className={`absolute inset-0 bg-black transition-opacity duration-500 ${onHover ? 'opacity-60' : 'opacity-0'}`}/>
    </div>
  )
}