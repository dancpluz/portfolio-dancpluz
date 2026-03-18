import { ROUTES } from '@/lib/constant';
import { getSectionId } from '@/lib/utils';

export default function Hero() {
  return (
    <section id={getSectionId(ROUTES.landing)} className='w-full h-screen'>
      <div>Hero</div>
    </section>
  );
}
