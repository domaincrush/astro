#!/usr/bin/env python3
"""
Simplified Lal Kitab Analysis Engine
Uses basic calculations without complex imports
"""

import sys
import json
import traceback
from datetime import datetime
import math

def calculate_lal_kitab_analysis(birth_data):
    """
    Calculate comprehensive Lal Kitab analysis with simplified calculations
    """
    try:
        # Parse birth data
        name = birth_data.get('name', '')
        birth_date = birth_data.get('birthDate', '')
        birth_time = birth_data.get('birthTime', '')
        birth_place = birth_data.get('birthPlace', '')
        
        # Parse date and time
        date_parts = birth_date.split('-')
        time_parts = birth_time.split(':')
        
        year = int(date_parts[0])
        month = int(date_parts[1])
        day = int(date_parts[2])
        hour = int(time_parts[0])
        minute = int(time_parts[1])
        
        # Calculate Julian Day (simplified)
        jd = calculate_julian_day(year, month, day, hour, minute)
        
        # Calculate planetary positions (simplified)
        planets = calculate_simplified_planetary_positions(jd, year, month, day)
        
        # Calculate Lal Kitab houses
        lal_kitab_houses = calculate_lal_kitab_houses(planets)
        
        # Analyze planetary strengths
        analysis = analyze_planetary_strengths(planets, lal_kitab_houses)
        
        # Generate predictions
        predictions = generate_lal_kitab_predictions(planets, lal_kitab_houses, analysis)
        
        # Generate remedies
        remedies = generate_lal_kitab_remedies(planets, lal_kitab_houses, analysis)
        
        # Generate totkas
        totkas = generate_lal_kitab_totkas(planets, analysis)
        
        # Get moon sign and ascendant
        moon_sign = get_sign_from_longitude(planets['Moon']['longitude'])
        ascendant = get_ascendant_from_time(jd, 13.0827, 80.2707)  # Default Chennai
        
        return {
            'success': True,
            'basicInfo': {
                'name': name,
                'birthDate': birth_date,
                'birthTime': birth_time,
                'birthPlace': birth_place,
                'moonSign': moon_sign,
                'ascendant': ascendant
            },
            'planetaryPositions': format_planetary_positions(planets, lal_kitab_houses),
            'lalKitabAnalysis': analysis,
            'remedies': remedies,
            'predictions': predictions,
            'totkas': totkas
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': f'Lal Kitab calculation failed: {str(e)}',
            'traceback': traceback.format_exc()
        }

