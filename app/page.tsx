import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';

export default async function HomePage() {
  const t = await getTranslations('home');

  return (
    <div className={`flex w-full flex-col items-center justify-center`}>
      <main className='flex min-h-svh w-full flex-col gap-4 border border-foreground/20 p-8'>
        <Reveal direction='up' delay={0.2}>
          <h1 className='text-7xl font-heading uppercase underline-magical-2 bg-size-[100%_0.1em]'>
            {t('part1')} <br /> {t('part2')}
          </h1>
        </Reveal>
      </main>
    </div>
  );
}
