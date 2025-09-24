#!/usr/bin/env python3
"""
Authentic Sade Sati Calculator using jyotisha library
Calculates the 7.5-year Saturn transit period through natal Moon sign
"""

import sys
import json
from datetime import datetime, timedelta
from jyotisha.panchaanga.temporal import time as jyotisha_time, body, zodiac

def calculate_sade_sati(birth_year, birth_month, birth_day, birth_hour, birth_minute):
    """
    Calculate complete Sade Sati analysis using authentic jyotisha method
    """
    # Comprehensive remedial measures (defined early for use in error handling)
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
        # 1. Find Your Natal Moon Rāśi
        jd_birth = jyotisha_time.utc_gregorian_to_jd(birth_year, birth_month, birth_day, birth_hour, birth_minute)
        moon_long = body.get_planet_longitude(jd_birth, planet_name='MOON', ayanaamsha_id='LAHIRI')
        natal_moon_rasi = int(moon_long // 30)
        natal_moon_name = zodiac.RASI_LIST[natal_moon_rasi]
        
        # 2. Identify the Three Target Signs
        M = natal_moon_rasi
        rasi_before = (M - 1) % 12
        rasi_after = (M + 1) % 12
        
        # Helper functions
        def get_saturn_rasi_on_jd(jd):
            lon = body.get_planet_longitude(jd, planet_name='SHANI', ayanaamsha_id='LAHIRI')
            return int(lon // 30)
        
        def find_entry(start_date, target_rasi):
            """Find when Saturn enters target rasi"""
            jd = jyotisha_time.utc_gregorian_to_jd(start_date.year, start_date.month, start_date.day, 0, 0)
            for day in range(0, 4000):  # up to ~11 years
                if get_saturn_rasi_on_jd(jd) == target_rasi:
                    return jyotisha_time.jd_to_utc_gregorian(jd)
                jd += 1
            return None
        
        # 3. Compute the Transit Entry Dates
        birth_date = datetime(birth_year, birth_month, birth_day)
        
        # Find phase entry dates
        phase1_start = find_entry(birth_date, rasi_before)
        if phase1_start:
            phase2_start = find_entry(datetime(*phase1_start[:3]) + timedelta(days=1), M)
            if phase2_start:
                phase3_start = find_entry(datetime(*phase2_start[:3]) + timedelta(days=1), rasi_after)
            else:
                phase3_start = None
        else:
            phase2_start = None
            phase3_start = None
        
        # Calculate end date (approximately 2.5 years after Phase 3)
        sade_sati_end = None
        if phase3_start:
            end_date = datetime(*phase3_start[:3]) + timedelta(days=365*2+182)
            sade_sati_end = (end_date.year, end_date.month, end_date.day)
        
        # 4. Determine Current Phase
        today_jd = jyotisha_time.utc_gregorian_to_jd(*datetime.now().timetuple()[:5])
        current_rasi = get_saturn_rasi_on_jd(today_jd)
        
        if current_rasi == rasi_before:
            current_phase = "Phase 1 (Purva-Śādi)"
            phase_description = "Rising Period - Challenges begin, foundation testing"
        elif current_rasi == M:
            current_phase = "Phase 2 (Madhya-Śādi)"
            phase_description = "Peak Period - Maximum intensity, core transformation"
        elif current_rasi == rasi_after:
            current_phase = "Phase 3 (Uttara-Śādi)"
            phase_description = "Declining Period - Lessons integration, gradual relief"
        else:
            current_phase = "Not in Śade-Sāti"
            phase_description = "Normal Saturn influence - No special Sade Sati effects"
        
        # Phase-specific impacts
        phase_impacts = {
            "Phase 1 (Purva-Śādi)": {
                "duration": "Approximately 2.5 years",
                "key_themes": ["Financial challenges", "Career obstacles", "Health concerns", "Relationship tensions"],
                "spiritual_lesson": "Developing patience and perseverance",
                "remedial_focus": "Strengthening foundation, financial discipline"
            },
            "Phase 2 (Madhya-Śādi)": {
                "duration": "Approximately 2.5 years",
                "key_themes": ["Mental stress", "Emotional upheaval", "Major life changes", "Family issues"],
                "spiritual_lesson": "Inner transformation and self-discovery",
                "remedial_focus": "Mental peace, emotional balance, spiritual practices"
            },
            "Phase 3 (Uttara-Śādi)": {
                "duration": "Approximately 2.5 years", 
                "key_themes": ["Gradual improvement", "Lesson integration", "New opportunities", "Relationship healing"],
                "spiritual_lesson": "Wisdom application and service to others",
                "remedial_focus": "Sharing knowledge, helping others, gratitude practices"
            }
        }
        
        # Calculate total duration if in Sade Sati
        total_duration = "Not applicable"
        if current_phase != "Not in Śade-Sāti" and phase1_start and sade_sati_end:
            start_date = datetime(*phase1_start[:3])
            end_date = datetime(*sade_sati_end[:3])
            duration_years = (end_date - start_date).days / 365.25
            total_duration = f"Approximately {duration_years:.1f} years"
        

        
        # Calculate approximate percentage complete if in Sade Sati
        percentage_complete = 0
        if current_phase != "Not in Śade-Sāti" and phase1_start and sade_sati_end:
            start_date = datetime(*phase1_start[:3])
            end_date = datetime(*sade_sati_end[:3])
            current_date = datetime.now()
            
            if current_date >= start_date and current_date <= end_date:
                total_days = (end_date - start_date).days
                elapsed_days = (current_date - start_date).days
                percentage_complete = min(100, max(0, (elapsed_days / total_days) * 100))
        
        result = {
            "natal_moon_sign": natal_moon_name,
            "natal_moon_rasi_index": natal_moon_rasi,
            "current_phase": current_phase,
            "phase_description": phase_description,
            "percentage_complete": round(percentage_complete, 1),
            "total_duration": total_duration,
            "phase_dates": {
                "phase1_start": phase1_start,
                "phase2_start": phase2_start, 
                "phase3_start": phase3_start,
                "sade_sati_end": sade_sati_end
            },
            "current_phase_impact": phase_impacts.get(current_phase, {}),
            "remedial_measures": remedial_measures,
            "calculation_method": "Authentic jyotisha library with Lahiri Ayanamsa",
            "saturn_current_rasi": zodiac.RASI_LIST[current_rasi],
            "saturn_current_rasi_index": current_rasi
        }
        
        return result
        
    except Exception as e:
        return {
            "error": f"Sade Sati calculation failed: {str(e)}",
            "fallback_analysis": {
                "natal_moon_sign": "Unable to calculate",
                "current_phase": "Calculation error",
                "phase_description": "Please try again with valid birth details",
                "remedial_measures": remedial_measures[:5]
            }
        }

def main():
    """Main function for command-line usage"""
    if len(sys.argv) != 6:
        print("Usage: python sade-sati-calculator.py <year> <month> <day> <hour> <minute>")
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