import React, { useEffect, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Handshake,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { db } from '../firebase';
import { AppCard, AppContainer, AppShell } from '../components/AppStyle';
import { PremiumHero } from '../components/PremiumHero';
import { Reveal } from '../components/Motion';
import { FAQSection } from '../components/PageReady';

const contactHero = 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=85&w=1600';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

export const Contact: React.FC = () => {
  const { settings } = useSettings();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const contact = settings?.contact_info || {};

  useEffect(() => {
    const requestedSubject = searchParams.get('subject');
    const kit = searchParams.get('kit');
    if (!requestedSubject && !kit) return;

    setFormData(prev => ({
      ...prev,
      subject: requestedSubject === 'kit' ? 'Conseil sur un kit' : requestedSubject || prev.subject,
      message: kit ? `Je souhaite en savoir plus sur le kit « ${kit} ».` : prev.message,
    }));
  }, [searchParams]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');

    try {
      await addDoc(collection(db, 'website-contact-leads'), {
        ...formData,
        status: 'Pending',
        source: 'website-contact',
        createdAt: serverTimestamp(),
      });
      setFormData(initialForm);
      setStatus('success');
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('error');
    }
  };

  const routes = [
    {
      title: 'Parents',
      text: 'Choix du programme, réservations et questions pratiques.',
      icon: Phone,
      color: 'bg-brand-orange',
      value: contact.phone || '+212 6 00 00 00 00',
      href: `tel:${(contact.phone || '+212 6 00 00 00 00').replace(/\s/g, '')}`,
    },
    {
      title: 'Écoles',
      text: 'Ateliers scolaires et programmes sur mesure.',
      icon: Handshake,
      color: 'bg-brand-blue',
      value: contact.partners_email || 'partners@makerlab.ma',
      href: `mailto:${contact.partners_email || 'partners@makerlab.ma'}`,
    },
    {
      title: 'Mentors',
      text: 'Rejoindre l’équipe et transmettre votre savoir-faire.',
      icon: Briefcase,
      color: 'bg-brand-green',
      value: contact.jobs_email || 'jobs@makerlab.ma',
      href: `mailto:${contact.jobs_email || 'jobs@makerlab.ma'}`,
    },
    {
      title: 'Le laboratoire',
      text: 'Visiter MakerLab et découvrir nos espaces.',
      icon: MapPin,
      color: 'bg-brand-red',
      value: contact.address || 'Casablanca, Maroc',
      href: contact.maps_url || '#contact-form',
    },
  ];

  return (
    <AppShell className="pb-24 pt-5">
      <AppContainer>
        <PremiumHero
          eyebrow="Parlons de votre projet"
          title={<>Une question. Une idée. <span className="text-[#ff7b82]">Une prochaine étape.</span></>}
          description="Parents, écoles et partenaires : choisissez le bon canal et notre équipe vous répond avec une recommandation claire."
          image={contactHero}
          imageAlt="Équipe MakerLab accompagnant un projet"
          accent="red"
          stats={[
            ['<24h', 'délai de réponse'],
            ['3', 'équipes dédiées'],
            ['1:1', 'conseil personnalisé'],
            ['Casa', 'notre laboratoire'],
          ]}
        />

        <Reveal>
          <section className="mt-5">
            <AppCard className="p-5 md:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                {routes.map(item => (
                  <a
                    key={item.title}
                    href={item.href}
                    className="group rounded-lg border border-slate-200 bg-[#f7f8fa] p-5 transition duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                  >
                    <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${item.color} text-white`}>
                      <item.icon size={21} />
                    </div>
                    <h2 className="text-xl font-black">{item.title}</h2>
                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">{item.text}</p>
                    <p className="mt-3 break-words text-sm font-black">{item.value}</p>
                  </a>
                ))}
              </div>
            </AppCard>
          </section>
        </Reveal>

        <Reveal>
          <section id="contact-form" className="mt-5 grid scroll-mt-28 gap-5 lg:grid-cols-[0.82fr_1.18fr]">
            <AppCard className="bg-brand-green p-6 text-white md:p-8">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-white/65">Un échange utile</p>
              <h2 className="mt-3 font-display text-3xl font-black leading-[1.04] md:text-4xl">
                La bonne réponse, sans vous faire tourner en rond.
              </h2>
              <p className="mt-5 text-base font-semibold leading-8 text-white/78">
                Dites-nous où en est votre enfant ou votre projet. Nous vous orientons vers le format, l’âge et la prochaine date qui correspondent vraiment.
              </p>
              <div className="mt-6 grid gap-3">
                {['Conseil sur un programme', 'Projet pour une école', 'Candidature mentor'].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-lg bg-white/14 p-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white font-black text-brand-green">0{index + 1}</span>
                    <span className="font-black">{item}</span>
                  </div>
                ))}
              </div>
            </AppCard>

            <AppCard className="p-5 md:p-8">
              {status === 'success' ? (
                <div className="flex min-h-[480px] flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-green text-white">
                    <CheckCircle2 size={32} />
                  </div>
                  <h2 className="mt-5 text-3xl font-black">Message bien reçu.</h2>
                  <p className="mt-3 max-w-md font-semibold leading-7 text-slate-500">
                    Notre équipe revient vers vous avec une prochaine étape claire.
                  </p>
                  <button type="button" onClick={() => setStatus('idle')} className="ml-button mt-6 bg-[#f3f5f7] px-6">
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-orange">Écrivez-nous</p>
                    <h2 className="mt-2 text-3xl font-black">Comment pouvons-nous vous aider ?</h2>
                  </div>
                  <form className="grid gap-4" onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input required name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Prénom" className="rounded-xl border border-slate-200 bg-[#f7f7f4] p-4 font-bold outline-none focus:border-brand-blue" />
                      <input required name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Nom" className="rounded-xl border border-slate-200 bg-[#f7f7f4] p-4 font-bold outline-none focus:border-brand-blue" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email" className="rounded-xl border border-slate-200 bg-[#f7f7f4] p-4 font-bold outline-none focus:border-brand-blue" />
                      <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="Téléphone / WhatsApp" className="rounded-xl border border-slate-200 bg-[#f7f7f4] p-4 font-bold outline-none focus:border-brand-blue" />
                    </div>
                    <select required name="subject" value={formData.subject} onChange={handleChange} className="rounded-xl border border-slate-200 bg-[#f7f7f4] p-4 font-bold outline-none focus:border-brand-blue">
                      <option value="">Choisir un sujet</option>
                      <option>Conseil sur un programme</option>
                      <option>Partenariat avec une école</option>
                      <option>Conseil sur un kit</option>
                      <option>Rejoindre l’équipe</option>
                      <option>Autre demande</option>
                    </select>
                    <textarea required name="message" value={formData.message} onChange={handleChange} placeholder="Parlez-nous de votre besoin..." className="min-h-[150px] rounded-xl border border-slate-200 bg-[#f7f7f4] p-4 font-bold outline-none focus:border-brand-blue" />
                    {status === 'error' && (
                      <p className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">
                        <AlertCircle size={18} /> Le message n’a pas pu être envoyé. Réessayez ou contactez-nous par email.
                      </p>
                    )}
                    <button type="submit" disabled={status === 'loading'} className="ml-button bg-brand-orange px-6 text-white disabled:opacity-60">
                      {status === 'loading' ? 'Envoi en cours...' : 'Envoyer le message'} <Send size={18} />
                    </button>
                    <a href={`mailto:${contact.email || 'hello@makerlab.ma'}`} className="inline-flex items-center justify-center gap-2 text-sm font-black text-slate-500">
                      <Mail size={15} /> {contact.email || 'hello@makerlab.ma'}
                    </a>
                  </form>
                </>
              )}
            </AppCard>
          </section>
        </Reveal>

        <FAQSection
          items={[
            { question: 'À partir de quel âge peut-on commencer ?', answer: 'Nos parcours accueillent généralement les enfants de 7 à 17 ans. Nous vous conseillons selon l’âge, l’autonomie et les centres d’intérêt.' },
            { question: 'Peut-on visiter le laboratoire avant de réserver ?', answer: 'Oui. Contactez-nous pour convenir d’un créneau et découvrir les espaces, les outils et l’ambiance MakerLab.' },
            { question: 'Comment choisir le premier atelier ?', answer: 'Indiquez-nous l’âge et ce qui passionne votre enfant. Nous vous proposerons une première mission accessible, motivante et adaptée.' },
            { question: 'Travaillez-vous avec les écoles ?', answer: 'Oui. Nous proposons des visites, des ateliers dans les établissements et des programmes construits autour des objectifs pédagogiques de l’école.' },
          ]}
        />
      </AppContainer>
    </AppShell>
  );
};
