import { getSectionId } from '@/lib/utils';
import { ROUTES } from '@/lib/constant';
import FlipText from '../flip-text';
import DvdLogo from './dvd-logo';

export default function Contact() {
  return (
    <section id={getSectionId(ROUTES.contact)} className='w-full'>
      <FlipText text='Contato' className='font-heading text-7xl' />
      <div className='relative w-1/2 aspect-video bg-surface pixel-corners-small mt-4'>
        <DvdLogo />
      </div>
    </section>
  );
}
