import Image from 'next/image'

function SkillItem({ title, text, image, alt } : { title: string, text: string, image: string, alt: string }) {
  return (
    <div className='flex gap-8 w-full'>
      <div className='shrink-0 transition-transform hover:scale-110 relative w-32 h-32'>
        <Image alt={'Forma Geométrica 3D ' + alt} src={image} fill />
      </div>
      <div className='flex flex-col gap-1'>
        <h2 className='text-5xl base'>{title.toUpperCase()}</h2>
        <p className='text-3xl'>{text}</p>
      </div>
    </div>
  )
}


export default function Skills() {
  return (
    <div className='px-40 py-60 flex flex-col gap-16 w-full'>
      <div className='flex gap-16'>
        <SkillItem title='Criatividade' text='Se eu não estou criando ou me expressando, não estou vivendo.' image='/dodecahedron.webp' alt='Dodecaedro' />
        <SkillItem title={'Eficiência'} text={'Muitas vezes não encontro a solução perfeita, mas a que funciona.'} image={'/cilinder.webp'} alt='Cilindro' />
      </div>
      <div className='flex gap-16'>
        <SkillItem title={'Adaptabilidade'} text={'Seja qual for a situação, eu dou um jeito de me virar com maestria.'} image={'/prism.webp'} alt='Prisma' />
        <SkillItem title={'Comunicação'} text={'Sempre vou falar o que acho e tenho uma postura otimista.'} image={'/cone.webp'} alt='Pirâmide' />
      </div>
    </div>
  )
}
