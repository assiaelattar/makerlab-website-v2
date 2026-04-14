import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { ChevronLeft, ChevronRight, Baby, Target, Clock, User, AlertTriangle } from 'lucide-react';
import { useMissions } from '../../contexts/MissionContext';
import { generateUpcomingInstances } from '../../utils/slotUtils';

interface Booking {
    id: string;
    programTitle: string;
    childName: string;
    preferredDate: string;
    status: 'pending' | 'confirmed' | 'cancelled';
}

export const AdminCalendar: React.FC = () => {
    const { missions, demoSlots, recurrentSlots, leads: contextLeads } = useMissions();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const q = query(collection(db, 'website-bookings'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking)));
        });
        return unsubscribe;
    }, []);

    // 🧠 Compute all demo instances (including recurrent)
    const allDemos = useMemo(() => {
        // Generate for 8 weeks in admin to see further ahead
        return generateUpcomingInstances(recurrentSlots, demoSlots, contextLeads as any, 8);
    }, [recurrentSlots, demoSlots, contextLeads]);

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

    const eventsByDate = useMemo(() => {
        const map: Record<string, { bookings: Booking[], missions: any[], demos: any[], conflicts: boolean }> = {};
        
        // Initialize map for missions
        missions.forEach(m => {
            if (!m.isoDate) return;
            if (!map[m.isoDate]) map[m.isoDate] = { bookings: [], missions: [], demos: [], conflicts: false };
            map[m.isoDate].missions.push(m);
        });

        // Initialize map for demo slots
        demoSlots.forEach(d => {
            if (!d.isoDate) return;
            if (!map[d.isoDate]) map[d.isoDate] = { bookings: [], missions: [], demos: [], conflicts: false };
            map[d.isoDate].demos.push(d);
        });

        // Add bookings
        bookings.forEach(b => {
            if (!b.preferredDate) return;
            const dateStr = b.preferredDate.split('T')[0];
            if (!map[dateStr]) map[dateStr] = { bookings: [], missions: [], demos: [], conflicts: false };
            map[dateStr].bookings.push(b);
        });

        // Check for conflicts on each date
        Object.keys(map).forEach(date => {
            const dayEvents = [...map[date].missions, ...map[date].demos];
            if (dayEvents.length > 1) {
                for (let i = 0; i < dayEvents.length; i++) {
                    for (let j = i + 1; j < dayEvents.length; j++) {
                        const a = dayEvents[i];
                        const b = dayEvents[j];
                        if (a.startTime && a.endTime && b.startTime && b.endTime) {
                            if ((a.startTime >= b.startTime && a.startTime < b.endTime) || 
                                (a.endTime > b.startTime && a.endTime <= b.endTime) ||
                                (a.startTime <= b.startTime && a.endTime >= b.endTime)) {
                                map[date].conflicts = true;
                                break;
                            }
                        }
                    }
                    if (map[date].conflicts) break;
                }
            }
        });

        return map;
    }, [bookings, missions, demoSlots]);

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                <div>
                    <h1 className="font-display font-black text-4xl uppercase mb-2">Planning Unifié</h1>
                    <p className="font-bold text-gray-500 uppercase text-xs tracking-widest">Make & Go + Ateliers Démo</p>
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
                    const dayData = eventsByDate[dateKey] || { bookings: [], missions: [], demos: [], conflicts: false };
                    const isToday = new Date().toISOString().split('T')[0] === dateKey;

                    return (
                        <div 
                            key={i} 
                            className={`min-h-[160px] p-2 transition-colors relative border-2 ${dayObj.currentMonth ? 'bg-white' : 'bg-gray-50 opacity-40'} ${isToday ? 'ring-inset ring-4 ring-brand-red' : ''} ${dayData.conflicts ? 'border-red-500 bg-red-50' : 'border-transparent'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                {dayData.conflicts && <AlertTriangle size={14} className="text-red-500 animate-pulse" />}
                                <span className={`font-black text-[10px] ${isToday ? 'bg-brand-red text-white px-2 py-0.5 rounded' : 'text-gray-300'}`}>
                                    {dayObj.day}
                                </span>
                            </div>
                            
                            <div className="flex flex-col gap-1 overflow-y-auto max-h-[120px] scrollbar-none">
                                {/* Missions */}
                                {dayData.missions.map((m, mi) => (
                                    <div key={`m-${mi}`} className="text-[7px] font-black p-1 bg-brand-orange border border-black shadow-neo-xxs flex flex-col">
                                        <div className="flex justify-between items-center">
                                            <span className="truncate">MSG: {m.title}</span>
                                            <span className="opacity-70 whitespace-nowrap">{m.startTime}-{m.endTime}</span>
                                        </div>
                                    </div>
                                ))}

                                {/* Demos */}
                                {dayData.demos.map((d, di) => (
                                    <div key={`d-${di}`} className="text-[7px] font-black p-1 bg-purple-500 text-white border border-black shadow-neo-xxs flex flex-col">
                                        <div className="flex justify-between items-center">
                                            <span className="truncate">DÉMO: {d.title}</span>
                                            <span className="opacity-80 whitespace-nowrap">{d.startTime}-{d.endTime}</span>
                                        </div>
                                    </div>
                                ))}

                                {/* Bookings */}
                                {dayData.bookings.map((b, bi) => (
                                    <div 
                                        key={`b-${bi}`} 
                                        className={`text-[7px] font-black p-1 border border-black shadow-neo-xxs flex flex-col gap-0.5 ${b.status === 'confirmed' ? 'bg-brand-green text-white' : 'bg-white text-black'}`}
                                        title={`${b.childName} - ${b.programTitle}`}
                                    >
                                        <div className="flex items-center gap-1">
                                            <Baby size={6} />
                                            <span className="truncate">{b.childName}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-8 flex flex-wrap gap-4 items-center justify-center bg-white border-4 border-black p-6 shadow-neo">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-brand-orange border-2 border-black" />
                    <span className="text-[10px] font-black uppercase">Mission M&G</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 border-2 border-black" />
                    <span className="text-[10px] font-black uppercase">Atelier Démo</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-brand-green border-2 border-black" />
                    <span className="text-[10px] font-black uppercase">Inscription OK</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100 border-2 border-red-500" />
                    <span className="text-[10px] font-black uppercase text-red-600">Conflit</span>
                </div>
            </div>
        </div>
    );
};
