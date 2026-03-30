import React from 'react';
import { Link } from 'react-router-dom';
import { usePrograms } from '../../contexts/ProgramContext';
import { Button } from '../../components/Button';
import { Plus, Edit2, Trash2, Power, Eye, Copy } from 'lucide-react';

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
    // Simple feedback
    const btn = document.getElementById(`copy-btn-${id}`);
    if (btn) {
      btn.classList.add('bg-brand-orange');
      setTimeout(() => btn.classList.remove('bg-brand-orange'), 1000);
    }
  };

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

      <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
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
