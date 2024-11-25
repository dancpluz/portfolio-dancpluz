import { buildImageUrl, getContact } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Contact() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['contact'],
    queryFn: getContact,
  })

  const [isLoaded, setIsLoaded] = useState(false)

  if (isPending) {
    return (
      <div className='relative'>
        <div className='px-40 py-8 mr-60'>
          <h2 className='text-7xl base'>FALE COMIGO</h2>
          <p className='text-4xl'>Estou aberto a oportunidades e propostas, fique à vontade para mandar mensagem em qualquer meio de comunicação.</p>
          <div className='size-[700px] absolute -top-10 -right-[250px]'>
            <Skeleton circle className='h-full w-full' />
          </div>
          <div className='flex gap-2 py-6'>
            {Array(4).fill(null).map((_, i) => (
              <Skeleton key={i} className='h-full w-full' containerClassName='size-16 rounded-lg relative overflow-hidden border border-foreground'/>
              )
            )}
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className='relative'>
        <div className='px-40 py-8 mr-60'>
          <h2 className='text-7xl base'>FALE COMIGO</h2>
          <p className='text-4xl'>Estou aberto a oportunidades e propostas, fique à vontade para mandar mensagem em qualquer meio de comunicação.</p>
          <div className='absolute -top-10 right-0'>
            <Image
              alt='Forma 3D Globo Girando'
              src={'/sphere.webp'}
              width={700}
              height={700}
              style={{
                opacity: isLoaded ? 1 : 0,
              }}
              onLoad={() => setIsLoaded(true)}
            />
            {!isLoaded && 
              <div className='size-[700px] absolute -top-10 -right-[250px]'>
                <Skeleton circle className='h-full w-full' />
              </div>
            }
          </div>
          <div className='flex gap-2 py-6'>
            <span>Ocorreu um erro ao carregar as minhas redes</span>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className='relative'>
      <div className='px-40 py-8 mr-60'>
        <h2 className='text-7xl base'>FALE COMIGO</h2>
        <p className='text-4xl'>Estou aberto a oportunidades e propostas, fique à vontade para mandar mensagem em qualquer meio de comunicação.</p>
        <div className='absolute -top-10 right-0 transition duration-700 hover:-translate-y-16'>
          <Image
            alt='Forma 3D Globo Girando'
            src={'/sphere.webp'}
            width={700}
            height={700}
            style={{
              opacity: isLoaded ? 1 : 0,
            }}
            onLoad={() => setIsLoaded(true)}
          />
          {!isLoaded && 
          <div className='size-[700px] absolute -top-10 -right-[250px]'>
            <Skeleton circle className='h-full w-full' />
          </div>
          }
        </div>
        <div className='flex gap-2 py-6'>
          {data.map((icon) => 
            <Link key={icon.alt} href={icon.link} target='_blank'>
              <div className='relative w-16 h-16 hover:-translate-y-1 transition-transform'>
                <Image alt={'Ícone ' + icon.alt} src={buildImageUrl(icon, icon.icon)} fill />
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
