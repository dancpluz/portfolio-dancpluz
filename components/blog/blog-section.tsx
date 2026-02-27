import { PostsCategoryOptions, PostsResponse } from '@/types/pocketbase';
import BlogContainer from '@/components/blog/container';
import CategoriesButtons from './categories-buttons';
import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { CategoriesButtonsSkeleton } from './skeletons';
import { LineReveal, Reveal } from '../motion/reveal';

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
          <Reveal direction='down' className='flex items-center gap-6'>
            <h1 className='text-7xl font-heading uppercase underline-magical-2 bg-size-[100%_0.1em]'>
              {t('heading')}
            </h1>
          </Reveal>
          <div className='flex flex-col items-end w-full justify-between'>
            <Suspense fallback={<CategoriesButtonsSkeleton />}>
              <Reveal direction='down' delay={0.2} duration={1}>
                <CategoriesButtons categories={categories ?? []} />
              </Reveal>
            </Suspense>
            <LineReveal delay={0.4} />
            <Reveal direction='up' delay={0.6} duration={1}>
              {posts && (
                <p className='text-sm'>
                  {t('articles_found', { count: posts.length })}
                </p>
              )}
            </Reveal>
          </div>
        </div>
        {children}
      </section>
    </BlogContainer>
  );
}
