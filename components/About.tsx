import { buildImageUrl, getExperience, getTechnologies, IconExpand } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import MyPopup from '@/components/MyPopup';
import { formatTimeDifference, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { ExperienceResponse } from '@/pocketbase-types';
import { useState } from 'react';
import { motion } from 'framer-motion';
import useHorizontalScroll from '@/hooks/useHorizontalScroll';
import useMeasure from 'react-use-measure';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function Technologies() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['technologies'],
    queryFn: getTechnologies,
  })

  const FAST = 30;
  const SLOW = 300;

  let [ref, { width }] = useMeasure();

  const { xTranslation, setMustFinish, setDuration } = useHorizontalScroll(FAST, width);

  if (isPending) {
    return (
      <div className='flex overflow-hidden justify-between'>
      <motion.ul
        ref={ref}
        style={{ x: xTranslation }}
          className='w-max flex items-center shrink-0 gap-12'>
        {Array(16).fill(null).map((_, i) => (
          <Skeleton key={i} className='h-full w-full' containerClassName='size-16 rounded-lg relative overflow-hidden relative justify-center items-center flex border border-foreground'/>
          )
        )}
      </motion.ul>
    </div>
    )
  }

  if (isError) {
    return
  }
  
  return (
    <div className='flex overflow-hidden justify-between'>
      <motion.ul
        ref={ref}
        style={{ x: xTranslation }}
        // onHoverStart={() => { setMustFinish(true); setDuration(SLOW); }}
        // onHoverEnd={() => { setMustFinish(true); setDuration(FAST); }}
        className='w-max flex items-center shrink-0 gap-12'>
        {[...data, ...data].map((tech, i) => (
           <MyPopup
              key={tech.alt + '-' + i}
              on="hover"
              trigger={
                <li className='w-16'>
                  <Image src={buildImageUrl(tech, tech.icon)} width={64} height={64} alt={'Ícone ' + tech.alt} />
                </li>
              }
              position="top center">
              <div className='flex flex-col'>
                <p className='text-base font-semibold'>{tech.alt.replace('Ícone','')}</p>
              </div>
            </MyPopup>
          )
        )}
      </motion.ul>
    </div>
  )
}

function Experience() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['experience'],
    queryFn: getExperience,
  })

  if (isPending) {
    return (
      <div className='flex items-center gap-3 grow'>
        {Array(4).fill(null).map((_,i) => (
          <div key={i} className='flex gap-3 items-center grow'>
            <div className='h-[2px] bg-foreground grow' />
            <Skeleton key={i} className='h-full w-full' containerClassName='size-16 rounded-lg relative overflow-hidden relative justify-center items-center flex border border-foreground' />
          </div>
        ))}
      <hr className='border-2 border-foreground border-dashed max-w-24 grow' />
    </div>
    )
  }

  if (isError) {
    return (
      <div className='flex items-center gap-3 grow'>
        Ocorreu um Erro Inesperado: {error.message}
      </div>
    )
  }

  return (
    <div className='flex items-center gap-3 grow'>
      {data.map((experience) => (
        <ExperienceItem key={experience.title} experience={experience} />
      ))}
      <hr className='border-2 border-foreground border-dashed max-w-24 grow' />
    </div>
  )
}

function ExperienceItem({ experience }: { experience: ExperienceResponse<IconExpand> }) {
  const { expand, title, start_date, end_date } = experience;

  return (
    <div className='flex gap-3 items-center grow'>
      <div className='h-[2px] bg-foreground grow' />
      <MyPopup
        on="hover"
        trigger={
          expand?.icon_ref.link ?
            <Link href={expand.icon_ref.link} target="_blank">
              <div className='relative w-14 h-14'>
                <Image className='object-contain' src={buildImageUrl(expand.icon_ref, expand.icon_ref.icon)} fill alt={'Ícone ' + expand.icon_ref.alt} />
              </div>
            </Link>
            :
            <div className='relative w-14 h-14'>
              {expand && <Image className='object-contain' src={buildImageUrl(expand.icon_ref, expand.icon_ref.icon)} fill alt={'Ícone ' + expand.icon_ref.alt} />}
            </div>
        }
        position="top center">
        <div className='flex flex-col'>
          <p className='text-base font-extrabold'>{title.toUpperCase()}</p>
          <span className='text-sm tracking-wider'>{formatTimeDifference(start_date, end_date)} | {formatDate(start_date, end_date)}</span>
        </div>
      </MyPopup>
    </div>
  )
}


export default function About() {
  const semester = 4;
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div className='flex flex-col gap-16 py-16'>
      <div className='flex gap-8 px-40'>
        <div className='relative overflow-hidden h-[500px] w-[800px] rounded-3xl border border-foreground'>
          <Image
            className='object-cover'
            alt='Autor do site Daniel'
            src={'/daniel.webp'}
            style={{
              opacity: isLoaded ? 1 : 0,
            }}
            fill
            onLoad={() => setIsLoaded(true)}
          />
          {!isLoaded && 
            <Skeleton className='h-full w-full' />
          }
        </div>
        <div className='flex gap-4 flex-col grow'>
          <div className='flex gap-8'>
            <h1 className='base text-8xl font-bold'>DANIEL LUZ</h1>
            <MyPopup
              on="hover"
              trigger={
                <Image alt={'Logo Lumentosh'} src={'logo.svg'} height={40} width={66} />
              }
              position="top center">
              <div className='flex flex-col'>
                <p className='text-base font-semibold'>LUMENTOSH</p>
              </div>
            </MyPopup>
          </div>
          <p className='text-3xl'>Inspirado pela moda, o bom design e a crescente vontade de solucionar problemas, me esforço para tornar a vida das pessoas mais fácil e expressar minha arte ao mesmo tempo.</p>
          <Experience />
        </div>
        <div className='flex flex-col items-center gap-4'>
          <MyPopup on="hover" trigger={<div className='flex flex-col gap-1 items-center'>
            <p className='whitespace-nowrap font-normal'>CIC - UNB</p>
            <Image alt='Logo Universidade de Brasília' src={'/unb.svg'} width={43} height={23} />
          </div>} position="left center">
            <p className='font-bold text-sm'>CIÊNCIA DA COMPUTAÇÃO</p>
            <span>Universidade de Brasília</span>
          </MyPopup>
          
          <div className='flex flex-col items-center gap-1.5 grow'>
            {Array(8).fill('').map((_, index) => index + 1).reverse().map((value) => {
              // `${value}º Semestre`
              if (value > semester) {
                return (
                  <div className='flex flex-col items-center gap-1.5 grow' key={value + 'º Semestre'}>
                    <MyPopup on="hover" trigger={<div className='w-3 h-3 rounded-full border-2 border-alternate' />} position="right center">
                      <span>{value}º Semestre</span>
                    </MyPopup>
                    <div className='w-[2px] bg-alternate grow' />
                  </div>
                )
              }
              
              return (
                <div className='flex flex-col items-center gap-1.5 grow' key={value + 'º Semestre'}>
                  <MyPopup on="hover" trigger={<div className={`w-3 h-3 rounded-full bg-foreground ${value === semester ? 'before:animate-ping before:absolute before:h-3 before:w-3 before:rounded-full before:content-[""] before:bg-foreground' : ''}`} />} position="right center">
                    <span>{value}º Semestre</span>
                  </MyPopup>
                  <div className='w-[2px] bg-foreground grow' />
                </div>
              )
            }
            )}
          </div>
        </div>
      </div>
      <Technologies />
    </div>
  )
}
