
import React from 'react';
import { Facebook, Twitter, Instagram, Mail, MapPin, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 bg-black text-white pt-16 pb-8 border-t-8 border-brand-yellow">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">

          <div className="space-y-4">
            <h3 className="font-display font-bold text-3xl text-brand-yellow">Make & Go</h3>
            <p className="text-gray-300 max-w-xs mx-auto md:mx-0">
              Transforme tes idées en projets concrets. Tu viens, tu crées, tu repars.
              <br />
              <span className="text-sm mt-2 block text-brand-cyan">Powered by MakerLab Academy</span>
            </p>
          </div>

          <div>
            <h4 className="font-display font-black text-2xl mb-4 text-brand-cyan uppercase tracking-wide">Nos Parcours</h4>
            <ul className="space-y-3 text-gray-300 flex flex-col font-bold">
              <Link to="/ecoles" className="hover:text-brand-yellow transition-colors">Écoles & B2B</Link>
              <Link to="/programs" className="hover:text-brand-yellow transition-colors">Enfants & Ados</Link>
              <Link to="/adultes" className="hover:text-brand-yellow transition-colors">Adultes & Pros</Link>
              <Link to="/store" className="hover:text-brand-yellow transition-colors">Store Éducatif</Link>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-xl mb-4 text-brand-pink">Contact</h4>
            <div className="flex flex-col gap-2 items-center md:items-start text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin size={16} /> Casablanca, Maroc
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} /> hello@makerlab.ma
              </div>
            </div>
            <div className="flex justify-center md:justify-start gap-4 mt-4">
              <a href="#" className="hover:text-brand-yellow transition-colors"><Facebook /></a>
              <a href="#" className="hover:text-brand-yellow transition-colors"><Twitter /></a>
              <a href="#" className="hover:text-brand-yellow transition-colors"><Instagram /></a>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border-4 border-brand-purple shadow-[4px_4px_0px_0px_#EC4899]">
            <p className="text-black font-bold mb-2">Newsletter</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email..." className="w-full p-2 border-2 border-black rounded-lg text-black" />
              <button className="bg-brand-purple text-white p-2 rounded-lg border-2 border-black hover:bg-purple-800">Go</button>
            </div>
          </div>

        </div>
        <div className="mt-12 flex justify-between items-center text-gray-500 text-sm font-display border-t border-gray-800 pt-8">
          <span>© 2024 MakerLab Academy. Tous droits réservés.</span>
          <Link to="/admin" className="hover:text-white flex items-center gap-1"><Lock size={12} /> Staff</Link>
        </div>
      </div>
    </footer>
  );
};
