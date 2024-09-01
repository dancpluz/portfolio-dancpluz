import { buildImageUrl, getExperience, getTechnologies } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'

function Technologies() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['technologies'],
    queryFn: getTechnologies,
  })

  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  return (
    <div className='flex overflow-hidden justify-between gap-8 [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]'>
      <ul className='min-w-full flex items-center shrink-0 gap-8 justify-between animate-infinite-scroll-h'>
        {data.map((tech) => (
          <li className='w-16' key={tech.alt}>
            <Image src={buildImageUrl(tech, tech.icon)} width={64} height={64} alt={tech.alt} />
          </li>
        ))}
      </ul>
      <ul aria-hidden='true' className='min-w-full flex items-center shrink-0 gap-8 justify-between animate-infinite-scroll-h'>
        {data.map((tech) => (
          <li className='w-16' key={tech.alt}>
            <Image src={buildImageUrl(tech, tech.icon)} width={64} height={64} alt={tech.alt} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function Experience() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['experience'],
    queryFn: getExperience,
  })

  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  return (
    <div className='flex items-center gap-3 grow'>
      {data.map(({ title, expand }) => (
        <>
          <div className='h-[2px] bg-foreground grow' />
          <div key={title} className='relative w-16 h-16'>
            <Image className='object-contain' src={buildImageUrl(expand.icon_ref, expand.icon_ref.icon)} fill alt={expand.icon_ref.alt} />
          </div>
        </>
      ))}
      
      <hr className='border-2 border-dashed max-w-24 grow' />
    </div>
  )
}

export default function About() {
  const semester = 4;
  
  return (
    <div className='flex flex-col gap-16 py-16'>
      <div className='flex gap-8 px-40'>
        <div className='relative h-[500px] w-[800px] rounded-3xl border'>
          <Image className='object-cover' alt='Autor do site Daniel' src={'/daniel.webp'} fill/>
        </div>
        <div className='flex gap-8 flex-col grow'>
          <div className='flex'>
            <h1 className='text-8xl font-bold'>DANIEL LUZ</h1>
              <Image alt={'Logo Lumentosh'} src={'logo.svg'} height={40} width={66} />
          </div>
          <p className='text-3xl'>Inspirado pela moda, o bom design e a crescente vontade de solucionar problemas, me esforço para tornar a vidas das pessoas mais fácil e expressar minha arte ao mesmo tempo.</p>
          <Experience />
        </div>
        <div className='flex flex-col items-center gap-2'>
          <p className='whitespace-nowrap'>CIC - UNB</p>
          <Image alt='Logo Universidade de Brasília' src={'/unb.svg'} width={43} height={23} />
          <div className='flex flex-col items-center gap-1.5 grow'>
            {Array(8).fill('').map((_, index) => index + 1).reverse().map((value) => {
              // `${value}º Semestre`
              if (value > semester) {
                return (
                  <>
                    <div className='w-3 h-3 rounded-full border' />
                    <div className='w-[2px] bg-alternate grow' />
                  </>
                )
              }
              
              return (
                <>
                  <div className={`w-3 h-3 rounded-full bg-foreground ${value === semester ? 'before:animate-ping before:absolute before:h-3 before:w-3 before:rounded-full before:content-[""] before:bg-foreground' : ''}`} />
                  <div className='w-[2px] bg-foreground grow' />
                </>
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
