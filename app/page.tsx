import Scene from '@/components/landing/3d-scene';
import { Suspense } from 'react';

export default async function HomePage() {
  return (
    <main className='relative h-screen overflow-hidden'>
      <Suspense>
        <Scene />
      </Suspense>
    </main>
  );
}
