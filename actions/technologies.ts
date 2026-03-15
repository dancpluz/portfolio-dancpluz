'use server';

import { ApiResponse, IconExpand, pb } from '@/lib/pocketbase';
import { serverLogger } from '@/lib/logger';
import { TechnologiesResponse } from '@/types/pocketbase';
import { Technology } from '@/types/api';
import { transformTechnology } from '@/lib/transformers';

export async function getTechnologies(): Promise<ApiResponse<Technology[]>> {
  try {
    serverLogger.info('[getTechnologies] Fetching technologies');
    const records = await pb
      .collection('technologies')
      .getFullList<TechnologiesResponse<IconExpand>>({
        requestKey: null,
        expand: 'icon_ref',
      });

    const transformed: Technology[] = records.map(transformTechnology);

    serverLogger.info(
      `[getTechnologies] Fetched ${records.length} technologies`,
    );
    return { data: transformed, error: null };
  } catch (err: any) {
    if (err?.isAbort) {
      serverLogger.info('[getTechnologies] Request auto-cancelled, ignoring');
      return { data: [], error: null };
    }
    serverLogger.error(`[getTechnologies] Error fetching technologies: ${err}`);
    return { data: [], error: null };
  }
}
