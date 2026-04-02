import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Mission, Track, LandingLead } from '../types';

interface MissionContextType {
  missions: Mission[];
  tracks: Track[];
  leads: LandingLead[];
  loading: boolean;
  addMission: (mission: Mission) => Promise<void>;
  updateMission: (id: string, data: Partial<Mission>) => Promise<void>;
  deleteMission: (id: string) => Promise<void>;
  addTrack: (track: Track) => Promise<void>;
  updateTrack: (id: string, data: Partial<Track>) => Promise<void>;
  deleteTrack: (id: string) => Promise<void>;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export const MissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [leads, setLeads] = useState<LandingLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeMissions: () => void;
    let unsubscribeTracks: () => void;
    let unsubscribeLeads: () => void;

    try {
      unsubscribeMissions = onSnapshot(collection(db, 'website-missions'), (snapshot) => {
        setMissions(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Mission)));
      });

      unsubscribeTracks = onSnapshot(collection(db, 'website-tracks'), (snapshot) => {
        setTracks(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Track)));
      });

      unsubscribeLeads = onSnapshot(collection(db, 'website-landing-leads'), (snapshot) => {
        setLeads(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as LandingLead)));
      });

    } catch (error) {
      console.error("Error subscribing to missions/tracks", error);
    }

    setLoading(false);

    return () => {
      if (unsubscribeMissions) unsubscribeMissions();
      if (unsubscribeTracks) unsubscribeTracks();
      if (unsubscribeLeads) unsubscribeLeads();
    };
  }, []);

  const addMission = async (mission: Mission) => {
    await setDoc(doc(db, 'website-missions', mission.id), mission);
  };

  const updateMission = async (id: string, data: Partial<Mission>) => {
    await updateDoc(doc(db, 'website-missions', id), data);
  };

  const deleteMission = async (id: string) => {
    await deleteDoc(doc(db, 'website-missions', id));
  };

  const addTrack = async (track: Track) => {
    await setDoc(doc(db, 'website-tracks', track.id), track);
  };

  const updateTrack = async (id: string, data: Partial<Track>) => {
    await updateDoc(doc(db, 'website-tracks', id), data);
  };

  const deleteTrack = async (id: string) => {
    await deleteDoc(doc(db, 'website-tracks', id));
  };

  return (
    <MissionContext.Provider value={{
      missions, tracks, leads, loading,
      addMission, updateMission, deleteMission,
      addTrack, updateTrack, deleteTrack
    }}>
      {children}
    </MissionContext.Provider>
  );
};

export const useMissions = () => {
  const context = useContext(MissionContext);
  if (!context) throw new Error('useMissions must be used within MissionProvider');
  return context;
};
