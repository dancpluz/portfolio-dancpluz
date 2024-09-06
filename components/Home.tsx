import Image from "next/image";

export default function Home() {
  return (
    <div className='h-[800px]'>
      <div className='absolute top-12 left-0'>
        <Image alt='Forma 3D Diamante Girando' src={'/diamond.webp'} width={900} height={900} />
      </div>
    </div>
  )
}
