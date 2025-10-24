import { PostsResponse } from '@/types/pocketbase';
import PostCard from './post-card';

interface PostListProps {
  posts: PostsResponse[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <ul>
      {posts
        .map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
    </ul>
  );
}
