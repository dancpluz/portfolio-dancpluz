import Image from 'next/image'

function Technologies({ technologies }) {
  return (
    <div className='flex overflow-hidden justify-between gap-8 [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]'>
      <ul className='min-w-full flex items-center shrink-0 gap-8 justify-between animate-infinite-scroll-h'>
        {technologies.map(({ src, alt }) => (
          <li className='w-16' key={alt}>
            <Image  src={src} width={64} height={64} alt={alt} />
          </li>
        ))}
      </ul>
      <ul aria-hidden='true' className='min-w-full flex items-center shrink-0 gap-8 justify-between animate-infinite-scroll-h'>
        {technologies.map(({ src, alt }) => (
          <li className='w-16' key={alt}>
            <Image src={src} width={64} height={64} alt={alt} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function About() {
  return (
    <div>
      <Technologies technologies={[{ src: 'camera.svg', alt: 'teste' }, { src: 'insta.svg', alt: 'Insta' }, { src: 'gem.svg', alt: 'henn' }, { src: 'lamp.svg', alt: 'teste' }, { src: 'logo.svg', alt: 'teste' }, { src: 'phone.svg', alt: 'teste' }, { src: 'user.svg', alt: 'teste' }, { src: 'link.svg', alt: 'teste' }, { src: 'lamp.svg', alt: 'teste' }, { src: 'logo.svg', alt: 'teste' }, { src: 'phone.svg', alt: 'teste' }, { src: 'user.svg', alt: 'teste' }, { src: 'camera.svg', alt: 'teste' }, { src: 'insta.svg', alt: 'Insta' }, { src: 'gem.svg', alt: 'henn' }, { src: 'lamp.svg', alt: 'teste' }, { src: 'logo.svg', alt: 'teste' }, { src: 'phone.svg', alt: 'teste' }, { src: 'user.svg', alt: 'teste' }, { src: 'link.svg', alt: 'teste' }, { src: 'lamp.svg', alt: 'teste' }, { src: 'logo.svg', alt: 'teste' }, { src: 'phone.svg', alt: 'teste' }, { src: 'user.svg', alt: 'teste' }]} />
    </div>
  )
}
