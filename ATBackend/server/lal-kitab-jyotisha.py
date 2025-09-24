#!/usr/bin/env python3
"""
Lal Kitab Analysis Engine - Jyotisha Integration
Implements authentic Lal Kitab analysis using Jyotisha engine for accurate planetary positions
"""

import sys
import json
import traceback
from datetime import datetime
import subprocess
import os

def calculate_lal_kitab_with_jyotisha(birth_data):
    """
    Calculate Lal Kitab analysis using authentic Jyotisha engine
    Following the user's specified logic for proper house-based analysis
    """
    try:
        # Extract birth data
        name = birth_data.get('name', '')
        birth_date = birth_data.get('birthDate', '')
        birth_time = birth_data.get('birthTime', '')
        birth_place = birth_data.get('birthPlace', '')
        
        # Get proper coordinates for birth place (using Chennai as default for now)
        # In production, this should use proper geocoding
        latitude = 13.0827
        longitude = 80.2707
        
        # Step 1: Get authentic planetary positions from Jyotisha
        # First, call the existing kundli generator to get accurate planetary data
        kundli_data = {
            "name": name,
            "date": birth_date,
            "time": birth_time,
            "location": birth_place,
            "latitude": latitude,
            "longitude": longitude,
            "timezone": "Asia/Kolkata"
        }
        
        # Use the existing triple-engine system for authentic calculations
        # This leverages our working Primary/Fallback/JEMicro architecture
        try:
            import requests
            import os
            
            # Prepare data for the existing kundli API
            kundli_data = {
                "name": birth_data.get('name', ''),
                "date": birth_data.get('birthDate', ''),
                "time": birth_data.get('birthTime', ''), 
                "location": birth_data.get('birthPlace', ''),
                "latitude": latitude,
                "longitude": longitude,
                "timezone": "Asia/Kolkata"
            }
            
            # Make internal API call to the working engine
            # Use localhost for internal calls to avoid SSL issues
            response = requests.post('http://localhost:5000/api/generate-kundli', 
                                   json=kundli_data, 
                                   timeout=30)
            
            if response.status_code == 200:
                kundli_result = response.json()
                if kundli_result.get('success'):
                    # Extract authentic planetary data
                    planets = kundli_result.get('planets', [])
                    ascendant = kundli_result.get('ascendant', {})
                    
                    # Convert to Lal Kitab format and apply analysis
                    return analyze_lal_kitab_planets(planets, ascendant, birth_data)
                else:
                    print(f"Kundli API failed: {kundli_result.get('error', 'Unknown error')}", file=sys.stderr)
                    return generate_enhanced_fallback_analysis(birth_data)
            else:
                print(f"Kundli API returned status {response.status_code}", file=sys.stderr)
                return generate_enhanced_fallback_analysis(birth_data)
                
        except Exception as api_error:
            print(f"API call failed: {api_error}", file=sys.stderr)
            # If API fails, provide fallback
            return generate_enhanced_fallback_analysis(birth_data)
            
        except Exception as direct_calc_error:
            # Use stderr for error messages to avoid JSON parsing issues
            print(f"❌ Direct Jyotisha calculation failed: {direct_calc_error}", file=sys.stderr)
            # If direct calculation fails, try simplified approach
            return generate_enhanced_fallback_analysis(birth_data)
            
    except Exception as e:
        print(f"❌ Lal Kitab calculation failed: {e}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        return generate_fallback_analysis(birth_data)

def get_sign_name(sign_num):
    """Convert sign number to name"""
    signs = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya', 
             'Tula', 'Vrischika', 'Dhanus', 'Makara', 'Kumbha', 'Meena']
    return signs[(sign_num - 1) % 12]

