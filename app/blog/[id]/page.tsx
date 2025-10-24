import Container from "@/components/blog/container";
import { getPostById, getPosts } from "@/lib/api";

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

  return (
    <Container>
      <div>{post?.title}</div>
    </Container>
  );
}
