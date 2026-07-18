import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';

interface AdminAuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, async nextUser => {
    if (!nextUser) {
      setUser(null);
      setLoading(false);
      return;
    }
    const token = await nextUser.getIdTokenResult();
    if (token.claims.admin === true) setUser(nextUser);
    else {
      setUser(null);
      await signOut(auth);
    }
    setLoading(false);
  }), []);

  const login = async (email: string, password: string) => {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const token = await credential.user.getIdTokenResult(true);
    if (token.claims.admin !== true) {
      await signOut(auth);
      throw new Error('Account is not an administrator');
    }
  };

  const logout = () => signOut(auth);

  return <AdminAuthContext.Provider value={{ user, loading, login, logout }}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
};
