import { PostsResponse } from "@/types/pocketbase";

interface PostListProps {
  posts: PostsResponse[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}