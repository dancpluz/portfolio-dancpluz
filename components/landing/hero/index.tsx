import { ROUTES } from '@/lib/constant';
import { getSectionId } from '@/lib/utils';
import PeggleHero from './peggle-hero';

export default function Hero() {
  return (
    <section id={getSectionId(ROUTES.landing)} className='w-full p-4 relative'>
      <PeggleHero />
    </section>
  );
}
