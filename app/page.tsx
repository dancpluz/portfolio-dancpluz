import { Suspense } from 'react';

export default async function HomePage() {
  return (
    <main className='h-[300vh]'>
      <Suspense fallback={<></>}>
        <h1>Teste</h1>
      </Suspense>
    </main>
  );
}
