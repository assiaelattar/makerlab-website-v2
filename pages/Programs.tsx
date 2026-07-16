import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, CheckCircle2, Code2, Cpu, Printer, Search, SlidersHorizontal, Sparkles, Users } from 'lucide-react';
import { SEO } from '../components/SEO';
import { usePrograms } from '../contexts/ProgramContext';
import { useMissions } from '../contexts/MissionContext';
import { Reveal } from '../components/Motion';

const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=900';

const categoryStyle = (category = '', index = 0) => {
  const text = category.toLowerCase();
  if (text.includes('robot') || text.includes('enfants')) return { icon: Bot, color: 'bg-brand-orange', text: 'text-brand-orange' };
  if (text.includes('coding') || text.includes('ia') || text.includes('ai')) return { icon: Code2, color: 'bg-brand-blue', text: 'text-brand-blue' };
  if (text.includes('design') || text.includes('3d')) return { icon: Printer, color: 'bg-brand-green', text: 'text-brand-green' };
  return [
    { icon: Cpu, color: 'bg-brand-orange', text: 'text-brand-orange' },
    { icon: Code2, color: 'bg-brand-blue', text: 'text-brand-blue' },
    { icon: Printer, color: 'bg-brand-green', text: 'text-brand-green' },
  ][index % 3];
};

const getImage = (item: any) => item.image || item.coverImage || fallbackImage;
const getTitle = (item: any) => item.title || item.name || 'Programme MakerLab';
const getDescription = (item: any) => item.shortDescription || item.description || 'Un atelier MakerLab entièrement pratique.';

