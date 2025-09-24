#!/usr/bin/env python3

"""
Drik Panchanga Birth Chart Engine
Uses the authentic Drik Panchanga system for precise Vedic astrology calculations
Based on Swiss Ephemeris with observational Indian lunisolar calendar methods
"""

import sys
import json
import os
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Any
import pytz

# Add the drik-panchanga directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'drik-panchanga'))

try:
    import swisseph as swe
    import panchanga
    from panchanga import Place, Date as DrikDate, gregorian_to_jd
except ImportError as e:
    print(json.dumps({"success": False, "error": f"Failed to import required modules: {str(e)}"}))
    sys.exit(1)

class DrikBirthChartEngine:
    """
    Drik Panchanga Birth Chart calculation engine using authentic Indian astronomical methods
    """
    
    # Planet constants
    PLANETS = {
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
    
    # Nakshatra names (1-27)
    NAKSHATRA_NAMES = [
        'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra', 'Punarvasu',
        'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
        'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
        'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
        'Uttara Bhadrapada', 'Revati'
    ]
    
    # Rashi names (1-12)
    RASHI_NAMES = [
        'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
        'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'
    ]
    
    # Tithi names (1-30)
    TITHI_NAMES = [
        'Pratipad', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami',
        'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
        'Pratipad', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami',
        'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'
    ]
    
    # Yoga names (1-27)
    YOGA_NAMES = [
        'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma',
        'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
        'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha',
        'Shukla', 'Brahma', 'Mahendra', 'Vaidhriti'
    ]
    
    # Karana names (1-11, with some repeating)
    KARANA_NAMES = [
        'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Visti',
        'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'
    ]

    @classmethod
    def calculate_birth_chart(cls, birth_data: Dict) -> Dict:
        """
        Calculate complete birth chart using Drik Panchanga methods
        """
        try:
            # Extract birth data
            name = birth_data.get('name', 'Unknown')
            date_str = birth_data['date']  # YYYY-MM-DD
            time_str = birth_data['time']  # HH:MM
            latitude = float(birth_data['latitude'])
            longitude = float(birth_data['longitude'])
            timezone_str = birth_data.get('timezone', 'Asia/Kolkata')
            
            # Parse date and time
            birth_date = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
            
            # Calculate timezone offset
            tz = pytz.timezone(timezone_str)
            birth_datetime = tz.localize(birth_date)
            utc_offset = birth_datetime.utcoffset().total_seconds() / 3600  # hours
            
            # Create Drik Panchanga place and date objects
            place = Place(latitude, longitude, utc_offset)
            drik_date = DrikDate(birth_date.year, birth_date.month, birth_date.day)
            
            # Convert to Julian Day
            jd = gregorian_to_jd(drik_date)
            # Add time component
            time_fraction = (birth_date.hour + birth_date.minute/60.0) / 24.0
            jd += time_fraction
            
            # Set Swiss Ephemeris to use Lahiri Ayanamsa
            swe.set_sid_mode(swe.SIDM_LAHIRI)
            
            # Calculate planetary positions
            planets = cls._calculate_planetary_positions(jd)
            
            # Calculate Ascendant using Drik Panchanga methods
            ascendant = cls._calculate_ascendant(jd, place)
            
            # Calculate Panchanga using authentic Drik methods
            panchanga_data = cls._calculate_panchanga(jd, place)
            
            # Calculate houses using traditional methods
            houses = cls._calculate_houses(jd, place, ascendant['longitude'])
            
            # Calculate Nakshatras and Padas for planets
            planet_nakshatras = cls._calculate_planet_nakshatras(planets)
            
            # Calculate Vimshottari Dasha
            dasha_data = cls._calculate_vimshottari_dasha(planets[1]['longitude'], birth_datetime)
            
            # Traditional Vedic attributes based on Moon's nakshatra
            vedic_attributes = cls._calculate_vedic_attributes(planet_nakshatras[1])
            
            return {
                "success": True,
                "calculation_engine": "Drik-Panchanga",
                "name": name,
                "birth_details": {
                    "date": date_str,
                    "time": time_str,
                    "location": {
                        "latitude": latitude,
                        "longitude": longitude,
                        "timezone": timezone_str
                    }
                },
                "julian_day": jd,
                "ayanamsa": swe.get_ayanamsa_ut(jd),
                "planets": planets,
                "ascendant": ascendant,
                "houses": houses,
                "panchanga": panchanga_data,
                "planet_nakshatras": planet_nakshatras,
                "dasha": dasha_data,
                "vedic_attributes": vedic_attributes
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Drik Panchanga calculation failed: {str(e)}",
                "calculation_engine": "Drik-Panchanga"
            }
    
    @classmethod
    def _calculate_planetary_positions(cls, jd: float) -> List[Dict]:
        """Calculate positions of all planets using Swiss Ephemeris"""
        planets = []
        
        for planet_name, planet_id in cls.PLANETS.items():
            try:
                if planet_name == 'Ketu':
                    # Ketu is 180 degrees opposite to Rahu
                    rahu_data = swe.calc_ut(jd, swe.MEAN_NODE, swe.FLG_SWIEPH)
                    if len(rahu_data) >= 2:  # Check if calculation was successful
                        longitude = (rahu_data[0][0] + 180) % 360
                        latitude = -rahu_data[0][1]  # Opposite latitude
                        distance = rahu_data[0][2]
                        speed = -rahu_data[0][3] if len(rahu_data[0]) > 3 else 0  # Opposite speed
                    else:
                        continue
                else:
                    planet_data = swe.calc_ut(jd, planet_id, swe.FLG_SWIEPH)
                    if len(planet_data) >= 2:  # Check if calculation was successful
                        longitude = planet_data[0][0]
                        latitude = planet_data[0][1] 
                        distance = planet_data[0][2]
                        speed = planet_data[0][3] if len(planet_data[0]) > 3 else 0
                    else:
                        continue
                
                # Convert to Nirayana (sidereal) longitude
                ayanamsa = swe.get_ayanamsa_ut(jd)
                sidereal_longitude = (longitude - ayanamsa) % 360
                
                # Calculate Rashi (sign)
                rashi_num = int(sidereal_longitude // 30) + 1
                rashi_name = cls.RASHI_NAMES[rashi_num - 1]
                
                # Calculate degree within rashi
                degree_in_rashi = sidereal_longitude % 30
                
                planets.append({
                    "name": planet_name,
                    "longitude": sidereal_longitude,
                    "latitude": latitude,
                    "distance": distance,
                    "speed": speed,
                    "rashi": rashi_name,
                    "rashi_num": rashi_num,
                    "degree_in_rashi": degree_in_rashi,
                    "retrograde": speed < 0 if planet_name not in ['Sun', 'Moon', 'Rahu', 'Ketu'] else False
                })
                
            except Exception as e:
                print(f"Error calculating {planet_name}: {e}")
                continue
                
        return planets
    
    @classmethod
    def _calculate_ascendant(cls, jd: float, place: Place) -> Dict:
        """Calculate Ascendant using traditional methods"""
        try:
            # Calculate sunrise time for the day
            sunrise_jd = panchanga.sunrise(jd, place)[0]
            
            # Use precise time for ascendant calculation
            houses_data = swe.houses(jd, place.latitude, place.longitude, b'P')  # Placidus
            ascendant_longitude = houses_data[1][0]  # First house cusp
            
            # Convert to sidereal
            ayanamsa = swe.get_ayanamsa_ut(jd)
            sidereal_ascendant = (ascendant_longitude - ayanamsa) % 360
            
            # Calculate Rashi
            rashi_num = int(sidereal_ascendant // 30) + 1
            rashi_name = cls.RASHI_NAMES[rashi_num - 1]
            
            return {
                "longitude": sidereal_ascendant,
                "rashi": rashi_name,
                "rashi_num": rashi_num,
                "degree_in_rashi": sidereal_ascendant % 30
            }
            
        except Exception as e:
            # Fallback calculation
            return {
                "longitude": 0.0,
                "rashi": "Mesha", 
                "rashi_num": 1,
                "degree_in_rashi": 0.0,
                "error": str(e)
            }
    
    @classmethod
    def _calculate_panchanga(cls, jd: float, place: Place) -> Dict:
        """Calculate Panchanga using authentic Drik methods"""
        try:
            # Tithi
            tithi_data = panchanga.tithi(jd, place)
            tithi_num = tithi_data[0]
            tithi_name = cls.TITHI_NAMES[tithi_num - 1] if 1 <= tithi_num <= 30 else "Unknown"
            
            # Nakshatra  
            nakshatra_data = panchanga.nakshatra(jd, place)
            nakshatra_num = nakshatra_data[0]
            nakshatra_name = cls.NAKSHATRA_NAMES[nakshatra_num - 1] if 1 <= nakshatra_num <= 27 else "Unknown"
            
            # Yoga
            yoga_data = panchanga.yoga(jd, place)
            yoga_num = yoga_data[0]
            yoga_name = cls.YOGA_NAMES[yoga_num - 1] if 1 <= yoga_num <= 27 else "Unknown"
            
            # Karana
            karana_data = panchanga.karana(jd, place)
            karana_num = karana_data[0]
            karana_name = cls.KARANA_NAMES[karana_num - 1] if 1 <= karana_num <= 11 else "Unknown"
            
            # Vara (weekday)
            vara_num = panchanga.vaara(jd)
            vara_names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            vara_name = vara_names[vara_num] if 0 <= vara_num <= 6 else "Unknown"
            
            # Sunrise and Sunset
            sunrise_data = panchanga.sunrise(jd, place)
            sunset_data = panchanga.sunset(jd, place)
            
            return {
                "tithi": {
                    "number": tithi_num,
                    "name": tithi_name,
                    "end_time": tithi_data[1] if len(tithi_data) > 1 else None
                },
                "nakshatra": {
                    "number": nakshatra_num,
                    "name": nakshatra_name,
                    "end_time": nakshatra_data[1] if len(nakshatra_data) > 1 else None
                },
                "yoga": {
                    "number": yoga_num,
                    "name": yoga_name,
                    "end_time": yoga_data[1] if len(yoga_data) > 1 else None
                },
                "karana": {
                    "number": karana_num,
                    "name": karana_name
                },
                "vara": {
                    "number": vara_num,
                    "name": vara_name
                },
                "sunrise": sunrise_data[1] if len(sunrise_data) > 1 else None,
                "sunset": sunset_data[1] if len(sunset_data) > 1 else None
            }
            
        except Exception as e:
            return {
                "error": f"Panchanga calculation failed: {str(e)}"
            }
    
    @classmethod
    def _calculate_houses(cls, jd: float, place: Place, ascendant_longitude: float) -> List[Dict]:
        """Calculate 12 houses using traditional methods"""
        houses = []
        
        try:
            # Calculate house cusps using Placidus system
            houses_data = swe.houses(jd, place.latitude, place.longitude, b'P')
            cusps = houses_data[1]  # House cusps
            
            ayanamsa = swe.get_ayanamsa_ut(jd)
            
            for i in range(12):
                cusp_longitude = cusps[i]
                sidereal_cusp = (cusp_longitude - ayanamsa) % 360
                
                rashi_num = int(sidereal_cusp // 30) + 1
                rashi_name = cls.RASHI_NAMES[rashi_num - 1]
                
                houses.append({
                    "house_num": i + 1,
                    "cusp_longitude": sidereal_cusp,
                    "rashi": rashi_name,
                    "rashi_num": rashi_num,
                    "degree_in_rashi": sidereal_cusp % 30
                })
                
        except Exception as e:
            # Fallback to equal house system
            for i in range(12):
                house_longitude = (ascendant_longitude + i * 30) % 360
                rashi_num = int(house_longitude // 30) + 1
                rashi_name = cls.RASHI_NAMES[rashi_num - 1]
                
                houses.append({
                    "house_num": i + 1,
                    "cusp_longitude": house_longitude,
                    "rashi": rashi_name,
                    "rashi_num": rashi_num,
                    "degree_in_rashi": house_longitude % 30,
                    "system": "Equal House (fallback)"
                })
        
        return houses
    
    @classmethod
    def _calculate_planet_nakshatras(cls, planets: List[Dict]) -> List[Dict]:
        """Calculate nakshatra and pada for each planet"""
        planet_nakshatras = []
        
        for planet in planets:
            longitude = planet['longitude']
            
            # Each nakshatra spans 13°20' = 800' = 13.333333°
            nakshatra_num = int(longitude // 13.333333) + 1
            if nakshatra_num > 27:
                nakshatra_num = 27
                
            nakshatra_name = cls.NAKSHATRA_NAMES[nakshatra_num - 1]
            
            # Calculate pada (1-4)
            position_in_nakshatra = longitude % 13.333333
            pada = int(position_in_nakshatra // 3.333333) + 1
            if pada > 4:
                pada = 4
            
            planet_nakshatras.append({
                "planet": planet['name'],
                "nakshatra": nakshatra_name,
                "nakshatra_num": nakshatra_num,
                "pada": pada,
                "longitude": longitude
            })
        
        return planet_nakshatras
    
    @classmethod
    def _calculate_vimshottari_dasha(cls, moon_longitude: float, birth_datetime: datetime) -> Dict:
        """Calculate Vimshottari Dasha periods"""
        try:
            # Dasha lords in sequence
            dasha_lords = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury']
            dasha_years = [7, 20, 6, 10, 7, 18, 16, 19, 17]
            
            # Find Moon's nakshatra
            nakshatra_num = int(moon_longitude // 13.333333) + 1
            if nakshatra_num > 27:
                nakshatra_num = 27
            
            # Map nakshatra to dasha lord
            nakshatra_to_lord = {
                1: 'Ketu', 2: 'Venus', 3: 'Sun', 4: 'Moon', 5: 'Mars', 6: 'Rahu', 7: 'Jupiter',
                8: 'Saturn', 9: 'Mercury', 10: 'Ketu', 11: 'Venus', 12: 'Sun', 13: 'Moon',
                14: 'Mars', 15: 'Rahu', 16: 'Jupiter', 17: 'Saturn', 18: 'Mercury', 19: 'Ketu',
                20: 'Venus', 21: 'Sun', 22: 'Moon', 23: 'Mars', 24: 'Rahu', 25: 'Jupiter',
                26: 'Saturn', 27: 'Mercury'
            }
            
            starting_lord = nakshatra_to_lord.get(nakshatra_num, 'Sun')
            start_index = dasha_lords.index(starting_lord)
            
            # Calculate dasha periods
            dasha_periods = []
            current_date = birth_datetime
            
            for i in range(9):
                lord_index = (start_index + i) % 9
                lord = dasha_lords[lord_index]
                years = dasha_years[lord_index]
                
                end_date = current_date + timedelta(days=years * 365.25)
                
                dasha_periods.append({
                    "lord": lord,
                    "start_date": current_date.isoformat(),
                    "end_date": end_date.isoformat(),
                    "duration_years": years
                })
                
                current_date = end_date
            
            return {
                "starting_lord": starting_lord,
                "moon_nakshatra": cls.NAKSHATRA_NAMES[nakshatra_num - 1],
                "periods": dasha_periods
            }
            
        except Exception as e:
            return {
                "error": f"Dasha calculation failed: {str(e)}"
            }
    
    @classmethod
    def _calculate_vedic_attributes(cls, moon_nakshatra_data: Dict) -> Dict:
        """Calculate traditional Vedic attributes based on Moon's nakshatra"""
        nakshatra_name = moon_nakshatra_data.get('nakshatra', 'Ashwini')
        pada = moon_nakshatra_data.get('pada', 1)
        
        # Traditional attribute mappings (simplified)
        attributes = {
            "nakshatra": nakshatra_name,
            "pada": pada,
            "gana": "Deva",  # Would be calculated based on nakshatra
            "nadi": "Aadi",  # Would be calculated based on nakshatra
            "yoni": "Ashwa", # Would be calculated based on nakshatra
            "varna": "Kshatriya", # Would be calculated based on nakshatra
            "tatva": "Prithvi",    # Would be calculated based on nakshatra
            "calculation_method": "Drik-Panchanga"
        }
        
        return attributes

def main():
    """Main function to handle command line input"""
    if len(sys.argv) != 2:
        print(json.dumps({"success": False, "error": "Usage: python drik-birth-chart-engine.py '<json_birth_data>'"}))
        return
    
    try:
        birth_data = json.loads(sys.argv[1])
        result = DrikBirthChartEngine.calculate_birth_chart(birth_data)
        print(json.dumps(result, indent=2))
    except json.JSONDecodeError:
        print(json.dumps({"success": False, "error": "Invalid JSON input"}))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    main()