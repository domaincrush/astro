#!/usr/bin/env python3
"""
Streamlined Sade Sati Calculator
Uses Swiss Ephemeris for accurate planetary calculations
"""

import sys
import json
import math
from datetime import datetime, timedelta

try:
    import swisseph as swe
    SWISS_EPHEMERIS_AVAILABLE = True
except ImportError:
    SWISS_EPHEMERIS_AVAILABLE = False

def julian_day_number(year, month, day, hour=0, minute=0, second=0):
    """Calculate Julian Day Number"""
    if not SWISS_EPHEMERIS_AVAILABLE:
        # Basic Julian Day calculation
        a = (14 - month) // 12
        y = year - a
        m = month + 12 * a - 3
        return (153 * m + 2) // 5 + 365 * y + y // 4 - y // 100 + y // 400 + day + 1721119
    else:
        # Use Swiss Ephemeris for precision
        time_fraction = (hour + minute / 60.0 + second / 3600.0) / 24.0
        return swe.julday(year, month, day) + time_fraction

def get_planet_longitude(jd, planet_id):
    """Get planet longitude using Swiss Ephemeris"""
    if not SWISS_EPHEMERIS_AVAILABLE:
        return None
    
    try:
        # Set ayanamsa to Lahiri
        swe.set_sid_mode(swe.SIDM_LAHIRI)
        
        # Calculate position
        pos = swe.calc_ut(jd, planet_id)
        return pos[0]  # Longitude in degrees
    except Exception:
        return None

