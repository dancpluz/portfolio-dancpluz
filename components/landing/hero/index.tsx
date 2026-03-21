import { ROUTES } from '@/lib/constant';
import { getSectionId } from '@/lib/utils';
import FlipText from '../flip-text';

export default function Hero() {
  return (
    <section id={getSectionId(ROUTES.landing)} className='w-full'>
      <FlipText
        text='Portfólio'
        className='font-heading text-7xl
        '
      />
    </section>
  );
}
