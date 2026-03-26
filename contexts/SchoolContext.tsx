import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Workshop, SchoolPartner, Period, Offer, Enrollment } from '../types';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

interface SchoolContextType {
  workshops: Workshop[];
  schoolPartners: SchoolPartner[];
  periods: Period[];
  offers: Offer[];
  
  // Workshop Catalog Actions
  addWorkshop: (workshop: Omit<Workshop, 'id'>) => Promise<string>;
  updateWorkshop: (id: string, updatedWorkshop: Partial<Workshop>) => Promise<void>;
  deleteWorkshop: (id: string) => Promise<void>;
  
  // School Partner Actions
  addSchoolPartner: (school: Omit<SchoolPartner, 'id'>) => Promise<string>;
  updateSchoolPartner: (id: string, updatedSchool: Partial<SchoolPartner>) => Promise<void>;
  
  // Period Actions
  addPeriod: (period: Omit<Period, 'id'>) => Promise<string>;
  
  // Offer Actions
  addOffer: (offer: Omit<Offer, 'id'>) => Promise<string>;
  updateOffer: (id: string, updatedOffer: Partial<Offer>) => Promise<void>;
  getOfferBySlug: (slug: string) => Promise<{ offer: Offer, school: SchoolPartner, period: Period, activeWorkshops: Workshop[] } | null>;
  
  // Enrollment Actions
  addEnrollment: (enrollment: Omit<Enrollment, 'id'>) => Promise<string>;
  
  isLoading: boolean;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [schoolPartners, setSchoolPartners] = useState<SchoolPartner[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workshopSnap, schoolSnap, periodSnap, offerSnap] = await Promise.all([
          getDocs(collection(db, 'workshops')),
          getDocs(collection(db, 'school-partners')),
          getDocs(collection(db, 'periods')),
          getDocs(collection(db, 'offers'))
        ]);

        setWorkshops(workshopSnap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Workshop)));
        setSchoolPartners(schoolSnap.docs.map(doc => ({ ...doc.data(), id: doc.id } as SchoolPartner)));
        setPeriods(periodSnap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Period)));
        setOffers(offerSnap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Offer)));
      } catch (error) {
        console.error("Error fetching school data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Workshop Actions ---
  const addWorkshop = async (workshop: Omit<Workshop, 'id'>) => {
    const docRef = await addDoc(collection(db, 'workshops'), workshop);
    const newWorkshop = { ...workshop, id: docRef.id } as Workshop;
    setWorkshops(prev => [...prev, newWorkshop]);
    return docRef.id;
  };

  const updateWorkshop = async (id: string, updatedWorkshop: Partial<Workshop>) => {
    setWorkshops(prev => prev.map(w => w.id === id ? { ...w, ...updatedWorkshop } : w));
    await updateDoc(doc(db, 'workshops', id), updatedWorkshop);
  };

  const deleteWorkshop = async (id: string) => {
    setWorkshops(prev => prev.filter(w => w.id !== id));
    await deleteDoc(doc(db, 'workshops', id));
  };

  // --- School Actions ---
  const addSchoolPartner = async (school: Omit<SchoolPartner, 'id'>) => {
    const docRef = await addDoc(collection(db, 'school-partners'), school);
    const newSchool = { ...school, id: docRef.id } as SchoolPartner;
    setSchoolPartners(prev => [...prev, newSchool]);
    return docRef.id;
  };

  const updateSchoolPartner = async (id: string, updatedSchool: Partial<SchoolPartner>) => {
    setSchoolPartners(prev => prev.map(s => s.id === id ? { ...s, ...updatedSchool } : s));
    await updateDoc(doc(db, 'school-partners', id), updatedSchool);
  };

  // --- Period Actions ---
  const addPeriod = async (period: Omit<Period, 'id'>) => {
    const docRef = await addDoc(collection(db, 'periods'), period);
    const newPeriod = { ...period, id: docRef.id } as Period;
    setPeriods(prev => [...prev, newPeriod]);
    return docRef.id;
  };

  // --- Offer Actions ---
  const addOffer = async (offer: Omit<Offer, 'id'>) => {
    const docRef = await addDoc(collection(db, 'offers'), offer);
    const newOffer = { ...offer, id: docRef.id } as Offer;
    setOffers(prev => [...prev, newOffer]);
    return docRef.id;
  };

  const updateOffer = async (id: string, updatedOffer: Partial<Offer>) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, ...updatedOffer } : o));
    await updateDoc(doc(db, 'offers', id), updatedOffer);
  };

  const getOfferBySlug = async (slug: string) => {
    // 1. Find school by slug
    const school = schoolPartners.find(s => s.slug === slug);
    if (!school) return null;

    // 2. Find published offer for this school
    const schoolOffer = offers.find(o => o.schoolId === school.id && o.published);
    if (!schoolOffer) return null;

    // 3. Get period
    const period = periods.find(p => p.id === schoolOffer.periodId);
    if (!period) return null;

    // 4. Get active workshops for this offer
    const activeWorkshops = workshops.filter(w => schoolOffer.workshopIds.includes(w.id));

    return { offer: schoolOffer, school, period, activeWorkshops };
  };

  // --- Enrollment Actions ---
  const addEnrollment = async (enrollment: Omit<Enrollment, 'id'>) => {
    const docRef = await addDoc(collection(db, 'enrollments'), enrollment);
    return docRef.id;
  };

  return (
    <SchoolContext.Provider value={{
      workshops, schoolPartners, periods, offers,
      addWorkshop, updateWorkshop, deleteWorkshop,
      addSchoolPartner, updateSchoolPartner,
      addPeriod,
      addOffer, updateOffer, getOfferBySlug,
      addEnrollment,
      isLoading
    }}>
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