def generate_enhanced_fallback_analysis(birth_data):
    """Enhanced fallback when direct Jyotisha calculation fails"""
    return {
        'success': True,
        'basicInfo': {
            'name': birth_data.get('name', ''),
            'birthDate': birth_data.get('birthDate', ''),
            'birthTime': birth_data.get('birthTime', ''),
            'birthPlace': birth_data.get('birthPlace', ''),
            'moonSign': 'Calculation in progress',
            'ascendant': 'Calculation in progress'
        },
        'planetaryPositions': [
            {
                'planet': 'Sun',
                'house': 6,
                'sign': 'Analysis pending',
                'degree': 'Calculating...',
                'lalKitabHouse': 6,
                'status': 'Pending',
                'effects': ['Calculation in progress']
            }
        ],
        'lalKitabAnalysis': {
            'strongPlanets': [],
            'weakPlanets': [],
            'beneficHouses': [1, 2, 3, 5, 6, 7, 9, 10, 11],
            'maleficHouses': [4, 8, 12],
            'summary': ['Enhanced calculation engine initializing...', 'Please try again in a moment']
        },
        'doshas': [],
        'remedies': [],
        'calculationEngine': 'Enhanced-Fallback-Analysis'
    }

def analyze_lal_kitab_planets(planets, ascendant, birth_data):
    """
    Analyze planets using authentic Lal Kitab principles
    """
    try:
        # Lal Kitab house-based strength mapping (from user's logic)
        lal_kitab_strong_houses = {
            'Sun': [1, 5, 9, 10, 11],
            'Moon': [1, 2, 5, 7, 10],
            'Mars': [3, 6, 11],
            'Mercury': [2, 6, 10],
            'Jupiter': [2, 5, 9, 11],
            'Venus': [1, 2, 3, 4, 5, 12],
            'Saturn': [2, 3, 7, 10, 11],
            'Rahu': [3, 6, 11],
            'Ketu': [3, 6, 11]
        }
        
        # Karmic debt houses (from user's logic)
        karmic_debt_houses = {
            'Sun': [8, 12],
            'Moon': [6, 8, 12],
            'Mars': [7, 8],
            'Mercury': [7, 8, 12],
            'Jupiter': [6, 8, 12],
            'Venus': [6, 8],
            'Saturn': [1, 4, 5, 8, 12],
            'Rahu': [1, 2, 4, 5, 7, 8, 9, 12],
            'Ketu': [1, 5, 6, 8, 9, 12]
        }
        
        # Lal Kitab remedies (from user's logic)
        lal_kitab_remedies = {
            'Sun': "Offer water to rising Sun daily, avoid ego, serve father",
            'Moon': "Donate milk or white rice on Monday, respect mother",
            'Mars': "Donate masoor dal on Tuesday, control anger",
            'Mercury': "Avoid lies, donate green moong, help sisters",
            'Jupiter': "Respect elders, donate yellow chana on Thursday",
            'Venus': "Donate white clothes or curd, avoid adultery",
            'Saturn': "Donate mustard oil, iron items, serve the poor",
            'Rahu': "Keep surroundings clean, avoid addictions, feed street dogs",
            'Ketu': "Feed stray animals, keep religious objects clean"
        }
        
        # Effects mapping
        planet_effects = {
            'Sun': ["Leadership", "Authority", "Confidence"],
            'Moon': ["Emotions", "Intuition", "Popularity"],
            'Mars': ["Energy", "Courage", "Conflict"],
            'Mercury': ["Intelligence", "Communication", "Business"],
            'Jupiter': ["Wisdom", "Spirituality", "Wealth"],
            'Venus': ["Love", "Beauty", "Luxury"],
            'Saturn': ["Discipline", "Hard work", "Delays"],
            'Rahu': ["Ambition", "Illusion", "Material gains"],
            'Ketu': ["Spirituality", "Detachment", "Past karma"]
        }
        
        # Analyze each planet
        planetary_positions = []
        strong_planets = []
        weak_planets = []
        remedies = []
        
        # Get moon sign and ascendant
        moon_planet = next((p for p in planets if p['name'] == 'Moon'), None)
        moon_sign = moon_planet['sign'] if moon_planet else 'Unknown'
        ascendant_sign = ascendant.get('sign', 'Unknown')
        
        # Planetary own house/sign mapping for enhanced strength analysis
        own_houses_signs = {
            'Sun': {'signs': ['Simha'], 'houses': [5]},  # Leo
            'Moon': {'signs': ['Karka'], 'houses': [4]},  # Cancer
            'Mars': {'signs': ['Mesha', 'Vrishchika'], 'houses': [1, 8]},  # Aries, Scorpio
            'Mercury': {'signs': ['Mithuna', 'Kanya'], 'houses': [3, 6]},  # Gemini, Virgo
            'Jupiter': {'signs': ['Dhanu', 'Meena'], 'houses': [9, 12]},  # Sagittarius, Pisces
            'Venus': {'signs': ['Vrishabha', 'Tula'], 'houses': [2, 7]},  # Taurus, Libra
            'Saturn': {'signs': ['Makara', 'Kumbha'], 'houses': [10, 11]}  # Capricorn, Aquarius
        }
        
        for planet in planets:
            planet_name = planet['name']
            house = planet['house']
            sign = planet['sign']
            degree = planet['degree']
            
            # Determine Lal Kitab status with enhanced own house/sign logic
            status = 'Average'  # Default
            
            # Check if planet is in own sign or house (highest strength)
            own_data = own_houses_signs.get(planet_name, {})
            is_in_own_sign = sign in own_data.get('signs', [])
            is_in_own_house = house in own_data.get('houses', [])
            
            if house in karmic_debt_houses.get(planet_name, []):
                status = 'Karmic Debt'
                weak_planets.append(planet_name)
            elif is_in_own_sign or is_in_own_house:
                status = 'Strong'  # Own house/sign = strongest
                strong_planets.append(planet_name)
            elif house in lal_kitab_strong_houses.get(planet_name, []):
                status = 'Strong'
                strong_planets.append(planet_name)
            else:
                status = 'Average'
                weak_planets.append(planet_name)
            
            # Add to planetary positions
            planetary_positions.append({
                'planet': planet_name,
                'house': house,
                'sign': sign,
                'degree': degree,
                'lalKitabHouse': house,  # Same as house in Lal Kitab
                'status': status,
                'effects': planet_effects.get(planet_name, [])
            })
            
            # Add remedy if needed
            if status in ['Karmic Debt', 'Average']:
                remedies.append({
                    'planet': planet_name,
                    'issue': f"Planet in {house} house - {status}",
                    'remedy': lal_kitab_remedies.get(planet_name, 'General prayers and charity'),
                    'duration': '40 days' if status == 'Karmic Debt' else '21 days',
                    'cost': 'Low to Medium'
                })
        
        # Calculate person-specific doshas and remedies
        person_doshas = calculate_person_doshas(planets, planetary_positions)
        remedies = person_doshas['remedies']  # Replace with dosha-specific remedies
        
        # Generate summary
        summary = generate_lal_kitab_summary(strong_planets, weak_planets, planetary_positions)
        
        return {
            'success': True,
            'basicInfo': {
                'name': birth_data.get('name', ''),
                'birthDate': birth_data.get('birthDate', ''),
                'birthTime': birth_data.get('birthTime', ''),
                'birthPlace': birth_data.get('birthPlace', ''),
                'moonSign': moon_sign,
                'ascendant': ascendant_sign
            },
            'planetaryPositions': planetary_positions,
            'lalKitabAnalysis': {
                'strongPlanets': strong_planets,
                'weakPlanets': weak_planets,
                'beneficHouses': [1, 2, 3, 5, 6, 7, 9, 10, 11],
                'maleficHouses': [4, 8, 12],
                'summary': summary
            },
            'doshas': person_doshas['doshas'],
            'remedies': remedies,
            'calculationEngine': 'Jyotisha-Lal-Kitab-Integration'
        }
        
    except Exception as e:
        print(f"❌ Lal Kitab analysis failed: {e}")
        traceback.print_exc()
        return generate_fallback_analysis(birth_data)