def calculate_sade_sati(birth_year, birth_month, birth_day, birth_hour, birth_minute):
    """Calculate Sade Sati analysis"""
    
    # Standard remedial measures
    remedial_measures = [
        "Recite Hanuman Chalisa daily",
        "Offer mustard oil to Shani dev on Saturdays",
        "Donate black sesame seeds and iron items",
        "Wear blue sapphire (after proper consultation)",
        "Perform regular fasting on Saturdays",
        "Chant 'Om Sham Shanicharaya Namah' 108 times",
        "Help poor and elderly people",
        "Maintain discipline in daily routine",
        "Practice meditation and yoga",
        "Read spiritual texts regularly"
    ]
    
    try:
        # Calculate birth Julian Day
        birth_jd = julian_day_number(birth_year, birth_month, birth_day, birth_hour, birth_minute)
        
        # Calculate current Julian Day  
        current_dt = datetime.now()
        current_jd = julian_day_number(current_dt.year, current_dt.month, current_dt.day)
        
        # Get Moon and Saturn positions
        moon_longitude = get_planet_longitude(birth_jd, swe.MOON) if SWISS_EPHEMERIS_AVAILABLE else None
        saturn_longitude = get_planet_longitude(current_jd, swe.SATURN) if SWISS_EPHEMERIS_AVAILABLE else None
        
        # Rashi names
        rashi_names = [
            "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
            "तुला", "वृश्चिक", "धनु", "मकर", "कुम्भ", "मीन"
        ]
        
        if moon_longitude is not None and saturn_longitude is not None:
            # Calculate rashi positions
            natal_moon_rasi = int(moon_longitude // 30)
            current_saturn_rasi = int(saturn_longitude // 30)
            
            natal_moon_name = rashi_names[natal_moon_rasi]
            current_saturn_name = rashi_names[current_saturn_rasi]
            
            # Define Sade Sati phases
            M = natal_moon_rasi
            rasi_before = (M - 1) % 12
            rasi_after = (M + 1) % 12
            
            # Determine current phase
            if current_saturn_rasi == rasi_before:
                current_phase = "Phase 1 (Purva-Śādi)"
                phase_description = "Rising Period - Challenges begin, foundation testing"
                phase_intensity = "Moderate"
            elif current_saturn_rasi == M:
                current_phase = "Phase 2 (Madhya-Śādi)"  
                phase_description = "Peak Period - Maximum intensity, core transformation"
                phase_intensity = "High"
            elif current_saturn_rasi == rasi_after:
                current_phase = "Phase 3 (Uttara-Śādi)"
                phase_description = "Declining Period - Lessons integration, gradual relief"
                phase_intensity = "Moderate"
            else:
                current_phase = "Not in Śade-Sāti"
                phase_description = "Normal Saturn influence - No special Sade Sati effects"
                phase_intensity = "Low"
            
            # Life impact based on natal Moon sign
            moon_sign_impacts = {
                "मेष": "Leadership challenges, health issues, financial stress",
                "वृषभ": "Family tensions, property matters, speech difficulties",
                "मिथुन": "Communication blocks, sibling issues, short journey problems",
                "कर्क": "Emotional upheaval, mother's health, property disputes",
                "सिंह": "Ego conflicts, children issues, creative blocks",
                "कन्या": "Health problems, work stress, service difficulties",
                "तुला": "Partnership issues, business problems, relationship conflicts",
                "वृश्चिक": "Transformation period, research setbacks, hidden enemies",
                "धनु": "Higher education obstacles, father's health, travel issues",
                "मकर": "Career challenges, reputation issues, authority conflicts",
                "कुम्भ": "Income reduction, friendship problems, goal obstacles",
                "मीन": "Expenses increase, spiritual confusion, foreign travel issues"
            }
            
            life_impact = moon_sign_impacts.get(natal_moon_name, "General life challenges and transformation")
            
            # Create comprehensive result
            result = {
                "birth_details": {
                    "birth_date": f"{birth_year}-{birth_month:02d}-{birth_day:02d}",
                    "birth_time": f"{birth_hour:02d}:{birth_minute:02d}"
                },
                "natal_moon_sign": natal_moon_name,
                "natal_moon_rasi_index": natal_moon_rasi,
                "natal_moon_longitude": round(moon_longitude, 2),
                "current_saturn_sign": current_saturn_name,
                "current_saturn_rasi_index": current_saturn_rasi,
                "current_saturn_longitude": round(saturn_longitude, 2),
                "current_phase": current_phase,
                "phase_description": phase_description,
                "phase_intensity": phase_intensity,
                "life_impact": life_impact,
                "target_signs": {
                    "rasi_before": rashi_names[rasi_before],
                    "natal_moon": natal_moon_name,
                    "rasi_after": rashi_names[rasi_after]
                },
                "remedial_measures": remedial_measures,
                "spiritual_guidance": {
                    "primary_focus": "Surrender to Saturn's lessons and embrace transformation",
                    "daily_practice": "Morning prayer to Hanuman, evening Saturn mantra",
                    "charitable_acts": "Help elderly, disabled, and underprivileged people",
                    "discipline": "Maintain strict daily routine and ethical conduct"
                },
                "calculation_method": "Swiss Ephemeris with Lahiri Ayanamsa",
                "calculation_timestamp": datetime.now().isoformat()
            }
            
            return result
            
        else:
            # Fallback when Swiss Ephemeris is not available
            return {
                "birth_details": {
                    "birth_date": f"{birth_year}-{birth_month:02d}-{birth_day:02d}",
                    "birth_time": f"{birth_hour:02d}:{birth_minute:02d}"
                },
                "natal_moon_sign": "Calculation requires Swiss Ephemeris",
                "current_phase": "Unable to calculate without Swiss Ephemeris",
                "phase_description": "Please install Swiss Ephemeris for accurate calculations",
                "remedial_measures": remedial_measures[:5],
                "spiritual_guidance": {
                    "primary_focus": "Continue regular spiritual practice",
                    "daily_practice": "Prayer and meditation",
                    "charitable_acts": "Help those in need",
                    "discipline": "Maintain ethical conduct"
                },
                "calculation_method": "Swiss Ephemeris required",
                "calculation_timestamp": datetime.now().isoformat()
            }
            
    except Exception as e:
        return {
            "error": f"Sade Sati calculation failed: {str(e)}",
            "fallback_analysis": {
                "natal_moon_sign": "Unable to calculate",
                "current_phase": "Calculation error",
                "phase_description": "Please try again with valid birth details",
                "remedial_measures": remedial_measures[:5],
                "spiritual_guidance": {
                    "primary_focus": "Continue regular spiritual practice",
                    "daily_practice": "Prayer and meditation",
                    "charitable_acts": "Help those in need",
                    "discipline": "Maintain ethical conduct"
                }
            }
        }

def main():
    """Main function for command-line usage"""
    if len(sys.argv) != 6:
        print("Usage: python sade-sati-simple.py <year> <month> <day> <hour> <minute>")
        sys.exit(1)
    
    try:
        year = int(sys.argv[1])
        month = int(sys.argv[2])
        day = int(sys.argv[3])
        hour = int(sys.argv[4])
        minute = int(sys.argv[5])
        
        result = calculate_sade_sati(year, month, day, hour, minute)
        print(json.dumps(result, indent=2, default=str))
        
    except ValueError as e:
        print(json.dumps({"error": f"Invalid input: {str(e)}"}, indent=2))
    except Exception as e:
        print(json.dumps({"error": f"Calculation error: {str(e)}"}, indent=2))

if __name__ == "__main__":
    main()