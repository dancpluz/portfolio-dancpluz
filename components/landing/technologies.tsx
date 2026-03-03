import LogoCarousel from './logo-carousel';
import { getTechnologies } from '@/lib/api';

export default async function Technologies() {
  const { data: technologies, error } = await getTechnologies();

  if (error || !technologies) {
    return null;
  }

  return (
    <div className='w-full'>
      <LogoCarousel logos={technologies} columnCount={5} />
    </div>
  );
}
