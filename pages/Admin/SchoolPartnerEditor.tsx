import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSchool } from '../../contexts/SchoolContext';
import { SchoolPartner } from '../../types';
import { Button } from '../../components/Button';
import { ArrowLeft, Save, Upload, Image as ImageIcon } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

const emptyPartner: Omit<SchoolPartner, 'id'> = {
  name: '',
  slug: '',
  logo: '',
  contactInfo: {
    email: '',
    phone: '',
    address: '',
  }
};

export const SchoolPartnerEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { schoolPartners, addSchoolPartner, updateSchoolPartner } = useSchool();
  const [formData, setFormData] = useState<Omit<SchoolPartner, 'id'>>(emptyPartner);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (id && id !== 'new') {
      const existing = schoolPartners.find(s => s.id === id);
      if (existing) {
        const { id: _, ...data } = existing;
        setFormData(data);
      }
    }
  }, [id, schoolPartners]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('contact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contactInfo: { ...prev.contactInfo, [field]: value }
      }));
    } else if (name === 'name') {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      setFormData(prev => ({ ...prev, name: value, slug }));
    } else if (name === 'slug') {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      setFormData(prev => ({ ...prev, slug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const storagePath = `website-programs-images/partners/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setFormData(prev => ({ ...prev, logo: downloadURL }));
    } catch (error) {
      console.error(error);
      alert("Erreur upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id === 'new') {
      await addSchoolPartner(formData);
    } else if (id) {
      await updateSchoolPartner(id, formData);
    }
    navigate('/admin/partners');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 shadow-inner">
      <div className="container mx-auto max-w-3xl">
        <Button variant="outline" onClick={() => navigate('/admin/partners')} className="mb-8 border-2 border-black shadow-neo-sm">
          <ArrowLeft size={16} /> Retour aux partenaires
        </Button>

        <div className="bg-white rounded-3xl border-4 border-black shadow-neo-lg p-8">
          <h1 className="font-display font-black text-4xl mb-8 uppercase tracking-tighter text-brand-orange">
            {id === 'new' ? 'Nouveau Partenaire' : 'Modifier le Partenaire'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label className="block font-black text-sm uppercase mb-2">Nom de l'établissement</label>
                <input name="name" value={formData.name} onChange={handleChange} className="w-full p-4 border-4 border-black rounded-xl font-bold" required placeholder="ex: Lycée Théophile Gautier" />
              </div>

              <div>
                <label className="block font-black text-sm uppercase mb-2">Slug (Sous-domaine)</label>
                <div className="flex items-center">
                  <input name="slug" value={formData.slug} onChange={handleChange} className="flex-1 p-4 border-4 border-black rounded-l-xl font-bold border-r-0" required placeholder="theophile-gautier" />
                  <div className="p-4 border-4 border-black rounded-r-xl bg-gray-100 font-bold">.makerlab.academy</div>
                </div>
                <p className="mt-2 text-xs text-gray-500 font-bold uppercase italic">C'est le nom qui apparaîtra dans l'URL.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block font-black text-sm uppercase mb-2">Logo de l'école</label>
                    <div className="border-4 border-black rounded-2xl aspect-square bg-white overflow-hidden shadow-neo-sm relative group flex items-center justify-center p-4">
                      {formData.logo ? (
                        <img src={formData.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <ImageIcon size={48} />
                          <span className="font-black text-xs uppercase mt-2">Aucun logo</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <label className="bg-white p-3 rounded-full cursor-pointer hover:scale-110 transition-transform border-4 border-black">
                           <Upload size={24} className="text-black" />
                           <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                         </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-black text-sm uppercase mb-4 border-b-4 border-black pb-2">Coordonnées</h3>
                    <div>
                      <label className="block font-black text-xs uppercase mb-1">Email de contact</label>
                      <input name="contact.email" value={formData.contactInfo?.email || ''} onChange={handleChange} className="w-full p-3 border-2 border-black rounded-xl font-bold" />
                    </div>
                    <div>
                      <label className="block font-black text-xs uppercase mb-1">Téléphone</label>
                      <input name="contact.phone" value={formData.contactInfo?.phone || ''} onChange={handleChange} className="w-full p-3 border-2 border-black rounded-xl font-bold" />
                    </div>
                    <div>
                      <label className="block font-black text-xs uppercase mb-1">Adresse</label>
                      <textarea name="contact.address" value={formData.contactInfo?.address || ''} onChange={handleChange} className="w-full p-3 border-2 border-black rounded-xl font-bold h-24" />
                    </div>
                  </div>
              </div>
            </div>

            <div className="pt-8 border-t-4 border-gray-100">
               <Button type="submit" size="lg" className="w-full justify-center text-xl py-6 bg-brand-orange border-4 border-black shadow-neo-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                 <Save className="mr-3" /> ENREGISTRER LE PARTENAIRE
               </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
