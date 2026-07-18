import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { defaultPageContent, PageContent } from '../../data/defaultPageContent';

const sections: Array<{ key: keyof Pick<PageContent, 'home' | 'about' | 'schools' | 'contact'>; label: string }> = [
  { key: 'home', label: 'Accueil' },
  { key: 'about', label: 'À propos' },
  { key: 'schools', label: 'Écoles' },
  { key: 'contact', label: 'Contact' },
];

export const AdminPageContent: React.FC = () => {
  const { settings, updateSetting, isLoading } = useSettings();
  const [content, setContent] = useState<PageContent>(defaultPageContent);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isLoading || !settings.page_content) return;
    const saved = settings.page_content;
    setContent({
      ...defaultPageContent,
      ...saved,
      home: { ...defaultPageContent.home, ...saved.home },
      about: { ...defaultPageContent.about, ...saved.about },
      schools: { ...defaultPageContent.schools, ...saved.schools },
      contact: { ...defaultPageContent.contact, ...saved.contact },
      navigation: { ...defaultPageContent.navigation, ...saved.navigation },
      footer: { ...defaultPageContent.footer, ...saved.footer },
    });
  }, [isLoading, settings.page_content]);

  const updateSection = (section: keyof PageContent, field: string, value: string) => {
    setContent(previous => ({ ...previous, [section]: { ...previous[section], [field]: value } }));
  };

  const save = async () => {
    setSaving(true);
    await updateSetting('page_content', content);
    setSaving(false);
    alert('Textes publics enregistrés.');
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-orange">Personnalisation</p>
          <h1 className="mt-2 font-display text-4xl font-black">Textes du site</h1>
          <p className="mt-2 font-semibold text-gray-500">Titres principaux et messages partagés visibles par les familles et les écoles.</p>
        </div>
        <button onClick={save} disabled={saving} className="inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-black bg-brand-orange px-5 font-black text-white shadow-neo-sm disabled:opacity-50">
          <Save size={17} /> {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {sections.map(section => {
          const data = content[section.key];
          return (
            <section key={section.key} className="rounded-2xl border-2 border-black bg-white p-6 shadow-neo-sm">
              <h2 className="font-display text-2xl font-black">{section.label}</h2>
              <div className="mt-5 grid gap-4">
                {(['eyebrow', 'title', 'accent'] as const).map(field => (
                  <label key={field} className="text-sm font-black capitalize">{field === 'eyebrow' ? 'Sur-titre' : field === 'accent' ? 'Partie colorée' : 'Titre'}
                    <input value={data[field]} onChange={event => updateSection(section.key, field, event.target.value)} className="mt-2 w-full rounded-lg border-2 border-black p-3 font-semibold" />
                  </label>
                ))}
                <label className="text-sm font-black">Description
                  <textarea value={data.description} onChange={event => updateSection(section.key, 'description', event.target.value)} className="mt-2 h-24 w-full rounded-lg border-2 border-black p-3 font-semibold" />
                </label>
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border-2 border-black bg-white p-6 shadow-neo-sm">
          <h2 className="font-display text-2xl font-black">Navigation</h2>
          <label className="mt-5 block text-sm font-black">Bouton essai
            <input value={content.navigation.trialLabel} onChange={event => updateSection('navigation', 'trialLabel', event.target.value)} className="mt-2 w-full rounded-lg border-2 border-black p-3" />
          </label>
          <label className="mt-4 block text-sm font-black">Bouton orientation
            <input value={content.navigation.finderLabel} onChange={event => updateSection('navigation', 'finderLabel', event.target.value)} className="mt-2 w-full rounded-lg border-2 border-black p-3" />
          </label>
        </section>
        <section className="rounded-2xl border-2 border-black bg-white p-6 shadow-neo-sm">
          <h2 className="font-display text-2xl font-black">Pied de page</h2>
          <label className="mt-5 block text-sm font-black">Présentation
            <textarea value={content.footer.description} onChange={event => updateSection('footer', 'description', event.target.value)} className="mt-2 h-24 w-full rounded-lg border-2 border-black p-3" />
          </label>
          <label className="mt-4 block text-sm font-black">Bouton
            <input value={content.footer.ctaLabel} onChange={event => updateSection('footer', 'ctaLabel', event.target.value)} className="mt-2 w-full rounded-lg border-2 border-black p-3" />
          </label>
        </section>
      </div>
    </div>
  );
};
