#!/usr/bin/env python3
"""
JEMicro (Jyotisha Engine Micro)
Micro-optimized Vedic astrology engine cloned from primary Jyotisha engine
Third-tier calculation engine for enhanced redundancy
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
    print("✅ [JEMICRO] Swiss Ephemeris available for calculations", file=sys.stderr)
except ImportError:
    swe_available = False
    print("❌ [JEMICRO] Swiss Ephemeris not available", file=sys.stderr)

class JyotishaMicroEngine:
    """
    JEMicro - Micro-optimized Vedic astrology calculation engine
    Cloned from primary engine with optimizations for tertiary redundancy
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
    
    # Nakshatra sequence for astronomical calculations (lords only - degrees calculated dynamically)
    NAKSHATRA_LORDS = [
        'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
        'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 
        'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'
    ]
    
    # Nakshatra names for astronomical calculations
    NAKSHATRA_NAMES = [
        'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
        'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
        'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
    ]
    
    def __init__(self):
        """Initialize JEMicro engine"""
        print("[JEMICRO] Initializing Micro Vedic Astrology Engine", file=sys.stderr)
        if swe_available:
            # Set ephemeris path if available
            swe.set_ephe_path('/usr/share/swisseph:/usr/local/share/swisseph:.')
            print("[JEMICRO] Swiss Ephemeris initialized", file=sys.stderr)
    
    def calculate_birth_chart(self, birth_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Micro-optimized birth chart calculation
        """
        try:
            print(f"[JEMICRO] Processing birth data: {birth_data['name']}", file=sys.stderr)
            
            # Parse birth details
            birth_date = datetime.fromisoformat(birth_data['date'] + 'T' + birth_data['time'])
            latitude = float(birth_data['latitude'])
            longitude = float(birth_data['longitude'])
            
            # Convert to UTC for calculations
            ist = pytz.timezone('Asia/Kolkata')
            utc_time = ist.localize(birth_date).astimezone(pytz.UTC)
            # Calculate Julian Day using exact same pattern as primary engine
            julian_day = swe.julday(utc_time.year, utc_time.month, utc_time.day, 
                                   utc_time.hour + utc_time.minute/60.0 + utc_time.second/3600.0)
            
            print(f"[JEMICRO] Julian Day: {julian_day}", file=sys.stderr)
            
            # Set ayanamsa (Lahiri) following primary engine pattern
            swe.set_sid_mode(swe.SIDM_LAHIRI)
            
            # Calculate Ayanamsa (Lahiri) 
            ayanamsa = swe.get_ayanamsa_ut(julian_day)
            print(f"[JEMICRO] Ayanamsa: {ayanamsa:.6f}°", file=sys.stderr)
            
            # Calculate ascendant using houses function with coordinates
            houses_result = swe.houses(julian_day, latitude, longitude, b'P')  # Placidus house system
            ascendant_tropical = houses_result[1][0]  # First house cusp (ascendant)
            
            # Convert to sidereal by subtracting ayanamsa
            ascendant_sidereal = ascendant_tropical - ayanamsa
            if ascendant_sidereal < 0:
                ascendant_sidereal += 360
                
            ascendant_sign = int(ascendant_sidereal / 30)
            print(f"[JEMICRO] Ascendant: {ascendant_sidereal:.6f}° in {self.SIGN_NAMES[ascendant_sign]}", file=sys.stderr)
            
            # Calculate planetary positions
            planets_data = []
            for planet_name, planet_id in self.PLANETS.items():
                try:
                    # Calculate sidereal position directly using primary engine pattern
                    if planet_name == 'Ketu':
                        # Calculate Rahu position first, then Ketu is 180° opposite
                        rahu_pos = swe.calc_ut(julian_day, self.PLANETS['Rahu'], swe.FLG_SIDEREAL)[0][0]
                        longitude_sidereal = rahu_pos + 180.0
                        if longitude_sidereal >= 360.0:
                            longitude_sidereal -= 360.0
                    else:
                        # Calculate planet position using sidereal flag
                        result = swe.calc_ut(julian_day, planet_id, swe.FLG_SIDEREAL)
                        longitude_sidereal = result[0][0]

                    
                    # Calculate sign and house
                    sign_num = int(longitude_sidereal / 30)
                    degree_in_sign = longitude_sidereal % 30
                    sign_name = self.SIGN_NAMES[sign_num]
                    
                    # Calculate nakshatra
                    nakshatra_name, nakshatra_lord = self.get_nakshatra(longitude_sidereal)
                    
                    # Calculate house using whole sign system (ascendant already calculated)
                    house = ((sign_num - ascendant_sign) % 12) + 1
                    
                    planets_data.append({
                        'name': planet_name,
                        'longitude': longitude_sidereal,
                        'sign': sign_name,
                        'degree': f"{int(degree_in_sign)}°{int((degree_in_sign % 1) * 60):02d}'",
                        'nakshatra': nakshatra_name,
                        'nakshatraLord': nakshatra_lord,
                        'house': house
                    })
                    
                except Exception as e:
                    print(f"[JEMICRO] Error calculating {planet_name}: {e}", file=sys.stderr)
            
            # Ascendant already calculated above
            
            # Calculate Vimshottari Dasha
            moon_longitude = next((p['longitude'] for p in planets_data if p['name'] == 'Moon'), 0)
            dasha_data = self.calculate_vimshottari_dasha(moon_longitude, birth_date)
            
            result = {
                'success': True,
                'planets': planets_data,
                'ascendant': {
                    'longitude': ascendant_sidereal,
                    'sign': self.SIGN_NAMES[ascendant_sign]
                },
                'dasha': dasha_data,
                'ayanamsa': ayanamsa,
                'julianDay': julian_day,
                'coordinates': {
                    'latitude': latitude,
                    'longitude': longitude
                },
                'calculation_engine': 'JEMicro-Jyotisha-Engine',
                'engine_version': '0.1.9-micro',
                'calculation_method': 'Swiss Ephemeris with Lahiri Ayanamsa (JEMicro)',
                'micro_optimization': True
            }
            
            print("[JEMICRO] Calculation completed successfully", file=sys.stderr)
            return result
            
        except Exception as e:
            print(f"[JEMICRO] Calculation error: {str(e)}", file=sys.stderr)
            return {
                'success': False,
                'error': f'JEMicro calculation failed: {str(e)}'
            }
    
    def get_nakshatra(self, longitude_sidereal: float) -> tuple:
        """
        Calculate nakshatra dynamically from longitude - no hardcoded degrees
        Each nakshatra spans exactly 13°20' (13.333333°)
        """
        # Normalize longitude to 0-360 range
        normalized_longitude = longitude_sidereal % 360
        
        # Calculate nakshatra number (0-26) dynamically
        nakshatra_span = 13.333333  # 13°20' per nakshatra
        nakshatra_index = int(normalized_longitude / nakshatra_span)
        
        # Ensure we don't go out of bounds (27 nakshatras total)
        if nakshatra_index >= 27:
            nakshatra_index = 26
            
        nakshatra_name = self.NAKSHATRA_NAMES[nakshatra_index]
        nakshatra_lord = self.NAKSHATRA_LORDS[nakshatra_index]
        
        return nakshatra_name, nakshatra_lord
    
    def calculate_vimshottari_dasha(self, moon_longitude: float, birth_date: datetime) -> Dict[str, Any]:
        """
        Calculate accurate Vimshottari Dasha periods with proper balance calculation
        """
        # Vimshottari periods (in years) - standard system
        dasha_periods = {
            'Ketu': 7, 'Venus': 20, 'Sun': 6, 'Moon': 10, 'Mars': 7,
            'Rahu': 18, 'Jupiter': 16, 'Saturn': 19, 'Mercury': 17
        }
        
        # Standard dasha sequence order
        dasha_order = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury']
        
        # Determine starting nakshatra and its progress
        nakshatra_name, nakshatra_lord = self.get_nakshatra(moon_longitude)
        
        # Calculate nakshatra progress dynamically (how much of the nakshatra is complete)
        nakshatra_span = 13.333333  # Each nakshatra spans 13°20' = 13.333333°
        nakshatra_index = self.NAKSHATRA_NAMES.index(nakshatra_name)
        nakshatra_start_degree = nakshatra_index * nakshatra_span
        progress_in_nakshatra = (moon_longitude - nakshatra_start_degree) / nakshatra_span
        
        # Calculate remaining balance of birth nakshatra dasha
        total_dasha_years = dasha_periods[nakshatra_lord]
        completed_years = progress_in_nakshatra * total_dasha_years
        remaining_years = total_dasha_years - completed_years
        
        # Calculate birth dasha end date
        birth_dasha_end = birth_date + timedelta(days=remaining_years * 365.25)
        
        # Find current dasha as of today
        current_date = datetime.now()
        dasha_start_date = birth_date
        current_lord = nakshatra_lord
        current_lord_index = dasha_order.index(nakshatra_lord)
        
        # If birth dasha is still running
        if current_date <= birth_dasha_end:
            current_dasha = {
                'lord': nakshatra_lord,
                'start_date': birth_date.strftime('%Y-%m-%d'),
                'end_date': birth_dasha_end.strftime('%Y-%m-%d'),
                'duration_years': remaining_years,
                'status': 'current'
            }
            dasha_start_date = birth_dasha_end
            current_lord_index = (current_lord_index + 1) % 9
        else:
            # Find which dasha is currently running
            dasha_start_date = birth_dasha_end
            current_lord_index = (current_lord_index + 1) % 9
            
            while dasha_start_date < current_date:
                current_lord = dasha_order[current_lord_index]
                dasha_duration = dasha_periods[current_lord]
                dasha_end_date = dasha_start_date + timedelta(days=dasha_duration * 365.25)
                
                if current_date <= dasha_end_date:
                    # This is the current dasha
                    current_dasha = {
                        'lord': current_lord,
                        'start_date': dasha_start_date.strftime('%Y-%m-%d'),
                        'end_date': dasha_end_date.strftime('%Y-%m-%d'),
                        'duration_years': dasha_duration,
                        'status': 'current'
                    }
                    break
                
                dasha_start_date = dasha_end_date
                current_lord_index = (current_lord_index + 1) % 9
        
        # Generate complete dasha sequence from birth
        dasha_sequence = []
        sequence_date = birth_date
        
        # First dasha (birth nakshatra with remaining balance)
        dasha_sequence.append({
            'lord': nakshatra_lord,
            'start_date': birth_date.strftime('%Y-%m-%d'),
            'end_date': birth_dasha_end.strftime('%Y-%m-%d'),
            'duration_years': round(remaining_years, 2),
            'status': 'completed' if current_date > birth_dasha_end else 'current'
        })
        
        sequence_date = birth_dasha_end
        sequence_lord_index = (dasha_order.index(nakshatra_lord) + 1) % 9
        
        # Generate remaining 8 dashas
        for i in range(8):
            lord = dasha_order[sequence_lord_index]
            duration = dasha_periods[lord]
            end_date = sequence_date + timedelta(days=duration * 365.25)
            
            # Determine status
            status = 'completed'
            if current_date >= sequence_date and current_date <= end_date:
                status = 'current'
            elif sequence_date > current_date:
                status = 'upcoming'
            
            dasha_sequence.append({
                'lord': lord,
                'start_date': sequence_date.strftime('%Y-%m-%d'),
                'end_date': end_date.strftime('%Y-%m-%d'),
                'duration_years': duration,
                'status': status
            })
            
            sequence_date = end_date
            sequence_lord_index = (sequence_lord_index + 1) % 9
        
        return {
            'current': current_dasha,
            'sequence': dasha_sequence,
            'moonNakshatra': {
                'name': nakshatra_name,
                'number': self.NAKSHATRA_NAMES.index(nakshatra_name) + 1,
                'pada': int((moon_longitude % 13.333333) / 3.333333) + 1,
                'lord': nakshatra_lord
            }
        }

def main():
    """
    Main function for JEMicro engine
    """
    try:
        # Read input from stdin
        input_data = sys.stdin.read()
        birth_data = json.loads(input_data)
        
        # Initialize engine
        engine = JyotishaMicroEngine()
        
        # Calculate birth chart
        result = engine.calculate_birth_chart(birth_data)
        
        # Output result as JSON
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        error_result = {
            'success': False,
            'error': f'JEMicro engine error: {str(e)}',
            'calculation_engine': 'JEMicro-Jyotisha-Engine'
        }
        print(json.dumps(error_result, indent=2))
        sys.exit(1)

if __name__ == "__main__":
    main()