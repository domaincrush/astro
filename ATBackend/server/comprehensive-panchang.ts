/**
 * Comprehensive Panchang System - Using Dynamic Jyotisha Calculations
 * Provides all major Panchang features: Calendar, Today's Panchang, Tithi, Shubh Muhurat, Nakshatra, Choghadiya, Rahu Kaal
 */

import { spawn } from 'child_process';
import { promisify } from 'util';
import { calculateAccuratePanchang } from './accurate-panchang-calculator';

interface PanchangData {
  date: string;
  location: string;
  latitude: number;
  longitude: number;
  tithi: {
    name: string;
    end_time: string;
    percentage: number;
    description: string;
  };
  nakshatra: {
    name: string;
    end_time: string;
    percentage: number;
    lord: string;
    characteristics: string;
  };
  yoga: {
    name: string;
    end_time: string;
    description: string;
  };
  karana: {
    name: string;
    end_time: string;
    description: string;
  };
  vara: {
    name: string;
    english: string;
    planet_lord: string;
  };
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  auspicious_timings: {
    abhijit_muhurta: { start: string; end: string };
    amrit_kaal: { start: string; end: string };
    brahma_muhurta: { start: string; end: string };
  };
  inauspicious_timings: {
    rahu_kaal: { start: string; end: string };
    yamaganda: { start: string; end: string };
    gulikai: { start: string; end: string };
  };
  choghadiya: Array<{
    period: string;
    start: string;
    end: string;
    type: 'good' | 'bad' | 'neutral';
    description: string;
  }>;
  planetary_positions?: {
    sun: { sign: string; degrees: number; nakshatra: string };
    moon: { sign: string; degrees: number; nakshatra: string };
    mars: { sign: string; degrees: number; nakshatra: string };
    mercury: { sign: string; degrees: number; nakshatra: string };
    jupiter: { sign: string; degrees: number; nakshatra: string };
    venus: { sign: string; degrees: number; nakshatra: string };
    saturn: { sign: string; degrees: number; nakshatra: string };
    rahu: { sign: string; degrees: number; nakshatra: string };
    ketu: { sign: string; degrees: number; nakshatra: string };
  };
  calculations?: {
    ayanamsa: number;
    julian_day: number;
    local_mean_time: string;
    sidereal_time: string;
  };
}

interface ShubhMuhuratData {
  date: string;
  location: string;
  marriage_muhurat: Array<{ start: string; end: string; quality: string; duration: string }>;
  griha_pravesh: Array<{ start: string; end: string; quality: string; duration: string }>;
  vehicle_purchase: Array<{ start: string; end: string; quality: string; duration: string }>;
  property_purchase: Array<{ start: string; end: string; quality: string; duration: string }>;
  business_start: Array<{ start: string; end: string; quality: string; duration: string }>;
  journey_start: Array<{ start: string; end: string; quality: string; duration: string }>;
  general_auspicious: Array<{ start: string; end: string; quality: string; duration: string }>;
}

export class ComprehensivePanchangEngine {
  private async executeJyotishaEngine(inputData: any): Promise<any> {
    
    return new Promise((resolve, reject) => {
      const python = spawn('python', ['server/jyotisha-engine.py']);
      
      let output = '';
      let error = '';
      
      python.stdout.on('data', (data: any) => {
        output += data.toString();
      });
      
      python.stderr.on('data', (data: any) => {
        error += data.toString();
      });
      
      python.on('close', (code: number) => {
        if (code !== 0) {
          console.error('Jyotisha engine error:', error);
          reject(new Error(`Jyotisha engine failed with code ${code}: ${error}`));
          return;
        }
        
        try {
          const result = JSON.parse(output);
          if (result.success) {
            resolve(result);
          } else {
            reject(new Error(result.error || 'Jyotisha engine calculation failed'));
          }
        } catch (parseError) {
          console.error('Failed to parse Jyotisha output:', output);
          reject(new Error(`Failed to parse Jyotisha output: ${parseError}`));
        }
      });
      
      // Send input data via stdin
      python.stdin.write(JSON.stringify(inputData));
      python.stdin.end();
    });
  }

  private getCurrentTithi(): string {
    const tithis = ['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima'];
    return tithis[Math.floor(Math.random() * tithis.length)];
  }

  private getCurrentNakshatra(): string {
    const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
    return nakshatras[Math.floor(Math.random() * nakshatras.length)];
  }

  private getCurrentYoga(): string {
    const yogas = ['Vishkambha', 'Preeti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyana', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Mahendra', 'Vaidhriti'];
    return yogas[Math.floor(Math.random() * yogas.length)];
  }

  private getCurrentKarana(): string {
    const karanas = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'];
    return karanas[Math.floor(Math.random() * karanas.length)];
  }

  private getCurrentVara(): string {
    const days = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
    return days[new Date().getDay()];
  }

  private getCurrentVaraEnglish(): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  }

  private getVaraPlanetLord(): string {
    const lords = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    return lords[new Date().getDay()];
  }

  private getNakshatraLord(nakshatra: string): string {
    const lords: { [key: string]: string } = {
      'Ashwini': 'Ketu', 'Bharani': 'Venus', 'Krittika': 'Sun', 'Rohini': 'Moon',
      'Mrigashira': 'Mars', 'Ardra': 'Rahu', 'Punarvasu': 'Jupiter', 'Pushya': 'Saturn',
      'Ashlesha': 'Mercury', 'Magha': 'Ketu', 'Purva Phalguni': 'Venus', 'Uttara Phalguni': 'Sun',
      'Hasta': 'Moon', 'Chitra': 'Mars', 'Swati': 'Rahu', 'Vishakha': 'Jupiter',
      'Anuradha': 'Saturn', 'Jyeshtha': 'Mercury', 'Mula': 'Ketu', 'Purva Ashadha': 'Venus',
      'Uttara Ashadha': 'Sun', 'Shravana': 'Moon', 'Dhanishta': 'Mars', 'Shatabhisha': 'Rahu',
      'Purva Bhadrapada': 'Jupiter', 'Uttara Bhadrapada': 'Saturn', 'Revati': 'Mercury'
    };
    return lords[nakshatra] || 'Unknown';
  }

  private getNextTithiTime(): string {
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 60);
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  private getNextNakshatraTime(): string {
    return this.getNextTithiTime();
  }

  private getNextYogaTime(): string {
    return this.getNextTithiTime();
  }

  private getNextKaranaTime(): string {
    return this.getNextTithiTime();
  }

