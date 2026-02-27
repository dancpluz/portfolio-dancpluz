'use client';

import { Skeleton } from "@/components/ui/skeleton";
import BlogContainer from "@/components/blog/container";
import { useTranslations } from "next-intl";
import React from 'react';

export function CategoriesButtonsSkeleton() {
  return (
    <div className='flex gap-2 h-[24px] items-center'>
      {[1, 2, 3].map((i, index) => (
        <React.Fragment key={i}>
          <Skeleton className="h-5 w-16" />
          {index !== 2 && <span className='grow flex my-1 w-px bg-foreground/50' />}
        </React.Fragment>
      ))}
    </div>
  );
}

export function PostCardSkeleton() {
  return (
    <li className='last:border-b-0 border-b border-foreground/20 py-5 flex gap-4 w-full overflow-hidden'>
      <div className='shrink-0 aspect-square size-20 border border-accent/20 grid place-items-center'>
        <Skeleton className='size-full rounded-none' />
      </div>
      <div className='space-y-4 w-full py-1'>
        <div className='flex gap-4 w-full justify-between'>
          <Skeleton className='h-6 w-1/3 min-w-[120px]' />
          <span className='flex grow h-px bg-accent/20 self-center' />
          <Skeleton className='h-4 w-24 shrink-0' />
        </div>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[90%]' />
          <Skeleton className='h-4 w-[80%]' />
        </div>
      </div>
    </li>
  );
}

export function PostListSkeleton() {
  return (
    <ul className="w-full">
      <PostCardSkeleton />
      <PostCardSkeleton />
      <PostCardSkeleton />
      <PostCardSkeleton />
    </ul>
  );
}

export function BlogSectionSkeleton() {
  const t = useTranslations('blog');
  
  return (
    <BlogContainer>
      <section className='space-y-8'>
        <div className='flex w-full items-center gap-6 opacity-60'>
          <h1 className='text-7xl font-heading uppercase underline-magical-2 bg-size-[100%_0.1em] text-foreground/40'>
            {t('heading')}
          </h1>
          <div className='flex flex-col items-end w-full justify-between h-[72px] py-1'>
            <CategoriesButtonsSkeleton />
            <span className='h-px flex w-full bg-accent/20' />
            <Skeleton className="h-4 w-32 mt-1" />
          </div>
        </div>
        <PostListSkeleton />
      </section>
    </BlogContainer>
  );
}

export function ArticlePageSkeleton() {
  return (
    <>
      <article className='prose prose-lg max-w-none w-full'>
        <div className='max-w-3xl mx-auto'>
          <Skeleton className="h-12 w-[60%] mb-10 mt-6" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-[85%] mb-6" />
          
          <Skeleton className="h-8 w-[40%] mb-4 mt-10" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-[90%] mb-6" />
          
          <Skeleton className="h-64 w-full rounded-lg my-8" />
          
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-[75%] mb-3" />
        </div>
      </article>
      <nav className=''>
        <div className='sticky top-24 w-58'>
          <Skeleton className="h-5 w-32 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[60%] ml-3" />
            <Skeleton className="h-4 w-[85%]" />
            <Skeleton className="h-4 w-[70%] ml-3" />
          </div>
        </div>
      </nav>
    </>
  );
}
