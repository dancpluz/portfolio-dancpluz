import ProjectShowcase from './project-showcase';
import FlipText from '../../extra/flip-text';
import { ROUTES, SECTION_TITLE_CLASS } from '@/lib/constant';
import { getSectionId } from '@/lib/utils';
import { getProjects } from '@/actions/projects';
import { getTranslations } from 'next-intl/server';

export default async function Projects() {
  const [projects, t] = await Promise.all([
    getProjects(),
    getTranslations('projects')
  ]);

  return (
    <section id={getSectionId(ROUTES.projects)} className='w-full'>
      <FlipText className={SECTION_TITLE_CLASS} text={t('title')} />
      <ProjectShowcase projects={projects.data || []} />
    </section>
  );
}
