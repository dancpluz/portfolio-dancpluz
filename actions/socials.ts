'use server';

import { ApiResponse, pb, IconExpand, buildImageUrl } from '@/lib/pocketbase';
import { serverLogger } from '@/lib/logger';
import { SocialsResponse } from '@/types/pocketbase';
import { Social } from '@/types/api';
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

    const transformed: Social[] = records.map((record) => ({
      id: record.id,
      url: record.url || '#',
      text: record.text || '',
      iconUrl: record.expand?.icon_ref
        ? buildImageUrl(record.expand.icon_ref, record.expand.icon_ref.icon)
        : '',
      iconAlt: record.expand?.icon_ref?.alt || record.text || '',
    }));

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
