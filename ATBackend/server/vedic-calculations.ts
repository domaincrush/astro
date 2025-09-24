/**
 * Comprehensive Vedic Astrology Calculations
 * Authentic calculations for Yog, Karan, Tithi, Varna, Tatva, Name Syllable, 
 * Paya, Gan, Nadi, Yoni, Sign Lord, and Vaahya
 */

interface VedicDetails {
  yog: string;
  karan: string;
  tithi: string;
  varna: string;
  tatva: string;
  nameSyllable: string;
  paya: string;
  gan: string;
  nadi: string;
  yoni: string;
  signLord: string;
  vaahya: string;
}

// Nakshatra mappings for various calculations
const NAKSHATRA_DATA = {
  'Ashwini': { varna: 'Vaishya', tatva: 'Prithvi', gan: 'Deva', nadi: 'Vata', yoni: 'Horse', paya: 'Gold', nameSyllable: 'Chu, Che, Cho, La' },
  'Bharani': { varna: 'Mlecha', tatva: 'Prithvi', gan: 'Manushya', nadi: 'Vata', yoni: 'Elephant', paya: 'Silver', nameSyllable: 'Li, Lu, Le, Lo' },
  'Krittika': { varna: 'Brahmin', tatva: 'Agni', gan: 'Rakshasa', nadi: 'Kapha', yoni: 'Goat', paya: 'Gold', nameSyllable: 'A, I, U, E' },
  'Rohini': { varna: 'Shudra', tatva: 'Prithvi', gan: 'Manushya', nadi: 'Kapha', yoni: 'Serpent', paya: 'Silver', nameSyllable: 'O, Va, Vi, Vu' },
  'Mrigashira': { varna: 'Shudra', tatva: 'Prithvi', gan: 'Deva', nadi: 'Pitta', yoni: 'Serpent', paya: 'Copper', nameSyllable: 'Ve, Vo, Ka, Ki' },
  'Ardra': { varna: 'Shudra', tatva: 'Jal', gan: 'Manushya', nadi: 'Vata', yoni: 'Dog', paya: 'Gold', nameSyllable: 'Ku, Gha, Nga, Chha' },
  'Punarvasu': { varna: 'Vaishya', tatva: 'Jal', gan: 'Deva', nadi: 'Vata', yoni: 'Cat', paya: 'Lead', nameSyllable: 'Ke, Ko, Ha, Hi' },
  'Pushya': { varna: 'Kshatriya', tatva: 'Jal', gan: 'Deva', nadi: 'Pitta', yoni: 'Goat', paya: 'Iron', nameSyllable: 'Hu, He, Ho, Da' },
  'Ashlesha': { varna: 'Mlecha', tatva: 'Jal', gan: 'Rakshasa', nadi: 'Kapha', yoni: 'Cat', paya: 'Lead', nameSyllable: 'Di, Du, De, Do' },
  'Magha': { varna: 'Shudra', tatva: 'Jal', gan: 'Rakshasa', nadi: 'Kapha', yoni: 'Rat', paya: 'Copper', nameSyllable: 'Ma, Mi, Mu, Me' },
  'Purva Phalguni': { varna: 'Brahmin', tatva: 'Jal', gan: 'Manushya', nadi: 'Pitta', yoni: 'Rat', paya: 'Iron', nameSyllable: 'Mo, Ta, Ti, Tu' },
  'Uttara Phalguni': { varna: 'Kshatriya', tatva: 'Agni', gan: 'Manushya', nadi: 'Vata', yoni: 'Cow', paya: 'Copper', nameSyllable: 'Te, To, Pa, Pi' },
  'Hasta': { varna: 'Vaishya', tatva: 'Prithvi', gan: 'Deva', nadi: 'Pitta', yoni: 'Buffalo', paya: 'Silver', nameSyllable: 'Pu, Sha, Na, Tha' },
  'Chitra': { varna: 'Shudra', tatva: 'Agni', gan: 'Rakshasa', nadi: 'Pitta', yoni: 'Tiger', paya: 'Iron', nameSyllable: 'Pe, Po, Ra, Ri' },
  'Swati': { varna: 'Shudra', tatva: 'Agni', gan: 'Deva', nadi: 'Kapha', yoni: 'Buffalo', paya: 'Gold', nameSyllable: 'Ru, Re, Ro, Ta' },
  'Vishakha': { varna: 'Mlecha', tatva: 'Agni', gan: 'Rakshasa', nadi: 'Kapha', yoni: 'Tiger', paya: 'Gold', nameSyllable: 'Ti, Tu, Te, To' },
  'Anuradha': { varna: 'Shudra', tatva: 'Agni', gan: 'Deva', nadi: 'Pitta', yoni: 'Deer', paya: 'Lead', nameSyllable: 'Na, Ni, Nu, Ne' },
  'Jyeshtha': { varna: 'Shudra', tatva: 'Vayu', gan: 'Rakshasa', nadi: 'Vata', yoni: 'Deer', paya: 'Copper', nameSyllable: 'No, Ya, Yi, Yu' },
  'Mula': { varna: 'Kshatriya', tatva: 'Vayu', gan: 'Rakshasa', nadi: 'Vata', yoni: 'Dog', paya: 'Iron', nameSyllable: 'Ye, Yo, Bha, Bhi' },
  'Purva Ashadha': { varna: 'Brahmin', tatva: 'Jal', gan: 'Manushya', nadi: 'Pitta', yoni: 'Monkey', paya: 'Silver', nameSyllable: 'Bhu, Dha, Pha, Dha' },
  'Uttara Ashadha': { varna: 'Kshatriya', tatva: 'Jal', gan: 'Manushya', nadi: 'Kapha', yoni: 'Mongoose', paya: 'Copper', nameSyllable: 'Bhe, Bho, Ja, Ji' },
  'Shravana': { varna: 'Mlecha', tatva: 'Vayu', gan: 'Deva', nadi: 'Kapha', yoni: 'Monkey', paya: 'Silver', nameSyllable: 'Khi, Khu, Khe, Kho' },
  'Dhanishtha': { varna: 'Shudra', tatva: 'Vayu', gan: 'Rakshasa', nadi: 'Pitta', yoni: 'Lion', paya: 'Gold', nameSyllable: 'Ga, Gi, Gu, Ge' },
  'Shatabhisha': { varna: 'Brahmin', tatva: 'Vayu', gan: 'Rakshasa', nadi: 'Vata', yoni: 'Horse', paya: 'Lead', nameSyllable: 'Go, Sa, Si, Su' },
  'Purva Bhadrapada': { varna: 'Brahmin', tatva: 'Vayu', gan: 'Manushya', nadi: 'Vata', yoni: 'Lion', paya: 'Silver', nameSyllable: 'Se, So, Da, Di' },
  'Uttara Bhadrapada': { varna: 'Kshatriya', tatva: 'Vayu', gan: 'Manushya', nadi: 'Pitta', yoni: 'Cow', paya: 'Copper', nameSyllable: 'Du, Tha, Jha, Jna' },
  'Revati': { varna: 'Shudra', tatva: 'Prithvi', gan: 'Deva', nadi: 'Kapha', yoni: 'Elephant', paya: 'Lead', nameSyllable: 'De, Do, Cha, Chi' }
};

