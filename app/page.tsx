import { getTranslations } from 'next-intl/server';
// import { Reveal } from '@/components/motion/reveal';
// import Technologies from '@/components/landing/technologies';
// import Loading from '@/app/loading';
import { getContacts } from '@/actions/icons';
import Projects from '@/components/landing/projects';
import FlipText from '@/components/landing/flip-text';
import PageTransition from '@/components/motion/page-transition';

export default async function HomePage() {
  const t = await getTranslations('home');
  const contacts = await getContacts();

  return (
    <PageTransition tag="main" className='flex max-h-screen max-w-screen flex-col gap-4 mt-24 z-10'>
      <FlipText text="Projects" href="/projects" />
    </PageTransition>
  );
}
