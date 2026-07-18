import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  Code2,
  Cpu,
  Printer,
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { usePrograms } from '../contexts/ProgramContext';
import { useMissions } from '../contexts/MissionContext';
import { getGeneratedProgramImage } from '../utils/makerlabImages';
import { getPublicProgramCategory, getPublicProgramDescription, getPublicProgramTitle } from '../utils/programDisplay';

const fallbackImages = [
  '/images/makerlab/generated/stemquest-mdf-engineering-v1.webp',
  '/images/makerlab/generated/make-and-go-desk-lamp-v1.webp',
  '/images/makerlab/generated/schools-arduino-workshop-v1.webp',
];

const categoryStyle = (category = '', index = 0) => {
  const text = category.toLowerCase();
  if (text.includes('robot') || text.includes('enfants')) return { icon: Bot, iconClass: 'bg-brand-orange/10 text-brand-orange' };
  if (text.includes('coding') || text.includes('ia') || text.includes('ai')) return { icon: Code2, iconClass: 'bg-brand-blue/10 text-brand-blue' };
  if (text.includes('design') || text.includes('3d')) return { icon: Printer, iconClass: 'bg-brand-green/10 text-brand-green' };
  return [
    { icon: Cpu, iconClass: 'bg-brand-orange/10 text-brand-orange' },
    { icon: Code2, iconClass: 'bg-brand-blue/10 text-brand-blue' },
    { icon: Printer, iconClass: 'bg-brand-green/10 text-brand-green' },
  ][index % 3];
};

const getImage = (item: any, index: number) => getGeneratedProgramImage(item, index);

const getTitle = getPublicProgramTitle;
const getDescription = getPublicProgramDescription;

const catalogTones = [
  'bg-[#f7f5ef]',
  'bg-[#e8eff7]',
  'bg-[#edf5cf]',
  'bg-[#f8e8dc]',
];