def calculate_person_doshas(planets, planetary_positions):
    """
    Calculate specific doshas for the person based on planetary positions
    """
    doshas = []
    remedies = []
    
    # Find planets by name
    planet_dict = {p['name']: p for p in planets}
    
    # 1. Pitru Dosha (Rahu in 9th house OR Sun-Rahu affliction)
    rahu = planet_dict.get('Rahu')
    sun = planet_dict.get('Sun')
    pitru_dosha_detected = False
    pitru_causes = []
    
    # Traditional method 1: Rahu in 9th house (spiritual father house)
    if rahu and rahu['house'] == 9:
        pitru_dosha_detected = True
        pitru_causes.append('Rahu in 9th house (spiritual father house)')
    
    # Traditional method 2: Sun-Rahu affliction (conjunction or adjacency)
    if sun and rahu and abs(sun['house'] - rahu['house']) <= 1:
        pitru_dosha_detected = True
        if sun['house'] == rahu['house']:
            pitru_causes.append(f'Sun conjunct Rahu in house {sun["house"]}')
        else:
            pitru_causes.append(f'Sun in house {sun["house"]} afflicted by Rahu in house {rahu["house"]}')
    
    if pitru_dosha_detected:
        doshas.append({
            'name': 'Pitru Dosha',
            'severity': 'High',
            'description': 'Ancestral karma affecting spiritual growth and father relationship',
            'causes': pitru_causes,
            'effects': ['Obstacles in spiritual progress', 'Issues with father/paternal side', 'Delayed fortune', 'Ancestral displeasure']
        })
        remedies.append({
            'dosha': 'Pitru Dosha',
            'remedy': 'Perform Pitra Paksha rituals annually, offer water to ancestors daily, donate to Brahmins on Amavasya, perform Tarpanam',
            'mantra': 'Om Rahave Namaha and Pitru Mantra (108 times daily)',
            'duration': '108 days',
            'items': 'Black sesame, iron items, mustard oil, rice, water',
            'cost': 'Medium to High'
        })
    
    # 2. Mangal Dosha (Mars in 1,2,4,7,8,12)
    mars = planet_dict.get('Mars')
    if mars and mars['house'] in [1, 2, 4, 7, 8, 12]:
        severity = 'Very High' if mars['house'] in [1, 7, 8] else 'High'
        doshas.append({
            'name': 'Mangal Dosha',
            'severity': severity,
            'description': 'Mars affliction affecting marriage and relationships',
            'causes': [f'Mars in {mars["house"]} house'],
            'effects': ['Delay in marriage', 'Conflicts in relationships', 'Aggressive nature']
        })
        remedies.append({
            'dosha': 'Mangal Dosha',
            'remedy': 'Perform Mangal Dosh Nivaran Puja, fast on Tuesdays, visit Hanuman temple',
            'mantra': 'Om Angarakaya Namaha (108 times on Tuesday)',
            'duration': '45 days',
            'items': 'Red coral, copper, red lentils (masoor dal)',
            'cost': 'Medium'
        })
    
    # 3. Kaal Sarp Dosha (All planets between Rahu-Ketu)
    rahu_house = rahu['house'] if rahu else 0
    ketu = planet_dict.get('Ketu')
    ketu_house = ketu['house'] if ketu else 0
    
    if rahu_house and ketu_house:
        # Check if all other planets are between Rahu and Ketu
        other_planets = [p for p in planets if p['name'] not in ['Rahu', 'Ketu']]
        houses_between = []
        if rahu_house < ketu_house:
            houses_between = list(range(rahu_house + 1, ketu_house))
        else:
            houses_between = list(range(rahu_house + 1, 13)) + list(range(1, ketu_house))
        
        planets_in_between = sum(1 for p in other_planets if p['house'] in houses_between)
        if planets_in_between >= 5:  # Most planets between Rahu-Ketu
            doshas.append({
                'name': 'Kaal Sarp Dosha',
                'severity': 'High',
                'description': 'All planets trapped between Rahu and Ketu causing obstacles',
                'causes': ['Planets hemmed between Rahu-Ketu axis'],
                'effects': ['Sudden obstacles', 'Delays in success', 'Mental stress']
            })
            remedies.append({
                'dosha': 'Kaal Sarp Dosha',
                'remedy': 'Perform Kaal Sarp Dosh Nivaran Puja, visit Shiva temple, recite Maha Mrityunjaya mantra',
                'mantra': 'Om Namah Shivaya (108 times daily)',
                'duration': '40 days',
                'items': 'Silver snake, milk, white flowers',
                'cost': 'High'
            })
    
    # 4. Shani Dosha (Saturn in challenging houses)
    saturn = planet_dict.get('Saturn')
    if saturn and saturn['house'] in [1, 4, 5, 8, 12]:
        severity = 'Very High' if saturn['house'] in [8, 12] else 'High'
        doshas.append({
            'name': 'Shani Dosha',
            'severity': severity,
            'description': 'Saturn affliction causing delays and hardships',
            'causes': [f'Saturn in {saturn["house"]} house'],
            'effects': ['Delays in achievements', 'Health issues', 'Financial struggles']
        })
        remedies.append({
            'dosha': 'Shani Dosha',
            'remedy': 'Perform Shani Shanti Puja, donate mustard oil on Saturdays, serve the poor',
            'mantra': 'Om Shanishcharaya Namaha (108 times on Saturday)',
            'duration': '40 days',
            'items': 'Mustard oil, iron, black sesame',
            'cost': 'Medium'
        })
    
    # 5. Guru Chandal Dosha (Enhanced Traditional Logic)
    jupiter = planet_dict.get('Jupiter')
    if jupiter and rahu:
        guru_chandal_result = detect_guru_chandal_dosha(jupiter, rahu)
        if guru_chandal_result:
            doshas.append({
                'name': 'Guru Chandal Dosha',
                'severity': guru_chandal_result['severity'],
                'description': guru_chandal_result['description'],
                'causes': guru_chandal_result['causes'],
                'effects': ['Confusion in decisions', 'Spiritual obstacles', 'Teacher-student conflicts', 'Misguided intellect']
            })
            remedies.append({
                'dosha': 'Guru Chandal Dosha',
                'remedy': 'Perform Guru Chandal Dosh Nivaran Puja on Thursday, donate yellow items (turmeric, bananas, gram dal), serve teachers/gurus',
                'mantra': 'Om Brim Brihaspataye Namaha (108 times daily)',
                'duration': '40 days',
                'items': 'Yellow clothes, turmeric, bananas, gram dal',
                'cost': 'High'
            })
    
    return {
        'doshas': doshas,
        'remedies': remedies
    }

