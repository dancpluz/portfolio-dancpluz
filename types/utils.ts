import { ROUTES } from "@/lib/constant";

export type Heading = {
  id: string;
  text: string;
  level: number;
};

export type ThemeConfig = {
  [key: string]: string;
};

export type Themes = {
  dark: ThemeConfig;
  light: ThemeConfig;
};

export type RouteItem = typeof ROUTES[keyof typeof ROUTES];
