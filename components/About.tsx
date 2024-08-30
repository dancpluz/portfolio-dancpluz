import { buildImageUrl, getTechnologies } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'

function Technologies({ technologies }) {
  return (
    <div className='flex overflow-hidden justify-between gap-8 [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]'>
      <ul aria-hidden='true' className='min-w-full flex items-center shrink-0 gap-8 justify-between animate-infinite-scroll-h'>
        {technologies.map((tech) => (
          <li className='w-16' key={tech.alt}>
            <Image src={buildImageUrl(tech, tech.icon)} width={64} height={64} alt={tech.alt} />
          </li>
        ))}
      </ul>
      <ul aria-hidden='true' className='min-w-full flex items-center shrink-0 gap-8 justify-between animate-infinite-scroll-h'>
        {technologies.map((tech) => (
          <li className='w-16' key={tech.alt}>
            <Image src={buildImageUrl(tech, tech.icon)} width={64} height={64} alt={tech.alt} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function About() {
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
    <div>
      <Technologies technologies={data} />
    </div>
  )
}
