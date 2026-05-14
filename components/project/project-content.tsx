import { ContainerScroll } from '@/components/project/container-scroll-animation';
import ParallaxImage from '@/components/project/parallax-image';
import MediaCarousel from '@/components/project/media-carousel';
import ArticleRenderer from '@/components/blog/post/article-renderer';
import { Reveal } from '@/components/motion/reveal';
import BracketText from '@/components/ui/bracket-text';
import { Project } from '@/types/api';
import { useLocale } from 'next-intl';
import { useMemo } from 'react';
import FlipText from '../extra/flip-text';
import { formatDateLocal } from '@/lib/utils';

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

  const formattedDate = useMemo(() => {
    return formatDateLocal(project.date, locale, true);
  }, [project.date]);

  return (
    <>
      <ContainerScroll
        titleComponent={
          <div className='flex flex-col gap-4 mb-4 relative'>
            <FlipText
              text={title}
              duration={0.25}
              staggerDelay={0.03}
              className='text-4xl uppercase md:text-8xl font-bold font-heading text-foreground px-32 mx-auto'
            />
            <BracketText
              text={subtitle}
              accentClass='text-accent-3'
              className='text-2xl text-foreground font-medium font-heading'
            />
            <BracketText
              text={project.projectType}
              accentClass='text-accent-1'
              className='absolute top-0 left-0'
            />
            {project.date && (
              <BracketText
                text={formattedDate}
                accentClass='text-accent-2'
                className='absolute top-0 right-0'
              />
            )}
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

      <div className='flex w-full flex-col gap-12 items-center px-92'>
        <div className='flex justify-between gap-4 w-full flex-wrap'>
          {project.categories.map((category, index) => {
            const accents = ['text-accent-1', 'text-accent-2', 'text-accent-3'];
            const accentClass = accents[index % accents.length];
            return (
              <BracketText
                key={category}
                text={category}
                accentClass={accentClass}
                className='text-2xl text-foreground font-heading'
              />
            );
          })}
        </div>
        <h1 className='text-4xl md:text-6xl w-full text-left font-bold font-heading text-foreground'>
          {locale === 'en' ? 'What is this project?' : 'O que é esse projeto?'}
        </h1>
        {/* Description (HTML rendered like blog article) */}
        {description && (
          <Reveal direction='up' delay={0.2} duration={0.8}>
            <ArticleRenderer dirtyHtml={description} />
          </Reveal>
        )}
      </div>
      {/* Medias — full-bleed outside the padded column */}
      {project.medias.length > 0 && (
        <div className='w-full my-20 md:my-32'>
          <MediaCarousel images={project.medias} title={title} />
        </div>
      )}
      {((locale === 'en' ? project.clientEn : project.clientPt) ||
        project.clientPt ||
        project.clientEn) && (
        <div className='mx-auto'>
          <BracketText
            text={`${locale === 'en' ? 'made for' : 'feito para'} ${
              locale === 'en'
                ? project.clientEn || project.clientPt
                : project.clientPt || project.clientEn
            }`}
            accentClass='text-accent-1'
            className='text-lg font-heading font-medium transition-all duration-300 ease-out'
          />
        </div>
      )}
    </>
  );
}