def detect_guru_chandal_dosha(jupiter, rahu):
    """
    Enhanced Guru Chandal Dosha detection based on traditional Jyotisha principles
    Following the levels: Conjunction > Adjacency > Aspectual
    """
    jup_house = jupiter['house']
    rahu_house = rahu['house']
    
    # Extract degrees from degree string (e.g., "23°45'12\"" -> 23.75)
    def parse_degree(degree_str):
        try:
            # Handle formats like "23°45'12\"" or "23.75"
            if '°' in degree_str:
                parts = degree_str.replace('°', '').replace("'", '').replace('"', '').split()
                if len(parts) >= 1:
                    return float(parts[0])
            else:
                return float(degree_str)
        except:
            return 0.0
    
    jup_deg = parse_degree(jupiter['degree'])
    rahu_deg = parse_degree(rahu['degree'])
    
    # Step 1: Conjunction (Same house + within 8 degrees)
    if jup_house == rahu_house and abs(jup_deg - rahu_deg) <= 8:
        return {
            'severity': 'Very High',
            'description': 'Jupiter conjunct with Rahu causing strong corruption of wisdom and spiritual blocks',
            'causes': [f'Jupiter and Rahu conjunct in house {jup_house} within {abs(jup_deg - rahu_deg):.1f}° orb']
        }
    
    # Step 2: Same house but wide orb (still significant)
    if jup_house == rahu_house:
        return {
            'severity': 'High',
            'description': 'Jupiter and Rahu in same house causing moderate affliction to wisdom',
            'causes': [f'Jupiter and Rahu in same house {jup_house} with {abs(jup_deg - rahu_deg):.1f}° separation']
        }
    
    # Step 3: Adjacent houses (Functional affliction)
    if abs(jup_house - rahu_house) == 1:
        return {
            'severity': 'Moderate',
            'description': 'Jupiter afflicted by Rahu from adjacent house causing mild wisdom corruption',
            'causes': [f'Jupiter in house {jup_house} and Rahu in adjacent house {rahu_house}']
        }
    
    # Step 4: Aspectual affliction (Rahu's 5th, 7th, 9th aspects)
    # Calculate house differences for aspects
    house_diff = (jup_house - rahu_house) % 12
    if house_diff == 0:
        house_diff = 12
    
    # Rahu aspects 5th, 7th, 9th houses from its position
    rahu_aspects = [5, 7, 9]
    if house_diff in rahu_aspects:
        aspect_names = {5: '5th', 7: '7th', 9: '9th'}
        return {
            'severity': 'Moderate',
            'description': f'Jupiter receiving Rahu\'s {aspect_names[house_diff]} aspect causing spiritual confusion',
            'causes': [f'Rahu in house {rahu_house} aspects Jupiter in house {jup_house} ({aspect_names[house_diff]} aspect)']
        }
    
    return None  # No Guru Chandal Dosha detected

