'use client';

import PostCard from './post-card';
import { AnimatePresence } from 'motion/react';
import { PostsResponse } from '@/types/pocketbase';

export default function PostList({
  posts,
}: Readonly<{ posts: PostsResponse[] }>) {
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
