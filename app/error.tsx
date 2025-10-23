'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2 className='base'>Algo deu errado ao carregar os posts</h2>
      <button onClick={reset}>Tentar novamente</button>
    </div>
  );
}
