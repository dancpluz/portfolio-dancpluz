import { ROUTES, MOCK_TESTIMONIALS } from '@/lib/constant';
import { getSectionId } from '@/lib/utils';
import { getTestimonials } from '@/actions/testimonials';
import FlipText from '../../extra/flip-text';
import Testimonials from './testimonials';
import Folder from '@/components/landing/about/folder';
import { getPolaroids } from '@/actions/polaroids';

export default async function About() {
  const [testimonials, polaroids] = await Promise.all([
    getTestimonials(),
    getPolaroids(),
  ]);

  const displayTestimonials =
    !testimonials.error && testimonials.data && testimonials.data.length > 0
      ? testimonials.data
      : MOCK_TESTIMONIALS;

  return (
    <section
      id={getSectionId(ROUTES.about)}
      className='flex w-full flex-col gap-10 md:gap-20'
    >
      <FlipText text='Sobre' className='font-heading text-7xl' />
      <Testimonials testimonials={displayTestimonials} />
      <Folder color='#ff00ff' polaroids={polaroids.data || []} />
      <Folder color='#00f248' polaroids={polaroids.data || []} />
      <Folder color='#00fbfe' polaroids={polaroids.data || []} />
    </section>
  );
}
