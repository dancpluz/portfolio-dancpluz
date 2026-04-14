import { getSectionId } from '@/lib/utils';
import { ROUTES } from '@/lib/constant';
import { getTechnologies } from '@/actions/technologies';
import LogoShowcase from './logo-showcase';
import FlipText from '../../extra/flip-text';
import { getTranslations } from 'next-intl/server';

export default async function Technologies() {
  const [{ data: technologies, error }, t] = await Promise.all([
    getTechnologies(),
    getTranslations('technologies')
  ]);

  if (error || !technologies) {
    return null;
  }

  return (
    <section id={getSectionId(ROUTES.technologies)} className='w-full flex flex-col items-center'>
      <FlipText text={t('title')} className='font-heading text-8xl' />
      <p className='text-xl font-regular mb-10'>{t('text')}</p>
      <LogoShowcase logos={technologies} columnCount={5} />
    </section>
  );
}
