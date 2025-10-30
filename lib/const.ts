import { PostsCategoryOptions } from '@/types/pocketbase';
import themes from '@/lib/theme.json';
import { Themes } from '@/types/utils';

export const categoryEmoji: Record<PostsCategoryOptions, string> = {
  tutorial: '💻',
  notícias: '📰',
  curiosidades: '🔍',
  opinião: '💬',
  carreira: '💼',
  histórias: '📖',
  desenvolvimento: '🛠️',
};

export const typedThemes = themes as Themes;