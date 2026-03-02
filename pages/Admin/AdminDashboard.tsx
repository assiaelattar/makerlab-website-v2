
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePrograms } from '../../contexts/ProgramContext';
import { Button } from '../../components/Button';
import { Plus, Edit2, Trash2, Power, Eye } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { programs, deleteProgram, updateProgram } = usePrograms();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-12">
           <h1 className="font-display font-bold text-4xl">Admin Dashboard</h1>
           <div className="flex gap-4">
              <Link to="/admin/program/new">
                <Button variant="primary" className="shadow-neo"><Plus size={20}/> Nouveau Workshop</Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>Déconnexion</Button>
           </div>
        </div>

        <div className="bg-white border-4 border-black rounded-3xl shadow-neo overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b-4 border-black">
              <tr>
                <th className="p-6 font-bold uppercase text-sm text-gray-500">Workshop</th>
                <th className="p-6 font-bold uppercase text-sm text-gray-500">Catégorie</th>
                <th className="p-6 font-bold uppercase text-sm text-gray-500">Prix</th>
                <th className="p-6 font-bold uppercase text-sm text-gray-500">Status</th>
                <th className="p-6 font-bold uppercase text-sm text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-200">
              {programs.map(program => (
                <tr key={program.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg border-2 border-black overflow-hidden shrink-0">
                         <img src={program.image} alt="" className="w-full h-full object-cover"/>
                      </div>
                      <span className="font-bold text-lg">{program.title}</span>
                    </div>
                  </td>
                  <td className="p-6 font-medium text-gray-600">
                    <span className="bg-gray-200 px-3 py-1 rounded-full text-xs font-bold uppercase border border-gray-400">{program.category}</span>
                  </td>
                  <td className="p-6 font-bold font-display">{program.price}</td>
                  <td className="p-6">
                    <button 
                      onClick={() => updateProgram(program.id, { active: !program.active })}
                      className={`px-3 py-1 rounded-full text-xs font-bold border-2 flex items-center gap-1 w-fit ${program.active ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700'}`}
                    >
                      <Power size={12} />
                      {program.active ? 'ACTIF' : 'INACTIF'}
                    </button>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                       <Link to={`/programs/${program.id}`} target="_blank">
                         <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="Voir"><Eye size={20} className="text-gray-500" /></button>
                       </Link>
                       <Link to={`/admin/program/${program.id}`}>
                         <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors" title="Editer"><Edit2 size={20} className="text-blue-600" /></button>
                       </Link>
                       <button 
                         onClick={() => { if(window.confirm('Supprimer ce workshop ?')) deleteProgram(program.id) }} 
                         className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                         title="Supprimer"
                       >
                         <Trash2 size={20} className="text-red-600" />
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
