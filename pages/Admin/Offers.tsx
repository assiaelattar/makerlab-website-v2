import React from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../contexts/SchoolContext';
import { Button } from '../../components/Button';
import { Plus, Edit2, Ticket, Calendar, Power, Eye, Copy, Check } from 'lucide-react';

export const Offers: React.FC = () => {
  const { offers, schoolPartners, periods, updateOffer } = useSchool();

  const getSchoolName = (id: string) => schoolPartners.find(s => s.id === id)?.name || 'Inconnu';
  const getPeriodName = (id: string) => periods.find(p => p.id === id)?.name || 'Inconnu';

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display font-black text-4xl mb-2 text-brand-blue">Offres Scolaires</h1>
          <p className="text-gray-600 font-medium">Créez et gérez les propositions d'ateliers personnalisées par école et période.</p>
        </div>
        <div>
          <Link to="/admin/offer/new">
            <Button variant="primary" className="shadow-neo bg-brand-blue border-black text-white"><Plus size={20} /> Nouvelle Offre</Button>
          </Link>
        </div>
      </div>

      <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-brand-blue border-b-4 border-black">
              <tr>
                <th className="p-6 font-black uppercase text-sm border-r-4 border-black text-white">École / Partenaire</th>
                <th className="p-6 font-black uppercase text-sm border-r-4 border-black text-white">Période</th>
                <th className="p-6 font-black uppercase text-sm border-r-4 border-black text-white">Ateliers</th>
                <th className="p-6 font-black uppercase text-sm border-r-4 border-black text-white">Statut</th>
                <th className="p-6 font-black uppercase text-sm text-right text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-black">
              {offers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500 font-bold">
                    Aucune offre créée. Cliquez sur "Nouvelle Offre" pour commencer.
                  </td>
                </tr>
              ) : (
                offers.map(offer => (
                  <tr key={offer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-6 border-r-4 border-black">
                      <span className="font-bold text-lg block">{getSchoolName(offer.schoolId)}</span>
                    </td>
                    <td className="p-6 border-r-4 border-black">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-brand-orange" />
                        <span className="font-bold text-black">{getPeriodName(offer.periodId)}</span>
                      </div>
                    </td>
                    <td className="p-6 border-r-4 border-black">
                      <span className="bg-gray-100 px-3 py-1 rounded-full border-2 border-black font-black text-xs uppercase shadow-neo-sm">
                        {offer.workshopIds?.length || 0} Ateliers
                      </span>
                    </td>
                    <td className="p-6 border-r-4 border-black">
                      <button
                        onClick={() => updateOffer(offer.id, { published: !offer.published })}
                        className={`px-4 py-2 font-black uppercase tracking-widest border-4 flex items-center gap-2 w-fit transition-transform hover:-translate-y-1 hover:shadow-neo-sm ${offer.published ? 'bg-green-400 border-black text-black' : 'bg-red-400 border-black text-black'}`}
                      >
                        <Power size={16} strokeWidth={3} />
                        {offer.published ? 'PUBLIÉE' : 'BROUILLON'}
                      </button>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-3">
                        {offer.published && (
                          <>
                            <button 
                              onClick={() => {
                                const slug = schoolPartners.find(s => s.id === offer.schoolId)?.slug;
                                const url = `${window.location.origin}/s/${slug}`;
                                navigator.clipboard.writeText(url);
                                alert("Lien copié !");
                              }}
                              className="w-12 h-12 flex items-center justify-center bg-white border-4 border-black hover:bg-brand-orange hover:-translate-y-1 hover:shadow-neo-sm transition-all rounded-xl" 
                              title="Copier le lien"
                            >
                              <Copy size={20} className="text-black" />
                            </button>
                            <Link to={`/s/${schoolPartners.find(s => s.id === offer.schoolId)?.slug}`} target="_blank">
                              <button className="w-12 h-12 flex items-center justify-center bg-white border-4 border-black hover:bg-brand-blue hover:-translate-y-1 hover:shadow-neo-sm transition-all rounded-xl" title="Voir la page"><Eye size={20} className="text-black" /></button>
                            </Link>
                          </>
                        )}
                        <Link to={`/admin/offer/${offer.id}`}>
                          <button className="w-12 h-12 flex items-center justify-center bg-white border-4 border-black hover:bg-brand-green hover:-translate-y-1 hover:shadow-neo-sm transition-all rounded-xl" title="Editer"><Edit2 size={20} className="text-black" /></button>
                        </Link>
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
