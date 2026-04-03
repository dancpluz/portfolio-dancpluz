import { getSectionId } from '@/lib/utils';
import { ROUTES } from '@/lib/constant';
import FlipText from '../../extra/flip-text';
import DvdLogo from './dvd-logo';
import Connect from './connect';
import { getSocials } from '@/actions/socials';
import { Reveal } from '@/components/motion/reveal';

export default async function Contact() {
  const { data: socials } = await getSocials();

  return (
    <section id={getSectionId(ROUTES.contact)} className='w-full'>
      <Reveal direction='up' once={false}>
        <FlipText text='Contato' className='font-heading text-7xl mb-6' />
      </Reveal>
      <div className='flex flex-row gap-6'>
        <Reveal direction='up' delay={0.2} once={false} className='w-1/2 min-w-1/2'>
          <div className='relative bg-linear-to-br from-surface to-background w-full h-full aspect-video pixel-corners-border mx-auto'>
            <DvdLogo />
          </div>
        </Reveal>
        <Connect socials={socials || []} />
      </div>
    </section>
  );
}
