import {
  ExperienceResponse,
  IconsResponse,
  PostsResponse,
  ProjectsResponse,
  TypedPocketBase,
} from '@/types/pocketbase';
import PocketBase from 'pocketbase';
import { parseApiError } from './utils';

const pb = new PocketBase(process.env.API_URL) as TypedPocketBase;

type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};

export function buildImageUrl<T extends Record<string, any>>(
  record: T,
  firstFilename: string
): string {
  return pb.files.getUrl(record, firstFilename);
}

export type IconsExpand = {
  icon_refs: IconsResponse[];
};

export async function getProjects() {
  try {
    const records = await pb
      .collection('projects')
      .getFullList<ProjectsResponse<IconsExpand>>({
        expand: 'icon_refs',
      });
    return records;
  } catch (error) {
    throw error;
  }
}

export async function getTechnologies() {
  try {
    const records = await pb.collection('icons').getFullList({
      filter: 'technology = true',
    });
    return records;
  } catch (error) {
    console.log('Erro: ', error);
    throw error;
  }
}

export type IconExpand = {
  icon_ref: IconsResponse;
};

export async function getExperience() {
  try {
    const records = await pb
      .collection('experience')
      .getFullList<ExperienceResponse<IconExpand>>({
        sort: '+start_date',
        expand: 'icon_ref',
      });
    return records;
  } catch (error) {
    console.log('Erro: ', error);
    throw error;
  }
}

export async function getContact() {
  try {
    const records = await pb.collection('icons').getFullList({
      filter: 'contact = true',
    });
    return records;
  } catch (error) {
    console.log('Erro: ', error);
    throw error;
  }
}

export async function getPosts(
  category?: string
): Promise<ApiResponse<PostsResponse[]>> {
  try {
    const records = await pb.collection('posts').getFullList<PostsResponse>({
      sort: '-updated',
      filter: category ? `category = "${category}"` : '',
    });
    return { data: records, error: null };
  } catch (err) {
    console.log('[ERROR]: ', err);
    const errorMessage = parseApiError(err, 'posts');

    return { data: null, error: errorMessage };
  }
}

export async function getPostById(
  id: string
): Promise<ApiResponse<PostsResponse>> {
  try {
    const record = await pb.collection('posts').getOne<PostsResponse>(id);
    return { data: record, error: null };
  } catch (err) {
    console.log('[ERROR]: ', err);
    const errorMessage = parseApiError(err, 'post');
    return { data: null, error: errorMessage };
  }
}
