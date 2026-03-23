import { Program } from '../types';

export const initialPrograms: Program[] = [
  // --- KIDS PROGRAMS ---
  {
    id: 'kids-1',
    title: 'STEMQuest',
    category: 'Robotics', // General category
    ageGroup: '7-14 Ans',
    format: 'Year Program',
    duration: '2x par Semaine',
    price: 'Sur devis',
    shortDescription: 'Kids learn engineering, robotics, AI and creative technologies through projects.',
    description: 'STEMQuest est notre programme annuel phare. Les enfants apprennent l\'ingénierie, la robotique, l\'IA et les technologies créatives en réalisant des projets concrets. Un apprentissage pratique et immersif tout au long de l\'année scolaire.',
    image: 'https://placehold.co/800x600/2563A8/FFFFFF.png?text=STEMQuest\nYear+Program',
    stats: [{ name: 'Projets', value: 30 }, { name: 'Technologies', value: 15 }, { name: 'Fun', value: 100 }],
    active: true,
    isFeatured: true,
    schedule: ['Mercredi', 'Samedi']
  },
  {
    id: 'kids-2',
    title: 'Make & Go',
    category: 'Design',
    ageGroup: '8-16 Ans',
    format: 'Workshop',
    duration: '3 Heures',
    price: '400 DHS',
    shortDescription: 'Short workshops. Fast learning sessions. Build something in one workshop.',
    description: 'Transforme tes idées en projets concrets rapidement. Tu viens, tu crées, tu repars. Nos ateliers Make & Go sont conçus pour découvrir une technologie spécifique et repartir avec un produit fini.',
    image: 'https://placehold.co/800x600/E87722/FFFFFF.png?text=Make+%26+Go\nWorkshops',
    stats: [{ name: 'Pratique', value: 100 }, { name: 'Théorie', value: 20 }, { name: 'Découverte', value: 90 }],
    active: true,
    schedule: ['Week-ends']
  },
  {
    id: 'kids-3',
    title: 'Holiday Camps',
    category: 'Coding',
    ageGroup: '7-15 Ans',
    format: 'Workshop',
    duration: '1 Semaine',
    price: 'Sur devis',
    shortDescription: 'Seasonal programs. Summer, Winter, School holidays challenges.',
    description: 'Des programmes intenses pendant les vacances scolaires. Summer camps, Winter camps et challenges d\'innovation pour apprendre en s\'amusant pendant les pauses scolaires.',
    image: 'https://placehold.co/800x600/27A060/FFFFFF.png?text=Holiday+Camps\nBootcamps',
    stats: [{ name: 'Immersion', value: 100 }, { name: 'Projets', value: 5 }, { name: 'Amis', value: 100 }],
    active: true,
    schedule: ['Vacances scolaires']
  },

  // --- SCHOOL PROGRAMS ---
  {
    id: 'school-1',
    title: 'Experience-It',
    category: 'Robotics',
    ageGroup: 'Écoles / Lycées',
    format: 'School Program',
    duration: 'Demi-journée',
    price: 'Sur devis',
    shortDescription: 'High-Tech Educational Visit. Expose students to future technologies.',
    description: 'Une sortie éducative high-tech pour les écoles. Les élèves découvrent les technologies de pointe : Drones, Découpe Laser, Impression 3D, Mondes Réalité Virtuelle, IA et Robotique. Le but : exposer les élèves aux technologies du futur.',
    image: 'https://placehold.co/800x600/9b59b6/FFFFFF.png?text=Experience-It\nSchool+Visits',
    stats: [{ name: 'Technologies', value: 6 }, { name: 'Wow Factor', value: 100 }],
    active: true,
    isFeatured: true,
    schedule: ['Sur réservation']
  },
  {
    id: 'school-2',
    title: 'STEMQuest At School',
    category: 'Coding',
    ageGroup: 'Écoles',
    format: 'School Program',
    duration: 'Année Scolaire',
    price: 'Sur devis',
    shortDescription: 'After-school program delivered directly in schools.',
    description: 'MakerLab apporte son expertise directement dans votre école en format "After-school". Nous fournissons le matériel, le programme éducatif (curriculum) et les formateurs experts pour des ateliers hebdomadaires.',
    image: 'https://placehold.co/800x600/34495e/FFFFFF.png?text=STEMQuest\nAt+School',
    stats: [{ name: 'Curriculum', value: 100 }, { name: 'Matériel Inclus', value: 100 }],
    active: true,
    schedule: []
  },
  {
    id: 'school-3',
    title: 'Custom Workshops',
    category: 'AI',
    ageGroup: 'Écoles / Universités',
    format: 'School Program',
    duration: 'À la carte',
    price: 'Sur devis',
    shortDescription: 'MakerLab delivers custom themed workshops at your school.',
    description: 'Vous choisissez le thème (Robotique, IA, Ingénierie, Environnement, Espace...) et MakerLab assure l\'atelier chez vous pour initier vos élèves ou célébrer vos événements internationaux (Science Days, Engineering Days, etc.).',
    image: 'https://placehold.co/800x600/f1c40f/000000.png?text=Custom+Workshops\nOn-Demand',
    stats: [{ name: 'Personnalisation', value: 100 }],
    active: true,
    schedule: []
  },
  {
    id: 'school-4',
    title: 'Students Project Acceleration',
    category: 'Business',
    ageGroup: 'Lycées / Universités',
    format: 'School Program',
    duration: 'Accompagnement',
    price: 'Sur devis',
    shortDescription: 'Host your students to work on their projects at MakerLab.',
    description: 'Les écoles peuvent envoyer leurs étudiants travailler sur leurs projets directement au sein du MakerLab. Nous mettons à disposition les machines (Impression 3D, Laser), les matériaux, l\'expertise technique et le mentorat.',
    image: 'https://placehold.co/800x600/e74c3c/FFFFFF.png?text=Project\nAcceleration',
    stats: [{ name: 'Mentorat', value: 100 }, { name: 'Prototypage', value: 100 }],
    active: true,
    schedule: []
  }
];
