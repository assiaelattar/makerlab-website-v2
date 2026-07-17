import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bot,
  CalendarDays,
  Check,
  Code2,
  Cpu,
  GraduationCap,
  Printer,
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { usePrograms } from '../contexts/ProgramContext';
import { useMissions } from '../contexts/MissionContext';

const fallbackImages = [
  'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=84&w=1200',
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=84&w=1200',
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=84&w=1200',
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

const getImage = (item: any, index: number) => {
  const image = item.image || item.coverImage;
  return image && !image.includes('placehold.co') ? image : fallbackImages[index % fallbackImages.length];
};

const getTitle = (item: any) => item.title || item.name || 'Programme MakerLab';
const getDescription = (item: any) => item.shortDescription || item.description || 'Une expérience MakerLab entièrement pratique.';

export const Programs: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [selectedAge, setSelectedAge] = React.useState('All');
  const [showFilters, setShowFilters] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const { programs } = usePrograms();
  const { missions } = useMissions();
  const activePrograms = programs.filter(program => program.active);
  const activeMissions = missions.filter(mission => mission.active);

  const categories = React.useMemo(() => {
    const values = Array.from(new Set(activePrograms.map(program => program.category).filter(Boolean)));
    return ['All', ...values];
  }, [activePrograms]);

  const ages = ['All', '7-11 ans', '12-17 ans', 'Adultes'];

  const filteredPrograms = activePrograms.filter(program => {
    const matchesCategory = selectedCategory === 'All' || program.category === selectedCategory;
    const matchesAge = selectedAge === 'All'
      || (selectedAge === '7-11 ans' && (program.ageGroup?.match(/7|8|9|10|11/) || !program.ageGroup))
      || (selectedAge === '12-17 ans' && program.ageGroup?.match(/12|13|14|15|16|17/))
      || (selectedAge === 'Adultes' && ['Business', 'Entrepreneuriat'].includes(program.category));
    const searchable = `${program.title} ${program.category} ${program.shortDescription || ''} ${program.description || ''}`.toLowerCase();
    return matchesCategory && matchesAge && (!search.trim() || searchable.includes(search.trim().toLowerCase()));
  });

  const relevantMissions = selectedCategory === 'All'
    ? activeMissions.filter(mission => {
        const searchable = `${mission.title} ${mission.category || ''} ${mission.description || ''}`.toLowerCase();
        return !search.trim() || searchable.includes(search.trim().toLowerCase());
      })
    : [];

  const catalogItems = [...filteredPrograms, ...relevantMissions];
  const hasActiveFilters = selectedCategory !== 'All' || selectedAge !== 'All' || search.trim();

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedAge('All');
    setSearch('');
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f8fa] pb-20 text-slate-900">
      <SEO
        title="Programmes de robotique, code et IA à Casablanca"
        description="Comparez les ateliers MakerLab par âge, durée et format: robotique, coding, IA, design 3D, camps et parcours annuels."
        keywords="robotique casablanca, camp robotique casablanca, atelier enfant casablanca, coding for kids, impression 3D"
      />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-brand-orange">
                <Sparkles size={15} /> Programmes MakerLab
              </div>
              <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.5rem,4.7vw,4.2rem)] font-bold leading-[0.98]">
                Choisir une expérience, pas juste un cours.
              </h1>
              <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-slate-600 md:text-lg">
                Comparez les formats, puis ouvrez le programme qui correspond à son âge et à son envie de construire.
              </p>
            </div>

            <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-lg border border-slate-200 bg-[#f6f8fa]">
              {[
                { icon: Cpu, title: '3 heures', text: 'pour découvrir', color: 'text-brand-orange' },
                { icon: CalendarDays, title: 'Vacances', text: 'pour explorer', color: 'text-brand-green' },
                { icon: GraduationCap, title: 'À l’année', text: 'pour progresser', color: 'text-brand-blue' },
              ].map(item => (
                <div key={item.title} className="px-3 py-4 text-center md:px-4">
                  <item.icon size={18} className={`mx-auto ${item.color}`} />
                  <p className="mt-2 text-sm font-extrabold">{item.title}</p>
                  <p className="mt-1 text-[11px] font-semibold text-slate-500">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid h-1 grid-cols-4">
          <span className="bg-brand-orange" />
          <span className="bg-brand-blue" />
          <span className="bg-brand-green" />
          <span className="bg-brand-red" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-7 md:px-8">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="flex gap-3">
            <label className="flex min-h-12 flex-1 items-center gap-3 rounded-lg border border-slate-200 bg-[#f6f8fa] px-4 transition focus-within:border-brand-blue focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-blue/10">
              <Search size={18} className="shrink-0 text-slate-400" />
              <input
                value={search}
                onChange={event => setSearch(event.target.value)}
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
                    onClick={() => setSelectedCategory(category)}
                    className={`min-h-10 rounded-full border px-4 text-xs font-extrabold transition ${
                      selectedCategory === category
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {category === 'All' ? 'Tous' : category}
                  </button>
                ))}
              </div>
            </div>
            <label className="block min-w-[180px]">
              <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.13em] text-slate-400">Âge</span>
              <select value={selectedAge} onChange={event => setSelectedAge(event.target.value)} className="min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-extrabold text-slate-700">
                {ages.map(age => <option key={age} value={age}>{age === 'All' ? 'Tous les âges' : age}</option>)}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-blue">Catalogue</p>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
              {catalogItems.length} {catalogItems.length === 1 ? 'expérience disponible' : 'expériences disponibles'}
            </h2>
          </div>
          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className="w-fit text-sm font-extrabold text-brand-blue hover:underline">
              Effacer les filtres
            </button>
          )}
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                className="group flex min-h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                  <img
                    src={image}
                    alt={title}
                    loading="lazy"
                    onError={event => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = fallbackImages[index % fallbackImages.length];
                    }}
                    className="size-full object-cover transition duration-500 group-hover:scale-[1.025]"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-2 text-[10px] font-extrabold uppercase text-slate-800 shadow-sm">
                    {item.category || 'Mission'}
                  </span>
                  <span className={`absolute right-4 top-4 flex size-10 items-center justify-center rounded-lg ${style.iconClass}`}>
                    <Icon size={18} />
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-2xl font-extrabold leading-tight">{title}</h3>
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
