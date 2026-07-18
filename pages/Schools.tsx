import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ArrowRight, CheckCircle2, Cpu, Mail, Send, ShieldCheck, Users, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { usePrograms } from '../contexts/ProgramContext';
import { db } from '../firebase';
import { AppCard, AppContainer, AppSectionHeader, AppShell, appAccentClasses } from '../components/AppStyle';
import { PremiumHero } from '../components/PremiumHero';
import { Reveal } from '../components/Motion';
import { FAQSection } from '../components/PageReady';
import { SEO } from '../components/SEO';
import { getGeneratedProgramImage } from '../utils/makerlabImages';
import { defaultPageContent } from '../data/defaultPageContent';

const fallbackHero = '/images/makerlab/generated/schools-arduino-workshop-v1.webp';

const initialForm = {
  institution: '',
  contactName: '',
  email: '',
  phone: '',
  format: '',
  students: '',
  message: '',
};

export const Schools: React.FC = () => {
  const { settings } = useSettings();
  const content = { ...defaultPageContent.schools, ...(settings?.page_content?.schools || {}) };
  const { programs } = usePrograms();
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const schoolPrograms = programs.filter(program => program.active && program.format === 'School Program');
  const heroImage = fallbackHero;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');

    try {
      await addDoc(collection(db, 'website-school-leads'), {
        ...formData,
        status: 'Pending',
        source: 'website-schools',
        createdAt: serverTimestamp(),
      });
      setFormData(initialForm);
      setStatus('success');
    } catch (error) {
      console.error('School request error:', error);
      setStatus('error');
    }
  };

  return (
    <AppShell className="pb-24 pt-5">
      <SEO
        title="Ateliers STEM pour ecoles a Casablanca"
        description="Programmes STEM, robotique, coding et fabrication pour ecoles a Casablanca. MakerLab anime des ateliers pratiques au lab ou dans votre etablissement."
        keywords="atelier STEM ecole Casablanca, robotique scolaire Maroc, coding ecoles Casablanca, sortie scolaire technologie"
        image={heroImage}
      />
      <AppContainer>
        <PremiumHero
          eyebrow={content.eyebrow}
          title={<>{content.title} <span className="text-[#74b5ff]">{content.accent}</span></>}
          description={content.description}
          image={heroImage}
          imageAlt="Élèves participant à un atelier technologique"
          accent="blue"
          primary={{ label: 'Construire un programme', to: '/schools#school-request' }}
          secondary={{ label: 'Voir les programmes', to: '/programs' }}
          stats={[
            ['50+', 'écoles partenaires'],
            ['5000+', 'élèves engagés'],
            ['100%', 'pratique'],
            ['3', 'formats flexibles'],
          ]}
        />

        <section className="py-10">
          <AppSectionHeader
            eyebrow="Formats"
            title="Une expérience claire pour l’école, mémorable pour les élèves."
            text="Chaque format précise le projet, l’organisation et le résultat attendu avant même le premier échange."
            accent="text-brand-blue"
          />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: 'Journée découverte STEM', text: 'Une visite rythmée au laboratoire, avec plusieurs missions pratiques.', icon: Cpu, color: 'bg-brand-orange' },
              { title: 'Atelier dans votre école', text: 'Nos mentors apportent le matériel et animent le projet dans votre établissement.', icon: Wrench, color: 'bg-brand-green' },
              { title: 'Programme sur mesure', text: 'Un parcours sur plusieurs séances, aligné avec vos objectifs pédagogiques.', icon: Users, color: 'bg-brand-blue' },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 90}>
                <AppCard className="ml-card-interactive min-h-[270px] p-5">
                  <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${item.color} text-white`}>
                    <item.icon size={23} />
                  </div>
                  <h3 className="text-2xl font-black leading-tight">{item.title}</h3>
                  <p className="mt-3 min-h-[72px] font-semibold leading-6 text-slate-500">{item.text}</p>
                  <a href="#school-request" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#f7f7f4] px-4 py-3 text-sm font-black">
                    Parler de ce format <ArrowRight size={15} />
                  </a>
                </AppCard>
              </Reveal>
            ))}
          </div>
        </section>

        {schoolPrograms.length > 0 && (
          <section className="pb-10">
            <AppSectionHeader eyebrow="Catalogue" title="Les programmes disponibles pour les écoles." accent="text-brand-green" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {schoolPrograms.map((program, index) => (
                <Reveal key={program.id} delay={(index % 3) * 90}>
                  <Link to={`/programs/${program.id}`} className="ml-card ml-card-interactive group block overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={getGeneratedProgramImage(program, index)} alt={program.title} className="ml-image-zoom h-full w-full object-cover" />
                      <div className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl ${appAccentClasses[index % appAccentClasses.length]} text-white`}>
                        <ShieldCheck size={21} />
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-2xl font-black leading-tight">{program.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-slate-500">{program.shortDescription || program.description}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <Reveal>
          <section id="school-request" className="grid scroll-mt-28 gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <AppCard className="bg-brand-green p-6 text-white md:p-8">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-white/65">Notre méthode</p>
              <h2 className="mt-3 font-display text-3xl font-black leading-[1.04] md:text-4xl">Du premier échange à l’impact en classe.</h2>
              <div className="mt-6 grid gap-3">
                {[
                  'Comprendre vos objectifs et vos contraintes',
                  'Choisir le projet, le niveau et le format',
                  'Préparer, animer et partager les résultats',
                ].map((item, index) => (
                  <div key={item} className="flex items-center gap-4 rounded-lg bg-white/14 p-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-black text-brand-green">0{index + 1}</span>
                    <p className="font-black">{item}</p>
                  </div>
                ))}
              </div>
            </AppCard>

            <AppCard className="p-5 md:p-8">
              {status === 'success' ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-green text-white">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-3xl font-black">Demande bien reçue.</h3>
                  <p className="mx-auto mt-3 max-w-md font-semibold leading-7 text-slate-500">
                    Notre équipe vous contactera pour construire l’expérience MakerLab adaptée à vos élèves.
                  </p>
                  <button type="button" onClick={() => setStatus('idle')} className="ml-button mt-6 bg-[#f7f7f4] px-5">
                    Envoyer une autre demande
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-orange">Demande école</p>
                    <h2 className="mt-2 text-3xl font-black">Parlez-nous de votre établissement.</h2>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input required name="institution" value={formData.institution} onChange={handleChange} placeholder="École / institution" className="w-full rounded-xl border border-slate-200 bg-[#f7f7f4] p-4 font-bold outline-none focus:border-brand-blue" />
                    <input required name="contactName" value={formData.contactName} onChange={handleChange} placeholder="Nom du contact" className="w-full rounded-xl border border-slate-200 bg-[#f7f7f4] p-4 font-bold outline-none focus:border-brand-blue" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email professionnel" className="w-full rounded-xl border border-slate-200 bg-[#f7f7f4] p-4 font-bold outline-none focus:border-brand-blue" />
                    <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="Téléphone" className="w-full rounded-xl border border-slate-200 bg-[#f7f7f4] p-4 font-bold outline-none focus:border-brand-blue" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <select required name="format" value={formData.format} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-[#f7f7f4] p-4 font-bold outline-none focus:border-brand-blue">
                      <option value="">Choisir un format</option>
                      <option>Visite au laboratoire</option>
                      <option>Atelier dans l’école</option>
                      <option>Programme sur mesure</option>
                    </select>
                    <input name="students" value={formData.students} onChange={handleChange} type="number" min="1" placeholder="Nombre d’élèves" className="w-full rounded-xl border border-slate-200 bg-[#f7f7f4] p-4 font-bold outline-none focus:border-brand-blue" />
                  </div>
                  <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Que souhaitez-vous faire vivre à vos élèves ?" className="min-h-[120px] w-full rounded-xl border border-slate-200 bg-[#f7f7f4] p-4 font-bold outline-none focus:border-brand-blue" />
                  {status === 'error' && <p className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">La demande n’a pas pu être envoyée. Réessayez ou contactez-nous par email.</p>}
                  <button type="submit" disabled={status === 'loading'} className="ml-button flex w-full bg-brand-orange px-6 text-white disabled:opacity-60">
                    {status === 'loading' ? 'Envoi en cours...' : 'Envoyer la demande'} <Send size={18} />
                  </button>
                  <a href={`mailto:${settings?.contact_info?.partners_email || 'partners@makerlab.ma'}`} className="flex items-center justify-center gap-2 text-sm font-black text-slate-500">
                    <Mail size={15} /> {settings?.contact_info?.partners_email || 'partners@makerlab.ma'}
                  </a>
                </form>
              )}
            </AppCard>
          </section>
        </Reveal>

        <FAQSection
          items={[
            { question: 'Pouvez-vous intervenir directement dans notre école ?', answer: 'Oui. Nos mentors se déplacent avec le matériel nécessaire et adaptent l’installation à vos espaces.' },
            { question: 'Combien d’élèves peuvent participer ?', answer: 'Cela dépend du format et du projet. Nous organisons les groupes pour conserver une expérience pratique et un accompagnement réel.' },
            { question: 'Les enseignants participent-ils à l’atelier ?', answer: 'Ils peuvent observer, coanimer ou recevoir des ressources de suivi selon le programme choisi.' },
            { question: 'Pouvez-vous construire un parcours sur plusieurs mois ?', answer: 'Oui. Nous pouvons définir une progression, des projets et des livrables en lien avec vos objectifs pédagogiques.' },
          ]}
        />
      </AppContainer>
    </AppShell>
  );
};
