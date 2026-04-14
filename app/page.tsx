import Technologies from '@/components/landing/technologies';
import Projects from '@/components/landing/projects';
import PageTransition from '@/components/motion/page-transition';
import About from '@/components/landing/about';
import ScrollToHash from '@/components/extra/scroll-to-hash';
import Contact from '@/components/landing/contact';
import Footer from '@/components/footer';
// import Hero from '@/components/landing/hero';

export default async function HomePage() {
  return (
    <PageTransition
      tag='main'
      className='flex max-w-screen flex-col gap-20 mt-32 z-10'
    >
      <ScrollToHash />
      {/* <Hero /> */}
      <div className='flex flex-col gap-20 section-px'>
        <Projects />
        <Technologies />
        <About />
        <Contact />
      </div>
      <Footer />
    </PageTransition>
  );
}
