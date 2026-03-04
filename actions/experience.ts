'use server';

import { ApiResponse, IconExpand, pb } from "@/lib/api";
import { ExperienceResponse } from "@/types/pocketbase";
import { serverLogger } from "@/lib/logger";
import { parseApiError } from "@/lib/utils";


export async function getExperience(): Promise<
  ApiResponse<ExperienceResponse<IconExpand>[]>
> {
  try {
    serverLogger.info('[getExperience] Fetching experiences');
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