export const Programs: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = React.useMemo(() => new URLSearchParams(location.search), [location.search]);
  const focus = queryParams.get('focus');
  const type = queryParams.get('type');
  const [selectedCategory, setSelectedCategory] = React.useState(queryParams.get('category') || 'All');
  const [selectedAge, setSelectedAge] = React.useState(queryParams.get('age') || 'All');
  const [showFilters, setShowFilters] = React.useState(false);
  const [search, setSearch] = React.useState(queryParams.get('search') || '');

  const { programs } = usePrograms();
  const { missions } = useMissions();
  const activePrograms = programs.filter(program => program.active);
  const activeMissions = missions.filter(mission => mission.active);

  const categories = React.useMemo(() => {
    const values = Array.from(new Set(activePrograms.map(program => program.category).filter(Boolean)));
    return ['All', ...values];
  }, [activePrograms]);

  const ages = ['All', '7-11 ans', '12-17 ans', 'Adultes'];

  React.useEffect(() => {
    setSelectedCategory(queryParams.get('category') || 'All');
    setSelectedAge(queryParams.get('age') || 'All');
    setSearch(queryParams.get('search') || '');
  }, [location.search, queryParams]);

  const updateQuery = (updates: Record<string, string>) => {
    const params = new URLSearchParams(location.search);
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'All') params.delete(key);
      else params.set(key, value);
    });
    const nextSearch = params.toString();
    navigate({ pathname: '/programs', search: nextSearch ? `?${nextSearch}` : '' }, { replace: true });
  };

  const filteredPrograms = activePrograms.filter(program => {
    const programText = `${program.title} ${program.category} ${program.format || ''} ${program.programType || ''} ${program.duration || ''} ${program.tags?.join(' ') || ''} ${program.shortDescription || ''} ${program.description || ''}`.toLowerCase();
    const isCamp = /(camp|vacance|vacances|summer|stage)/.test(programText);
    if (focus === 'missions' && (isCamp || !/(workshop|make & go|make and go|3 heures|3h|mission)/.test(programText))) return false;
    if (type === 'camp' && !/(camp|vacance|vacances|summer|stage)/.test(programText)) return false;
    if (type === 'annual' && !/(annuel|annual|year program|année|annee|stemquest)/.test(programText)) return false;
    const matchesCategory = selectedCategory === 'All' || program.category === selectedCategory;
    const matchesAge = selectedAge === 'All'
      || (selectedAge === '7-11 ans' && (program.ageGroup?.match(/7|8|9|10|11/) || !program.ageGroup))
      || (selectedAge === '12-17 ans' && program.ageGroup?.match(/12|13|14|15|16|17/))
      || (selectedAge === 'Adultes' && ['Business', 'Entrepreneuriat'].includes(program.category));
    const searchable = `${program.title} ${program.category} ${program.shortDescription || ''} ${program.description || ''}`.toLowerCase();
    return matchesCategory && matchesAge && (!search.trim() || searchable.includes(search.trim().toLowerCase()));
  });

  const relevantMissions = selectedCategory === 'All' && !type
    ? activeMissions.filter(mission => {
        const searchable = `${mission.title} ${mission.category || ''} ${mission.description || ''}`.toLowerCase();
        return !search.trim() || searchable.includes(search.trim().toLowerCase());
      })
    : [];

  const catalogItems = [...filteredPrograms, ...relevantMissions].filter((item, index, items) => {
    const normalizedTitle = getTitle(item).trim().toLocaleLowerCase('fr');
    return items.findIndex(candidate => getTitle(candidate).trim().toLocaleLowerCase('fr') === normalizedTitle) === index;
  });
  const hasActiveFilters = Boolean(selectedCategory !== 'All' || selectedAge !== 'All' || search.trim());

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedAge('All');
    setSearch('');
    updateQuery({ category: '', age: '', search: '' });
  };

  const viewLinks = [
    { label: 'Tous', description: 'Comparer', to: '/programs', active: !focus && !type },
    { label: '3 heures', description: 'Découvrir', to: '/programs?focus=missions', active: focus === 'missions' },
    { label: 'Vacances', description: 'Explorer', to: '/programs?type=camp', active: type === 'camp' },
    { label: 'À l’année', description: 'Progresser', to: '/programs?type=annual', active: type === 'annual' },
  ];
  const recommendedItem = catalogItems.find(item => /make\s*&\s*go|mission|rover/i.test(getTitle(item))) || catalogItems[0];
  const recommendedIsMission = recommendedItem && 'date' in recommendedItem;
  const recommendedPath = recommendedItem
    ? recommendedIsMission
      ? `/programs/kids-2?missionId=${recommendedItem.id}`
      : `/programs/${recommendedItem.id}`
    : '/quiz';

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f5ef] pb-20 text-[#0b1726]">
      <SEO
        title="Programmes de robotique, code et IA à Casablanca"
        description="Comparez les ateliers MakerLab par âge, durée et format: robotique, coding, IA, design 3D, camps et parcours annuels."
        keywords="robotique casablanca, camp robotique casablanca, atelier enfant casablanca, coding for kids, impression 3D"
      />

      <section className="relative overflow-hidden border-b border-[#0b1726]/12 bg-[#f7f5ef]">
        <div aria-hidden="true" className="home-hero-grid absolute inset-0 opacity-45" />
        <div className="relative mx-auto max-w-7xl px-4 pb-0 pt-10 md:px-8 md:pt-14">
          <div className="grid gap-9 lg:grid-cols-[0.88fr_1.12fr] lg:items-end lg:gap-12">
            <div className="pb-2 lg:pb-12">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-brand-orange">
                <Sparkles size={15} /> Programmes MakerLab
              </div>
              <h1 className="mt-4 max-w-3xl font-['Geist'] text-[clamp(2.65rem,5vw,5.25rem)] font-semibold leading-[0.92] tracking-[-0.05em]">
                Choisir le premier projet qui lui donnera envie d’aller plus loin.
              </h1>
              <p className="mt-6 max-w-2xl text-base font-semibold leading-7 text-[#4d5b6e] md:text-lg">
                {focus === 'missions'
                  ? 'Les missions Make & Go sont des ateliers de 3 heures : votre enfant choisit une thématique, construit un vrai projet et repart avec son résultat.'
                  : type === 'camp'
                    ? 'Retrouvez les camps MakerLab pendant les vacances scolaires et les stages intensifs, avec les détails, la brochure et la réservation.'
                    : type === 'annual'
                      ? 'Comparez les parcours réguliers qui permettent à votre enfant de progresser, créer un portfolio et maîtriser les technologies sur la durée.'
                      : 'Commencez par le résultat qu’il veut construire. Chaque page explique les outils, le niveau, le risque et la prochaine étape.'}
              </p>
              <Link to="/quiz" className="ml-button mt-7 w-full min-h-13 bg-[#df661e] px-6 text-white shadow-[0_14px_32px_rgba(223,102,30,.2)] sm:w-fit">
                Recommandation en 2 minutes <ArrowRight size={17} />
              </Link>
            </div>

            {recommendedItem && (
              <Link to={recommendedPath} className="group relative min-h-[350px] overflow-hidden bg-[#07111f] sm:min-h-[460px] lg:min-h-[570px]">
                <img
                  src={getImage(recommendedItem, 0)}
                  alt={getTitle(recommendedItem)}
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07111f] via-[#07111f]/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#d9f56f]">Premier choix recommandé</p>
                  <div className="mt-3 flex items-end justify-between gap-5">
                    <div>
                      <h2 className="font-['Geist'] text-3xl font-semibold leading-none tracking-[-0.04em] sm:text-5xl">{getTitle(recommendedItem)}</h2>
                      <p className="mt-3 text-sm font-semibold text-white/68">{recommendedItem.duration || '3 heures'} · {recommendedItem.ageGroup || recommendedItem.age || '8-17 ans'}</p>
                    </div>
                    <span className="flex size-12 shrink-0 items-center justify-center bg-[#df661e] text-white sm:size-14"><ArrowUpRight size={22} /></span>
                  </div>
                </div>
              </Link>
            )}
          </div>

          <nav aria-label="Formats de programmes" className="mt-7 grid grid-cols-2 border-l border-t border-[#0b1726]/14 sm:grid-cols-4 lg:mt-0">
            {viewLinks.map(item => (
              <Link
                key={item.label}
                to={item.to}
                aria-current={item.active ? 'page' : undefined}
                className={`group min-h-20 border-b border-r border-[#0b1726]/14 px-4 py-4 transition sm:px-5 ${
                  item.active
                    ? 'bg-[#0b1726] text-white'
                    : 'bg-[#f7f5ef]/90 text-[#0b1726] hover:bg-white'
                }`}
              >
                <span className={`block text-[9px] font-extrabold uppercase tracking-[0.15em] ${item.active ? 'text-[#d9f56f]' : 'text-[#667286]'}`}>{item.description}</span>
                <span className="mt-1 flex items-center justify-between gap-2 text-sm font-extrabold">
                  {item.label}<ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-7 md:px-8">
        <div className="border border-[#0b1726]/14 bg-white p-4 shadow-[0_18px_50px_rgba(11,23,38,.06)] md:p-5">
          <div className="flex gap-3">
            <label className="flex min-h-12 flex-1 items-center gap-3 rounded-lg border border-slate-200 bg-[#f6f8fa] px-4 transition focus-within:border-brand-blue focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-blue/10">
              <Search size={18} className="shrink-0 text-slate-400" />
              <input
                value={search}
                onChange={event => {
                  setSearch(event.target.value);
                  updateQuery({ search: event.target.value });
                }}
                placeholder="Rechercher robotique, IA, design 3D..."
                className="ml-search-reset min-h-0 w-full border-0 bg-transparent p-0 text-sm font-bold outline-none"
              />
            </label>
            <button
              type="button"
              onClick={() => setShowFilters(value => !value)}
              className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 md:hidden"
              aria-label="Afficher les filtres"
              aria-expanded={showFilters}
            >
              <SlidersHorizontal size={19} />
            </button>
          </div>

          <div className={`${showFilters ? 'grid' : 'hidden'} mt-4 gap-5 border-t border-slate-100 pt-4 md:grid md:grid-cols-[1fr_auto] md:items-end`}>
            <div>
              <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.13em] text-slate-400">Type de programme</p>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(category);
                      updateQuery({ category });
                    }}
                    className={`min-h-10 rounded-full border px-4 text-xs font-extrabold transition ${
                      selectedCategory === category
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {category === 'All' ? 'Tous' : getPublicProgramCategory({ category })}
                  </button>
                ))}
              </div>
            </div>
            <label className="block min-w-[180px]">
              <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.13em] text-slate-400">Âge</span>
              <select value={selectedAge} onChange={event => {
                setSelectedAge(event.target.value);
                updateQuery({ age: event.target.value });
              }} className="min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-extrabold text-slate-700">
                {ages.map(age => <option key={age} value={age}>{age === 'All' ? 'Tous les âges' : age}</option>)}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-blue">Catalogue</p>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
              {focus === 'missions'
                ? 'Missions Make & Go'
                : type === 'camp'
                  ? 'Camps et stages de vacances'
                  : type === 'annual'
                    ? 'Parcours à l’année'
                  : `${catalogItems.length} ${catalogItems.length === 1 ? 'expérience disponible' : 'expériences disponibles'}`}
            </h2>
          </div>
          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className="w-fit text-sm font-extrabold text-brand-blue hover:underline">
              Effacer les filtres
            </button>
          )}
        </div>

        <section className="mt-6 grid border-l border-t border-[#0b1726]/14 md:grid-cols-2 xl:grid-cols-3">
          {catalogItems.map((item: any, index) => {
            const title = getTitle(item);
            const description = getDescription(item);
            const image = getImage(item, index);
            const isMission = 'date' in item;
            const detailPath = isMission ? `/programs/kids-2?missionId=${item.id}` : `/programs/${item.id}`;
            const style = categoryStyle(item.category, index);
            const Icon = style.icon;

            return (
              <Link
                key={`${isMission ? 'mission' : 'program'}-${item.id}`}
                to={detailPath}
                className={`group flex min-h-full flex-col overflow-hidden border-b border-r border-[#0b1726]/14 transition duration-300 hover:relative hover:z-10 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(11,23,38,.14)] ${catalogTones[index % catalogTones.length]}`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                  <img
                    src={image}
                    alt={title}
                    loading={index < 3 ? 'eager' : 'lazy'}
                    onError={event => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = fallbackImages[index % fallbackImages.length];
                    }}
                    className="size-full object-cover transition duration-500 group-hover:scale-[1.025]"
                  />
                  <span className="absolute left-4 top-4 bg-white/95 px-3 py-2 text-[10px] font-extrabold uppercase text-slate-800 shadow-sm">
                    {getPublicProgramCategory(item)}
                  </span>
                  <span className={`absolute right-4 top-4 flex size-10 items-center justify-center ${style.iconClass}`}>
                    <Icon size={18} />
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-['Geist'] text-2xl font-semibold leading-tight tracking-[-0.025em]">{title}</h3>
                  <p className="mt-3 line-clamp-2 min-h-[48px] text-sm font-semibold leading-6 text-slate-500">{description}</p>

                  <dl className="mt-5 grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-100 py-4">
                    {[
                      ['Âge', item.ageGroup || item.age || '8-17 ans'],
                      ['Durée', item.duration || '3h'],
                      ['Tarif', item.price || '400 DHS'],
                    ].map(([label, value]) => (
                      <div key={label} className="px-3 first:pl-0 last:pr-0">
                        <dt className="text-[9px] font-extrabold uppercase tracking-[0.11em] text-slate-400">{label}</dt>
                        <dd className="mt-1 line-clamp-1 text-xs font-extrabold text-slate-800">{value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-auto flex items-center justify-between pt-5">
                    <span className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-600">
                      <span className="flex size-6 items-center justify-center rounded-full bg-brand-green/10 text-brand-green"><Check size={13} /></span>
                      Projet concret
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-900">
                      Voir le programme <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </section>

        {catalogItems.length === 0 && (
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-10 text-center">
            <Users className="mx-auto text-slate-300" size={38} />
            <h2 className="mt-4 text-xl font-extrabold">Aucun programme ne correspond à ces filtres.</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">Essayez un autre âge ou effacez la recherche.</p>
            <button type="button" onClick={clearFilters} className="ml-button mt-6 bg-slate-900 px-6 text-white">Voir tous les programmes</button>
          </div>
        )}
      </section>
    </main>
  );
};
