import {
  IconsResponse,
  TypedPocketBase,
} from '@/types/pocketbase';
import PocketBase from 'pocketbase';
import { serverLogger } from './logger';

export const pb = new PocketBase(process.env.PB_API_URL) as TypedPocketBase;

export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};

export type IconsExpand = {
  icon_refs: IconsResponse[];
};

export type IconExpand = {
  icon_ref: IconsResponse;
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