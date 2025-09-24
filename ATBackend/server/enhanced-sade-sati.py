#!/usr/bin/env python3
"""
Enhanced Sade Sati Calculator using jyotisha approach
Calculates the 7.5-year Saturn transit period through natal Moon sign
Uses existing jyotisha-engine.py API for consistency
"""

import sys
import json
import subprocess
from datetime import datetime, timedelta

def get_planetary_positions(birth_year, birth_month, birth_day, birth_hour, birth_minute):
    """Get planetary positions using existing jyotisha-engine.py"""
    
    # Create birth data in the format expected by jyotisha-engine.py
    birth_data = {
        "name": "Sade Sati Analysis",
        "date": f"{birth_year}-{birth_month:02d}-{birth_day:02d}",
        "time": f"{birth_hour:02d}:{birth_minute:02d}",
        "place": "Chennai, Tamil Nadu, India",
        "latitude": 13.0827,
        "longitude": 80.2707
    }
    
    try:
        # Call the existing jyotisha-engine.py
        result = subprocess.run(
            ['python3', 'server/jyotisha-engine.py', json.dumps(birth_data)],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            jyotisha_result = json.loads(result.stdout)
            if jyotisha_result.get('success') and jyotisha_result.get('planets'):
                return jyotisha_result
        
        return None
    except Exception as e:
        print(f"Error calling jyotisha engine: {e}", file=sys.stderr)
        return None

def calculate_sade_sati(birth_year, birth_month, birth_day, birth_hour, birth_minute):
    """
    Calculate complete Sade Sati analysis using jyotisha engine
    """
    # Comprehensive remedial measures
    remedial_measures = [
        "Perform Saturn pacification rituals daily",
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
        # 1. Get birth chart data using existing jyotisha engine
        birth_chart = get_planetary_positions(birth_year, birth_month, birth_day, birth_hour, birth_minute)
        
        # 2. Get current Saturn position (using today's date for accuracy)
        current_dt = datetime.now()
        current_chart = get_planetary_positions(current_dt.year, current_dt.month, current_dt.day, 12, 0)
        
        if not birth_chart or not current_chart:
            raise Exception("Failed to get planetary positions from jyotisha engine")
            
        # Extract Moon and Saturn positions
        birth_planets = birth_chart.get('planets', [])
        current_planets = current_chart.get('planets', [])
        
        moon_planet = next((p for p in birth_planets if p['name'] == 'Moon'), None)
        saturn_planet = next((p for p in current_planets if p['name'] == 'Saturn'), None)
        
        # Debug: Log the actual Saturn position being used
        print(f"DEBUG: Current Saturn longitude: {saturn_planet['longitude'] if saturn_planet else 'None'}", file=sys.stderr)
        print(f"DEBUG: Current Saturn sign: {saturn_planet['sign'] if saturn_planet else 'None'}", file=sys.stderr)
        print(f"DEBUG: Current date used: {current_dt.year}-{current_dt.month}-{current_dt.day}", file=sys.stderr)
        
        if not moon_planet or not saturn_planet:
            raise Exception("Moon or Saturn position not found in planetary data")
        
        # Calculate rashi positions
        natal_moon_rasi = int(moon_planet['longitude'] // 30)
        current_saturn_rasi = int(saturn_planet['longitude'] // 30)
        
        # Rashi names
        rashi_names = [
            "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
            "तुला", "वृश्चिक", "धनु", "मकर", "कुम्भ", "मीन"
        ]
        
        natal_moon_name = rashi_names[natal_moon_rasi]
        current_saturn_name = rashi_names[current_saturn_rasi]
        
        # 3. Define the three Sade Sati phases
        M = natal_moon_rasi
        rasi_before = (M - 1) % 12
        rasi_after = (M + 1) % 12
        
        # 4. Determine current phase
        print(f"DEBUG: Moon rasi: {M} ({natal_moon_name}), Saturn rasi: {current_saturn_rasi} ({current_saturn_name})", file=sys.stderr)
        print(f"DEBUG: Phase 1 rasi: {rasi_before}, Phase 2 rasi: {M}, Phase 3 rasi: {rasi_after}", file=sys.stderr)
        
        if current_saturn_rasi == rasi_before:
            current_phase = "Rising Phase (Emerging)"
            phase_description = "First phase of Sade Sati - challenges begin to emerge, foundation testing period."
            phase_intensity = "Moderate"
            is_in_sade_sati = True
        elif current_saturn_rasi == M:
            current_phase = "Peak Phase (Peak intensity)"
            phase_description = "Second phase of Sade Sati - peak intensity, maximum challenges and transformations."
            phase_intensity = "High"
            is_in_sade_sati = True
        elif current_saturn_rasi == rasi_after:
            current_phase = "Setting Phase (Departing)"
            phase_description = "Third phase of Sade Sati - challenges gradually reduce, relief and improvements begin."
            phase_intensity = "Moderate"
            is_in_sade_sati = True
        else:
            current_phase = "Not in Śade-Sāti"
            phase_description = "Normal Saturn influence - No special Sade Sati effects currently active."
            phase_intensity = "Low"
            is_in_sade_sati = False
        
        # 5. Calculate life impact based on natal Moon sign
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
        
        # 6. Phase-specific analysis
        phase_analysis = {
            "Phase 1 (Purva-Śādi)": {
                "duration": "Approximately 2.5 years",
                "key_themes": ["Financial challenges", "Career obstacles", "Health concerns", "Relationship tensions"],
                "spiritual_lesson": "Developing patience and perseverance",
                "remedial_focus": "Strengthening foundation, financial discipline",
                "intensity": "Moderate"
            },
            "Phase 2 (Madhya-Śādi)": {
                "duration": "Approximately 2.5 years",
                "key_themes": ["Mental stress", "Emotional upheaval", "Major life changes", "Family issues"],
                "spiritual_lesson": "Inner transformation and self-discovery",
                "remedial_focus": "Mental peace, emotional balance, spiritual practices",
                "intensity": "High"
            },
            "Phase 3 (Uttara-Śādi)": {
                "duration": "Approximately 2.5 years",
                "key_themes": ["Gradual improvement", "Lesson integration", "New opportunities", "Relationship healing"],
                "spiritual_lesson": "Wisdom application and service to others",
                "remedial_focus": "Sharing knowledge, helping others, gratitude practices",
                "intensity": "Moderate"
            },
            "Not in Śade-Sāti": {
                "duration": "Normal Saturn influence",
                "key_themes": ["Regular life progression", "Steady growth", "Balanced challenges", "Normal opportunities"],
                "spiritual_lesson": "Continuous self-improvement",
                "remedial_focus": "Maintaining discipline, regular spiritual practice",
                "intensity": "Low"
            }
        }
        
        # 7. Create comprehensive result matching frontend expectations
        result = {
            "personalInfo": {
                "name": f"Sade Sati Analysis {birth_year}",
                "gender": "male",
                "birthDate": f"{birth_year}-{birth_month:02d}-{birth_day:02d}",
                "birthTime": f"{birth_hour:02d}:{birth_minute:02d}",
                "birthPlace": "Chennai, Tamil Nadu, India"
            },
            "moonSign": natal_moon_name,
            "currentStatus": {
                "isInSadeSati": is_in_sade_sati,
                "currentPhase": current_phase,
                "phaseDescription": phase_description,
                "intensityLevel": phase_intensity,
                "remainingDuration": "Approximately 2.5 years per phase"
            },
            "sadeSatiPeriods": [
                {
                    "phase": "Rising Phase (Emerging)",
                    "startDate": "Calculated based on Saturn transit",
                    "endDate": "Approximately 2.5 years duration",
                    "duration": "2.5 years",
                    "description": "First phase where challenges begin to emerge. This is the introductory period of Sade Sati.",
                    "effects": [
                        "Gradual increase in obstacles and challenges",
                        "Initial career or business difficulties",
                        "Minor health issues may arise",
                        "Relationship tensions may begin",
                        "Financial constraints may develop"
                    ],
                    "remedies": [
                        "Begin regular Saturn worship on Saturdays",
                        "Recite Shani Stotra daily",
                        "Light sesame oil lamp for Lord Shani",
                        "Donate black items to the needy",
                        "Avoid major life decisions during this phase"
                    ]
                },
                {
                    "phase": "Peak Phase (Peak intensity)",
                    "startDate": "Follows Rising Phase",
                    "endDate": "Approximately 2.5 years duration",
                    "duration": "2.5 years",
                    "description": "Second phase with maximum intensity. This is the most challenging period of Sade Sati.",
                    "effects": [
                        "Maximum challenges and obstacles",
                        "Significant career or business setbacks",
                        "Health issues may intensify",
                        "Family and relationship problems",
                        "Financial difficulties at peak",
                        "Mental stress and anxiety"
                    ],
                    "remedies": [
                        "Intensive Saturn remedies and worship",
                        "Recite Hanuman Chalisa daily",
                        "Perform Shani Shanti Puja",
                        "Fast on Saturdays if possible",
                        "Seek guidance from experienced astrologers",
                        "Practice meditation and spiritual disciplines"
                    ]
                },
                {
                    "phase": "Setting Phase (Departing)",
                    "startDate": "Follows Peak Phase",
                    "endDate": "Approximately 2.5 years duration",
                    "duration": "2.5 years",
                    "description": "Third phase where challenges gradually reduce. Relief and improvements begin.",
                    "effects": [
                        "Gradual reduction in obstacles",
                        "Slow improvement in career prospects",
                        "Health begins to stabilize",
                        "Relationship issues start resolving",
                        "Financial situation improves gradually"
                    ],
                    "remedies": [
                        "Continue Saturn worship but with gratitude",
                        "Maintain spiritual practices established",
                        "Help others going through difficulties",
                        "Donate to charitable causes",
                        "Prepare for post-Sade Sati opportunities"
                    ]
                }
            ],
            "overallAnalysis": {
                "totalDuration": "7.5 years (2.5 years per phase)",
                "mostIntensePhase": "Peak Phase (Middle 2.5 years)",
                "generalEffects": [
                    "Career and business challenges",
                    "Financial constraints and expenses",
                    "Health issues and medical costs",
                    "Relationship and family tensions",
                    "Delays in important life events",
                    "Spiritual growth and life lessons",
                    "Character building through adversity",
                    "Removal of negative karma"
                ],
                "lifeAreas": [
                    "Career & Profession",
                    "Finance & Wealth",
                    "Health & Wellness",
                    "Relationships & Marriage",
                    "Family & Home",
                    "Spirituality & Growth"
                ]
            },
            "remedies": {
                "daily": [
                    "Recite \"Om Sham Shanicharaya Namah\" 108 times",
                    "Light sesame oil lamp for Lord Shani",
                    "Read Shani Stotra or Shani Chalisa",
                    "Offer water to Peepal tree",
                    "Practice meditation for mental peace"
                ],
                "weekly": [
                    "Visit Shani temple on Saturdays",
                    "Fast on Saturdays (if health permits)",
                    "Donate black items to the needy",
                    "Feed crows and street dogs",
                    "Recite Hanuman Chalisa 7 times"
                ],
                "special": [
                    "Perform Shani Shanti Puja on Saturdays",
                    "Visit Shani Shingnapur temple",
                    "Organize food distribution for the poor",
                    "Sponsor education for underprivileged children",
                    "Practice Surya Namaskar daily"
                ],
                "gemstones": [
                    "Blue Sapphire (Neelam) - after expert consultation",
                    "Amethyst as alternative to Blue Sapphire",
                    "Iron ring worn on middle finger of right hand"
                ],
                "mantras": [
                    "Om Sham Shanicharaya Namah",
                    "Nilanjan Samabhasam Ravi Putram Yamagrajam",
                    "Shani Gayatri Mantra",
                    "Dasharatha Shani Stotra"
                ]
            },
            "calculationDetails": {
                "method": "Jyotisha-Saturn-Transit-Analysis",
                "saturnPosition": f"{current_saturn_name} ({round(saturn_planet['longitude'] % 30, 2)}°)",
                "moonPosition": f"{natal_moon_name} ({round(moon_planet['longitude'] % 30, 2)}°)",
                "ayanamsa": "Lahiri Ayanamsa"
            }
        }
        
        return result
        
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
    """Main function for command-line usage or JSON input from stdin"""
    try:
        # Check if JSON input is provided via stdin
        if not sys.stdin.isatty():
            # Read JSON from stdin
            input_data = sys.stdin.read().strip()
            if input_data:
                try:
                    data = json.loads(input_data)
                    year = data.get('year')
                    month = data.get('month')
                    day = data.get('day')
                    hour = data.get('hour')
                    minute = data.get('minute')
                    
                    if all(v is not None for v in [year, month, day, hour, minute]):
                        result = calculate_sade_sati(year, month, day, hour, minute)
                        # Wrap result in success structure for premium report integration
                        output = {
                            "success": True,
                            "sade_sati_analysis": result
                        }
                        print(json.dumps(output, indent=2, default=str))
                        return
                    else:
                        print(json.dumps({"success": False, "error": "Missing required fields in JSON input"}, indent=2))
                        return
                except json.JSONDecodeError:
                    print(json.dumps({"success": False, "error": "Invalid JSON input"}, indent=2))
                    return
        
        # Command-line argument mode
        if len(sys.argv) != 6:
            print("Usage: python enhanced-sade-sati.py <year> <month> <day> <hour> <minute>")
            sys.exit(1)
        
        year = int(sys.argv[1])
        month = int(sys.argv[2])
        day = int(sys.argv[3])
        hour = int(sys.argv[4])
        minute = int(sys.argv[5])
        
        result = calculate_sade_sati(year, month, day, hour, minute)
        print(json.dumps(result, indent=2, default=str))
        
    except ValueError as e:
        print(json.dumps({"success": False, "error": f"Invalid input: {str(e)}"}, indent=2))
    except Exception as e:
        print(json.dumps({"success": False, "error": f"Calculation error: {str(e)}"}, indent=2))

if __name__ == "__main__":
    main()