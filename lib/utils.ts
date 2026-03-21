import { PostsResponse } from '@/types/pocketbase';
import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import * as cheerio from 'cheerio';
import { Heading } from '@/types/utils';
import slugify from 'slugify';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ROUTES } from './constant';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function formatDate(
  startDateString: string,
  endDateString: string | null = null,
) {
  const startDate = new Date(startDateString);

  const monthsInPortuguese = [
    'JAN',
    'FEV',
    'MAR',
    'ABR',
    'MAI',
    'JUN',
    'JUL',
    'AGO',
    'SET',
    'OUT',
    'NOV',
    'DEZ',
  ];

  const formatSingleDate = (date: Date) => {
    const month = monthsInPortuguese[date.getUTCMonth()];
    const year = date.getUTCFullYear().toString().slice(-2);
    return `${month} ${year}`;
  };

  const startFormatted = formatSingleDate(startDate);

  if (endDateString) {
    const endDate = new Date(endDateString);
    const endFormatted = formatSingleDate(endDate);
    return `${startFormatted} - ${endFormatted}`;
  }

  return `${startFormatted} - ATUAL`;
}

export function formatTimeDifference(
  startDateString: string,
  endDateString: string | null = null,
) {
  const startDate = new Date(startDateString);
  const endDate = endDateString ? new Date(endDateString) : new Date();

  const diffMs = endDate.getTime() - startDate.getTime();

  const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
  const months = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44),
  );

  if (years > 0) {
    if (months >= 6) {
      return years === 1 ? '1 ANO E MEIO' : `${years} ANOS E MEIO`;
    } else {
      return years === 1 ? '1 ANO' : `${years} ANOS`;
    }
  } else if (months > 0) {
    return months === 1 ? '1 MÊS' : `${months} MESES`;
  } else {
    return 'MENOS DE 1 MÊS';
  }
}

export function parseApiError(err: unknown, objectName: string): string {
  const status = (err as any)?.status ?? (err as any)?.response?.status ?? null;
  let errorMessage = `Erro ao buscar ${objectName}`;

  switch (status) {
    case 400:
      errorMessage = 'Requisição inválida';
      break;
    case 401:
      errorMessage = 'Não autorizado (autenticação necessária)';
      break;
    case 403:
      errorMessage = 'Acesso proibido';
      break;
    case 404:
      errorMessage = `${
        objectName.charAt(0).toUpperCase() + objectName.slice(1)
      } não encontrados`;
      break;
    case 429:
      errorMessage = 'Muitas requisições. Tente novamente mais tarde';
      break;
    case 500:
      errorMessage = 'Erro interno do servidor';
      break;
    case 502:
      errorMessage = 'Servidor de banco de dados indisponível';
      break;
    case 503:
      errorMessage = 'Serviço indisponível. Tente novamente mais tarde';
      break;
    default:
      if (typeof status === 'number') {
        errorMessage = `Erro ao buscar ${objectName} (código ${status})`;
      } else if ((err as any)?.message) {
        errorMessage = `Erro ao buscar ${objectName}: ${(err as any).message}`;
      }
  }

  return errorMessage;
}

export function formatDateLocal(
  dateInput: string | Date,
  localeStr: string = 'pt',
): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) return '';

  if (localeStr === 'pt') {
    return format(date, "d 'de' MMMM, yyyy", { locale: ptBR });
  } else {
    return format(date, 'MMMM d, yyyy', { locale: enUS });
  }
}

export function plural<T>(array: T[]): string {
  return array.length === 1 ? '' : 's';
}

export function getPostCategories(posts: PostsResponse[]) {
  const categories = posts.flatMap((post) => post.category);
  return Array.from(new Set(categories));
}

export function processArticleHtml(htmlString: string): {
  headings: Heading[];
  processedHtml: string;
} {
  const headings: Heading[] = [];
  const $ = cheerio.load(htmlString);

  $('h1, h2, h3, h4').each((_, element) => {
    const level = Number.parseInt(element.tagName.replace('h', ''), 10);
    const text = $(element).text();
    const id = slugify(text);

    if (text) {
      $(element).attr('id', id);

      headings.push({ id, text, level });
    }
  });

  const processedHtml = $('body').html() || '';

  return { headings, processedHtml };
}

export function getFirstParagraphText(htmlString: string): string {
  const $ = cheerio.load(htmlString);

  let firstText = '';

  $('p').each((_, element) => {
    const text = $(element).text().trim();

    if (text) {
      firstText = text;
      return false;
    }
  });

  return firstText;
}

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const lerp = (start: number, end: number, factor: number) => {
  return start + (end - start) * factor;
};

export const getSectionId = (
  routeItem: (typeof ROUTES)[keyof typeof ROUTES],
) => {
  return routeItem.path.replace('#', '').replace('/', '');
};
