import Technologies from '@/components/landing/technologies';
import Projects from '@/components/landing/projects';
import PageTransition from '@/components/motion/page-transition';
import Tooltip from '@/components/ui/tooltip';

export default async function HomePage() {
  return (
    <PageTransition
      tag='main'
      className='flex max-h-screen max-w-screen flex-col gap-4 mt-50 z-10'
    >
      <Tooltip name='Daniel'>
        <button className='px-4 py-2 bg-blue-500 text-white rounded-md'>
          Click me
        </button>
      </Tooltip>
      <Technologies />
      <Projects />
    </PageTransition>
  );
}
