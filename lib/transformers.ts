import {
  buildImageUrl,
  ProjectExpand,
  type IconExpand,
} from '@/lib/pocketbase';
import { Project, Social, Technology, Testimonial, Polaroid, Experience } from '@/types/api';
import {
  ExperienceResponse,
  IconsResponse,
  ProjectsResponse,
  ProjectsProjectTypeOptions,
  SocialsResponse,
  TechnologiesResponse,
  TestimonialsResponse,
  PolaroidsResponse,
} from '@/types/pocketbase';
import { transformLogger } from '@/lib/logger';

/**
 * Transforms a PocketBase Icon record into a standard URL and Alt text object.
 */
export function transformIcon(
  iconRef: IconsResponse | undefined,
  fallbackAlt: string = '',
) {
  if (!iconRef) return { url: '', alt: fallbackAlt };
  try {
    return {
      url: buildImageUrl(iconRef, iconRef.icon),
      alt: iconRef.alt || fallbackAlt,
    };
  } catch (err) {
    transformLogger.error(`[transformIcon] Failed to build icon URL for ${iconRef.id}: ${err}`);
    return { url: '', alt: fallbackAlt };
  }
}

/**
 * Transforms a PocketBase Social record into the Social interface.
 */
export function transformSocial(record: SocialsResponse<IconExpand>): Social {
  try {
    const { url: iconUrl, alt: iconAlt } = transformIcon(
      record.expand?.icon_ref,
      record.text || '',
    );

    return {
      id: record.id,
      url: record.url || '',
      text: record.text || '',
      subtextEn: record.subtext_en || '',
      subtextPt: record.subtext_pt || '',
      iconUrl,
      iconAlt,
    };
  } catch (err) {
    transformLogger.error(`[transformSocial] Failed to transform social ${record.id}: ${err}`);
    return {
      id: record.id,
      url: '',
      text: '',
      subtextEn: '',
      subtextPt: '',
      iconUrl: '',
      iconAlt: '',
    };
  }
}

/**
 * Transforms a PocketBase Technology record into the Technology interface.
 */
export function transformTechnology(
  record: TechnologiesResponse<IconExpand>,
): Technology {
  try {
    const { url: imageUrl, alt } = transformIcon(record.expand?.icon_ref);

    return {
      id: record.id,
      imageUrl,
      tooltipEn: record.tooltip_en || '',
      tooltipPt: record.tooltip_pt || '',
      alt,
    };
  } catch (err) {
    transformLogger.error(`[transformTechnology] Failed to transform technology ${record.id}: ${err}`);
    return {
      id: record.id,
      imageUrl: '',
      tooltipEn: '',
      tooltipPt: '',
      alt: '',
    };
  }
}

/**
 * Transforms a PocketBase Project record into the Project interface.
 */
export function transformProject(
  record: ProjectsResponse<ProjectExpand>,
): Project {
  try {
    return {
      id: record.id,
      titleEn: record.title_en || '',
      titlePt: record.title_pt || '',
      descriptionEn: record.description_en || '',
      descriptionPt: record.description_pt || '',
      date: record.date || '',
      url: record.url || '#',
      coverUrl: record.cover ? buildImageUrl(record, record.cover) : '',
      socials: record.expand?.social_refs?.map(transformSocial) || [],
      medias:
        record.medias && record.medias.length > 0
          ? record.medias.map((media) => buildImageUrl(record, media))
          : [],
      clientEn: record.client_en?.toLowerCase() || '',
      clientPt: record.client_pt?.toLowerCase() || '',
      subtitleEn: record.subtitle_en || '',
      subtitlePt: record.subtitle_pt || '',
      categories: record.categories || [],
      projectType: record.project_type || '',
    };
  } catch (err) {
    transformLogger.error(`[transformProject] Failed to transform project ${record.id}: ${err}`);
    return {
      id: record.id,
      titleEn: '',
      titlePt: '',
      descriptionEn: '',
      descriptionPt: '',
      date: '',
      url: '#',
      coverUrl: '',
      socials: [],
      medias: [],
      clientEn: '',
      clientPt: '',
      subtitleEn: '',
      subtitlePt: '',
      categories: [],
      projectType: '' as unknown as ProjectsProjectTypeOptions,
    };
  }
}

/**
 * Transforms a PocketBase Testimonial record into the Testimonial interface.
 */
export function transformTestimonial(
  record: TestimonialsResponse,
): Testimonial {
  try {
    return {
      id: record.id,
      title: record.title,
      subtitle: record.subtitle,
      content: record.content,
      profileUrl: record.profile ? buildImageUrl(record, record.profile) : '',
      url: record.url || '',
      date: record.date || '',
    };
  } catch (err) {
    transformLogger.error(`[transformTestimonial] Failed to transform testimonial ${record.id}: ${err}`);
    return {
      id: record.id,
      title: '',
      subtitle: '',
      content: '',
      profileUrl: '',
      url: '',
      date: '',
    };
  }
}

/**
 * Transforms a PocketBase Polaroid record into the Polaroid interface.
 */
export function transformPolaroid(
  record: PolaroidsResponse,
): Polaroid {
  try {
    return {
      id: record.id,
      photoUrl: record.photo ? buildImageUrl(record, record.photo) : '',
      textEn: record.text_en || '',
      textPt: record.text_pt || '',
    };
  } catch (err) {
    transformLogger.error(`[transformPolaroid] Failed to transform polaroid ${record.id}: ${err}`);
    return {
      id: record.id,
      photoUrl: '',
      textEn: '',
      textPt: '',
    };
  }
}

/**
 * Transforms a PocketBase Experience record into the Experience interface.
 */
export function transformExperience(
  record: ExperienceResponse<IconExpand>,
): Experience {
  try {
    const { url: iconUrl, alt: iconAlt } = transformIcon(
      record.expand?.icon_ref,
      record.title_en || record.title_pt || '',
    );

    return {
      id: record.id,
      titleEn: record.title_en || '',
      titlePt: record.title_pt || '',
      descriptionEn: record.description_en || '',
      descriptionPt: record.description_pt || '',
      startDate: record.start_date || '',
      iconUrl,
      iconAlt,
    };
  } catch (err) {
    transformLogger.error(`[transformExperience] Failed to transform experience ${record.id}: ${err}`);
    return {
      id: record.id,
      titleEn: '',
      titlePt: '',
      descriptionEn: '',
      descriptionPt: '',
      startDate: '',
      iconUrl: '',
      iconAlt: '',
    };
  }
}

