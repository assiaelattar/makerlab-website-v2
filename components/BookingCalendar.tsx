import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { DemoSlot } from '../types';

interface BookingCalendarProps {
  availableSlots: DemoSlot[];
  onSelect: (slot: DemoSlot) => void;
  selectedSlotId?: string;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({ 
  availableSlots, 
  onSelect, 
  selectedSlotId 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Group slots by date for easy lookup
  const slotsByDate = useMemo(() => {
    const map: Record<string, DemoSlot[]> = {};
    availableSlots.forEach(slot => {
      if (!map[slot.isoDate]) map[slot.isoDate] = [];
      map[slot.isoDate].push(slot);
    });
    return map;
  }, [availableSlots]);

  // Calendar generation logic
  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Padding
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      days.push(null);
    }
    // Days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push(date);
    }
    return days;
  }, [currentDate]);

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const formatDateKey = (date: Date) => date.toISOString().split('T')[0];

  return (
    <div className="bg-white border-2 border-black/10 rounded-2xl md:rounded-[3rem] shadow-xl p-4 md:p-8 overflow-hidden">
      <div className="flex flex-col gap-6 md:gap-12 lg:flex-row">
        
        {/* Left Side: Calendar Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4 md:mb-8">
            <h3 className="font-display font-black text-base md:text-2xl uppercase tracking-tighter text-black/80">
              {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex gap-3">
              <button 
                onClick={() => changeMonth(-1)}
                className="p-3 border-2 border-black/5 rounded-2xl hover:bg-gray-50 transition-all hover:scale-110 active:scale-95"
                title="Mois précédent"
              >
                <ChevronLeft size={24} className="text-black/60" />
              </button>
              <button 
                onClick={() => changeMonth(1)}
                className="p-3 border-2 border-black/5 rounded-2xl hover:bg-gray-50 transition-all hover:scale-110 active:scale-95"
                title="Mois suivant"
              >
                <ChevronRight size={24} className="text-black/60" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 md:mb-4">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
              <div key={d} className="text-center text-[9px] md:text-[11px] font-black uppercase opacity-30 py-1 md:py-2 tracking-widest">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-3">
            {daysInMonth.map((date, idx) => {
              if (!date) return <div key={`empty-${idx}`} className="aspect-square" />;
              
              const dateKey = formatDateKey(date);
              const daySlots = slotsByDate[dateKey] || [];
              const isAvailable = daySlots.length > 0;
              const isSelected = selectedDate === dateKey;
              const pastDate = date < new Date(new Date().setHours(0,0,0,0));

              return (
                <button
                  key={dateKey}
                  disabled={!isAvailable || pastDate}
                  onClick={() => setSelectedDate(dateKey)}
                  className={`
                    aspect-square rounded-[1.25rem] border-2 flex flex-col items-center justify-center transition-all relative
                    ${isAvailable && !pastDate ? 'border-brand-blue/20 hover:border-brand-blue hover:shadow-lg cursor-pointer' : 'border-transparent text-gray-200 cursor-default'}
                    ${isSelected ? 'bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20' : 'bg-white text-black/80'}
                    ${isToday(date) && !isSelected ? 'ring-2 ring-brand-red ring-offset-2' : ''}
                  `}
                >
                  <span className="font-black text-sm md:text-2xl">{date.getDate()}</span>
                  {isAvailable && !pastDate && !isSelected && (
                    <div className="absolute bottom-2 w-1.5 h-1.5 bg-brand-blue rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Time Slots */}
        <div className="w-full lg:w-72 flex flex-col">
          <div className="flex items-center gap-3 mb-4 md:mb-6 bg-gray-50 p-3 md:p-4 rounded-2xl border border-black/5">
            <Clock size={16} className="text-brand-blue md:w-5 md:h-5" />
            <h4 className="font-black text-[10px] md:text-xs uppercase tracking-[0.2em] text-black/60">Horaires</h4>
          </div>

          <div className="flex-1 space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
            {!selectedDate ? (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center p-8 border-4 border-dashed border-gray-100 rounded-[2.5rem] opacity-40">
                <CalendarIcon size={48} className="mb-4 text-gray-300" />
                <p className="text-xs font-black leading-tight uppercase tracking-widest">Choisissez <br/> une date</p>
              </div>
            ) : (
              (slotsByDate[selectedDate] || []).map(slot => (
                <button
                  key={slot.id}
                  onClick={() => onSelect(slot)}
                  className={`
                    w-full p-6 rounded-[2rem] border-2 text-left transition-all flex items-center justify-between group
                    ${selectedSlotId === slot.id 
                      ? 'bg-black text-white border-black shadow-xl -translate-y-1' 
                      : 'bg-white border-black/5 hover:border-black/20 hover:bg-gray-50'}
                  `}
                >
                  <div>
                    <div className="font-black text-xl md:text-2xl italic tracking-tighter">{slot.startTime}</div>
                    <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${selectedSlotId === slot.id ? 'opacity-60' : 'text-brand-blue'}`}>
                      {slot.spotsLeft} places <span className="hidden md:inline">disponibles</span>
                    </div>
                  </div>
                  {selectedSlotId === slot.id && <CheckCircle2 size={24} className="text-brand-green" strokeWidth={3} />}
                </button>
              ))
            )}
          </div>

          {selectedDate && (
            <div className="mt-8 pt-6 border-t border-black/5">
              <p className="text-[10px] font-black text-black/40 uppercase text-center leading-tight tracking-[0.2em]">
                {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
