// @/lib/scrollSections.ts

import { Vector3, Euler } from 'three';

export interface ScrollSection {
  start: number;
  /** O ponto final no scroll (0.0 a 1.0) */
  end: number;
  /** A posição alvo da CÂMERA */
  cameraPosition: Vector3;
  /** O ponto para onde a CÂMERA deve olhar */
  cameraTarget: Vector3;
  /** O FOV (zoom) alvo da CÂMERA */
  cameraFov: number;
  /** A rotação alvo do DIAMANTE */
  diamondRotation: Euler;
  /** * A "duração" da animação de entrada.
   * Mapeia para o 'smoothTime' do 'damp' (em segundos).
   * Um valor menor (ex: 0.2) é mais rápido.
   * Um valor maior (ex: 1.0) é mais lento e suave.
   */
  transitionSpeed: number;
  /** Um nome para a seção, usado no HTML */
  title: string;
}

// O número total de "páginas" que o scroll terá.
// 1 página = 100vh de altura de scroll.
export const TOTAL_SCROLL_PAGES = 10;

// O Ponto Central para onde o Diamante sempre olhará (para a Câmera)
const DIAMOND_LOOKAT_TARGET = new Vector3(0, 0, 0);

// ==========================================================
// A "LINHA DO TEMPO" DA ANIMAÇÃO
// ==========================================================
export const sections: ScrollSection[] = [
  {
    // --- Seção 1: Intro ---
    start: 0 / TOTAL_SCROLL_PAGES,
    end: 1 / TOTAL_SCROLL_PAGES,
    cameraPosition: new Vector3(0, 0, 8),
    cameraTarget: DIAMOND_LOOKAT_TARGET,
    cameraFov: 50,
    diamondRotation: new Euler(0, 0, 0),
    transitionSpeed: 0.5,
    title: 'Seção 1: Início',
  },
  {
    // --- Seção 2: Move para a Esquerda ---
    start: 1 / TOTAL_SCROLL_PAGES,
    end: 2 / TOTAL_SCROLL_PAGES,
    cameraPosition: new Vector3(-4, 0, 4), // A posição que você pediu
    cameraTarget: DIAMOND_LOOKAT_TARGET,
    cameraFov: 50,
    diamondRotation: new Euler(0, Math.PI / 2, 0), // Gira o diamante
    transitionSpeed: 0.5,
    title: 'Seção 2: Foco em Frontend',
  },
  {
    // --- Seção 3: Zoom In ---
    start: 2 / TOTAL_SCROLL_PAGES,
    end: 3 / TOTAL_SCROLL_PAGES,
    cameraPosition: new Vector3(-2, 0, 2), // Mais perto
    cameraTarget: DIAMOND_LOOKAT_TARGET,
    cameraFov: 30, // Zoom In
    diamondRotation: new Euler(0, Math.PI, 0),
    transitionSpeed: 0.5,
    title: 'Seção 3: Backend',
  },
  {
    // --- Seção 4: Move para a Direita ---
    start: 3 / TOTAL_SCROLL_PAGES,
    end: 4 / TOTAL_SCROLL_PAGES,
    cameraPosition: new Vector3(4, 0, 4),
    cameraTarget: DIAMOND_LOOKAT_TARGET,
    cameraFov: 50, // Zoom Out
    diamondRotation: new Euler(0, Math.PI * 1.5, 0),
    transitionSpeed: 0.5,
    title: 'Seção 4: DevOps',
  },
  {
    // --- Seção 5: Visão de Cima ---
    start: 4 / TOTAL_SCROLL_PAGES,
    end: 5 / TOTAL_SCROLL_PAGES,
    cameraPosition: new Vector3(0, 8, 0.1), // Posição de cima (0.1 para evitar gimbal lock)
    cameraTarget: DIAMOND_LOOKAT_TARGET,
    cameraFov: 60,
    diamondRotation: new Euler(Math.PI / 2, 0, 0), // Inclina o diamante
    transitionSpeed: 0.5,
    title: 'Seção 5: Visão Geral',
  },
  {
    // --- Seção 6 ---
    start: 5 / TOTAL_SCROLL_PAGES,
    end: 6 / TOTAL_SCROLL_PAGES,
    cameraPosition: new Vector3(-4, -4, 4), // Visão de baixo-esquerda
    cameraTarget: DIAMOND_LOOKAT_TARGET,
    cameraFov: 50,
    diamondRotation: new Euler(0, 0, 0),
    transitionSpeed: 0.5,
    title: 'Seção 6: Design',
  },
  {
    // --- Seção 7 ---
    start: 6 / TOTAL_SCROLL_PAGES,
    end: 7 / TOTAL_SCROLL_PAGES,
    cameraPosition: new Vector3(4, -4, 4), // Visão de baixo-direita
    cameraTarget: DIAMOND_LOOKAT_TARGET,
    cameraFov: 50,
    diamondRotation: new Euler(0, 0, 0),
    transitionSpeed: 0.5,
    title: 'Seção 7: Mobile',
  },
  {
    // --- Seção 8 ---
    start: 7 / TOTAL_SCROLL_PAGES,
    end: 8 / TOTAL_SCROLL_PAGES,
    cameraPosition: new Vector3(0, 0, -8), // Visão Traseira
    cameraTarget: DIAMOND_LOOKAT_TARGET,
    cameraFov: 50,
    diamondRotation: new Euler(0, Math.PI, 0),
    transitionSpeed: 0.5,
    title: 'Seção 8: AI',
  },
  {
    // --- Seção 9 ---
    start: 8 / TOTAL_SCROLL_PAGES,
    end: 9 / TOTAL_SCROLL_PAGES,
    cameraPosition: new Vector3(0, 0, 2), // Close-up extremo
    cameraTarget: DIAMOND_LOOKAT_TARGET,
    cameraFov: 15,
    diamondRotation: new Euler(0, 0, 0),
    transitionSpeed: 0.5,
    title: 'Seção 9: Detalhes',
  },
  {
    // --- Seção 10: Final (volta ao início) ---
    start: 9 / TOTAL_SCROLL_PAGES,
    end: 10 / TOTAL_SCROLL_PAGES,
    cameraPosition: new Vector3(0, 0, 8),
    cameraTarget: DIAMOND_LOOKAT_TARGET,
    cameraFov: 50,
    diamondRotation: new Euler(0, 0, 0),
    transitionSpeed: 0.5,
    title: 'Seção 10: Fim',
  },
];
