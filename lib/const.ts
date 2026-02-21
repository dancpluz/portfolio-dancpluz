import { PostsCategoryOptions } from '@/types/pocketbase';
import themes from '@/lib/theme.json';
import { Themes, VertexPoint } from '@/types/utils';

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

export const vertexPoints: VertexPoint[] = [
  {
    position: [-0.499, -0.065, 0.001],
    rotation: [0, 0, 0],
    scale: 0.1,
    label: 'FULLSTACK',
    color: '#f9cc01',
  },
  {
    position: [-0.351, -0.065, 0.35],
    rotation: [0, 0, 0],
    scale: 0.1,
    label: 'FRONTEND',
    color: '#b9b9b9',
  },
  {
    position: [0.001, -0.065, 0.499],
    rotation: [0, 0, 0],
    scale: 0.1,
    label: 'BACKEND',
    color: '#0201f7',
  },
  {
    position: [0.35, -0.065, 0.351],
    rotation: [0, 0, 0],
    scale: 0.1,
    label: 'DEVOPS',
    color: '#24d400',
  },
  {
    position: [0.499, -0.065, -0.001],
    rotation: [0, 0, 0],
    scale: 0.1,
    label: 'DESIGN',
    color: '#fa00ec',
  },
  {
    position: [0.351, -0.065, -0.35],
    rotation: [0, 0, 0],
    scale: 0.1,
    label: 'MOBILE',
    color: '#14c4f8',
  },
  {
    position: [-0.001, -0.065, -0.499],
    rotation: [0, 0, 0],
    scale: 0.1,
    label: 'AI',
    color: '#f83800',
  },
  {
    position: [-0.35, -0.065, -0.351],
    rotation: [0, 0, 0],
    scale: 0.1,
    label: 'BLOCKCHAIN',
    color: '#ff5b00',
  },
];



