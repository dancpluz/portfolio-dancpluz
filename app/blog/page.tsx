import BlogContainer from '@/components/blog/container';
import { getPosts } from '@/lib/api';
import React from 'react';

export const metadata = {
  title: 'Blog',
  description: 'Minhas ideias idiotas',
};

export const revalidate = 0;

export default async function Blog() {
  const { data: posts, error } = await getPosts();

  if (error) {
    return (
      <BlogContainer>
        <p className='text-red-500'>{error}</p>
      </BlogContainer>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <BlogContainer>
        <div>Nenhum post encontrado ainda.</div>
      </BlogContainer>
    );
  }

  return (
    <BlogContainer>
      {/* <pre>{JSON.stringify(posts, null, 2)}</pre> */}
      <section>
        <h1 className='text-8xl base uppercase'>Blog</h1>
        <div className='posts-list'>
          {posts.map((post) => (
            <article key={post.id}>
              <h2>{post.title}</h2>
              {/* ... render other post details ... */}
            </article>
          ))}
        </div>
      </section>
    </BlogContainer>
  );
}
