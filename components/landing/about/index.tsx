import { ROUTES, MOCK_TESTIMONIALS } from '@/lib/constant';
import { getSectionId } from '@/lib/utils';
import { getTestimonials } from '@/actions/testimonials';
import FlipText from '../../extra/flip-text';
import Testimonials from './testimonials';
import { getPolaroids } from '@/actions/polaroids';
import { getExperience } from '@/actions/experience';
import Myself from './myself';
import Timeline from './timeline';
import { getTranslations } from 'next-intl/server';

export default async function About() {
  const [testimonials, polaroids, experience, t] = await Promise.all([
    getTestimonials(),
    getPolaroids(),
    getExperience(),
    getTranslations('about')
  ]);

  const displayTestimonials =
    !testimonials.error && testimonials.data && testimonials.data.length > 0
      ? testimonials.data
      : MOCK_TESTIMONIALS;

  return (
    <section
      id={getSectionId(ROUTES.about)}
      className='flex w-full flex-col'
    >
      <FlipText text={t('title')} className='font-heading text-8xl' />
      <Myself polaroids={polaroids.data || []} />
      {experience.data && experience.data.length > 0 && (
        <Timeline
          experiences={experience.data}
        />
      )}
      <Testimonials testimonials={displayTestimonials} />
    </section>
  );
}
