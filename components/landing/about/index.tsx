import { ROUTES } from '@/lib/constant';
import { getSectionId } from '@/lib/utils';

export default function About() {
  return (
    <section id={getSectionId(ROUTES.about)} className='w-full h-screen'>
      <h1>About</h1>
    </section>
  );
}
