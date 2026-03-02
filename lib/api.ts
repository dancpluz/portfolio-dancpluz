import {
  ExperienceResponse,
  IconsResponse,
  PostsResponse,
  ProjectsResponse,
  TypedPocketBase,
} from '@/types/pocketbase';
import PocketBase from 'pocketbase';
import { parseApiError } from './utils';
import { serverLogger } from './logger';

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
    serverLogger.info(`[buildImageUrl] Building image URL: ${record.id} ${firstFilename}`);
    return pb.files.getURL(record, firstFilename);
  } catch (error) {
    serverLogger.error(`[buildImageUrl] Error building image URL: ${error}`);
    throw error;
  }
}

export type IconsExpand = {
  icon_refs: IconsResponse[];
};

export async function getProjects(): Promise<ApiResponse<ProjectsResponse<IconsExpand>[]>> {
  try {
    serverLogger.info("[getProjects] Fetching projects");
    const records = await pb
      .collection('projects')
      .getFullList<ProjectsResponse<IconsExpand>>({
        expand: 'icon_refs',
      });
    serverLogger.info(`[getProjects] Fetched ${records.length} projects`);
    return { data: records, error: null };
  } catch (err) {
    serverLogger.error(`[getProjects] Error fetching projects: ${err}`);
    const errorMessage = parseApiError(err, 'projects');
    return { data: null, error: errorMessage };
  }
}

export async function getTechnologies(): Promise<ApiResponse<IconsResponse[]>> {
  try {
    serverLogger.info("[getTechnologies] Fetching technologies");
    const records = await pb.collection('icons').getFullList({
      filter: 'technology = true',
    });
    serverLogger.info(`[getTechnologies] Fetched ${records.length} technologies`);
    return { data: records, error: null };
  } catch (err) {
    serverLogger.error(`[getTechnologies] Error fetching technologies: ${err}`);
    const errorMessage = parseApiError(err, 'technologies');
    return { data: null, error: errorMessage };
  }
}

export type IconExpand = {
  icon_ref: IconsResponse;
};

export async function getExperience(): Promise<ApiResponse<ExperienceResponse<IconExpand>[]>> {
  try {
    serverLogger.info("[getExperience] Fetching experiences");
    const records = await pb
      .collection('experience')
      .getFullList<ExperienceResponse<IconExpand>>({
        sort: '+start_date',
        expand: 'icon_ref',
      });
    serverLogger.info(`[getExperience] Fetched ${records.length} experiences`);
    return { data: records, error: null };
  } catch (err) {
    serverLogger.error(`[getExperience] Error fetching experiences: ${err}`);
    const errorMessage = parseApiError(err, 'experiences');
    return { data: null, error: errorMessage };
  }
}

// export async function getContact() {
//   try {
//     serverLogger.info('Fetching contact');
//     const records = await pb.collection('icons').getFullList({
//       filter: 'contact = true',
//     });
//     return records;
//   } catch (error) {
//     serverLogger.error('Error fetching contact: ', error);
//     throw error;
//   }
// }

export async function getPosts(
  category?: string
): Promise<ApiResponse<PostsResponse[]>> {
  try {
    serverLogger.info(`[getPosts] Fetching posts ${category ? `from category ${category}` : ''}`);
    const records = await pb.collection('posts').getFullList<PostsResponse>({
      sort: '-updated',
      filter: category ? `category = "${category}"` : '',
    });
    serverLogger.info(`[getPosts] Fetched ${records.length} posts ${category ? `from category ${category}` : ''}`);
    return { data: records, error: null };
  } catch (err) {
    serverLogger.error(`[getPosts] Error fetching posts: ${err}`);
    const errorMessage = parseApiError(err, 'posts');

    return { data: null, error: errorMessage };
  }
}

export async function getPostById(
  id: string
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