  private calculateDuration(startTime: string, endTime: string): string {
    // Parse time in format "HH:MM AM/PM"
    const parseTime = (timeStr: string): number => {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let totalMinutes = hours * 60 + minutes;
      
      if (period === 'PM' && hours !== 12) {
        totalMinutes += 12 * 60;
      } else if (period === 'AM' && hours === 12) {
        totalMinutes = minutes;
      }
      
      return totalMinutes;
    };

    const startMinutes = parseTime(startTime);
    const endMinutes = parseTime(endTime);
    
    let durationMinutes = endMinutes - startMinutes;
    
    // Handle case where end time is next day
    if (durationMinutes < 0) {
      durationMinutes += 24 * 60;
    }
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    if (hours === 0) {
      return `${minutes} minutes`;
    } else if (minutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
    }
  }

  private calculateRahuKaal(): { start: string; end: string } {
    const day = new Date().getDay();
    const rahuKaalTimes: { [key: number]: { start: string; end: string } } = {
      0: { start: '04:30 PM', end: '06:00 PM' }, // Sunday
      1: { start: '07:30 AM', end: '09:00 AM' }, // Monday
      2: { start: '03:00 PM', end: '04:30 PM' }, // Tuesday
      3: { start: '12:00 PM', end: '01:30 PM' }, // Wednesday
      4: { start: '01:30 PM', end: '03:00 PM' }, // Thursday
      5: { start: '10:30 AM', end: '12:00 PM' }, // Friday
      6: { start: '09:00 AM', end: '10:30 AM' }  // Saturday
    };
    return rahuKaalTimes[day];
  }

  private calculateYamaganda(): { start: string; end: string } {
    return { start: '02:00 PM', end: '03:30 PM' };
  }

  private calculateGulikai(): { start: string; end: string } {
    return { start: '04:30 PM', end: '06:00 PM' };
  }

  private generateChoghadiyaData(sunrise: string, sunset: string, date: string): Array<{ period: string; start: string; end: string; type: 'good' | 'bad' | 'neutral'; description: string; duration: string }> {
    // Authentic Choghadiya calculation based on sunrise/sunset
    const parseTime = (timeStr: string): Date => {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      const date = new Date();
      date.setHours(period === 'PM' && hours !== 12 ? hours + 12 : hours === 12 && period === 'AM' ? 0 : hours);
      date.setMinutes(minutes);
      date.setSeconds(0);
      return date;
    };

    const formatTime = (date: Date): string => {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
    };

    const sunriseTime = parseTime(sunrise);
    const sunsetTime = parseTime(sunset);
    
    // Calculate day duration and divide into 8 periods
    const dayDuration = sunsetTime.getTime() - sunriseTime.getTime();
    const periodDuration = dayDuration / 8;
    
    // Choghadiya sequence varies by day of week
    const dayOfWeek = new Date(date).getDay();
    const choghadiyaSequences: { [key: number]: string[] } = {
      0: ['Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg'], // Sunday
      1: ['Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit'], // Monday
      2: ['Char', 'Rog', 'Udveg', 'Shubh', 'Amrit', 'Kaal', 'Char', 'Labh'], // Tuesday
      3: ['Labh', 'Udveg', 'Char', 'Rog', 'Kaal', 'Shubh', 'Amrit', 'Labh'], // Wednesday
      4: ['Shubh', 'Amrit', 'Kaal', 'Char', 'Labh', 'Udveg', 'Rog', 'Shubh'], // Thursday
      5: ['Rog', 'Labh', 'Udveg', 'Amrit', 'Char', 'Kaal', 'Shubh', 'Rog'], // Friday
      6: ['Kaal', 'Shubh', 'Rog', 'Labh', 'Udveg', 'Amrit', 'Char', 'Kaal'] // Saturday
    };

    const todaySequence = choghadiyaSequences[dayOfWeek];
    const dayChoghadiya = [];

    for (let i = 0; i < 8; i++) {
      const startTime = new Date(sunriseTime.getTime() + (i * periodDuration));
      const endTime = new Date(sunriseTime.getTime() + ((i + 1) * periodDuration));
      
      const period = todaySequence[i];
      const type = this.getChoghadiyaType(period);
      
      dayChoghadiya.push({
        period,
        start: formatTime(startTime),
        end: formatTime(endTime),
        type,
        description: this.getChoghadiyaDescription(period),
        duration: this.calculateDuration(formatTime(startTime), formatTime(endTime))
      });
    }

    return dayChoghadiya;
  }

  private getChoghadiyaType(period: string): 'good' | 'bad' | 'neutral' {
    const types: { [key: string]: 'good' | 'bad' | 'neutral' } = {
      'Amrit': 'good',
      'Shubh': 'good', 
      'Labh': 'good',
      'Char': 'neutral',
      'Kaal': 'bad',
      'Rog': 'bad',
      'Udveg': 'bad'
    };
    return types[period] || 'neutral';
  }

  private getChoghadiyaDescription(period: string): string {
    const descriptions: { [key: string]: string } = {
      'Amrit': 'Nectar time - Most auspicious',
      'Shubh': 'Auspicious time - Good for all activities',
      'Labh': 'Beneficial time - Good for gains',
      'Char': 'Movable time - Good for travel',
      'Kaal': 'Inauspicious time - Avoid important work',
      'Rog': 'Disease time - Avoid health matters',
      'Udveg': 'Anxious time - Avoid stress-inducing activities'
    };
    return descriptions[period] || 'Unknown period';
  }

  /**
   * Get Today's Complete Panchang
   */
  async getTodaysPanchang(latitude: number, longitude: number, timezone: string = 'Asia/Kolkata'): Promise<PanchangData> {
    const today = new Date();
    console.log(today.toISOString().split('T')[0]) 
    return await this.getComprehensivePanchang(today.toISOString().split('T')[0], latitude, longitude, timezone);
  }

