'use server';

import { ApiResponse, pb } from '@/lib/pocketbase';
import { PolaroidsResponse } from '@/types/pocketbase';
import { serverLogger } from '@/lib/logger';
import { parseApiError } from '@/lib/utils';
import { Polaroid } from '@/types/api';
import { transformPolaroid } from '@/lib/transformers';

export async function getPolaroids(): Promise<ApiResponse<Polaroid[]>> {
  try {
    serverLogger.info('[getPolaroids] Fetching polaroids');
    const records = await pb
      .collection('polaroids')
      .getFullList<PolaroidsResponse>({
        requestKey: null,
      });

    const transformed = records.map(transformPolaroid);

    serverLogger.info(`[getPolaroids] Fetched ${records.length} polaroids`);
    return { data: transformed, error: null };
  } catch (err: any) {
    if (err?.isAbort) {
      serverLogger.info('[getPolaroids] Request auto-cancelled, ignoring');
      return { data: [], error: null };
    }
    serverLogger.error(`[getPolaroids] Error fetching polaroids: ${err}`);
    const errorMessage = parseApiError(err, 'polaroids');
    return { data: null, error: errorMessage };
  }
}
