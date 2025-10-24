import { PostsResponse } from '@/types/pocketbase';
import PostCard from './post-card';

interface PostListProps {
  posts: PostsResponse[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <ul>
      {Array(10)
        .fill(posts[0])
        .map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
    </ul>
  );
}
