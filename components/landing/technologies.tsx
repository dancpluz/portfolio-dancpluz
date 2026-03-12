import { getTechnologies } from '@/actions/icons';
import LogoCarousel from './logo-carousel';

export default async function Technologies() {
  const { data: technologies, error } = await getTechnologies();

  if (error || !technologies) {
    return null;
  }

  return (
    <section className='w-full'>
      <LogoCarousel logos={technologies} columnCount={5} />
    </section>
  );
}
