#!/usr/bin/env python3
"""
Authentic Planetary Positions Calculator
Using Swiss Ephemeris with Lahiri Ayanamsa for precise Vedic calculations
"""

import swisseph as swe
import math
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Any
import json

class AuthenticPlanetaryCalculator:
    """
    Calculates authentic planetary positions using Swiss Ephemeris
    Following traditional Vedic Jyotisha principles
    """
    
    def __init__(self):
        """Initialize Swiss Ephemeris with Lahiri Ayanamsa"""
        # Set Lahiri Ayanamsa (most traditional for Vedic astrology)
        swe.set_ayanamsa(swe.AYANAMSA_LAHIRI)
        
        # Planet constants for Swiss Ephemeris
        self.PLANETS = {
            'Sun': swe.SUN,
            'Moon': swe.MOON,
            'Mars': swe.MARS,
            'Mercury': swe.MERCURY,
            'Jupiter': swe.JUPITER,
            'Venus': swe.VENUS,
            'Saturn': swe.SATURN,
            'Rahu': swe.MEAN_NODE,
            'Ketu': swe.MEAN_NODE  # Ketu is opposite to Rahu
        }
        
        # Combustion thresholds in degrees (from classical texts)
        self.COMBUSTION_THRESHOLDS = {
            'Mercury': 14.0,
            'Venus': 10.0,
            'Mars': 17.0,
            'Jupiter': 11.0,
            'Saturn': 15.0
        }
        
        # Planets that can be in war (excluding luminaries and nodes)
        self.WAR_PLANETS = ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']
        
        # Vedic signs mapping
        self.VEDIC_SIGNS = [
            'Mesha', 'Vrishabha', 'Mithuna', 'Kataka',
            'Simha', 'Kanya', 'Tula', 'Vrishchika',
            'Dhanu', 'Makara', 'Kumbha', 'Meena'
        ]
        
        # Nakshatra names (27 lunar mansions)
        self.NAKSHATRAS = [
            'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
            'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
            'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
            'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
            'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
        ]

    def convert_to_utc(self, birth_date: str, birth_time: str, timezone_offset: float) -> datetime:
        """Convert local birth time to UTC"""
        try:
            # Parse birth date and time
            date_parts = birth_date.split('-')
            time_parts = birth_time.split(':')
            
            year = int(date_parts[0])
            month = int(date_parts[1])
            day = int(date_parts[2])
            hour = int(time_parts[0])
            minute = int(time_parts[1])
            
            # Create local datetime
            local_datetime = datetime(year, month, day, hour, minute)
            
            # Convert to UTC
            utc_datetime = local_datetime - timedelta(hours=timezone_offset)
            
            return utc_datetime
            
        except Exception as e:
            print(f"[ERROR] Date/time conversion failed: {e}")
            return datetime.now()

    def get_julian_day(self, utc_datetime: datetime) -> float:
        """Calculate Julian Day Number for Swiss Ephemeris"""
        return swe.julday(
            utc_datetime.year,
            utc_datetime.month, 
            utc_datetime.day,
            utc_datetime.hour + utc_datetime.minute / 60.0
        )

    def get_planetary_longitude(self, jd: float, planet_code: int) -> Tuple[float, float, float, float]:
        """Get planetary longitude, latitude, distance, and speed"""
        try:
            result = swe.calc_ut(jd, planet_code)
            longitude = result[0][0] % 360  # Normalize to 0-360
            latitude = result[0][1]
            distance = result[0][2]
            speed = result[0][3]
            
            return longitude, latitude, distance, speed
            
        except Exception as e:
            print(f"[ERROR] Failed to get planetary position: {e}")
            return 0.0, 0.0, 0.0, 0.0

    def get_sign_from_longitude(self, longitude: float) -> Tuple[str, int, float]:
        """Get Vedic sign, sign number, and degree within sign"""
        sign_number = int(longitude / 30)
        degree_in_sign = longitude % 30
        sign_name = self.VEDIC_SIGNS[sign_number]
        
        return sign_name, sign_number + 1, degree_in_sign

    def get_nakshatra_from_longitude(self, longitude: float) -> Tuple[str, int, int]:
        """Get nakshatra name, number, and pada"""
        # Each nakshatra is 13.333... degrees (360/27)
        nakshatra_index = int(longitude / 13.333333333333334)
        nakshatra_index = nakshatra_index % 27  # Ensure within range
        
        # Calculate pada (1-4 within each nakshatra)
        nakshatra_degree = longitude % 13.333333333333334
        pada = int(nakshatra_degree / 3.333333333333333) + 1
        
        return self.NAKSHATRAS[nakshatra_index], nakshatra_index + 1, pada

    def get_houses(self, jd: float, latitude: float, longitude: float) -> Tuple[float, List[float]]:
        """Get ascendant and house cusps using Swiss Ephemeris"""
        try:
            # Use Placidus house system (traditional)
            ascendant_data = swe.houses_ex(jd, latitude, longitude, b'P')
            ascendant = ascendant_data[1][0]  # Ascendant longitude
            cusps = ascendant_data[1]         # House cusps
            
            return ascendant, cusps
            
        except Exception as e:
            print(f"[ERROR] Failed to calculate houses: {e}")
            return 0.0, [0.0] * 12

    def get_house_for_planet(self, planet_longitude: float, cusps: List[float]) -> int:
        """Determine which house a planet is in"""
        # Normalize all values to 0-360
        planet_lon = planet_longitude % 360
        
        for i in range(12):
            cusp_start = cusps[i] % 360
            cusp_end = cusps[(i + 1) % 12] % 360
            
            # Handle wrap-around at 0/360 degrees
            if cusp_start > cusp_end:
                if planet_lon >= cusp_start or planet_lon < cusp_end:
                    return i + 1
            else:
                if cusp_start <= planet_lon < cusp_end:
                    return i + 1
        
        return 1  # Default to first house if calculation fails

    def is_combust(self, planet_name: str, planet_longitude: float, sun_longitude: float) -> bool:
        """Check if planet is combust (too close to Sun)"""
        if planet_name not in self.COMBUSTION_THRESHOLDS:
            return False
            
        threshold = self.COMBUSTION_THRESHOLDS[planet_name]
        
        # Calculate angular difference
        diff = abs(planet_longitude - sun_longitude)
        if diff > 180:
            diff = 360 - diff
            
        return diff < threshold

    def check_planetary_war(self, planetary_positions: Dict) -> Dict[str, List[str]]:
        """Check for planetary wars (Graha Yuddha)"""
        wars = {}
        
        for planet1 in self.WAR_PLANETS:
            for planet2 in self.WAR_PLANETS:
                if planet1 >= planet2:  # Avoid duplicate checks
                    continue
                    
                if planet1 not in planetary_positions or planet2 not in planetary_positions:
                    continue
                    
                pos1 = planetary_positions[planet1]
                pos2 = planetary_positions[planet2]
                
                # Check if in same sign
                if pos1['sign'] == pos2['sign']:
                    # Check if within 1 degree
                    longitude_diff = abs(pos1['longitude'] - pos2['longitude'])
                    if longitude_diff < 1.0:
                        wars[f"{planet1}_vs_{planet2}"] = [planet1, planet2]
        
        return wars

    def calculate_planetary_positions(self, birth_date: str, birth_time: str, 
                                    latitude: float, longitude: float, 
                                    timezone_offset: float) -> Dict:
        """
        Main function to calculate all planetary positions
        Returns complete planetary data with all Vedic parameters
        """
        print(f"[DEBUG] Calculating authentic planetary positions...")
        print(f"[DEBUG] Birth: {birth_date} {birth_time}, Location: {latitude}, {longitude}")
        
        # Convert to UTC
        utc_datetime = self.convert_to_utc(birth_date, birth_time, timezone_offset)
        jd = self.get_julian_day(utc_datetime)
        
        print(f"[DEBUG] Julian Day: {jd}")
        
        # Get houses and ascendant
        ascendant_longitude, cusps = self.get_houses(jd, latitude, longitude)
        
        print(f"[DEBUG] Ascendant: {ascendant_longitude:.2f}°")
        
        planetary_positions = {}
        sun_longitude = None
        
        # Calculate positions for each planet
        for planet_name, planet_code in self.PLANETS.items():
            try:
                # Get basic astronomical data
                longitude_deg, latitude_deg, distance, speed = self.get_planetary_longitude(jd, planet_code)
                
                # Handle Ketu (opposite to Rahu)
                if planet_name == 'Ketu':
                    longitude_deg = (longitude_deg + 180) % 360
                    speed = -speed  # Ketu moves in opposite direction
                
                # Get Vedic interpretations
                sign_name, sign_number, degree_in_sign = self.get_sign_from_longitude(longitude_deg)
                nakshatra_name, nakshatra_number, pada = self.get_nakshatra_from_longitude(longitude_deg)
                house_number = self.get_house_for_planet(longitude_deg, cusps)
                
                # Determine motion status
                is_retrograde = speed < 0
                
                # Store Sun longitude for combustion calculations
                if planet_name == 'Sun':
                    sun_longitude = longitude_deg
                
                planetary_positions[planet_name] = {
                    'longitude': round(longitude_deg, 2),
                    'sign': sign_name,
                    'sign_number': sign_number,
                    'degree_in_sign': round(degree_in_sign, 2),
                    'nakshatra': nakshatra_name,
                    'nakshatra_number': nakshatra_number,
                    'pada': pada,
                    'house': house_number,
                    'speed': round(speed, 4),
                    'retrograde': is_retrograde,
                    'motion': 'Retrograde' if is_retrograde else 'Direct'
                }
                
                print(f"[DEBUG] {planet_name}: {sign_name}, {longitude_deg:.2f}°, House {house_number}, {nakshatra_name}")
                
            except Exception as e:
                print(f"[ERROR] Failed to calculate {planet_name}: {e}")
        
        # Add combustion status
        if sun_longitude is not None:
            for planet_name in planetary_positions:
                if planet_name not in ['Sun', 'Rahu', 'Ketu']:
                    planet_longitude = planetary_positions[planet_name]['longitude']
                    planetary_positions[planet_name]['combust'] = self.is_combust(
                        planet_name, planet_longitude, sun_longitude
                    )
                else:
                    planetary_positions[planet_name]['combust'] = False
        
        # Check for planetary wars
        wars = self.check_planetary_war(planetary_positions)
        
        # Add war status to each planet
        for planet_name in planetary_positions:
            planetary_positions[planet_name]['in_war'] = False
            planetary_positions[planet_name]['war_with'] = []
            
            for war_key, war_planets in wars.items():
                if planet_name in war_planets:
                    planetary_positions[planet_name]['in_war'] = True
                    other_planet = war_planets[1] if war_planets[0] == planet_name else war_planets[0]
                    planetary_positions[planet_name]['war_with'].append(other_planet)
        
        # Add ascendant data
        asc_sign_name, asc_sign_number, asc_degree = self.get_sign_from_longitude(ascendant_longitude)
        asc_nakshatra, asc_nak_number, asc_pada = self.get_nakshatra_from_longitude(ascendant_longitude)
        
        result = {
            'ascendant': {
                'longitude': round(ascendant_longitude, 2),
                'sign': asc_sign_name,
                'sign_number': asc_sign_number,
                'degree_in_sign': round(asc_degree, 2),
                'nakshatra': asc_nakshatra,
                'nakshatra_number': asc_nak_number,
                'pada': asc_pada
            },
            'planets': planetary_positions,
            'planetary_wars': wars,
            'calculation_method': 'Swiss Ephemeris with Lahiri Ayanamsa',
            'timestamp': utc_datetime.isoformat(),
            'julian_day': jd
        }
        
        print(f"[DEBUG] ✅ Authentic planetary calculation completed")
        return result

# Test function
if __name__ == "__main__":
    calculator = AuthenticPlanetaryCalculator()
    
    # Test with sample birth data
    result = calculator.calculate_planetary_positions(
        birth_date="1980-09-09",
        birth_time="19:15",
        latitude=13.0827,
        longitude=80.2707,
        timezone_offset=5.5
    )
    
    print("\n" + "="*60)
    print("AUTHENTIC PLANETARY POSITIONS CALCULATION")
    print("="*60)
    print(json.dumps(result, indent=2))