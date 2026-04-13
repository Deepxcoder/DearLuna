import { useState, useEffect } from 'react';
import { addDays, subDays, format, differenceInDays } from 'date-fns';

/**
 * Custom hook to handle cycle prediction logic.
 * Simple model estimating the next period and ovulation dates.
 */
export const useCycleLogic = (lastPeriodDateStr, averageCycleLength = 28) => {
  const [cycleData, setCycleData] = useState({
    nextPeriod: null,
    ovulationDay: null,
    daysUntilPeriod: null,
    currentPhase: 'Unknown'
  });

  useEffect(() => {
    if (!lastPeriodDateStr) return;

    const today = new Date();
    const lastPeriodDate = new Date(lastPeriodDateStr);
    
    // Predictions
    const nextPeriod = addDays(lastPeriodDate, averageCycleLength);
    const ovulationDay = subDays(nextPeriod, 14); // Usually 14 days before next period
    
    // Calculations
    const daysUntilPeriod = differenceInDays(nextPeriod, today);
    const daysSinceLastPeriod = differenceInDays(today, lastPeriodDate);

    // Simple phase determination
    let currentPhase = 'Follicular';
    if (daysSinceLastPeriod <= 5) {
      currentPhase = 'Menstrual';
    } else if (differenceInDays(ovulationDay, today) >= -2 && differenceInDays(ovulationDay, today) <= 2) {
      currentPhase = 'Ovulation';
    } else if (daysSinceLastPeriod > 14) {
      currentPhase = 'Luteal';
    }

    setCycleData({
      nextPeriod: format(nextPeriod, 'MMM do'),
      ovulationDay: format(ovulationDay, 'MMM do'),
      daysUntilPeriod,
      currentPhase
    });
  }, [lastPeriodDateStr, averageCycleLength]);

  return cycleData;
};
