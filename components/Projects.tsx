'use client'
import { buildUrl, getProjects } from '@/hooks/api'
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'


export default function Projects() {
  const queryClient = useQueryClient()

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
      {JSON.stringify(data)}
    </div>
  )
}

function Project({ project }) {
  const { title, subtitle, text, cover, link, start_date, end_date, expand } = project;

  return (
    <div className='h-[400px] w-[600px] [&>*]:[&>div]:[&>div]:hover:pause overflow-hidden relative flex border border-foreground rounded-3xl px-9 gap-9 transition-opacity'>
      <div className='flex flex-col py-9'>
        <div className='flex flex-col'>
          <div className='flex gap-2'>
            <h2 className='text-4xl font-extrabold'>{title.toUpperCase()}</h2>
            <Link href={link} target="_blank">
              <Image src='link.svg' width={32} height={32} alt={'Ícone Link ' + title} />
            </Link>
          </div>
          <h3 className='text-2xl tracking-widest'>{subtitle.toUpperCase()}</h3>
        </div>
        <p className='text-xl tracking-wide py-6 grow'>{text}</p>
        <div className='flex justify-between'>
          <span className='text-2xl tracking-widest'>ATUAL - MAR 24</span>
          <div className='flex gap-1'>
            {
              expand.icons.map((icon) => (
                <Link key={icon.alt} href={icon.link} target="_blank">
                  <Image src={buildUrl(icon, icon.icon)} width={32} height={32} alt={icon.alt} />
                </Link>
              ))
            }
          </div>
        </div>
      </div>
      <div className='flex flex-col w-[60px] justify-between gap-8'>
        <div className='flex grow-0'>
          <h2 className='text-5xl font-extrabold tracking-wide font-outline-1 animate-infinite-scroll-v [writing-mode:vertical-lr]'>{title.toUpperCase()}</h2>
        </div>
        <div className='flex grow-0'>
          <h2 className='text-5xl font-extrabold tracking-wide font-outline-1 animate-infinite-scroll-v [writing-mode:vertical-lr]'>{title.toUpperCase()}</h2>
        </div>
      </div>
      
    </div>
  )
}