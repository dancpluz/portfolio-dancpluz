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
    iconUrl:
      'https://pb.ruadebaixo.com.br/api/files/egcnloaglxen3wj/1g1fkm14dcsa1rr/linkedin_rovuzcwol1.svg',
    iconAlt: 'Pixel LinkedIn',
  },
  {
    id: 'github-default',
    url: 'https://github.com/dancpluz',
    text: 'dancpluz',
    iconUrl:
      'https://pb.ruadebaixo.com.br/api/files/egcnloaglxen3wj/n22fhz1wyzdhat0/github_od1i8p13fq.svg',
    iconAlt: 'Pixel Github',
  },
  {
    id: 'mail-default',
    url: 'mailto:dan08jan@gmail.com',
    text: 'dan08jan@gmail.com',
    iconUrl:
      'https://pb.ruadebaixo.com.br/api/files/egcnloaglxen3wj/prb1n38au1mta3m/envelope_az3v8b1bjz.svg',
    iconAlt: 'Pixel Email',
  },
  {
    id: 'instagram-default',
    url: 'https://www.instagram.com/dancpluz/',
    text: 'dancpluz',
    iconUrl:
      'https://pb.ruadebaixo.com.br/api/files/egcnloaglxen3wj/oql1nudbi61l6fo/instagram_7pan57ahig.svg',
    iconAlt: 'Pixel Instagram',
  },
];