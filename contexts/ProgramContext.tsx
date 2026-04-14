import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Program, Workshop, Funnel } from '../types';
import { initialPrograms } from '../data/programs';
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';

interface ProgramContextType {
  programs: Program[];
  workshops: Workshop[];
  funnels: Funnel[];
  addProgram: (program: Program) => void;
  updateProgram: (id: string, updatedProgram: Partial<Program>) => void;
  deleteProgram: (id: string) => void;
  getProgram: (id: string) => Program | undefined;
  getWorkshop: (id: string) => Workshop | undefined;
  
  // Funnel Operations
  addFunnel: (funnel: Omit<Funnel, 'id'>) => Promise<string>;
  updateFunnel: (id: string, updatedFunnel: Partial<Funnel>) => Promise<void>;
  deleteFunnel: (id: string) => Promise<void>;
  getFunnelBySlug: (slug: string) => Funnel | undefined;
  
  isLoading: boolean;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

export const ProgramProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Real-time listeners
  useEffect(() => {
    let programsLoaded = false;
    let funnelsLoaded = false;
    let workshopsLoaded = false;

    const checkLoading = () => {
      if (programsLoaded && funnelsLoaded && workshopsLoaded) {
        setIsLoading(false);
      }
    };

    // 1. Programs listener
    const unsubPrograms = onSnapshot(collection(db, 'website-programs'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        active: doc.data().active ?? true,
        format: doc.data().format ?? 'Workshop',
      } as Program));
      
      // Merge with initial programs to ensure we have the rich mock data if Firestore is empty
      const merged = [...data];
      initialPrograms.forEach(ip => {
        if (!merged.find(p => p.id === ip.id)) merged.push(ip);
      });
      setPrograms(merged);
      programsLoaded = true;
      checkLoading();
    }, (error) => {
      console.error("Firebase Programs sync error:", error);
      programsLoaded = true;
      checkLoading();
    });

    // 2. Workshops listener
    const unsubWorkshops = onSnapshot(collection(db, 'website-workshops'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        active: doc.data().active ?? true
      } as Workshop));
      setWorkshops(data);
      workshopsLoaded = true;
      checkLoading();
    }, (error) => {
      console.error("Firebase Workshops sync error:", error);
      workshopsLoaded = true;
      checkLoading();
    });

    // 3. Funnels listener
    const unsubFunnels = onSnapshot(collection(db, 'website-funnels'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      } as Funnel));
      setFunnels(data);
    });

    return () => {
      unsubPrograms();
      unsubWorkshops();
      unsubFunnels();
    };
  }, []);

  const addProgram = async (program: Program) => {
    // Note: onSnapshot will handle state update
    try {
      const { id, ...programData } = program;
      await addDoc(collection(db, 'website-programs'), programData);
    } catch (e) {
      console.error("Failed to save program", e);
    }
  };

  const updateProgram = async (id: string, updatedProgram: Partial<Program>) => {
    try {
      const docRef = doc(db, 'website-programs', id);
      const { id: _, ...dataToUpdate } = updatedProgram as any;
      await updateDoc(docRef, dataToUpdate);
    } catch (e) {
      console.error("Failed to update program", e);
    }
  };

  const deleteProgram = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'website-programs', id));
    } catch (e) {
      console.error("Failed to delete program", e);
    }
  };

  const addFunnel = async (funnel: Omit<Funnel, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'website-funnels'), funnel);
      return docRef.id;
    } catch (e) {
      console.error("Failed to add funnel", e);
      throw e;
    }
  };

  const updateFunnel = async (id: string, updatedFunnel: Partial<Funnel>) => {
    try {
      const docRef = doc(db, 'website-funnels', id);
      const { id: _, ...dataToUpdate } = updatedFunnel as any;
      await updateDoc(docRef, dataToUpdate);
    } catch (e) {
      console.error("Failed to update funnel", e);
    }
  };

  const deleteFunnel = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'website-funnels', id));
    } catch (e) {
      console.error("Failed to delete funnel", e);
    }
  };

  const getFunnelBySlug = useCallback((slug: string) => {
    return funnels.find(f => f.slug === slug);
  }, [funnels]);

  const getProgram = useCallback((id: string) => {
    return programs.find(p => p.id === id);
  }, [programs]);

  const getWorkshop = useCallback((id: string) => {
    return workshops.find(w => w.id === id);
  }, [workshops]);

  return (
    <ProgramContext.Provider value={{ 
      programs, workshops, funnels, 
      addProgram, updateProgram, deleteProgram, getProgram, getWorkshop,
      addFunnel, updateFunnel, deleteFunnel, getFunnelBySlug,
      isLoading 
    }}>
      {children}
    </ProgramContext.Provider>
  );
};

export const usePrograms = () => {
  const context = useContext(ProgramContext);
  if (!context) {
    throw new Error('usePrograms must be used within a ProgramProvider');
  }
  return context;
};
