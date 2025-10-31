import Scene from '@/components/landing/3d-scene';
import { Suspense } from 'react';

export default async function HomePage() {
  return (
    <main className='relative min-h-screen overflow-hidden'>
      <div className='h-[120vh]'>
        <Suspense>
          <Scene />
        </Suspense>
      </div>
      <div className='h-screen bg-accent'>
      </div>
    </main>
  );
}
