import { getPostCategories, plural } from "@/lib/utils";
import { PostsResponse } from "@/types/pocketbase";
import BlogContainer from '@/components/blog/container';

interface SectionProps {
  children: React.ReactNode;
  posts?: PostsResponse[];
}

export default function Section({ children, posts }: SectionProps) {
  const categories = posts ? getPostCategories(posts) : [];

  return (
    <BlogContainer>
      <section className='space-y-8'>
        <div className='flex w-full items-center gap-6'>
          <h1 className='text-7xl font-heading uppercase underline-magical-2 bg-size-[100%_0.1em]'>
            Ideias
          </h1>
          <div className='flex flex-col items-end w-full justify-between'>
            <div className='flex gap-2'>
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
            {posts && (
              <p className='text-base'>
                {posts.length} artigo{plural(posts)} encontrado{plural(posts)}
              </p>
            )}
          </div>
        </div>
        {children}
      </section>
    </BlogContainer>
  );
}
