#!/usr/bin/env python3
"""
Authentic Jyotisha Panchangam Calculator
Based on traditional Vedic astrology calculations using Swiss Ephemeris
Implements the 5 core elements: Tithi, Nakshatra, Yoga, Karana, Vara
"""

import swisseph as swe
from datetime import datetime, timezone
import pytz
import json
import sys
import math

class JyotishaPanchangam:
    """
    Authentic Vedic Panchangam calculator using Swiss Ephemeris
    """
    
    # Nakshatra names (27 traditional nakshatras)
    NAKSHATRAS = [
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
        "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
        "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
        "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha",
        "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
    ]
    
    # Yoga names (27 traditional yogas)
    YOGAS = [
        "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
        "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva",
        "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana",
        "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla",
        "Brahma", "Indra", "Vaidhriti"
    ]
    
    # Karana names (11 karanas - 4 fixed + 7 moving)
    KARANAS = [
        "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
        "Shakuni", "Chatushpada", "Naga", "Kimstughna"
    ]
    
    # Tithi names
    TITHIS = [
        "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
        "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
        "Trayodashi", "Chaturdashi", "Purnima"
    ]
    
    # Weekday names in Sanskrit
    VARAS = [
        "Ravivar", "Somvar", "Mangalvar", "Budhvar", 
        "Guruvar", "Shukravar", "Shanivar"
    ]
    
    def __init__(self):
        """Initialize Swiss Ephemeris with Lahiri Ayanamsa"""
        swe.set_ephe_path('/usr/share/ephe')  # Set ephemeris path
        swe.set_sid_mode(swe.SIDM_LAHIRI)    # Use Lahiri Ayanamsa (most common)
    
    def get_julian_day(self, dt_utc):
        """Convert datetime to Julian Day"""
        return swe.julday(
            dt_utc.year, dt_utc.month, dt_utc.day,
            dt_utc.hour + dt_utc.minute/60.0 + dt_utc.second/3600.0
        )
    
    def get_planetary_longitude(self, jd, planet):
        """Get sidereal longitude of a planet"""
        result = swe.calc_ut(jd, planet, swe.FLG_SIDEREAL)
        return result[0][0]  # Longitude in degrees
    
    def calculate_tithi(self, sun_lon, moon_lon):
        """
        Calculate Tithi (lunar day) with timing
        Tithi = ((Moon - Sun) / 12) mod 30
        Range: 1-30 (15 for each paksha)
        """
        tithi_angle = (moon_lon - sun_lon) % 360
        tithi_num = int(tithi_angle / 12) + 1
        
        if tithi_num > 30:
            tithi_num = 30
            
        # Calculate completion percentage
        tithi_progress = (tithi_angle % 12) / 12 * 100
        
        # Determine paksha and tithi name
        if tithi_num <= 15:
            paksha = "Shukla"
            tithi_index = tithi_num - 1
        else:
            paksha = "Krishna"
            tithi_index = (tithi_num - 16)
            
        if tithi_index >= len(self.TITHIS):
            tithi_index = len(self.TITHIS) - 1
            
        tithi_name = f"{paksha} Paksha {self.TITHIS[tithi_index]}"
        
        return {
            "number": tithi_num,
            "name": tithi_name,
            "paksha": paksha,
            "angle": tithi_angle,
            "progress": tithi_progress
        }
    
    def calculate_nakshatra(self, moon_lon):
        """
        Calculate Nakshatra (lunar mansion)
        Each nakshatra spans 13°20' = 13.333°
        """
        nakshatra_span = 360.0 / 27.0  # 13.333 degrees
        nakshatra_num = int(moon_lon / nakshatra_span) + 1
        
        if nakshatra_num > 27:
            nakshatra_num = 27
        elif nakshatra_num < 1:
            nakshatra_num = 1
            
        # Calculate pada (quarter within nakshatra)
        nakshatra_offset = moon_lon % nakshatra_span
        pada = int(nakshatra_offset / (nakshatra_span / 4)) + 1
        
        return {
            "number": nakshatra_num,
            "name": self.NAKSHATRAS[nakshatra_num - 1],
            "pada": pada,
            "lord": self.get_nakshatra_lord(nakshatra_num)
        }
    
    def calculate_yoga(self, sun_lon, moon_lon):
        """
        Calculate Yoga
        Yoga = ((Sun + Moon) / 13.333°) mod 27
        """
        yoga_angle = (sun_lon + moon_lon) % 360
        yoga_span = 360.0 / 27.0  # 13.333 degrees
        yoga_num = int(yoga_angle / yoga_span) + 1
        
        if yoga_num > 27:
            yoga_num = 27
        elif yoga_num < 1:
            yoga_num = 1
            
        return {
            "number": yoga_num,
            "name": self.YOGAS[yoga_num - 1],
            "angle": yoga_angle
        }
    
    def calculate_karana(self, sun_lon, moon_lon):
        """
        Calculate Karana (half of tithi)
        Each tithi has 2 karanas
        """
        tithi_angle = (moon_lon - sun_lon) % 360
        karana_angle = tithi_angle * 2  # Each karana is half tithi
        karana_index = int(karana_angle / 12) % 60  # 60 karanas in lunar month
        
        # First karana is fixed, then 7 moving karanas repeat
        if karana_index == 0:
            karana_num = 8  # Shakuni (fixed)
        elif karana_index >= 57:
            karana_num = 9 + (karana_index - 57)  # Last 3 are fixed
        else:
            karana_num = ((karana_index - 1) % 7) + 1  # 7 moving karanas
            
        if karana_num > 11:
            karana_num = 11
        elif karana_num < 1:
            karana_num = 1
            
        return {
            "number": karana_num,
            "name": self.KARANAS[karana_num - 1],
            "angle": karana_angle
        }
    
    def calculate_vara(self, dt_local):
        """Calculate Vara (weekday)"""
        weekday_num = dt_local.weekday()  # 0=Monday, 6=Sunday
        # Adjust to Vedic system: 0=Sunday, 6=Saturday
        vedic_weekday = (weekday_num + 1) % 7
        
        return {
            "number": vedic_weekday + 1,
            "name": self.VARAS[vedic_weekday],
            "english": dt_local.strftime("%A")
        }
    
    def get_nakshatra_lord(self, nakshatra_num):
        """Get ruling planet of nakshatra"""
        lords = [
            "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter",
            "Saturn", "Mercury", "Ketu", "Venus", "Sun", "Moon",
            "Mars", "Rahu", "Jupiter", "Saturn", "Mercury", "Ketu",
            "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter",
            "Saturn", "Mercury"
        ]
        return lords[nakshatra_num - 1] if nakshatra_num <= len(lords) else "Unknown"
    
    def calculate_sunrise_sunset(self, jd, latitude, longitude):
        """Calculate sunrise, sunset, moonrise, moonset times"""
        try:
            # Calculate sunrise
            sunrise_jd = swe.rise_trans(
                jd, swe.SUN, longitude, latitude, 
                rsmi=swe.CALC_RISE | swe.BIT_DISC_CENTER
            )[1][0]
            
            # Calculate sunset
            sunset_jd = swe.rise_trans(
                jd, swe.SUN, longitude, latitude, 
                rsmi=swe.CALC_SET | swe.BIT_DISC_CENTER
            )[1][0]
            
            # Calculate moonrise
            try:
                moonrise_jd = swe.rise_trans(
                    jd, swe.MOON, longitude, latitude, 
                    rsmi=swe.CALC_RISE | swe.BIT_DISC_CENTER
                )[1][0]
            except:
                moonrise_jd = None
            
            # Calculate moonset
            try:
                moonset_jd = swe.rise_trans(
                    jd, swe.MOON, longitude, latitude, 
                    rsmi=swe.CALC_SET | swe.BIT_DISC_CENTER
                )[1][0]
            except:
                moonset_jd = None
            
            return {
                "sunrise": sunrise_jd,
                "sunset": sunset_jd,
                "moonrise": moonrise_jd,
                "moonset": moonset_jd
            }
        except Exception as e:
            return {
                "sunrise": None, 
                "sunset": None,
                "moonrise": None,
                "moonset": None,
                "error": str(e)
            }
    
    def calculate_panchangam(self, date_str, time_str, latitude, longitude, timezone_str="Asia/Kolkata"):
        """
        Calculate complete Panchangam for given date, time, and location
        
        Args:
            date_str: Date in YYYY-MM-DD format
            time_str: Time in HH:MM format  
            latitude: Latitude in degrees
            longitude: Longitude in degrees
            timezone_str: Timezone string (default: Asia/Kolkata)
        
        Returns:
            Complete Panchangam data
        """
        try:
            # Parse input datetime
            dt_str = f"{date_str} {time_str}"
            dt_naive = datetime.strptime(dt_str, "%Y-%m-%d %H:%M")
            
            # Localize to given timezone
            tz = pytz.timezone(timezone_str)
            dt_local = tz.localize(dt_naive)
            dt_utc = dt_local.astimezone(pytz.UTC)
            
            # Get Julian Day
            jd = self.get_julian_day(dt_utc)
            
            # Get planetary longitudes
            sun_lon = self.get_planetary_longitude(jd, swe.SUN)
            moon_lon = self.get_planetary_longitude(jd, swe.MOON)
            
            # Calculate all 5 elements
            tithi = self.calculate_tithi(sun_lon, moon_lon)
            nakshatra = self.calculate_nakshatra(moon_lon)
            yoga = self.calculate_yoga(sun_lon, moon_lon)
            karana = self.calculate_karana(sun_lon, moon_lon)
            vara = self.calculate_vara(dt_local)
            
            # Calculate sunrise/sunset/moonrise/moonset
            sun_times = self.calculate_sunrise_sunset(jd, latitude, longitude)
            
            # Calculate additional elements
            ayanamsa_degrees = swe.get_ayanamsa_ut(jd)
            
            # Determine Ayanam (Uttarayanam/Dakshinayanam)
            # Sun's declination determines this
            sun_result = swe.calc_ut(jd, swe.SUN, swe.FLG_SWIEPH)
            sun_declination = sun_result[0][1]  # Declination
            ayanam = "Uttarayanam" if sun_declination >= 0 else "Dakshinayanam"
            
            # Calculate Ritu (season) based on solar month
            solar_month = int(sun_lon / 30) + 1
            ritu_map = {
                1: "Vasanta (Spring)", 2: "Vasanta (Spring)",
                3: "Grishma (Summer)", 4: "Grishma (Summer)", 
                5: "Varsha (Monsoon)", 6: "Varsha (Monsoon)",
                7: "Sharad (Autumn)", 8: "Sharad (Autumn)",
                9: "Shishira (Winter)", 10: "Shishira (Winter)",
                11: "Shishira (Winter)", 12: "Vasanta (Spring)"
            }
            ritu = ritu_map.get(solar_month, "Unknown")
            
            # Calculate lunar month and paksha details
            lunar_phase = "Theipirai" if tithi["paksha"] == "Krishna" else "Valarpirai"
            
            return {
                "success": True,
                "date": date_str,
                "time": time_str,
                "location": {
                    "latitude": latitude,
                    "longitude": longitude,
                    "timezone": timezone_str
                },
                "julian_day": jd,
                "planetary_positions": {
                    "sun_longitude": sun_lon,
                    "moon_longitude": moon_lon
                },
                "panchangam": {
                    "tithi": tithi,
                    "nakshatra": nakshatra,
                    "yoga": yoga,
                    "karana": karana,
                    "vara": vara
                },
                "sun_times": sun_times,
                "additional_info": {
                    "ayanam": ayanam,
                    "ritu": ritu,
                    "lunar_phase": lunar_phase,
                    "solar_month": solar_month,
                    "sun_declination": sun_declination
                },
                "ayanamsa": ayanamsa_degrees,
                "calculation_method": "Swiss Ephemeris with Lahiri Ayanamsa"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "date": date_str,
                "time": time_str
            }

def main():
    """Command line interface"""
    if len(sys.argv) != 6:
        print("Usage: python jyotisha-panchangam.py YYYY-MM-DD HH:MM latitude longitude timezone")
        print("Example: python jyotisha-panchangam.py 2025-06-24 06:00 13.0827 80.2707 Asia/Kolkata")
        sys.exit(1)
    
    date_str = sys.argv[1]
    time_str = sys.argv[2]
    latitude = float(sys.argv[3])
    longitude = float(sys.argv[4])
    timezone_str = sys.argv[5]
    
    calculator = JyotishaPanchangam()
    result = calculator.calculate_panchangam(date_str, time_str, latitude, longitude, timezone_str)
    
    print(json.dumps(result, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()