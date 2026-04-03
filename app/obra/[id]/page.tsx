import { getProjects, getProjectById } from '@/actions/projects';
import PageTransition from '@/components/motion/page-transition';
import { ContainerScroll } from '@/components/project/container-scroll-animation';
import ParallaxImage from '@/components/project/parallax-image';
import { Project } from '@/types/api';

export async function generateStaticParams() {
  const { data: projects, error } = await getProjects();

  if (error || !projects) {
    return [];
  }

  return projects.map((project) => ({ id: project.id }));
}

export const revalidate = 30;

export default async function ProjectPage (
  props: Readonly<{
    params: Promise<{ id: string }>;
  }>,
) {
  const { id } = await props.params;
  const { data: project } = await getProjectById(id) as { data: Project | null };

  if (!project) {
    return (
      <PageTransition tag='main' className='flex max-h-screen max-w-screen flex-col items-center justify-center p-20 z-10'>
        <p className='text-xl'>Projeto não encontrado.</p>
      </PageTransition>
    );
  }

  return (
    <PageTransition
      tag='main'
      className='flex max-w-screen flex-col gap-4 z-10'
    >
      <ContainerScroll
        titleComponent={
          <div className='flex flex-col gap-4 mb-4'>
            <h1 className='text-4xl md:text-7xl font-bold font-heading text-foreground'>
              {project.title}
            </h1>
            <p className='text-xl md:text-2xl text-muted-foreground font-text'>
              {project.subtitle}
            </p>
          </div>
        }
      >
        <ParallaxImage
          src={project.coverUrl || '/placeholder.svg'}
          alt={project.title}
          overflow={1.2}
          priority
          global
        />
      </ContainerScroll>

      <section className='section-px flex flex-col gap-4 mt-8 pb-32 h-screen'>
        
      </section>
    </PageTransition>
  );
}
