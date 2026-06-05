import { Translation } from './types';

const pt: Translation = {
  home: {
    part1: 'Olá, eu sou o Daniel Luz.',
    part2: 'Bem-vindo ao meu portfólio.',
  },
  blog: {
    title: 'Blog',
    description: 'Minhas ideias idiotas',
    heading: 'Ideias',
    no_posts_found: 'Nenhum post encontrado ainda.',
    error_loading: 'Erro ao carregar artigo:',
    articles_found:
      '{count, plural, =0 {Nenhum artigo encontrado} =1 {1 artigo encontrado} other {# artigos encontrados}}',
    fetching_ideas: 'Buscando ideias...',
    please_wait: 'Por favor, aguarde um momento',
    reading_article: 'Lendo...',
  },
  common: {
    loader: 'Carregando...',
    copied: 'Copiado!',
    copy_to_clipboard: 'Copiar para a área de transferência',
  },
  nav: {
    landing: 'Início',
    projects: 'Obras',
    about: 'Sobre',
    contact: 'Contato',
    stack: 'Stack',
  },
  projects: {
    title: 'Obras',
    not_found: 'Projeto não encontrado.',
    made_for: 'feito para',
  },
  about: {
    title: 'Sobre',
  },
  contact: {
    title: 'Contato',
    lets_talk_1: 'BORA',
    lets_talk_2: 'CONVERSAR?',
  },
  stack: {
    title: 'Stack',
    text: 'Brinquedos que uso',
  },
  footer: {
    back_to_top: '\u2191 Voltar ao topo',
    rights: '\u00A9 {year} Daniel Luz',
  },
};

export default pt;
