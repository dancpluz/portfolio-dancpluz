import PostList from '@/components/blog/post-list';
import { getPosts } from '@/lib/api';
import BlogSection from '@/components/blog/blog-section';
import {
  createLoader,
  parseAsStringEnum,
  SearchParams,
} from 'nuqs/server';
import { PostsCategoryOptions } from '@/types/pocketbase';
import { getPostCategories } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('blog');
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

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
  const t = await getTranslations('blog');

  const { data: posts, error } = await getPosts();

  if (error) {
    return (
      <BlogSection>
        <p className='text-red-500'>{error}</p>
      </BlogSection>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <BlogSection>
        <div>{t('no_posts_found')}</div>
      </BlogSection>
    );
  }

  const filteredPosts =
    categoria && posts
      ? posts.filter((post) => post.category === categoria)
      : posts;

  const categories = posts ? getPostCategories(posts) : [];

  return (
    <BlogSection posts={filteredPosts} categories={categories}>
      <PostList posts={filteredPosts} />
    </BlogSection>
  );
}
