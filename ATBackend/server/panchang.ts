// Panchang calculations for authentic Vedic astrology data
// Includes Tithi, Yoga, Karan, Varna, Gana, Nadi calculations

interface PanchangData {
  tithi: string;
  tithiNumber: number;
  yoga: string;
  yogaNumber: number;
  karan: string;
  karanNumber: number;
  nakshatra: string;
  nakshatraLord: string;
  vara: string;
  sunrise: string;
  sunset: string;
}

interface NakshatraDetails {
  name: string;
  lord: string;
  gana: string;
  nadi: string;
  yoni: string;
  varna: string;
  tatva: string;
  pada1: string;
  pada2: string;
  pada3: string;
  pada4: string;
}

export class PanchangCalculator {
  private static readonly TITHIS = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
  ];

  private static readonly YOGAS = [
    'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
    'Atiganda', 'Sukarma', 'Dhriti', 'Shool', 'Ganda',
    'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
    'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
    'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
    'Indra', 'Vaidhriti'
  ];

  private static readonly KARANS = [
    'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara',
    'Vanija', 'Visti', 'Shakuni', 'Chatushpada', 'Naga', 'Kinstughna'
  ];

  private static readonly NAKSHATRA_DETAILS: { [key: string]: NakshatraDetails } = {
    'Ashwini': { name: 'Ashwini', lord: 'Ketu', gana: 'Deva', nadi: 'Vata', yoni: 'Ashwa', varna: 'Vaishya', tatva: 'Prithvi', pada1: 'Chu', pada2: 'Che', pada3: 'Cho', pada4: 'La' },
    'Bharani': { name: 'Bharani', lord: 'Venus', gana: 'Manushya', nadi: 'Pitta', yoni: 'Gaja', varna: 'Mleccha', tatva: 'Prithvi', pada1: 'Li', pada2: 'Lu', pada3: 'Le', pada4: 'Lo' },
    'Krittika': { name: 'Krittika', lord: 'Sun', gana: 'Rakshasa', nadi: 'Kapha', yoni: 'Mesha', varna: 'Brahmin', tatva: 'Agni', pada1: 'A', pada2: 'I', pada3: 'U', pada4: 'E' },
    'Rohini': { name: 'Rohini', lord: 'Moon', gana: 'Manushya', nadi: 'Kapha', yoni: 'Sarpa', varna: 'Shudra', tatva: 'Prithvi', pada1: 'O', pada2: 'Va', pada3: 'Vi', pada4: 'Vu' },
    'Mrigashira': { name: 'Mrigashira', lord: 'Mars', gana: 'Deva', nadi: 'Pitta', yoni: 'Sarpa', varna: 'Kshatriya', tatva: 'Prithvi', pada1: 'Ve', pada2: 'Vo', pada3: 'Ka', pada4: 'Ki' },
    'Ardra': { name: 'Ardra', lord: 'Rahu', gana: 'Manushya', nadi: 'Vata', yoni: 'Shwan', varna: 'Butcher', tatva: 'Jal', pada1: 'Ku', pada2: 'Gha', pada3: 'Nga', pada4: 'Chha' },
    'Punarvasu': { name: 'Punarvasu', lord: 'Jupiter', gana: 'Deva', nadi: 'Vata', yoni: 'Marjara', varna: 'Vaishya', tatva: 'Jal', pada1: 'Ke', pada2: 'Ko', pada3: 'Ha', pada4: 'Hi' },
    'Pushya': { name: 'Pushya', lord: 'Saturn', gana: 'Deva', nadi: 'Pitta', yoni: 'Mesha', varna: 'Kshatriya', tatva: 'Jal', pada1: 'Hu', pada2: 'He', pada3: 'Ho', pada4: 'Da' },
    'Ashlesha': { name: 'Ashlesha', lord: 'Mercury', gana: 'Rakshasa', nadi: 'Kapha', yoni: 'Marjara', varna: 'Mleccha', tatva: 'Jal', pada1: 'Di', pada2: 'Du', pada3: 'De', pada4: 'Do' },
    'Magha': { name: 'Magha', lord: 'Ketu', gana: 'Rakshasa', nadi: 'Kapha', yoni: 'Mushaka', varna: 'Shudra', tatva: 'Jal', pada1: 'Ma', pada2: 'Mi', pada3: 'Mu', pada4: 'Me' },
    'Purva Phalguni': { name: 'Purva Phalguni', lord: 'Venus', gana: 'Manushya', nadi: 'Pitta', yoni: 'Mushaka', varna: 'Brahmin', tatva: 'Jal', pada1: 'Mo', pada2: 'Ta', pada3: 'Ti', pada4: 'Tu' },
    'Uttara Phalguni': { name: 'Uttara Phalguni', lord: 'Sun', gana: 'Manushya', nadi: 'Vata', yoni: 'Gau', varna: 'Kshatriya', tatva: 'Agni', pada1: 'Te', pada2: 'To', pada3: 'Pa', pada4: 'Pi' },
    'Hasta': { name: 'Hasta', lord: 'Moon', gana: 'Deva', nadi: 'Vata', yoni: 'Mahisha', varna: 'Vaishya', tatva: 'Agni', pada1: 'Pu', pada2: 'Sha', pada3: 'Na', pada4: 'Tha' },
    'Chitra': { name: 'Chitra', lord: 'Mars', gana: 'Rakshasa', nadi: 'Pitta', yoni: 'Vyaghra', varna: 'Mleccha', tatva: 'Agni', pada1: 'Pe', pada2: 'Po', pada3: 'Ra', pada4: 'Ri' },
    'Swati': { name: 'Swati', lord: 'Rahu', gana: 'Deva', nadi: 'Kapha', yoni: 'Mahisha', varna: 'Butcher', tatva: 'Agni', pada1: 'Ru', pada2: 'Re', pada3: 'Ro', pada4: 'Ta' },
    'Vishakha': { name: 'Vishakha', lord: 'Jupiter', gana: 'Rakshasa', nadi: 'Kapha', yoni: 'Vyaghra', varna: 'Mleccha', tatva: 'Agni', pada1: 'Ti', pada2: 'Tu', pada3: 'Te', pada4: 'To' },
    'Anuradha': { name: 'Anuradha', lord: 'Saturn', gana: 'Deva', nadi: 'Pitta', yoni: 'Harina', varna: 'Shudra', tatva: 'Agni', pada1: 'Na', pada2: 'Ni', pada3: 'Nu', pada4: 'Ne' },
    'Jyeshtha': { name: 'Jyeshtha', lord: 'Mercury', gana: 'Rakshasa', nadi: 'Vata', yoni: 'Harina', varna: 'Kshatriya', tatva: 'Vayu', pada1: 'No', pada2: 'Ya', pada3: 'Yi', pada4: 'Yu' },
    'Mula': { name: 'Mula', lord: 'Ketu', gana: 'Rakshasa', nadi: 'Vata', yoni: 'Shwan', varna: 'Butcher', tatva: 'Vayu', pada1: 'Ye', pada2: 'Yo', pada3: 'Bha', pada4: 'Bhi' },
    'Purva Ashadha': { name: 'Purva Ashadha', lord: 'Venus', gana: 'Manushya', nadi: 'Pitta', yoni: 'Markara', varna: 'Brahmin', tatva: 'Vayu', pada1: 'Bhu', pada2: 'Dha', pada3: 'Pha', pada4: 'Dha' },
    'Uttara Ashadha': { name: 'Uttara Ashadha', lord: 'Sun', gana: 'Manushya', nadi: 'Kapha', yoni: 'Nakula', varna: 'Kshatriya', tatva: 'Vayu', pada1: 'Bhe', pada2: 'Bho', pada3: 'Ja', pada4: 'Ji' },
    'Shravana': { name: 'Shravana', lord: 'Moon', gana: 'Deva', nadi: 'Kapha', yoni: 'Markara', varna: 'Mleccha', tatva: 'Vayu', pada1: 'Ju', pada2: 'Je', pada3: 'Jo', pada4: 'Gha' },
    'Dhanishtha': { name: 'Dhanishtha', lord: 'Mars', gana: 'Rakshasa', nadi: 'Pitta', yoni: 'Simha', varna: 'Vaishya', tatva: 'Akasha', pada1: 'Ga', pada2: 'Gi', pada3: 'Gu', pada4: 'Ge' },
    'Shatabhisha': { name: 'Shatabhisha', lord: 'Rahu', gana: 'Rakshasa', nadi: 'Vata', yoni: 'Ashwa', varna: 'Butcher', tatva: 'Akasha', pada1: 'Go', pada2: 'Sa', pada3: 'Si', pada4: 'Su' },
    'Purva Bhadrapada': { name: 'Purva Bhadrapada', lord: 'Jupiter', gana: 'Manushya', nadi: 'Vata', yoni: 'Simha', varna: 'Brahmin', tatva: 'Akasha', pada1: 'Se', pada2: 'So', pada3: 'Da', pada4: 'Di' },
    'Uttara Bhadrapada': { name: 'Uttara Bhadrapada', lord: 'Saturn', gana: 'Manushya', nadi: 'Pitta', yoni: 'Gau', varna: 'Kshatriya', tatva: 'Akasha', pada1: 'Du', pada2: 'Tha', pada3: 'Jha', pada4: 'Na' },
    'Revati': { name: 'Revati', lord: 'Mercury', gana: 'Deva', nadi: 'Kapha', yoni: 'Gaja', varna: 'Shudra', tatva: 'Akasha', pada1: 'De', pada2: 'Do', pada3: 'Cha', pada4: 'Chi' }
  };

  private static readonly NAKSHATRA_LORDS = [
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter',
    'Saturn', 'Mercury', 'Ketu', 'Venus', 'Sun', 'Moon', 'Mars',
    'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus',
    'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'
  ];

  static calculatePanchang(
    julianDay: number,
    sunLongitude: number,
    moonLongitude: number,
    latitude: number,
    longitude: number
  ): PanchangData {
    // Calculate Tithi (lunar day)
    const tithiAngle = (moonLongitude - sunLongitude + 360) % 360;
    const tithiNumber = Math.floor(tithiAngle / 12) + 1;
    const tithi = this.TITHIS[Math.min(tithiNumber - 1, 14)];

    // Calculate Yoga
    const yogaAngle = (sunLongitude + moonLongitude) % 360;
    const yogaNumber = Math.floor(yogaAngle / 13.333333) + 1;
    const yoga = this.YOGAS[Math.min(yogaNumber - 1, 26)];

    // Calculate Karan
    const karanNumber = Math.floor(tithiAngle / 6) + 1;
    const karan = this.KARANS[Math.min(karanNumber - 1, 10)];

    // Calculate Nakshatra
    const nakshatraNumber = Math.floor(moonLongitude / 13.333333);
    const nakshatraNames = Object.keys(this.NAKSHATRA_DETAILS);
    const nakshatra = nakshatraNames[Math.min(nakshatraNumber, 26)] || 'Ashwini';
    const nakshatraLord = this.NAKSHATRA_LORDS[nakshatraNumber % 27];

    // Calculate day of week (Vara)
    const dayOfWeek = Math.floor(julianDay + 1.5) % 7;
    const varas = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const vara = varas[dayOfWeek];

    // Calculate sunrise/sunset (simplified)
    const sunrise = this.calculateSunrise(julianDay, latitude, longitude);
    const sunset = this.calculateSunset(julianDay, latitude, longitude);

    return {
      tithi,
      tithiNumber,
      yoga,
      yogaNumber,
      karan,
      karanNumber,
      nakshatra,
      nakshatraLord,
      vara,
      sunrise,
      sunset
    };
  }

  static getNakshatraDetails(nakshatraName: string): NakshatraDetails | null {
    return this.NAKSHATRA_DETAILS[nakshatraName] || null;
  }

  static calculateVarna(nakshatraName: string): string {
    const details = this.getNakshatraDetails(nakshatraName);
    return details?.varna || 'Unknown';
  }

  static calculateTatva(nakshatraName: string): string {
    const details = this.getNakshatraDetails(nakshatraName);
    return details?.tatva || 'Unknown';
  }

  static calculateGana(nakshatraName: string): string {
    const details = this.getNakshatraDetails(nakshatraName);
    return details?.gana || 'Unknown';
  }

  static calculateNadi(nakshatraName: string): string {
    const details = this.getNakshatraDetails(nakshatraName);
    return details?.nadi || 'Unknown';
  }

  static calculateYoni(nakshatraName: string): string {
    const details = this.getNakshatraDetails(nakshatraName);
    return details?.yoni || 'Unknown';
  }

  static calculateNameAlphabet(nakshatraName: string, pada: number): string {
    const details = this.getNakshatraDetails(nakshatraName);
    if (!details) return 'Unknown';
    
    const padaKey = `pada${pada}` as keyof NakshatraDetails;
    return details[padaKey] as string || 'Unknown';
  }

  private static calculateSunrise(julianDay: number, latitude: number, longitude: number): string {
    // Simplified sunrise calculation
    const hours = 6 + (longitude / 15) + Math.sin(latitude * Math.PI / 180) * 0.5;
    const hour = Math.floor(hours);
    const minute = Math.floor((hours - hour) * 60);
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  private static calculateSunset(julianDay: number, latitude: number, longitude: number): string {
    // Simplified sunset calculation
    const hours = 18 + (longitude / 15) + Math.sin(latitude * Math.PI / 180) * 0.5;
    const hour = Math.floor(hours);
    const minute = Math.floor((hours - hour) * 60);
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  static calculatePaya(moonNakshatra: string): string {
    // Simplified Paya calculation based on Moon's nakshatra
    const payaMapping: { [key: string]: string } = {
      'Ashwini': 'Iron', 'Bharani': 'Silver', 'Krittika': 'Gold',
      'Rohini': 'Iron', 'Mrigashira': 'Silver', 'Ardra': 'Gold',
      'Punarvasu': 'Iron', 'Pushya': 'Silver'
    };
    
    return payaMapping[moonNakshatra] || 'Iron';
  }

  static calculateVaahya(birthWeekday: string): string {
    // Traditional Vaahya calculation based on birth day
    const vaahyaMapping: { [key: string]: string } = {
      'Sunday': 'Elephant', 'Monday': 'Lion', 'Tuesday': 'Dog',
      'Wednesday': 'Donkey', 'Thursday': 'Goat', 'Friday': 'Horse',
      'Saturday': 'Buffalo'
    };
    
    return vaahyaMapping[birthWeekday] || 'Unknown';
  }
}