'use server';

import { ApiResponse, IconExpand, pb } from '@/lib/pocketbase';
import { ExperienceResponse } from '@/types/pocketbase';
import { serverLogger } from '@/lib/logger';
import { parseApiError } from '@/lib/utils';
import { Experience } from '@/types/api';
import { transformExperience } from '@/lib/transformers';

export async function getExperience(): Promise<ApiResponse<Experience[]>> {
  try {
    serverLogger.info('[getExperience] Fetching experiences');
    const records = await pb
      .collection('experience')
      .getFullList<ExperienceResponse<IconExpand>>({
        sort: '+start_date',
        expand: 'icon_ref',
        requestKey: null,
      });

    const transformed = records.map(transformExperience);

    serverLogger.info(`[getExperience] Fetched ${records.length} experiences`);
    return { data: transformed, error: null };
  } catch (err: any) {
    if (err?.isAbort) {
      serverLogger.info('[getExperience] Request auto-cancelled, ignoring');
      return { data: [], error: null };
    }
    serverLogger.error(`[getExperience] Error fetching experiences: ${err}`);
    const errorMessage = parseApiError(err, 'experiences');
    return { data: null, error: errorMessage };
  }
}
