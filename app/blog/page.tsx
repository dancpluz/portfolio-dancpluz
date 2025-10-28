import PostList from '@/components/blog/post-list';
import { getPosts } from '@/lib/api';
import React from 'react';
import Section from '@/components/blog/section';
import {
  createLoader,
  parseAsStringEnum,
  SearchParams,
} from 'nuqs/server';
import { PostsCategoryOptions } from '@/types/pocketbase';
import { getPostCategories } from '@/lib/utils';

export const metadata = {
  title: 'Blog',
  description: 'Minhas ideias idiotas',
};

export const revalidate = 30;

const loadCategoryParams = createLoader({
  categoria: parseAsStringEnum<PostsCategoryOptions>(
    Object.values(PostsCategoryOptions)
  ),
});

export default async function Blog({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { categoria } = await loadCategoryParams(searchParams);

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

  const filteredPosts =
    categoria && posts
      ? posts.filter((post) => post.category === categoria)
      : posts;

  const categories = posts ? getPostCategories(posts) : [];

  return (
    <Section posts={filteredPosts} categories={categories}>
      <PostList posts={filteredPosts} />
    </Section>
  );
}
