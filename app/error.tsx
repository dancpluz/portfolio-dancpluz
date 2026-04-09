'use client';

export default function ErrorPage({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return (
    <div>
      <h2 className='base'>Algo deu errado ao carregar os posts</h2>
      <button onClick={reset}>Tentar novamente</button>
    </div>
  );
}
