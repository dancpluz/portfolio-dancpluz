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

export const lightBackground = parseInt(
  typedThemes['light']['--color-background'].substring(1),
  16
);

export const darkBackground = parseInt(
  typedThemes['dark']['--color-background'].substring(1),
  16
);

export const darkForeground = parseInt(
  typedThemes['dark']['--color-foreground'].substring(1),
  16
);

export const lightForeground = parseInt(
  typedThemes['light']['--color-foreground'].substring(1),
  16
);

export const accent = parseInt(
  typedThemes['light']['--color-accent'].substring(1),
  16
);


