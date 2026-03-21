import { ROUTES } from '@/lib/constant';
import { getSectionId } from '@/lib/utils';
import FlipText from '../flip-text';

export default function About() {
  return (
    <section id={getSectionId(ROUTES.about)} className='w-full'>
      <FlipText text='Sobre' className='font-heading text-7xl' />
    </section>
  );
}
