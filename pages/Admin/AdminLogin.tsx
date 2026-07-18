
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Lock } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
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
            type="email"
            placeholder="Adresse e-mail professionnelle"
            autoComplete="username"
            required
            className="w-full p-4 border-2 border-black rounded-xl text-center font-bold"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Mot de passe" 
            autoComplete="current-password"
            required
            className="w-full p-4 border-2 border-black rounded-xl text-center text-xl font-bold"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 font-bold">Identifiants incorrects ou compte non autorisé.</p>}
          <Button type="submit" disabled={submitting} className="w-full justify-center">{submitting ? 'Connexion…' : 'Entrer'}</Button>
        </form>
      </div>
    </div>
  );
};
