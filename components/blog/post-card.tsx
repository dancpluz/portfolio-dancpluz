'use client'

import { formatDatePtBR } from "@/lib/utils";
import { PostsResponse } from "@/types/pocketbase"
import { motion } from "framer-motion";
import Link from "next/link"

interface PostCardProps {
  post: PostsResponse
  index: number
}

export default function PostCard({ post, index }: PostCardProps) {
  return (
    <motion.li
      key={post.id}
      className='border-b transition-colors duration-500'
      initial={{ scale: 0.8, opacity: 0, filter: 'blur(2px)' }}
      animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, delay: index / 10 }}
    >
      <Link
        href={`/blog/${post.id}`}
        aria-label={`Leia "${post.title}"`}
      >
        <article className='space-y-2 py-5 border-b border-gray-300/20'>
          <div className='flex w-full items-center justify-between'>
            <h2 className='text-md w-full max-w-2xl truncate whitespace-nowrap pr-2 font-medium group-hover:underline md:w-auto md:flex-none md:text-xl'>
              {post.title}
            </h2>
            <div className='mx-1 flex flex-1 border-b border-primary-500' />
            <time className='w-max whitespace-nowrap text-sm pl-2'>
              {formatDatePtBR(post.created)}
            </time>
          </div>
          <p className=''>
            {post.long_text}
          </p>
        </article>
      </Link>
    </motion.li>
  );
}
