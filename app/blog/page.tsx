import PostList from '@/components/blog/post-list';
import { getPosts } from '@/lib/api';
import React from 'react';
import Section from '@/components/blog/section';

export const metadata = {
  title: 'Blog',
  description: 'Minhas ideias idiotas',
};

export const revalidate = 0;

export default async function Blog() {
  const { data: posts, error } = await getPosts();

  if (error) {
    return (
      <Section>
        <p className='text-red-500'>{error}</p>
      </Section>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <Section>
        <div>Nenhum post encontrado ainda.</div>
      </Section>
    );
  }

  return (
    <Section posts={posts}>
      {/* <pre>{JSON.stringify(posts, null, 2)}</pre> */}
      <PostList posts={posts} />
    </Section>
  );
}

