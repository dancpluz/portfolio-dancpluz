'use server';

import { ApiResponse, pb, ProjectExpand } from '@/lib/pocketbase';
import { ProjectsResponse } from '@/types/pocketbase';
import { serverLogger } from '@/lib/logger';
import { parseApiError } from '@/lib/utils';
import { Project } from '@/types/api';
import { transformProject } from '@/lib/transformers';

export async function getProjects(): Promise<ApiResponse<Project[]>> {
  try {
    serverLogger.info('[getProjects] Fetching projects');
    const records = await pb
      .collection('projects')
      .getFullList<ProjectsResponse<ProjectExpand>>({
        expand: 'social_refs, social_refs.icon_ref',
        requestKey: null,
      });

    const transformed = records.map(transformProject);

    serverLogger.info(`[getProjects] Fetched ${records.length} projects`);
    return { data: transformed, error: null };
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
