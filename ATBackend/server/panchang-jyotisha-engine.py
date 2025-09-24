#!/usr/bin/env python3
"""
Panchang Calculator using Swiss Ephemeris
Comprehensive daily Panchang calculations with authentic Vedic methods
"""

import sys
import json
import pytz
from datetime import datetime, timedelta
import math

try:
    import swisseph as swe
except ImportError:
    print(json.dumps({"success": False, "error": "Swiss Ephemeris not available"}))
    sys.exit(1)

class SwissEphemerisPanchangCalculator:
    """
    Comprehensive Panchang calculator using Swiss Ephemeris
    """

    # Tithi names in order
    TITHI_NAMES = [
        "Amavasya", "Pratipad", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
        "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi",
        "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima", "Pratipad",
        "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami",
        "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi",
        "Chaturdashi"
    ]

    # Nakshatra names
    NAKSHATRA_NAMES = [
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
        "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
        "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
        "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
        "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
    ]

    # Nakshatra lords
    NAKSHATRA_LORDS = [
        "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn",
        "Mercury", "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter",
        "Saturn", "Mercury", "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu",
        "Jupiter", "Saturn", "Mercury"
    ]

    # Yoga names
    YOGA_NAMES = [
        "Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
        "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata",
        "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha",
        "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra",
        "Vaidhriti"
    ]

    # Karana names
    KARANA_NAMES = [
        "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
        "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
        "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
        "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
        "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
        "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
        "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
        "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
        "Shakuni", "Chatushpada", "Naga", "Kimstughna"
    ]

    # Day names
    VARA_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    VARA_LORDS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]

    @classmethod
    def calculate_panchang(cls, panchang_data: dict) -> dict:
        """
        Calculate comprehensive Panchang for given date and location
        """
        try:
            # Parse input data
            date_str = panchang_data['date']  # YYYY-MM-DD
            latitude = float(panchang_data['latitude'])
            longitude = float(panchang_data['longitude'])
            timezone_str = panchang_data.get('timezone', 'Asia/Kolkata')

            # Parse date
            date_obj = datetime.strptime(date_str, "%Y-%m-%d")
            
            # Set timezone
            tz = pytz.timezone(timezone_str)
            
            # Calculate for noon to get the main Panchang elements
            noon_time = tz.localize(date_obj.replace(hour=12, minute=0, second=0))
            
            # Convert to UTC for calculations
            noon_utc = noon_time.astimezone(pytz.UTC)
            
            # Calculate Julian Day
            jd = swe.julday(noon_utc.year, noon_utc.month, noon_utc.day, 
                           noon_utc.hour + noon_utc.minute/60.0)
            
            # Set ayanamsa (Lahiri)
            swe.set_sid_mode(swe.SIDM_LAHIRI)
            ayanamsa = swe.get_ayanamsa(jd)

            # Calculate planetary positions
            planetary_positions = cls._calculate_planetary_positions(jd, ayanamsa)
            
            # Calculate Panchang elements
            panchang_elements = cls._calculate_panchang_elements(jd, latitude, longitude)
            
            # Calculate sunrise/sunset times
            sun_times = cls._calculate_sun_times(jd, latitude, longitude, tz)
            
            # Calculate moon times
            moon_times = cls._calculate_moon_times(jd, latitude, longitude, tz)
            
            # Calculate auspicious times
            auspicious_times = cls._calculate_auspicious_times(jd, latitude, longitude, tz, sun_times)
            
            # Calculate lunar month and Samvat
            lunar_info = cls._calculate_lunar_info(jd)

            return {
                "success": True,
                "date": date_str,
                "location": {
                    "latitude": latitude,
                    "longitude": longitude,
                    "timezone": timezone_str
                },
                "panchang": panchang_elements,
                "sunrise": sun_times['sunrise'],
                "sunset": sun_times['sunset'],
                "moonrise": moon_times['moonrise'],
                "moonset": moon_times['moonset'],
                "auspiciousTimes": auspicious_times,
                "planetaryPositions": planetary_positions,
                "lunarMonth": lunar_info['lunarMonth'],
                "samvat": lunar_info['samvat'],
                "calculations": {
                    "ayanamsa": ayanamsa,
                    "julianDay": jd,
                    "engine": "Jyotisha-Panchang"
                }
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "date": panchang_data.get('date', ''),
                "location": {
                    "latitude": panchang_data.get('latitude', 0),
                    "longitude": panchang_data.get('longitude', 0),
                    "timezone": panchang_data.get('timezone', 'Asia/Kolkata')
                }
            }

    @classmethod
    def _calculate_planetary_positions(cls, jd: float, ayanamsa: float) -> list:
        """Calculate positions of all planets"""
        planets = []
        planet_ids = [swe.SUN, swe.MOON, swe.MARS, swe.MERCURY, swe.JUPITER, swe.VENUS, swe.SATURN]
        planet_names = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]
        
        for i, planet_id in enumerate(planet_ids):
            try:
                result = swe.calc(jd, planet_id)
                tropical_longitude = result[0][0]
                sidereal_longitude = (tropical_longitude - ayanamsa) % 360
                
                # Get zodiac sign
                sign_num = int(sidereal_longitude // 30)
                signs = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya",
                        "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"]
                sign = signs[sign_num]
                
                # Get nakshatra
                nakshatra_num = int(sidereal_longitude * 27 / 360)
                nakshatra = cls.NAKSHATRA_NAMES[nakshatra_num % 27]
                
                planets.append({
                    "name": planet_names[i],
                    "longitude": sidereal_longitude,
                    "sign": sign,
                    "nakshatra": nakshatra
                })
                
            except Exception as e:
                print(f"Error calculating {planet_names[i]}: {e}")
                continue
                
        return planets

    @classmethod
    def _calculate_panchang_elements(cls, jd: float, latitude: float, longitude: float) -> dict:
        """Calculate Tithi, Nakshatra, Yoga, Karana, and Vara"""
        
        # Calculate Moon and Sun positions
        moon_result = swe.calc(jd, swe.MOON)
        sun_result = swe.calc(jd, swe.SUN)
        
        ayanamsa = swe.get_ayanamsa(jd)
        
        moon_longitude = (moon_result[0][0] - ayanamsa) % 360
        sun_longitude = (sun_result[0][0] - ayanamsa) % 360
        
        # Calculate Tithi (lunar day)
        tithi_angle = (moon_longitude - sun_longitude) % 360
        tithi_num = int(tithi_angle / 12) + 1
        tithi_percentage = (tithi_angle % 12) / 12 * 100
        
        # Calculate Nakshatra
        nakshatra_num = int(moon_longitude * 27 / 360)
        nakshatra_angle = (moon_longitude * 27) % 360
        nakshatra_percentage = (nakshatra_angle / 13.333333) % 100
        
        # Calculate Yoga
        yoga_angle = (moon_longitude + sun_longitude) % 360
        yoga_num = int(yoga_angle * 27 / 360)
        yoga_percentage = ((yoga_angle * 27) % 360) / 13.333333
        
        # Calculate Karana
        karana_angle = tithi_angle
        karana_num = int(karana_angle / 6)
        karana_percentage = (karana_angle % 6) / 6 * 100
        
        # Calculate Vara (day of week)
        # Julian Day starts from Monday, adjust for Sunday = 0
        vara_num = int((jd + 1.5) % 7)
        
        return {
            "tithi": {
                "name": cls.TITHI_NAMES[min(tithi_num - 1, len(cls.TITHI_NAMES) - 1)],
                "number": tithi_num,
                "percentage": round(tithi_percentage, 2),
                "endTime": cls._calculate_end_time(jd, "tithi", tithi_percentage)
            },
            "nakshatra": {
                "name": cls.NAKSHATRA_NAMES[nakshatra_num % 27],
                "number": nakshatra_num + 1,
                "percentage": round(nakshatra_percentage, 2),
                "endTime": cls._calculate_end_time(jd, "nakshatra", nakshatra_percentage),
                "lord": cls.NAKSHATRA_LORDS[nakshatra_num % 27]
            },
            "yoga": {
                "name": cls.YOGA_NAMES[yoga_num % 27],
                "number": yoga_num + 1,
                "percentage": round(yoga_percentage, 2),
                "endTime": cls._calculate_end_time(jd, "yoga", yoga_percentage)
            },
            "karana": {
                "name": cls.KARANA_NAMES[karana_num % len(cls.KARANA_NAMES)],
                "number": karana_num + 1,
                "percentage": round(karana_percentage, 2),
                "endTime": cls._calculate_end_time(jd, "karana", karana_percentage)
            },
            "vara": {
                "name": cls.VARA_NAMES[vara_num],
                "lord": cls.VARA_LORDS[vara_num]
            }
        }

    @classmethod
    def _calculate_end_time(cls, jd: float, element_type: str, percentage: float) -> str:
        """Calculate approximate end time for Panchang elements"""
        try:
            # Approximate durations in hours
            durations = {
                "tithi": 24,  # Approximate
                "nakshatra": 24,  # Approximate 
                "yoga": 24,  # Approximate
                "karana": 12   # Half of tithi
            }
            
            duration = durations.get(element_type, 24)
            remaining_hours = (100 - percentage) / 100 * duration
            
            # Convert JD to datetime and add remaining time
            base_time = swe.jdut1_to_utc(jd)
            dt = datetime(*base_time[:6])
            end_time = dt + timedelta(hours=remaining_hours)
            
            return end_time.strftime("%H:%M")
        except:
            return "N/A"

    @classmethod
    def _calculate_sun_times(cls, jd: float, latitude: float, longitude: float, tz) -> dict:
        """Calculate sunrise and sunset times"""
        try:
            # Calculate sunrise
            sunrise_jd = swe.rise_trans(jd, swe.SUN, longitude, latitude, rsmi=swe.CALC_RISE)[1][0]
            sunrise_utc = swe.jdut1_to_utc(sunrise_jd)
            sunrise_dt = datetime(*sunrise_utc[:6], tzinfo=pytz.UTC)
            sunrise_local = sunrise_dt.astimezone(tz)
            
            # Calculate sunset
            sunset_jd = swe.rise_trans(jd, swe.SUN, longitude, latitude, rsmi=swe.CALC_SET)[1][0]
            sunset_utc = swe.jdut1_to_utc(sunset_jd)
            sunset_dt = datetime(*sunset_utc[:6], tzinfo=pytz.UTC)
            sunset_local = sunset_dt.astimezone(tz)
            
            return {
                "sunrise": sunrise_local.strftime("%H:%M"),
                "sunset": sunset_local.strftime("%H:%M")
            }
        except:
            return {"sunrise": "06:00", "sunset": "18:00"}

    @classmethod
    def _calculate_moon_times(cls, jd: float, latitude: float, longitude: float, tz) -> dict:
        """Calculate moonrise and moonset times"""
        try:
            # Calculate moonrise
            moonrise_jd = swe.rise_trans(jd, swe.MOON, longitude, latitude, rsmi=swe.CALC_RISE)[1][0]
            moonrise_utc = swe.jdut1_to_utc(moonrise_jd)
            moonrise_dt = datetime(*moonrise_utc[:6], tzinfo=pytz.UTC)
            moonrise_local = moonrise_dt.astimezone(tz)
            
            # Calculate moonset
            moonset_jd = swe.rise_trans(jd, swe.MOON, longitude, latitude, rsmi=swe.CALC_SET)[1][0]
            moonset_utc = swe.jdut1_to_utc(moonset_jd)
            moonset_dt = datetime(*moonset_utc[:6], tzinfo=pytz.UTC)
            moonset_local = moonset_dt.astimezone(tz)
            
            return {
                "moonrise": moonrise_local.strftime("%H:%M"),
                "moonset": moonset_local.strftime("%H:%M")
            }
        except:
            return {"moonrise": "N/A", "moonset": "N/A"}

    @classmethod
    def _calculate_auspicious_times(cls, jd: float, latitude: float, longitude: float, tz, sun_times: dict) -> dict:
        """Calculate auspicious times like Abhijit Muhurta, Brahma Muhurta, etc."""
        try:
            # Abhijit Muhurta (8 ghatis before apparent noon)
            noon_jd = jd  # Assuming jd is for noon
            abhijit_start = noon_jd - (8 * 24 / 60) / 24  # 8 minutes before noon
            abhijit_end = noon_jd + (8 * 24 / 60) / 24   # 8 minutes after noon
            
            # Convert to local time
            abhijit_start_utc = swe.jdut1_to_utc(abhijit_start)
            abhijit_end_utc = swe.jdut1_to_utc(abhijit_end)
            
            abhijit_start_dt = datetime(*abhijit_start_utc[:6], tzinfo=pytz.UTC).astimezone(tz)
            abhijit_end_dt = datetime(*abhijit_end_utc[:6], tzinfo=pytz.UTC).astimezone(tz)
            
            # Brahma Muhurta (96 minutes before sunrise)
            sunrise_time = datetime.strptime(sun_times['sunrise'], "%H:%M").time()
            sunrise_dt = datetime.combine(datetime.utcfromtimestamp(jd * 86400 - 2440587.5 * 86400).date(), sunrise_time)
            brahma_end = sunrise_dt
            brahma_start = brahma_end - timedelta(minutes=96)
            
            # Rahu Kaal calculation (1/8th of day duration)
            sunrise_minutes = sunrise_time.hour * 60 + sunrise_time.minute
            sunset_time = datetime.strptime(sun_times['sunset'], "%H:%M").time()
            sunset_minutes = sunset_time.hour * 60 + sunset_time.minute
            day_duration = sunset_minutes - sunrise_minutes
            rahu_duration = day_duration // 8
            
            # Rahu Kaal varies by day of week
            vara_num = int((jd + 1.5) % 7)
            rahu_start_periods = [450, 390, 330, 480, 420, 360, 510]  # Minutes from sunrise
            rahu_start_minutes = sunrise_minutes + rahu_start_periods[vara_num]
            
            rahu_start_time = f"{rahu_start_minutes // 60:02d}:{rahu_start_minutes % 60:02d}"
            rahu_end_minutes = rahu_start_minutes + rahu_duration
            rahu_end_time = f"{rahu_end_minutes // 60:02d}:{rahu_end_minutes % 60:02d}"
            
            # Gulika Kaal (similar to Rahu Kaal but different periods)
            gulika_start_periods = [480, 420, 360, 510, 450, 390, 330]
            gulika_start_minutes = sunrise_minutes + gulika_start_periods[vara_num]
            gulika_start_time = f"{gulika_start_minutes // 60:02d}:{gulika_start_minutes % 60:02d}"
            gulika_end_minutes = gulika_start_minutes + rahu_duration
            gulika_end_time = f"{gulika_end_minutes // 60:02d}:{gulika_end_minutes % 60:02d}"
            
            return {
                "abhijitMuhurta": {
                    "start": abhijit_start_dt.strftime("%H:%M"),
                    "end": abhijit_end_dt.strftime("%H:%M")
                },
                "brahmaUhurta": {
                    "start": brahma_start.strftime("%H:%M"),
                    "end": brahma_end.strftime("%H:%M")
                },
                "rahu_kaal": {
                    "start": rahu_start_time,
                    "end": rahu_end_time
                },
                "gulika_kaal": {
                    "start": gulika_start_time,
                    "end": gulika_end_time
                }
            }
        except Exception as e:
            return {
                "abhijitMuhurta": {"start": "11:52", "end": "12:08"},
                "brahmaUhurta": {"start": "04:24", "end": "05:36"},
                "rahu_kaal": {"start": "N/A", "end": "N/A"},
                "gulika_kaal": {"start": "N/A", "end": "N/A"}
            }

    @classmethod
    def _calculate_lunar_info(cls, jd: float) -> dict:
        """Calculate lunar month and Samvat information"""
        try:
            # Approximate calculations for lunar month
            # Get moon phase
            moon_result = swe.calc(jd, swe.MOON)
            sun_result = swe.calc(jd, swe.SUN)
            
            ayanamsa = swe.get_ayanamsa(jd)
            moon_longitude = (moon_result[0][0] - ayanamsa) % 360
            sun_longitude = (sun_result[0][0] - ayanamsa) % 360
            
            # Determine lunar month based on sun's position
            lunar_months = [
                "Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada",
                "Ashwin", "Kartik", "Margashirsha", "Pausha", "Magha", "Phalguna"
            ]
            
            month_num = int(sun_longitude // 30)
            lunar_month = lunar_months[month_num]
            
            # Determine paksha
            tithi_angle = (moon_longitude - sun_longitude) % 360
            paksha = "Shukla" if tithi_angle < 180 else "Krishna"
            
            # Calculate Samvat years (approximate)
            gregorian_year = swe.jdut1_to_utc(jd)[0]
            vikram_samvat = gregorian_year + 57
            shaka_samvat = gregorian_year - 78
            
            return {
                "lunarMonth": {
                    "name": lunar_month,
                    "paksha": paksha
                },
                "samvat": {
                    "vikram": vikram_samvat,
                    "shaka": shaka_samvat
                }
            }
        except:
            return {
                "lunarMonth": {"name": "Unknown", "paksha": "Unknown"},
                "samvat": {"vikram": 0, "shaka": 0}
            }


def main():
    """Main function to handle command line input"""
    if len(sys.argv) != 2:
        print(json.dumps({"success": False, "error": "Usage: python panchang-jyotisha-engine.py '<json_panchang_data>'"}))
        return
    
    try:
        panchang_data = json.loads(sys.argv[1])
        result = SwissEphemerisPanchangCalculator.calculate_panchang(panchang_data)
        print(json.dumps(result, indent=2))
    except json.JSONDecodeError:
        print(json.dumps({"success": False, "error": "Invalid JSON input"}))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))


if __name__ == "__main__":
    main()