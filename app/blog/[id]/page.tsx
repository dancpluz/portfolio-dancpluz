import ArticleProgressBar from '@/components/blog/article-progress-bar';
import Container from '@/components/blog/container';
import { getPostById, getPosts } from '@/lib/api';
import { Suspense } from 'react';
import ArticleRenderer from '@/components/blog/article-renderer';
import { processArticleHtml, formatDatePtBR } from '@/lib/utils';
import TableOfContents from '@/components/blog/table-contents';

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

  if (error) {
    return (
      <Container>
        <div>Error loading article: {error}</div>
      </Container>
    );
  }

  const { article, title, updated } = post || {};

  const { headings, processedHtml } = article ? processArticleHtml(article) : { headings: [], processedHtml: '' };

  return (
    <>
      <Suspense>
        <ArticleProgressBar />
      </Suspense>
      <Container>
        <div className='flex flex-col gap-2'>
          <h1 className='font-heading uppercase text-3xl leading-none underline-magical-2'>{title}</h1>
          <time className='text-foreground/70 text-sm'>{formatDatePtBR(updated ?? '')}</time>
        </div>
        <div className='mt-6 flex gap-10'>
          <Suspense>
            <ArticleRenderer dirtyHtml={processedHtml} />
            <TableOfContents headings={headings} />
          </Suspense>
        </div>
      </Container>
    </>
  );
}
