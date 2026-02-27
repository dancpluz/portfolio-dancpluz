import ArticleProgressBar from '@/components/blog/article-progress-bar';
import PostContainer from '@/components/blog/container';
import { getPostById, getPosts } from '@/lib/api';
import { Suspense } from 'react';
import ArticleRenderer from '@/components/blog/article-renderer';
import { processArticleHtml, formatDateLocal } from '@/lib/utils';
import TableOfContents from '@/components/blog/table-contents';
import { getLocale, getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/motion/reveal';
import BackButton from '@/components/ui/back-button';

export async function generateStaticParams() {
  const { data: posts, error } = await getPosts();

  if (error || !posts) {
    return [];
  }

  return posts.map((post) => ({ id: post.id }));
}

export const revalidate = 30;

export default async function Article(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const { data: post, error } = await getPostById(id);
  const t = await getTranslations('blog');
  const locale = await getLocale();

  if (error) {
    return (
      <PostContainer>
        <div>{t('error_loading')} {error}</div>
      </PostContainer>
    );
  }

  const { article, title, updated } = post || {};

  const { headings, processedHtml } = article ? processArticleHtml(article) : { headings: [], processedHtml: '' };

  return (
    <>
      <Suspense fallback={<div className="fixed w-full h-1 bg-accent opacity-30 animate-pulse top-0 left-0 origin-left z-50" />}>
        <ArticleProgressBar />
      </Suspense>
      <PostContainer>
        <div className="mb-6">
          <BackButton fallbackHref="/blog" />
        </div>
        <Reveal direction='down' duration={0.8} className='flex flex-col gap-2 relative z-10 w-full'>
          <h1 className='font-heading uppercase text-3xl leading-none underline-magical-2'>{title}</h1>
          <time className='text-foreground/70 text-sm'>{formatDateLocal(updated ?? '', locale)}</time>
        </Reveal>
        <div className='mt-6 flex gap-10 relative z-10'>
          <Reveal direction='up' delay={0.2} duration={0.8}>
            <ArticleRenderer dirtyHtml={processedHtml} />
          </Reveal>
          <Reveal direction='right' delay={0.4} className='hidden md:block'>
            <TableOfContents headings={headings} />
          </Reveal>
        </div>
      </PostContainer>
    </>
  );
}
