import { plural } from '@/lib/utils';
import { PostsCategoryOptions, PostsResponse } from '@/types/pocketbase';
import BlogContainer from '@/components/blog/container';
import CategoriesButtons from './categories-buttons';
import { Suspense } from 'react';
import { useTranslations } from 'next-intl';

interface BlogSectionProps {
  children: React.ReactNode;
  posts?: PostsResponse[];
  categories?: PostsCategoryOptions[];
}

export default function BlogSection({ children, posts, categories }: BlogSectionProps) {
  const t = useTranslations('blog');

  return (
    <BlogContainer>
      <section className='space-y-8'>
        <div className='flex w-full items-center gap-6'>
          <h1 className='text-7xl font-heading uppercase underline-magical-2 bg-size-[100%_0.1em]'>
            {t('heading')}
          </h1>
          <div className='flex flex-col items-end w-full justify-between'>
            <Suspense>
              <CategoriesButtons categories={categories ?? []} />
            </Suspense>
            <span className='h-px flex w-full bg-accent' />
            {posts && (
              <p className='text-sm'>
                {t('articles_found', { count: posts.length })}
              </p>
            )}
          </div>
        </div>
        {children}
      </section>
    </BlogContainer>
  );
}