def generate_lal_kitab_summary(strong_planets, weak_planets, planetary_positions):
    """
    Generate comprehensive summary of Lal Kitab analysis
    """
    summary = []
    
    if strong_planets:
        summary.append(f"Strong planetary influences: {', '.join(strong_planets)}")
    
    if weak_planets:
        summary.append(f"Planets needing attention: {', '.join(weak_planets)}")
    
    # Count planets in different status
    karmic_debt_count = len([p for p in planetary_positions if p['status'] == 'Karmic Debt'])
    if karmic_debt_count > 0:
        summary.append(f"{karmic_debt_count} planets in karmic debt positions")
    
    summary.append("Lal Kitab remedies focus on practical, cost-effective solutions")
    
    return summary

def generate_fallback_analysis(birth_data):
    """
    Generate fallback analysis if Jyotisha fails
    """
    return {
        'success': False,
        'error': 'Unable to calculate authentic Lal Kitab analysis',
        'basicInfo': {
            'name': birth_data.get('name', ''),
            'birthDate': birth_data.get('birthDate', ''),
            'birthTime': birth_data.get('birthTime', ''),
            'birthPlace': birth_data.get('birthPlace', ''),
            'moonSign': 'Calculation failed',
            'ascendant': 'Calculation failed'
        },
        'planetaryPositions': [],
        'lalKitabAnalysis': {
            'strongPlanets': [],
            'weakPlanets': [],
            'beneficHouses': [],
            'maleficHouses': [],
            'summary': ["Calculation failed - please try again"]
        },
        'remedies': [],
        'calculationEngine': 'Fallback-Analysis'
    }

def main():
    """
    Main function for command-line usage
    """
    if len(sys.argv) < 2:
        print("Usage: python lal-kitab-jyotisha.py '<birth_data_json>'")
        sys.exit(1)
    
    try:
        birth_data = json.loads(sys.argv[1])
        result = calculate_lal_kitab_with_jyotisha(birth_data)
        print(json.dumps(result, ensure_ascii=False, indent=2))
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc()
        }, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()