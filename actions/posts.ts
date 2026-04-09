'use server';

import { ApiResponse, pb } from '@/lib/pocketbase';
import { serverLogger } from '@/lib/logger';
import { parseApiError } from '@/lib/utils';
import { PostsResponse } from '@/types/pocketbase';

export async function getPosts(
  category?: string,
): Promise<ApiResponse<PostsResponse[]>> {
  try {
    const filter = category ? `category = "${category}"` : '';
    serverLogger.info(`[getPosts] Fetching posts ${filter}`);
    const records = await pb.collection('posts').getFullList<PostsResponse>({
      sort: '-updated',
      filter,
      requestKey: null,
    });
    serverLogger.info(`[getPosts] Fetched ${records.length} posts ${filter}`);
    return { data: records, error: null };
  } catch (err: any) {
    if (err?.isAbort) {
      serverLogger.info('[getPosts] Request auto-cancelled, ignoring');
      return { data: [], error: null };
    }
    serverLogger.error(`[getPosts] Error fetching posts: ${err}`);
    const errorMessage = parseApiError(err, 'posts');

    return { data: null, error: errorMessage };
  }
}

export async function getPostById(
  id: string,
): Promise<ApiResponse<PostsResponse>> {
  try {
    serverLogger.info(`[getPostById] Fetching post by Id: ${id}`);
    const record = await pb.collection('posts').getOne<PostsResponse>(id, {
      requestKey: null,
    });
    serverLogger.info(`[getPostById] Fetched post by Id: ${id}`);
    return { data: record, error: null };
  } catch (err: any) {
    if (err?.isAbort) {
      serverLogger.info(`[getPostById] Request auto-cancelled for Id: ${id}, ignoring`);
      return { data: null, error: null };
    }
    serverLogger.error(`[getPostById] Error fetching post by Id: ${err}`);
    const errorMessage = parseApiError(err, 'post');

    return { data: null, error: errorMessage };
  }
}