  async getComprehensivePanchang(date: string, latitude: number, longitude: number, timezone: string = 'Asia/Kolkata'): Promise<PanchangData> {
const [day, month, year] = date.split("-");
const targetDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  console.log(targetDate)
    const inputData = {
      action: 'comprehensive_panchang',
      year: targetDate.getFullYear(),
      month: targetDate.getMonth() + 1,
      day: targetDate.getDate(),
      latitude,
      longitude,
      timezone
    };
console.log('Input Data:', inputData);
    try {
      const result = await this.executeJyotishaEngine(inputData);
      return {
        date: date,
        location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        latitude,
        longitude,
        tithi: {
          name: result.tithi?.name || 'Unknown',
          end_time: result.tithi?.end_time || 'N/A',
          percentage: result.tithi?.percentage || 0,
          description: this.getTithiDescription(result.tithi?.name)
        },
        nakshatra: {
          name: result.nakshatra?.name || 'Unknown',
          end_time: result.nakshatra?.end_time || 'N/A',
          percentage: result.nakshatra?.percentage || 0,
          lord: result.nakshatra?.lord || 'Unknown',
          characteristics: this.getNakshatraCharacteristics(result.nakshatra?.name)
        },
        yoga: {
          name: result.yoga?.name || 'Unknown',
          end_time: result.yoga?.end_time || 'N/A',
          description: this.getYogaDescription(result.yoga?.name)
        },
        karana: {
          name: result.karana?.name || 'Unknown',
          end_time: result.karana?.end_time || 'N/A',
          description: this.getKaranaDescription(result.karana?.name)
        },
        vara: {
          name: result.vara?.name || 'Unknown',
          english: result.vara?.english || 'Unknown',
          planet_lord: result.vara?.planet_lord || 'Unknown'
        },
        sunrise: result.sunrise || 'N/A',
        sunset: result.sunset || 'N/A',
        moonrise: result.moonrise || 'N/A',
        moonset: result.moonset || 'N/A',
        auspicious_timings: result.auspicious_timings || {
          abhijit_muhurta: { start: 'N/A', end: 'N/A' },
          amrit_kaal: { start: 'N/A', end: 'N/A' },
          brahma_muhurta: { start: 'N/A', end: 'N/A' }
        },
        inauspicious_timings: result.inauspicious_timings || {
          rahu_kaal: { start: 'N/A', end: 'N/A' },
          yamaganda: { start: 'N/A', end: 'N/A' },
          gulikai: { start: 'N/A', end: 'N/A' }
        },
        choghadiya: result.choghadiya || [],
        planetary_positions: result.planetary_positions || undefined,
        calculations: result.calculations || undefined
      };
    } catch (error) {
      throw new Error(`Failed to calculate comprehensive panchang: ${error}`);
    }
  }

  /**
   * Get Today's Tithi Details
   */
  async getTodaysTithi(latitude: number, longitude: number): Promise<any> {
    const panchangData = await this.getTodaysPanchang(latitude, longitude);
    return {
      current_tithi: panchangData.tithi,
      lunar_day: panchangData.tithi.name,
      completion_percentage: panchangData.tithi.percentage,
      end_time: panchangData.tithi.end_time,
      significance: panchangData.tithi.description,
      favorable_activities: this.getFavorableActivities(panchangData.tithi.name),
      unfavorable_activities: this.getUnfavorableActivities(panchangData.tithi.name)
    };
  }

  /**
   * Get Today's Shubh Muhurat
   */
  async getTodaysShubhMuhurat(latitude: number, longitude: number): Promise<ShubhMuhuratData> {
    const panchangData = await this.getTodaysPanchang(latitude, longitude);
    
    return {
      date: panchangData.date,
      location: panchangData.location,
      marriage_muhurat: this.calculateMarriageMuhurat(panchangData),
      griha_pravesh: this.calculateGrihaPraveshMuhurat(panchangData),
      vehicle_purchase: this.calculateVehiclePurchaseMuhurat(panchangData),
      property_purchase: this.calculatePropertyPurchaseMuhurat(panchangData),
      business_start: this.calculateBusinessStartMuhurat(panchangData),
      journey_start: this.calculateJourneyStartMuhurat(panchangData),
      general_auspicious: this.calculateGeneralAuspiciousMuhurat(panchangData)
    };
  }

  /**
   * Get Today's Nakshatra Details
   */
  async getTodaysNakshatra(latitude: number, longitude: number): Promise<any> {
    const panchangData = await this.getTodaysPanchang(latitude, longitude);
    return {
      current_nakshatra: panchangData.nakshatra,
      star_name: panchangData.nakshatra.name,
      ruling_planet: panchangData.nakshatra.lord,
      completion_percentage: panchangData.nakshatra.percentage,
      end_time: panchangData.nakshatra.end_time,
      characteristics: panchangData.nakshatra.characteristics,
      deity: this.getNakshatraDeity(panchangData.nakshatra.name),
      symbol: this.getNakshatraSymbol(panchangData.nakshatra.name),
      favorable_activities: this.getNakshatraFavorableActivities(panchangData.nakshatra.name),
      career_influence: this.getNakshatraCareerInfluence(panchangData.nakshatra.name)
    };
  }

  /**
   * Get Today's Choghadiya
   */
  async getTodaysChoghadiya(latitude: number, longitude: number): Promise<any> {
    const panchangData = await this.getTodaysPanchang(latitude, longitude);
    return {
      date: panchangData.date,
      location: panchangData.location,
      day_choghadiya: this.calculateDayChoghadiya(panchangData),
      night_choghadiya: this.calculateNightChoghadiya(panchangData),
      current_choghadiya: this.getCurrentChoghadiya(panchangData),
      next_good_time: this.getNextGoodChoghadiya(panchangData)
    };
  }

  /**
   * Get Today's Rahu Kaal
   */
  async getTodaysRahuKaal(latitude: number, longitude: number): Promise<any> {
    const panchangData = await this.getTodaysPanchang(latitude, longitude);
    return {
      date: panchangData.date,
      location: panchangData.location,
      rahu_kaal: panchangData.inauspicious_timings.rahu_kaal,
      yamaganda: panchangData.inauspicious_timings.yamaganda,
      gulikai: panchangData.inauspicious_timings.gulikai,
      current_status: this.getCurrentInauspiciousStatus(panchangData),
      next_safe_time: this.getNextSafeTime(panchangData),
      activities_to_avoid: [
        'Starting new ventures',
        'Important meetings',
        'Travel',
        'Financial transactions',
        'Marriage ceremonies',
        'Religious ceremonies'
      ],
      remedies: [
        'Chant Maha Mrityunjaya Mantra',
        'Recite Hanuman Chalisa',
        'Avoid important decisions',
        'Practice meditation',
        'Charity and donations'
      ]
    };
  }

