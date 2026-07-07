import { getSectionId } from '@/lib/utils';
import { ROUTES, SECTION_TITLE_CLASS } from '@/lib/constant';
import { getTechnologies } from '@/actions/technologies';
import LogoShowcase from './logo-showcase';
import FlipText from '../../extra/flip-text';
import { getTranslations } from 'next-intl/server';

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
      <FlipText text={t('title')} className={SECTION_TITLE_CLASS} />
      <LogoShowcase logos={technologies} columnCount={5} />
    </section>
  );
}
