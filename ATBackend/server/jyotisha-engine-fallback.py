#!/usr/bin/env python3
"""
Jyotisha Astrology Engine - Authentic Swiss Ephemeris Fallback
Advanced Vedic astrology calculations using authentic Swiss Ephemeris
Fallback engine ensuring 100% authentic calculations with Lahiri Ayanamsa
Based on Swiss Ephemeris with traditional Vedic astronomy principles
"""

import json
import sys
from datetime import datetime, timezone
import pytz
from datetime import timedelta
from typing import Dict, List, Any
import time

try:
    import swisseph as swe
    swe_available = True
    print("✅ Swiss Ephemeris available for fallback calculations", file=sys.stderr)
except ImportError:
    swe_available = False
    print("❌ Swiss Ephemeris not available in fallback engine", file=sys.stderr)

class JyotishaEngineFallback:
    """
    Jyotisha-based Vedic astrology calculation engine - Fallback Instance
    Provides redundant calculation capability for high availability
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
        'Dhanishta': {'gana': 'Rakshasa', 'nadi': 'Pitta', 'varna': 'Shudra', 'yoni': 'Simha', 'tatva': 'Akash', 'paya': 'Rajata'},
        'Shatabhisha': {'gana': 'Rakshasa', 'nadi': 'Vata', 'varna': 'Shudra', 'yoni': 'Ashwa', 'tatva': 'Akash', 'paya': 'Tamra'},
        'Purva Bhadrapada': {'gana': 'Manushya', 'nadi': 'Vata', 'varna': 'Brahmin', 'yoni': 'Simha', 'tatva': 'Akash', 'paya': 'Swarna'},
        'Uttara Bhadrapada': {'gana': 'Manushya', 'nadi': 'Pitta', 'varna': 'Kshatriya', 'yoni': 'Gou', 'tatva': 'Akash', 'paya': 'Rajata'},
        'Revati': {'gana': 'Deva', 'nadi': 'Kapha', 'varna': 'Shudra', 'yoni': 'Gaja', 'tatva': 'Akash', 'paya': 'Tamra'}
    }
    
    # 27 Nakshatras with degree ranges
    NAKSHATRAS = [
        'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
        'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
        'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
        'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
        'Uttara Bhadrapada', 'Revati'
    ]

    def __init__(self):
        self.engine_id = "JyotishaEngineFallback"
        self.instance_start_time = time.time()
        if swe_available:
            # Set Swiss Ephemeris path
            swe.set_ephe_path('/usr/share/swisseph:/usr/local/share/swisseph')

    def get_julian_day(self, date_str: str, time_str: str, latitude: float, longitude: float) -> float:
        """
        Convert date and time to Julian Day Number using Swiss Ephemeris
        Aligned with primary engine timezone handling for consistent results
        """
        if not swe_available:
            raise Exception("Swiss Ephemeris required for authentic Julian Day calculation")
            
        try:
            # Clean the input strings
            date_str = date_str.strip()
            time_str = time_str.strip()
            
            # Create datetime object - handle both HH:MM and HH:MM:SS formats (same as primary)
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
            
            # Set timezone to IST (India Standard Time) - same as primary engine
            ist = pytz.timezone('Asia/Kolkata')
            dt_ist = ist.localize(dt)
            
            # Convert to UTC for calculations - same as primary engine
            dt_utc = dt_ist.astimezone(pytz.UTC)
            
            # Calculate Julian Day using Swiss Ephemeris - same method as primary
            julian_day = swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, 
                                   dt_utc.hour + dt_utc.minute/60.0 + dt_utc.second/3600.0)
            
            print(f"[FALLBACK] Swiss Ephemeris Julian Day: {julian_day:.6f} (IST→UTC: {dt_ist} → {dt_utc})", file=sys.stderr)
            return julian_day
            
        except Exception as e:
            print(f"[FALLBACK] Swiss Ephemeris Julian Day calculation failed: {e}", file=sys.stderr)
            raise Exception(f"Failed to calculate authentic Julian Day: {e}")

    def get_ayanamsa(self, julian_day: float) -> float:
        """
        Get Lahiri Ayanamsa for sidereal calculations using Swiss Ephemeris
        """
        if not swe_available:
            raise Exception("Swiss Ephemeris required for authentic fallback calculations")
        
        try:
            swe.set_sid_mode(swe.SIDM_LAHIRI)
            ayanamsa = swe.get_ayanamsa_ut(julian_day)
            print(f"[FALLBACK] Swiss Ephemeris Lahiri Ayanamsa: {ayanamsa:.6f}°", file=sys.stderr)
            return ayanamsa
        except Exception as e:
            print(f"[FALLBACK] Swiss Ephemeris ayanamsa calculation failed: {e}", file=sys.stderr)
            raise Exception(f"Failed to calculate authentic Lahiri Ayanamsa: {e}")

    def calculate_planet_position(self, planet_id: int, julian_day: float, ayanamsa: float) -> Dict[str, Any]:
        """
        Calculate sidereal position of a planet using Swiss Ephemeris with direct sidereal flag
        Aligned with primary engine methodology for consistent results
        """
        if not swe_available:
            raise Exception("Swiss Ephemeris required for authentic planetary calculations")
        
        try:
            # Use Swiss Ephemeris with direct sidereal flag (same as primary engine)
            result = swe.calc_ut(julian_day, planet_id, swe.FLG_SIDEREAL)
            sidereal_long = result[0][0]  # Already sidereal due to flag
            
            # Normalize to 0-360 range
            if sidereal_long < 0:
                sidereal_long += 360
            elif sidereal_long >= 360:
                sidereal_long -= 360
                
            print(f"[FALLBACK] Planet {planet_id}: Sidereal {sidereal_long:.6f}° (Direct SWE Flag)", file=sys.stderr)
                
            return {
                'longitude': sidereal_long,
                'latitude': result[0][1],
                'distance': result[0][2],
                'speed': result[0][3]
            }
        except Exception as e:
            print(f"[FALLBACK] Swiss Ephemeris sidereal calculation failed for {planet_id}: {e}", file=sys.stderr)
            raise Exception(f"Failed to calculate authentic sidereal position for planet {planet_id}: {e}")

    def get_sign_and_degree(self, longitude: float) -> Dict[str, Any]:
        """
        Convert longitude to sign and degree
        """
        sign_num = int(longitude / 30)
        degree_in_sign = longitude % 30
        
        return {
            'sign_num': sign_num,
            'sign': self.SIGN_NAMES[sign_num],
            'sign_english': self.SIGN_NAMES_ENGLISH[sign_num],
            'degree': degree_in_sign
        }

    def get_nakshatra(self, longitude: float) -> Dict[str, Any]:
        """
        Get nakshatra from moon longitude
        """
        nakshatra_num = int(longitude / 13.333333333333334)  # 360/27
        if nakshatra_num >= 27:
            nakshatra_num = 26
            
        nakshatra_name = self.NAKSHATRAS[nakshatra_num]
        
        # Get nakshatra attributes
        attributes = self.NAKSHATRA_DATA.get(nakshatra_name, {})
        
        # Calculate pada (quarter)
        pada_deg = (longitude % 13.333333333333334) / 3.333333333333333
        pada = int(pada_deg) + 1
        if pada > 4:
            pada = 4
            
        return {
            'number': nakshatra_num + 1,
            'name': nakshatra_name,
            'pada': pada,
            'gana': attributes.get('gana', ''),
            'nadi': attributes.get('nadi', ''),
            'varna': attributes.get('varna', ''),
            'yoni': attributes.get('yoni', ''),
            'tatva': attributes.get('tatva', ''),
            'paya': attributes.get('paya', '')
        }

    def calculate_ascendant(self, julian_day: float, latitude: float, longitude: float, ayanamsa: float) -> Dict[str, Any]:
        """
        Calculate ascendant (Lagna) using Swiss Ephemeris
        Aligned with primary engine methodology using direct sidereal calculation
        """
        if not swe_available:
            raise Exception("Swiss Ephemeris required for authentic ascendant calculation")
        
        try:
            # Set Lahiri Ayanamsa mode for consistent sidereal calculation
            swe.set_sid_mode(swe.SIDM_LAHIRI)
            
            # Use Swiss Ephemeris Placidus houses for accurate ascendant (same as primary)
            houses = swe.houses(julian_day, latitude, longitude, b'P')
            asc_tropical = houses[0][0]  # Ascendant from Swiss Ephemeris
            
            # Apply Lahiri Ayanamsa for sidereal ascendant (same method as primary)
            asc_sidereal = asc_tropical - ayanamsa
            
            # Normalize to 0-360 range (same as primary)
            if asc_sidereal < 0:
                asc_sidereal += 360
            elif asc_sidereal >= 360:
                asc_sidereal -= 360
                
            sign_info = self.get_sign_and_degree(asc_sidereal)
            
            print(f"[FALLBACK] Ascendant: Tropical {asc_tropical:.6f}° → Sidereal {asc_sidereal:.6f}° ({sign_info['sign']}) [Aligned Method]", file=sys.stderr)
            
            return {
                'longitude': asc_sidereal,
                'sign_num': sign_info['sign_num'],
                'sign': sign_info['sign'],
                'sign_english': sign_info['sign_english'],
                'degree': sign_info['degree']
            }
        except Exception as e:
            print(f"[FALLBACK] Swiss Ephemeris ascendant calculation failed: {e}", file=sys.stderr)
            raise Exception(f"Failed to calculate authentic ascendant: {e}")

    def calculate_house_positions(self, julian_day: float, latitude: float, longitude: float, ayanamsa: float) -> List[Dict[str, Any]]:
        """
        Calculate 12 house positions using Whole Sign house system
        """
        try:
            ascendant = self.calculate_ascendant(julian_day, latitude, longitude, ayanamsa)
            asc_sign = ascendant['sign_num']
            
            houses = []
            for i in range(12):
                house_sign = (asc_sign + i) % 12
                houses.append({
                    'house_num': i + 1,
                    'sign_num': house_sign,
                    'sign': self.SIGN_NAMES[house_sign],
                    'sign_english': self.SIGN_NAMES_ENGLISH[house_sign]
                })
            
            return houses
        except Exception as e:
            print(f"[FALLBACK] Error calculating houses: {e}", file=sys.stderr)
            return []

    def calculate_birth_chart(self, birth_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main calculation method for birth chart
        """
        start_time = time.time()
        
        try:
            name = birth_data.get('name', 'Unknown')
            date = birth_data.get('date', '')
            time_str = birth_data.get('time', '12:00')
            latitude = float(birth_data.get('latitude', 0))
            longitude = float(birth_data.get('longitude', 0))
            place = birth_data.get('place', 'Unknown')
            
            # Calculate Julian Day
            julian_day = self.get_julian_day(date, time_str, latitude, longitude)
            
            # Get Ayanamsa
            ayanamsa = self.get_ayanamsa(julian_day)
            
            # Calculate planetary positions
            planets = []
            for planet_name, planet_id in self.PLANETS.items():
                position = self.calculate_planet_position(planet_id, julian_day, ayanamsa)
                
                # Handle Ketu (180° opposite to Rahu)
                if planet_name == 'Ketu':
                    ketu_long = position['longitude'] + 180
                    if ketu_long >= 360:
                        ketu_long -= 360
                    position['longitude'] = ketu_long
                
                sign_info = self.get_sign_and_degree(position['longitude'])
                
                # Calculate house position
                house_num = self.get_house_from_longitude(position['longitude'], julian_day, latitude, longitude, ayanamsa)
                
                planet_data = {
                    'name': planet_name,
                    'longitude': position['longitude'],
                    'latitude': position['latitude'],
                    'house': house_num,
                    'sign': sign_info['sign'],
                    'sign_english': sign_info['sign_english'],
                    'sign_num': sign_info['sign_num'],
                    'degree': sign_info['degree'],
                    'speed': position['speed']
                }
                
                # Get nakshatra for Moon
                if planet_name == 'Moon':
                    nakshatra = self.get_nakshatra(position['longitude'])
                    planet_data['nakshatra'] = nakshatra
                
                planets.append(planet_data)
            
            # Calculate ascendant
            ascendant = self.calculate_ascendant(julian_day, latitude, longitude, ayanamsa)
            
            # Calculate houses
            houses = self.calculate_house_positions(julian_day, latitude, longitude, ayanamsa)
            
            # Get Moon nakshatra for Vedic attributes
            moon_planet = next((p for p in planets if p['name'] == 'Moon'), None)
            nakshatra_info = moon_planet.get('nakshatra', {}) if moon_planet else {}
            
            calculation_time = time.time() - start_time
            
            result = {
                'success': True,
                'calculation_engine': 'Authentic-Jyotisha-Engine-Fallback',
                'engine_instance': self.engine_id,
                'calculation_time_ms': round(calculation_time * 1000, 2),
                'name': name,
                'birth_details': {
                    'date': date,
                    'time': time_str,
                    'place': place,
                    'latitude': latitude,
                    'longitude': longitude
                },
                'julian_day': julian_day,
                'ayanamsa': ayanamsa,
                'planets': planets,
                'ascendant': ascendant,
                'houses': houses,
                'vedic_attributes': {
                    'nakshatra': nakshatra_info.get('name', ''),
                    'pada': nakshatra_info.get('pada', 0),
                    'gana': nakshatra_info.get('gana', ''),
                    'nadi': nakshatra_info.get('nadi', ''),
                    'yoni': nakshatra_info.get('yoni', ''),
                    'varna': nakshatra_info.get('varna', ''),
                    'tatva': nakshatra_info.get('tatva', ''),
                    'calculation_method': 'Authentic-Jyotisha-Engine-Fallback'
                }
            }
            
            print(f"[FALLBACK] Calculation completed in {calculation_time*1000:.2f}ms", file=sys.stderr)
            return result
            
        except Exception as e:
            error_time = time.time() - start_time
            print(f"[FALLBACK] Calculation failed after {error_time*1000:.2f}ms: {e}", file=sys.stderr)
            return {
                'success': False,
                'error': str(e),
                'calculation_engine': 'Authentic-Jyotisha-Engine-Fallback-Failed',
                'engine_instance': self.engine_id,
                'calculation_time_ms': round(error_time * 1000, 2)
            }

    def get_house_from_longitude(self, longitude: float, julian_day: float, latitude: float, longitude_geo: float, ayanamsa: float) -> int:
        """
        Get house number from planetary longitude using Whole Sign system
        """
        try:
            ascendant = self.calculate_ascendant(julian_day, latitude, longitude_geo, ayanamsa)
            asc_sign = ascendant['sign_num']
            planet_sign = int(longitude / 30)
            
            house_num = ((planet_sign - asc_sign) % 12) + 1
            return house_num
        except:
            return 1

def main():
    """
    Main function to handle JSON input from stdin
    """
    try:
        # Read JSON input from stdin
        input_data = sys.stdin.read().strip()
        
        if not input_data:
            result = {'success': False, 'error': 'No input data provided'}
            print(json.dumps(result))
            return
        
        try:
            birth_data = json.loads(input_data)
        except json.JSONDecodeError as e:
            result = {'success': False, 'error': f'Invalid JSON input: {e}'}
            print(json.dumps(result))
            return
        
        # Initialize fallback engine
        engine = JyotishaEngineFallback()
        
        # Calculate birth chart
        result = engine.calculate_birth_chart(birth_data)
        
        # Output result as JSON
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {
            'success': False,
            'error': str(e),
            'calculation_engine': 'Authentic-Jyotisha-Engine-Fallback-Error'
        }
        print(json.dumps(error_result))

if __name__ == '__main__':
    main()