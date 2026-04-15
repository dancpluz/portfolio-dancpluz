import { ContainerScroll } from '@/components/project/container-scroll-animation';
import ParallaxImage from '@/components/project/parallax-image';
import ScrollParallaxImage from '@/components/project/scroll-parallax-image';
import ArticleRenderer from '@/components/blog/post/article-renderer';
import { Reveal } from '@/components/motion/reveal';
import { Project } from '@/types/api';
import { useLocale } from 'next-intl';

export default function ProjectContent({
  project,
}: Readonly<{
  project: Project;
}>) {
  const locale = useLocale();

  const title = locale === 'en' ? project.titleEn : project.titlePt;
  const subtitle = locale === 'en' ? project.subtitleEn : project.subtitlePt;
  const description =
    locale === 'en' ? project.descriptionEn : project.descriptionPt;

  return (
    <>
      <ContainerScroll
        titleComponent={
          <div className='flex flex-col gap-4 mb-4'>
            <h1 className='text-4xl md:text-7xl font-bold font-heading text-foreground'>
              {title}
            </h1>
            <p className='text-xl md:text-2xl text-muted-foreground font-text'>
              {subtitle}
            </p>
          </div>
        }
      >
        <ParallaxImage
          src={project.coverUrl || '/placeholder.svg'}
          alt={title}
          overflow={1.2}
          priority
          global
        />
      </ContainerScroll>

      <div className='flex w-full flex-col gap-8 items-center px-92'>
        <h1 className='text-4xl md:text-6xl w-full text-left font-bold font-heading text-foreground'>
          {locale === 'en' ? 'What is this project?' : 'O que é esse projeto?'}
        </h1>
        {/* Description (HTML rendered like blog article) */}
        {description && (
          <Reveal direction='up' delay={0.2} duration={0.8}>
            <ArticleRenderer dirtyHtml={description} />
          </Reveal>
        )}
        {/* Medias */}
        {project.medias.length > 0 && (
          <div className='flex flex-col gap-4 w-full'>
            {project.medias.map((media, index) => (
              <ScrollParallaxImage
                key={`${title} - ${index + 1}`}
                src={media}
                alt={`${title} - ${index + 1}`}
                className='pixel-corners-big'
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
