import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { ChevronLeft, ChevronRight, Baby, Target, Clock, User } from 'lucide-react';

interface Booking {
    id: string;
    programTitle: string;
    childName: string;
    preferredDate: string;
    status: 'pending' | 'confirmed' | 'cancelled';
}

export const AdminCalendar: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const q = query(collection(db, 'website-bookings'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking)));
        });
        return unsubscribe;
    }, []);

    const daysInMonth = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const date = new Date(year, month, 1);
        const days = [];
        
        // Pad for start of month
        const firstDay = date.getDay(); // 0 is Sunday
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = firstDay; i > 0; i--) {
            days.push({ day: prevMonthLastDay - i + 1, currentMonth: false, date: new Date(year, month - 1, prevMonthLastDay - i + 1) });
        }

        while (date.getMonth() === month) {
            days.push({ day: date.getDate(), currentMonth: true, date: new Date(date) });
            date.setDate(date.getDate() + 1);
        }

        // Pad for end of month
        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            days.push({ day: i, currentMonth: false, date: new Date(year, month + 1, i) });
        }

        return days;
    }, [currentDate]);

    const bookingsByDate = useMemo(() => {
        const map: Record<string, Booking[]> = {};
        bookings.forEach(b => {
            if (!b.preferredDate) return;
            // Handle both YYYY-MM-DD and potentially other formats
            const dateStr = b.preferredDate.split('T')[0];
            if (!map[dateStr]) map[dateStr] = [];
            map[dateStr].push(b);
        });
        return map;
    }, [bookings]);

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                <div>
                    <h1 className="font-display font-black text-4xl uppercase mb-2">Calendrier des Missions</h1>
                    <p className="font-bold text-gray-500 uppercase text-xs tracking-widest">Planification des Ateliers MakerLAB</p>
                </div>
                
                <div className="flex items-center gap-4 bg-white border-4 border-black p-2 shadow-neo-sm">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-brand-red hover:text-white transition-colors border-2 border-transparent hover:border-black"><ChevronLeft /></button>
                    <span className="font-black uppercase text-lg min-w-[150px] text-center">
                        {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-brand-blue hover:text-white transition-colors border-2 border-transparent hover:border-black"><ChevronRight /></button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-black border-4 border-black shadow-neo-xl overflow-hidden grid grid-cols-7 gap-1">
                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(d => (
                    <div key={d} className="bg-brand-orange text-black p-3 text-center font-black uppercase text-[10px] tracking-widest border-b-4 border-black">
                        {d}
                    </div>
                ))}
                
                {daysInMonth.map((dayObj, i) => {
                    const dateKey = dayObj.date.toISOString().split('T')[0];
                    const dayBookings = bookingsByDate[dateKey] || [];
                    const isToday = new Date().toISOString().split('T')[0] === dateKey;

                    return (
                        <div 
                            key={i} 
                            className={`min-h-[140px] p-2 transition-colors relative ${dayObj.currentMonth ? 'bg-white' : 'bg-gray-100 opacity-60'} ${isToday ? 'ring-inset ring-4 ring-brand-red' : ''}`}
                        >
                            <span className={`font-black text-sm absolute top-2 right-2 ${isToday ? 'bg-brand-red text-white px-2 py-0.5' : 'text-gray-300'}`}>
                                {dayObj.day}
                            </span>
                            
                            <div className="flex flex-col gap-1 mt-6">
                                {dayBookings.map((b, bi) => (
                                    <div 
                                        key={bi} 
                                        className={`text-[8px] font-black p-1 border-2 border-black shadow-neo-xs flex flex-col gap-0.5 ${b.status === 'confirmed' ? 'bg-brand-green text-white' : 'bg-brand-orange'}`}
                                        title={`${b.childName} - ${b.programTitle}`}
                                    >
                                        <div className="flex items-center gap-1">
                                            <Baby size={8} />
                                            <span className="truncate">{b.childName}</span>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-80 italic">
                                            <Target size={8} />
                                            <span className="truncate">{b.programTitle}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-8 flex flex-wrap gap-6 items-center justify-center bg-white border-4 border-black p-6 shadow-neo">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-brand-green border-2 border-black" />
                    <span className="text-xs font-black uppercase tracking-tighter">Mission Confirmée</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-brand-orange border-2 border-black" />
                    <span className="text-xs font-black uppercase tracking-tighter">Attente Validation</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-brand-red" />
                    <span className="text-xs font-black uppercase tracking-tighter">Aujourd'hui</span>
                </div>
            </div>
        </div>
    );
};
