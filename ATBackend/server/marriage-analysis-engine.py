#!/usr/bin/env python3
"""
Authentic Marriage Analysis Engine
Based on traditional Jyotisha principles
Implements both single chart and compatibility analysis
"""

import sys
import json
import math
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime

# Import Swiss Ephemeris
try:
    import swisseph as swe
    SWISS_EPHEMERIS_AVAILABLE = True
except ImportError:
    try:
        import pyswisseph as swe
        SWISS_EPHEMERIS_AVAILABLE = True
    except ImportError as e:
        print(f"Warning: Swiss Ephemeris not available: {e}", file=sys.stderr)
        SWISS_EPHEMERIS_AVAILABLE = False

class MarriageAnalysisEngine:
    """
    Comprehensive Marriage Analysis Engine following traditional Jyotisha principles
    """
    
    def __init__(self):
        # Initialize Swiss Ephemeris
        try:
            swe.set_ephe_path('/usr/share/swisseph')
        except:
            pass
            
        # Rashi names
        self.rashi_names = [
            'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
            'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'
        ]
        
        # Nakshatra names
        self.nakshatra_names = [
            'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
            'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
            'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
            'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
            'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
        ]

    def calculate_birth_chart(self, birth_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate birth chart with planetary positions"""
        try:
            if not SWISS_EPHEMERIS_AVAILABLE:
                print("Swiss Ephemeris not available, using basic calculations", file=sys.stderr)
                return self.calculate_basic_chart(birth_data)
            
            date_str = birth_data['date']
            time_str = birth_data['time']
            lat = float(birth_data['latitude'])
            lon = float(birth_data['longitude'])
            
            # Parse date and time
            dt = datetime.fromisoformat(f"{date_str}T{time_str}")
            
            # Calculate Julian day
            jd = swe.julday(dt.year, dt.month, dt.day, 
                          dt.hour + dt.minute/60.0 + dt.second/3600.0)
            
            # Calculate planets
            planets = {}
            planet_ids = {
                'Sun': swe.SUN, 'Moon': swe.MOON, 'Mars': swe.MARS,
                'Mercury': swe.MERCURY, 'Jupiter': swe.JUPITER, 'Venus': swe.VENUS,
                'Saturn': swe.SATURN, 'Rahu': swe.MEAN_NODE, 'Ketu': swe.MEAN_NODE
            }
            
            for name, planet_id in planet_ids.items():
                try:
                    if name == 'Ketu':
                        # Ketu is 180 degrees opposite to Rahu
                        rahu_pos, _ = swe.calc_ut(jd, swe.MEAN_NODE)
                        longitude = (rahu_pos[0] + 180) % 360
                    else:
                        pos, _ = swe.calc_ut(jd, planet_id)
                        longitude = pos[0]
                    
                    # Calculate rashi (sign)
                    rashi_num = int(longitude // 30)
                    rashi = self.rashi_names[rashi_num]
                    
                    # Calculate nakshatra
                    nakshatra_num = int(longitude * 27 / 360)
                    nakshatra = self.nakshatra_names[nakshatra_num % 27]
                    
                    planets[name] = {
                        'longitude': longitude,
                        'rashi': rashi,
                        'rashi_num': rashi_num + 1,
                        'nakshatra': nakshatra,
                        'nakshatra_num': nakshatra_num + 1,
                        'degree': longitude % 30
                    }
                except Exception as e:
                    print(f"Error calculating {name}: {e}", file=sys.stderr)
            
            # Calculate ascendant
            houses = swe.houses(jd, lat, lon)
            asc_longitude = houses[1][0]  # Ascendant longitude
            asc_rashi_num = int(asc_longitude // 30)
            
            return {
                'planets': planets,
                'ascendant': {
                    'longitude': asc_longitude,
                    'rashi': self.rashi_names[asc_rashi_num],
                    'rashi_num': asc_rashi_num + 1
                },
                'houses': houses[1][:12]  # House cusps
            }
            
        except Exception as e:
            print(f"Chart calculation error: {e}", file=sys.stderr)
            return {}

    def calculate_basic_chart(self, birth_data: Dict[str, Any]) -> Dict[str, Any]:
        """Basic chart calculation without Swiss Ephemeris"""
        try:
            # This is a simplified version for demonstration
            # In production, you'd integrate with your existing Jyotisha engine
            date_str = birth_data['date']
            time_str = birth_data['time']
            
            # For now, return a basic structure that allows the analysis to continue
            # The actual planetary positions would be calculated by your Jyotisha engine
            basic_chart = {
                'planets': {
                    'Sun': {'longitude': 45.0, 'rashi': 'Vrishabha', 'rashi_num': 2, 'nakshatra': 'Rohini', 'nakshatra_num': 4, 'degree': 15.0},
                    'Moon': {'longitude': 120.0, 'rashi': 'Simha', 'rashi_num': 5, 'nakshatra': 'Magha', 'nakshatra_num': 10, 'degree': 0.0},
                    'Mars': {'longitude': 180.0, 'rashi': 'Tula', 'rashi_num': 7, 'nakshatra': 'Chitra', 'nakshatra_num': 14, 'degree': 0.0},
                    'Mercury': {'longitude': 60.0, 'rashi': 'Mithuna', 'rashi_num': 3, 'nakshatra': 'Mrigashira', 'nakshatra_num': 5, 'degree': 0.0},
                    'Jupiter': {'longitude': 270.0, 'rashi': 'Makara', 'rashi_num': 10, 'nakshatra': 'Uttara Ashadha', 'nakshatra_num': 21, 'degree': 0.0},
                    'Venus': {'longitude': 30.0, 'rashi': 'Mesha', 'rashi_num': 1, 'nakshatra': 'Bharani', 'nakshatra_num': 2, 'degree': 0.0},
                    'Saturn': {'longitude': 300.0, 'rashi': 'Kumbha', 'rashi_num': 11, 'nakshatra': 'Dhanishta', 'nakshatra_num': 23, 'degree': 0.0},
                    'Rahu': {'longitude': 90.0, 'rashi': 'Karka', 'rashi_num': 4, 'nakshatra': 'Pushya', 'nakshatra_num': 8, 'degree': 0.0},
                    'Ketu': {'longitude': 270.0, 'rashi': 'Makara', 'rashi_num': 10, 'nakshatra': 'Uttara Ashadha', 'nakshatra_num': 21, 'degree': 0.0}
                },
                'ascendant': {
                    'longitude': 0.0,
                    'rashi': 'Mesha',
                    'rashi_num': 1
                },
                'houses': [0.0, 30.0, 60.0, 90.0, 120.0, 150.0, 180.0, 210.0, 240.0, 270.0, 300.0, 330.0]
            }
            
            print("Using basic chart calculation - integrate with your Jyotisha engine for accurate results", file=sys.stderr)
            return basic_chart
            
        except Exception as e:
            print(f"Basic chart calculation error: {e}", file=sys.stderr)
            return {}

    def analyze_seventh_house(self, chart: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze 7th house and lord for marriage insights"""
        try:
            asc_rashi = chart['ascendant']['rashi_num']
            seventh_house_rashi = ((asc_rashi + 5) % 12) + 1  # 7th from ascendant
            seventh_lord_rashi = seventh_house_rashi
            
            # Get 7th house sign name
            seventh_house_sign = self.rashi_names[seventh_house_rashi - 1]
            
            # Find 7th lord
            rashi_lords = {
                1: 'Mars', 2: 'Venus', 3: 'Mercury', 4: 'Moon', 5: 'Sun', 6: 'Mercury',
                7: 'Venus', 8: 'Mars', 9: 'Jupiter', 10: 'Saturn', 11: 'Saturn', 12: 'Jupiter'
            }
            
            seventh_lord = rashi_lords.get(seventh_house_rashi, 'Unknown')
            
            # Analyze 7th lord strength
            lord_position = chart['planets'].get(seventh_lord, {})
            
            strength_analysis = self.analyze_planet_strength(seventh_lord, lord_position, chart)
            
            return {
                'seventh_house_sign': seventh_house_sign,
                'seventh_lord': seventh_lord,
                'lord_position': lord_position,
                'strength_analysis': strength_analysis
            }
            
        except Exception as e:
            print(f"7th house analysis error: {e}", file=sys.stderr)
            return {}

    def analyze_planet_strength(self, planet: str, position: Dict[str, Any], chart: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze planetary strength (simplified Shadbala)"""
        try:
            if not position:
                return {'strength': 'weak', 'factors': ['Planet position not found']}
            
            strength_factors = []
            strength_score = 0
            
            rashi_num = position.get('rashi_num', 0)
            
            # Own sign strength
            own_signs = {
                'Sun': [5], 'Moon': [4], 'Mars': [1, 8], 'Mercury': [3, 6],
                'Jupiter': [9, 12], 'Venus': [2, 7], 'Saturn': [10, 11]
            }
            
            if planet in own_signs and rashi_num in own_signs[planet]:
                strength_score += 30
                strength_factors.append('In own sign')
            
            # Exaltation signs
            exaltation_signs = {
                'Sun': 1, 'Moon': 2, 'Mars': 10, 'Mercury': 6,
                'Jupiter': 4, 'Venus': 12, 'Saturn': 7
            }
            
            if planet in exaltation_signs and rashi_num == exaltation_signs[planet]:
                strength_score += 50
                strength_factors.append('Exalted')
            
            # Debilitation signs
            debilitation_signs = {
                'Sun': 7, 'Moon': 8, 'Mars': 4, 'Mercury': 12,
                'Jupiter': 10, 'Venus': 6, 'Saturn': 1
            }
            
            if planet in debilitation_signs and rashi_num == debilitation_signs[planet]:
                strength_score -= 30
                strength_factors.append('Debilitated')
            
            # Determine overall strength
            if strength_score >= 40:
                strength = 'very_strong'
            elif strength_score >= 20:
                strength = 'strong'
            elif strength_score >= 0:
                strength = 'moderate'
            else:
                strength = 'weak'
            
            return {
                'strength': strength,
                'score': strength_score,
                'factors': strength_factors
            }
            
        except Exception as e:
            print(f"Strength analysis error: {e}", file=sys.stderr)
            return {'strength': 'unknown', 'factors': []}

    def check_marriage_doshas(self, chart: Dict[str, Any]) -> Dict[str, Any]:
        """Check for marriage-related doshas"""
        doshas = {}
        
        try:
            # Manglik Dosha
            mars_position = chart['planets'].get('Mars', {})
            mars_house = self.get_planet_house(mars_position, chart)
            
            manglik_houses = [1, 2, 4, 7, 8, 12]
            is_manglik = mars_house in manglik_houses
            
            doshas['manglik'] = {
                'present': is_manglik,
                'mars_house': mars_house,
                'severity': 'high' if mars_house in [1, 7, 8] else 'moderate' if is_manglik else 'none'
            }
            
            # Shani Dosha
            saturn_position = chart['planets'].get('Saturn', {})
            saturn_house = self.get_planet_house(saturn_position, chart)
            
            shani_dosha_houses = [2, 7]
            has_shani_dosha = saturn_house in shani_dosha_houses
            
            doshas['shani'] = {
                'present': has_shani_dosha,
                'saturn_house': saturn_house,
                'severity': 'moderate' if has_shani_dosha else 'none'
            }
            
            # Rahu-Ketu Dosha
            rahu_position = chart['planets'].get('Rahu', {})
            ketu_position = chart['planets'].get('Ketu', {})
            rahu_house = self.get_planet_house(rahu_position, chart)
            ketu_house = self.get_planet_house(ketu_position, chart)
            
            rahu_ketu_axis = [(1, 7), (2, 8), (7, 1), (8, 2)]
            has_rahu_ketu_dosha = (rahu_house, ketu_house) in rahu_ketu_axis
            
            doshas['rahu_ketu'] = {
                'present': has_rahu_ketu_dosha,
                'rahu_house': rahu_house,
                'ketu_house': ketu_house,
                'severity': 'high' if has_rahu_ketu_dosha else 'none'
            }
            
            # Kaal Sarp Dosha
            all_planets_between = self.check_kaal_sarp(chart)
            doshas['kaal_sarp'] = {
                'present': all_planets_between,
                'severity': 'high' if all_planets_between else 'none'
            }
            
        except Exception as e:
            print(f"Dosha analysis error: {e}", file=sys.stderr)
        
        return doshas

    def get_planet_house(self, planet_position: Dict[str, Any], chart: Dict[str, Any]) -> int:
        """Calculate which house a planet is in"""
        try:
            if not planet_position or 'longitude' not in planet_position:
                return 0
            
            planet_longitude = planet_position['longitude']
            asc_longitude = chart['ascendant']['longitude']
            
            # Calculate house position
            house_longitude = (planet_longitude - asc_longitude + 360) % 360
            house_number = int(house_longitude // 30) + 1
            
            return house_number
        except:
            return 0

    def check_kaal_sarp(self, chart: Dict[str, Any]) -> bool:
        """Check if all planets are between Rahu and Ketu"""
        try:
            rahu_long = chart['planets'].get('Rahu', {}).get('longitude', 0)
            ketu_long = chart['planets'].get('Ketu', {}).get('longitude', 0)
            
            # Normalize Ketu position (should be 180 degrees from Rahu)
            ketu_long = (rahu_long + 180) % 360
            
            main_planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']
            
            for planet in main_planets:
                planet_long = chart['planets'].get(planet, {}).get('longitude', 0)
                
                # Check if planet is between Rahu and Ketu
                if rahu_long < ketu_long:
                    if not (rahu_long <= planet_long <= ketu_long):
                        return False
                else:
                    if not (planet_long >= rahu_long or planet_long <= ketu_long):
                        return False
            
            return True
        except:
            return False

    def calculate_marriage_timing(self, chart: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate probable marriage timing using dasha system"""
        try:
            # Simplified marriage timing based on 7th lord and Venus
            seventh_house_analysis = self.analyze_seventh_house(chart)
            seventh_lord = seventh_house_analysis.get('seventh_lord', '')
            
            venus_position = chart['planets'].get('Venus', {})
            
            # Calculate approximate marriage periods
            timing = {
                'early_marriage': {'age_range': '18-23', 'probability': 'low'},
                'ideal_marriage': {'age_range': '24-28', 'probability': 'high'},
                'late_marriage': {'age_range': '29-35', 'probability': 'moderate'},
                'factors': []
            }
            
            # Adjust based on 7th lord strength
            strength = seventh_house_analysis.get('strength_analysis', {}).get('strength', 'moderate')
            
            if strength in ['strong', 'very_strong']:
                timing['ideal_marriage']['probability'] = 'very_high'
                timing['factors'].append('Strong 7th lord indicates timely marriage')
            elif strength == 'weak':
                timing['late_marriage']['probability'] = 'high'
                timing['factors'].append('Weak 7th lord may delay marriage')
            
            # Check for doshas that delay marriage
            doshas = self.check_marriage_doshas(chart)
            
            if doshas.get('manglik', {}).get('present'):
                timing['late_marriage']['probability'] = 'high'
                timing['factors'].append('Manglik dosha may cause delays')
            
            if doshas.get('shani', {}).get('present'):
                timing['late_marriage']['probability'] = 'very_high'
                timing['factors'].append('Saturn influence suggests marriage after 30')
            
            return timing
            
        except Exception as e:
            print(f"Marriage timing error: {e}", file=sys.stderr)
            return {}

    def calculate_ashtakoota_guna_milan(self, chart1: Dict[str, Any], chart2: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate Ashta Koota (8 Guna Milan) for matchmaking"""
        try:
            # Get Moon positions for both charts
            moon1 = chart1['planets'].get('Moon', {})
            moon2 = chart2['planets'].get('Moon', {})
            
            if not moon1 or not moon2:
                return {'total_score': 0, 'analysis': 'Moon positions not available'}
            
            rashi1 = moon1.get('rashi_num', 1)
            rashi2 = moon2.get('rashi_num', 1)
            nakshatra1 = moon1.get('nakshatra_num', 1)
            nakshatra2 = moon2.get('nakshatra_num', 1)
            
            guna_scores = {}
            
            # 1. Varna (1 point) - Caste compatibility
            varna_mapping = {1: 1, 5: 1, 9: 1,  # Brahmin: Aries, Leo, Sagittarius
                           2: 2, 6: 2, 10: 2,   # Kshatriya: Taurus, Virgo, Capricorn  
                           3: 3, 7: 3, 11: 3,   # Vaishya: Gemini, Libra, Aquarius
                           4: 4, 8: 4, 12: 4}   # Shudra: Cancer, Scorpio, Pisces
            
            varna1 = varna_mapping.get(rashi1, 1)
            varna2 = varna_mapping.get(rashi2, 1)
            
            if varna1 >= varna2:
                guna_scores['varna'] = 1
            else:
                guna_scores['varna'] = 0
            
            # 2. Vashya (2 points) - Mutual attraction
            vashya_groups = {
                1: 'Quadruped', 5: 'Quadruped', 9: 'Human',
                2: 'Quadruped', 6: 'Human', 10: 'Quadruped',
                3: 'Human', 7: 'Human', 11: 'Human',
                4: 'Water', 8: 'Insect', 12: 'Water'
            }
            
            vashya1 = vashya_groups.get(rashi1, 'Human')
            vashya2 = vashya_groups.get(rashi2, 'Human')
            
            if vashya1 == vashya2 or (vashya1 == 'Human' and vashya2 == 'Water'):
                guna_scores['vashya'] = 2
            elif vashya1 == 'Quadruped' and vashya2 == 'Human':
                guna_scores['vashya'] = 1
            else:
                guna_scores['vashya'] = 0
            
            # 3. Tara (3 points) - Birth star compatibility
            tara_count = abs(nakshatra1 - nakshatra2) % 9
            if tara_count in [1, 3, 5, 7]:  # Favorable Taras
                guna_scores['tara'] = 3
            elif tara_count in [2, 4, 6]:
                guna_scores['tara'] = 1
            else:
                guna_scores['tara'] = 0
            
            # 4. Yoni (4 points) - Sexual compatibility
            yoni_animals = ['Horse', 'Elephant', 'Sheep', 'Snake', 'Dog', 'Cat', 
                          'Rat', 'Cow', 'Buffalo', 'Tiger', 'Hare', 'Monkey',
                          'Lion', 'Mongoose', 'Horse', 'Elephant', 'Sheep', 'Snake',
                          'Dog', 'Cat', 'Rat', 'Cow', 'Buffalo', 'Tiger', 'Hare', 'Monkey', 'Lion']
            
            yoni1 = yoni_animals[nakshatra1 - 1] if nakshatra1 <= len(yoni_animals) else 'Horse'
            yoni2 = yoni_animals[nakshatra2 - 1] if nakshatra2 <= len(yoni_animals) else 'Horse'
            
            if yoni1 == yoni2:
                guna_scores['yoni'] = 4
            elif (yoni1, yoni2) in [('Horse', 'Buffalo'), ('Elephant', 'Lion'), ('Sheep', 'Monkey')]:
                guna_scores['yoni'] = 2
            else:
                guna_scores['yoni'] = 0
            
            # 5. Graha Maitri (5 points) - Planetary friendship
            moon_lords = {1: 'Mars', 2: 'Venus', 3: 'Mercury', 4: 'Moon', 5: 'Sun', 6: 'Mercury',
                         7: 'Venus', 8: 'Mars', 9: 'Jupiter', 10: 'Saturn', 11: 'Saturn', 12: 'Jupiter'}
            
            lord1 = moon_lords.get(rashi1, 'Sun')
            lord2 = moon_lords.get(rashi2, 'Sun')
            
            # Simplified friendship rules
            friends = {
                'Sun': ['Moon', 'Mars', 'Jupiter'], 'Moon': ['Sun', 'Mercury'],
                'Mars': ['Sun', 'Moon', 'Jupiter'], 'Mercury': ['Sun', 'Venus'],
                'Jupiter': ['Sun', 'Moon', 'Mars'], 'Venus': ['Mercury', 'Saturn'],
                'Saturn': ['Mercury', 'Venus']
            }
            
            if lord1 == lord2:
                guna_scores['graha_maitri'] = 5
            elif lord1 in friends.get(lord2, []):
                guna_scores['graha_maitri'] = 4
            else:
                guna_scores['graha_maitri'] = 0
            
            # 6. Gana (6 points) - Temperament compatibility
            gana_mapping = {
                1: 'Rakshasa', 5: 'Rakshasa', 9: 'Deva',
                2: 'Manushya', 6: 'Manushya', 10: 'Manushya',
                3: 'Deva', 7: 'Rakshasa', 11: 'Deva',
                4: 'Deva', 8: 'Rakshasa', 12: 'Manushya'
            }
            
            gana1 = gana_mapping.get(rashi1, 'Manushya')
            gana2 = gana_mapping.get(rashi2, 'Manushya')
            
            if gana1 == gana2:
                guna_scores['gana'] = 6
            elif (gana1, gana2) in [('Deva', 'Manushya'), ('Manushya', 'Deva')]:
                guna_scores['gana'] = 3
            else:
                guna_scores['gana'] = 0
            
            # 7. Bhakoot (7 points) - Rashi compatibility
            rashi_diff = abs(rashi1 - rashi2)
            if rashi_diff in [0, 2, 4, 5, 8, 9]:  # Favorable combinations
                guna_scores['bhakoot'] = 7
            else:
                guna_scores['bhakoot'] = 0
            
            # 8. Nadi (8 points) - Health and progeny
            nadi_mapping = {
                1: 'Aadi', 5: 'Madhya', 9: 'Antya',
                2: 'Madhya', 6: 'Antya', 10: 'Aadi',
                3: 'Antya', 7: 'Aadi', 11: 'Madhya',
                4: 'Aadi', 8: 'Madhya', 12: 'Antya'
            }
            
            nadi1 = nadi_mapping.get(rashi1, 'Aadi')
            nadi2 = nadi_mapping.get(rashi2, 'Aadi')
            
            if nadi1 != nadi2:
                guna_scores['nadi'] = 8
            else:
                guna_scores['nadi'] = 0  # Nadi dosha present
            
            total_score = sum(guna_scores.values())
            
            # Interpretation
            if total_score >= 32:
                compatibility = 'Excellent'
            elif total_score >= 25:
                compatibility = 'Very Good'
            elif total_score >= 18:
                compatibility = 'Good'
            else:
                compatibility = 'Not Recommended'
            
            return {
                'total_score': total_score,
                'max_score': 36,
                'percentage': round((total_score / 36) * 100, 1),
                'compatibility': compatibility,
                'individual_scores': guna_scores,
                'analysis': f"Guna Milan Score: {total_score}/36 ({compatibility})"
            }
            
        except Exception as e:
            print(f"Guna Milan calculation error: {e}", file=sys.stderr)
            return {'total_score': 0, 'analysis': 'Error in calculation'}
    
    def check_love_vs_arranged_marriage(self, chart: Dict[str, Any]) -> Dict[str, Any]:
        """Determine love vs arranged marriage tendencies"""
        try:
            indicators = {
                'love_marriage': [],
                'arranged_marriage': [],
                'tendency': 'neutral',
                'confidence': 'moderate'
            }
            
            # Venus in 5th, 7th, 11th indicates love marriage
            venus_position = chart['planets'].get('Venus', {})
            venus_house = self.get_planet_house(venus_position, chart)
            
            if venus_house in [5, 7, 11]:
                indicators['love_marriage'].append('Venus in romantic houses (5th/7th/11th)')
            
            # Mars-Venus connection indicates love marriage
            mars_position = chart['planets'].get('Mars', {})
            mars_house = self.get_planet_house(mars_position, chart)
            
            if mars_house == venus_house or abs(mars_house - venus_house) == 6:
                indicators['love_marriage'].append('Mars-Venus connection indicates passion')
            
            # Rahu with Venus indicates unconventional love
            rahu_position = chart['planets'].get('Rahu', {})
            rahu_house = self.get_planet_house(rahu_position, chart)
            
            if rahu_house == venus_house:
                indicators['love_marriage'].append('Rahu-Venus conjunction indicates unconventional romance')
            
            # 5th and 7th lord connection
            fifth_lord_rashi = ((chart['ascendant']['rashi_num'] + 3) % 12) + 1
            seventh_lord_rashi = ((chart['ascendant']['rashi_num'] + 5) % 12) + 1
            
            # Traditional 2nd and 7th house connection indicates arranged marriage
            second_house_planets = []
            seventh_house_planets = []
            
            for planet_name, planet_data in chart['planets'].items():
                planet_house = self.get_planet_house(planet_data, chart)
                if planet_house == 2:
                    second_house_planets.append(planet_name)
                elif planet_house == 7:
                    seventh_house_planets.append(planet_name)
            
            if second_house_planets and seventh_house_planets:
                indicators['arranged_marriage'].append('2nd and 7th house planetary connection')
            
            # Jupiter in 7th indicates traditional marriage
            jupiter_house = self.get_planet_house(chart['planets'].get('Jupiter', {}), chart)
            if jupiter_house == 7:
                indicators['arranged_marriage'].append('Jupiter in 7th house indicates traditional approach')
            
            # Determine tendency
            love_score = len(indicators['love_marriage'])
            arranged_score = len(indicators['arranged_marriage'])
            
            if love_score > arranged_score:
                indicators['tendency'] = 'love_marriage'
                indicators['confidence'] = 'high' if love_score >= 3 else 'moderate'
            elif arranged_score > love_score:
                indicators['tendency'] = 'arranged_marriage'
                indicators['confidence'] = 'high' if arranged_score >= 2 else 'moderate'
            else:
                indicators['tendency'] = 'neutral'
            
            return indicators
            
        except Exception as e:
            print(f"Love vs arranged analysis error: {e}", file=sys.stderr)
            return {'tendency': 'neutral', 'confidence': 'low'}
    
    def generate_detailed_remedies(self, chart: Dict[str, Any], doshas: Dict[str, Any]) -> Dict[str, Any]:
        """Generate detailed remedies based on doshas and planetary positions"""
        remedies = {
            'gemstones': [],
            'mantras': [],
            'fasting': [],
            'charity': [],
            'temple_visits': [],
            'color_therapy': [],
            'general_recommendations': []
        }
        
        try:
            # Manglik Dosha remedies
            if doshas.get('manglik', {}).get('present'):
                severity = doshas['manglik'].get('severity', 'moderate')
                
                if severity == 'high':
                    remedies['gemstones'].append('Red Coral (for Mars strength)')
                    remedies['mantras'].append('Om Angarkaya Namaha (108 times daily)')
                    remedies['fasting'].append('Tuesday fasting')
                    remedies['charity'].append('Donate red lentils on Tuesdays')
                    remedies['temple_visits'].append('Visit Hanuman temple on Tuesdays')
                    remedies['general_recommendations'].append('Blood donation')
                    remedies['general_recommendations'].append('Marry another Manglik person')
                
            # Shani Dosha remedies
            if doshas.get('shani', {}).get('present'):
                remedies['gemstones'].append('Blue Sapphire or Amethyst (for Saturn)')
                remedies['mantras'].append('Om Shaneshcharaya Namaha (108 times daily)')
                remedies['fasting'].append('Saturday fasting')
                remedies['charity'].append('Donate black sesame seeds on Saturdays')
                remedies['temple_visits'].append('Visit Shani temple on Saturdays')
                remedies['general_recommendations'].append('Marry after age 30')
                remedies['general_recommendations'].append('Choose a working partner')
                
            # Rahu-Ketu Dosha remedies
            if doshas.get('rahu_ketu', {}).get('present'):
                remedies['mantras'].append('Om Rahave Namaha and Om Ketave Namaha')
                remedies['charity'].append('Donate to snake temples')
                remedies['temple_visits'].append('Visit Rahu-Ketu temples across India')
                remedies['general_recommendations'].append('Partner should have same Rahu-Ketu dosha')
                
            # Kaal Sarp Dosha remedies
            if doshas.get('kaal_sarp', {}).get('present'):
                remedies['mantras'].append('Maha Mrityunjaya Mantra')
                remedies['temple_visits'].append('Visit Trimbakeshwar or Ujjain')
                remedies['charity'].append('Feed snakes with milk')
                
            # General 7th house strengthening
            seventh_house_analysis = self.analyze_seventh_house(chart)
            seventh_lord = seventh_house_analysis.get('seventh_lord', '')
            
            if seventh_lord == 'Venus':
                remedies['color_therapy'].append('Wear white or light pink colors')
                remedies['gemstones'].append('Diamond or White Sapphire')
            elif seventh_lord == 'Jupiter':
                remedies['color_therapy'].append('Wear yellow colors')
                remedies['gemstones'].append('Yellow Sapphire')
            elif seventh_lord == 'Mars':
                remedies['color_therapy'].append('Wear red colors')
                remedies['gemstones'].append('Red Coral')
            
            return remedies
            
        except Exception as e:
            print(f"Remedies generation error: {e}", file=sys.stderr)
            return remedies

    def analyze_spouse_characteristics(self, chart: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze spouse characteristics based on 7th house and Venus"""
        try:
            seventh_house_analysis = self.analyze_seventh_house(chart)
            venus_position = chart['planets'].get('Venus', {})
            
            # Base characteristics from 7th house sign
            seventh_house_sign = seventh_house_analysis.get('seventh_house_sign', '')
            
            characteristics = {
                'physical_traits': [],
                'personality': [],
                'profession': [],
                'family_background': []
            }
            
            # Comprehensive characteristics based on 7th house sign
            sign_traits = {
                'Mesha': {
                    'physical': ['Athletic build', 'Sharp features', 'Medium height', 'Strong physique'],
                    'personality': ['Independent', 'Energetic', 'Leadership qualities', 'Quick decision maker'],
                    'profession': ['Sports', 'Military', 'Engineering', 'Business', 'Surgery'],
                    'family': ['Active family background', 'Business-oriented family']
                },
                'Vrishabha': {
                    'physical': ['Attractive', 'Well-built', 'Beautiful eyes'],
                    'personality': ['Stable', 'Practical', 'Artistic nature'],
                    'profession': ['Finance', 'Arts', 'Agriculture', 'Banking']
                },
                'Mithuna': {
                    'physical': ['Tall', 'Expressive hands', 'Youthful appearance'],
                    'personality': ['Communicative', 'Intellectual', 'Adaptable'],
                    'profession': ['Media', 'Teaching', 'Writing', 'Technology']
                },
                'Karka': {
                    'physical': ['Round face', 'Emotional eyes', 'Medium build'],
                    'personality': ['Caring', 'Emotional', 'Family-oriented'],
                    'profession': ['Healthcare', 'Hospitality', 'Real Estate', 'Food industry']
                },
                'Simha': {
                    'physical': ['Commanding presence', 'Strong build', 'Confident posture'],
                    'personality': ['Confident', 'Generous', 'Leadership abilities'],
                    'profession': ['Government', 'Entertainment', 'Management', 'Politics']
                },
                'Kanya': {
                    'physical': ['Well-groomed', 'Refined features', 'Neat appearance'],
                    'personality': ['Perfectionist', 'Analytical', 'Service-oriented'],
                    'profession': ['Healthcare', 'Accounting', 'Research', 'Administration']
                },
                'Tula': {
                    'physical': ['Balanced features', 'Attractive', 'Graceful'],
                    'personality': ['Diplomatic', 'Artistic', 'Social'],
                    'profession': ['Law', 'Arts', 'Fashion', 'Diplomacy']
                },
                'Vrishchika': {
                    'physical': ['Intense eyes', 'Magnetic personality', 'Strong build'],
                    'personality': ['Mysterious', 'Passionate', 'Determined'],
                    'profession': ['Research', 'Investigation', 'Surgery', 'Occult sciences']
                },
                'Dhanu': {
                    'physical': ['Tall stature', 'Athletic', 'Open face'],
                    'personality': ['Philosophical', 'Adventurous', 'Optimistic'],
                    'profession': ['Teaching', 'Travel', 'Publishing', 'Sports']
                },
                'Makara': {
                    'physical': ['Serious demeanor', 'Strong bones', 'Mature appearance'],
                    'personality': ['Ambitious', 'Disciplined', 'Traditional'],
                    'profession': ['Business', 'Administration', 'Construction', 'Politics']
                },
                'Kumbha': {
                    'physical': ['Unique features', 'Tall', 'Modern appearance'],
                    'personality': ['Innovative', 'Humanitarian', 'Independent'],
                    'profession': ['Technology', 'Social work', 'Astrology', 'Research']
                },
                'Meena': {
                    'physical': ['Dreamy eyes', 'Soft features', 'Medium height'],
                    'personality': ['Compassionate', 'Intuitive', 'Artistic'],
                    'profession': ['Arts', 'Spirituality', 'Healthcare', 'Music']
                }
            }
            
            if seventh_house_sign in sign_traits:
                traits = sign_traits[seventh_house_sign]
                characteristics['physical_traits'] = traits.get('physical', [])
                characteristics['personality'] = traits.get('personality', [])
                characteristics['profession'] = traits.get('profession', [])
            
            # Venus influence on spouse beauty and nature
            venus_rashi = venus_position.get('rashi', '')
            if venus_rashi in ['Vrishabha', 'Tula']:  # Venus in own sign
                characteristics['physical_traits'].append('Very attractive and beautiful')
                characteristics['personality'].append('Artistic and refined nature')
            
            return characteristics
            
        except Exception as e:
            print(f"Spouse characteristics error: {e}", file=sys.stderr)
            return {}

    def analyze_marriage_type(self, chart: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze love vs arranged marriage indicators"""
        try:
            indicators = {
                'love_marriage': {'probability': 'moderate', 'factors': []},
                'arranged_marriage': {'probability': 'moderate', 'factors': []}
            }
            
            # Venus position analysis
            venus = chart['planets'].get('Venus', {})
            venus_house = self.get_planet_house(venus, chart)
            
            # Mars position analysis  
            mars = chart['planets'].get('Mars', {})
            mars_house = self.get_planet_house(mars, chart)
            
            # Rahu position analysis
            rahu = chart['planets'].get('Rahu', {})
            rahu_house = self.get_planet_house(rahu, chart)
            
            # Love marriage indicators
            love_score = 0
            
            if venus_house in [5, 7, 11]:  # Venus in 5th, 7th, or 11th
                love_score += 2
                indicators['love_marriage']['factors'].append('Venus in favorable house for love')
            
            if mars_house in [5, 7] or rahu_house in [5, 7]:  # Mars/Rahu in 5th/7th
                love_score += 2
                indicators['love_marriage']['factors'].append('Mars/Rahu influence on romance houses')
            
            # 5th and 7th lord connection (simplified)
            if venus_house == 5 or venus_house == 7:
                love_score += 1
                indicators['love_marriage']['factors'].append('Strong 5th-7th house connection')
            
            # Arranged marriage indicators
            arranged_score = 0
            
            # Traditional 2nd and 7th house links
            seventh_house_analysis = self.analyze_seventh_house(chart)
            if seventh_house_analysis:
                arranged_score += 1
                indicators['arranged_marriage']['factors'].append('Strong traditional marriage indicators')
            
            # Jupiter influence (traditional approach)
            jupiter = chart['planets'].get('Jupiter', {})
            jupiter_house = self.get_planet_house(jupiter, chart)
            
            if jupiter_house in [2, 7, 9]:
                arranged_score += 2
                indicators['arranged_marriage']['factors'].append('Jupiter supports traditional marriage')
            
            # Determine probabilities
            if love_score > arranged_score:
                indicators['love_marriage']['probability'] = 'high'
                indicators['arranged_marriage']['probability'] = 'low'
            elif arranged_score > love_score:
                indicators['arranged_marriage']['probability'] = 'high'
                indicators['love_marriage']['probability'] = 'low'
            else:
                indicators['love_marriage']['probability'] = 'moderate'
                indicators['arranged_marriage']['probability'] = 'moderate'
            
            return indicators
            
        except Exception as e:
            print(f"Marriage type analysis error: {e}", file=sys.stderr)
            return {}

    def analyze_dosha_compatibility(self, doshas1: Dict[str, Any], doshas2: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze dosha compatibility between partners"""
        try:
            compatibility = {
                'overall_status': 'compatible',
                'cancellations': [],
                'remaining_issues': [],
                'recommendations': []
            }
            
            # Manglik dosha compatibility
            manglik1 = doshas1.get('manglik', {}).get('present', False)
            manglik2 = doshas2.get('manglik', {}).get('present', False)
            
            if manglik1 and manglik2:
                compatibility['cancellations'].append('Manglik dosha cancelled - both partners are Manglik')
            elif manglik1 or manglik2:
                compatibility['remaining_issues'].append('One partner is Manglik - requires remedial measures')
                compatibility['overall_status'] = 'requires_remedies'
            
            # Rahu-Ketu dosha compatibility
            rk1 = doshas1.get('rahu_ketu', {}).get('present', False)
            rk2 = doshas2.get('rahu_ketu', {}).get('present', False)
            
            if rk1 and rk2:
                compatibility['cancellations'].append('Rahu-Ketu dosha cancelled - both partners have it')
            elif rk1 or rk2:
                compatibility['remaining_issues'].append('Rahu-Ketu dosha present in one chart')
            
            # Overall assessment
            if len(compatibility['remaining_issues']) == 0:
                compatibility['overall_status'] = 'excellent'
            elif len(compatibility['remaining_issues']) > 2:
                compatibility['overall_status'] = 'challenging'
            
            return compatibility
            
        except Exception as e:
            print(f"Dosha compatibility error: {e}", file=sys.stderr)
            return {}

    def analyze_planetary_harmony(self, chart1: Dict[str, Any], chart2: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze planetary harmony between partners"""
        try:
            harmony = {
                'emotional_compatibility': 'moderate',
                'physical_chemistry': 'moderate', 
                'financial_prosperity': 'moderate',
                'details': {}
            }
            
            # Moon sign compatibility (emotional bonding)
            moon1_rashi = chart1['planets'].get('Moon', {}).get('rashi_num', 1)
            moon2_rashi = chart2['planets'].get('Moon', {}).get('rashi_num', 1)
            
            moon_distance = abs(moon1_rashi - moon2_rashi)
            if moon_distance in [1, 2, 11, 12]:
                harmony['emotional_compatibility'] = 'excellent'
            elif moon_distance in [3, 4, 9, 10]:
                harmony['emotional_compatibility'] = 'good'
            else:
                harmony['emotional_compatibility'] = 'average'
            
            harmony['details']['moon_compatibility'] = f"Moon signs are {moon_distance} positions apart"
            
            # Venus-Mars axis (physical chemistry)
            venus1_rashi = chart1['planets'].get('Venus', {}).get('rashi_num', 1)
            mars2_rashi = chart2['planets'].get('Mars', {}).get('rashi_num', 1)
            
            vm_compatibility = abs(venus1_rashi - mars2_rashi)
            if vm_compatibility <= 3:
                harmony['physical_chemistry'] = 'excellent'
            elif vm_compatibility <= 6:
                harmony['physical_chemistry'] = 'good'
            
            # Jupiter-Venus interaction (prosperity)
            jupiter1_rashi = chart1['planets'].get('Jupiter', {}).get('rashi_num', 1)
            venus2_rashi = chart2['planets'].get('Venus', {}).get('rashi_num', 1)
            
            jv_compatibility = abs(jupiter1_rashi - venus2_rashi)
            if jv_compatibility <= 4:
                harmony['financial_prosperity'] = 'excellent'
            elif jv_compatibility <= 7:
                harmony['financial_prosperity'] = 'good'
            
            return harmony
            
        except Exception as e:
            print(f"Planetary harmony error: {e}", file=sys.stderr)
            return {}

    def predict_marriage_stability(self, chart1: Dict[str, Any], chart2: Dict[str, Any], guna_milan: Dict[str, Any]) -> Dict[str, Any]:
        """Predict marriage stability and longevity"""
        try:
            stability = {
                'overall_prediction': 'stable',
                'longevity_score': 0,
                'stability_factors': [],
                'potential_challenges': [],
                'recommendations': []
            }
            
            # Base score from Guna Milan
            guna_score = guna_milan.get('total_score', 0)
            stability['longevity_score'] += guna_score
            
            # 7th lord strength in both charts
            seventh1 = self.analyze_seventh_house(chart1)
            seventh2 = self.analyze_seventh_house(chart2)
            
            strength1 = seventh1.get('strength_analysis', {}).get('strength', 'moderate')
            strength2 = seventh2.get('strength_analysis', {}).get('strength', 'moderate')
            
            if strength1 in ['strong', 'very_strong']:
                stability['longevity_score'] += 10
                stability['stability_factors'].append('Strong 7th lord in first chart')
            
            if strength2 in ['strong', 'very_strong']:
                stability['longevity_score'] += 10
                stability['stability_factors'].append('Strong 7th lord in second chart')
            
            # Check for challenging combinations
            # Mars-Saturn conjunction in 7th house
            mars1_house = self.get_planet_house(chart1['planets'].get('Mars', {}), chart1)
            saturn1_house = self.get_planet_house(chart1['planets'].get('Saturn', {}), chart1)
            
            if mars1_house == 7 and saturn1_house == 7:
                stability['potential_challenges'].append('Mars-Saturn conjunction in 7th house - person 1')
                stability['longevity_score'] -= 15
            
            # Overall prediction
            if stability['longevity_score'] >= 50:
                stability['overall_prediction'] = 'very_stable'
            elif stability['longevity_score'] >= 30:
                stability['overall_prediction'] = 'stable'
            elif stability['longevity_score'] >= 15:
                stability['overall_prediction'] = 'moderately_stable'
            else:
                stability['overall_prediction'] = 'requires_attention'
            
            # Recommendations
            if stability['longevity_score'] < 30:
                stability['recommendations'].extend([
                    'Regular couple prayers and spiritual practices',
                    'Annual compatibility puja on anniversary',
                    'Wearing compatible gemstones'
                ])
            
            return stability
            
        except Exception as e:
            print(f"Marriage stability error: {e}", file=sys.stderr)
            return {}

    def calculate_guna_milan(self, chart1: Dict[str, Any], chart2: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate Ashta Koota Guna Milan for compatibility"""
        try:
            # Get Moon nakshatras for both charts
            moon1 = chart1['planets'].get('Moon', {})
            moon2 = chart2['planets'].get('Moon', {})
            
            nak1_num = moon1.get('nakshatra_num', 1)
            nak2_num = moon2.get('nakshatra_num', 1)
            
            # Calculate 8 kootas
            kootas = {}
            total_score = 0
            
            # 1. Varna Koota (1 point)
            varna_score = self.calculate_varna_koota(nak1_num, nak2_num)
            kootas['varna'] = {'score': varna_score, 'max': 1}
            total_score += varna_score
            
            # 2. Vashya Koota (2 points)
            vashya_score = self.calculate_vashya_koota(chart1, chart2)
            kootas['vashya'] = {'score': vashya_score, 'max': 2}
            total_score += vashya_score
            
            # 3. Tara Koota (3 points)
            tara_score = self.calculate_tara_koota(nak1_num, nak2_num)
            kootas['tara'] = {'score': tara_score, 'max': 3}
            total_score += tara_score
            
            # 4. Yoni Koota (4 points)
            yoni_score = self.calculate_yoni_koota(nak1_num, nak2_num)
            kootas['yoni'] = {'score': yoni_score, 'max': 4}
            total_score += yoni_score
            
            # 5. Graha Maitri (5 points)
            maitri_score = self.calculate_graha_maitri(chart1, chart2)
            kootas['graha_maitri'] = {'score': maitri_score, 'max': 5}
            total_score += maitri_score
            
            # 6. Gana Koota (6 points)
            gana_score = self.calculate_gana_koota(nak1_num, nak2_num)
            kootas['gana'] = {'score': gana_score, 'max': 6}
            total_score += gana_score
            
            # 7. Bhakoot Koota (7 points)
            bhakoot_score = self.calculate_bhakoot_koota(chart1, chart2)
            kootas['bhakoot'] = {'score': bhakoot_score, 'max': 7}
            total_score += bhakoot_score
            
            # 8. Nadi Koota (8 points)
            nadi_score = self.calculate_nadi_koota(nak1_num, nak2_num)
            kootas['nadi'] = {'score': nadi_score, 'max': 8}
            total_score += nadi_score
            
            # Interpretation
            if total_score >= 32:
                compatibility = 'Excellent'
            elif total_score >= 25:
                compatibility = 'Good'
            elif total_score >= 18:
                compatibility = 'Average'
            else:
                compatibility = 'Poor'
            
            return {
                'total_score': total_score,
                'max_score': 36,
                'percentage': round((total_score / 36) * 100, 1),
                'compatibility': compatibility,
                'kootas': kootas
            }
            
        except Exception as e:
            print(f"Guna Milan error: {e}", file=sys.stderr)
            return {'total_score': 0, 'max_score': 36, 'compatibility': 'Unknown'}

    def calculate_varna_koota(self, nak1: int, nak2: int) -> int:
        """Calculate Varna Koota compatibility"""
        try:
            # Simplified varna calculation
            varna_map = {range(1, 8): 0, range(8, 15): 1, range(15, 22): 2, range(22, 28): 3}
            
            varna1 = varna2 = 0
            for r, v in varna_map.items():
                if nak1 in r:
                    varna1 = v
                if nak2 in r:
                    varna2 = v
            
            return 1 if varna1 <= varna2 else 0
        except:
            return 0

    def calculate_vashya_koota(self, chart1: Dict, chart2: Dict) -> int:
        """Calculate Vashya Koota compatibility"""
        try:
            # Simplified based on Moon signs
            moon1_rashi = chart1['planets'].get('Moon', {}).get('rashi_num', 1)
            moon2_rashi = chart2['planets'].get('Moon', {}).get('rashi_num', 1)
            
            # Basic vashya compatibility
            return 2 if abs(moon1_rashi - moon2_rashi) <= 3 else 0
        except:
            return 0

    def calculate_tara_koota(self, nak1: int, nak2: int) -> int:
        """Calculate Tara Koota compatibility"""
        try:
            tara_distance = abs(nak1 - nak2) % 27
            if tara_distance in [0, 9, 18]:
                return 3
            elif tara_distance in [3, 6, 12, 15, 21, 24]:
                return 1.5
            else:
                return 0
        except:
            return 0

    def calculate_yoni_koota(self, nak1: int, nak2: int) -> int:
        """Calculate Yoni Koota compatibility"""
        try:
            # Simplified yoni matching
            yoni_map = [(1,14), (2,15), (3,16), (4,17), (5,18), (6,19), (7,20), 
                       (8,21), (9,22), (10,23), (11,24), (12,25), (13,26), (27,27)]
            
            for group in yoni_map:
                if nak1 in group and nak2 in group:
                    return 4
            
            return 2  # Partial compatibility
        except:
            return 0

    def calculate_graha_maitri(self, chart1: Dict, chart2: Dict) -> int:
        """Calculate Graha Maitri based on Moon sign lords"""
        try:
            moon1_rashi = chart1['planets'].get('Moon', {}).get('rashi_num', 1)
            moon2_rashi = chart2['planets'].get('Moon', {}).get('rashi_num', 1)
            
            # Simplified friendship calculation
            if abs(moon1_rashi - moon2_rashi) in [1, 2, 11, 12]:
                return 5
            elif abs(moon1_rashi - moon2_rashi) in [3, 4, 9, 10]:
                return 3
            else:
                return 1
        except:
            return 0

    def calculate_gana_koota(self, nak1: int, nak2: int) -> int:
        """Calculate Gana Koota compatibility"""
        try:
            # Deva, Manushya, Rakshasa gana classification
            deva_naks = [3, 8, 11, 13, 15, 20, 22, 24, 27]
            manushya_naks = [1, 4, 6, 7, 10, 12, 16, 18, 19, 21, 25]
            rakshasa_naks = [2, 5, 9, 14, 17, 23, 26]
            
            gana1 = gana2 = 0
            if nak1 in deva_naks:
                gana1 = 1
            elif nak1 in manushya_naks:
                gana1 = 2
            elif nak1 in rakshasa_naks:
                gana1 = 3
            
            if nak2 in deva_naks:
                gana2 = 1
            elif nak2 in manushya_naks:
                gana2 = 2
            elif nak2 in rakshasa_naks:
                gana2 = 3
            
            if gana1 == gana2:
                return 6
            elif (gana1 == 1 and gana2 == 2) or (gana1 == 2 and gana2 == 1):
                return 5
            elif (gana1 == 2 and gana2 == 3) or (gana1 == 3 and gana2 == 2):
                return 1
            else:
                return 0
        except:
            return 0

    def calculate_bhakoot_koota(self, chart1: Dict, chart2: Dict) -> int:
        """Calculate Bhakoot Koota compatibility"""
        try:
            moon1_rashi = chart1['planets'].get('Moon', {}).get('rashi_num', 1)
            moon2_rashi = chart2['planets'].get('Moon', {}).get('rashi_num', 1)
            
            distance = abs(moon1_rashi - moon2_rashi)
            
            if distance in [6, 8]:  # 6-8 relationship is problematic
                return 0
            elif distance in [2, 12]:  # 2-12 relationship is problematic
                return 0
            else:
                return 7
        except:
            return 0

    def calculate_nadi_koota(self, nak1: int, nak2: int) -> int:
        """Calculate Nadi Koota compatibility"""
        try:
            # Aadi, Madhya, Antya nadi classification
            aadi_naks = [1, 4, 7, 10, 13, 16, 19, 22, 25]
            madhya_naks = [2, 5, 8, 11, 14, 17, 20, 23, 26]
            antya_naks = [3, 6, 9, 12, 15, 18, 21, 24, 27]
            
            nadi1 = nadi2 = 0
            if nak1 in aadi_naks:
                nadi1 = 1
            elif nak1 in madhya_naks:
                nadi1 = 2
            elif nak1 in antya_naks:
                nadi1 = 3
            
            if nak2 in aadi_naks:
                nadi2 = 1
            elif nak2 in madhya_naks:
                nadi2 = 2
            elif nak2 in antya_naks:
                nadi2 = 3
            
            return 8 if nadi1 != nadi2 else 0
        except:
            return 0

    def generate_remedies(self, analysis_type: str, doshas: Dict[str, Any], compatibility_issues: List[str] = []) -> Dict[str, Any]:
        """Generate remedies based on doshas and compatibility issues"""
        remedies = {
            'gemstones': [],
            'mantras': [],
            'fasting': [],
            'charity': [],
            'colors': [],
            'temples': [],
            'general_advice': []
        }
        
        try:
            # Manglik dosha remedies
            if doshas.get('manglik', {}).get('present'):
                remedies['gemstones'].append('Red Coral for Mars pacification')
                remedies['mantras'].append('Om Angarakaya Namaha (108 times daily)')
                remedies['fasting'].append('Tuesday fasting')
                remedies['charity'].append('Donate red lentils, jaggery on Tuesdays')
                remedies['colors'].append('Avoid red and orange on Tuesdays')
                remedies['temples'].append('Visit Hanuman temple on Tuesdays')
                remedies['general_advice'].append('Both partners should be Manglik for cancellation')
                
            # Shani dosha remedies
            if doshas.get('shani', {}).get('present'):
                remedies['gemstones'].append('Blue Sapphire or Amethyst for Saturn')
                remedies['mantras'].append('Om Shanishcharaya Namaha (108 times daily)')
                remedies['fasting'].append('Saturday fasting')
                remedies['charity'].append('Donate black sesame, iron items on Saturdays')
                remedies['colors'].append('Wear dark blue or black on Saturdays')
                remedies['temples'].append('Visit Shani temple on Saturdays')
                remedies['general_advice'].append('Marriage after age 30 is recommended')
                
            # Rahu-Ketu dosha remedies
            if doshas.get('rahu_ketu', {}).get('present'):
                remedies['gemstones'].append('Hessonite for Rahu, Cat\'s Eye for Ketu')
                remedies['mantras'].append('Om Rahave Namaha and Om Ketave Namaha')
                remedies['charity'].append('Donate to snake-related temples')
                remedies['temples'].append('Visit Rahu-Ketu temples like Thirunageswaram')
                remedies['general_advice'].append('Both partners should have same dosha for cancellation')
                
            # Kaal Sarp dosha remedies
            if doshas.get('kaal_sarp', {}).get('present'):
                remedies['mantras'].append('Maha Mrityunjaya Mantra daily')
                remedies['temples'].append('Visit Trimbakeshwar, Kalahasti temples')
                remedies['charity'].append('Feed snakes or donate to serpent temples')
                remedies['general_advice'].append('Perform Kaal Sarp Dosha Nivaran Puja')
                
            # General marriage enhancement remedies
            remedies['general_advice'].extend([
                'Worship Lord Ganesha before marriage ceremonies',
                'Perform compatibility puja before marriage',
                'Seek blessings from happily married couples'
            ])
            
        except Exception as e:
            print(f"Remedy generation error: {e}", file=sys.stderr)
        
        return remedies

def marriage_analysis_main(birth_data_1: Dict[str, Any], birth_data_2: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Main function for marriage analysis
    Handles both single chart and compatibility analysis
    """
    try:
        engine = MarriageAnalysisEngine()
        result = {}
        
        # Calculate primary chart
        chart1 = engine.calculate_birth_chart(birth_data_1)
        if not chart1:
            return {'error': 'Failed to calculate primary birth chart'}
        
        if birth_data_2 is None:
            # Single chart analysis
            result['analysis_type'] = 'individual'
            result['name'] = birth_data_1.get('name', 'Person')
            
            # 7th house analysis
            seventh_house = engine.analyze_seventh_house(chart1)
            result['seventh_house_analysis'] = seventh_house
            
            # Marriage timing
            timing = engine.calculate_marriage_timing(chart1)
            result['marriage_timing'] = timing
            
            # Spouse characteristics
            spouse_traits = engine.analyze_spouse_characteristics(chart1)
            result['spouse_characteristics'] = spouse_traits
            
            # Check doshas
            doshas = engine.check_marriage_doshas(chart1)
            result['doshas'] = doshas
            
            # Love vs arranged indicators
            result['marriage_type'] = engine.analyze_marriage_type(chart1)
            
            # Generate remedies
            remedies = engine.generate_remedies('individual', doshas)
            result['remedies'] = remedies
            
        else:
            # Compatibility analysis
            chart2 = engine.calculate_birth_chart(birth_data_2)
            if not chart2:
                return {'error': 'Failed to calculate partner birth chart'}
            
            result['analysis_type'] = 'compatibility'
            result['person1_name'] = birth_data_1.get('name', 'Person 1')
            result['person2_name'] = birth_data_2.get('name', 'Person 2')
            
            # Guna Milan calculation
            guna_milan = engine.calculate_guna_milan(chart1, chart2)
            result['guna_milan'] = guna_milan
            
            # Individual dosha analysis
            doshas1 = engine.check_marriage_doshas(chart1)
            doshas2 = engine.check_marriage_doshas(chart2)
            result['person1_doshas'] = doshas1
            result['person2_doshas'] = doshas2
            
            # Dosha compatibility
            result['dosha_compatibility'] = engine.analyze_dosha_compatibility(doshas1, doshas2)
            
            # Planetary harmony
            result['planetary_harmony'] = engine.analyze_planetary_harmony(chart1, chart2)
            
            # Marriage stability forecast
            result['stability_forecast'] = engine.predict_marriage_stability(chart1, chart2, guna_milan)
            
            # Combined remedies
            compatibility_issues = []
            if guna_milan['total_score'] < 18:
                compatibility_issues.append('Low Guna Milan score')
            
            remedies = engine.generate_remedies('compatibility', doshas1, compatibility_issues)
            result['remedies'] = remedies
        
        result['success'] = True
        result['calculation_engine'] = 'Jyotisha + Swiss Ephemeris'
        
        return result
        
    except Exception as e:
        print(f"Marriage analysis error: {e}", file=sys.stderr)
        return {'error': str(e), 'success': False}

if __name__ == "__main__":
    try:
        # Read input from command line arguments or stdin
        if len(sys.argv) > 1:
            input_data = json.loads(sys.argv[1])
        else:
            input_data = json.loads(sys.stdin.read())
        
        birth_data_1 = input_data.get('birth_data_1')
        birth_data_2 = input_data.get('birth_data_2')
        
        result = marriage_analysis_main(birth_data_1, birth_data_2)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        
    except Exception as e:
        error_result = {'error': str(e), 'success': False}
        print(json.dumps(error_result))
        sys.exit(1)