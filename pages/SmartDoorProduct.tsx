import React from 'react';
import { StoreProductDetail, type StoreProductDetailCopy } from '../components/StoreProductDetail';
import { smartDoorProduct } from '../data/storeProducts';

const copy: StoreProductDetailCopy = {
  seoTitle: 'Engineering Smart Door - Mission MakerLab',
  seoDescription: 'Une mission STEM guidée pour concevoir, coder, assembler et tester une porte intelligente.',
  seoKeywords: 'Smart Door, microbit robotique, kit STEM Maroc, MakerLab CAD, projet enfant',
  badge: 'Électronique + code',
  heroTitle: 'Construire une porte qui pense.',
  heroSummary: "Votre enfant conçoit le mécanisme, programme son comportement et repart avec un prototype qui fonctionne.",
  heroHighlights: ['Guide + kit', 'CAD + simulation', 'micro:bit + code'],
  professionalTools: ['Autodesk Tinkercad', 'Autodesk Fusion 360', 'BBC micro:bit', 'Microsoft MakeCode'],
  recommendedReason: 'Pour une première expérience, la session au MakerLab réduit les hésitations : le matériel est prêt, le mentor accompagne et l’enfant repart avec un résultat visible.',
  nextSteps: [
    { title: 'Smart Door guidée', text: 'Comprendre les composants et réussir le premier prototype.' },
    { title: 'Version personnalisée', text: 'Modifier le CAD, le mécanisme ou le comportement.' },
    { title: 'Portfolio produit', text: 'Présenter, documenter, packager et apprendre à proposer son invention.' },
  ],
  imageAlt: 'Porte intelligente MakerLab avec structure MDF, capteur et micro:bit',
  workshopLabel: 'Construire au MakerLab',
  journeyEyebrow: 'La mission Smart Door',
  journeyTitle: "Six étapes pour passer de l'idée au prototype.",
  journeyLabels: ['Dessiner la porte', 'Simuler le circuit', 'Comprendre les composants', 'Programmer', 'Assembler', 'Tester et améliorer'],
  outcomeTitle: 'Une porte intelligente, et les compétences pour expliquer son fonctionnement.',
  outcomes: [
    'Comprendre comment un capteur détecte une présence',
    'Programmer la logique du servo avec micro:bit',
    'Assembler la structure et connecter les composants',
    'Tester, corriger et personnaliser le prototype',
  ],
  componentsTitle: 'De vraies pièces pour un vrai prototype.',
  formatTitle: 'À la maison, au lab ou en version personnalisée.',
  formatLabels: ['Kit guidé à la maison', 'Session au MakerLab', 'Fabrication personnalisée'],
  formatSummaries: [
    'Le guide et les pièces réunis pour avancer avec un parent.',
    'Un mentor accompagne la conception, le code et les tests.',
    'L’enfant adapte son dessin et MakerLab aide à le fabriquer.',
  ],
  customTitle: "Et si la porte devenait vraiment la sienne ?",
  customText: 'Modifier le dessin, changer un détail et fabriquer une nouvelle version fait partie du métier de maker.',
  accent: '#f7b500',
};

export const SmartDoorProduct: React.FC = () => <StoreProductDetail product={smartDoorProduct} copy={copy} />;
