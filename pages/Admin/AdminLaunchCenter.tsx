import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePrograms } from '../../contexts/ProgramContext';
import { useSettings } from '../../contexts/SettingsContext';
import { 
  Rocket, Copy, ExternalLink, CheckCircle2, 
  Target, ChevronRight, Sparkles, ShieldCheck, 
  AlertTriangle, Phone, Image as ImageIcon,
  Zap, ArrowRight, MousePointer2, RefreshCw
} from 'lucide-react';

export const AdminLaunchCenter: React.FC = () => {
  const { funnels, programs } = usePrograms();
  const { settings } = useSettings();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Integration Status
  const hasWAInternal = !!settings.WA_INTERNAL_NUMBER || !!settings.waInternalNumber;
  const hasTextMeBot = !!settings.TEXTMEBOT_API_KEY || !!settings.textMeBotApiKey;
  const hasPixel = !!settings.googleAnalyticsId || !!settings.googleTagManagerId;

  const handleCopy = (slug: string) => {
    const url = `${window.location.origin}/lp/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(slug);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeFunnels = funnels.filter(f => f.active);

  return (
    <div className="max-w-6xl mx-auto pb-24 space-y-8">
      {/* Header */}
      <div className="bg-black text-white p-8 md:p-12 rounded-[2.5rem] border-8 border-black shadow-[12px_12px_0_0_#f97316] relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
             <span className="bg-orange-500 text-black px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest animate-pulse">Live Dashboard</span>
          </div>
          <h1 className="font-display font-black text-5xl md:text-7xl uppercase italic tracking-tighter leading-none mb-4">Launch Control.</h1>
          <p className="text-gray-400 font-bold text-lg max-w-xl">Tout ce dont vous avez besoin pour propulser vos campagnes Marketing MakerLab.</p>
        </div>
        <Rocket size={200} className="absolute -right-10 -bottom-10 text-white/5 rotate-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Checklist & Health */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Health Status */}
          <div className="bg-white border-4 border-black rounded-[2rem] p-6 shadow-neo-sm">
             <h3 className="font-black text-xl uppercase italic mb-6 flex items-center gap-2">
               <ShieldCheck className="text-green-500" /> État des Flux
             </h3>
             <div className="space-y-4">
                <StatusItem label="Notifications WhatsApp" active={hasWAInternal || hasTextMeBot} />
                <StatusItem label="Tracking Analytics / Pixel" active={hasPixel} />
                <StatusItem label="Base de Connaissances (AI)" active={true} />
             </div>
             <Link to="/admin/settings" className="mt-8 w-full py-3 border-2 border-black rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                Configurer les clés <ChevronRight size={14} />
             </Link>
          </div>

          {/* Checklist */}
          <div className="bg-[#FBFF3A] border-4 border-black rounded-[2rem] p-6 shadow-neo-sm">
             <h3 className="font-black text-xl uppercase italic mb-6 flex items-center gap-2">
               <Zap className="text-black" /> Launch Checklist
             </h3>
             <div className="space-y-3">
                <CheckItem label="Photos de couverture configurées" />
                <CheckItem label="Galerie social proof remplie" />
                <CheckItem label="Dates des missions à jour" />
                <CheckItem label="Test du Quiz (Submission)" />
                <CheckItem label="Vérification mobile (LP)" />
             </div>
          </div>
        </div>

        {/* Right Col: Links Table */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border-4 border-black rounded-[2rem] overflow-hidden shadow-neo">
             <div className="p-6 border-b-4 border-black bg-indigo-50 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-2xl uppercase italic leading-none">Répertoire des Liens</h3>
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Vos Landing Pages Actives</p>
                </div>
                <div className="flex items-center gap-2">
                   <span className="px-3 py-1 bg-black text-white text-[10px] font-black rounded-lg">{activeFunnels.length} Funnels</span>
                </div>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody className="divide-y-2 divide-gray-100">
                    {activeFunnels.length > 0 ? activeFunnels.map(funnel => {
                      const program = programs.find(p => p.id === funnel.programId);
                      return (
                        <tr key={funnel.id} className="group hover:bg-gray-50 transition-all">
                          <td className="p-6">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 border-2 border-black rounded-xl overflow-hidden shrink-0">
                                   {program?.image && <img src={program.image} className="w-full h-full object-cover" alt="" />}
                                </div>
                                <div>
                                   <p className="font-black text-sm uppercase leading-none mb-1">{funnel.name}</p>
                                   <p className="font-mono text-[10px] text-indigo-500 font-bold">/lp/{funnel.slug}</p>
                                </div>
                             </div>
                          </td>
                          <td className="p-6 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => handleCopy(funnel.slug)}
                                  className={`px-4 py-2 border-2 border-black rounded-xl font-black text-[10px] uppercase transition-all flex items-center gap-2 shadow-neo-sm active:shadow-none translate-y-[-2px] active:translate-y-0 ${copiedId === funnel.slug ? 'bg-green-500 text-white' : 'bg-white hover:bg-indigo-50'}`}
                                >
                                   {copiedId === funnel.slug ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                   {copiedId === funnel.slug ? 'Copié !' : 'Lien'}
                                </button>
                                <Link 
                                  to={`/lp/${funnel.slug}`} 
                                  target="_blank" 
                                  className="p-2 border-2 border-black rounded-xl hover:bg-black hover:text-white transition-all shadow-neo-sm active:shadow-none translate-y-[-2px] active:translate-y-0"
                                >
                                   <ExternalLink size={16} />
                                </Link>
                             </div>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={2} className="p-12 text-center text-gray-400 italic font-bold">
                           Aucun funnel actif trouvé. Allez dans "Landing Pages" pour en activer un.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
             </div>
          </div>

          {/* Quick Setup shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <QuickLink 
                to="/admin/missions" 
                icon={<Target />} 
                title="Missions & Dates" 
                desc="Vérifiez les sessions du week-end" 
                color="orange"
             />
             <QuickLink 
                to="/admin/media" 
                icon={<ImageIcon />} 
                title="Galerie Photos" 
                desc="Gérez vos assets social proof" 
                color="indigo"
             />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusItem: React.FC<{ label: string; active: boolean }> = ({ label, active }) => (
  <div className="flex items-center justify-between p-3 border-2 border-black/5 rounded-xl">
     <span className="font-bold text-sm text-gray-600">{label}</span>
     {active ? (
       <span className="w-6 h-6 bg-green-100 text-green-600 rounded-lg flex items-center justify-center border border-green-200"><CheckCircle2 size={14} strokeWidth={3} /></span>
     ) : (
       <span className="w-6 h-6 bg-red-100 text-red-600 rounded-lg flex items-center justify-center border border-red-200"><AlertTriangle size={14} strokeWidth={3} /></span>
     )}
  </div>
);

const CheckItem: React.FC<{ label: string }> = ({ label }) => {
  const [checked, setChecked] = useState(false);
  return (
    <button 
      onClick={() => setChecked(!checked)}
      className="w-full flex items-center gap-3 p-3 bg-white/50 border-2 border-transparent hover:border-black rounded-xl transition-all group"
    >
       <div className={`w-6 h-6 rounded-lg border-2 border-black flex items-center justify-center transition-all ${checked ? 'bg-black text-white' : 'bg-white'}`}>
          {checked && <CheckCircle2 size={14} strokeWidth={4} />}
       </div>
       <span className={`font-black text-xs uppercase text-left leading-tight ${checked ? 'line-through opacity-40' : 'text-black'}`}>{label}</span>
    </button>
  );
};

const QuickLink: React.FC<{ to: string; icon: any; title: string; desc: string; color: string }> = ({ to, icon, title, desc, color }) => {
  const colors: Record<string, string> = {
    orange: 'hover:bg-orange-50 hover:border-orange-500',
    indigo: 'hover:bg-indigo-50 hover:border-indigo-500'
  };
  return (
    <Link to={to} className={`p-6 border-4 border-black rounded-[2rem] bg-white shadow-neo-sm transition-all ${colors[color] || ''} group`}>
       <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gray-100 border-2 border-black rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
          <ArrowRight className="text-gray-300 group-hover:text-black transition-colors" />
       </div>
       <h4 className="font-black text-lg uppercase italic">{title}</h4>
       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{desc}</p>
    </Link>
  );
}
