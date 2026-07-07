import { getProjects } from '@/actions/projects';
import Footer from '@/components/footer';
import PageTransition from '@/components/motion/page-transition';
import ProjectContent from '@/components/project/project-content';
import NextProjectPreview from '@/components/project/next-project-preview';
import { Project } from '@/types/api';
import { getTranslations } from 'next-intl/server';

export async function generateStaticParams() {
  const { data: projects, error } = await getProjects();

  if (error || !projects) {
    return [];
  }

  return projects.map((project) => ({ id: project.id }));
}

export const revalidate = 30;

export default async function ProjectPage(
  props: Readonly<{
    params: Promise<{ id: string }>;
  }>,
) {
  const { id } = await props.params;
  const [{ data: projects }, t] = await Promise.all([
    getProjects() as Promise<{ data: Project[] | null }>,
    getTranslations('projects'),
  ]);

  const projectIndex = projects?.findIndex((p) => p.id === id) ?? -1;
  const project = projectIndex === -1 ? null : projects![projectIndex];

  if (!project) {
    return (
      <PageTransition
        tag='main'
        className='flex max-h-screen max-w-screen flex-col items-center justify-center p-20 z-10'
      >
        <p className='text-xl'>{t('not_found')}</p>
      </PageTransition>
    );
  }

  const nextProject =
    projects && projects.length > 1
      ? projects[(projectIndex + 1) % projects.length]
      : null;

  return (
    <PageTransition
      tag='main'
      key={id}
      className='flex max-w-screen flex-col gap-4 z-10'
    >
      <ProjectContent project={project} />

      {nextProject && (
        <div className='w-full section-px'>
          <NextProjectPreview project={nextProject} />
        </div>
      )}

      <Footer />
    </PageTransition>
  );
}
