'use client';

import { PostsResponse } from '@/types/pocketbase';
import PostCard from './post-card';
import { AnimatePresence } from 'motion/react';

interface PostListProps {
  posts: PostsResponse[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <AnimatePresence mode='popLayout'>
      <ul>
        {posts.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </ul>
    </AnimatePresence>
  );
}