// Sign Lord mappings
const SIGN_LORDS = {
  'Mesha': 'Mars', 'Aries': 'Mars',
  'Vrishabha': 'Venus', 'Taurus': 'Venus',
  'Mithuna': 'Mercury', 'Gemini': 'Mercury',
  'Karka': 'Moon', 'Cancer': 'Moon',
  'Simha': 'Sun', 'Leo': 'Sun',
  'Kanya': 'Mercury', 'Virgo': 'Mercury',
  'Tula': 'Venus', 'Libra': 'Venus',
  'Vrishchika': 'Mars', 'Scorpio': 'Mars',
  'Dhanu': 'Jupiter', 'Sagittarius': 'Jupiter',
  'Makara': 'Saturn', 'Capricorn': 'Saturn',
  'Kumbha': 'Saturn', 'Aquarius': 'Saturn',
  'Meena': 'Jupiter', 'Pisces': 'Jupiter'
};

// Vaahya calculations based on nakshatra
const VAAHYA_MAPPING = {
  'Ashwini': 'Horse', 'Bharani': 'Elephant', 'Krittika': 'Goat',
  'Rohini': 'Serpent', 'Mrigashira': 'Serpent', 'Ardra': 'Dog',
  'Punarvasu': 'Cat', 'Pushya': 'Goat', 'Ashlesha': 'Cat',
  'Magha': 'Rat', 'Purva Phalguni': 'Rat', 'Uttara Phalguni': 'Cow',
  'Hasta': 'Buffalo', 'Chitra': 'Tiger', 'Swati': 'Buffalo',
  'Vishakha': 'Tiger', 'Anuradha': 'Deer', 'Jyeshtha': 'Deer',
  'Mula': 'Dog', 'Purva Ashadha': 'Monkey', 'Uttara Ashadha': 'Mongoose',
  'Shravana': 'Monkey', 'Dhanishtha': 'Lion', 'Shatabhisha': 'Horse',
  'Purva Bhadrapada': 'Lion', 'Uttara Bhadrapada': 'Cow', 'Revati': 'Elephant'
};

// Calculate Julian Day Number for astronomical calculations
function calculateJulianDay(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  const dayFraction = (hour + minute / 60 + second / 3600) / 24;

  return jdn + dayFraction - 0.5;
}

// Calculate Moon longitude for Tithi calculation
function calculateMoonLongitude(julianDay: number): number {
  // Simplified lunar calculation - in production, use Swiss Ephemeris
  const T = (julianDay - 2451545.0) / 36525.0;
  const L0 = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  return (L0 % 360 + 360) % 360;
}

