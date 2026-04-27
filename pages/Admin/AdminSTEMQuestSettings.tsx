import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  Settings, 
  Save, 
  Plus, 
  Trash2, 
  Clock, 
  Users, 
  CreditCard,
  CheckCircle2,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { Button } from '../../components/Button';

interface ScheduleSlot {
  day: string;
  time: string;
}

interface ProgramSettings {
  ageGroups: string[];
  schedules: Record<string, ScheduleSlot[]>;
  prices: {
    Explorer: { annuel: number; trimestriel: number };
    Innovator: { annuel: number; trimestriel: number };
  };
}

export const AdminSTEMQuestSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<ProgramSettings>({
    ageGroups: ['Tiny Makers (7-9 ans)', 'Mini Makers (10-12 ans)', 'Champions (13+ ans)'],
    schedules: {
      'Tiny Makers (7-9 ans)': [],
      'Mini Makers (10-12 ans)': [],
      'Champions (13+ ans)': []
    },
    prices: {
      Explorer: { annuel: 6000, trimestriel: 2300 },
      Innovator: { annuel: 7500, trimestriel: 2700 }
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'stemquest');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as ProgramSettings);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'stemquest'), settings);
      alert("Paramètres enregistrés avec succès !");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const addAgeGroup = () => {
    const name = prompt("Nom du nouveau groupe d'âge ? (ex: Juniors 5-6 ans)");
    if (name && !settings.ageGroups.includes(name)) {
      setSettings(prev => ({
        ...prev,
        ageGroups: [...prev.ageGroups, name],
        schedules: { ...prev.schedules, [name]: [] }
      }));
    }
  };

  const removeAgeGroup = (group: string) => {
    if (confirm(`Supprimer le groupe ${group} et tous ses horaires ?`)) {
      const { [group]: _, ...restSchedules } = settings.schedules;
      setSettings(prev => ({
        ...prev,
        ageGroups: prev.ageGroups.filter(g => g !== group),
        schedules: restSchedules
      }));
    }
  };

  const addSlot = (group: string) => {
    const day = prompt("Jour ? (ex: Samedi)");
    const time = prompt("Heure ? (ex: 10h00 - 11h30)");
    if (day && time) {
      setSettings(prev => ({
        ...prev,
        schedules: {
          ...prev.schedules,
          [group]: [...(prev.schedules[group] || []), { day, time }]
        }
      }));
    }
  };

  const removeSlot = (group: string, index: number) => {
    setSettings(prev => ({
      ...prev,
      schedules: {
        ...prev.schedules,
        [group]: prev.schedules[group].filter((_, i) => i !== index)
      }
    }));
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-[#2D1B8C]" size={48} /></div>;

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <div className="bg-[#2D1B8C] text-white p-8 md:p-12 rounded-[2.5rem] border-8 border-black shadow-neo relative overflow-hidden mb-12">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="font-display font-black text-4xl md:text-5xl uppercase italic tracking-tighter leading-none mb-4">
              STEMQuest <span className="text-yellow-400">Settings.</span>
            </h1>
            <p className="text-purple-100 font-bold text-lg">
              Configurez les âges, horaires et tarifs du programme.
            </p>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-4 bg-yellow-400 text-black rounded-2xl border-4 border-black font-black uppercase shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            Enregistrer
          </button>
        </div>
        <Settings size={180} className="absolute -right-10 -bottom-10 text-white/5 rotate-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Prices */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white border-4 border-black rounded-[2.5rem] p-8 shadow-neo-sm">
            <h3 className="font-black text-xl uppercase mb-8 flex items-center gap-2">
              <CreditCard className="text-brand-red" /> Tarification
            </h3>
            
            {['Explorer', 'Innovator'].map(pack => (
              <div key={pack} className="mb-8 last:mb-0 space-y-4">
                <p className="font-black uppercase text-sm tracking-widest text-gray-400">{pack}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Annuel</label>
                    <input 
                      type="number"
                      value={settings.prices[pack as 'Explorer' | 'Innovator'].annuel}
                      onChange={(e) => setSettings({
                        ...settings,
                        prices: {
                          ...settings.prices,
                          [pack]: { ...settings.prices[pack as 'Explorer' | 'Innovator'], annuel: Number(e.target.value) }
                        }
                      })}
                      className="w-full p-4 bg-gray-50 border-2 border-black rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Trimester</label>
                    <input 
                      type="number"
                      value={settings.prices[pack as 'Explorer' | 'Innovator'].trimestriel}
                      onChange={(e) => setSettings({
                        ...settings,
                        prices: {
                          ...settings.prices,
                          [pack]: { ...settings.prices[pack as 'Explorer' | 'Innovator'], trimestriel: Number(e.target.value) }
                        }
                      })}
                      className="w-full p-4 bg-gray-50 border-2 border-black rounded-xl font-bold"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-yellow-400 border-4 border-black rounded-[2.5rem] p-8 shadow-neo-sm">
             <h3 className="font-black text-xl uppercase mb-4 flex items-center gap-2">💡 Tips</h3>
             <p className="font-bold text-sm leading-relaxed">
               Ces tarifs seront automatiquement mis à jour sur la page d'inscription et dans le calcul du total.
             </p>
          </div>
        </div>

        {/* Right Col: Age Groups & Schedules */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border-4 border-black rounded-[2.5rem] p-8 shadow-neo-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-xl uppercase flex items-center gap-2">
                <Clock className="text-brand-orange" /> Groupes & Horaires
              </h3>
              <button 
                onClick={addAgeGroup}
                className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {settings.ageGroups.map(group => (
                <div key={group} className="border-4 border-black rounded-3xl overflow-hidden group">
                  <div className="bg-gray-50 p-4 border-b-4 border-black flex justify-between items-center">
                    <span className="font-black uppercase text-sm tracking-tight">{group}</span>
                    <button 
                      onClick={() => removeAgeGroup(group)}
                      className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="p-4 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {settings.schedules[group]?.map((slot, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border-2 border-black/5 group/slot">
                          <div className="font-bold text-xs uppercase">
                            <span className="text-[#2D1B8C]">{slot.day}</span> · <span className="text-gray-400">{slot.time}</span>
                          </div>
                          <button 
                            onClick={() => removeSlot(group, idx)}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => addSlot(group)}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-3 flex items-center justify-center gap-2 text-gray-400 hover:border-black hover:text-black transition-all"
                      >
                        <Plus size={14} /> <span className="text-[10px] font-black uppercase">Ajouter un créneau</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
