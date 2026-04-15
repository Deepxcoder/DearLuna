import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  differenceInDays
} from 'date-fns';

/**
 * Generates an array of 42 days (6 weeks) to populate a calendar grid.
 * Includes padding days from the previous and next months.
 */
export const getCalendarGrid = (date) => {
  const monthStart = startOfMonth(date);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
  
  const days = [];
  let currentDay = startDate;
  
  for (let i = 0; i < 42; i++) {
    days.push({
      date: currentDay,
      dayNumber: currentDay.getDate(),
      isCurrentMonth: isSameMonth(currentDay, monthStart),
      isToday: isSameDay(currentDay, new Date()),
    });
    currentDay = new Date(currentDay.getTime() + 86400000);
  }
  
  return days;
};

/**
 * Procedural logic to determine if a date falls in a specific cycle phase.
 * Based on a last period date and average 28-day cycle.
 */
export const getDayPhase = (targetDate, lastPeriodDateStr, cycleLength = 28) => {
  if (!lastPeriodDateStr) return null;
  
  const lastPeriod = new Date(lastPeriodDateStr);
  const diff = differenceInDays(targetDate, lastPeriod);
  
  // Normalize to current cycle loop
  const dayInCycle = ((diff % cycleLength) + cycleLength) % cycleLength;
  
  if (dayInCycle >= 0 && dayInCycle < 5) return 'period';
  if (dayInCycle >= 10 && dayInCycle < 17) return 'fertile';
  return null;
};

export const formatMonthHeader = (date) => format(date, 'MMMM yyyy');
export const formatDetailDate = (date) => format(date, 'MMMM d, yyyy');

export { addMonths, subMonths, isSameDay, format };
