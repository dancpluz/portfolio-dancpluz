import { getProjects, getProjectById } from '@/actions/projects';
import PageTransition from '@/components/motion/page-transition';

export async function generateStaticParams() {
  const { data: projects, error } = await getProjects();

  if (error || !projects) {
    return [];
  }

  return projects.map((project) => ({ id: project.id }));
}

export const revalidate = 30;

export default async function Project(
  props: Readonly<{
    params: Promise<{ id: string }>;
  }>,
) {
  const { id } = await props.params;
  const { data: project } = await getProjectById(id);

  const { title } = project ?? {};

  return (
    <PageTransition
      tag='main'
      className='flex max-h-screen max-w-screen flex-col gap-4 mt-50 z-10'
    >
      <p>{title}</p>
    </PageTransition>
  );
}
