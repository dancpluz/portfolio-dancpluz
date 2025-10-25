import ArticleProgressBar from "@/components/blog/article-progress-bar";
import Container from "@/components/blog/container";
import { getPostById, getPosts } from "@/lib/api";
import { Suspense } from 'react';

export async function generateStaticParams() {
  const { data: posts, error } = await getPosts();

  if (error || !posts) {
    return [];
  }
  
  return posts.map(post => ({ id: post.id }));
}

export default async function Article(props: { params: Promise<{ id: string }> }) {
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

  return (
    <>
      <Suspense>
        <ArticleProgressBar />
      </Suspense>
      <Container>
        <div>{title}</div>
        <div dangerouslySetInnerHTML={{ __html: article || '' }} />
      </Container>
    </>
  );
}
