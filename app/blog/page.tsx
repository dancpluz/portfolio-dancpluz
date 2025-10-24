import BlogContainer from '@/components/blog/container';
import PostList from '@/components/blog/post-list';
import { getPosts } from '@/lib/api';
import { getPostCategories, plural } from '@/lib/utils';
import React from 'react';
import Link from 'next/link';

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

  const categories = getPostCategories(posts);

  return (
    <BlogContainer>
      {/* <pre>{JSON.stringify(posts, null, 2)}</pre> */}
      <section className='space-y-8'>
        <div className='flex w-full items-center gap-6'>
          <h1 className='text-7xl font-heading uppercase underline-magical-2 bg-size-[100%_0.1em]'>
            Ideias
          </h1>
          <div className='flex flex-col items-end w-full justify-between'>
            <div className='flex'>
              {categories.map((category) => (
                <p
                  className='underline-magical-2 font-semibold text-base'
                  key={category}
                >
                  {category}
                </p>
              ))}
            </div>
            <span className='h-px flex w-full bg-accent' />
            <p className='text-base'>
              {posts.length} artigo{plural(posts)} encontrado{plural(posts)}
            </p>
          </div>
        </div>
        <PostList posts={posts} />
      </section>
    </BlogContainer>
  );
}
