import { Project, Exhibition, Stats } from './types';

import elookxHero from '@/assets/portfolio/elookx-hero.png';
import elookxPhones from '@/assets/portfolio/elookx-phones.png';
import elookxInterface from '@/assets/portfolio/elookx-interface.png';
import elookxIsibaya from '@/assets/portfolio/elookx-isibaya.png';
import lokix from '@/assets/portfolio/lokix.png';
import boroHome from '@/assets/portfolio/boro-home.png';
import boroQuiz from '@/assets/portfolio/boro-quiz.png';
import behappyChat from '@/assets/portfolio/behappy-chat.png';

export const projects: Project[] = [
  {
    id: '1',
    title: 'elOOkx',
    category: 'plateforme de streaming',
    year: '2024',
    image: elookxHero,
  },
  {
    id: '2',
    title: 'elOOkx · Mobile',
    category: 'app mobile / ui',
    year: '2024',
    image: elookxPhones,
  },
  {
    id: '3',
    title: 'elOOkx · Interface',
    category: 'product design',
    year: '2024',
    image: elookxInterface,
  },
  {
    id: '4',
    title: 'elOOkx · Isibaya',
    category: 'campagne / web',
    year: '2024',
    image: elookxIsibaya,
  },
  {
    id: '5',
    title: 'LOKIX',
    category: 'marketplace mobile',
    year: '2023',
    image: lokix,
  },
  {
    id: '6',
    title: 'BORO',
    category: 'réseau social',
    year: '2023',
    image: boroHome,
  },
  {
    id: '7',
    title: 'BORO · Quiz',
    category: 'branding / campagne',
    year: '2023',
    image: boroQuiz,
  },
  {
    id: '8',
    title: 'Be Happy',
    category: 'messagerie / ui',
    year: '2022',
    image: behappyChat,
  },
];

export const statistics: Stats[] = [
  {
    label: 'Territoires',
    value: '03',
    description: 'Sénégal, Afrique de l\'Ouest, projets à portée internationale'
  },
  {
    label: 'Domaines',
    value: '06+',
    description: 'tech, food, retail, print, branding, opérations'
  },
  {
    label: 'Livrables',
    value: '10+',
    description: 'interfaces, marques, supports, concepts, systèmes'
  },
  {
    label: 'Terrain',
    value: '100%',
    description: 'une approche qui relie stratégie, design et exécution'
  }
];

export const exhibitions: Exhibition[] = [
  {
    id: '01',
    title: 'Fondateur & dirigeant · GoteaT',
    location: 'Sénégal',
    date: '2023 — Aujourd\'hui',
    description: 'Restaurant en ligne construit autour d\'une promesse simple : tout à partir de 500 F. Conception de l\'offre, identité, opérations et expérience de commande.'
  },
  {
    id: '02',
    title: 'Co-fondateur & cogérant · Creative Shop',
    location: 'Sénégal',
    date: '2023 — Aujourd\'hui',
    description: 'Structure de production et personnalisation d\'objets de marque. Impression grand format, textile et signalétique pour entreprises.'
  }
];

export const education: Exhibition[] = [
  {
    id: '03',
    title: 'Spécialiste Produit & Ops',
    location: 'Sénégal',
    date: '2022',
    description: 'Formation approfondie sur les systèmes opérationnels et la gestion de cycle de vie produit.'
  },
  {
    id: '04',
    title: 'Design & Visual Systems',
    location: 'International',
    date: '2021',
    description: 'Certification en design stratégique et systèmes visuels pour marques digitales.'
  }
];

export const expertise = [
  {
    id: '01',
    title: 'Produit digital',
    description: 'Applications, plateformes, parcours utilisateurs, systèmes métiers et outils conçus pour être utilisés vraiment.'
  },
  {
    id: '02',
    title: 'Branding',
    description: 'Identité, direction artistique, supports imprimés, packaging et cohérence visuelle de marque.'
  },
  {
    id: '03',
    title: 'Business',
    description: 'Positionnement, offre, logique de revenus, acquisition, partenariats et structuration progressive.'
  },
  {
    id: '04',
    title: 'Opérations',
    description: 'Organisation terrain, process, coordination, production, livraison et amélioration continue.'
  },
  {
    id: '05',
    title: 'Food concept',
    description: 'GoteaT : restauration en ligne, offre accessible, logique de volume et expérience de commande simple.'
  },
  {
    id: '06',
    title: 'Creative production',
    description: 'Creative Shop : impression, personnalisation, objets de marque et exécution graphique concrète.'
  }
];
