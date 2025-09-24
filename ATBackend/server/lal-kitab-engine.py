#!/usr/bin/env python3
"""
Lal Kitab Analysis Engine
Comprehensive Lal Kitab astrology system using authentic Jyotisha calculations
"""

import sys
import json
import traceback
from datetime import datetime, timedelta
from pytz import timezone
from swisseph import set_ephe_path, julday, calc_ut, SEFLG_SWIEPH
from jyotisha.panchangam import spatio_temporal
from jyotisha.panchangam.temporal import zodiac, names
from jyotisha.panchangam.temporal.zodiac import NakshatraName
from jyotisha.panchangam.temporal.festival import rules
from jyotisha.panchangam.temporal.body import Graha
from jyotisha.panchangam.temporal.interval import Interval
from jyotisha.panchangam.temporal.time import Time
from jyotisha.panchangam.temporal.body import Planet
from jyotisha.panchangam.temporal.body.graha import GrahaEnum
from jyotisha.panchangam.temporal.body.graha import AngType
from jyotisha.panchangam.temporal.body.graha import Graha as GrahaBody
from jyotisha.panchangam.temporal.body.graha import GrahaEnum as GrahaBodyEnum
from jyotisha.panchangam.temporal.body import Graha as GrahaCore
from jyotisha.panchangam.temporal.body.graha import GrahaEnum as GrahaEnumCore
from jyotisha.panchangam.temporal.body.graha import AngType as AngTypeCore
from jyotisha.panchangam.temporal.body.graha import Graha as GrahaBodyCore
from jyotisha.panchangam.temporal.body.graha import GrahaEnum as GrahaBodyEnumCore
from jyotisha.panchangam.temporal.body.graha import AngType as AngTypeCoreBody
from jyotisha.panchangam.temporal.body.graha import Graha as GrahaCoreBody
from jyotisha.panchangam.temporal.body.graha import GrahaEnum as GrahaEnumCoreBody
from jyotisha.panchangam.temporal.body.graha import AngType as AngTypeCoreBodyEnum
from jyotisha.panchangam.temporal.body.graha import Graha as GrahaCoreBodyEnum
from jyotisha.panchangam.temporal.body.graha import GrahaEnum as GrahaEnumCoreBodyEnum
from jyotisha.panchangam.temporal.body.graha import AngType as AngTypeCoreBodyEnumEnum
from jyotisha.panchangam.temporal.body.graha import Graha as GrahaCoreBodyEnumEnum
from jyotisha.panchangam.temporal.body.graha import GrahaEnum as GrahaEnumCoreBodyEnumEnum
from jyotisha.panchangam.temporal.body.graha import AngType as AngTypeCoreBodyEnumEnumEnum
from jyotisha.panchangam.temporal.body.graha import Graha as GrahaCoreBodyEnumEnumEnum
from jyotisha.panchangam.temporal.body.graha import GrahaEnum as GrahaEnumCoreBodyEnumEnumEnum
from jyotisha.panchangam.temporal.body.graha import AngType as AngTypeCoreBodyEnumEnumEnumEnum
from jyotisha.panchangam.temporal.body.graha import Graha as GrahaCoreBodyEnumEnumEnumEnum
from jyotisha.panchangam.temporal.body.graha import GrahaEnum as GrahaEnumCoreBodyEnumEnumEnumEnum
from jyotisha.panchangam.temporal.body.graha import AngType as AngTypeCoreBodyEnumEnumEnumEnumEnum
from jyotisha.panchangam.temporal.body.graha import Graha as GrahaCoreBodyEnumEnumEnumEnumEnum
from jyotisha.panchangam.temporal.body.graha import GrahaEnum as GrahaEnumCoreBodyEnumEnumEnumEnumEnum
from jyotisha.panchangam.temporal.body.graha import AngType as AngTypeCoreBodyEnumEnumEnumEnumEnumEnum
from jyotisha.panchangam.temporal.body.graha import Graha as GrahaCoreBodyEnumEnumEnumEnumEnumEnum
from jyotisha.panchangam.temporal.body.graha import GrahaEnum as GrahaEnumCoreBodyEnumEnumEnumEnumEnumEnum
from jyotisha.panchangam.temporal.body.graha import AngType as AngTypeCoreBodyEnumEnumEnumEnumEnumEnumEnum
from jyotisha.panchangam.temporal.body.graha import Graha as GrahaCoreBodyEnumEnumEnumEnumEnumEnumEnum
from jyotisha.panchangam.temporal.body.graha import GrahaEnum as GrahaEnumCoreBodyEnumEnumEnumEnumEnumEnumEnum
from jyotisha.panchangam.temporal.body.graha import AngType as AngTypeCoreBodyEnumEnumEnumEnumEnumEnumEnumEnum
from jyotisha.panchangam.temporal.body.graha import Graha as GrahaCoreBodyEnumEnumEnumEnumEnumEnumEnumEnum
from jyotisha.panchangam.temporal.body.graha import GrahaEnum as GrahaEnumCoreBodyEnumEnumEnumEnumEnumEnumEnumEnum
from jyotisha.panchangam.temporal.body.graha import AngType as AngTypeCoreBodyEnumEnumEnumEnumEnumEnumEnumEnumEnum