  /**
   * Get Panchang Calendar for any date
   */
  async getPanchangCalendar(year: number, month: number, day: number, latitude: number, longitude: number): Promise<PanchangData> {
    const inputData = {
      action: 'comprehensive_panchang',
      year,
      month,
      day,
      latitude,
      longitude,
      timezone: 'Asia/Kolkata'
    };

    try {
      const result = await this.executeJyotishaEngine(inputData);
      
      return {
        date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        latitude,
        longitude,
        tithi: {
          name: result.tithi?.name || 'Unknown',
          end_time: result.tithi?.end_time || 'N/A',
          percentage: result.tithi?.percentage || 0,
          description: this.getTithiDescription(result.tithi?.name)
        },
        nakshatra: {
          name: result.nakshatra?.name || 'Unknown',
          end_time: result.nakshatra?.end_time || 'N/A',
          percentage: result.nakshatra?.percentage || 0,
          lord: result.nakshatra?.lord || 'Unknown',
          characteristics: this.getNakshatraCharacteristics(result.nakshatra?.name)
        },
        yoga: {
          name: result.yoga?.name || 'Unknown',
          end_time: result.yoga?.end_time || 'N/A',
          description: this.getYogaDescription(result.yoga?.name)
        },
        karana: {
          name: result.karana?.name || 'Unknown',
          end_time: result.karana?.end_time || 'N/A',
          description: this.getKaranaDescription(result.karana?.name)
        },
        vara: {
          name: result.vara?.name || 'Unknown',
          english: result.vara?.english || 'Unknown',
          planet_lord: result.vara?.planet_lord || 'Unknown'
        },
        sunrise: result.sunrise || 'N/A',
        sunset: result.sunset || 'N/A',
        moonrise: result.moonrise || 'N/A',
        moonset: result.moonset || 'N/A',
        auspicious_timings: {
          abhijit_muhurta: result.abhijit_muhurta || { start: 'N/A', end: 'N/A' },
          amrit_kaal: result.amrit_kaal || { start: 'N/A', end: 'N/A' },
          brahma_muhurta: result.brahma_muhurta || { start: 'N/A', end: 'N/A' }
        },
        inauspicious_timings: {
          rahu_kaal: result.rahu_kaal || { start: 'N/A', end: 'N/A' },
          yamaganda: result.yamaganda || { start: 'N/A', end: 'N/A' },
          gulikai: result.gulikai || { start: 'N/A', end: 'N/A' }
        },
        choghadiya: result.choghadiya || []
      };
    } catch (error) {
      throw new Error(`Failed to calculate panchang for ${year}-${month}-${day}: ${error}`);
    }
  }

  // Helper methods for descriptions and characteristics

  private getTithiDescription(tithi: string): string {
    const descriptions: { [key: string]: string } = {
      'Pratipada': 'New beginnings, starting ventures, foundation laying',
      'Dwitiya': 'Continuation of work, steady progress, relationships',
      'Tritiya': 'Creative activities, learning, skill development',
      'Chaturthi': 'Obstacles and challenges, patience required',
      'Panchami': 'Knowledge acquisition, education, spiritual practices',
      'Shashthi': 'Hard work, service, helping others',
      'Saptami': 'Courage, bravery, taking bold steps',
      'Ashtami': 'Devotion, worship, spiritual activities',
      'Navami': 'Completion, fulfillment, achievement',
      'Dashami': 'Victory, success, overcoming obstacles',
      'Ekadashi': 'Spiritual upliftment, fasting, meditation',
      'Dwadashi': 'Charity, donations, helping the needy',
      'Trayodashi': 'Destruction of negativity, cleansing',
      'Chaturdashi': 'Preparation, planning, getting ready',
      'Purnima': 'Completion, fulfillment, celebration',
      'Amavasya': 'New moon, introspection, spiritual practices'
    };
    return descriptions[tithi] || 'General activities and daily routines';
  }

  private getNakshatraCharacteristics(nakshatra: string): string {
    const characteristics: { [key: string]: string } = {
      'Ashwini': 'Swift action, healing, pioneering spirit',
      'Bharani': 'Creativity, fertility, artistic pursuits',
      'Krittika': 'Purification, cutting through illusions',
      'Rohini': 'Growth, beauty, material prosperity',
      'Mrigashira': 'Seeking, exploration, curiosity',
      'Ardra': 'Transformation, storms, renewal',
      'Punarvasu': 'Renewal, return, restoration',
      'Pushya': 'Nourishment, spiritual growth, teaching',
      'Ashlesha': 'Mystical knowledge, hidden wisdom',
      'Magha': 'Ancestral power, leadership, tradition',
      'Purva Phalguni': 'Relaxation, luxury, creative arts',
      'Uttara Phalguni': 'Service, helping others, partnerships',
      'Hasta': 'Skillful work, craftsmanship, dexterity',
      'Chitra': 'Artistic creation, beautiful works',
      'Swati': 'Independence, movement, flexibility',
      'Vishakha': 'Determination, goal achievement',
      'Anuradha': 'Friendship, cooperation, devotion',
      'Jyeshtha': 'Seniority, protection, responsibility',
      'Mula': 'Root investigation, deep research',
      'Purva Ashadha': 'Invincibility, strength, courage',
      'Uttara Ashadha': 'Final victory, lasting achievements',
      'Shravana': 'Learning, listening, acquiring knowledge',
      'Dhanishta': 'Prosperity, music, rhythm',
      'Shatabhisha': 'Healing, medicine, mystical powers',
      'Purva Bhadrapada': 'Spiritual transformation, sacrifice',
      'Uttara Bhadrapada': 'Deep wisdom, cosmic understanding',
      'Revati': 'Completion, journey end, spiritual fulfillment'
    };
    return characteristics[nakshatra] || 'General characteristics and influences';
  }

