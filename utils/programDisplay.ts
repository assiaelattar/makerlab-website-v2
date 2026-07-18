const sourceText = (item: any) => [
  item?.title,
  item?.name,
  item?.category,
  item?.programType,
  item?.format,
  item?.shortDescription,
  item?.description,
].filter(Boolean).join(' ').toLocaleLowerCase('fr');

export const getPublicProgramTitle = (item: any) => {
  if (item?.publicTitle?.trim()) return item.publicTitle.trim();
  const text = sourceText(item);
  if (/(holiday|camp|vacance)/.test(text)) return 'Camps de vacances';
  if (/(jawaz|toll|tall gate|autorout)/.test(text)) return 'Barrière intelligente Jawaz';
  if (/(nasa rover|rover robot)/.test(text)) return 'Rover martien NASA';
  return item?.title || item?.name || 'Programme MakerLab';
};

export const getPublicProgramDescription = (item: any) => {
  if (item?.publicDescription?.trim()) return item.publicDescription.trim();
  const text = sourceText(item);
  if (/(holiday|camp|vacance)/.test(text)) return 'Des défis de robotique et de fabrication pendant les vacances, avec un projet concret à présenter.';
  if (/(jawaz|toll|tall gate|autorout)/.test(text)) return 'Concevoir et programmer une barrière automatique inspirée des péages autoroutiers.';
  if (/(nasa rover|rover robot)/.test(text)) return 'Construire et programmer un rover capable de se déplacer et relever des défis.';
  if (/make\s*&\s*go|make and go/.test(text)) return 'Un atelier court pour imaginer, fabriquer et repartir avec un projet fonctionnel.';
  if (/stemquest/.test(text)) return 'Un parcours par projets pour progresser en ingénierie, robotique, code, IA et création numérique.';
  return item?.shortDescription || item?.description || 'Une expérience MakerLab entièrement pratique.';
};

export const getPublicProgramCategory = (item: any) => {
  if (item?.publicCategory?.trim()) return item.publicCategory.trim();
  const category = item?.category || 'Programme MakerLab';
  const normalized = category.toLocaleLowerCase('fr');
  if (normalized.includes('robotics engineering')) return 'Robotique & ingénierie';
  if (normalized.includes('schools') || normalized.includes('organizations')) return 'Écoles & organisations';
  if (normalized.includes('children') && normalized.includes('famil')) return 'Enfants & familles';
  if (normalized.includes('children')) return 'Enfants (7-17 ans)';
  return category;
};
