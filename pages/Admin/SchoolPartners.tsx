import React from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../contexts/SchoolContext';
import { Button } from '../../components/Button';
import { Plus, Edit2, Trash2, School, Globe } from 'lucide-react';

export const SchoolPartners: React.FC = () => {
  const { schoolPartners } = useSchool();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display font-black text-4xl mb-2 text-brand-orange">Partenaires Scolaires</h1>
          <p className="text-gray-600 font-medium">Gérez les établissements scolaires partenaires et leurs identités visuelles.</p>
        </div>
        <div className="flex gap-4">
          <Link to="/admin/partner/new">
            <Button variant="primary" className="shadow-neo bg-brand-orange border-black"><Plus size={20} /> Nouveau Partenaire</Button>
          </Link>
        </div>
      </div>

      <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-brand-orange border-b-4 border-black">
            <tr>
              <th className="p-6 font-black uppercase text-sm border-r-4 border-black">École</th>
              <th className="p-6 font-black uppercase text-sm border-r-4 border-black">Slug / URL</th>
              <th className="p-6 font-black uppercase text-sm border-r-4 border-black">Contact</th>
              <th className="p-6 font-black uppercase text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-4 divide-black">
            {schoolPartners.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-12 text-center text-gray-500 font-bold">
                  Aucun partenaire enregistré. Cliquez sur "Nouveau Partenaire" pour commencer.
                </td>
              </tr>
            ) : (
              schoolPartners.map(partner => (
                <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-6 border-r-4 border-black">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white rounded-xl border-4 border-black p-2 overflow-hidden shrink-0 flex items-center justify-center">
                        <img src={partner.logo || 'https://placehold.co/200x200?text=Logo'} alt="" className="max-w-full max-h-full object-contain" />
                      </div>
                      <span className="font-bold text-lg block">{partner.name}</span>
                    </div>
                  </td>
                  <td className="p-6 font-medium text-gray-600 border-r-4 border-black">
                    <div className="flex items-center gap-2">
                      <Globe size={16} className="text-brand-blue" />
                      <span className="font-bold text-black">{partner.slug}.makerlab.academy</span>
                    </div>
                  </td>
                  <td className="p-6 border-r-4 border-black">
                    <div className="text-sm font-bold">
                      {partner.contactInfo?.email && <p className="mb-1">{partner.contactInfo.email}</p>}
                      {partner.contactInfo?.phone && <p className="text-gray-500">{partner.contactInfo.phone}</p>}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-3">
                      <Link to={`/admin/partner/${partner.id}`}>
                        <button className="w-12 h-12 flex items-center justify-center bg-white border-4 border-black hover:bg-brand-blue hover:-translate-y-1 hover:shadow-neo-sm transition-all rounded-xl" title="Editer"><Edit2 size={20} className="text-black" /></button>
                      </Link>
                      <button
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
  );
};