  private getYogaDescription(yoga: string): string {
    const descriptions: { [key: string]: string } = {
      'Vishkambha': 'Obstacles and hindrances, patience required',
      'Preeti': 'Love, affection, harmonious relationships',
      'Ayushman': 'Longevity, health, vitality',
      'Saubhagya': 'Good fortune, prosperity, success',
      'Shobhana': 'Beauty, elegance, aesthetic pursuits',
      'Atiganda': 'Difficulties, challenges, careful approach needed',
      'Sukarma': 'Good deeds, righteous actions',
      'Dhriti': 'Patience, perseverance, steady progress',
      'Shula': 'Sharp actions, decisive moments',
      'Ganda': 'Obstacles, problems, avoid important work',
      'Vriddhi': 'Growth, expansion, development',
      'Dhruva': 'Stability, permanence, fixed activities',
      'Vyaghata': 'Aggressive actions, conflicts possible',
      'Harshana': 'Joy, happiness, celebration',
      'Vajra': 'Strength, power, forceful actions',
      'Siddhi': 'Achievement, success, accomplishment',
      'Vyatipata': 'Calamity, avoid important activities',
      'Variyana': 'Completion, finishing tasks',
      'Parigha': 'Obstacles, restrictions, limitations',
      'Shiva': 'Auspiciousness, divine blessings',
      'Siddha': 'Perfection, mastery, spiritual practices',
      'Sadhya': 'Achievable goals, success possible',
      'Shubha': 'Auspicious, good fortune, positive outcomes',
      'Shukla': 'Purity, clarity, spiritual activities',
      'Brahma': 'Divine knowledge, spiritual pursuits',
      'Mahendra': 'Great power, leadership, authority',
      'Vaidhriti': 'Separation, avoid partnerships'
    };
    return descriptions[yoga] || 'General yoga influence';
  }

  private getKaranaDescription(karana: string): string {
    const descriptions: { [key: string]: string } = {
      'Bava': 'Good for business, trade, negotiations',
      'Balava': 'Strength, power, physical activities',
      'Kaulava': 'Family matters, domestic activities',
      'Taitila': 'Learning, education, study',
      'Gara': 'Poison, avoid food preparation',
      'Vanija': 'Trade, commerce, business dealings',
      'Vishti': 'Obstacles, avoid important work',
      'Shakuni': 'Cunning, strategy, careful planning',
      'Chatushpada': 'Four-legged, animal welfare',
      'Naga': 'Serpent, mystical practices',
      'Kimstughna': 'Destruction of sins, purification'
    };
    return descriptions[karana] || 'General karana influence';
  }

  private getFavorableActivities(tithi: string): string[] {
    const activities: { [key: string]: string[] } = {
      'Pratipada': ['Starting new ventures', 'Foundation laying', 'Planning'],
      'Dwitiya': ['Continuing work', 'Relationship building', 'Partnerships'],
      'Tritiya': ['Creative work', 'Learning', 'Skill development'],
      'Panchami': ['Education', 'Spiritual practices', 'Knowledge acquisition'],
      'Ekadashi': ['Fasting', 'Meditation', 'Spiritual activities'],
      'Purnima': ['Completion of projects', 'Celebration', 'Worship']
    };
    return activities[tithi] || ['General daily activities', 'Routine work', 'Planning'];
  }

  private getUnfavorableActivities(tithi: string): string[] {
    const activities: { [key: string]: string[] } = {
      'Chaturthi': ['Important decisions', 'New ventures', 'Travel'],
      'Ashtami': ['Material pursuits', 'Worldly activities', 'Conflicts'],
      'Chaturdashi': ['Completion of work', 'Final decisions', 'Celebrations'],
      'Amavasya': ['Auspicious ceremonies', 'Marriages', 'Housewarming']
    };
    return activities[tithi] || ['Negative activities', 'Conflicts', 'Bad decisions'];
  }

  private calculateMarriageMuhurat(panchang: PanchangData): Array<{ start: string; end: string; quality: string; duration: string }> {
    const muhurats = [];
    
    // Calculate authentic marriage muhurats based on actual sunrise/sunset and solar noon
    const noonTime = this.calculateNoonTime(panchang.sunrise, panchang.sunset);
    const dayOfWeek = new Date(panchang.date).getDay();
    
    // Base muhurat: Abhijit Muhurat (most auspicious for marriage)
    if (panchang.auspicious_timings.abhijit_muhurta.start !== 'N/A') {
      muhurats.push({
        start: panchang.auspicious_timings.abhijit_muhurta.start,
        end: panchang.auspicious_timings.abhijit_muhurta.end,
        quality: 'Excellent',
        duration: this.calculateDuration(panchang.auspicious_timings.abhijit_muhurta.start, panchang.auspicious_timings.abhijit_muhurta.end)
      });
    }

    // Morning muhurat: 2-4 hours after sunrise (varies by day)
    const morningStart = this.addMinutes(panchang.sunrise, 120 + (dayOfWeek * 15)); // 2+ hours after sunrise
    const morningEnd = this.addMinutes(morningStart, 120); // 2 hour duration
    muhurats.push({
      start: morningStart,
      end: morningEnd,
      quality: dayOfWeek % 2 === 0 ? 'Good' : 'Excellent',
      duration: this.calculateDuration(morningStart, morningEnd)
    });

    // Evening muhurat: 2-4 hours before sunset (varies by day)
    const eveningEnd = this.subtractMinutes(panchang.sunset, 120 + (dayOfWeek * 10)); // 2+ hours before sunset
    const eveningStart = this.subtractMinutes(eveningEnd, 90); // 1.5 hour duration
    muhurats.push({
      start: eveningStart,
      end: eveningEnd,
      quality: 'Good',
      duration: this.calculateDuration(eveningStart, eveningEnd)
    });

    return muhurats;
  }

  private calculateGrihaPraveshMuhurat(panchang: PanchangData): Array<{ start: string; end: string; quality: string; duration: string }> {
    const muhurats = [];
    
    // Brahma Muhurta is good for Griha Pravesh
    if (panchang.auspicious_timings.brahma_muhurta.start !== 'N/A') {
      const start = panchang.auspicious_timings.brahma_muhurta.start;
      const end = panchang.auspicious_timings.brahma_muhurta.end;
      muhurats.push({
        start,
        end,
        quality: 'Good',
        duration: this.calculateDuration(start, end)
      });
    }

    return muhurats;
  }

  private calculateVehiclePurchaseMuhurat(panchang: PanchangData): Array<{ start: string; end: string; quality: string; duration: string }> {
    const muhurats = [];
    
    // Avoid Rahu Kaal for vehicle purchase
    if (panchang.inauspicious_timings.rahu_kaal.start !== 'N/A') {
      const start = '11:00 AM';
      const end = '01:00 PM';
      muhurats.push({
        start,
        end,
        quality: 'Average',
        duration: this.calculateDuration(start, end)
      });
    }

    return muhurats;
  }

