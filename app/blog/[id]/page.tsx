import ArticleProgressBar from '@/components/blog/article-progress-bar';
import Container from '@/components/blog/container';
import { getPostById, getPosts } from '@/lib/api';
import { Suspense } from 'react';
import ArticleRenderer from '@/components/blog/article-renderer';
import { processArticleHtml } from '@/lib/utils';
import TableOfContents from '@/components/blog/table-contents';

export async function generateStaticParams() {
  const { data: posts, error } = await getPosts();

  if (error || !posts) {
    return [];
  }

  return posts.map((post) => ({ id: post.id }));
}

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

  const { article, title } = post || {};

  const { headings, processedHtml } = article ? processArticleHtml(article) : { headings: [], processedHtml: '' };

  return (
    <>
      <Suspense>
        <ArticleProgressBar />
      </Suspense>
      <Container>
        <aside className=''>
          <TableOfContents headings={headings} />
        </aside>
        <article className=''>
          <h1 className='font-heading uppercase text-3xl'>{title}</h1>
          <Suspense>
            <ArticleRenderer dirtyHtml={processedHtml} />
          </Suspense>
        </article>
      </Container>
    </>
  );
}
