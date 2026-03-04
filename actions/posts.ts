'use server'

import { ApiResponse, pb } from "@/lib/api";
import { serverLogger } from "@/lib/logger";
import { parseApiError } from "@/lib/utils";
import { PostsResponse } from "@/types/pocketbase";

export async function getPosts(
  category?: string,
): Promise<ApiResponse<PostsResponse[]>> {
  try {
    serverLogger.info(
      `[getPosts] Fetching posts ${category ? `from category ${category}` : ''}`,
    );
    const records = await pb.collection('posts').getFullList<PostsResponse>({
      sort: '-updated',
      filter: category ? `category = "${category}"` : '',
    });
    serverLogger.info(
      `[getPosts] Fetched ${records.length} posts ${category ? `from category ${category}` : ''}`,
    );
    return { data: records, error: null };
  } catch (err) {
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
    const record = await pb.collection('posts').getOne<PostsResponse>(id);
    serverLogger.info(`[getPostById] Fetched post by Id: ${id}`);
    return { data: record, error: null };
  } catch (err) {
    serverLogger.error(`[getPostById] Error fetching post by Id: ${err}`);
    const errorMessage = parseApiError(err, 'post');

    return { data: null, error: errorMessage };
  }
}
