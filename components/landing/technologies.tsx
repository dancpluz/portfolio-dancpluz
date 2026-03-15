import { getTechnologies } from '@/actions/technologies';
import LogoShowcase from './logo-showcase';

export default async function Technologies() {
  const { data: technologies, error } = await getTechnologies();

  if (error || !technologies) {
    return null;
  }

  return (
    <section className='w-full'>
      <LogoShowcase logos={technologies} columnCount={5} />
    </section>
  );
}
