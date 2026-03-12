'use server';

import { ApiResponse, IconsExpand, pb } from '@/lib/pocketbase';
import { ProjectsResponse } from '@/types/pocketbase';
import { serverLogger } from '@/lib/logger';
import { parseApiError } from '@/lib/utils';

export async function getProjects(): Promise<
  ApiResponse<ProjectsResponse<IconsExpand>[]>
> {
  try {
    serverLogger.info('[getProjects] Fetching projects');
    const records = await pb
      .collection('projects')
      .getFullList<ProjectsResponse<IconsExpand>>({
        expand: 'icon_refs',
        requestKey: null,
      });
    serverLogger.info(`[getProjects] Fetched ${records.length} projects`);
    return { data: records, error: null };
  } catch (err: any) {
    if (err?.isAbort) {
      serverLogger.info('[getProjects] Request auto-cancelled, ignoring');
      return { data: [], error: null };
    }
    serverLogger.error(`[getProjects] Error fetching projects: ${err}`);
    const errorMessage = parseApiError(err, 'projects');
    return { data: null, error: errorMessage };
  }
}