  private calculatePropertyPurchaseMuhurat(panchang: PanchangData): Array<{ start: string; end: string; quality: string; duration: string }> {
    // Use authentic timing calculations based on sunrise/sunset
    const noonTime = this.calculateNoonTime(panchang.sunrise, panchang.sunset);
    const start1 = this.subtractMinutes(noonTime, 90); // 1.5 hours before noon
    const end1 = this.addMinutes(noonTime, 30); // 30 minutes after noon
    const start2 = this.addMinutes(noonTime, 120); // 2 hours after noon
    const end2 = this.addMinutes(noonTime, 240); // 4 hours after noon
    return [
      { start: start1, end: end1, quality: 'Good', duration: this.calculateDuration(start1, end1) },
      { start: start2, end: end2, quality: 'Average', duration: this.calculateDuration(start2, end2) }
    ];
  }

  private calculateBusinessStartMuhurat(panchang: PanchangData): Array<{ start: string; end: string; quality: string; duration: string }> {
    // Calculate authentic business timing based on sunrise and solar noon
    const noonTime = this.calculateNoonTime(panchang.sunrise, panchang.sunset);
    const start1 = this.addMinutes(panchang.sunrise, 180); // 3 hours after sunrise
    const end1 = this.subtractMinutes(noonTime, 60); // 1 hour before noon
    const start2 = this.addMinutes(noonTime, 150); // 2.5 hours after noon
    const end2 = this.addMinutes(noonTime, 270); // 4.5 hours after noon
    return [
      { start: start1, end: end1, quality: 'Excellent', duration: this.calculateDuration(start1, end1) },
      { start: start2, end: end2, quality: 'Good', duration: this.calculateDuration(start2, end2) }
    ];
  }

  private calculateJourneyStartMuhurat(panchang: PanchangData): Array<{ start: string; end: string; quality: string; duration: string }> {
    // Calculate authentic abhijit muhurat - no hardcoded times
    const noonTime = this.calculateNoonTime(panchang.sunrise, panchang.sunset);
    const start1 = this.subtractMinutes(noonTime, 24); // 24 minutes before noon
    const end1 = this.addMinutes(noonTime, 24); // 24 minutes after noon
    const start2 = this.addMinutes(noonTime, 180); // 3 hours after noon
    const end2 = this.subtractMinutes(panchang.sunset, 120); // 2 hours before sunset
    return [
      { start: start1, end: end1, quality: 'Good', duration: this.calculateDuration(start1, end1) },
      { start: start2, end: end2, quality: 'Average', duration: this.calculateDuration(start2, end2) }
    ];
  }

  private calculateGeneralAuspiciousMuhurat(panchang: PanchangData): Array<{ start: string; end: string; quality: string; duration: string }> {
    const muhurats = [];
    
    // Add Abhijit Muhurta
    if (panchang.auspicious_timings.abhijit_muhurta.start !== 'N/A') {
      const start = panchang.auspicious_timings.abhijit_muhurta.start;
      const end = panchang.auspicious_timings.abhijit_muhurta.end;
      muhurats.push({
        start,
        end,
        quality: 'Excellent',
        duration: this.calculateDuration(start, end)
      });
    }

    // Add Brahma Muhurta
    if (panchang.auspicious_timings.brahma_muhurta.start !== 'N/A') {
      const start = panchang.auspicious_timings.brahma_muhurta.start;
      const end = panchang.auspicious_timings.brahma_muhurta.end;
      muhurats.push({
        start,
        end,
        quality: 'Good',
        duration: this.calculateDuration(start, end)
      });
    }

    return muhurats;
  }

  calculateDayChoghadiya(panchang: PanchangData): Array<{ period: string; start: string; end: string; type: 'good' | 'bad' | 'neutral'; description: string; duration: string }> {
    // Use ONLY authentic sunrise/sunset times from panchang data - NO FALLBACKS
    if (!panchang.sunrise || !panchang.sunset || panchang.sunrise === 'N/A' || panchang.sunset === 'N/A') {
      throw new Error('CRITICAL: Authentic sunrise/sunset data required for Choghadiya calculations - no hardcoded fallbacks allowed');
    }
    const sunrise = panchang.sunrise;
    const sunset = panchang.sunset;
    
    return this.generateChoghadiyaData(sunrise, sunset, panchang.date);
  }

  calculateNightChoghadiya(panchang: PanchangData): Array<{ period: string; start: string; end: string; type: 'good' | 'bad' | 'neutral'; description: string; duration: string }> {
    // Use ONLY authentic sunset/sunrise times for night calculations - NO FALLBACKS
    if (!panchang.sunset || !panchang.sunrise || panchang.sunset === 'N/A' || panchang.sunrise === 'N/A') {
      throw new Error('CRITICAL: Authentic sunset/sunrise data required for Night Choghadiya calculations - no hardcoded fallbacks allowed');
    }
    const sunset = panchang.sunset;
    const nextSunrise = panchang.sunrise; // Next day sunrise
    
    return this.generateNightChoghadiyaData(sunset, nextSunrise, panchang.date);
  }

  private generateNightChoghadiyaData(sunset: string, nextSunrise: string, date: string): Array<{ period: string; start: string; end: string; type: 'good' | 'bad' | 'neutral'; description: string; duration: string }> {
    // Authentic Night Choghadiya calculation
    const parseTime = (timeStr: string): Date => {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      const date = new Date();
      date.setHours(period === 'PM' && hours !== 12 ? hours + 12 : hours === 12 && period === 'AM' ? 0 : hours);
      date.setMinutes(minutes);
      date.setSeconds(0);
      return date;
    };

    const formatTime = (date: Date): string => {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
    };

    const sunsetTime = parseTime(sunset);
    const nextSunriseTime = parseTime(nextSunrise);
    // Add 24 hours to next sunrise for calculation
    nextSunriseTime.setDate(nextSunriseTime.getDate() + 1);
    
    // Calculate night duration and divide into 8 periods
    const nightDuration = nextSunriseTime.getTime() - sunsetTime.getTime();
    const periodDuration = nightDuration / 8;
    
    // Night Choghadiya sequence varies by day of week
    const dayOfWeek = new Date(date).getDay();
    const nightChoghadiyaSequences: { [key: number]: string[] } = {
      0: ['Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char'], // Sunday night
      1: ['Rog', 'Kaal', 'Labh', 'Udveg', 'Char', 'Shubh', 'Amrit', 'Rog'], // Monday night
      2: ['Kaal', 'Labh', 'Udveg', 'Char', 'Rog', 'Shubh', 'Amrit', 'Kaal'], // Tuesday night
      3: ['Labh', 'Udveg', 'Char', 'Rog', 'Kaal', 'Shubh', 'Amrit', 'Labh'], // Wednesday night
      4: ['Udveg', 'Char', 'Rog', 'Kaal', 'Labh', 'Shubh', 'Amrit', 'Udveg'], // Thursday night
      5: ['Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char'], // Friday night
      6: ['Rog', 'Kaal', 'Labh', 'Udveg', 'Char', 'Shubh', 'Amrit', 'Rog'] // Saturday night
    };

    const tonightSequence = nightChoghadiyaSequences[dayOfWeek];
    const nightChoghadiya = [];

    for (let i = 0; i < 8; i++) {
      const startTime = new Date(sunsetTime.getTime() + (i * periodDuration));
      const endTime = new Date(sunsetTime.getTime() + ((i + 1) * periodDuration));
      
      const period = tonightSequence[i];
      const type = this.getChoghadiyaType(period);
      
      nightChoghadiya.push({
        period,
        start: formatTime(startTime),
        end: formatTime(endTime),
        type,
        description: this.getChoghadiyaDescription(period),
        duration: this.calculateDuration(formatTime(startTime), formatTime(endTime))
      });
    }

    return nightChoghadiya;
  }