def calculate_julian_day(year, month, day, hour, minute):
    """Calculate Julian Day (simplified)"""
    # Simplified Julian Day calculation
    if month <= 2:
        year -= 1
        month += 12
    
    a = year // 100
    b = 2 - a + (a // 4)
    
    jd = int(365.25 * (year + 4716)) + int(30.6001 * (month + 1)) + day + b - 1524.5
    jd += (hour + minute / 60.0) / 24.0
    
    return jd

def calculate_simplified_planetary_positions(jd, year, month, day):
    """Calculate simplified planetary positions"""
    # Simplified planetary calculations based on date
    day_of_year = datetime(year, month, day).timetuple().tm_yday
    
    # Simplified calculations - in practice, these would use proper ephemeris
    planets = {
        'Sun': {'longitude': (day_of_year * 0.9856) % 360},
        'Moon': {'longitude': (day_of_year * 13.1763) % 360},
        'Mercury': {'longitude': (day_of_year * 1.3833) % 360},
        'Venus': {'longitude': (day_of_year * 0.6152) % 360},
        'Mars': {'longitude': (day_of_year * 0.5240) % 360},
        'Jupiter': {'longitude': (day_of_year * 0.0831) % 360},
        'Saturn': {'longitude': (day_of_year * 0.0335) % 360},
        'Rahu': {'longitude': (360 - (day_of_year * 0.0529)) % 360},
        'Ketu': {'longitude': (180 - (day_of_year * 0.0529)) % 360}
    }
    
    return planets

def calculate_lal_kitab_houses(planets):
    """Calculate Lal Kitab house positions for planets"""
    lal_kitab_houses = {}
    
    for planet_name, planet_data in planets.items():
        longitude = planet_data['longitude']
        house = int(longitude / 30) + 1  # 1-12 houses
        lal_kitab_houses[planet_name] = house
    
    return lal_kitab_houses

def analyze_planetary_strengths(planets, lal_kitab_houses):
    """Analyze planetary strengths according to Lal Kitab principles"""
    strong_planets = []
    weak_planets = []
    benefic_houses = []
    malefic_houses = []
    karma_debt = []
    
    for planet_name, house in lal_kitab_houses.items():
        # Check if planet is strong or weak in Lal Kitab
        if is_planet_strong_in_lal_kitab(planet_name, house):
            strong_planets.append(planet_name)
        else:
            weak_planets.append(planet_name)
        
        # Check house benefic/malefic nature
        if is_house_benefic_in_lal_kitab(house, planet_name):
            benefic_houses.append(house)
        else:
            malefic_houses.append(house)
        
        # Check for karmic debts
        if has_karmic_debt_in_lal_kitab(planet_name, house):
            karma_debt.append(f"{planet_name} in House {house}")
    
    return {
        'strongPlanets': strong_planets,
        'weakPlanets': weak_planets,
        'beneficHouses': list(set(benefic_houses)),
        'maleficHouses': list(set(malefic_houses)),
        'karmaDebt': karma_debt
    }

def is_planet_strong_in_lal_kitab(planet_name, house):
    """Check if planet is strong in Lal Kitab system"""
    benefic_houses = {
        'Sun': [1, 5, 9, 10, 11],
        'Moon': [1, 2, 5, 7, 10],
        'Mars': [3, 6, 11],
        'Mercury': [2, 4, 6, 10],
        'Jupiter': [1, 2, 5, 9, 11],
        'Venus': [1, 2, 4, 5, 9, 11],
        'Saturn': [2, 3, 7, 10, 11],
        'Rahu': [3, 6, 11],
        'Ketu': [3, 6, 11]
    }
    
    karmic_debts = {
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
    
    if house in karmic_debts.get(planet_name, []):
        return False  # Karmic debt = not strong
    elif house in benefic_houses.get(planet_name, []):
        return True   # Benefic = strong
    else:
        return False  # Neutral/needs remedy = not strong

def get_planet_strength_status(planet_name, house):
    """Get detailed planet strength status for Lal Kitab"""
    benefic_houses = {
        'Sun': [1, 5, 9, 10, 11],
        'Moon': [1, 2, 5, 7, 10],
        'Mars': [3, 6, 11],
        'Mercury': [2, 4, 6, 10],
        'Jupiter': [1, 2, 5, 9, 11],
        'Venus': [1, 2, 4, 5, 9, 11],
        'Saturn': [2, 3, 7, 10, 11],
        'Rahu': [3, 6, 11],
        'Ketu': [3, 6, 11]
    }
    
    karmic_debts = {
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
    
    if house in karmic_debts.get(planet_name, []):
        return 'Karmic Debt'
    elif house in benefic_houses.get(planet_name, []):
        return 'Strong'
    else:
        return 'Average'

def is_house_benefic_in_lal_kitab(house, planet_name):
    """Check if house is benefic for the planet in Lal Kitab"""
    benefic_houses = {
        1: ['Sun', 'Mars', 'Jupiter'],
        2: ['Moon', 'Mercury', 'Venus', 'Jupiter'],
        3: ['Mars', 'Mercury', 'Saturn'],
        4: ['Moon', 'Mercury', 'Venus', 'Jupiter'],
        5: ['Sun', 'Mercury', 'Venus', 'Jupiter'],
        6: ['Sun', 'Mars', 'Saturn'],
        7: ['Moon', 'Mars', 'Jupiter'],
        8: ['Mars', 'Venus', 'Saturn'],
        9: ['Sun', 'Mercury', 'Venus', 'Jupiter'],
        10: ['Sun', 'Moon', 'Mercury', 'Mars', 'Jupiter', 'Saturn'],
        11: ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'],
        12: ['Venus', 'Saturn']
    }
    
    return planet_name in benefic_houses.get(house, [])

def has_karmic_debt_in_lal_kitab(planet_name, house):
    """Check for karmic debts in Lal Kitab"""
    karmic_debts = {
        'Sun': [8, 12],
        'Moon': [8, 12],
        'Mercury': [8, 12],
        'Venus': [6, 8, 12],
        'Mars': [6, 8, 12],
        'Jupiter': [6, 8, 12],
        'Saturn': [1, 4, 5, 8, 12],
        'Rahu': [1, 2, 4, 5, 7, 8, 9, 12],
        'Ketu': [1, 2, 4, 5, 7, 8, 9, 12]
    }
    
    return house in karmic_debts.get(planet_name, [])

def generate_lal_kitab_predictions(planets, lal_kitab_houses, analysis):
    """Generate Lal Kitab predictions"""
    strong_count = len(analysis['strongPlanets'])
    weak_count = len(analysis['weakPlanets'])
    
    predictions = {
        'general': "According to Lal Kitab principles, your life will have a mix of challenges and opportunities. Past karma influences present circumstances, but proper remedies can improve your situation significantly.",
        'career': "Your career will show gradual progress. Government or authority-related work may be favorable. Business partnerships should be approached with caution.",
        'marriage': "Marriage will bring stability but may require adjustments. Mutual understanding and respect will be key to a harmonious relationship.",
        'health': "Health requires attention, especially related to chronic conditions. Regular exercise and proper diet are essential for maintaining good health.",
        'wealth': "Wealth accumulation will be through steady efforts. Avoid speculation and invest in secure options. Multiple income sources are possible.",
        'enemies': "Be cautious of hidden enemies and false friends. Direct confrontation should be avoided. Patience and wisdom will help overcome obstacles."
    }
    
    return predictions

def generate_lal_kitab_remedies(planets, lal_kitab_houses, analysis):
    """Generate Lal Kitab remedies"""
    remedies = []
    
    # Generate remedies for weak planets
    for planet in analysis['weakPlanets']:
        house = lal_kitab_houses.get(planet, 1)
        remedy = get_planet_remedy(planet, house)
        if remedy:
            remedies.append(remedy)
    
    # Add dosha-specific remedies
    dosha_remedies = generate_dosha_remedies(planets, lal_kitab_houses)
    remedies.extend(dosha_remedies)
    
    # Add general remedies
    remedies.extend([
        {
            'planet': 'General',
            'issue': 'Overall planetary weakness',
            'remedy': 'Donate food to poor on Saturdays',
            'procedure': 'Distribute cooked food to needy people every Saturday',
            'duration': '11 Saturdays',
            'cost': '₹100-500 per Saturday'
        },
        {
            'planet': 'General',
            'issue': 'Karmic debt reduction',
            'remedy': 'Serve parents and elders',
            'procedure': 'Take care of elderly people, respect parents',
            'duration': 'Continuous',
            'cost': 'Free (service)'
        }
    ])
    
    return remedies

def generate_dosha_remedies(planets, lal_kitab_houses):
    """Generate remedies for specific doshas detected in chart"""
    dosha_remedies = []
    
    # Check for Mangal Dosha (Mars in houses 1,2,4,7,8,12)
    mars_house = lal_kitab_houses.get('Mars', 1)
    if mars_house in [1, 2, 4, 7, 8, 12]:
        dosha_remedies.append({
            'planet': 'Mars (Mangal Dosha)',
            'issue': f'Mangal Dosha detected - Mars in {mars_house} house causing marriage delays',
            'remedy': 'Perform Mangal Dosh Nivaran Puja',
            'procedure': 'Visit Hanuman temple on Tuesdays, recite Hanuman Chalisa 7 times',
            'duration': '21 Tuesdays',
            'cost': '₹500-2000 per puja'
        })
    
    # Check for Shani Dosha (Saturn in challenging houses)
    saturn_house = lal_kitab_houses.get('Saturn', 1)
    if saturn_house in [1, 4, 5, 8, 12]:
        dosha_remedies.append({
            'planet': 'Saturn (Shani Dosha)',
            'issue': f'Shani Dosha detected - Saturn in {saturn_house} house causing delays and obstacles',
            'remedy': 'Perform Shani Shanti Puja',
            'procedure': 'Visit Shani temple on Saturdays, donate sesame oil and black cloth',
            'duration': '19 Saturdays',
            'cost': '₹200-1000 per Saturday'
        })
    
    # Check for Pitra Dosha (Sun-Rahu conjunction or challenging aspects)
    sun_house = lal_kitab_houses.get('Sun', 1)
    rahu_house = lal_kitab_houses.get('Rahu', 1)
    if sun_house in [8, 12] or rahu_house in [1, 5, 9]:
        dosha_remedies.append({
            'planet': 'Sun-Rahu (Pitra Dosha)',
            'issue': 'Pitra Dosha detected - ancestral blessings needed',
            'remedy': 'Perform Pitra Paksha rituals',
            'procedure': 'Offer tarpan to ancestors, feed Brahmins, donate to charity',
            'duration': '15 days during Pitra Paksha',
            'cost': '₹1000-5000 total'
        })
    
    return dosha_remedies

def get_planet_remedy(planet, house):
    """Get specific remedy for planet in house"""
    remedies = {
        'Sun': {
            'planet': 'Sun',
            'issue': 'Weak Sun affecting confidence and health',
            'remedy': 'Offer water to Sun every morning',
            'procedure': 'Face east and offer water to rising sun with copper vessel',
            'duration': '108 days continuously',
            'cost': 'Free (water offering)'
        },
        'Moon': {
            'planet': 'Moon',
            'issue': 'Weak Moon causing mental stress',
            'remedy': 'Donate white items on Mondays',
            'procedure': 'Donate rice, milk, white cloth to poor on Mondays',
            'duration': '21 Mondays',
            'cost': '₹100-500 per Monday'
        },
        'Mercury': {
            'planet': 'Mercury',
            'issue': 'Weak Mercury affecting communication',
            'remedy': 'Feed green grass to cows',
            'procedure': 'Feed fresh green grass to cows every Wednesday',
            'duration': '43 days',
            'cost': '₹10-50 per day'
        },
        'Venus': {
            'planet': 'Venus',
            'issue': 'Weak Venus affecting relationships',
            'remedy': 'Donate white items to unmarried girls',
            'procedure': 'Donate white sweets, white cloth to unmarried girls',
            'duration': '16 Fridays',
            'cost': '₹200-1000 per Friday'
        },
        'Mars': {
            'planet': 'Mars',
            'issue': 'Weak Mars affecting courage',
            'remedy': 'Donate red items on Tuesdays',
            'procedure': 'Donate red cloth, jaggery, red lentils to poor',
            'duration': '21 Tuesdays',
            'cost': '₹100-500 per Tuesday'
        },
        'Jupiter': {
            'planet': 'Jupiter',
            'issue': 'Weak Jupiter affecting wisdom',
            'remedy': 'Donate yellow items on Thursdays',
            'procedure': 'Donate turmeric, yellow cloth, books to Brahmins',
            'duration': '16 Thursdays',
            'cost': '₹200-1000 per Thursday'
        },
        'Saturn': {
            'planet': 'Saturn',
            'issue': 'Weak Saturn causing delays',
            'remedy': 'Donate black items on Saturdays',
            'procedure': 'Donate black cloth, oil, iron items to poor',
            'duration': '19 Saturdays',
            'cost': '₹100-500 per Saturday'
        },
        'Rahu': {
            'planet': 'Rahu',
            'issue': 'Rahu causing confusion',
            'remedy': 'Donate coconut in flowing water',
            'procedure': 'Throw coconut in flowing river or sea',
            'duration': '18 consecutive days',
            'cost': '₹20-50 per day'
        },
        'Ketu': {
            'planet': 'Ketu',
            'issue': 'Ketu causing spiritual confusion',
            'remedy': 'Donate multi-colored items',
            'procedure': 'Donate blanket, multi-colored cloth to poor',
            'duration': '7 consecutive days',
            'cost': '₹200-1000 per day'
        }
    }
    
    return remedies.get(planet)

def generate_lal_kitab_totkas(planets, analysis):
    """Generate Lal Kitab totkas (quick remedies)"""
    totkas = [
        {
            'purpose': 'Increase wealth and prosperity',
            'procedure': 'Keep silver coin in wallet, never let it become empty',
            'materials': ['Silver coin', 'Red cloth'],
            'timing': 'Any auspicious day',
            'precautions': ['Never lend this coin', 'Keep wallet neat and clean']
        },
        {
            'purpose': 'Protection from enemies',
            'procedure': 'Bury iron nails in four corners of house',
            'materials': ['4 iron nails', 'Black thread'],
            'timing': 'Saturday morning',
            'precautions': ['Do not tell anyone about this', 'Bury at sunrise']
        },
        {
            'purpose': 'Improve health and vitality',
            'procedure': 'Drink water from silver glass daily',
            'materials': ['Silver glass', 'Pure water'],
            'timing': 'Every morning on empty stomach',
            'precautions': ['Clean glass daily', 'Use only pure water']
        },
        {
            'purpose': 'Success in business',
            'procedure': 'Place elephant figurine facing entrance',
            'materials': ['Elephant figurine', 'Red vermillion'],
            'timing': 'Wednesday morning',
            'precautions': ['Face should be towards main door', 'Keep clean and worship daily']
        },
        {
            'purpose': 'Harmony in relationships',
            'procedure': 'Plant basil (tulsi) in front of house',
            'materials': ['Basil plant', 'Earthen pot'],
            'timing': 'Thursday morning',
            'precautions': ['Water daily', 'Never let plant dry']
        }
    ]
    
    return totkas

def get_sign_from_longitude(longitude):
    """Get zodiac sign from longitude"""
    signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
             'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
    sign_index = int(longitude / 30)
    return signs[sign_index % 12]

def get_ascendant_from_time(jd, latitude, longitude):
    """Calculate ascendant from time and location (simplified)"""
    # Simplified ascendant calculation
    ascendant_longitude = (jd % 1) * 360  # Simplified
    return get_sign_from_longitude(ascendant_longitude)

def format_planetary_positions(planets, lal_kitab_houses):
    """Format planetary positions for frontend"""
    formatted = []
    
    for planet_name, planet_data in planets.items():
        longitude = planet_data['longitude']
        sign = get_sign_from_longitude(longitude)
        degree = f"{longitude % 30:.2f}°"
        house = int(longitude / 30) + 1
        lal_kitab_house = lal_kitab_houses.get(planet_name, house)
        
        # Determine status using new refined logic
        status = get_planet_strength_status(planet_name, lal_kitab_house)
        
        # Get effects
        effects = get_planet_effects(planet_name, lal_kitab_house)
        
        formatted.append({
            'planet': planet_name,
            'house': house,
            'sign': sign,
            'degree': degree,
            'lalKitabHouse': lal_kitab_house,
            'status': status,
            'effects': effects
        })
    
    return formatted

def get_planet_effects(planet_name, house):
    """Get effects of planet in house"""
    effects_map = {
        'Sun': ['Leadership', 'Authority', 'Confidence'],
        'Moon': ['Emotions', 'Intuition', 'Popularity'],
        'Mercury': ['Intelligence', 'Communication', 'Business'],
        'Venus': ['Love', 'Beauty', 'Luxury'],
        'Mars': ['Energy', 'Courage', 'Action'],
        'Jupiter': ['Wisdom', 'Knowledge', 'Spirituality'],
        'Saturn': ['Discipline', 'Hard work', 'Delays'],
        'Rahu': ['Ambition', 'Confusion', 'Material gains'],
        'Ketu': ['Detachment', 'Spirituality', 'Past karma']
    }
    
    return effects_map.get(planet_name, ['General influence'])

def main():
    """Main function to handle command line arguments"""
    if len(sys.argv) < 2:
        print("Usage: python lal-kitab-simple.py '<json_data>'")
        sys.exit(1)
    
    try:
        # Parse JSON input
        json_data = sys.argv[1]
        birth_data = json.loads(json_data)
        
        # Calculate Lal Kitab analysis
        result = calculate_lal_kitab_analysis(birth_data)
        
        # Print result as JSON
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        error_result = {
            'success': False,
            'error': f'Lal Kitab engine error: {str(e)}',
            'traceback': traceback.format_exc()
        }
        print(json.dumps(error_result, indent=2))

if __name__ == "__main__":
    main()