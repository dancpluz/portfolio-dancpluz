'use server';

import { ApiResponse, pb } from '@/lib/pocketbase';
import { serverLogger } from '@/lib/logger';
import { TestimonialsResponse } from '@/types/pocketbase';
import { Testimonial } from '@/types/api';
import { transformTestimonial } from '@/lib/transformers';

export async function getTestimonials(): Promise<ApiResponse<Testimonial[]>> {
  try {
    serverLogger.info('[getTestimonials] Fetching testimonials');
    const records = await pb
      .collection('testimonials')
      .getFullList<TestimonialsResponse>({
        requestKey: null,
      });

    const transformed: Testimonial[] = records.map(transformTestimonial);

    serverLogger.info(
      `[getTestimonials] Fetched ${records.length} testimonials`,
    );
    return { data: transformed, error: null };
  } catch (err: any) {
    if (err?.isAbort) {
      serverLogger.info('[getTestimonials] Request auto-cancelled, ignoring');
      return { data: [], error: null };
    }
    serverLogger.error(`[getTestimonials] Error fetching testimonials: ${err}`);
    return { data: [], error: null };
  }
}
