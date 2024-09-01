'use client'
import { buildImageUrl, getProjects } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'


export default function Projects() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })

  if (isPending) {
    return <span>Loading...</span>
  }
  
  if (isError) {
    return <span>Error: {error.message}</span>
  }

  return (
    <div className='px-40 py-40'>
      {data.map((project) => 
        <Project key={project.title} project={project} />
      )}
    </div>
  )
}

function Project({ project }) {  
  const { title, subtitle, text, cover, link, start_date, end_date, expand } = project;

  const [onHover, setOnHover] = useState(false)

  return (
    <div onMouseEnter={() => setOnHover(true)} onMouseLeave={() => setOnHover(false)} className='h-[400px] w-[600px] overflow-hidden relative flex border border-foreground rounded-3xl px-9 gap-9'>
      <div className={`flex flex-col py-9 z-10`}>
        <div className='flex flex-col'>
          <div className='flex gap-2'>
            <h1 className="overflow-hidden text-4xl font-bold leading-8 text-white">
              {title.toUpperCase().match(/./g)!.map((char: string, index: number) => (
                <span
                  className={`${onHover ? 'animate-text-reveal' : 'opacity-0'} transition-opacity duration-[700ms] inline-block [animation-fill-mode:backwards]`}
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
          <h2 style={{ opacity: onHover ? 1 : 0, animationDelay: onHover ? '1000ms' : '0ms' }} className={`text-2xl tracking-widest transition-opacity duration-[700ms]`}>{subtitle.toUpperCase()}</h2>
        </div>
        <p style={{ opacity: onHover ? 1 : 0, animationDelay: onHover ? '1200ms' : '0ms' }} className={`text-xl tracking-wide py-6 grow transition-opacity duration-[700ms]`}>{text}</p>
        <div className='flex justify-between'>
          <span style={{ opacity: onHover ? 1 : 0, animationDelay: onHover ? '1400ms' : '0ms' }} className={`text-2xl tracking-widest transition-opacity duration-[700ms]`}>{formatDate(start_date)} - {end_date ? formatDate(end_date) : 'ATUAL'}</span>
          <div className='flex gap-1'>
            {expand.icon_refs.map((icon) => (
                <Link key={icon.alt} href={icon.link} target="_blank">
                <Image className='hover:-translate-y-1 transition-transform animate-pulse' src={buildImageUrl(icon, icon.icon)} width={32} height={32} alt={icon.alt} />
                </Link>
              ))}
          </div>
        </div>
      </div>
      <div className='flex flex-col w-[60px] justify-between gap-8 z-10'>
        <div className='flex grow-0'>
          <h2 style={{ animationDuration: onHover ? '10s' : '5s' }} className='text-5xl font-extrabold tracking-wide font-outline-1 animate-infinite-scroll-v [writing-mode:vertical-lr]'>{title.toUpperCase()}</h2>
        </div>
        <div className='flex grow-0'>
          <h2 style={{ animationDuration: onHover ? '10s' : '5s' }} className='text-5xl font-extrabold tracking-wide font-outline-1 animate-infinite-scroll-v [writing-mode:vertical-lr]'>{title.toUpperCase()}</h2>
        </div>
      </div>
      <Image className='z-0' alt={'test'} src={buildImageUrl(project, cover)} fill />
      <div className={`absolute inset-0 bg-black transition-opacity duration-500 ${onHover ? 'opacity-60' : 'opacity-0'}`}/>
    </div>
  )
}