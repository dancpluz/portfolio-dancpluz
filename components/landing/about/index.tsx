import { ROUTES, MOCK_TESTIMONIALS } from '@/lib/constant';
import { getSectionId } from '@/lib/utils';
import { getTestimonials } from '@/actions/testimonials';
import FlipText from '../../extra/flip-text';
import Testimonials from './testimonials';

export default async function About() {
  const { data: testimonials, error } = await getTestimonials();

  const displayTestimonials =
    !error && testimonials && testimonials.length > 0
      ? testimonials
      : MOCK_TESTIMONIALS;

  return (
    <section
      id={getSectionId(ROUTES.about)}
      className='flex w-full flex-col gap-10 md:gap-20'
    >
      <FlipText text='Sobre' className='font-heading text-7xl' />
      <Testimonials testimonials={displayTestimonials} />
    </section>
  );
}
