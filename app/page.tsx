import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('home');

  return (
    <main className='h-screen flex items-center justify-center'>
      <h1 className='text-7xl font-heading uppercase underline-magical-2 bg-size-[100%_0.1em]'>
        {t('part1')} <br /> {t('part2')}
      </h1>
    </main>
  );
}
