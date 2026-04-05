import React from 'react';
import { Link } from 'react-router-dom';
import { usePrograms } from '../../contexts/ProgramContext';
import { Button } from '../../components/Button';
import { Plus, Edit2, Trash2, Power, Eye, Copy, Rocket, TrendingUp, Users, Calendar, Activity } from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend 
} from 'recharts';

import { initialPrograms } from '../../data/programs';
import { DatabaseBackup } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { programs, deleteProgram, updateProgram, addProgram } = usePrograms();

  const handleSeedData = async () => {
    if (window.confirm("Voulez-vous charger les programmes par défaut de MakerLab Academy ? Cela ajoutera les 7 programmes originaux.")) {
      for (const prog of initialPrograms) {
        // Create a copy without the id so addProgram generates a clean one
        const { id, ...progData } = prog;
        await addProgram(progData as any);
      }
      alert("Programmes chargés avec succès !");
    }
  };

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/programs/${id}`;
    navigator.clipboard.writeText(url);
    const btn = document.getElementById(`copy-btn-${id}`);
    if (btn) {
      btn.classList.add('bg-brand-orange');
      setTimeout(() => btn.classList.remove('bg-brand-orange'), 1000);
    }
  };

  // 📊 Analytics Data Preparation
  const categoryData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    programs.forEach(p => {
        counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [programs]);

  const performanceData = React.useMemo(() => {
    return programs.slice(0, 5).map(p => ({
        name: p.title.substring(0, 10) + '...',
        vistas: Math.floor(Math.random() * 500) + 100,
        registros: Math.floor(Math.random() * 50) + 5
    }));
  }, [programs]);

  const COLORS = ['#C0272D', '#2D5AA0', '#F39200', '#00A651', '#333333'];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display font-black text-4xl mb-2">Programmes</h1>
          <p className="text-gray-600 font-medium">Gérez vos différentes offres et ateliers.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" onClick={handleSeedData} className="shadow-neo-sm border-2 border-dashed bg-white flex items-center gap-2">
            <DatabaseBackup size={20} />
            Charger Démo
          </Button>
          <Link to="/admin/program/new">
            <Button variant="primary" className="shadow-neo"><Plus size={20} /> Nouveau Programme</Button>
          </Link>
        </div>
      </div>

      {/* 🚀 ANALYTICS DASHBOARD SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* KPI CARDS */}
        <div className="lg:col-span-1 space-y-4">
            <div className="bg-brand-blue text-white p-6 border-4 border-black shadow-neo-sm">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-black uppercase text-xs">Total Missions</span>
                    <Activity size={16} />
                </div>
                <p className="text-4xl font-black">{programs.length}</p>
                <p className="text-[10px] mt-2 font-bold opacity-80">+2 cette semaine</p>
            </div>
            <div className="bg-brand-green text-black p-6 border-4 border-black shadow-neo-sm">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-black uppercase text-xs">Actifs</span>
                    <TrendingUp size={16} />
                </div>
                <p className="text-4xl font-black">{programs.filter(p => p.active).length}</p>
                <div className="w-full bg-black/10 h-2 mt-4 border border-black/20">
                    <div className="bg-black h-full" style={{ width: `${(programs.filter(p => p.active).length / programs.length) * 100}%` }}></div>
                </div>
            </div>
            <div className="bg-brand-orange text-black p-6 border-4 border-black shadow-neo-sm">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-black uppercase text-xs">Aperçu Vues (Mock)</span>
                    <Eye size={16} />
                </div>
                <p className="text-4xl font-black">2.4k</p>
                <p className="text-[10px] mt-2 font-bold opacity-80">Mises à jour en direct</p>
            </div>
        </div>

        {/* PIE CHART: CATEGORIES */}
        <div className="bg-white p-6 border-4 border-black shadow-neo flex flex-col items-center">
            <h3 className="font-black uppercase text-sm mb-6 self-start">Mix des Catégories</h3>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={categoryData}
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={3} stroke="#000" />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
                {categoryData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1">
                        <div className="w-3 h-3 border-2 border-black" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-[10px] font-bold uppercase">{entry.name}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* BAR CHART: PERFORMANCE */}
        <div className="bg-white p-6 border-4 border-black shadow-neo">
            <h3 className="font-black uppercase text-sm mb-6">Top Performance (Engagement)</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} fontStyle="bold" />
                        <YAxis axisLine={false} tickLine={false} fontSize={10} fontStyle="bold" />
                        <Tooltip contentStyle={{ borderRadius: '0px', border: '3px solid black', fontFamily: 'Montserrat, sans-serif' }} />
                        <Bar dataKey="registros" fill="#C0272D" stroke="#000" strokeWidth={2} name="Inscriptions" />
                        <Bar dataKey="vistas" fill="#2D5AA0" stroke="#000" strokeWidth={2} name="Vues" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display font-black text-2xl uppercase">Liste des Missions</h2>
      </div>
      <div className="bg-white border-4 border-black rounded-3xl shadow-neo overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-brand-orange border-b-4 border-black">
              <tr>
                <th className="p-6 font-black uppercase text-sm border-r-4 border-black">Programme</th>
                <th className="p-6 font-black uppercase text-sm border-r-4 border-black">Format</th>
                <th className="p-6 font-black uppercase text-sm border-r-4 border-black">Status</th>
                <th className="p-6 font-black uppercase text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-black">
              {programs.map(program => (
                <tr key={program.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-6 border-r-4 border-black">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-xl border-4 border-black overflow-hidden shrink-0">
                        <img src={program.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="font-bold text-lg block">{program.title}</span>
                        <span className="text-sm font-bold text-gray-500 uppercase">{program.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 font-medium text-gray-600 border-r-4 border-black">
                    <span className="bg-white px-3 py-1 rounded-none border-2 border-black font-bold text-sm shadow-neo-sm">
                      {program.format || 'Workshop'}
                    </span>
                  </td>
                  <td className="p-6 border-r-4 border-black">
                    <button
                      onClick={() => updateProgram(program.id, { active: !program.active })}
                      className={`px-4 py-2 font-black uppercase tracking-widest border-4 flex items-center gap-2 w-fit transition-transform hover:-translate-y-1 hover:shadow-neo-sm ${program.active ? 'bg-green-400 border-black text-black' : 'bg-red-400 border-black text-black'}`}
                    >
                      <Power size={16} strokeWidth={3} />
                      {program.active ? 'ACTIF' : 'INACTIF'}
                    </button>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-3">
                      <Link to={`/programs/${program.id}`} target="_blank">
                        <button className="w-12 h-12 flex items-center justify-center bg-white border-4 border-black hover:bg-brand-blue hover:-translate-y-1 hover:shadow-neo-sm transition-all rounded-xl" title="Voir"><Eye size={20} className="text-black" /></button>
                      </Link>
                      <button 
                        id={`copy-btn-${program.id}`}
                        onClick={() => handleCopyLink(program.id)}
                        className="w-12 h-12 flex items-center justify-center bg-white border-4 border-black hover:bg-brand-orange hover:-translate-y-1 hover:shadow-neo-sm transition-all rounded-xl" 
                        title="Copier le lien"
                      >
                        <Copy size={20} className="text-black" />
                      </button>
                      <Link to={`/admin/landing/${program.id}`}>
                        <button className="w-12 h-12 flex items-center justify-center bg-orange-500 border-4 border-black hover:bg-orange-400 hover:-translate-y-1 hover:shadow-neo-sm transition-all rounded-xl" title="Landing Page">
                          <Rocket size={20} className="text-black" strokeWidth={3} />
                        </button>
                      </Link>
                      <Link to={`/admin/program/${program.id}`}>
                        <button className="w-12 h-12 flex items-center justify-center bg-white border-4 border-black hover:bg-brand-green hover:-translate-y-1 hover:shadow-neo-sm transition-all rounded-xl" title="Editer"><Edit2 size={20} className="text-black" /></button>
                      </Link>
                      <button
                        onClick={() => { if (window.confirm('Supprimer ce programme ?')) deleteProgram(program.id) }}
                        className="w-12 h-12 flex items-center justify-center bg-white border-4 border-black hover:bg-red-500 hover:-translate-y-1 hover:shadow-neo-sm transition-all rounded-xl hover:text-white group"
                        title="Supprimer"
                      >
                        <Trash2 size={20} className="text-black group-hover:text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
