import { getSectionId } from '@/lib/utils';
import { ROUTES } from '@/lib/constant';
import FlipText from '../flip-text';
import DvdLogo from './dvd-logo';
import Connect from './connect';
import { getSocials } from '@/actions/socials';

export default async function Contact() {
  const { data: socials } = await getSocials();

  return (
    <section id={getSectionId(ROUTES.contact)} className='w-full'>
      <FlipText text='Contato' className='font-heading text-7xl' />
      <div className='flex flex-row gap-6'>
        <div className='relative bg-linear-to-br from-surface to-background w-1/2 min-w-1/2 aspect-video pixel-corners-border mx-auto'>
          <DvdLogo />
        </div>
        <Connect socials={socials || []} />
      </div>
    </section>
  );
}
