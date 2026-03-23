import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Program } from '../types';
import { initialPrograms } from '../data/programs';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface ProgramContextType {
  programs: Program[];
  addProgram: (program: Program) => void;
  updateProgram: (id: string, updatedProgram: Partial<Program>) => void;
  deleteProgram: (id: string) => void;
  getProgram: (id: string) => Program | undefined;
  isLoading: boolean;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

export const ProgramProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'website-programs'));
        const data = querySnapshot.docs.map(doc => {
          const docData = doc.data();
          return {
            ...docData,
            id: doc.id,
            active: docData.active ?? true,
            format: docData.format ?? 'Workshop',
          } as Program;
        });

        if (data.length > 0) {
          setPrograms(data);
        }
      } catch (error) {
        console.warn("⚠️ Firebase offline or unreachable. Using local fallback data.", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const addProgram = async (program: Program) => {
    // Generate a temporary ID for optimistic UI update
    const tempId = Date.now().toString();
    const newProgramWithTempId = { ...program, id: tempId };
    setPrograms(prev => [...prev, newProgramWithTempId]);

    try {
      const { id, ...programData } = program;
      const docRef = await addDoc(collection(db, 'website-programs'), programData);
      // Replace tempId with the real Firebase document ID
      setPrograms(prev => prev.map(p => p.id === tempId ? { ...program, id: docRef.id } : p));
    } catch (e) {
      console.error("Failed to save to DB", e);
    }
  };

  const updateProgram = async (id: string, updatedProgram: Partial<Program>) => {
    // Optimistic UI update
    setPrograms(prev => prev.map(p => p.id === id ? { ...p, ...updatedProgram } : p));

    try {
      const docRef = doc(db, 'website-programs', id);
      // Exclude the ID field if it exists in updatedProgram
      const { id: _, ...dataToUpdate } = updatedProgram as any;
      await updateDoc(docRef, dataToUpdate);
    } catch (e) {
      console.error("Failed to update DB", e);
    }
  };

  const deleteProgram = async (id: string) => {
    // Optimistic UI update
    setPrograms(prev => prev.filter(p => p.id !== id));

    try {
      const docRef = doc(db, 'website-programs', id);
      await deleteDoc(docRef);
    } catch (e) {
      console.error("Failed to delete from DB", e);
    }
  };

  const getProgram = (id: string) => {
    return programs.find(p => p.id === id);
  };

  return (
    <ProgramContext.Provider value={{ programs, addProgram, updateProgram, deleteProgram, getProgram, isLoading }}>
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
