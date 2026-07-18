export const defaultPageContent = {
  home: {
    eyebrow: 'MakerLab Academy',
    title: 'Ils utilisent déjà la tech.',
    accent: 'Apprenons-leur à la construire.',
    description: 'Des projets concrets en robotique, code, IA et fabrication.',
  },
  about: {
    eyebrow: 'À propos de MakerLab',
    title: 'La technologie ne se regarde pas.',
    accent: 'Elle se construit.',
    description: 'MakerLab est une académie STEM où les enfants imaginent, conçoivent, codent, testent et présentent de vrais projets.',
  },
  schools: {
    eyebrow: 'Écoles et partenaires',
    title: 'Transformez votre école en',
    accent: 'laboratoire d’innovation.',
    description: 'Des expériences STEM animées par nos mentors, avec de vrais outils, des résultats visibles et un format adapté à votre établissement.',
  },
  contact: {
    eyebrow: 'Parlons de votre projet',
    title: 'Une question. Une idée.',
    accent: 'Une prochaine étape.',
    description: 'Parents, écoles et partenaires : choisissez le bon canal et notre équipe vous répond avec une recommandation claire.',
  },
  navigation: {
    trialLabel: 'Essai gratuit',
    finderLabel: 'Trouver son programme',
  },
  footer: {
    description: 'Une académie d’ingénierie et d’innovation où les enfants transforment leurs idées en projets réels.',
    ctaLabel: 'Trouver un programme',
  },
};

export type PageContent = typeof defaultPageContent;
