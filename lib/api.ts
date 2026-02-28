import {
  ExperienceResponse,
  IconsResponse,
  PostsResponse,
  ProjectsResponse,
  TypedPocketBase,
} from '@/types/pocketbase';
import PocketBase from 'pocketbase';
import { parseApiError } from './utils';
import logger from './logger';

const pb = new PocketBase(process.env.PB_API_URL) as TypedPocketBase;

type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};

export function buildImageUrl<T extends Record<string, any>>(
  record: T,
  firstFilename: string
): string {
  try {
    logger.info(`[buildImageUrl] Building image URL: ${record.id} ${firstFilename}`);
    return pb.files.getURL(record, firstFilename);
  } catch (error) {
    logger.error(`[buildImageUrl] Error building image URL: ${error}`);
    throw error;
  }
}

export type IconsExpand = {
  icon_refs: IconsResponse[];
};

export async function getProjects() {
  try {
    logger.info("[getProjects] Fetching projects");
    const records = await pb
      .collection('projects')
      .getFullList<ProjectsResponse<IconsExpand>>({
        expand: 'icon_refs',
      });
    logger.info(`[getProjects] Fetched ${records.length} projects`);
    return records;
  } catch (error) {
    logger.error(`[getProjects] Error fetching projects: ${error}`);
    throw error;
  }
}

export async function getTechnologies() {
  try {
    logger.info("[getTechnologies] Fetching technologies");
    const records = await pb.collection('icons').getFullList({
      filter: 'technology = true',
    });
    logger.info(`[getTechnologies] Fetched ${records.length} technologies`);
    return records;
  } catch (error) {
    logger.error(`[getTechnologies] Error fetching technologies: ${error}`);
    throw error;
  }
}

export type IconExpand = {
  icon_ref: IconsResponse;
};

export async function getExperience() {
  try {
    logger.info("[getExperience] Fetching experiences");
    const records = await pb
      .collection('experience')
      .getFullList<ExperienceResponse<IconExpand>>({
        sort: '+start_date',
        expand: 'icon_ref',
      });
    logger.info(`[getExperience] Fetched ${records.length} experiences`);
    return records;
  } catch (error) {
    logger.error(`[getExperience] Error fetching experiences: ${error}`);
    throw error;
  }
}

// export async function getContact() {
//   try {
//     logger.info('Fetching contact');
//     const records = await pb.collection('icons').getFullList({
//       filter: 'contact = true',
//     });
//     return records;
//   } catch (error) {
//     logger.error('Error fetching contact: ', error);
//     throw error;
//   }
// }

export async function getPosts(
  category?: string
): Promise<ApiResponse<PostsResponse[]>> {
  try {
    logger.info(`[getPosts] Fetching posts ${category ? `from category ${category}` : ''}`);
    const records = await pb.collection('posts').getFullList<PostsResponse>({
      sort: '-updated',
      filter: category ? `category = "${category}"` : '',
    });
    logger.info(`[getPosts] Fetched ${records.length} posts ${category ? `from category ${category}` : ''}`);
    return { data: records, error: null };
  } catch (err) {
    logger.error(`[getPosts] Error fetching posts: ${err}`);
    const errorMessage = parseApiError(err, 'posts');

    return { data: null, error: errorMessage };
  }
}

export async function getPostById(
  id: string
): Promise<ApiResponse<PostsResponse>> {
  try {
    logger.info(`[getPostById] Fetching post by Id: ${id}`);
    const record = await pb.collection('posts').getOne<PostsResponse>(id);
    logger.info(`[getPostById] Fetched post by Id: ${id}`);
    return { data: record, error: null };
  } catch (err) {
    logger.error(`[getPostById] Error fetching post by Id: ${err}`);
    const errorMessage = parseApiError(err, 'post');
    return { data: null, error: errorMessage };
  }
}
