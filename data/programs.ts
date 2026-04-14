import { Program, MarketingFramework } from '../types';

export const initialPrograms: Program[] = [
  // --- KIDS PROGRAMS ---
  {
    id: 'kids-1',
    title: 'StemQuest',
    category: 'Enfants & Familles',
    tags: ['Robotique', 'Codage', 'IA', 'Ingénierie'],
    ageGroup: '8-14 Ans',
    format: 'Year Program',
    duration: 'Parcours Annuel',
    price: 'Sur devis',
    shortDescription: 'Le premier incubateur technologique pour enfants à Casablanca.',
    description: 'StemQuest n\'est pas un cours. C\'est un écosystème immersif à progression individuelle. Votre enfant devient un créateur de technologie, pas un simple consommateur.',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80',
    stats: [{ name: 'Incubateur', value: 100 }, { name: 'Projets', value: 30 }, { name: 'Stations', value: 5 }],
    active: true,
    isFeatured: true,
    schedule: ['Mercredi', 'Samedi'],
    stations: [
      { id: 'cs', title: 'Computer Science', description: 'Logique algorithmique, Python, architecture web. Du vrai code, pas des blocs.', icon: 'Code2' },
      { id: 're', title: 'Robotic Engineering', description: 'Zéro kit plastique. Modélisation CAO, soudure, circuits électroniques et code embarqué.', icon: 'Cpu' },
      { id: 'cd', title: 'Creative Design', description: 'CAO avancée (Fusion 360), réalité virtuelle, esthétique produit. De l\'idée à l\'objet physique.', icon: 'PenTool' },
      { id: 'ds', title: 'Digital Storytelling', description: 'Montage vidéo, documentation technique, présentation de projet. L\'ingénieur qui convainc.', icon: 'Video' },
      { id: 'bb', title: 'Business & Branding', description: 'Impression à la demande, e-commerce, marque personnelle. Valoriser ce qu\'ils créent.', icon: 'Briefcase' }
    ],
    landingPage: {
      enabled: true,
      themeColor: 'orange',
      heroSurTitre: 'LE PREMIER INCUBATEUR TECHNOLOGIQUE POUR ENFANTS (8-14 ANS) À CASABLANCA',
      heroHeadline: 'Votre enfant consomme la technologie. Et s\'il apprenait à la construire ?',
      heroSubHeadline: 'Oubliez les cours de soutien classiques et les ateliers "jouets". Découvrez StemQuest : le programme d\'ingénierie immersive où le projet est le professeur.',
      problemHeadline: 'L\'école leur apprend à réciter. Les écrans les poussent à consommer. Et demain ?',
      problemBody: 'Votre enfant est curieux, intelligent, créatif. Mais le système classique lui demande d\'abord de s\'asseoir, d\'écouter, de mémoriser. À la maison, la technologie prend le relais — mais pour scroller, pas pour créer.',
      agitationHeadline: 'L\'Industrie 4.0 n\'attendra pas que votre enfant finisse son programme scolaire.',
      agitationBody: 'Même les ateliers estampillés "robotique" se contentent souvent d\'assemblages de Lego préfabriqués. C\'est du déguisement éducatif. Ça ne lui apprend pas à concevoir, à échouer intelligemment, ni à innover.',
      solutionHeadline: 'StemQuest : Le Seul Programme où l\'on Construit pour Apprendre.',
      solutionBody: 'StemQuest n\'est pas un cours. C\'est un écosystème immersif à progression individuelle. Votre enfant navigue à travers 5 stations d\'innovation, dans notre lab 100% équipé, à son propre rythme.',
      logisticsHeadline: 'Zéro Friction. Mobilière & Mentale.',
      logisticsBody: 'L\'innovation n\'a pas de date de rentrée. Votre enfant n\'apporte que sa curiosité. Nous fournissons tout le reste : imprimantes 3D, micro-contrôleurs, mentors experts et outils industriels.',
      showStationsInPAS: true,
      selectedStationIds: ['cs', 're', 'cd', 'ds', 'bb'],
      layoutVariant: 'modular',
      ctaMode: 'lead'
    }
  },
  {
    id: 'kids-2',
    title: 'Make & Go',
    category: 'Enfants & Familles',
    tags: ['Design 3D', 'Impression 3D', 'DIY'],
    ageGroup: '8-16 Ans',
    format: 'Workshop',
    duration: '3 Heures',
    price: '400 DHS',
    shortDescription: '1 Mission. 3 Heures. 1 Tangible Trophy.',
    description: 'Transforme tes idées en projets concrets rapidement. Tu viens, tu crées, tu repars avec ton robot, ton t-shirt ou ton jeu.',
    image: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=80',
    stats: [{ name: 'Pratique', value: 100 }, { name: 'Sessions', value: 12 }, { name: 'Fun', value: 100 }],
    active: true,
    schedule: ['Samedi (14:30 - 17:30)'],
    landingPage: {
      enabled: true,
      themeColor: 'blue',
      heroSurTitre: 'L\'ATELIER TRIPWIRE POUR FUTURS INGÉNIEURS',
      heroHeadline: 'Transformez Son Temps d\'Écran en Compétences d\'Ingénieur en Seulement 3 Heures.',
      heroSubHeadline: 'Pas de Lego. Pas de manuels. Vos enfants utiliseront de vrais outils et ramèneront chez eux un projet technologique qu\'ils ont construit eux-mêmes.',
      problemHeadline: 'Pourquoi les ateliers robotiques classiques sont-ils si ennuyeux ?',
      problemBody: 'Parce qu\'ils suivent des notices de montage comme pour des meubles. Chez MakerLab, on hack, on dévie, on expérimente réellement.',
      agitationHeadline: 'Le "Wow Factor" en 180 Minutes.',
      agitationBody: 'Un enfant qui monte un kit Lego ne devient pas Ingénieur. Un enfant qui modélise en CAO, câble un circuit et écrit son propre code — lui, oui.',
      solutionHeadline: 'Make & Go : Le Print Shot d\'Innovation.',
      solutionBody: 'Choisissez votre mission thématique : Robotique, Tech Founder ou Game Creator. 3 Heures d\'immersion totale, un trophée tangible à la clé.',
      layoutVariant: 'classic',
      ctaMode: 'booking'
    }
  }
];
