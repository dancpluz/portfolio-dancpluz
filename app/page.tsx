import Scene from '@/components/landing/3d-scene';
import { CustomLoader } from '@/components/landing/custom-loader';
import { Suspense } from 'react';

export default async function HomePage() {
  return (
    <main className=''>
      <Suspense fallback={<CustomLoader />}>
        <Scene />
      </Suspense>
    </main>
  );
}