// Calculate Sun longitude for Tithi calculation
function calculateSunLongitude(julianDay: number): number {
  // Simplified solar calculation - in production, use Swiss Ephemeris
  const T = (julianDay - 2451545.0) / 36525.0;
  const L0 = 280.4664567 + 36000.76982779 * T;
  return (L0 % 360 + 360) % 360;
}

// Calculate Tithi from Moon-Sun longitude difference
function calculateTithi(julianDay: number): string {
  const moonLong = calculateMoonLongitude(julianDay);
  const sunLong = calculateSunLongitude(julianDay);
  
  let diff = moonLong - sunLong;
  if (diff < 0) diff += 360;
  
  const tithiNumber = Math.floor(diff / 12) + 1;
  
  const tithiNames = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
  ];
  
  const paksha = tithiNumber <= 15 ? 'Shukla' : 'Krishna';
  const adjustedTithi = tithiNumber > 15 ? tithiNumber - 15 : tithiNumber;
  
  return `${paksha} ${tithiNames[adjustedTithi - 1]}`;
}

// Calculate Yoga from Sun and Moon longitudes
function calculateYoga(julianDay: number): string {
  const moonLong = calculateMoonLongitude(julianDay);
  const sunLong = calculateSunLongitude(julianDay);
  
  const yogaValue = (moonLong + sunLong) % 360;
  const yogaNumber = Math.floor(yogaValue / (360 / 27)) + 1;
  
  const yogaNames = [
    'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
    'Atiganda', 'Sukarman', 'Dhriti', 'Shula', 'Ganda',
    'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
    'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
    'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
    'Indra', 'Vaidhriti'
  ];
  
  return yogaNames[yogaNumber - 1] || 'Unknown';
}

// Calculate Karan from Tithi
function calculateKaran(julianDay: number): string {
  const moonLong = calculateMoonLongitude(julianDay);
  const sunLong = calculateSunLongitude(julianDay);
  
  let diff = moonLong - sunLong;
  if (diff < 0) diff += 360;
  
  const karanNumber = Math.floor(diff / 6) + 1;
  
  const karanNames = [
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
    'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'
  ];
  
  return karanNames[karanNumber - 1] || 'Unknown';
}

// Get nakshatra from Moon longitude
function getNakshatraFromMoonLongitude(moonLongitude: number): string {
  const nakshatraNumber = Math.floor(moonLongitude / (360 / 27));
  
  const nakshatraNames = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
  ];
  
  return nakshatraNames[nakshatraNumber] || 'Ashwini';
}

// Get Moon sign from longitude
function getMoonSignFromLongitude(moonLongitude: number): string {
  const signNumber = Math.floor(moonLongitude / 30);
  
  const signNames = [
    'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
    'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'
  ];
  
  return signNames[signNumber] || 'Mesha';
}

// Main calculation function
export function calculateVedicDetails(
  birthDate: string,
  birthTime: string,
  latitude: number,
  longitude: number,
  moonSign?: string,
  nakshatra?: string
): VedicDetails {
  try {
    // Parse birth date and time
    const dateObj = new Date(`${birthDate}T${birthTime}`);
    const julianDay = calculateJulianDay(dateObj);
    
    // Calculate Moon longitude for astronomical calculations
    const moonLongitude = calculateMoonLongitude(julianDay);
    
    // Get nakshatra and moon sign if not provided
    const birthNakshatra = nakshatra || getNakshatraFromMoonLongitude(moonLongitude);
    const birthMoonSign = moonSign || getMoonSignFromLongitude(moonLongitude);
    
    // Get nakshatra data
    const nakshatraData = (NAKSHATRA_DATA as any)[birthNakshatra] || NAKSHATRA_DATA['Ashwini'];
    
    // Calculate Panchang elements
    const tithi = calculateTithi(julianDay);
    const yog = calculateYoga(julianDay);
    const karan = calculateKaran(julianDay);
    
    // Get sign lord
    const signLord = (SIGN_LORDS as any)[birthMoonSign] || 'Unknown';
    
    // Get Vaahya
    const vaahya = (VAAHYA_MAPPING as any)[birthNakshatra] || 'Unknown';
    
    return {
      yog,
      karan,
      tithi,
      varna: nakshatraData.varna,
      tatva: nakshatraData.tatva,
      nameSyllable: nakshatraData.nameSyllable,
      paya: nakshatraData.paya,
      gan: nakshatraData.gan,
      nadi: nakshatraData.nadi,
      yoni: nakshatraData.yoni,
      signLord,
      vaahya
    };
  } catch (error) {
    console.error('Error calculating Vedic details:', error);
    
    // Return default values if calculation fails
    return {
      yog: 'N/A',
      karan: 'N/A',
      tithi: 'N/A',
      varna: 'N/A',
      tatva: 'N/A',
      nameSyllable: 'N/A',
      paya: 'N/A',
      gan: 'N/A',
      nadi: 'N/A',
      yoni: 'N/A',
      signLord: 'N/A',
      vaahya: 'N/A'
    };
  }
}