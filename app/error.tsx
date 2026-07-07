'use client';

import { useEffect } from 'react';
import { clientLogger } from '@/lib/logger';

export default function ErrorPage({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    clientLogger.error(
      `[ErrorBoundary] Unhandled error: ${error.message} (digest: ${error.digest ?? 'none'})`,
    );
  }, [error]);

  return (
    <div>
      <h2 className='base'>Algo deu errado ao carregar os posts</h2>
      <button onClick={reset}>Tentar novamente</button>
    </div>
  );
}