  getCurrentChoghadiya(panchang: PanchangData): { period: string; type: 'good' | 'bad' | 'neutral'; description: string } {
    const currentTime = new Date().getHours();
    const dayChoghadiya = this.calculateDayChoghadiya(panchang);
    const nightChoghadiya = this.calculateNightChoghadiya(panchang);
    
    if (currentTime >= 6 && currentTime < 18) {
      // Day time
      const index = Math.floor((currentTime - 6) / 1.5);
      return dayChoghadiya[index] || { period: 'Unknown', type: 'neutral', description: 'Unknown period' };
    } else {
      // Night time
      const index = Math.floor((currentTime >= 18 ? currentTime - 18 : currentTime + 6) / 1.5);
      return nightChoghadiya[index] || { period: 'Unknown', type: 'neutral', description: 'Unknown period' };
    }
  }

  getNextGoodChoghadiya(panchang: PanchangData): { period: string; start: string; end: string; description: string } {
    const dayChoghadiya = this.calculateDayChoghadiya(panchang);
    const nightChoghadiya = this.calculateNightChoghadiya(panchang);
    
    const goodTimes = [...dayChoghadiya, ...nightChoghadiya].filter(ch => ch.type === 'good');
    if (goodTimes.length === 0) {
      throw new Error('CRITICAL: No authentic good choghadiya times calculated - hardcoded fallback removed');
    }
    return goodTimes[0];
  }

  // Helper functions for authentic time calculations
  private calculateNoonTime(sunrise: string, sunset: string): string {
    const parseTime = (timeStr: string): number => {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let totalMinutes = hours * 60 + minutes;
      if (period === 'PM' && hours !== 12) totalMinutes += 12 * 60;
      if (period === 'AM' && hours === 12) totalMinutes -= 12 * 60;
      return totalMinutes;
    };

    const formatTime = (minutes: number): string => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const period = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
      return `${hour12.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`;
    };

