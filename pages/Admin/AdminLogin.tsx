
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Lock } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') { // Simple client-side check
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-red/10">
      <div className="bg-white p-8 rounded-2xl border-4 border-black shadow-neo-xl max-w-md w-full text-center">
        <div className="bg-brand-red w-16 h-16 rounded-full flex items-center justify-center border-2 border-black mx-auto mb-6 shadow-neo">
           <Lock className="text-white" size={32} />
        </div>
        <h1 className="font-display font-bold text-3xl mb-2">Admin Panel</h1>
        <p className="text-gray-500 mb-8">Accès réservé au staff MakerLab</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="password" 
            placeholder="Mot de passe" 
            className="w-full p-4 border-2 border-black rounded-xl text-center text-xl font-bold"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 font-bold animate-bounce">Mot de passe incorrect !</p>}
          <Button type="submit" className="w-full justify-center">Entrer</Button>
        </form>
      </div>
    </div>
  );
};
