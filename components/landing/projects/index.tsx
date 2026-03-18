import ProjectShowcase from './project-showcase';
import FlipText from '../flip-text';
import { ROUTES } from '@/lib/constant';
import { getSectionId } from '@/lib/utils';
import { getProjects } from '@/actions/projects';

export default async function Projects() {
  const projects = await getProjects();

  return (
    <section id={getSectionId(ROUTES.projects)} className='w-full'>
      <FlipText className='text-8xl font-heading' text='Obras' />
      <ProjectShowcase projects={projects.data || []} />
    </section>
  );
}