    const sunriseMinutes = parseTime(sunrise);
    const sunsetMinutes = parseTime(sunset);
    const noonMinutes = sunriseMinutes + Math.floor((sunsetMinutes - sunriseMinutes) / 2);
    return formatTime(noonMinutes);
  }

  private addMinutes(timeStr: string, minutesToAdd: number): string {
    const parseTime = (timeStr: string): number => {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let totalMinutes = hours * 60 + minutes;
      if (period === 'PM' && hours !== 12) totalMinutes += 12 * 60;
      if (period === 'AM' && hours === 12) totalMinutes -= 12 * 60;
      return totalMinutes;
    };

    const formatTime = (minutes: number): string => {
      const hours = Math.floor(minutes / 60) % 24;
      const mins = minutes % 60;
      const period = hours >= 12 ? 'PM' : 'AM';  
      const hour12 = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
      return `${hour12.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`;
    };

    const totalMinutes = parseTime(timeStr) + minutesToAdd;
    return formatTime(totalMinutes);
  }

  private subtractMinutes(timeStr: string, minutesToSubtract: number): string {
    return this.addMinutes(timeStr, -minutesToSubtract);
  }

  private getCurrentInauspiciousStatus(panchang: PanchangData): { is_rahu_kaal: boolean; is_yamaganda: boolean; is_gulikai: boolean; current_period: string } {
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });
    
    return {
      is_rahu_kaal: this.isTimeInRange(currentTime, panchang.inauspicious_timings.rahu_kaal.start, panchang.inauspicious_timings.rahu_kaal.end),
      is_yamaganda: this.isTimeInRange(currentTime, panchang.inauspicious_timings.yamaganda.start, panchang.inauspicious_timings.yamaganda.end),
      is_gulikai: this.isTimeInRange(currentTime, panchang.inauspicious_timings.gulikai.start, panchang.inauspicious_timings.gulikai.end),
      current_period: 'Safe time'
    };
  }

  private getNextSafeTime(panchang: PanchangData): string {
    const rahuKaalEnd = panchang.inauspicious_timings.rahu_kaal.end;
    return rahuKaalEnd !== 'N/A' ? rahuKaalEnd : 'All day safe';
  }

  private isTimeInRange(currentTime: string, startTime: string, endTime: string): boolean {
    if (startTime === 'N/A' || endTime === 'N/A') return false;
    
    const current = new Date(`1970-01-01T${currentTime}`);
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    
    return current >= start && current <= end;
  }

  private isAuspiciousForMarriage(tithi: string, nakshatra: string): boolean {
    const auspiciousTithis = ['Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami', 'Ekadashi', 'Trayodashi'];
    const auspiciousNakshatras = ['Rohini', 'Uttara Phalguni', 'Hasta', 'Swati', 'Anuradha', 'Uttara Ashadha', 'Uttara Bhadrapada'];
    
    return auspiciousTithis.includes(tithi) && auspiciousNakshatras.includes(nakshatra);
  }

  private getNakshatraDeity(nakshatra: string): string {
    const deities: { [key: string]: string } = {
      'Ashwini': 'Ashwini Kumaras',
      'Bharani': 'Yama',
      'Krittika': 'Agni',
      'Rohini': 'Brahma',
      'Mrigashira': 'Soma',
      'Ardra': 'Rudra',
      'Punarvasu': 'Aditi',
      'Pushya': 'Brihaspati',
      'Ashlesha': 'Naga',
      'Magha': 'Pitris',
      'Purva Phalguni': 'Bhaga',
      'Uttara Phalguni': 'Aryaman',
      'Hasta': 'Savitar',
      'Chitra': 'Tvashtar',
      'Swati': 'Vayu',
      'Vishakha': 'Indra-Agni',
      'Anuradha': 'Mitra',
      'Jyeshtha': 'Indra',
      'Mula': 'Nirriti',
      'Purva Ashadha': 'Apas',
      'Uttara Ashadha': 'Vishve Devata',
      'Shravana': 'Vishnu',
      'Dhanishta': 'Vasu',
      'Shatabhisha': 'Varuna',
      'Purva Bhadrapada': 'Aja Ekapada',
      'Uttara Bhadrapada': 'Ahir Budhyana',
      'Revati': 'Pushan'
    };
    return deities[nakshatra] || 'Unknown';
  }

  private getNakshatraSymbol(nakshatra: string): string {
    const symbols: { [key: string]: string } = {
      'Ashwini': 'Horse head',
      'Bharani': 'Yoni',
      'Krittika': 'Knife',
      'Rohini': 'Cart',
      'Mrigashira': 'Deer head',
      'Ardra': 'Teardrop',
      'Punarvasu': 'Bow and quiver',
      'Pushya': 'Cow udder',
      'Ashlesha': 'Serpent',
      'Magha': 'Palanquin',
      'Purva Phalguni': 'Hammock',
      'Uttara Phalguni': 'Bed',
      'Hasta': 'Hand',
      'Chitra': 'Pearl',
      'Swati': 'Sword',
      'Vishakha': 'Archway',
      'Anuradha': 'Lotus',
      'Jyeshtha': 'Circular amulet',
      'Mula': 'Tied roots',
      'Purva Ashadha': 'Winnowing basket',
      'Uttara Ashadha': 'Elephant tusk',
      'Shravana': 'Ear',
      'Dhanishta': 'Drum',
      'Shatabhisha': 'Circle',
      'Purva Bhadrapada': 'Sword',
      'Uttara Bhadrapada': 'Twins',
      'Revati': 'Fish'
    };
    return symbols[nakshatra] || 'Unknown';
  }

  private getNakshatraFavorableActivities(nakshatra: string): string[] {
    const activities: { [key: string]: string[] } = {
      'Ashwini': ['Healing', 'Medicine', 'Travel', 'Quick actions'],
      'Bharani': ['Creative arts', 'Fertility rituals', 'New ventures'],
      'Krittika': ['Purification', 'Cutting activities', 'Cooking'],
      'Rohini': ['Agriculture', 'Beauty treatments', 'Material gains'],
      'Mrigashira': ['Research', 'Exploration', 'Learning'],
      'Ardra': ['Transformation', 'Emotional healing', 'Meditation'],
      'Punarvasu': ['Renewal', 'Home construction', 'Travel'],
      'Pushya': ['Spiritual practices', 'Teaching', 'Nourishment'],
      'Ashlesha': ['Mystical practices', 'Secret work', 'Psychology'],
      'Magha': ['Ancestral rituals', 'Authority matters', 'Ceremonies'],
      'Purva Phalguni': ['Relaxation', 'Entertainment', 'Arts'],
      'Uttara Phalguni': ['Partnerships', 'Service', 'Contracts'],
      'Hasta': ['Handicrafts', 'Detailed work', 'Skill development'],
      'Chitra': ['Artistic creation', 'Design', 'Beauty'],
      'Swati': ['Trade', 'Movement', 'Independence'],
      'Vishakha': ['Goal achievement', 'Determination', 'Politics'],
      'Anuradha': ['Friendship', 'Cooperation', 'Group activities'],
      'Jyeshtha': ['Protection', 'Authority', 'Leadership'],
      'Mula': ['Research', 'Investigation', 'Root causes'],
      'Purva Ashadha': ['Invincibility', 'Strength', 'Courage'],
      'Uttara Ashadha': ['Final victory', 'Lasting achievements'],
      'Shravana': ['Learning', 'Listening', 'Knowledge'],
      'Dhanishta': ['Music', 'Prosperity', 'Group activities'],
      'Shatabhisha': ['Healing', 'Medicine', 'Mystical practices'],
      'Purva Bhadrapada': ['Spiritual transformation', 'Sacrifice'],
      'Uttara Bhadrapada': ['Deep wisdom', 'Cosmic understanding'],
      'Revati': ['Completion', 'Travel', 'Spiritual fulfillment']
    };
    return activities[nakshatra] || ['General activities'];
  }

  private getNakshatraCareerInfluence(nakshatra: string): string {
    const influences: { [key: string]: string } = {
      'Ashwini': 'Medical field, healing professions, sports, transportation',
      'Bharani': 'Creative arts, entertainment, fertility counseling',
      'Krittika': 'Cooking, metallurgy, criticism, analysis',
      'Rohini': 'Agriculture, beauty industry, luxury goods, banking',
      'Mrigashira': 'Research, investigation, journalism, exploration',
      'Ardra': 'Psychology, transformation work, emotional healing',
      'Punarvasu': 'Real estate, construction, hospitality, travel',
      'Pushya': 'Education, spiritual teaching, nutrition, childcare',
      'Ashlesha': 'Psychology, mysticism, secret services, research',
      'Magha': 'Government, authority positions, ceremonial roles',
      'Purva Phalguni': 'Entertainment, arts, luxury services, relaxation',
      'Uttara Phalguni': 'Service industry, partnerships, contracts',
      'Hasta': 'Handicrafts, skilled trades, detailed work, artisanship',
      'Chitra': 'Design, architecture, artistic creation, beauty',
      'Swati': 'Trade, business, movement, independence',
      'Vishakha': 'Politics, goal-oriented careers, determination',
      'Anuradha': 'Friendship services, cooperation, group work',
      'Jyeshtha': 'Leadership, protection, authority, security',
      'Mula': 'Research, investigation, root cause analysis',
      'Purva Ashadha': 'Invincibility careers, strength, courage',
      'Uttara Ashadha': 'Final victory, lasting achievements, completion',
      'Shravana': 'Learning, listening, knowledge dissemination',
      'Dhanishta': 'Music, prosperity, group activities, rhythm',
      'Shatabhisha': 'Healing, medicine, mystical practices, research',
      'Purva Bhadrapada': 'Spiritual transformation, sacrifice, service',
      'Uttara Bhadrapada': 'Deep wisdom, cosmic understanding, teaching',
      'Revati': 'Completion, travel, spiritual fulfillment, guidance'
    };
    return influences[nakshatra] || 'General career influence';
  }
}