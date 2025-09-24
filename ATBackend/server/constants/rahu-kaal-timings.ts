/**
 * Traditional Rahu Kaal, Yamaganda, and Gulika timings
 * Based on authentic Vedic calculations with sunrise-based divisions
 */

export interface InauspiciousTimings {
  rahuKaal: { startOcta: number; endOcta: number };
  yamaganda: { startOcta: number; endOcta: number };
  gulika: { startOcta: number; endOcta: number };
}

// Day divisions based on sunrise (8 equal parts called "Octas")
export const WEEKDAY_INAUSPICIOUS_TIMINGS: Record<number, InauspiciousTimings> = {
  0: { // Sunday
    rahuKaal: { startOcta: 7, endOcta: 8 }, // 4:30-6:00 PM equivalent
    yamaganda: { startOcta: 4, endOcta: 5 }, // 12:00-1:30 PM equivalent
    gulika: { startOcta: 6, endOcta: 7 }     // 3:00-4:30 PM equivalent
  },
  1: { // Monday
    rahuKaal: { startOcta: 1, endOcta: 2 }, // 7:30-9:00 AM equivalent
    yamaganda: { startOcta: 3, endOcta: 4 }, // 10:30-12:00 PM equivalent
    gulika: { startOcta: 5, endOcta: 6 }     // 1:30-3:00 PM equivalent
  },
  2: { // Tuesday
    rahuKaal: { startOcta: 6, endOcta: 7 }, // 3:00-4:30 PM equivalent
    yamaganda: { startOcta: 2, endOcta: 3 }, // 9:00-10:30 AM equivalent
    gulika: { startOcta: 4, endOcta: 5 }     // 12:00-1:30 PM equivalent
  },
  3: { // Wednesday
    rahuKaal: { startOcta: 4, endOcta: 5 }, // 12:00-1:30 PM equivalent
    yamaganda: { startOcta: 1, endOcta: 2 }, // 7:30-9:00 AM equivalent
    gulika: { startOcta: 3, endOcta: 4 }     // 10:30-12:00 PM equivalent
  },
  4: { // Thursday
    rahuKaal: { startOcta: 5, endOcta: 6 }, // 1:30-3:00 PM equivalent
    yamaganda: { startOcta: 0, endOcta: 1 }, // 6:00-7:30 AM equivalent
    gulika: { startOcta: 2, endOcta: 3 }     // 9:00-10:30 AM equivalent
  },
  5: { // Friday
    rahuKaal: { startOcta: 3, endOcta: 4 }, // 10:30-12:00 PM equivalent
    yamaganda: { startOcta: 6, endOcta: 7 }, // 3:00-4:30 PM equivalent
    gulika: { startOcta: 1, endOcta: 2 }     // 7:30-9:00 AM equivalent
  },
  6: { // Saturday
    rahuKaal: { startOcta: 2, endOcta: 3 }, // 9:00-10:30 AM equivalent
    yamaganda: { startOcta: 5, endOcta: 6 }, // 1:30-3:00 PM equivalent
    gulika: { startOcta: 0, endOcta: 1 }     // 6:00-7:30 AM equivalent
  }
};

/**
 * Calculate exact timing for inauspicious periods based on sunrise
 */
export function calculateInauspiciousTimings(
  sunrise: Date,
  sunset: Date,
  weekday: number
): {
  rahuKaal: { start: string; end: string };
  yamaganda: { start: string; end: string };
  gulika: { start: string; end: string };
} {
  const dayDuration = sunset.getTime() - sunrise.getTime();
  const octaDuration = dayDuration / 8; // 8 equal parts
  
  const timings = WEEKDAY_INAUSPICIOUS_TIMINGS[weekday];
  
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-IN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
  };

  return {
    rahuKaal: {
      start: formatTime(new Date(sunrise.getTime() + (timings.rahuKaal.startOcta * octaDuration))),
      end: formatTime(new Date(sunrise.getTime() + (timings.rahuKaal.endOcta * octaDuration)))
    },
    yamaganda: {
      start: formatTime(new Date(sunrise.getTime() + (timings.yamaganda.startOcta * octaDuration))),
      end: formatTime(new Date(sunrise.getTime() + (timings.yamaganda.endOcta * octaDuration)))
    },
    gulika: {
      start: formatTime(new Date(sunrise.getTime() + (timings.gulika.startOcta * octaDuration))),
      end: formatTime(new Date(sunrise.getTime() + (timings.gulika.endOcta * octaDuration)))
    }
  };
}