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
  subtext: string;
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
  title: string;
  subtitle: string;
  description: HTMLString;
  projectType: ProjectsProjectTypeOptions;
  coverUrl: string;
  url: string;
  socials: Social[];
  date: IsoDateString;
  categories: ProjectsCategoriesOptions[];
  medias: string[];
  client: string;
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
