
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Program } from '../types';
import { initialPrograms } from '../data/programs';
import { API_URL } from '../config';

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
        const res = await fetch(`${API_URL}/programs`);
        if (res.ok) {
          const data = await res.json();
          const formattedData = data.map((p: any) => ({ 
            ...p, 
            id: String(p.id),
            schedule: typeof p.schedule === 'string' ? JSON.parse(p.schedule) : (p.schedule || []),
            stats: typeof p.stats === 'string' ? JSON.parse(p.stats) : (p.stats || [])
          }));
          
          if (formattedData.length > 0) {
            setPrograms(formattedData);
          }
        }
      } catch (error) {
        console.warn("⚠️ Backend offline or unreachable. Using local fallback data.", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const addProgram = async (program: Program) => {
    const tempId = Date.now().toString();
    const newProgramWithTempId = { ...program, id: tempId };
    setPrograms(prev => [...prev, newProgramWithTempId]);

    try {
        const { id, ...programData } = program;
        const res = await fetch(`${API_URL}/programs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(programData)
        });
        if (res.ok) {
            const saved = await res.json();
            setPrograms(prev => prev.map(p => p.id === tempId ? { ...saved, id: String(saved.id) } : p));
        }
    } catch (e) {
        console.error("Failed to save to DB", e);
    }
  };

  const updateProgram = async (id: string, updatedProgram: Partial<Program>) => {
    setPrograms(prev => prev.map(p => p.id === id ? { ...p, ...updatedProgram } : p));
    
    try {
        await fetch(`${API_URL}/programs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProgram)
        });
    } catch (e) { 
        console.error("Failed to update DB", e); 
    }
  };

  const deleteProgram = async (id: string) => {
    setPrograms(prev => prev.filter(p => p.id !== id));
    
    try {
        await fetch(`${API_URL}/programs/${id}`, { method: 'DELETE' });
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
