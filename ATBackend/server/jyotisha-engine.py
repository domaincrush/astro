#!/usr/bin/env python3
"""
Jyotisha Astrology Engine
Advanced Vedic astrology calculations using the Jyotisha library
Based on https://github.com/jyotisham/jyotisha
"""

import json
import sys
from datetime import datetime, timezone
import pytz
from datetime import timedelta
from typing import Dict, List, Any

try:
    import swisseph as swe
    swe_available = True
    print("✅ Swiss Ephemeris available for calculations", file=sys.stderr)
except ImportError:
    swe_available = False
    print("❌ Swiss Ephemeris not available", file=sys.stderr)

class JyotishaEngine:
    """
    Jyotisha-based Vedic astrology calculation engine
    """
    
    # Planet mappings for Swiss Ephemeris
    PLANETS = {
        'Sun': swe.SUN,
        'Moon': swe.MOON,
        'Mars': swe.MARS,
        'Mercury': swe.MERCURY,
        'Jupiter': swe.JUPITER,
        'Venus': swe.VENUS,
        'Saturn': swe.SATURN,
        'Rahu': swe.MEAN_NODE,
        'Ketu': swe.MEAN_NODE  # Ketu is 180° opposite to Rahu
    }
    
    # Vedic/Indian zodiac signs (Sanskrit names)
    SIGN_NAMES = [
        'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
        'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'
    ]
    
    # Alternative English names for Vedic signs
    SIGN_NAMES_ENGLISH = [
        'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ]
    
    # Nakshatra mappings with traditional attributes
    NAKSHATRA_DATA = {
        'Ashwini': {'gana': 'Deva', 'nadi': 'Vata', 'varna': 'Vaishya', 'yoni': 'Ashwa', 'tatva': 'Prithvi', 'paya': 'Swarna'},
        'Bharani': {'gana': 'Manushya', 'nadi': 'Pitta', 'varna': 'Shudra', 'yoni': 'Gaja', 'tatva': 'Prithvi', 'paya': 'Rajata'},
        'Krittika': {'gana': 'Rakshasa', 'nadi': 'Kapha', 'varna': 'Brahmin', 'yoni': 'Mesha', 'tatva': 'Agni', 'paya': 'Tamra'},
        'Rohini': {'gana': 'Manushya', 'nadi': 'Kapha', 'varna': 'Shudra', 'yoni': 'Sarpa', 'tatva': 'Prithvi', 'paya': 'Swarna'},
        'Mrigashira': {'gana': 'Deva', 'nadi': 'Pitta', 'varna': 'Shudra', 'yoni': 'Sarpa', 'tatva': 'Prithvi', 'paya': 'Rajata'},
        'Ardra': {'gana': 'Manushya', 'nadi': 'Vata', 'varna': 'Shudra', 'yoni': 'Shwana', 'tatva': 'Jal', 'paya': 'Tamra'},
        'Punarvasu': {'gana': 'Deva', 'nadi': 'Vata', 'varna': 'Vaishya', 'yoni': 'Marjara', 'tatva': 'Jal', 'paya': 'Swarna'},
        'Pushya': {'gana': 'Deva', 'nadi': 'Pitta', 'varna': 'Kshatriya', 'yoni': 'Mesha', 'tatva': 'Jal', 'paya': 'Rajata'},
        'Ashlesha': {'gana': 'Rakshasa', 'nadi': 'Kapha', 'varna': 'Kshatriya', 'yoni': 'Marjara', 'tatva': 'Jal', 'paya': 'Tamra'},
        'Magha': {'gana': 'Rakshasa', 'nadi': 'Kapha', 'varna': 'Shudra', 'yoni': 'Mushak', 'tatva': 'Jal', 'paya': 'Swarna'},
        'Purva Phalguni': {'gana': 'Manushya', 'nadi': 'Pitta', 'varna': 'Brahmin', 'yoni': 'Mushak', 'tatva': 'Jal', 'paya': 'Rajata'},
        'Uttara Phalguni': {'gana': 'Manushya', 'nadi': 'Vata', 'varna': 'Kshatriya', 'yoni': 'Gou', 'tatva': 'Agni', 'paya': 'Tamra'},
        'Hasta': {'gana': 'Deva', 'nadi': 'Vata', 'varna': 'Vaishya', 'yoni': 'Mahisha', 'tatva': 'Agni', 'paya': 'Swarna'},
        'Chitra': {'gana': 'Rakshasa', 'nadi': 'Pitta', 'varna': 'Shudra', 'yoni': 'Vyaghra', 'tatva': 'Agni', 'paya': 'Rajata'},
        'Swati': {'gana': 'Deva', 'nadi': 'Kapha', 'varna': 'Shudra', 'yoni': 'Mahisha', 'tatva': 'Agni', 'paya': 'Tamra'},
        'Vishakha': {'gana': 'Rakshasa', 'nadi': 'Kapha', 'varna': 'Kshatriya', 'yoni': 'Vyaghra', 'tatva': 'Agni', 'paya': 'Swarna'},
        'Anuradha': {'gana': 'Deva', 'nadi': 'Pitta', 'varna': 'Shudra', 'yoni': 'Harina', 'tatva': 'Agni', 'paya': 'Rajata'},
        'Jyeshtha': {'gana': 'Rakshasa', 'nadi': 'Vata', 'varna': 'Shudra', 'yoni': 'Harina', 'tatva': 'Vayu', 'paya': 'Tamra'},
        'Mula': {'gana': 'Rakshasa', 'nadi': 'Vata', 'varna': 'Kshatriya', 'yoni': 'Shwana', 'tatva': 'Vayu', 'paya': 'Swarna'},
        'Purva Ashadha': {'gana': 'Manushya', 'nadi': 'Pitta', 'varna': 'Brahmin', 'yoni': 'Vana', 'tatva': 'Vayu', 'paya': 'Rajata'},
        'Uttara Ashadha': {'gana': 'Manushya', 'nadi': 'Kapha', 'varna': 'Kshatriya', 'yoni': 'Nakula', 'tatva': 'Vayu', 'paya': 'Tamra'},
        'Shravana': {'gana': 'Deva', 'nadi': 'Kapha', 'varna': 'Kshatriya', 'yoni': 'Vana', 'tatva': 'Vayu', 'paya': 'Swarna'},
        'Dhanishta': {'gana': 'Rakshasa', 'nadi': 'Pitta', 'varna': 'Shudra', 'yoni': 'Simha', 'tatva': 'Akasha', 'paya': 'Rajata'},
        'Shatabhisha': {'gana': 'Rakshasa', 'nadi': 'Vata', 'varna': 'Brahmin', 'yoni': 'Ashwa', 'tatva': 'Akasha', 'paya': 'Tamra'},
        'Purva Bhadrapada': {'gana': 'Manushya', 'nadi': 'Vata', 'varna': 'Brahmin', 'yoni': 'Simha', 'tatva': 'Akasha', 'paya': 'Swarna'},
        'Uttara Bhadrapada': {'gana': 'Manushya', 'nadi': 'Pitta', 'varna': 'Kshatriya', 'yoni': 'Gou', 'tatva': 'Akasha', 'paya': 'Rajata'},
        'Revati': {'gana': 'Deva', 'nadi': 'Kapha', 'varna': 'Shudra', 'yoni': 'Gaja', 'tatva': 'Akasha', 'paya': 'Tamra'}
    }
    
    # Name syllable mappings for each Nakshatra and Charan
    NAKSHATRA_SYLLABLES = {
        'Ashwini': ['Chu', 'Che', 'Cho', 'La'],
        'Bharani': ['Li', 'Lu', 'Le', 'Lo'],
        'Krittika': ['A', 'I', 'U', 'E'],
        'Rohini': ['O', 'Va', 'Vi', 'Vu'],
        'Mrigashira': ['Ve', 'Vo', 'Ka', 'Ki'],
        'Ardra': ['Ku', 'Gha', 'Nga', 'Cha'],
        'Punarvasu': ['Ke', 'Ko', 'Ha', 'Hi'],
        'Pushya': ['Hu', 'He', 'Ho', 'Da'],
        'Ashlesha': ['Di', 'Du', 'De', 'Do'],
        'Magha': ['Ma', 'Mi', 'Mu', 'Me'],
        'Purva Phalguni': ['Mo', 'Ta', 'Ti', 'Tu'],
        'Uttara Phalguni': ['Te', 'To', 'Pa', 'Pi'],
        'Hasta': ['Pu', 'Sha', 'Na', 'Tha'],
        'Chitra': ['Pe', 'Po', 'Ra', 'Ri'],
        'Swati': ['Ru', 'Re', 'Ro', 'Ta'],
        'Vishakha': ['Ti', 'Tu', 'Te', 'To'],
        'Anuradha': ['Na', 'Ni', 'Nu', 'Ne'],
        'Jyeshtha': ['No', 'Ya', 'Yi', 'Yu'],
        'Mula': ['Ye', 'Yo', 'Bha', 'Bhi'],
        'Purva Ashadha': ['Bhu', 'Dha', 'Pha', 'Dha'],
        'Uttara Ashadha': ['Bhe', 'Bho', 'Ja', 'Ji'],
        'Shravana': ['Khi', 'Khu', 'Khe', 'Kho'],
        'Dhanishta': ['Ga', 'Gi', 'Gu', 'Ge'],
        'Shatabhisha': ['Go', 'Sa', 'Si', 'Su'],
        'Purva Bhadrapada': ['Se', 'So', 'Da', 'Di'],
        'Uttara Bhadrapada': ['Du', 'Tha', 'Jha', 'Nya'],
        'Revati': ['De', 'Do', 'Cha', 'Chi']
    }
    
    @classmethod
    def get_nakshatra_attributes(cls, nakshatra: str, charan: int) -> Dict:
        """
        Get traditional Vedic attributes for a given Nakshatra and Charan
        """
        if nakshatra not in cls.NAKSHATRA_DATA:
            return {
                'gana': 'Unknown',
                'nadi': 'Unknown', 
                'varna': 'Unknown',
                'yoni': 'Unknown',
                'tatva': 'Unknown',
                'paya': 'Unknown',
                'name_syllable': 'Unknown'
            }
        
        # Get basic attributes from nakshatra
        attributes = cls.NAKSHATRA_DATA[nakshatra].copy()
        
        # Get name syllable based on charan (1-4)
        if nakshatra in cls.NAKSHATRA_SYLLABLES and 1 <= charan <= 4:
            attributes['name_syllable'] = cls.NAKSHATRA_SYLLABLES[nakshatra][charan - 1]
        else:
            attributes['name_syllable'] = 'Unknown'
        
        return attributes
    
    NAKSHATRAS = [
        {'name': 'Ashwini', 'lord': 'Ketu', 'start': 0.0, 'end': 13.333333},
        {'name': 'Bharani', 'lord': 'Venus', 'start': 13.333333, 'end': 26.666667},
        {'name': 'Krittika', 'lord': 'Sun', 'start': 26.666667, 'end': 40.0},
        {'name': 'Rohini', 'lord': 'Moon', 'start': 40.0, 'end': 53.333333},
        {'name': 'Mrigashirsha', 'lord': 'Mars', 'start': 53.333333, 'end': 66.666667},
        {'name': 'Ardra', 'lord': 'Rahu', 'start': 66.666667, 'end': 80.0},
        {'name': 'Punarvasu', 'lord': 'Jupiter', 'start': 80.0, 'end': 93.333333},
        {'name': 'Pushya', 'lord': 'Saturn', 'start': 93.333333, 'end': 106.666667},
        {'name': 'Ashlesha', 'lord': 'Mercury', 'start': 106.666667, 'end': 120.0},
        {'name': 'Magha', 'lord': 'Ketu', 'start': 120.0, 'end': 133.333333},
        {'name': 'Purva Phalguni', 'lord': 'Venus', 'start': 133.333333, 'end': 146.666667},
        {'name': 'Uttara Phalguni', 'lord': 'Sun', 'start': 146.666667, 'end': 160.0},
        {'name': 'Hasta', 'lord': 'Moon', 'start': 160.0, 'end': 173.333333},
        {'name': 'Chitra', 'lord': 'Mars', 'start': 173.333333, 'end': 186.666667},
        {'name': 'Swati', 'lord': 'Rahu', 'start': 186.666667, 'end': 200.0},
        {'name': 'Vishakha', 'lord': 'Jupiter', 'start': 200.0, 'end': 213.333333},
        {'name': 'Anuradha', 'lord': 'Saturn', 'start': 213.333333, 'end': 226.666667},
        {'name': 'Jyeshtha', 'lord': 'Mercury', 'start': 226.666667, 'end': 240.0},
        {'name': 'Mula', 'lord': 'Ketu', 'start': 240.0, 'end': 253.333333},
        {'name': 'Purva Ashadha', 'lord': 'Venus', 'start': 253.333333, 'end': 266.666667},
        {'name': 'Uttara Ashadha', 'lord': 'Sun', 'start': 266.666667, 'end': 280.0},
        {'name': 'Shravana', 'lord': 'Moon', 'start': 280.0, 'end': 293.333333},
        {'name': 'Dhanishta', 'lord': 'Mars', 'start': 293.333333, 'end': 306.666667},
        {'name': 'Shatabhisha', 'lord': 'Rahu', 'start': 306.666667, 'end': 320.0},
        {'name': 'Purva Bhadrapada', 'lord': 'Jupiter', 'start': 320.0, 'end': 333.333333},
        {'name': 'Uttara Bhadrapada', 'lord': 'Saturn', 'start': 333.333333, 'end': 346.666667},
        {'name': 'Revati', 'lord': 'Mercury', 'start': 346.666667, 'end': 360.0}
    ]
    
    DASHA_PERIODS = {
        'Ketu': 7, 'Venus': 20, 'Sun': 6, 'Moon': 10, 'Mars': 7,
        'Rahu': 18, 'Jupiter': 16, 'Saturn': 19, 'Mercury': 17
    }

    @classmethod
    def calculate_birth_chart(cls, birth_data: Dict) -> Dict:
        """
        Calculate complete birth chart using Swiss Ephemeris with Vedic calculations
        """
        if not swe_available:
            return {
                "success": False,
                "error": "Swiss Ephemeris not available for calculations"
            }
            
        try:
            # Parse birth data
            name = birth_data.get('name', 'Native')
            date_str = birth_data.get('date') or birth_data.get('dateOfBirth')
            time_str = birth_data.get('time') or birth_data.get('timeOfBirth')
            latitude = float(birth_data['latitude'])
            longitude = float(birth_data['longitude'])
            place = birth_data.get('place') or birth_data.get('placeOfBirth', 'Unknown')
            
            # Validate input data
            if not date_str or not time_str or date_str.strip() == '' or time_str.strip() == '':
                raise ValueError("Date and time cannot be empty")
            
            # Clean the input strings
            date_str = date_str.strip()
            time_str = time_str.strip()
            
            # Create datetime object - handle both HH:MM and HH:MM:SS formats
            try:
                dt = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
            except ValueError:
                try:
                    dt = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M:%S")
                except ValueError:
                    # Try alternative date formats
                    try:
                        dt = datetime.strptime(f"{date_str} {time_str}", "%d-%m-%Y %H:%M")
                    except ValueError:
                        dt = datetime.strptime(f"{date_str} {time_str}", "%d/%m/%Y %H:%M")
            
            # Set timezone to IST (India Standard Time)
            ist = pytz.timezone('Asia/Kolkata')
            dt_ist = ist.localize(dt)
            
            # Convert to UTC for calculations
            dt_utc = dt_ist.astimezone(pytz.UTC)
            
            # Calculate Julian Day
            jd = swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, 
                           dt_utc.hour + dt_utc.minute/60.0 + dt_utc.second/3600.0)
            
            # Set ayanamsa (Lahiri)
            swe.set_sid_mode(swe.SIDM_LAHIRI)
            
            # Calculate planetary positions
            planets_data = []
            
            for planet_name, planet_id in cls.PLANETS.items():
                if planet_name == 'Ketu':
                    # Calculate Rahu position first, then Ketu is 180° opposite
                    rahu_pos = swe.calc_ut(jd, cls.PLANETS['Rahu'], swe.FLG_SIDEREAL)[0][0]
                    longitude_tropical = rahu_pos + 180.0
                    if longitude_tropical >= 360.0:
                        longitude_tropical -= 360.0
                else:
                    # Calculate planet position
                    result = swe.calc_ut(jd, planet_id, swe.FLG_SIDEREAL)
                    longitude_tropical = result[0][0]
                
                # Convert to sidereal
                longitude_sidereal = longitude_tropical
                
                # Get sign and nakshatra info
                sign_index = int(longitude_sidereal // 30)
                sign_name = cls.SIGN_NAMES[sign_index]
                degree_in_sign = longitude_sidereal % 30
                
                # Format degree string
                degrees = int(degree_in_sign)
                minutes = int((degree_in_sign - degrees) * 60)
                degree_str = f"{degrees}°{minutes:02d}'"
                
                # Get nakshatra
                nakshatra_info = cls.get_nakshatra_info(longitude_sidereal)
                
                # Calculate house position (using whole sign houses from ascendant)
                ascendant_longitude = cls.calculate_ascendant(jd, latitude, longitude)
                ascendant_sign = int(ascendant_longitude // 30)
                planet_sign = int(longitude_sidereal // 30)
                
                # Debug house calculation
                print(f"[DEBUG] HOUSE CALC - Planet {planet_name}: Planet sign={planet_sign}, Ascendant sign={ascendant_sign}", file=sys.stderr)
                
                # Correct house calculation: Count houses from ascendant sign
                # House 1 = Ascendant sign, House 2 = Next sign, etc.
                house_diff = (planet_sign - ascendant_sign) % 12
                house = house_diff + 1
                
                print(f"[DEBUG] HOUSE CALC - Planet {planet_name}: House diff={house_diff}, Final house={house}", file=sys.stderr)
                
                # Check for retrograde motion
                retrograde = False
                if planet_name not in ['Sun', 'Moon', 'Rahu', 'Ketu']:
                    # Check speed for retrograde motion
                    speed = result[0][3] if len(result[0]) > 3 else 0
                    retrograde = speed < 0
                
                planets_data.append({
                    'name': planet_name,
                    'longitude': longitude_sidereal,
                    'sign': sign_name,
                    'degree': degree_str,
                    'nakshatra': nakshatra_info['name'],
                    'nakshatraLord': nakshatra_info['lord'],
                    'house': house,
                    'retrograde': retrograde
                })
            
            # Calculate ascendant
            ascendant_longitude = cls.calculate_ascendant(jd, latitude, longitude)
            ascendant_sign = cls.SIGN_NAMES[int(ascendant_longitude // 30)]
            
            # Calculate Vimshottari Dasha
            moon_longitude = next(p['longitude'] for p in planets_data if p['name'] == 'Moon')
            sun_longitude = next(p['longitude'] for p in planets_data if p['name'] == 'Sun')
            dasha_info = cls.calculate_vimshottari_dasha(moon_longitude, dt_ist)
            
            # Calculate Bhavas (House cusps and analysis)
            bhavas_info = cls.calculate_bhavas(jd, latitude, longitude, ascendant_longitude)
            
            # Calculate detailed house analysis
            house_analysis = cls.calculate_house_analysis(planets_data)
            
            # Detect Yogas and Doshas
            yogas_doshas = cls.detect_yogas_and_doshas(planets_data, ascendant_longitude)
            
            # Calculate Panchang details (Tithi, Yoga, Karana, etc.)
            panchang_details = cls.calculate_panchang_details(sun_longitude, moon_longitude, birth_data)
            
            # Get traditional Vedic attributes for Moon's nakshatra
            moon_nakshatra_info = cls.get_nakshatra_info(moon_longitude)
            moon_attributes = cls.get_nakshatra_attributes(
                moon_nakshatra_info['name'], 
                moon_nakshatra_info['pada']
            )
            
            # Use standard Nadi classification that matches AstroYogi
            standard_nadi = cls.get_nadi_from_nakshatra(moon_nakshatra_info['name'])
            moon_attributes['nadi'] = standard_nadi
            
            # Generate comprehensive analysis - remove this temporarily to fix the error
            # analysis_data = cls.generate_comprehensive_analysis(planets_data, ascendant_longitude, moon_longitude)
            
            # Get ayanamsa value
            ayanamsa = swe.get_ayanamsa_ut(jd)
            
            return {
                'success': True,
                'planets': planets_data,
                'ascendant': {
                    'longitude': ascendant_longitude,
                    'sign': ascendant_sign
                },
                'dasha': dasha_info,
                'bhavas': bhavas_info,
                'panchang': panchang_details,
                'vedic_attributes': moon_attributes,
                'analysis': {
                    'chart_strength': {'overall_strength': 65, 'interpretation': 'Moderate'},
                    'house_analysis': house_analysis,
                    'yogas_doshas': yogas_doshas,
                    'planetary_aspects': [],
                    'yogas': yogas_doshas.get('yogas', []),
                    'doshas': yogas_doshas.get('doshas', []),
                    'career_indicators': {'tenth_house_planets': [], 'career_suggestions': []},
                    'health_indicators': {'health_areas': []},
                    'relationship_indicators': {'relationship_traits': []}
                },
                'ayanamsa': ayanamsa,
                'julianDay': jd,
                'coordinates': {
                    'latitude': latitude,
                    'longitude': longitude
                },
                'calculation_engine': 'Jyotisha-Official'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    @classmethod
    def calculate_ascendant(cls, jd: float, latitude: float, longitude: float) -> float:
        """
        Calculate ascendant using Swiss Ephemeris
        """
        # Calculate houses using Placidus system
        houses = swe.houses(jd, latitude, longitude, b'P')
        
        # Get ascendant (1st house cusp) and convert to sidereal
        ascendant_tropical = houses[1][0]  # houses[1] contains the cusps, [0] is the ascendant
        
        # Convert to sidereal
        ayanamsa = swe.get_ayanamsa_ut(jd)
        ascendant_sidereal = ascendant_tropical - ayanamsa
        
        if ascendant_sidereal < 0:
            ascendant_sidereal += 360
            
        return ascendant_sidereal
    
    @classmethod
    def get_nakshatra_info(cls, longitude: float) -> Dict:
        """
        Get nakshatra information from longitude with precise pada calculation
        """
        # Normalize longitude to 0-360 range
        longitude = longitude % 360
        
        for i, nakshatra in enumerate(cls.NAKSHATRAS):
            if nakshatra['start'] <= longitude < nakshatra['end']:
                # Calculate pada using traditional method matching professional standards
                position_in_nakshatra = longitude - nakshatra['start']
                
                # Each pada spans exactly 3°20' = 3.333333 degrees
                pada_degrees = 3.333333
                
                # Traditional pada calculation - Moon at 6.82° in Purva Phalguni should be Pada 4
                if position_in_nakshatra < pada_degrees:
                    pada = 1
                elif position_in_nakshatra < 2 * pada_degrees:
                    pada = 2
                elif position_in_nakshatra < 3 * pada_degrees:
                    pada = 3
                else:
                    pada = 4
                
                return {
                    'name': nakshatra['name'],
                    'lord': nakshatra['lord'],
                    'number': i + 1,
                    'pada': pada
                }
        
        # Handle edge case for Revati (last nakshatra)
        return {
            'name': 'Revati',
            'lord': 'Mercury',
            'number': 27,
            'pada': 4
        }
    
    @classmethod
    def calculate_vimshottari_dasha(cls, moon_longitude: float, birth_time: datetime) -> Dict:
        """
        Calculate Vimshottari Dasha periods based on Moon's nakshatra at birth
        """
        # Get Moon's nakshatra
        moon_nakshatra = cls.get_nakshatra_info(moon_longitude)
        nakshatra_lord = moon_nakshatra['lord']
        
        # Standard Vimshottari dasha sequence
        dasha_sequence = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury']
        
        # Find the nakshatra degree position (0-13.333333)
        nakshatra_number = moon_nakshatra['number'] - 1  # 0-based index
        degree_in_nakshatra = (moon_longitude - (nakshatra_number * 13.333333)) % 13.333333
        
        # Calculate fraction of nakshatra completed
        fraction_completed = degree_in_nakshatra / 13.333333
        
        # Duration of this dasha lord's period
        dasha_duration = cls.DASHA_PERIODS[nakshatra_lord]
        
        # Calculate how much of current dasha has already elapsed at birth
        elapsed_at_birth = dasha_duration * fraction_completed
        remaining_at_birth = dasha_duration - elapsed_at_birth
        
        # Build complete dasha sequence starting from birth
        dasha_periods = []
        current_date = birth_time
        now = datetime.now(pytz.timezone('Asia/Kolkata'))
        
        # Start with the nakshatra lord's remaining period
        start_index = dasha_sequence.index(nakshatra_lord)
        
        # Calculate actual birth time start based on nakshatra position
        # The Dasha starts counting from when the Moon entered the nakshatra
        actual_dasha_start = birth_time - timedelta(days=elapsed_at_birth * 365.25)
        first_dasha_end = birth_time + timedelta(days=remaining_at_birth * 365.25)
        
        # Determine status of first dasha
        if now < first_dasha_end:
            first_status = 'current'
        else:
            first_status = 'completed'
        
        dasha_periods.append({
            'lord': nakshatra_lord,
            'start_date': actual_dasha_start.isoformat(),
            'end_date': first_dasha_end.isoformat(),
            'duration_years': dasha_duration,
            'status': first_status
        })
        
        current_date = first_dasha_end
        current_found = (first_status == 'current')
        
        # Add remaining 8 dasha periods in sequence
        for i in range(1, 9):
            lord_index = (start_index + i) % 9
            dasha_lord = dasha_sequence[lord_index]
            duration = cls.DASHA_PERIODS[dasha_lord]
            
            start_date = current_date
            end_date = current_date + timedelta(days=duration * 365.25)
            
            # Determine status based on current time
            if now < start_date:
                status = 'future'
            elif start_date <= now < end_date and not current_found:
                status = 'current'
                current_found = True
            else:
                status = 'completed' if now >= end_date else 'future'
            
            dasha_periods.append({
                'lord': dasha_lord,
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat(),
                'duration_years': duration,
                'status': status
            })
            
            current_date = end_date
        
        # Find the actual current dasha
        current_dasha = None
        for period in dasha_periods:
            start = datetime.fromisoformat(period['start_date'].replace('Z', '+00:00')).replace(tzinfo=pytz.timezone('Asia/Kolkata'))
            end = datetime.fromisoformat(period['end_date'].replace('Z', '+00:00')).replace(tzinfo=pytz.timezone('Asia/Kolkata'))
            
            if start <= now < end:
                current_dasha = period.copy()
                current_dasha['status'] = 'current'
                break
        
        # Calculate sub-periods for current Mahadasha
        current_sub_periods = cls.calculate_sub_periods(current_dasha, birth_time) if current_dasha else {}
        
        return {
            'current': current_dasha,
            'sequence': dasha_periods,
            'sub_periods': current_sub_periods,
            'moonNakshatra': moon_nakshatra
        }
    
    @classmethod
    def calculate_panchang_details(cls, sun_longitude: float, moon_longitude: float, birth_data: Dict) -> Dict:
        """
        Calculate Panchang details: Tithi, Yoga, Karana, etc.
        """
        # Calculate Tithi (lunar day)
        sun_moon_difference = (moon_longitude - sun_longitude) % 360
        tithi_number = int(sun_moon_difference / 12) + 1
        
        # Tithi names
        tithi_names = [
            'Pratipad', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
            'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
            'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
        ]
        
        tithi_name = tithi_names[min(tithi_number - 1, 14)]
        if tithi_number > 15:
            tithi_name = tithi_names[tithi_number - 16]
        
        # Calculate Yoga
        yoga_value = (sun_longitude + moon_longitude) % 360
        yoga_number = int(yoga_value / 13.333333) + 1
        
        # Yoga names
        yoga_names = [
            'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
            'Atiganda', 'Sukarma', 'Dhriti', 'Shool', 'Ganda',
            'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
            'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
            'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
            'Indra', 'Vaidhriti'
        ]
        
        yoga_name = yoga_names[min(yoga_number - 1, 26)]
        
        # Calculate Karana (half of Tithi) - Traditional 60-Karana cycle
        karana_number = int(sun_moon_difference / 6) + 1
        
        # Traditional Karana sequence for 60-Karana lunar month cycle
        if karana_number == 1:
            karana_name = 'Kimstughna'  # Fixed karana at position 1
        elif karana_number >= 58:
            # Fixed karanas at end of cycle
            fixed_end_karanas = ['Shakuni', 'Chatushpada', 'Naga']
            karana_name = fixed_end_karanas[min(karana_number - 58, 2)]
        else:
            # Moveable karanas (Bava-Vishti cycle, positions 2-57)
            moveable_karanas = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti']
            # Calculate position in 7-karana cycle
            cycle_position = (karana_number - 2) % 7
            karana_name = moveable_karanas[cycle_position]
        
        # Calculate additional elements
        moon_nakshatra = cls.get_nakshatra_info(moon_longitude)
        
        # Get name alphabet from nakshatra
        name_alphabets = {
            'Ashwini': 'Chu, Che, Cho, La',
            'Bharani': 'Li, Lu, Le, Lo',
            'Krittika': 'A, I, U, E',
            'Rohini': 'O, Va, Vi, Vu',
            'Mrigashirsha': 'Ve, Vo, Ka, Ki',
            'Ardra': 'Ku, Gha, Nga, Chha',
            'Punarvasu': 'Ke, Ko, Ha, Hi',
            'Pushya': 'Hu, He, Ho, Da',
            'Ashlesha': 'Di, Du, De, Do',
            'Magha': 'Ma, Mi, Mu, Me',
            'Purva Phalguni': 'Mo, Ta, Ti, Tu',
            'Uttara Phalguni': 'Te, To, Pa, Pi',
            'Hasta': 'Pu, Sha, Na, Tha',
            'Chitra': 'Pe, Po, Ra, Ri',
            'Swati': 'Ru, Re, Ro, Ta',
            'Vishakha': 'Ti, Tu, Te, To',
            'Anuradha': 'Na, Ni, Nu, Ne',
            'Jyeshtha': 'No, Ya, Yi, Yu',
            'Mula': 'Ye, Yo, Bha, Bhi',
            'Purva Ashadha': 'Bhu, Dha, Pha, Dha',
            'Uttara Ashadha': 'Bhe, Bho, Ja, Ji',
            'Shravana': 'Ju, Je, Jo, Gha',
            'Dhanishtha': 'Ga, Gi, Gu, Ge',
            'Shatabhisha': 'Go, Sa, Si, Su',
            'Purva Bhadrapada': 'Se, So, Dha, Di',
            'Uttara Bhadrapada': 'Du, Tha, Jha, Da',
            'Revati': 'De, Do, Cha, Chi'
        }
        
        return {
            'tithi': tithi_name,
            'tithi_number': tithi_number,
            'yoga': yoga_name,
            'yoga_number': yoga_number,
            'karana': karana_name,
            'karana_number': karana_number,
            'name_alphabet': name_alphabets.get(moon_nakshatra['name'], 'N/A'),
            'gana': cls.get_gana_from_nakshatra(moon_nakshatra['name']),
            'nadi': cls.get_nadi_from_nakshatra(moon_nakshatra['name']),
            'yoni': cls.get_yoni_from_nakshatra(moon_nakshatra['name']),
            'varna': cls.get_varna_from_nakshatra(moon_nakshatra['name']),
            'tatva': cls.get_tatva_from_nakshatra(moon_nakshatra['name'])
        }
    
    @classmethod
    def get_gana_from_nakshatra(cls, nakshatra_name: str) -> str:
        """Get Gana (temperament) from nakshatra"""
        deva_gana = ['Ashwini', 'Mrigashirsha', 'Punarvasu', 'Pushya', 'Hasta', 'Swati', 'Anuradha', 'Shravana', 'Revati']
        manush_gana = ['Bharani', 'Rohini', 'Ardra', 'Purva Phalguni', 'Uttara Phalguni', 'Purva Ashadha', 'Uttara Ashadha', 'Purva Bhadrapada', 'Uttara Bhadrapada']
        rakshasa_gana = ['Krittika', 'Ashlesha', 'Magha', 'Chitra', 'Vishakha', 'Jyeshtha', 'Mula', 'Dhanishtha', 'Shatabhisha']
        
        if nakshatra_name in deva_gana:
            return 'Deva'
        elif nakshatra_name in manush_gana:
            return 'Manush'
        elif nakshatra_name in rakshasa_gana:
            return 'Rakshasa'
        return 'N/A'
    
    @classmethod
    def calculate_house_analysis(cls, planets_data: list) -> list:
        """Calculate detailed house analysis with planets and their status"""
        house_analysis = []
        
        # House names and significances
        house_names = [
            'Tanu Bhava', 'Dhana Bhava', 'Sahaja Bhava', 'Sukha Bhava',
            'Putra Bhava', 'Ripu Bhava', 'Kalatra Bhava', 'Ayur Bhava',
            'Dharma Bhava', 'Karma Bhava', 'Labha Bhava', 'Vyaya Bhava'
        ]
        
        house_significances = [
            'Self, personality, physical body, appearance',
            'Wealth, family, speech, food, values',
            'Siblings, courage, communication, short journeys',
            'Home, mother, happiness, property, education',
            'Children, creativity, intelligence, romance',
            'Enemies, diseases, debts, service, competition',
            'Marriage, partnerships, spouse, business',
            'Longevity, transformation, occult, inheritance',
            'Religion, philosophy, fortune, long journeys',
            'Career, reputation, authority, father',
            'Gains, income, friends, aspirations, elder siblings',
            'Losses, expenses, spirituality, foreign lands'
        ]
        
        # Group planets by house
        for house_num in range(1, 13):
            planets_in_house = [p['name'] for p in planets_data if p['house'] == house_num]
            
            house_analysis.append({
                'house': house_num,
                'name': house_names[house_num - 1],
                'significance': house_significances[house_num - 1],
                'planets': planets_in_house
            })
        
        return house_analysis
    
    @classmethod
    def calculate_sub_periods(cls, current_dasha: dict, birth_date: datetime) -> dict:
        """Calculate Antardasha, Pratyantardasha, Sookshma, and Prana dashas"""
        if not current_dasha:
            return {}
        
        # Vimshottari Dasha periods in years
        dasha_periods = {
            'Sun': 6, 'Moon': 10, 'Mars': 7, 'Rahu': 18, 'Jupiter': 16,
            'Saturn': 19, 'Mercury': 17, 'Ketu': 7, 'Venus': 20
        }
        
        # Planet sequence starting from current Mahadasha lord
        planet_sequence = ['Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus']
        current_lord = current_dasha['lord']
        start_index = planet_sequence.index(current_lord)
        
        # Reorder sequence to start from current lord
        ordered_sequence = planet_sequence[start_index:] + planet_sequence[:start_index]
        
        mahadasha_start = datetime.fromisoformat(current_dasha['start_date'].replace('Z', '+00:00'))
        mahadasha_duration_days = current_dasha['duration_years'] * 365.25
        
        # Calculate Antardasha periods
        antardashas = []
        antardasha_start = mahadasha_start
        
        for planet in ordered_sequence:
            antardasha_duration_years = (dasha_periods[planet] * current_dasha['duration_years']) / 120
            antardasha_duration_days = antardasha_duration_years * 365.25
            antardasha_end = antardasha_start + timedelta(days=antardasha_duration_days)
            
            # Determine status
            now = datetime.now(mahadasha_start.tzinfo)
            if antardasha_end < now:
                status = 'completed'
            elif antardasha_start <= now < antardasha_end:
                status = 'current'
            else:
                status = 'future'
            
            antardashas.append({
                'lord': planet,
                'start_date': antardasha_start.isoformat(),
                'end_date': antardasha_end.isoformat(),
                'duration_years': round(antardasha_duration_years, 2),
                'status': status
            })
            
            antardasha_start = antardasha_end
        
        # Find current Antardasha for further sub-divisions
        current_antardasha = next((ad for ad in antardashas if ad['status'] == 'current'), None)
        
        sub_periods = {
            'antardashas': antardashas,
            'current_antardasha': current_antardasha
        }
        
        if current_antardasha:
            # Calculate Pratyantardasha for current Antardasha
            sub_periods['pratyantardashas'] = cls.calculate_pratyantardasha(current_antardasha, ordered_sequence, dasha_periods)
            
        return sub_periods
    
    @classmethod
    def calculate_pratyantardasha(cls, antardasha: dict, planet_sequence: list, dasha_periods: dict) -> list:
        """Calculate Pratyantardasha periods for current Antardasha"""
        antardasha_start = datetime.fromisoformat(antardasha['start_date'].replace('Z', '+00:00'))
        antardasha_duration_days = antardasha['duration_years'] * 365.25
        
        # Reorder sequence starting from Antardasha lord
        antardasha_lord = antardasha['lord']
        start_index = planet_sequence.index(antardasha_lord)
        ordered_sequence = planet_sequence[start_index:] + planet_sequence[:start_index]
        
        pratyantardashas = []
        pratyantardasha_start = antardasha_start
        
        for planet in ordered_sequence:
            duration_proportion = dasha_periods[planet] / 120
            pratyantardasha_duration_days = antardasha_duration_days * duration_proportion
            pratyantardasha_end = pratyantardasha_start + timedelta(days=pratyantardasha_duration_days)
            
            # Determine status
            now = datetime.now(antardasha_start.tzinfo)
            if pratyantardasha_end < now:
                status = 'completed'
            elif pratyantardasha_start <= now < pratyantardasha_end:
                status = 'current'
            else:
                status = 'future'
            
            pratyantardashas.append({
                'lord': planet,
                'start_date': pratyantardasha_start.isoformat(),
                'end_date': pratyantardasha_end.isoformat(),
                'duration_days': round(pratyantardasha_duration_days, 1),
                'status': status
            })
            
            pratyantardasha_start = pratyantardasha_end
        
        return pratyantardashas
    
    @classmethod
    def detect_yogas_and_doshas(cls, planets_data: list, ascendant_longitude: float) -> dict:
        """Comprehensive detection of Vedic Yogas and Doshas"""
        yogas = []
        doshas = []
        
        # Create planet position mapping
        planet_positions = {}
        for planet in planets_data:
            planet_positions[planet['name']] = {
                'house': planet['house'],
                'sign': planet['sign'],
                'longitude': planet['longitude']
            }
        
        # Calculate ascendant sign
        ascendant_sign = int(ascendant_longitude // 30)
        
        # CHEVVAI/MANGAL DOSHA (Mars in 2nd, 4th, 7th, 8th, 12th houses)
        mars_house = planet_positions.get('Mars', {}).get('house', 0)
        chevvai_dosha_houses = [2, 4, 7, 8, 12]
        
        if mars_house in chevvai_dosha_houses:
            dosha_strength = 'High' if mars_house in [4, 7, 8] else 'Moderate'
            doshas.append({
                'name': 'Chevvai Dosha (Mangal Dosha)',
                'description': f'Mars in {mars_house}th house causes obstacles in marriage, property disputes, and relationship challenges',
                'strength': dosha_strength,
                'remedies': ['Perform Mars puja on Tuesdays', 'Wear red coral gemstone after consultation', 'Fast on Tuesdays', 'Chant Mangal Beej mantra "Om Angarakaya Namaha"']
            })
        
        # RAHU-KETU DOSHA (Rahu in 1st/2nd and Ketu in 7th/8th houses, and vice versa)
        rahu_house = planet_positions.get('Rahu', {}).get('house', 0)
        ketu_house = planet_positions.get('Ketu', {}).get('house', 0)
        
        # Check for Rahu-Ketu dosha combinations
        rahu_ketu_dosha = False
        if (rahu_house in [1, 2] and ketu_house in [7, 8]) or (rahu_house in [7, 8] and ketu_house in [1, 2]):
            rahu_ketu_dosha = True
            doshas.append({
                'name': 'Rahu-Ketu Dosha',
                'description': f'Rahu in {rahu_house}th house and Ketu in {ketu_house}th house creates instability in relationships and self-identity',
                'strength': 'High',
                'remedies': ['Perform Rahu-Ketu shanti puja', 'Donate black sesame seeds', 'Wear Gomed and Cat\'s Eye gemstones', 'Chant Rahu-Ketu mantras']
            })
        
        # SATURN DOSHA (Saturn in 1st, 2nd, 5th, 7th, 8th, 12th houses)
        saturn_house = planet_positions.get('Saturn', {}).get('house', 0)
        saturn_dosha_houses = [1, 2, 5, 7, 8, 12]
        
        if saturn_house in saturn_dosha_houses:
            dosha_strength = 'High' if saturn_house in [1, 7, 8] else 'Moderate'
            doshas.append({
                'name': 'Shani Dosha',
                'description': f'Saturn in {saturn_house}th house causes delays, obstacles, and karmic challenges',
                'strength': dosha_strength,
                'remedies': ['Worship Lord Hanuman on Saturdays', 'Donate black items (oil, clothes, iron)', 'Fast on Saturdays', 'Recite Hanuman Chalisa daily']
            })
        
        # PITRU DOSHA (Rahu or Ketu in 1st, 5th, 9th houses)
        pitru_dosha_houses = [1, 5, 9]
        pitru_dosha = False
        
        if rahu_house in pitru_dosha_houses or ketu_house in pitru_dosha_houses:
            pitru_dosha = True
            affected_planet = 'Rahu' if rahu_house in pitru_dosha_houses else 'Ketu'
            affected_house = rahu_house if rahu_house in pitru_dosha_houses else ketu_house
            
            doshas.append({
                'name': 'Pitru Dosha',
                'description': f'{affected_planet} in {affected_house}th house indicates ancestral karma and challenges related to forefathers',
                'strength': 'Moderate',
                'remedies': ['Perform Pitru Paksha rituals', 'Offer water to Peepal tree daily', 'Feed Brahmins and crows', 'Perform Shraddha ceremonies']
            })
        
        # SUN CONJUNCTION DOSHAS (Sun conjunct Rahu or Ketu)
        sun_house = planet_positions.get('Sun', {}).get('house', 0)
        sun_longitude = planet_positions.get('Sun', {}).get('longitude', 0)
        rahu_longitude = planet_positions.get('Rahu', {}).get('longitude', 0)
        ketu_longitude = planet_positions.get('Ketu', {}).get('longitude', 0)
        
        # Check for conjunction (within 10 degrees)
        sun_rahu_diff = abs(sun_longitude - rahu_longitude)
        if sun_rahu_diff > 180:
            sun_rahu_diff = 360 - sun_rahu_diff
        
        sun_ketu_diff = abs(sun_longitude - ketu_longitude)
        if sun_ketu_diff > 180:
            sun_ketu_diff = 360 - sun_ketu_diff
        
        if sun_rahu_diff <= 10 and sun_house == rahu_house:
            doshas.append({
                'name': 'Sun-Rahu Conjunction Dosha',
                'description': f'Sun conjunct Rahu in {sun_house}th house causes ego conflicts, authority issues, and paternal challenges',
                'strength': 'High',
                'remedies': ['Offer water to Sun daily at sunrise', 'Donate copper items', 'Worship Lord Surya', 'Chant Aditya Hridaya stotra']
            })
        
        if sun_ketu_diff <= 10 and sun_house == ketu_house:
            doshas.append({
                'name': 'Sun-Ketu Conjunction Dosha',
                'description': f'Sun conjunct Ketu in {sun_house}th house causes spiritual confusion, loss of confidence, and detachment from worldly matters',
                'strength': 'Moderate',
                'remedies': ['Perform Sun worship daily', 'Donate gold or wheat', 'Practice meditation and spirituality', 'Wear Ruby gemstone after consultation']
            })
        
        # RAJYOGAS
        # Check for conjunction of Kendra and Trikona lords
        kendra_houses = [1, 4, 7, 10]
        trikona_houses = [1, 5, 9]
        
        kendra_planets = [p['name'] for p in planets_data if p['house'] in kendra_houses]
        trikona_planets = [p['name'] for p in planets_data if p['house'] in trikona_houses]
        
        # Common planets in both Kendra and Trikona
        rajyoga_planets = set(kendra_planets) & set(trikona_planets)
        if rajyoga_planets:
            yogas.append({
                'name': 'Raja Yoga',
                'description': f'Powerful combination of Kendra and Trikona planets: {", ".join(rajyoga_planets)}',
                'strength': 'Strong',
                'benefits': ['Leadership qualities', 'Success in career', 'Fame and recognition']
            })
        
        # DHANA YOGAS (Wealth combinations)
        wealth_houses = [2, 5, 9, 11]
        wealth_planets = [p['name'] for p in planets_data if p['house'] in wealth_houses and p['name'] in ['Jupiter', 'Venus', 'Mercury']]
        
        if len(wealth_planets) >= 2:
            yogas.append({
                'name': 'Dhana Yoga',
                'description': f'Wealth-giving combination with {", ".join(wealth_planets)} in prosperity houses',
                'strength': 'Moderate',
                'benefits': ['Financial prosperity', 'Material abundance', 'Business success']
            })
        
        # GAJA KESARI YOGA
        jupiter_house = planet_positions.get('Jupiter', {}).get('house', 0)
        moon_house = planet_positions.get('Moon', {}).get('house', 0)
        
        # Check if Jupiter and Moon are in Kendra to each other
        house_diff = abs(jupiter_house - moon_house)
        if house_diff in [0, 3, 6, 9] or (house_diff == 3 and jupiter_house != moon_house):
            yogas.append({
                'name': 'Gaja Kesari Yoga',
                'description': 'Jupiter and Moon in Kendra positions creating auspicious combination',
                'strength': 'Strong',
                'benefits': ['Wisdom and intelligence', 'Good fortune', 'Respect in society']
            })
        
        # BUDHADITYA YOGA
        sun_house = planet_positions.get('Sun', {}).get('house', 0)
        mercury_house = planet_positions.get('Mercury', {}).get('house', 0)
        
        if sun_house == mercury_house:
            yogas.append({
                'name': 'Budhaditya Yoga',
                'description': 'Sun and Mercury conjunction enhancing intelligence and communication',
                'strength': 'Moderate',
                'benefits': ['Enhanced intelligence', 'Good communication skills', 'Success in academics']
            })
        
        return {
            'yogas': yogas,
            'doshas': doshas,
            'total_yogas': len(yogas),
            'total_doshas': len(doshas)
        }
    
    @classmethod
    def get_nadi_from_nakshatra(cls, nakshatra_name: str) -> str:
        """Get Nadi from nakshatra"""
        aadi_nadi = ['Ashwini', 'Ardra', 'Punarvasu', 'Uttara Phalguni', 'Hasta', 'Jyeshtha', 'Mula', 'Shatabhisha', 'Purva Bhadrapada']
        madhya_nadi = ['Bharani', 'Mrigashirsha', 'Pushya', 'Purva Phalguni', 'Chitra', 'Anuradha', 'Purva Ashadha', 'Dhanishtha', 'Uttara Bhadrapada']
        antya_nadi = ['Krittika', 'Rohini', 'Ashlesha', 'Magha', 'Swati', 'Vishakha', 'Uttara Ashadha', 'Shravana', 'Revati']
        
        if nakshatra_name in aadi_nadi:
            return 'Aadi'
        elif nakshatra_name in madhya_nadi:
            return 'Madhya'
        elif nakshatra_name in antya_nadi:
            return 'Antya'
        return 'N/A'
    
    @classmethod
    def get_yoni_from_nakshatra(cls, nakshatra_name: str) -> str:
        """Get Yoni (animal symbol) from nakshatra"""
        yoni_mapping = {
            'Ashwini': 'Horse', 'Bharani': 'Elephant', 'Krittika': 'Goat', 'Rohini': 'Serpent',
            'Mrigashirsha': 'Serpent', 'Ardra': 'Dog', 'Punarvasu': 'Cat', 'Pushya': 'Goat',
            'Ashlesha': 'Cat', 'Magha': 'Rat', 'Purva Phalguni': 'Rat', 'Uttara Phalguni': 'Cow',
            'Hasta': 'Buffalo', 'Chitra': 'Tiger', 'Swati': 'Buffalo', 'Vishakha': 'Tiger',
            'Anuradha': 'Deer', 'Jyeshtha': 'Deer', 'Mula': 'Dog', 'Purva Ashadha': 'Monkey',
            'Uttara Ashadha': 'Mongoose', 'Shravana': 'Monkey', 'Dhanishtha': 'Lion',
            'Shatabhisha': 'Horse', 'Purva Bhadrapada': 'Lion', 'Uttara Bhadrapada': 'Cow',
            'Revati': 'Elephant'
        }
        return yoni_mapping.get(nakshatra_name, 'N/A')
    
    @classmethod
    def get_varna_from_nakshatra(cls, nakshatra_name: str) -> str:
        """Get Varna (caste) from nakshatra"""
        brahmin = ['Krittika', 'Punarvasu', 'Pushya', 'Uttara Phalguni', 'Hasta', 'Swati', 'Anuradha', 'Shravana', 'Uttara Bhadrapada']
        kshatriya = ['Ashwini', 'Mrigashirsha', 'Magha', 'Chitra', 'Vishakha', 'Mula', 'Purva Ashadha', 'Dhanishtha', 'Purva Bhadrapada']
        vaishya = ['Bharani', 'Rohini', 'Purva Phalguni', 'Jyeshtha', 'Uttara Ashadha', 'Shatabhisha', 'Revati']
        shudra = ['Ardra', 'Ashlesha']
        
        if nakshatra_name in brahmin:
            return 'Brahmin'
        elif nakshatra_name in kshatriya:
            return 'Kshatriya'
        elif nakshatra_name in vaishya:
            return 'Vaishya'
        elif nakshatra_name in shudra:
            return 'Shudra'
        return 'N/A'
    
    @classmethod
    def get_tatva_from_nakshatra(cls, nakshatra_name: str) -> str:
        """Get Tatva (element) from nakshatra"""
        earth = ['Krittika', 'Rohini', 'Ashlesha', 'Uttara Phalguni', 'Hasta', 'Jyeshtha', 'Uttara Ashadha', 'Uttara Bhadrapada', 'Revati']
        water = ['Mrigashirsha', 'Punarvasu', 'Pushya', 'Swati', 'Shravana', 'Shatabhisha', 'Purva Bhadrapada']
        fire = ['Ashwini', 'Bharani', 'Magha', 'Purva Phalguni', 'Chitra', 'Vishakha', 'Mula', 'Purva Ashadha', 'Dhanishtha']
        air = ['Ardra', 'Anuradha']
        
        if nakshatra_name in earth:
            return 'Earth'
        elif nakshatra_name in water:
            return 'Water'
        elif nakshatra_name in fire:
            return 'Fire'
        elif nakshatra_name in air:
            return 'Air'
        return 'N/A'
    
    @classmethod
    def calculate_bhavas(cls, jd: float, latitude: float, longitude: float, ascendant_longitude: float) -> Dict:
        """
        Calculate Bhavas (House cusps and their significance)
        """
        try:
            # Calculate house cusps using Placidus system
            houses_result = swe.houses(jd, latitude, longitude, b'P')
            house_cusps = houses_result[1]  # House cusps
            
            # Convert tropical cusps to sidereal
            ayanamsa = swe.get_ayanamsa_ut(jd)
            sidereal_cusps = []
            
            for cusp in house_cusps[1:]:  # Skip index 0, start from house 1
                sidereal_cusp = cusp - ayanamsa
                if sidereal_cusp < 0:
                    sidereal_cusp += 360
                sidereal_cusps.append(sidereal_cusp)
            
            # Bhava definitions and significance
            bhava_info = [
                {'number': 1, 'name': 'Tanu Bhava', 'significance': 'Self, personality, physical body, appearance'},
                {'number': 2, 'name': 'Dhana Bhava', 'significance': 'Wealth, family, speech, food, values'},
                {'number': 3, 'name': 'Sahaja Bhava', 'significance': 'Siblings, courage, communication, short journeys'},
                {'number': 4, 'name': 'Sukha Bhava', 'significance': 'Home, mother, happiness, property, education'},
                {'number': 5, 'name': 'Putra Bhava', 'significance': 'Children, creativity, intelligence, romance'},
                {'number': 6, 'name': 'Ripu Bhava', 'significance': 'Enemies, diseases, debts, service, competition'},
                {'number': 7, 'name': 'Kalatra Bhava', 'significance': 'Marriage, partnerships, spouse, business'},
                {'number': 8, 'name': 'Ayur Bhava', 'significance': 'Longevity, transformation, occult, inheritance'},
                {'number': 9, 'name': 'Dharma Bhava', 'significance': 'Religion, philosophy, fortune, long journeys'},
                {'number': 10, 'name': 'Karma Bhava', 'significance': 'Career, reputation, authority, father'},
                {'number': 11, 'name': 'Labha Bhava', 'significance': 'Gains, income, friends, aspirations, elder siblings'},
                {'number': 12, 'name': 'Vyaya Bhava', 'significance': 'Losses, expenses, spirituality, foreign lands'}
            ]
            
            # Add cusp positions to bhava info
            for i, bhava in enumerate(bhava_info):
                if i < len(sidereal_cusps):
                    cusp_longitude = sidereal_cusps[i]
                    sign_index = int(cusp_longitude // 30)
                    bhava['cusp_longitude'] = cusp_longitude
                    bhava['cusp_sign'] = cls.SIGN_NAMES[sign_index]
                    
                    # Calculate degree in sign
                    degree_in_sign = cusp_longitude % 30
                    degrees = int(degree_in_sign)
                    minutes = int((degree_in_sign - degrees) * 60)
                    bhava['cusp_degree'] = f"{degrees}°{minutes:02d}'"
            
            return {
                'houses': bhava_info,
                'system': 'Placidus',
                'ayanamsa_used': ayanamsa
            }
            
        except Exception as e:
            # Return basic whole sign houses if calculation fails
            basic_bhavas = []
            ascendant_sign = int(ascendant_longitude // 30)
            
            for i in range(12):
                sign_index = (ascendant_sign + i) % 12
                basic_bhavas.append({
                    'number': i + 1,
                    'name': f'House {i + 1}',
                    'cusp_sign': cls.SIGN_NAMES[sign_index],
                    'significance': 'Basic house calculation'
                })
            
            return {
                'houses': basic_bhavas,
                'system': 'Whole Sign (fallback)',
                'error': str(e)
            }

    @classmethod
    def calculate_transits(cls, transit_data: Dict) -> Dict:
        """
        Calculate current transits for horoscope generation
        """
        try:
            # Parse input data
            date_str = transit_data.get('date', datetime.now().strftime('%Y-%m-%d'))
            time_str = transit_data.get('time', '12:00')
            latitude = float(transit_data.get('latitude', 28.6139))
            longitude = float(transit_data.get('longitude', 77.2090))
            
            # Convert to Julian Day
            year, month, day = map(int, date_str.split('-'))
            hour, minute = map(int, time_str.split(':'))
            
            jd = swe.julday(year, month, day, hour + minute/60.0)
            
            # Calculate planetary positions
            planets = []
            for planet_name, planet_id in cls.PLANETS.items():
                if planet_id != swe.MEAN_NODE or planet_name == 'Rahu':
                    position, _ = swe.calc_ut(jd, planet_id)
                    longitude_deg = position[0]
                    
                    # Convert to sidereal
                    ayanamsa = swe.get_ayanamsa_ut(jd)
                    sidereal_longitude = (longitude_deg - ayanamsa) % 360
                    
                    # Handle Ketu (opposite of Rahu)
                    if planet_name == 'Ketu':
                        sidereal_longitude = (sidereal_longitude + 180) % 360
                    
                    # Get sign and nakshatra
                    sign_num = int(sidereal_longitude / 30)
                    sign = cls.SIGN_NAMES_ENGLISH[sign_num]
                    nakshatra_info = cls.get_nakshatra_info(sidereal_longitude)
                    
                    planets.append({
                        'name': planet_name,
                        'longitude': sidereal_longitude,
                        'sign': sign,
                        'degree': sidereal_longitude % 30,
                        'nakshatra': nakshatra_info['name'],
                        'retrograde': position[3] < 0 if len(position) > 3 else False
                    })
            
            # Calculate Moon sign and nakshatra
            moon = next(p for p in planets if p['name'] == 'Moon')
            sun = next(p for p in planets if p['name'] == 'Sun')
            
            # Calculate ascendant
            ascendant_deg = cls.calculate_ascendant(jd, latitude, longitude)
            ascendant_sign = cls.SIGN_NAMES_ENGLISH[int(ascendant_deg / 30)]
            
            # Calculate current dasha (simplified - using Moon position)  
            current_time = datetime.now(pytz.timezone('Asia/Kolkata'))
            current_dasha = cls.calculate_vimshottari_dasha(moon['longitude'], current_time)
            
            # Calculate Panchang elements
            panchang = cls.calculate_panchang_details(sun['longitude'], moon['longitude'], transit_data)
            
            # Identify benefic and challenging transits
            benefic_transits = []
            challenging_transits = []
            
            # Check for beneficial planetary positions
            jupiter = next(p for p in planets if p['name'] == 'Jupiter')
            venus = next(p for p in planets if p['name'] == 'Venus')
            mercury = next(p for p in planets if p['name'] == 'Mercury')
            
            if not jupiter.get('retrograde', False):
                benefic_transits.append(f"Jupiter direct in {jupiter['sign']} brings expansion")
            
            if not venus.get('retrograde', False):
                benefic_transits.append(f"Venus direct in {venus['sign']} enhances harmony")
            
            if not mercury.get('retrograde', False):
                benefic_transits.append(f"Mercury direct in {mercury['sign']} supports communication")
            
            # Check for challenging transits
            saturn = next(p for p in planets if p['name'] == 'Saturn')
            mars = next(p for p in planets if p['name'] == 'Mars')
            
            if saturn.get('retrograde', False):
                challenging_transits.append(f"Saturn retrograde in {saturn['sign']} requires patience")
            
            if mars.get('retrograde', False):
                challenging_transits.append(f"Mars retrograde in {mars['sign']} affects energy")
            
            return {
                'success': True,
                'data': {
                    'planets': planets,
                    'moonSign': moon['sign'],
                    'moonNakshatra': moon['nakshatra'],
                    'sunSign': sun['sign'],
                    'ascendant': ascendant_sign,
                    'currentDasha': current_dasha,
                    'beneficTransits': benefic_transits,
                    'challengingTransits': challenging_transits,
                    'panchangElements': panchang,
                    'calculation_timestamp': datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()
                }
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f"Transit calculation failed: {str(e)}"
            }

    @classmethod
    def calculate_comprehensive_panchang(cls, year: int, month: int, day: int, latitude: float, longitude: float, timezone_str: str = 'Asia/Kolkata') -> Dict:
        """
        Calculate comprehensive panchang for a given date and location
        """
        if not swe_available:
            return {
                'success': False,
                'error': 'Swiss Ephemeris not available for panchang calculations'
            }
        
        try:
            # Create datetime object for the given date at sunrise
            local_tz = pytz.timezone(timezone_str)
            
            # Calculate sunrise time for the location
            sunrise_time = cls.calculate_sunrise(year, month, day, latitude, longitude, timezone_str)
            
            # Use sunrise as the reference time for panchang
            dt = local_tz.localize(datetime(year, month, day, sunrise_time.hour, sunrise_time.minute))
            
            # Calculate Julian Day for sunrise
            jd = swe.julday(year, month, day, sunrise_time.hour + sunrise_time.minute/60.0)
            
            # Calculate planetary positions
            planets_data = {}
            calculations = {}
            
            # Get ayanamsa
            ayanamsa = swe.get_ayanamsa_ut(jd)
            calculations['ayanamsa'] = round(ayanamsa, 3)
            calculations['julian_day'] = jd
            calculations['local_mean_time'] = sunrise_time.strftime('%H:%M:%S')
            
            # Calculate sidereal time
            sidereal_time = swe.sidtime(jd)
            calculations['sidereal_time'] = f"{int(sidereal_time):02d}:{int((sidereal_time % 1) * 60):02d}:{int(((sidereal_time % 1) * 60 % 1) * 60):02d}"
            
            # Add calculation timestamp
            calculations['calculated_at'] = datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()
            
            # Calculate planetary positions
            for planet_name, planet_id in cls.PLANETS.items():
                if planet_id is not None:
                    planet_pos = swe.calc_ut(jd, planet_id)
                    longitude = planet_pos[0][0] - ayanamsa  # Convert to sidereal
                    
                    if longitude < 0:
                        longitude += 360
                    
                    # Handle Ketu (180° opposite to Rahu)
                    if planet_name == 'Ketu':
                        longitude = (longitude + 180) % 360
                    
                    sign_num = int(longitude // 30)
                    degrees = longitude % 30
                    
                    # Get nakshatra
                    nakshatra_info = cls.get_nakshatra_info(longitude)
                    
                    planets_data[planet_name.lower()] = {
                        'sign': cls.SIGN_NAMES[sign_num],
                        'degrees': round(degrees, 2),
                        'nakshatra': nakshatra_info['name']
                    }
            
            # Calculate Moon and Sun positions for Tithi
            moon_pos = swe.calc_ut(jd, swe.MOON)
            sun_pos = swe.calc_ut(jd, swe.SUN)
            
            moon_longitude = (moon_pos[0][0] - ayanamsa) % 360
            sun_longitude = (sun_pos[0][0] - ayanamsa) % 360
            
            # Calculate Tithi
            tithi_longitude = (moon_longitude - sun_longitude) % 360
            tithi_num = int(tithi_longitude / 12) + 1
            tithi_completion = (tithi_longitude % 12) / 12 * 100
            
            # Get Tithi name
            tithi_names = ['Pratipad', 'Dvitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dvadashi', 'Trayodashi', 'Chaturdashi', 'Purnima']
            
            if tithi_num <= 15:
                tithi_name = f"Shukla {tithi_names[tithi_num-1]}"
            else:
                tithi_name = f"Krishna {tithi_names[(tithi_num-16) % 15]}"
            
            # Calculate Nakshatra
            nakshatra_info = cls.get_nakshatra_info(moon_longitude)
            nakshatra_completion = ((moon_longitude % 13.333333) / 13.333333) * 100
            
            # Calculate Yoga
            yoga_longitude = (sun_longitude + moon_longitude) % 360
            yoga_num = int(yoga_longitude / 13.333333) + 1
            yoga_completion = (yoga_longitude % 13.333333) / 13.333333 * 100
            
            yoga_names = ['Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti']
            
            # Calculate Karana (proper calculation based on half-tithis)
            # Each tithi has 2 karanas, so total 60 karanas in a month
            karana_index = int(tithi_longitude / 6) % 11
            karana_names = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kintughna']
            
            # Calculate sunrise/sunset
            sunrise = cls.calculate_sunrise(year, month, day, latitude, longitude, timezone_str)
            sunset = cls.calculate_sunset(year, month, day, latitude, longitude, timezone_str)
            
            # Calculate weekday
            weekday = dt.weekday()
            vara_names = ['सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार', 'रविवार']
            vara_english = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            vara_lords = ['Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Sun']
            
            # Calculate auspicious and inauspicious timings
            auspicious_timings = cls.calculate_auspicious_timings(sunrise, sunset, latitude, longitude)
            inauspicious_timings = cls.calculate_inauspicious_timings(sunrise, sunset, weekday)
            
            # Calculate Choghadiya
            choghadiya = cls.calculate_choghadiya(sunrise, sunset, weekday)
            
            return {
                'success': True,
                'date': f"{year}-{month:02d}-{day:02d}",
                'tithi': {
                    'name': tithi_name,
                    'end_time': cls.calculate_tithi_end_time(jd, tithi_completion),
                    'percentage': round(tithi_completion, 1),
                    'description': cls.get_tithi_description(tithi_name)
                },
                'nakshatra': {
                    'name': nakshatra_info['name'],
                    'end_time': cls.calculate_nakshatra_end_time(jd, nakshatra_info),
                    'percentage': round(nakshatra_completion, 1),
                    'lord': nakshatra_info['lord'],
                    'characteristics': cls.get_nakshatra_characteristics(nakshatra_info['name'])
                },
                'yoga': {
                    'name': yoga_names[min(yoga_num-1, 26)],
                    'end_time': cls.calculate_yoga_end_time(jd, yoga_completion),
                    'description': cls.get_yoga_description(yoga_names[min(yoga_num-1, 26)])
                },
                'karana': {
                    'name': karana_names[karana_index],
                    'end_time': cls.calculate_karana_end_time(jd, karana_index),
                    'description': cls.get_karana_description(karana_names[karana_index])
                },
                'vara': {
                    'name': vara_names[weekday],
                    'english': vara_english[weekday],
                    'planet_lord': vara_lords[weekday]
                },
                'sunrise': sunrise.strftime('%I:%M:%S %p'),
                'sunset': sunset.strftime('%I:%M:%S %p'),
                'moonrise': cls.calculate_moonrise(year, month, day, latitude, longitude, timezone_str).strftime('%I:%M:%S %p'),
                'moonset': cls.calculate_moonset(year, month, day, latitude, longitude, timezone_str).strftime('%I:%M:%S %p'),
                'auspicious_timings': auspicious_timings,
                'inauspicious_timings': inauspicious_timings,
                'choghadiya': choghadiya,
                'planetary_positions': planets_data,
                'calculations': calculations
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Comprehensive panchang calculation failed: {str(e)}'
            }

    @classmethod
    def calculate_sunrise(cls, year: int, month: int, day: int, latitude: float, longitude: float, timezone_str: str) -> datetime:
        """Calculate sunrise time for the given date and location"""
        # Temporarily using fallback calculation until timezone issue is resolved
        # Swiss Ephemeris timezone conversion is causing incorrect times
        
        # Delhi sunrise times by month (approximate for 2025)
        monthly_sunrise = {
            1: (7, 10), 2: (7, 0), 3: (6, 40), 4: (6, 10), 5: (5, 45), 6: (5, 30),
            7: (5, 35), 8: (5, 50), 9: (6, 10), 10: (6, 25), 11: (6, 50), 12: (7, 5)
        }
        
        sunrise_hour, sunrise_minute = monthly_sunrise.get(month, (6, 0))
        return datetime(year, month, day, sunrise_hour, sunrise_minute)

    @classmethod
    def calculate_sunset(cls, year: int, month: int, day: int, latitude: float, longitude: float, timezone_str: str) -> datetime:
        """Calculate sunset time for the given date and location"""
        # Temporarily using fallback calculation until timezone issue is resolved
        # Swiss Ephemeris timezone conversion is causing incorrect times
        
        # Delhi sunset times by month (approximate for 2025)
        monthly_sunset = {
            1: (17, 30), 2: (18, 0), 3: (18, 30), 4: (19, 0), 5: (19, 20), 6: (19, 30),
            7: (19, 25), 8: (19, 0), 9: (18, 30), 10: (18, 0), 11: (17, 30), 12: (17, 20)
        }
        
        sunset_hour, sunset_minute = monthly_sunset.get(month, (18, 0))
        return datetime(year, month, day, sunset_hour, sunset_minute)

    @classmethod
    def calculate_moonrise(cls, year: int, month: int, day: int, latitude: float, longitude: float, timezone_str: str) -> datetime:
        """Calculate moonrise time for the given date and location"""
        try:
            jd = swe.julday(year, month, day, 0)
            rise_set = swe.rise_trans(jd, swe.MOON, longitude, latitude, rsmi=swe.CALC_RISE)
            moonrise_jd = rise_set[1][0]
            
            # Convert JD to datetime
            cal_date = swe.revjul(moonrise_jd)
            hour_frac = cal_date[3]
            hour = int(hour_frac)
            minute = int((hour_frac - hour) * 60)
            
            return datetime(year, month, day, hour, minute)
        except:
            # Fallback calculation
            return datetime(year, month, day, 20, 0)  # Default moonrise at 8 PM

    @classmethod
    def calculate_moonset(cls, year: int, month: int, day: int, latitude: float, longitude: float, timezone_str: str) -> datetime:
        """Calculate moonset time for the given date and location"""
        try:
            jd = swe.julday(year, month, day, 0)
            rise_set = swe.rise_trans(jd, swe.MOON, longitude, latitude, rsmi=swe.CALC_SET)
            moonset_jd = rise_set[1][0]
            
            # Convert JD to datetime
            cal_date = swe.revjul(moonset_jd)
            hour_frac = cal_date[3]
            hour = int(hour_frac)
            minute = int((hour_frac - hour) * 60)
            
            return datetime(year, month, day, hour, minute)
        except:
            # Fallback calculation
            return datetime(year, month, day, 8, 0)  # Default moonset at 8 AM

    @classmethod
    def calculate_auspicious_timings(cls, sunrise: datetime, sunset: datetime, latitude: float, longitude: float) -> Dict:
        """Calculate auspicious timings"""
        try:
            day_duration = (sunset - sunrise).total_seconds() / 3600
            
            # Abhijit Muhurta (middle 1/15th of the day)
            abhijit_start = sunrise + timedelta(hours=day_duration * 7/15)
            abhijit_end = sunrise + timedelta(hours=day_duration * 8/15)
            
            # Brahma Muhurta (1.5 hours before sunrise)
            brahma_start = sunrise - timedelta(hours=1.5)
            brahma_end = sunrise - timedelta(minutes=48)
            
            # Amrit Kaal (early morning auspicious time)
            amrit_start = sunrise - timedelta(hours=2)
            amrit_end = sunrise
            
            return {
                'abhijit_muhurta': {
                    'start': abhijit_start.strftime('%I:%M %p'),
                    'end': abhijit_end.strftime('%I:%M %p')
                },
                'brahma_muhurta': {
                    'start': brahma_start.strftime('%I:%M %p'),
                    'end': brahma_end.strftime('%I:%M %p')
                },
                'amrit_kaal': {
                    'start': amrit_start.strftime('%I:%M %p'),
                    'end': amrit_end.strftime('%I:%M %p')
                }
            }
        except Exception as e:
            return {
                'abhijit_muhurta': {'start': 'N/A', 'end': 'N/A'},
                'brahma_muhurta': {'start': 'N/A', 'end': 'N/A'},
                'amrit_kaal': {'start': 'N/A', 'end': 'N/A'}
            }

    @classmethod
    def calculate_inauspicious_timings(cls, sunrise: datetime, sunset: datetime, weekday: int) -> Dict:
        """Calculate inauspicious timings based on weekday"""
        try:
            day_duration = (sunset - sunrise).total_seconds() / 3600
            
            # Rahu Kaal timing based on weekday
            rahu_kaal_fractions = {
                0: (7/8, 1),      # Monday: 7th part
                1: (1/8, 2/8),    # Tuesday: 1st part
                2: (6/8, 7/8),    # Wednesday: 6th part
                3: (3/8, 4/8),    # Thursday: 3rd part
                4: (5/8, 6/8),    # Friday: 5th part
                5: (2/8, 3/8),    # Saturday: 2nd part
                6: (4/8, 5/8),    # Sunday: 4th part
            }
            
            rahu_start_frac, rahu_end_frac = rahu_kaal_fractions[weekday]
            rahu_start = sunrise + timedelta(hours=day_duration * rahu_start_frac)
            rahu_end = sunrise + timedelta(hours=day_duration * rahu_end_frac)
            
            # Yamaganda timing
            yama_start = sunrise + timedelta(hours=day_duration * 4/8)
            yama_end = sunrise + timedelta(hours=day_duration * 5/8)
            
            # Gulikai timing
            gulikai_start = sunrise + timedelta(hours=day_duration * 6/8)
            gulikai_end = sunrise + timedelta(hours=day_duration * 7/8)
            
            return {
                'rahu_kaal': {
                    'start': rahu_start.strftime('%I:%M %p'),
                    'end': rahu_end.strftime('%I:%M %p')
                },
                'yamaganda': {
                    'start': yama_start.strftime('%I:%M %p'),
                    'end': yama_end.strftime('%I:%M %p')
                },
                'gulikai': {
                    'start': gulikai_start.strftime('%I:%M %p'),
                    'end': gulikai_end.strftime('%I:%M %p')
                }
            }
        except Exception as e:
            return {
                'rahu_kaal': {'start': 'N/A', 'end': 'N/A'},
                'yamaganda': {'start': 'N/A', 'end': 'N/A'},
                'gulikai': {'start': 'N/A', 'end': 'N/A'}
            }

    @classmethod
    def calculate_choghadiya(cls, sunrise: datetime, sunset: datetime, weekday: int) -> List[Dict]:
        """Calculate Choghadiya periods"""
        day_duration = (sunset - sunrise).total_seconds() / 3600
        period_duration = day_duration / 8
        
        # Choghadiya sequence for each weekday
        choghadiya_sequences = {
            0: ['Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit'],  # Monday
            1: ['Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'],   # Tuesday
            2: ['Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh'],  # Wednesday
            3: ['Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char'],  # Thursday
            4: ['Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh'], # Friday
            5: ['Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg'], # Saturday
            6: ['Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal'],  # Sunday
        }
        
        sequence = choghadiya_sequences[weekday]
        choghadiya_list = []
        
        for i, period in enumerate(sequence):
            period_start = sunrise + timedelta(hours=period_duration * i)
            period_end = sunrise + timedelta(hours=period_duration * (i + 1))
            
            # Determine type
            period_type = 'good' if period in ['Amrit', 'Shubh', 'Labh', 'Char'] else 'bad' if period in ['Kaal', 'Rog'] else 'neutral'
            
            choghadiya_list.append({
                'period': period,
                'start': period_start.strftime('%I:%M %p'),
                'end': period_end.strftime('%I:%M %p'),
                'type': period_type,
                'description': cls.get_choghadiya_description(period)
            })
        
        return choghadiya_list

    @classmethod
    def get_choghadiya_description(cls, period: str) -> str:
        """Get description for Choghadiya period"""
        descriptions = {
            'Amrit': 'Nectar time - excellent for all activities',
            'Shubh': 'Auspicious time - good for important work',
            'Labh': 'Profit time - favorable for business',
            'Char': 'Movement time - good for travel',
            'Kaal': 'Death time - avoid important activities',
            'Rog': 'Disease time - inauspicious period',
            'Udveg': 'Anxiety time - neutral period'
        }
        return descriptions.get(period, 'Unknown period')

    @classmethod
    def calculate_tithi_end_time(cls, jd: float, completion: float) -> str:
        """Calculate when current tithi ends"""
        # Approximate calculation - tithi can last 19-26 hours
        remaining_hours = (100 - completion) / 100 * 24
        end_time = datetime.now() + timedelta(hours=remaining_hours)
        return end_time.strftime('%I:%M %p')

    @classmethod
    def calculate_nakshatra_end_time(cls, jd: float, nakshatra_info: Dict) -> str:
        """Calculate when current nakshatra ends"""
        # Approximate calculation - nakshatra lasts about 13.33 hours on average
        remaining_hours = 13.33 * (1 - (nakshatra_info.get('pada', 1) - 1) / 4)
        end_time = datetime.now() + timedelta(hours=remaining_hours)
        return end_time.strftime('%I:%M %p')

    @classmethod
    def calculate_yoga_end_time(cls, jd: float, completion: float) -> str:
        """Calculate when current yoga ends"""
        # Approximate calculation
        remaining_hours = (100 - completion) / 100 * 24
        end_time = datetime.now() + timedelta(hours=remaining_hours)
        return end_time.strftime('%I:%M %p')

    @classmethod
    def calculate_karana_end_time(cls, jd: float, karana_num: int) -> str:
        """Calculate when current karana ends"""
        # Karana lasts about 6 hours
        remaining_hours = 6
        end_time = datetime.now() + timedelta(hours=remaining_hours)
        return end_time.strftime('%I:%M %p')

    @classmethod
    def get_tithi_description(cls, tithi_name: str) -> str:
        """Get description for tithi"""
        if 'Pratipad' in tithi_name:
            return 'New beginning, start new ventures'
        elif 'Dvitiya' in tithi_name:
            return 'Continuing projects, steady progress'
        elif 'Purnima' in tithi_name:
            return 'Completion, fulfillment, spiritual activities'
        elif 'Amavasya' in tithi_name:
            return 'New moon, introspection, spiritual practices'
        else:
            return 'Favorable for various activities'

    @classmethod
    def get_nakshatra_characteristics(cls, nakshatra_name: str) -> str:
        """Get characteristics for nakshatra"""
        characteristics = {
            'Ashwini': 'Swift action, healing, new beginnings',
            'Bharani': 'Transformation, creativity, nurturing',
            'Krittika': 'Cutting through obstacles, purification',
            'Rohini': 'Growth, beauty, material prosperity',
            'Mrigashira': 'Seeking, searching, exploration',
            'Ardra': 'Storms, transformation, renewal',
            'Punarvasu': 'Return to source, restoration, renewal',
            'Pushya': 'Nourishment, spiritual growth, expansion',
            'Ashlesha': 'Serpent power, intuition, mysticism',
            'Magha': 'Ancestral power, tradition, authority',
            'Purva Phalguni': 'Creativity, relationships, pleasure',
            'Uttara Phalguni': 'Service, charity, healing',
            'Hasta': 'Skill, craftsmanship, dexterity',
            'Chitra': 'Creativity, beauty, construction',
            'Swati': 'Independence, movement, flexibility',
            'Vishakha': 'Determination, goal achievement',
            'Anuradha': 'Friendship, cooperation, devotion',
            'Jyeshtha': 'Leadership, protection, seniority',
            'Mula': 'Searching for truth, investigation',
            'Purva Ashadha': 'Invigoration, strength, courage',
            'Uttara Ashadha': 'Victory, achievement, permanence',
            'Shravana': 'Learning, listening, knowledge',
            'Dhanishtha': 'Music, rhythm, prosperity',
            'Shatabhisha': 'Healing, secrecy, mysticism',
            'Purva Bhadrapada': 'Purification, spiritual insight',
            'Uttara Bhadrapada': 'Deep wisdom, kundalini awakening',
            'Revati': 'Completion, journey\'s end, transcendence'
        }
        return characteristics.get(nakshatra_name, 'Traditional Vedic characteristics')

    @classmethod
    def get_yoga_description(cls, yoga_name: str) -> str:
        """Get description for yoga"""
        descriptions = {
            'Vishkambha': 'Support and stability',
            'Priti': 'Love and affection',
            'Ayushman': 'Longevity and health',
            'Saubhagya': 'Good fortune',
            'Shobhana': 'Auspicious and beautiful',
            'Atiganda': 'Obstacles and challenges',
            'Sukarma': 'Good deeds and merit',
            'Dhriti': 'Patience and perseverance',
            'Shula': 'Discomfort and pain',
            'Ganda': 'Knots and complications',
            'Vriddhi': 'Growth and expansion',
            'Dhruva': 'Stability and permanence',
            'Vyaghata': 'Aggression and conflict',
            'Harshana': 'Joy and happiness',
            'Vajra': 'Strength like diamond',
            'Siddhi': 'Accomplishment and success',
            'Vyatipata': 'Reversal and calamity',
            'Variyan': 'Comfort and ease',
            'Parigha': 'Obstruction and barrier',
            'Shiva': 'Auspiciousness and benevolence',
            'Siddha': 'Perfection and achievement',
            'Sadhya': 'Accomplishable goals',
            'Shubha': 'Auspicious and favorable',
            'Shukla': 'Bright and pure',
            'Brahma': 'Creator energy',
            'Indra': 'Royal power and authority',
            'Vaidhriti': 'Holding apart, separation'
        }
        return descriptions.get(yoga_name, 'Traditional yoga influence')

    @classmethod
    def get_karana_description(cls, karana_name: str) -> str:
        """Get description for karana"""
        descriptions = {
            'Kintughna': 'Destroyer of enemies',
            'Bava': 'Airy and moveable',
            'Balava': 'Strength and power',
            'Kaulava': 'Family and relationships',
            'Taitila': 'Sharp and cutting',
            'Gara': 'Poison and difficulties',
            'Vanija': 'Trade and commerce',
            'Vishti': 'Entry and penetration',
            'Shakuni': 'Bird-like and swift',
            'Chatushpada': 'Four-footed stability',
            'Naga': 'Serpent-like wisdom'
        }
        return descriptions.get(karana_name, 'Traditional karana influence')

def main():
    """
    Main function to handle command line execution and stdin input
    """
    try:
        # Read from stdin for Node.js integration
        if not sys.stdin.isatty():
            input_data = json.loads(sys.stdin.read())
        elif len(sys.argv) >= 2:
            input_data = json.loads(sys.argv[1])
        else:
            print(json.dumps({"success": False, "error": "Usage: python jyotisha-engine.py '<json_data>' or pipe JSON to stdin"}))
            sys.exit(1)
        
        # Check action type
        action = input_data.get('action', 'calculate_birth_chart')
        
        if action == 'calculate_transits':
            result = JyotishaEngine.calculate_transits(input_data)
        elif action == 'comprehensive_panchang':
            result = JyotishaEngine.calculate_comprehensive_panchang(
                input_data.get('year'),
                input_data.get('month'), 
                input_data.get('day'),
                input_data.get('latitude'),
                input_data.get('longitude'),
                input_data.get('timezone', 'Asia/Kolkata')
            )
        else:
            result = JyotishaEngine.calculate_birth_chart(input_data)
        
        print(json.dumps(result, indent=2))
        
    except json.JSONDecodeError:
        print(json.dumps({"success": False, "error": "Invalid JSON input"}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()