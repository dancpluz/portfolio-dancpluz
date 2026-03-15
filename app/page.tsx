import Technologies from '@/components/landing/technologies';
import Projects from '@/components/landing/projects';
import PageTransition from '@/components/motion/page-transition';
// import Tooltip from '@/components/ui/tooltip';
import { getProjects } from '@/actions/projects';

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <PageTransition
      tag='main'
      className='flex max-h-screen max-w-screen flex-col gap-4 mt-50 z-10'
    >
      <pre>
        {JSON.stringify(projects.data, null, 2)}
      </pre>
      <Technologies />
      <Projects />
    </PageTransition>
  );
}
