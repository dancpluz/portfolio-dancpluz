'use server'

import { ApiResponse, pb } from "@/lib/api";
import { serverLogger } from "@/lib/logger";
import { parseApiError } from "@/lib/utils";
import { IconsResponse } from "@/types/pocketbase";

export async function getContacts(): Promise<ApiResponse<IconsResponse[]>> {
  try {
    serverLogger.info('[getContacts] Fetching contacts');
    const records = await pb.collection('icons').getFullList({
      filter: 'contact = true',
    });
    serverLogger.info(`[getContacts] Fetched ${records.length} contacts`);
    return { data: records, error: null };
  } catch (error) {
    serverLogger.error(`[getContacts] Error fetching contacts: ${error}`);
    const errorMessage = parseApiError(error, 'contacts');
    return { data: null, error: errorMessage };
  }
}

export async function getTechnologies(): Promise<ApiResponse<IconsResponse[]>> {
  try {
    serverLogger.info('[getTechnologies] Fetching technologies');
    const records = await pb.collection('icons').getFullList({
      filter: 'technology = true',
    });
    serverLogger.info(
      `[getTechnologies] Fetched ${records.length} technologies`,
    );
    return { data: records, error: null };
  } catch (err) {
    serverLogger.error(`[getTechnologies] Error fetching technologies: ${err}`);
    const errorMessage = parseApiError(err, 'technologies');
    return { data: null, error: errorMessage };
  }
}