export const Programs: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [selectedAge, setSelectedAge] = React.useState('All');
  const [showFilters, setShowFilters] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const { programs } = usePrograms();
  const { missions } = useMissions();
  const activePrograms = programs.filter(program => program.active);

  const categories = React.useMemo(() => {
    const raw = Array.from(new Set(activePrograms.map(program => program.category).filter(Boolean)));
    return ['All', 'Enfants & Familles', 'Unitaires (3h)', 'Écoles', ...raw.filter(cat => !['Enfants & Familles', 'Écoles'].includes(cat))];
  }, [activePrograms]);
  const ages = ['All', '7-11 ans', '12-17 ans', 'Adultes'];

  const filteredPrograms = activePrograms.filter(program => {
    const matchesCategory = selectedCategory === 'All'
      || program.category === selectedCategory
      || (selectedCategory === 'Écoles' && (program.category?.includes('École') || program.format === 'School Program'));

    const matchesAge = selectedAge === 'All'
      || (selectedAge === '7-11 ans' && (program.ageGroup?.includes('7') || program.ageGroup?.includes('8') || !program.ageGroup))
      || (selectedAge === '12-17 ans' && (program.ageGroup?.includes('12') || program.ageGroup?.includes('17')))
      || (selectedAge === 'Adultes' && (program.category === 'Business' || program.category === 'Entrepreneuriat'));

    const searchable = `${program.title} ${program.category} ${program.shortDescription || ''} ${program.description || ''}`.toLowerCase();
    const matchesSearch = !search.trim() || searchable.includes(search.trim().toLowerCase());

    return matchesCategory && matchesAge && matchesSearch;
  });

  const relevantMissions = (selectedCategory === 'All' || selectedCategory === 'Unitaires (3h)')
    ? missions.filter(mission => mission.active)
    : [];

  const catalogItems = [...filteredPrograms, ...relevantMissions];
  const heroImage = getImage(activePrograms[0] || missions[0] || {});

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f3f5f7] px-4 pb-24 pt-5 text-slate-900 md:px-8">
      <SEO
        title="Missions & Ateliers Robotique Casablanca"
        description="Catalogue mobile-first des ateliers MakerLab: robotique, coding, IA, design 3D et missions 3h."
        keywords="robotique casablanca, camp robotique casablanca, stage vacances enfant casablanca, atelier drone maroc, coding for kids"
      />

      <section className="mx-auto max-w-7xl">
        <div className="relative min-h-[520px] overflow-hidden rounded-lg bg-slate-950 text-white">
          <img src={heroImage} alt="Catalogue des programmes MakerLab" className="ml-hero-media absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,18,32,.95),rgba(10,18,32,.78)_48%,rgba(10,18,32,.18))]" />
          <div className="relative z-10 flex min-h-[520px] flex-col justify-between p-5 md:p-9">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-white/80">
              <Sparkles size={15} className="text-[#ffc938]" />
              Catalogue des programmes
            </div>
            <button onClick={() => setShowFilters(value => !value)} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white md:hidden" aria-label="Afficher les filtres">
              <SlidersHorizontal size={19} />
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <h1 className="max-w-3xl font-display text-4xl font-black leading-[0.94] md:text-6xl">
                Trouvez la mission qui va tout déclencher.
              </h1>
              <p className="mt-6 max-w-xl text-lg font-semibold leading-8 text-white/70">
                Explorez par âge, intérêt et résultat. Chaque mission se termine par un projet réel.
              </p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/95 p-4 text-slate-900 shadow-2xl backdrop-blur-xl">
              <label className="flex items-center gap-3 rounded-xl bg-[#f3f5f7] px-4 py-3">
                <Search size={18} className="text-slate-400" />
                <input
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                  placeholder="Robotique, IA, Design 3D..."
                  className="ml-search-reset min-h-0 flex-1 border-0 bg-transparent p-0 text-sm font-bold outline-none"
                />
              </label>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-black">
                <div className="rounded-xl bg-slate-100 px-2 py-3">{catalogItems.length} options</div>
                <div className="rounded-xl bg-slate-100 px-2 py-3">Projets réels</div>
                <div className="rounded-xl bg-brand-orange px-2 py-3 text-white">Tous niveaux</div>
              </div>
            </div>
          </div>
          </div>
        </div>

        <section className={`${showFilters ? 'block' : 'hidden'} ml-card sticky top-24 z-30 mt-4 p-4 backdrop-blur-xl md:block`}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">Univers</p>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`ml-chip ${selectedCategory === category ? 'border-brand-blue bg-brand-blue text-white' : ''}`}
                  >
                    {category === 'All' ? 'Tous' : category}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">Âge</p>
              <div className="flex flex-wrap gap-2">
                {ages.map(age => (
                  <button
                    key={age}
                    onClick={() => setSelectedAge(age)}
                    className={`ml-chip ${selectedAge === age ? 'border-brand-orange bg-brand-orange text-white' : ''}`}
                  >
                    {age === 'All' ? 'Tous' : age}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {catalogItems.map((item: any, index) => {
            const title = getTitle(item);
            const description = getDescription(item);
            const image = getImage(item);
            const isMission = 'date' in item;
            const detailPath = isMission ? `/programs/kids-2?missionId=${item.id}` : `/programs/${item.id}`;
            const style = categoryStyle(item.category, index);
            const Icon = style.icon;

            return (
              <Reveal key={`${isMission ? 'mission' : 'program'}-${item.id}`} delay={(index % 3) * 80}>
              <Link to={detailPath} className="ml-card ml-card-interactive group block overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={image} alt={title} className="ml-image-zoom h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111]/70 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase text-[#111]">{item.category || 'Mission'}</span>
                  <span className="absolute bottom-4 left-4 rounded-full bg-brand-orange px-3 py-1 text-[10px] font-black text-white">{item.price || '400 DHS'}</span>
                  <div className={`ml-icon absolute right-4 top-4 ${style.color} text-white shadow-lg`}>
                    <Icon size={20} />
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-2xl font-black leading-tight">{title}</h2>
                  <p className="mt-2 line-clamp-2 min-h-[48px] text-sm font-semibold leading-6 text-slate-500">{description}</p>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] font-black">
                    <div className="rounded-lg bg-[#f3f5f7] px-2 py-3">{item.ageGroup || item.age || '8-17 ans'}</div>
                    <div className="rounded-lg bg-[#f3f5f7] px-2 py-3">{item.duration || '3h'}</div>
                    <div className={`rounded-lg bg-[#f3f5f7] px-2 py-3 ${style.text}`}>{isMission ? 'Session' : 'Programme'}</div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-500">
                      <CheckCircle2 size={15} className="text-brand-green" />
                      Projet réel
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-black text-[#111]">
                      Détails <ArrowRight size={15} />
                    </span>
                  </div>
                </div>
              </Link>
              </Reveal>
            );
          })}
        </section>

        {catalogItems.length === 0 && (
          <div className="ml-card mt-5 p-10 text-center">
            <Users className="mx-auto mb-4 text-slate-300" size={42} />
            <p className="text-xl font-black text-slate-500">Aucun programme disponible pour ces filtres.</p>
          </div>
        )}
      </section>
    </main>
  );
};
