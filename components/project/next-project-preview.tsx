import TransitionLink from '@/components/transition-link';
import { Project } from '@/types/api';
import { useLocale } from 'next-intl';
import ParallaxImage from './parallax-image';
import BracketText from '../ui/bracket-text';

export default function NextProjectPreview({
  project,
}: Readonly<{
  project: Project;
}>) {
  const locale = useLocale();

  const title = locale === 'en' ? project.titleEn : project.titlePt;
  const subtitle = locale === 'en' ? project.subtitleEn : project.subtitlePt;

  return (
    <TransitionLink
      href={`/obra/${project.id}`}
      className='w-full relative flex flex-col items-center justify-center group cursor-pointer pixel-corners-border mt-32'
    >
      <div className='absolute inset-0 z-0 h-[400px] pointer-events-none'>
        <ParallaxImage
          src={project.coverUrl || '/placeholder.svg'}
          alt={title}
          global={false}
          className='brightness-50 group-hover:brightness-75 transition-all duration-700 ease-in-out'
        />
      </div>

      <div className='relative z-10 flex flex-col items-center justify-center p-20 gap-4 h-[400px]'>
        <p className='text-sm uppercase tracking-widest font-heading text-neutral-300'>
          {locale === 'en' ? 'Next Project' : 'Próximo Projeto'}
        </p>
        <h2 className='text-4xl md:text-6xl font-bold font-heading text-foreground group-hover:-translate-y-2 transition-transform duration-500 ease-out'>
          {title}
        </h2>
        {subtitle && (
          <BracketText
            text={subtitle}
            accentClass='text-accent-1'
            className='text-xl md:text-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 ease-out'
          />
        )}
      </div>
    </TransitionLink>
  );
}
