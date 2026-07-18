const generatedProgramImages = [
  '/images/makerlab/generated/stemquest-mdf-engineering-v1.webp',
  '/images/makerlab/generated/robotics-microbit-rover-v1.webp',
  '/images/makerlab/generated/coding-ai-image-classifier-v1.webp',
  '/images/makerlab/generated/cad-fdm-3d-printing-v1.webp',
  '/images/makerlab/generated/digital-fabrication-gears-v1.webp',
  '/images/makerlab/generated/mentor-microbit-electronics-v1.webp',
  '/images/makerlab/generated/holiday-camp-marble-run-v1.webp',
  '/images/makerlab/generated/jawaz-smart-toll-gate-v1.webp',
];

export const generatedMakerlabGallery = [
  '/images/makerlab/generated/mentor-microbit-electronics-v1.webp',
  '/images/makerlab/generated/holiday-camp-marble-run-v1.webp',
  '/images/makerlab/generated/python-dji-tello-coding-v1.webp',
  '/images/makerlab/generated/digital-fabrication-gears-v1.webp',
  '/images/makerlab/generated/jawaz-smart-toll-gate-v1.webp',
  '/images/makerlab/generated/cad-fdm-3d-printing-v1.webp',
];

export const getGeneratedProgramImage = (item: any, index = 0) => {
  if (item?.imageSource === 'custom' && item?.image) return item.image;

  const haystack = [
    item?.title,
    item?.name,
    item?.category,
    item?.format,
    item?.programType,
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
  if (/(make\s*&\s*go|make and go|mission|3\s*heures)/.test(haystack)) {
    return '/images/makerlab/generated/make-and-go-desk-lamp-v1.webp';
  }
  if (/(marque|brand|business|t-shirt|tshirt)/.test(haystack)) {
    return '/images/makerlab/generated/make-and-go-desk-lamp-v1.webp';
  }
  if (/(capcut|montage|vidéo|video|storytelling)/.test(haystack)) {
    return '/images/makerlab/generated/coding-ai-image-classifier-v1.webp';
  }
  if (/(geek|tech)/.test(haystack)) {
    return '/images/makerlab/generated/robotics-microbit-rover-v1.webp';
  }
  if (/stemquest\s*360/.test(haystack)) {
    return '/images/makerlab/generated/coding-ai-image-classifier-v1.webp';
  }
  if (/(stemquest|parcours|année|annee)/.test(haystack)) {
    return '/images/makerlab/generated/stemquest-mdf-engineering-v1.webp';
  }
  if (/(drone|tello|python)/.test(haystack)) {
    return '/images/makerlab/generated/python-dji-tello-coding-v1.webp';
  }
  if (/(intelligence artificielle|\bia\b|\bai\b|coding|code|application)/.test(haystack)) {
    return '/images/makerlab/generated/coding-ai-image-classifier-v1.webp';
  }
  if (/(3d|design|cao|cad|fusion|impression|fabrication)/.test(haystack)) {
    return '/images/makerlab/generated/cad-fdm-3d-printing-v1.webp';
  }
  if (/(robot|micro:bit|microbit|électronique|electronique|arduino)/.test(haystack)) {
    return '/images/makerlab/generated/robotics-microbit-rover-v1.webp';
  }

  return generatedProgramImages[index % generatedProgramImages.length];
};
