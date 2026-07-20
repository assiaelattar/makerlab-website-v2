const generatedProgramImages = [
  '/images/makerlab/generated/smart-door-microbit-team-v2.png',
  '/images/makerlab/generated/cad-rover-design-to-prototype-v2.png',
  '/images/makerlab/generated/computer-vision-teachable-rover-v2.png',
  '/images/makerlab/generated/vr-oculus-quest-product-design-v2.png',
  '/images/makerlab/generated/dji-tello-python-flightlab-v2.png',
  '/images/makerlab/generated/print-on-demand-sublimation-v2.png',
  '/images/makerlab/generated/saas-vibe-coding-deploy-v2.png',
  '/images/makerlab/generated/branding-product-kit-v2.png',
  '/images/makerlab/generated/junior-microbit-nightlight-v2.png',
  '/images/makerlab/generated/wind-energy-mdf-prototype-v2.png',
  '/images/makerlab/generated/student-product-presentation-v2.png',
  '/images/makerlab/generated/holiday-camp-marble-run-v1.webp',
  '/images/makerlab/generated/jawaz-smart-toll-gate-v1.webp',
];

export const generatedMakerlabGallery = [
  '/images/makerlab/generated/smart-door-microbit-team-v2.png',
  '/images/makerlab/generated/cad-rover-design-to-prototype-v2.png',
  '/images/makerlab/generated/computer-vision-teachable-rover-v2.png',
  '/images/makerlab/generated/vr-oculus-quest-product-design-v2.png',
  '/images/makerlab/generated/dji-tello-python-flightlab-v2.png',
  '/images/makerlab/generated/print-on-demand-sublimation-v2.png',
  '/images/makerlab/generated/saas-vibe-coding-deploy-v2.png',
  '/images/makerlab/generated/branding-product-kit-v2.png',
  '/images/makerlab/generated/junior-microbit-nightlight-v2.png',
  '/images/makerlab/generated/wind-energy-mdf-prototype-v2.png',
  '/images/makerlab/generated/student-product-presentation-v2.png',
];

export const getGeneratedProgramImage = (item: any, index = 0) => {
  if (item?.imageSource === 'custom' && item?.image) return item.image;

  const haystack = [
    item?.title,
    item?.name,
    item?.category,
    item?.format,
    item?.programType,
    item?.ageGroup,
    item?.age,
    item?.shortDescription,
    item?.description,
    ...(item?.tags || []),
  ].filter(Boolean).join(' ').toLowerCase();

  if (/(holiday|camp|vacance|stage)/.test(haystack)) {
    return '/images/makerlab/generated/holiday-camp-marble-run-v1.webp';
  }
  if (/(jawaz|toll|péage|peage|autorout)/.test(haystack)) {
    return '/images/makerlab/generated/jawaz-smart-toll-gate-v1.webp';
  }
  if (/(école|ecole|school|lycée|lycee|experience-it)/.test(haystack)) {
    return '/images/makerlab/generated/schools-arduino-workshop-v1.webp';
  }
  if (/(\b(?:6|7)\s*(?:ans|years)\b|junior|premier\s+projet|initiation)/.test(haystack)) {
    return '/images/makerlab/generated/junior-microbit-nightlight-v2.png';
  }
  if (/(sublimation|print[\s-]?on[\s-]?demand|impression\s+textile|t-shirt|tshirt)/.test(haystack)) {
    return '/images/makerlab/generated/print-on-demand-sublimation-v2.png';
  }
  if (/(marque|brand|branding|logo|charte|packaging)/.test(haystack)) {
    return '/images/makerlab/generated/branding-product-kit-v2.png';
  }
  if (/(vibe\s*coding|saas|database|base\s+de\s+donn|dÃ©ploiement|deploy|serveur|server)/.test(haystack)) {
    return '/images/makerlab/generated/saas-vibe-coding-deploy-v2.png';
  }
  if (/(vr|metaverse|mÃ©tavers|oculus|quest)/.test(haystack)) {
    return '/images/makerlab/generated/vr-oculus-quest-product-design-v2.png';
  }
  if (/(computer\s+vision|vision\s+par\s+ordinateur|teachable\s+machine|classification\s+d.images)/.test(haystack)) {
    return '/images/makerlab/generated/computer-vision-teachable-rover-v2.png';
  }
  if (/(make\s*&\s*go|make and go|mission|3\s*heures)/.test(haystack)) {
    return '/images/makerlab/generated/smart-door-microbit-team-v2.png';
  }
  if (/business/.test(haystack)) {
    return '/images/makerlab/generated/student-product-presentation-v2.png';
  }
  if (/(capcut|montage|vidéo|video|storytelling)/.test(haystack)) {
    return '/images/makerlab/generated/coding-ai-image-classifier-v1.webp';
  }
  if (/geek/.test(haystack)) {
    return '/images/makerlab/generated/smart-door-microbit-team-v2.png';
  }
  if (/stemquest\s*360/.test(haystack)) {
    return '/images/makerlab/generated/coding-ai-image-classifier-v1.webp';
  }
  if (/(stemquest|parcours|année|annee)/.test(haystack)) {
    return '/images/makerlab/generated/wind-energy-mdf-prototype-v2.png';
  }
  if (/(drone|tello|python)/.test(haystack)) {
    return '/images/makerlab/generated/dji-tello-python-flightlab-v2.png';
  }
  if (/(intelligence artificielle|\bia\b|\bai\b|coding|code|application)/.test(haystack)) {
    return '/images/makerlab/generated/coding-ai-image-classifier-v1.webp';
  }
  if (/(3d|design|cao|cad|fusion|impression|fabrication)/.test(haystack)) {
    return '/images/makerlab/generated/cad-rover-design-to-prototype-v2.png';
  }
  if (/(robot|micro:bit|microbit|électronique|electronique|arduino)/.test(haystack)) {
    return '/images/makerlab/generated/smart-door-microbit-team-v2.png';
  }

  return generatedProgramImages[index % generatedProgramImages.length];
};
