import { getTranslations } from 'next-intl/server';
import Technologies from '@/components/landing/technologies';
import { getContacts } from '@/actions/icons';
import Projects from '@/components/landing/projects';
import PageTransition from '@/components/motion/page-transition';

export default async function HomePage() {
  const t = await getTranslations('home');
  const contacts = await getContacts();

  return (
    <PageTransition tag="main" className='flex max-h-screen max-w-screen flex-col gap-4 mt-24 z-10'>
      <Technologies />
      <Projects />
    </PageTransition>
  );
}