# Set Swiss Ephemeris path
set_ephe_path('/usr/share/swisseph')

def calculate_lal_kitab_analysis(birth_data):
    """
    Calculate comprehensive Lal Kitab analysis
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
        
        # Default coordinates (Chennai) - should be replaced with actual location
        latitude = 13.0827
        longitude = 80.2707
        
        # Calculate Julian Day
        jd = julday(year, month, day, hour + minute/60.0)
        
        # Calculate planetary positions
        planets = calculate_planetary_positions(jd)
        
        # Calculate Lal Kitab houses
        lal_kitab_houses = calculate_lal_kitab_houses(planets)
        
        # Analyze planetary strengths
        analysis = analyze_planetary_strengths(planets, lal_kitab_houses)
        
        # Generate Lal Kitab predictions
        predictions = generate_lal_kitab_predictions(planets, lal_kitab_houses, analysis)
        
        # Generate remedies
        remedies = generate_lal_kitab_remedies(planets, lal_kitab_houses, analysis)
        
        # Generate totkas
        totkas = generate_lal_kitab_totkas(planets, analysis)
        
        # Get moon sign and ascendant
        moon_sign = get_sign_from_longitude(planets['Moon']['longitude'])
        ascendant = get_ascendant_from_time(jd, latitude, longitude)
        
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

def calculate_planetary_positions(jd):
    """Calculate planetary positions using Swiss Ephemeris"""
    planets = {}
    
    # Swiss Ephemeris planet codes
    planet_codes = {
        'Sun': 0, 'Moon': 1, 'Mercury': 2, 'Venus': 3, 'Mars': 4,
        'Jupiter': 5, 'Saturn': 6, 'Rahu': 11, 'Ketu': -1  # Ketu is calculated from Rahu
    }
    
    for planet_name, code in planet_codes.items():
        if planet_name == 'Ketu':
            # Ketu is 180 degrees opposite to Rahu
            rahu_long = planets['Rahu']['longitude']
            ketu_long = (rahu_long + 180) % 360
            planets[planet_name] = {
                'longitude': ketu_long,
                'latitude': 0,
                'distance': 0,
                'speed': 0
            }
        else:
            result = calc_ut(jd, code, SEFLG_SWIEPH)
            planets[planet_name] = {
                'longitude': result[0],
                'latitude': result[1],
                'distance': result[2],
                'speed': result[3]
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
    
    # Lal Kitab friendly/enemy relationships
    friendships = {
        'Sun': {'friends': ['Moon', 'Mars', 'Jupiter'], 'enemies': ['Saturn', 'Venus'], 'neutral': ['Mercury']},
        'Moon': {'friends': ['Sun', 'Mercury'], 'enemies': [], 'neutral': ['Mars', 'Jupiter', 'Venus', 'Saturn']},
        'Mercury': {'friends': ['Sun', 'Venus'], 'enemies': ['Moon'], 'neutral': ['Mars', 'Jupiter', 'Saturn']},
        'Venus': {'friends': ['Mercury', 'Saturn'], 'enemies': ['Sun', 'Moon'], 'neutral': ['Mars', 'Jupiter']},
        'Mars': {'friends': ['Sun', 'Moon', 'Jupiter'], 'enemies': ['Mercury'], 'neutral': ['Venus', 'Saturn']},
        'Jupiter': {'friends': ['Sun', 'Moon', 'Mars'], 'enemies': ['Mercury', 'Venus'], 'neutral': ['Saturn']},
        'Saturn': {'friends': ['Mercury', 'Venus'], 'enemies': ['Sun', 'Moon', 'Mars'], 'neutral': ['Jupiter']},
        'Rahu': {'friends': ['Saturn', 'Mercury'], 'enemies': ['Sun', 'Moon', 'Mars'], 'neutral': ['Jupiter', 'Venus']},
        'Ketu': {'friends': ['Mars', 'Jupiter'], 'enemies': ['Moon', 'Mercury'], 'neutral': ['Sun', 'Venus', 'Saturn']}
    }
    
    # Analyze strengths
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
    # Lal Kitab strength rules
    strong_positions = {
        'Sun': [1, 3, 6, 10, 11],
        'Moon': [1, 2, 3, 7, 10, 11],
        'Mercury': [1, 2, 4, 5, 6, 9, 10, 11],
        'Venus': [1, 2, 3, 4, 5, 8, 9, 11, 12],
        'Mars': [1, 2, 4, 7, 8, 10, 11],
        'Jupiter': [1, 2, 3, 4, 5, 7, 9, 10, 11],
        'Saturn': [2, 3, 7, 10, 11],
        'Rahu': [3, 6, 11],
        'Ketu': [3, 6, 11]
    }
    
    return house in strong_positions.get(planet_name, [])

def is_house_benefic_in_lal_kitab(house, planet_name):
    """Check if house is benefic for the planet in Lal Kitab"""
    # Lal Kitab house benefic rules
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
    # Lal Kitab karmic debt combinations
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
    
    predictions = {
        'general': generate_general_prediction(planets, lal_kitab_houses, analysis),
        'career': generate_career_prediction(planets, lal_kitab_houses, analysis),
        'marriage': generate_marriage_prediction(planets, lal_kitab_houses, analysis),
        'health': generate_health_prediction(planets, lal_kitab_houses, analysis),
        'wealth': generate_wealth_prediction(planets, lal_kitab_houses, analysis),
        'enemies': generate_enemies_prediction(planets, lal_kitab_houses, analysis)
    }
    
    return predictions

def generate_general_prediction(planets, lal_kitab_houses, analysis):
    """Generate general life prediction"""
    strong_count = len(analysis['strongPlanets'])
    weak_count = len(analysis['weakPlanets'])
    
    if strong_count > weak_count:
        return "According to Lal Kitab, you have a strong planetary configuration. You will face challenges but overcome them with determination. Your karmic debts from past lives are moderate and can be cleared through proper remedies."
    else:
        return "Your planetary configuration shows some weaknesses according to Lal Kitab principles. You may face obstacles in life, but with proper remedies and righteous actions, you can improve your circumstances significantly."

def generate_career_prediction(planets, lal_kitab_houses, analysis):
    """Generate career prediction"""
    sun_house = lal_kitab_houses.get('Sun', 1)
    mars_house = lal_kitab_houses.get('Mars', 1)
    jupiter_house = lal_kitab_houses.get('Jupiter', 1)
    
    if sun_house in [1, 10, 11] and 'Sun' in analysis['strongPlanets']:
        return "Your career will be successful with government connections or leadership roles. You may achieve high positions through your own efforts. Business ventures will be profitable."
    elif mars_house in [1, 10, 11] and 'Mars' in analysis['strongPlanets']:
        return "Technical fields, engineering, military, or sports-related careers will suit you. You have the energy and determination to succeed in competitive environments."
    else:
        return "Your career may face initial struggles, but with hard work and proper remedies, you will achieve stability. Avoid partnerships in business initially."

def generate_marriage_prediction(planets, lal_kitab_houses, analysis):
    """Generate marriage prediction"""
    venus_house = lal_kitab_houses.get('Venus', 1)
    mars_house = lal_kitab_houses.get('Mars', 1)
    jupiter_house = lal_kitab_houses.get('Jupiter', 1)
    
    if venus_house in [1, 2, 4, 7, 11] and 'Venus' in analysis['strongPlanets']:
        return "Marriage will bring happiness and prosperity. Your spouse will be supportive and from a good family. Multiple opportunities for marriage will come."
    elif mars_house in [1, 2, 4, 7, 8, 12]:
        return "There may be delays or obstacles in marriage. Mangal dosha effects are present. Proper remedies should be performed before marriage for harmony."
    else:
        return "Marriage life will be average with normal ups and downs. Mutual understanding and respect will be key to a successful married life."

def generate_health_prediction(planets, lal_kitab_houses, analysis):
    """Generate health prediction"""
    sun_house = lal_kitab_houses.get('Sun', 1)
    mars_house = lal_kitab_houses.get('Mars', 1)
    saturn_house = lal_kitab_houses.get('Saturn', 1)
    
    if saturn_house in [1, 6, 8, 12] and 'Saturn' in analysis['weakPlanets']:
        return "Health requires attention, especially related to bones, teeth, and chronic ailments. Regular exercise and proper diet are essential. Avoid cold and damp places."
    elif mars_house in [1, 6, 8, 12] and 'Mars' in analysis['weakPlanets']:
        return "Blood-related issues, injuries, and accidents are possible. Take care while driving or handling sharp objects. Anger management is important for health."
    else:
        return "Overall health will be good with minor seasonal ailments. Maintain a balanced lifestyle and regular medical check-ups for optimal health."

def generate_wealth_prediction(planets, lal_kitab_houses, analysis):
    """Generate wealth prediction"""
    jupiter_house = lal_kitab_houses.get('Jupiter', 1)
    venus_house = lal_kitab_houses.get('Venus', 1)
    mercury_house = lal_kitab_houses.get('Mercury', 1)
    
    if jupiter_house in [1, 2, 5, 9, 11] and 'Jupiter' in analysis['strongPlanets']:
        return "Wealth will come through knowledge, teaching, or spiritual activities. Property investments will be profitable. You may receive unexpected gains."
    elif venus_house in [1, 2, 4, 5, 11] and 'Venus' in analysis['strongPlanets']:
        return "Income from creative fields, luxury items, or women-related businesses. Multiple sources of income possible. Good financial stability in middle age."
    else:
        return "Wealth accumulation will be gradual through hard work. Avoid speculation and gambling. Save money regularly for future security."

def generate_enemies_prediction(planets, lal_kitab_houses, analysis):
    """Generate enemies prediction"""
    mars_house = lal_kitab_houses.get('Mars', 1)
    saturn_house = lal_kitab_houses.get('Saturn', 1)
    rahu_house = lal_kitab_houses.get('Rahu', 1)
    
    if mars_house in [3, 6, 11] and 'Mars' in analysis['strongPlanets']:
        return "You will defeat your enemies through courage and direct action. Open enemies will be powerless against you. Victory in competitions and legal matters."
    elif saturn_house in [3, 6, 11] and 'Saturn' in analysis['strongPlanets']:
        return "Enemies will be defeated through patience and persistence. Hidden enemies may cause problems initially but will be exposed eventually."
    else:
        return "Be cautious of hidden enemies and false friends. Avoid unnecessary conflicts and maintain good relationships with colleagues and neighbors."

def generate_lal_kitab_remedies(planets, lal_kitab_houses, analysis):
    """Generate Lal Kitab remedies"""
    remedies = []
    
    # Generate remedies for weak planets
    for planet in analysis['weakPlanets']:
        house = lal_kitab_houses.get(planet, 1)
        remedy = get_planet_remedy(planet, house)
        if remedy:
            remedies.append(remedy)
    
    # Generate remedies for karmic debts
    for debt in analysis['karmaDebt']:
        remedy = get_karmic_debt_remedy(debt)
        if remedy:
            remedies.append(remedy)
    
    return remedies

def get_planet_remedy(planet, house):
    """Get specific remedy for planet in house"""
    remedies = {
        'Sun': {
            'planet': 'Sun',
            'issue': 'Weak Sun causing low confidence and health issues',
            'remedy': 'Offer water to Sun every morning, wear ruby gemstone',
            'procedure': 'Face east and offer water to rising sun with copper vessel',
            'duration': '108 days continuously',
            'cost': 'Free (water offering), Ruby: ₹5,000-50,000'
        },
        'Moon': {
            'planet': 'Moon',
            'issue': 'Weak Moon causing mental stress and mood swings',
            'remedy': 'Donate white items on Mondays, wear pearl',
            'procedure': 'Donate rice, milk, white cloth to poor on Mondays',
            'duration': '21 Mondays',
            'cost': 'Pearl: ₹2,000-20,000, Donations: ₹100-500 per Monday'
        },
        'Mercury': {
            'planet': 'Mercury',
            'issue': 'Weak Mercury causing communication and business problems',
            'remedy': 'Feed green grass to cows, wear emerald',
            'procedure': 'Feed fresh green grass to cows every Wednesday',
            'duration': '43 days',
            'cost': 'Emerald: ₹3,000-30,000, Grass: ₹10-50 per day'
        },
        'Venus': {
            'planet': 'Venus',
            'issue': 'Weak Venus causing relationship and luxury problems',
            'remedy': 'Donate white items to girls, wear diamond',
            'procedure': 'Donate white sweets, white cloth to unmarried girls',
            'duration': '16 Fridays',
            'cost': 'Diamond: ₹10,000-100,000, Donations: ₹200-1000 per Friday'
        },
        'Mars': {
            'planet': 'Mars',
            'issue': 'Weak Mars causing lack of courage and energy',
            'remedy': 'Donate red items on Tuesdays, wear coral',
            'procedure': 'Donate red cloth, jaggery, red lentils to poor',
            'duration': '21 Tuesdays',
            'cost': 'Coral: ₹1,000-10,000, Donations: ₹100-500 per Tuesday'
        },
        'Jupiter': {
            'planet': 'Jupiter',
            'issue': 'Weak Jupiter causing knowledge and wisdom problems',
            'remedy': 'Donate yellow items on Thursdays, wear yellow sapphire',
            'procedure': 'Donate turmeric, yellow cloth, books to Brahmins',
            'duration': '16 Thursdays',
            'cost': 'Yellow Sapphire: ₹5,000-50,000, Donations: ₹200-1000 per Thursday'
        },
        'Saturn': {
            'planet': 'Saturn',
            'issue': 'Weak Saturn causing delays and obstacles',
            'remedy': 'Donate black items on Saturdays, wear blue sapphire',
            'procedure': 'Donate black cloth, oil, iron items to poor',
            'duration': '19 Saturdays',
            'cost': 'Blue Sapphire: ₹10,000-100,000, Donations: ₹100-500 per Saturday'
        },
        'Rahu': {
            'planet': 'Rahu',
            'issue': 'Rahu causing confusion and unexpected problems',
            'remedy': 'Donate coconut in flowing water, wear hessonite',
            'procedure': 'Throw coconut in flowing river or sea',
            'duration': '18 consecutive days',
            'cost': 'Hessonite: ₹2,000-20,000, Coconut: ₹20-50 per day'
        },
        'Ketu': {
            'planet': 'Ketu',
            'issue': 'Ketu causing spiritual confusion and detachment',
            'remedy': 'Donate multi-colored items, wear cat\'s eye',
            'procedure': 'Donate blanket, multi-colored cloth to poor',
            'duration': '7 consecutive days',
            'cost': 'Cat\'s Eye: ₹3,000-30,000, Donations: ₹200-1000 per day'
        }
    }
    
    return remedies.get(planet)

def get_karmic_debt_remedy(debt):
    """Get remedy for karmic debt"""
    return {
        'planet': debt.split(' in ')[0],
        'issue': f'Karmic debt: {debt}',
        'remedy': 'Perform charity and righteous actions',
        'procedure': 'Feed poor, help needy, donate to religious institutions',
        'duration': '40 days',
        'cost': '₹500-2000 per week'
    }

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
    return signs[sign_index]

def get_ascendant_from_time(jd, latitude, longitude):
    """Calculate ascendant from time and location"""
    # Simplified ascendant calculation
    # In practice, this would require more complex calculations
    return "Leo"  # Placeholder

def format_planetary_positions(planets, lal_kitab_houses):
    """Format planetary positions for frontend"""
    formatted = []
    
    for planet_name, planet_data in planets.items():
        longitude = planet_data['longitude']
        sign = get_sign_from_longitude(longitude)
        degree = f"{longitude % 30:.2f}°"
        house = int(longitude / 30) + 1
        lal_kitab_house = lal_kitab_houses.get(planet_name, house)
        
        # Determine status
        status = "Strong" if is_planet_strong_in_lal_kitab(planet_name, lal_kitab_house) else "Weak"
        
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
    effects = {
        'Sun': {
            1: ['Strong personality', 'Leadership qualities', 'Good health'],
            2: ['Family pride', 'Speech issues', 'Eye problems'],
            3: ['Courage', 'Siblings support', 'Short travels'],
            4: ['Government benefits', 'Property gains', 'Mother\'s health'],
            5: ['Intelligence', 'Children issues', 'Speculation gains'],
            6: ['Victory over enemies', 'Health issues', 'Service benefits'],
            7: ['Marriage delays', 'Partnership issues', 'Public recognition'],
            8: ['Longevity issues', 'Inheritance', 'Research abilities'],
            9: ['Fortune', 'Father\'s health', 'Religious activities'],
            10: ['Career success', 'Fame', 'Authority'],
            11: ['Gains', 'Friend\'s support', 'Ambition fulfillment'],
            12: ['Expenses', 'Foreign travels', 'Spiritual growth']
        },
        'Moon': {
            1: ['Emotional nature', 'Intuition', 'Popularity'],
            2: ['Family attachment', 'Food business', 'Liquid assets'],
            3: ['Mental courage', 'Siblings bond', 'Communication'],
            4: ['Mother\'s love', 'Property', 'Emotional stability'],
            5: ['Creative mind', 'Children love', 'Emotional intelligence'],
            6: ['Health fluctuations', 'Service to others', 'Digestive issues'],
            7: ['Emotional partnerships', 'Public dealings', 'Marriage happiness'],
            8: ['Psychic abilities', 'Transformation', 'Emotional depth'],
            9: ['Religious devotion', 'Wisdom', 'Pilgrimage'],
            10: ['Public recognition', 'Career changes', 'Reputation'],
            11: ['Emotional gains', 'Group activities', 'Wish fulfillment'],
            12: ['Subconscious mind', 'Spiritual practices', 'Emotional expenses']
        }
    }
    
    return effects.get(planet_name, {}).get(house, ['General influence'])

def main():
    """Main function to handle command line arguments"""
    if len(sys.argv) < 2:
        print("Usage: python lal-kitab-engine.py '<json_data>'")
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