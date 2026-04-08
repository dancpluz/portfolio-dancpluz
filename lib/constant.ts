import { Social } from '@/types/api';
import { PostsCategoryOptions } from '@/types/pocketbase';

export const categoryEmoji: Record<PostsCategoryOptions, string> = {
  tutorial: '💻',
  notícias: '📰',
  curiosidades: '🔍',
  opinião: '💬',
  carreira: '💼',
  histórias: '📖',
  desenvolvimento: '🛠️',
};

export const DEFAULT_SOCIALS: Social[] = [
  {
    id: 'linkedin-default',
    url: 'https://www.linkedin.com/in/daniel-cunha-luz/',
    text: 'Daniel Luz',
    subtext: '"Tenho o prazer de anunciar nossa conexão!"',
    iconUrl:
      'https://pb.ruadebaixo.com.br/api/files/egcnloaglxen3wj/1g1fkm14dcsa1rr/linkedin_rovuzcwol1.svg',
    iconAlt: 'Pixel LinkedIn',
  },
  {
    id: 'github-default',
    url: 'https://github.com/dancpluz',
    text: 'dancpluz',
    subtext: 'Projetos de verdade que fazem alguma coisa',
    iconUrl:
      'https://pb.ruadebaixo.com.br/api/files/egcnloaglxen3wj/n22fhz1wyzdhat0/github_od1i8p13fq.svg',
    iconAlt: 'Pixel Github',
  },
  {
    id: 'mail-default',
    url: 'mailto:dan08jan@gmail.com',
    text: 'dan08jan@gmail.com',
    subtext: 'Se mandar spam vai levar um DDOS',
    iconUrl:
      'https://pb.ruadebaixo.com.br/api/files/egcnloaglxen3wj/prb1n38au1mta3m/envelope_az3v8b1bjz.svg',
    iconAlt: 'Pixel Email',
  },
  {
    id: 'instagram-default',
    url: 'https://www.instagram.com/dancpluz/',
    text: 'dancpluz',
    subtext: 'Pode dar uma olhada, só não stalkeia muito',
    iconUrl:
      'https://pb.ruadebaixo.com.br/api/files/egcnloaglxen3wj/oql1nudbi61l6fo/instagram_7pan57ahig.svg',
    iconAlt: 'Pixel Instagram',
  },
];

export const ROUTES = {
  landing: {
    path: '/',
    text: 'Início',
    image: 'https://picsum.photos/1920/1080?random=1',
  },
  // blog: {
  //   path: '/blog',
  //   text: 'Blog',
  //   image: 'https://picsum.photos/1920/1080?random=4',
  // },
  projects: {
    path: '/#projects',
    text: 'Obras',
    image: 'https://picsum.photos/1920/1080?random=3',
  },
  about: {
    path: '/#about',
    text: 'Sobre',
    image: 'https://picsum.photos/1920/1080?random=2',
  },
  contact: {
    path: '/#contact',
    text: 'Contato',
    image: 'https://picsum.photos/1920/1080?random=5',
  },
} as const;

export const MOCK_TESTIMONIALS: import('@/types/api').Testimonial[] = [
  {
    id: 'mock-1',
    title: 'Sarah Chen',
    subtitle: '@sarahchen',
    content:
      'Trabalhei com o Daniel em um projeto de e-commerce e a qualidade do código é impressionante. Muito atencioso e detalhista! 🎨',
    profileUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    url: 'https://x.com',
    date: '2026-01-03',
  },
  {
    id: 'mock-2',
    title: 'Mike Johnson',
    subtitle: '@mikej_dev',
    content:
      'O portfólio mais criativo que já vi. As animações e interações são muito fluidas. Parabéns pelo trabalho!',
    profileUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    url: 'https://x.com',
    date: '2026-01-02',
  },
  {
    id: 'mock-3',
    title: 'Alex Rivera',
    subtitle: '@alexrivera',
    content:
      'Daniel entregou o projeto antes do prazo e com uma qualidade excepcional. Recomendo muito o trabalho dele! 🚀',
    profileUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    url: 'https://x.com',
    date: '2026-01-01',
  },
  {
    id: 'mock-4',
    title: 'Alex Rivera',
    subtitle: '@alexrivera',
    content:
      'Daniel entregou o projeto antes do prazo e com uma qualidade excepcional. Recomendo muito o trabalho dele! 🚀',
    profileUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    url: 'https://x.com',
    date: '2026-01-01',
  },
  {
    id: 'mock-5',
    title: 'Alex Rivera',
    subtitle: '@alexrivera',
    content:
      'Daniel entregou o projeto antes do prazo e com uma qualidade excepcional. Recomendo muito o trabalho dele! 🚀',
    profileUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    url: 'https://x.com',
    date: '2026-01-01',
  },
  {
    id: 'mock-6',
    title: 'Alex Rivera',
    subtitle: '@alexrivera',
    content:
      'Daniel entregou o projeto antes do prazo e com uma qualidade excepcional. Recomendo muito o trabalho dele! 🚀',
    profileUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    url: 'https://x.com',
    date: '2026-01-01',
  },
];
