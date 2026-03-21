import { getTechnologies } from '@/actions/technologies';
import LogoShowcase from './logo-showcase';
import FlipText from '../flip-text';

export default async function Technologies() {
  const { data: technologies, error } = await getTechnologies();

  if (error || !technologies) {
    return null;
  }

  return (
    <section className='w-full flex flex-col items-center'>
      <FlipText text='Tecnologias' className='font-heading text-7xl' />
      <p className='text-xl font-regular mb-10'>Tecnologias que utilizo</p>
      <LogoShowcase logos={technologies} columnCount={5} />
    </section>
  );
}
