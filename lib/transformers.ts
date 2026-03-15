import {
  buildImageUrl,
  ProjectExpand,
  type IconExpand,
} from '@/lib/pocketbase';
import { Project, Social, Technology } from '@/types/api';
import {
  IconsResponse,
  ProjectsResponse,
  SocialsResponse,
  TechnologiesResponse,
} from '@/types/pocketbase';

/**
 * Transforms a PocketBase Icon record into a standard URL and Alt text object.
 */
export function transformIcon(
  iconRef: IconsResponse | undefined,
  fallbackAlt: string = '',
) {
  if (!iconRef) return { url: '', alt: fallbackAlt };
  return {
    url: buildImageUrl(iconRef, iconRef.icon),
    alt: iconRef.alt || fallbackAlt,
  };
}

/**
 * Transforms a PocketBase Social record into the Social interface.
 */
export function transformSocial(record: SocialsResponse<IconExpand>): Social {
  const { url: iconUrl, alt: iconAlt } = transformIcon(
    record.expand?.icon_ref,
    record.text || '',
  );

  return {
    id: record.id,
    url: record.url || '#',
    text: record.text || '',
    iconUrl,
    iconAlt,
  };
}

/**
 * Transforms a PocketBase Technology record into the Technology interface.
 */
export function transformTechnology(
  record: TechnologiesResponse<IconExpand>,
): Technology {
  const { url: imageUrl, alt } = transformIcon(record.expand?.icon_ref);

  return {
    id: record.id,
    imageUrl,
    tooltipEn: record.tooltip_en || '',
    tooltipPt: record.tooltip_pt || '',
    alt,
  };
}

/**
 * Transforms a PocketBase Project record into the Project interface.
 */
export function transformProject(
  record: ProjectsResponse<ProjectExpand>,
): Project {
  return {
    id: record.id,
    title: record.title,
    description: record.description || '',
    date: record.date || '',
    url: record.url || '#',
    coverUrl: record.cover ? buildImageUrl(record, record.cover) : '',
    socials: record.expand?.social_refs?.map(transformSocial) || [],
    medias:
      record.medias && record.medias.length > 0
        ? record.medias.map((media) => buildImageUrl(record, media))
        : [],
    client: record.client || '',
    subtitle: record.subtitle || '',
    categories: record.categories || [],
    projectType: record.project_type || '',
  };
}
