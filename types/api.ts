export interface Social {
  id: string;
  url: string;
  text: string;
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
  description: string;
  year: string;
  link: string;
  image: string;
  socials: Social[];
}