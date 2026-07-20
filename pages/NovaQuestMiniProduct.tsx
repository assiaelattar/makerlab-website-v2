import React from 'react';
import { StoreProductDetail, type StoreProductDetailCopy } from '../components/StoreProductDetail';
import { novaQuestMiniProduct } from '../data/storeProducts';

const copy: StoreProductDetailCopy = {
  seoTitle: 'Nova Quest Mini - Mission rover MakerLab',
  seoDescription: 'Une mission robotique guidée pour concevoir, programmer, assembler et tester un rover micro:bit.',
  seoKeywords: 'Nova Quest Mini, rover MakerLab, robot microbit Maroc, MakeCode, kit STEM',
  badge: 'Robotique + exploration',
  heroTitle: 'Construire un rover qui explore.',
  heroSummary: "Votre enfant dessine le châssis, programme les mouvements et transforme son robot en véhicule de mission.",
  heroHighlights: ['Guide + rover', 'CAD + découpe', 'micro:bit + moteurs'],
  professionalTools: ['Autodesk Tinkercad', 'BBC micro:bit', 'Microsoft MakeCode', 'Découpe laser'],
  recommendedReason: 'La session au MakerLab est le départ le plus simple : le mentor sécurise le câblage, aide à corriger le code et transforme les erreurs en progrès.',
  nextSteps: [
    { title: 'Rover guidé', text: 'Assembler, câbler et programmer les mouvements essentiels.' },
    { title: 'Mission autonome', text: 'Ajouter des défis, capteurs et règles de navigation.' },
    { title: 'Robot produit', text: 'Documenter, présenter, packager et imaginer une offre autour du rover.' },
  ],
  imageAlt: 'Rover Nova Quest Mini MakerLab avec châssis MDF et micro:bit',
  workshopLabel: 'Construire le rover',
  journeyEyebrow: 'La mission Nova Quest',
  journeyTitle: "Six étapes pour donner vie à un robot.",
  journeyLabels: ['Choisir la mission', 'Dessiner le châssis', 'Préparer la fabrication', 'Simuler le circuit', 'Programmer les mouvements', 'Assembler et tester'],
  outcomeTitle: 'Un rover qui roule, et une vraie compréhension de ce qui le fait bouger.',
  outcomes: [
    'Comprendre le rôle du châssis, des moteurs et de l’énergie',
    'Préparer les connexions avant le montage',
    'Programmer avancer, reculer et tourner avec MakeCode',
    'Créer un parcours, tester et améliorer le robot',
  ],
  componentsTitle: 'Tout ce qui transforme une idée en rover.',
  formatTitle: 'Construire chez soi, avec un mentor ou sur mesure.',
  formatLabels: ['Kit rover à la maison', 'Session au MakerLab', 'Châssis personnalisé'],
  formatSummaries: [
    'Un parcours guidé avec les pièces préparées pour la mission.',
    'Un mentor aide à câbler, coder et résoudre les problèmes.',
    'L’enfant adapte le châssis et MakerLab aide à le découper.',
  ],
  customTitle: 'Un rover peut changer avec chaque nouvelle mission.',
  customText: 'Adapter le châssis, déplacer un composant ou créer un nouvel accessoire transforme le robot en projet personnel.',
  accent: '#f7b500',
};

export const NovaQuestMiniProduct: React.FC = () => <StoreProductDetail product={novaQuestMiniProduct} copy={copy} />;
