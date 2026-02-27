import Container from '@/components/blog/container';
import { Skeleton } from '@/components/ui/skeleton';
import { ArticlePageSkeleton } from '@/components/blog/skeletons';

export default function Loading() {
  return (
    <>
      <div className="fixed w-full h-1 bg-accent opacity-30 animate-pulse top-0 left-0 origin-left z-50" />
      <Container>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-9 w-[70%] max-w-2xl mb-1' />
          <Skeleton className='h-5 w-32 mt-1' />
        </div>
        <div className='mt-6 flex gap-10'>
          <ArticlePageSkeleton />
        </div>
      </Container>
    </>
  );
}
