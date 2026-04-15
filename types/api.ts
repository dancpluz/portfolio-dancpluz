import {
  HTMLString,
  IsoDateString,
  ProjectsCategoriesOptions,
  ProjectsProjectTypeOptions,
} from './pocketbase';

export interface Social {
  id: string;
  url: string;
  text: string;
  subtextEn: string;
  subtextPt: string;
  iconUrl: string;
  iconAlt: string;
}

export interface Technology {
  id: string;
  imageUrl: string;
  tooltipEn: string;
  tooltipPt: string;
  alt: string;
}

export interface Project {
  id: string;
  titleEn: string;
  titlePt: string;
  subtitleEn: string;
  subtitlePt: string;
  descriptionEn: HTMLString;
  descriptionPt: HTMLString;
  projectType: ProjectsProjectTypeOptions;
  coverUrl: string;
  url: string;
  socials: Social[];
  date: IsoDateString;
  categories: ProjectsCategoriesOptions[];
  medias: string[];
  clientEn: string;
  clientPt: string;
}

export interface Testimonial {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  profileUrl: string;
  url: string;
  date: IsoDateString;
}

export interface Polaroid {
  id: string;
  photoUrl: string;
  textEn: string;
  textPt: string;
}
