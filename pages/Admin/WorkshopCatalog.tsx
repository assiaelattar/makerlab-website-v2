import React from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../contexts/SchoolContext';
import { Button } from '../../components/Button';
import { Plus, Edit2, Trash2, Power, BookOpen } from 'lucide-react';

export const WorkshopCatalog: React.FC = () => {
  const { workshops, deleteWorkshop, updateWorkshop } = useSchool();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display font-black text-4xl mb-2 text-brand-blue">Catalogue Ateliers</h1>
          <p className="text-gray-600 font-medium">Gérez le catalogue global des ateliers disponibles pour les écoles.</p>
        </div>
        <div>
          <Link to="/admin/workshop/new">
            <Button variant="primary" className="shadow-neo"><Plus size={20} /> Nouvel Atelier</Button>
          </Link>
        </div>
      </div>

      <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-brand-blue border-b-4 border-black">
              <tr>
                <th className="p-6 font-black uppercase text-sm border-r-4 border-black text-white">Atelier</th>
                <th className="p-6 font-black uppercase text-sm border-r-4 border-black text-white">Âge / Durée</th>
                <th className="p-6 font-black uppercase text-sm border-r-4 border-black text-white">Statut</th>
                <th className="p-6 font-black uppercase text-sm text-right text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-black">
              {workshops.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-500 font-bold">
                    Aucun atelier dans le catalogue. Cliquez sur "Nouvel Atelier" pour commencer.
                  </td>
                </tr>
              ) : (
                workshops.map(workshop => (
                  <tr key={workshop.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-6 border-r-4 border-black">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-xl border-4 border-black overflow-hidden shrink-0">
                          <img src={workshop.image || 'https://placehold.co/600x400?text=Workshop'} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="font-bold text-lg block">{workshop.name}</span>
                          <div className="flex gap-1 mt-1">
                            {workshop.tags?.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[10px] bg-brand-orange/20 text-brand-orange px-2 py-0.5 rounded-full font-black border border-brand-orange/30 uppercase">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 font-medium text-gray-600 border-r-4 border-black">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-black">{workshop.ageRange}</span>
                        <span className="text-sm">{workshop.duration}</span>
                      </div>
                    </td>
                    <td className="p-6 border-r-4 border-black">
                      <button
                        onClick={() => updateWorkshop(workshop.id, { active: !workshop.active })}
                        className={`px-4 py-2 font-black uppercase tracking-widest border-4 flex items-center gap-2 w-fit transition-transform hover:-translate-y-1 hover:shadow-neo-sm ${workshop.active ? 'bg-green-400 border-black text-black' : 'bg-red-400 border-black text-black'}`}
                      >
                        <Power size={16} strokeWidth={3} />
                        {workshop.active ? 'ACTIF' : 'INACTIF'}
                      </button>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-3">
                        <Link to={`/admin/workshop/${workshop.id}`}>
                          <button className="w-12 h-12 flex items-center justify-center bg-white border-4 border-black hover:bg-brand-green hover:-translate-y-1 hover:shadow-neo-sm transition-all rounded-xl" title="Editer"><Edit2 size={20} className="text-black" /></button>
                        </Link>
                        <button
                          onClick={() => { if (window.confirm('Supprimer cet atelier du catalogue ?')) deleteWorkshop(workshop.id) }}
                          className="w-12 h-12 flex items-center justify-center bg-white border-4 border-black hover:bg-red-500 hover:-translate-y-1 hover:shadow-neo-sm transition-all rounded-xl hover:text-white group"
                          title="Supprimer"
                        >
                          <Trash2 size={20} className="text-black group-hover:text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
