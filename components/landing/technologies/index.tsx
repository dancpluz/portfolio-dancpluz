import { getSectionId } from '@/lib/utils';
import { ROUTES } from '@/lib/constant';
import { getTechnologies } from '@/actions/technologies';
import LogoShowcase from './logo-showcase';
import FlipText from '../../extra/flip-text';
import { getTranslations } from 'next-intl/server';
import SplitText from '@/components/motion/text/split-text';

export default async function Technologies() {
  const [{ data: technologies, error }, t] = await Promise.all([
    getTechnologies(),
    getTranslations('stack'),
  ]);

  if (error || !technologies) {
    return null;
  }

  return (
    <section
      id={getSectionId(ROUTES.stack)}
      className='w-full flex flex-col items-center'
    >
      <FlipText text={t('title')} className='font-heading text-8xl' />
      <SplitText
        text={t('text')}
        tag='p'
        splitType='words'
        delay={40}
        className='text-xl font-regular mb-10'
      />
      <LogoShowcase logos={technologies} columnCount={5} />
    </section>
  );
}
