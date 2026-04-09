'use server';

import { ApiResponse, pb, IconExpand } from '@/lib/pocketbase';
import { serverLogger } from '@/lib/logger';
import { SocialsResponse } from '@/types/pocketbase';
import { Social } from '@/types/api';
import { transformSocial } from '@/lib/transformers';
import { DEFAULT_SOCIALS } from '@/lib/constant';

export async function getSocials(
  main?: boolean,
): Promise<ApiResponse<Social[]>> {
  try {
    serverLogger.info('[getSocials] Fetching socials');

    const filter = main === undefined ? '' : `main = ${main}`;

    const records = await pb
      .collection('socials')
      .getFullList<SocialsResponse<IconExpand>>({
        requestKey: null,
        expand: 'icon_ref',
        filter,
      });

    const transformed: Social[] = records.map(transformSocial);

    serverLogger.info(`[getSocials] Fetched ${records.length} socials`);
    return { data: transformed, error: null };
  } catch (error: any) {
    if (error?.isAbort) {
      serverLogger.info('[getSocials] Request auto-cancelled, ignoring');
      return { data: [], error: null };
    }
    serverLogger.error(`[getSocials] Error fetching socials: ${error}`);
    // Return defaults as a fallback when DB is not working
    return { data: DEFAULT_SOCIALS, error: null };
  }
}
