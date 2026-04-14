import { DemoSlot, RecurrentSlot, LandingLead } from '../types';

/**
 * Generates virtual slot instances based on recurrent templates and one-off specific slots.
 * Automatically calculates availability based on existing bookings.
 */
export const generateUpcomingInstances = (
  recurrentSlots: RecurrentSlot[] = [],
  specificSlots: DemoSlot[] = [],
  bookings: LandingLead[] = [],
  weeksCount: number = 4
): DemoSlot[] => {
  const instances: DemoSlot[] = [];
  const now = new Date();
  
  if (!recurrentSlots) recurrentSlots = [];
  if (!specificSlots) specificSlots = [];
  if (!bookings) bookings = [];

  // 1. Process Specific One-off Slots
  const activeSpecific = specificSlots.filter(s => s.active);
  activeSpecific.forEach(slot => {
    // Count bookings for this specific slot (by ID or Date/Time)
    const bookedCount = bookings.filter(b => 
      b.demoSlotId === slot.id || 
      (b.missionDate === slot.isoDate && b.type === 'trial')
    ).length;

    instances.push({
      ...slot,
      spotsLeft: Math.max(0, slot.spotsTotal - bookedCount)
    });
  });

  // 2. Process Recurrent Templates
  const activeRecurrent = recurrentSlots.filter(r => r.active);
  
  for (let i = 0; i < weeksCount; i++) {
    activeRecurrent.forEach(template => {
      (template.daysOfWeek || []).forEach(dayOfWeek => {
        const date = new Date();
        // Calculate the next occurrence of this dayOfWeek
        date.setDate(now.getDate() + (i * 7) + (dayOfWeek - now.getDay() + 7) % 7);
        
        const isoDate = date.toISOString().split('T')[0];
        
        (template.timeSlots || []).forEach(time => {
          // Prevent duplicates if a specific slot already exists for this exact day/time
          const hasSpecific = instances.some(inst => inst.isoDate === isoDate && inst.startTime === time.start);
          if (hasSpecific) return;

          // Count bookings for this specific occurrence
          const bookedCount = bookings.filter(b => 
            (b.missionDate === isoDate && b.notes?.includes(`Slot Time: ${time.start}`)) ||
            (b.demoSlotId === template.id && b.missionDate === isoDate)
          ).length;

          instances.push({
            id: `${template.id}-${isoDate}-${time.start}`, 
            title: template.title,
            isoDate: isoDate,
            startTime: time.start,
            endTime: time.end,
            spotsTotal: template.maxSpots,
            spotsLeft: Math.max(0, template.maxSpots - bookedCount),
            active: true
          });
        });
      });
    });
  }

  // Sort by date then time
  return instances.sort((a, b) => {
    const dateComp = a.isoDate.localeCompare(b.isoDate);
    if (dateComp !== 0) return dateComp;
    return a.startTime.localeCompare(b.startTime);
  });
};
