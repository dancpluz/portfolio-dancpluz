import { PostsResponse } from '@/types/pocketbase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const angleToRadians = (angle: number) => {
  return angle * (Math.PI / 180);
};

export function formatDate(
  startDateString: string,
  endDateString: string | null = null
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
  endDateString: string | null = null
) {
  const startDate = new Date(startDateString);
  const endDate = endDateString ? new Date(endDateString) : new Date();

  const diffMs = endDate.getTime() - startDate.getTime();

  const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
  const months = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44)
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

export function formatDatePtBR(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) return '';
  return format(date, 'MMMM d, yyyy', { locale: ptBR });
}

export function plural<T>(array: T[]): string {
  return array.length === 1 ? '' : 's';
}

export function getPostCategories(posts: PostsResponse[]) {
  const categories = posts.map((post) => post.categories).flat();
  return Array.from(new Set(categories));
}