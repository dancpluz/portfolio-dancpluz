import Technologies from '@/components/landing/technologies';
import Projects from '@/components/landing/projects';
import PageTransition from '@/components/motion/page-transition';
import Hero from '@/components/landing/hero';
import About from '@/components/landing/about';
import ScrollToHash from '@/components/extra/scroll-to-hash';
import Contact from '@/components/landing/contact';

export default async function HomePage() {
  return (
    <PageTransition
      tag='main'
      className='flex max-w-screen flex-col gap-20 mt-50 z-10 section-px'
    >
      <ScrollToHash />
      {/* <Hero /> */}
      <Projects />
      <Technologies />
      <Contact />
      {/* <About /> */}
    </PageTransition>
  );
}
