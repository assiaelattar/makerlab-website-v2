import React from 'react';
import { Link } from 'react-router-dom';
import { usePrograms } from '../../contexts/ProgramContext';
import { Rocket, Eye, Edit2, Copy, CheckCircle2, XCircle } from 'lucide-react';

export const AdminLandingPages: React.FC = () => {
  const { programs } = usePrograms();

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/lp/${id}`;
    navigator.clipboard.writeText(url);
    const btn = document.getElementById(`copy-lp-${id}`);
    if (btn) {
      btn.textContent = '✓ Copié !';
      setTimeout(() => { if (btn) btn.textContent = 'Copier'; }, 1500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-orange-500 border-4 border-black rounded-xl flex items-center justify-center shadow-[4px_4px_0_0_black]">
            <Rocket size={24} strokeWidth={3} className="text-black" />
          </div>
          <div>
            <h1 className="font-display font-black text-4xl">Landing Pages</h1>
            <p className="text-gray-500 font-medium text-sm">Funnels marketing haute-conversion par programme</p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-orange-50 border-2 border-orange-200 rounded-xl text-sm font-medium text-orange-800">
          💡 Chaque programme peut avoir sa propre landing page publique à l'adresse{' '}
          <code className="font-mono bg-orange-100 px-1 rounded">makerlab.ma/lp/[id]</code>.{' '}
          Activez-la dans l'éditeur et partagez le lien pour vos campagnes.
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-5 font-black uppercase text-xs border-r-4 border-gray-700">Programme</th>
                <th className="p-5 font-black uppercase text-xs border-r-4 border-gray-700 text-center">Statut</th>
                <th className="p-5 font-black uppercase text-xs border-r-4 border-gray-700">URL Publique</th>
                <th className="p-5 font-black uppercase text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-black">
              {programs.map(program => {
                const lpEnabled = program.landingPage?.enabled === true;
                const publicUrl = `/lp/${program.id}`;
                return (
                  <tr key={program.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-5 border-r-4 border-black">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl border-2 border-black overflow-hidden shrink-0 bg-gray-100">
                          {program.image ? (
                            <img src={program.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <Rocket size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-black text-base block leading-tight">{program.title}</span>
                          <span className="text-xs font-bold text-gray-400 uppercase">{program.format || 'Workshop'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 border-r-4 border-black text-center">
                      {lpEnabled ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 border-2 border-green-400 rounded-full text-xs font-black uppercase">
                          <CheckCircle2 size={12} strokeWidth={3} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-400 border-2 border-gray-300 rounded-full text-xs font-black uppercase">
                          <XCircle size={12} strokeWidth={3} /> Désactivée
                        </span>
                      )}
                    </td>
                    <td className="p-5 border-r-4 border-black">
                      <div className="flex items-center gap-2">
                        <code className={`text-xs font-mono px-2 py-1 rounded border ${lpEnabled ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                          {window.location.origin}{publicUrl}
                        </code>
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        {/* Preview */}
                        <Link to={publicUrl} target="_blank">
                          <button
                            className={`px-3 py-2 flex items-center gap-1.5 text-xs font-black border-2 border-black rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_black] ${lpEnabled ? 'bg-white hover:bg-brand-blue/10' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                            title="Voir la landing page"
                            disabled={!lpEnabled}
                          >
                            <Eye size={14} /> Voir
                          </button>
                        </Link>
                        {/* Copy link */}
                        <button
                          id={`copy-lp-${program.id}`}
                          onClick={() => handleCopyLink(program.id)}
                          className="px-3 py-2 flex items-center gap-1.5 text-xs font-black bg-white border-2 border-black rounded-xl hover:bg-orange-50 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_black] transition-all"
                          title="Copier le lien"
                        >
                          <Copy size={14} /> Copier
                        </button>
                        {/* Edit */}
                        <Link to={`/admin/landing/${program.id}`}>
                          <button className="px-3 py-2 flex items-center gap-1.5 text-xs font-black bg-orange-500 border-2 border-black rounded-xl hover:bg-orange-400 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_black] transition-all">
                            <Edit2 size={14} /> Éditer
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {programs.length === 0 && (
          <div className="py-20 text-center text-gray-400">
            <Rocket size={48} className="mx-auto mb-3 opacity-20" />
            <p className="font-bold">Aucun programme trouvé. Créez un programme d'abord.</p>
          </div>
        )}
      </div>
    </div>
  );
};
