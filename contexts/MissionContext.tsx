import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Mission, Track, LandingLead, OrientationLead, DemoSlot, RecurrentSlot } from '../types';

interface MissionContextType {
  missions: Mission[];
  tracks: Track[];
  leads: LandingLead[];
  orientationLeads: OrientationLead[];
  demoSlots: DemoSlot[];
  recurrentSlots: RecurrentSlot[];
  loading: boolean;
  addMission: (mission: Mission) => Promise<void>;
  updateMission: (id: string, data: Partial<Mission>) => Promise<void>;
  deleteMission: (id: string) => Promise<void>;
  addDemoSlot: (slot: DemoSlot) => Promise<void>;
  updateDemoSlot: (id: string, data: Partial<DemoSlot>) => Promise<void>;
  deleteDemoSlot: (id: string) => Promise<void>;
  addRecurrentSlot: (slot: RecurrentSlot) => Promise<void>;
  updateRecurrentSlot: (id: string, data: Partial<RecurrentSlot>) => Promise<void>;
  deleteRecurrentSlot: (id: string) => Promise<void>;
  addTrack: (track: Track) => Promise<void>;
  updateTrack: (id: string, data: Partial<Track>) => Promise<void>;
  deleteTrack: (id: string) => Promise<void>;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export const MissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [leads, setLeads] = useState<LandingLead[]>([]);
  const [orientationLeads, setOrientationLeads] = useState<OrientationLead[]>([]);
  const [demoSlots, setDemoSlots] = useState<DemoSlot[]>([]);
  const [recurrentSlots, setRecurrentSlots] = useState<RecurrentSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeMissions: () => void;
    let unsubscribeTracks: () => void;
    let unsubscribeLeads: () => void;
    let unsubscribeOrientation: () => void;
    let unsubscribeDemoSlots: () => void;
    let unsubscribeRecurrentSlots: () => void;

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

      unsubscribeOrientation = onSnapshot(collection(db, 'website-orientation-leads'), (snapshot) => {
        setOrientationLeads(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as OrientationLead)));
      });

      unsubscribeDemoSlots = onSnapshot(collection(db, 'website-demo-slots'), (snapshot) => {
        setDemoSlots(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as DemoSlot)));
      });

      unsubscribeRecurrentSlots = onSnapshot(collection(db, 'website-recurrent-slots'), (snapshot) => {
        setRecurrentSlots(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as RecurrentSlot)));
        setLoading(false);
      });

    } catch (error) {
      console.error("Error subscribing to missions/tracks", error);
      setLoading(false);
    }

    return () => {
      if (unsubscribeMissions) unsubscribeMissions();
      if (unsubscribeTracks) unsubscribeTracks();
      if (unsubscribeLeads) unsubscribeLeads();
      if (unsubscribeOrientation) unsubscribeOrientation();
      if (unsubscribeDemoSlots) unsubscribeDemoSlots();
      if (unsubscribeRecurrentSlots) unsubscribeRecurrentSlots();
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

  const addDemoSlot = async (slot: DemoSlot) => {
    await setDoc(doc(db, 'website-demo-slots', slot.id), slot);
  };

  const updateDemoSlot = async (id: string, data: Partial<DemoSlot>) => {
    await updateDoc(doc(db, 'website-demo-slots', id), data);
  };

  const deleteDemoSlot = async (id: string) => {
    await deleteDoc(doc(db, 'website-demo-slots', id));
  };

  const addRecurrentSlot = async (slot: RecurrentSlot) => {
    await setDoc(doc(db, 'website-recurrent-slots', slot.id), slot);
  };

  const updateRecurrentSlot = async (id: string, data: Partial<RecurrentSlot>) => {
    await updateDoc(doc(db, 'website-recurrent-slots', id), data);
  };

  const deleteRecurrentSlot = async (id: string) => {
    await deleteDoc(doc(db, 'website-recurrent-slots', id));
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
      missions, tracks, leads, orientationLeads, demoSlots, recurrentSlots, loading,
      addMission, updateMission, deleteMission,
      addDemoSlot, updateDemoSlot, deleteDemoSlot,
      addRecurrentSlot, updateRecurrentSlot, deleteRecurrentSlot,
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
