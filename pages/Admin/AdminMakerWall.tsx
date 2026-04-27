import React, { useEffect, useState } from 'react';
import { MakerProject, MakerQuest } from '../../types';
import { Check, X, Edit3, Trash2, ExternalLink, Image as ImageIcon, Target, Box } from 'lucide-react';
import { onSnapshot, query, collection, orderBy, doc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export const AdminMakerWall: React.FC = () => {
  const [projects, setProjects] = useState<MakerProject[]>([]);
  const [quests, setQuests] = useState<Record<string, string>>({}); // id -> title mapping
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPitch, setEditPitch] = useState('');

  useEffect(() => {
    // Fetch Quests for mapping
    const fetchQuests = async () => {
      try {
        const qSnap = await getDocs(collection(db, 'maker_quests'));
        const mapping: Record<string, string> = {};
        qSnap.forEach(doc => {
          mapping[doc.id] = doc.data().title;
        });
        setQuests(mapping);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuests();

    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MakerProject));
      setProjects(fetched);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleApprove = async (id: string, currentStatus: string) => {
    try {
      await updateDoc(doc(db, 'projects', id), {
        status: currentStatus === 'approved' ? 'pending' : 'approved'
      });
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'projects', id));
      } catch (err) {
        console.error(err);
        alert('Error deleting project');
      }
    }
  };

  const saveEdit = async (id: string) => {
    try {
      await updateDoc(doc(db, 'projects', id), {
        pitch: editPitch
      });
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert('Error saving edit');
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Loading Maker Wall...</div>;
  }

  const pendingCount = projects.filter(p => p.status === 'pending').length;

  return (
    <div className="p-8 font-sans max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black font-display text-brand-dark mb-2">Maker Wall Queue</h1>
          <p className="text-gray-500 font-medium">Manage and approve student submitted projects.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg border border-yellow-200 font-bold flex items-center gap-2">
            Pending: <span className="bg-white px-2 py-0.5 rounded-md shadow-sm">{pendingCount}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-4">Project</th>
                <th className="p-4">Makers & Links</th>
                <th className="p-4 w-1/3">Elevator Pitch</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400 font-medium">No projects found.</td>
                </tr>
              ) : projects.map(project => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  
                  {/* Project Info */}
                  <td className="p-4 align-top">
                    <div className="flex gap-4 max-w-sm">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200 shadow-sm relative group">
                        {project.coverImage ? (
                          <>
                            <img src={project.coverImage} className="w-full h-full object-cover" alt="Cover" />
                            <a href={project.coverImage} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <ImageIcon className="w-5 h-5 text-white" />
                            </a>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon /></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-brand-dark mb-1">{project.projectTitle}</h3>
                        <div className="flex flex-wrap gap-1 mb-2">
                           <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md font-bold uppercase tracking-wider border border-gray-200">
                             {project.category}
                           </span>
                           {project.questId && (
                              <span className="text-[10px] px-2 py-0.5 bg-orange-50 text-brand-orange rounded-md font-black uppercase tracking-wider border border-brand-orange/30 flex items-center gap-1">
                                <Target size={10} strokeWidth={3} /> {quests[project.questId] || 'Quest'}
                              </span>
                           )}
                        </div>
                        <div className="mt-2 text-xs text-gray-400 font-medium">
                           {project.createdAt?.seconds ? new Date(project.createdAt.seconds * 1000).toLocaleDateString() : 'Pending...'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Makers & Links */}
                  <td className="p-4 align-top">
                    <div className="font-medium text-gray-700 mb-3 block">
                      {project.makerNames.join(', ')}
                    </div>
                    <div className="space-y-2">
                      {project.liveLink && (
                        <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="text-sm flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium">
                          <ExternalLink className="w-4 h-4"/> Live Site
                        </a>
                      )}
                      {project.repoLink && (
                        <a href={project.repoLink} target="_blank" rel="noopener noreferrer" className="text-sm flex items-center gap-1.5 text-gray-600 hover:text-gray-900 font-medium">
                          <ExternalLink className="w-4 h-4"/> Repo / Figma
                        </a>
                      )}
                      {project.assetLink && (
                        <a href={project.assetLink} target="_blank" rel="noopener noreferrer" className="text-sm flex items-center gap-1.5 text-brand-orange hover:text-[#e65a12] font-black uppercase tracking-tight">
                          <Box className="w-4 h-4"/> Assets (Drive)
                        </a>
                      )}
                    </div>
                  </td>

                  {/* Pitch / Editable */}
                  <td className="p-4 align-top w-1/3">
                    {editingId === project.id ? (
                      <div className="space-y-2">
                        <textarea 
                          className="w-full p-3 border border-brand-orange rounded-lg focus:ring-2 focus:ring-brand-orange/20 text-sm font-medium resize-none"
                          rows={4}
                          value={editPitch}
                          onChange={(e) => setEditPitch(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(project.id!)} className="px-3 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-md hover:bg-[#e65a12]">Save</button>
                          <button onClick={() => setEditingId(null)} className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-bold rounded-md hover:bg-gray-300">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative group p-2 -mx-2 rounded-lg hover:bg-gray-100/50 transition-colors">
                        <p className="text-sm text-gray-600 mb-1">{project.pitch}</p>
                        <button 
                          onClick={() => { setEditingId(project.id!); setEditPitch(project.pitch); }}
                          className="absolute top-2 right-2 p-1.5 bg-white text-gray-400 hover:text-brand-orange shadow-sm rounded-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Status & Actions */}
                  <td className="p-4 align-top">
                    <button 
                      onClick={() => handleApprove(project.id!, project.status)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-colors ${
                        project.status === 'approved' 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      }`}
                    >
                      {project.status === 'approved' ? <Check className="w-3.5 h-3.5"/> : <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />}
                      {project.status}
                    </button>
                  </td>

                  <td className="p-4 align-top">
                    <button 
                      onClick={() => handleDelete(project.id!)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
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
