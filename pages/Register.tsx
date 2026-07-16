import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { ArrowRight, CheckCircle2, Compass, MessageCircle, Sparkles, Target, Users } from 'lucide-react';
import { db } from '../firebase';
import { SEO } from '../components/SEO';
import { AppCard, AppContainer, AppShell, ColorDots, appAccentClasses } from '../components/AppStyle';
import { Reveal } from '../components/Motion';

const orientationImage = 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=85&w=1400';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    childName: '',
    childAge: '',
    interests: [] as string[],
    level: 'Débutant',
    notes: '',
  });

  const interestsOptions = [
    'Robotique',
    'Coding & IA',
    'Design 3D',
    'Game design',
    'Ingénierie',
    'Entrepreneuriat',
  ];
  const levels = ['Débutant', 'Intermédiaire', 'Avancé'];

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(item => item !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'website-orientation-leads'), {
        ...formData,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      });

      const params = new URLSearchParams({
        leadId: docRef.id,
        childName: formData.childName,
        programTitle: 'Orientation Maker',
        type: 'orientation',
      });
      navigate(`/thanks?${params.toString()}`);
    } catch (error) {
      console.error('Orientation error:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell className="pb-24 pt-5">
      <SEO
        title="Conseil & Orientation | MakerLab Academy"
        description="Aidez votre enfant à choisir le bon parcours technologique avec une orientation MakerLab."
        keywords="conseil orientation robotique, choisir atelier coding, makerlab academy conseil"
      />
      <AppContainer>
        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className="relative min-h-[560px] overflow-hidden rounded-lg bg-slate-950 p-5 text-white shadow-2xl md:p-8">
            <img src={orientationImage} alt="Jeune maker construisant un projet" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/78 to-slate-950/20" />
            <div className="relative z-10 flex h-full min-h-[500px] flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-[0.15em]">
                <Compass size={15} /> Orientation
              </span>
              <ColorDots />
            </div>
            <div className="py-12">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-orange">Conseil personnalisé</p>
              <h1 className="mt-3 max-w-xl font-display text-4xl font-black leading-[0.95] md:text-6xl">
                La bonne mission change tout.
              </h1>
              <p className="mt-6 max-w-xl text-lg font-semibold leading-8 text-white/72">
                Trois étapes rapides. Puis un mentor MakerLab recommande le meilleur premier parcours pour votre enfant.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {['Profil', 'Intérêts', 'Conseil'].map((label, index) => (
                <div key={label} className={`rounded-lg border p-4 transition-all duration-300 ${step >= index + 1 ? 'border-white bg-white text-slate-900 shadow-xl' : 'border-white/15 bg-white/10 text-white backdrop-blur'}`}>
                  <p className="text-2xl font-black">0{index + 1}</p>
                  <p className="text-xs font-bold opacity-70">{label}</p>
                </div>
              ))}
            </div>
            </div>
          </div>

          <AppCard className="p-5 md:p-8 lg:sticky lg:top-28">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-blue">Étape {step} sur 3</p>
                <h2 className="mt-2 text-3xl font-black">
                  {step === 1 ? 'Parlons du parent et de l’enfant.' : step === 2 ? 'Qu’est-ce qui passionne votre enfant ?' : 'Un dernier détail à nous partager ?'}
                </h2>
              </div>

              {step === 1 && (
                <div key="step-1" className="ml-step-panel grid gap-4 sm:grid-cols-2">
                  <Field label="Nom du parent" name="parentName" value={formData.parentName} onChange={handleInputChange} placeholder="Nom du parent" />
                  <Field label="Prénom de l’enfant" name="childName" value={formData.childName} onChange={handleInputChange} placeholder="Prénom de l’enfant" />
                  <Field label="WhatsApp" name="parentPhone" value={formData.parentPhone} onChange={handleInputChange} placeholder="06..." />
                  <Field label="Âge de l’enfant" name="childAge" value={formData.childAge} onChange={handleInputChange} placeholder="10" type="number" />
                  <div className="sm:col-span-2">
                    <Field label="Email" name="parentEmail" value={formData.parentEmail} onChange={handleInputChange} placeholder="parent@email.com" type="email" />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div key="step-2" className="ml-step-panel space-y-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {interestsOptions.map((interest, index) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`flex min-h-[64px] items-center justify-between rounded-xl border p-4 text-left text-sm font-black transition ${
                          formData.interests.includes(interest) ? `${appAccentClasses[index % appAccentClasses.length]} text-white` : 'bg-[#f7f7f4] text-slate-600'
                        }`}
                      >
                        {interest}
                        {formData.interests.includes(interest) && <CheckCircle2 size={17} />}
                      </button>
                    ))}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {levels.map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, level }))}
                        className={`rounded-2xl px-4 py-4 text-sm font-black ${formData.level === level ? 'bg-brand-blue text-white' : 'bg-[#f7f7f4] text-slate-500'}`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div key="step-3" className="ml-step-panel space-y-4">
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Questions, inquiétudes, disponibilités, passions..."
                    className="min-h-[160px] w-full rounded-2xl border border-slate-200 bg-[#f7f7f4] p-4 font-bold outline-none focus:border-brand-blue"
                  />
                  <div className="rounded-2xl bg-brand-green/10 p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="mt-1 text-brand-green" size={20} />
                      <p className="text-sm font-bold leading-6 text-slate-600">
                        Un mentor étudiera le profil et vous contactera avec une recommandation claire.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                {step > 1 && (
                  <button type="button" onClick={() => setStep(step - 1)} className="ml-button bg-[#f7f7f4] px-6">
                    Retour
                  </button>
                )}
                <button type="submit" disabled={loading} className="ml-button flex-1 bg-brand-blue px-6 text-white disabled:opacity-50">
                  {loading ? 'Envoi en cours...' : step === 3 ? 'Recevoir le conseil' : 'Étape suivante'} <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </AppCard>
        </section>

        <Reveal>
        <section className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            { title: 'Profil', text: 'L’âge et les coordonnées du parent.', icon: Users, color: 'bg-brand-orange' },
            { title: 'Centres d’intérêt', text: 'Les thèmes qui éveillent sa curiosité.', icon: Target, color: 'bg-brand-blue' },
            { title: 'Suivi WhatsApp', text: 'Une recommandation claire de notre équipe.', icon: MessageCircle, color: 'bg-brand-green' },
          ].map(item => (
            <AppCard key={item.title} className="p-5">
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${item.color} text-white`}>
                <item.icon size={21} />
              </div>
              <h3 className="text-xl font-black">{item.title}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{item.text}</p>
            </AppCard>
          ))}
        </section>
        </Reveal>
      </AppContainer>
    </AppShell>
  );
};

const Field: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
}> = ({ label, name, value, onChange, placeholder, type = 'text' }) => (
  <label className="block">
    <span className="mb-2 block text-xs font-black uppercase tracking-[0.15em] text-slate-400">{label}</span>
    <input
      required
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-slate-200 bg-[#f7f7f4] p-4 font-bold outline-none focus:border-brand-blue"
    />
  </label>
);
