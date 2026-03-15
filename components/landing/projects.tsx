import { Project } from '@/types/api';
import ProjectShowcase from './project-showcase';

export default function Projects({
  projects,
}: Readonly<{
  projects: Project[];
}>) {
  return (
    <section id='obras' className='w-full'>
      <ProjectShowcase projects={projects} />
    </section>
  );
}
