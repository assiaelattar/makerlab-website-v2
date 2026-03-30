import React, { useState } from 'react';
import { Button } from '../components/Button';

export const Register: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-brand-red text-white p-12 rounded-3xl border-4 border-black shadow-neo text-center max-w-lg">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="font-display font-bold text-4xl mb-4">Tu es sur la liste !</h2>
          <p className="font-medium text-lg mb-8">Nous avons reçu ton inscription. Vérifie tes emails pour la confirmation et les détails du paiement (400 DHS).</p>
          <Button onClick={() => setSubmitted(false)}>Inscrire une autre personne</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-3xl border-4 border-black shadow-neo-lg p-8 md:p-12 relative">
          
          {/* Decorative Elements */}
          <div className="absolute -top-6 -right-6 bg-brand-green w-16 h-16 rounded-full border-4 border-black hidden md:block animate-bounce"></div>
          <div className="absolute -bottom-6 -left-6 bg-brand-blue w-12 h-12 rotate-45 border-4 border-black hidden md:block"></div>

          <h1 className="font-display font-bold text-4xl mb-2 text-center">Rejoins MakerLab Academy</h1>
          <p className="text-center text-gray-500 font-bold mb-8">Réserve ta place maintenant (400 DHS)</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-bold text-sm uppercase tracking-wide">Nom (Parent/Étudiant)</label>
                <input required type="text" className="w-full p-3 border-2 border-black rounded-xl bg-gray-50 focus:bg-white focus:shadow-neo transition-all outline-none" placeholder="Nom complet" />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-sm uppercase tracking-wide">Email</label>
                <input required type="email" className="w-full p-3 border-2 border-black rounded-xl bg-gray-50 focus:bg-white focus:shadow-neo transition-all outline-none" placeholder="email@exemple.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-bold text-sm uppercase tracking-wide">Nom du participant</label>
                <input required type="text" className="w-full p-3 border-2 border-black rounded-xl bg-gray-50 focus:bg-white focus:shadow-neo transition-all outline-none" placeholder="Prénom" />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-sm uppercase tracking-wide">Âge</label>
                <input required type="number" min="5" max="99" className="w-full p-3 border-2 border-black rounded-xl bg-gray-50 focus:bg-white focus:shadow-neo transition-all outline-none" placeholder="15" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-sm uppercase tracking-wide">Choisis ton atelier</label>
              <select className="w-full p-3 border-2 border-black rounded-xl bg-gray-50 focus:bg-white focus:shadow-neo transition-all outline-none appearance-none cursor-pointer">
                <option>Drones Master</option>
                <option>Impression 3D</option>
                <option>Design Digital</option>
                <option>Jeux Vidéo</option>
                <option>Apps Mobiles</option>
                <option>Start-Up & SaaS</option>
                <option>IA Experience</option>
                <option>Print on Demand</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-sm uppercase tracking-wide">Notes / Questions</label>
              <textarea className="w-full p-3 border-2 border-black rounded-xl bg-gray-50 focus:bg-white focus:shadow-neo transition-all outline-none h-32" placeholder="Une question spécifique ?"></textarea>
            </div>

            <div className="pt-4">
              <Button type="submit" size="lg" className="w-full justify-center bg-brand-red text-white hover:bg-purple-800">
                Confirmer l'inscription
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};