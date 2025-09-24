#!/usr/bin/env python3
"""
Shodashavarga Calculator for Vedic Astrology
Implements authentic divisional chart calculations using jyotisha methodology
Based on traditional Vedic astrology principles for 16 major divisional charts
"""

import math
from typing import Dict, Tuple, List

class VargaCalculator:
    """Calculate authentic Shodashavarga (16 divisional charts) from planetary longitudes"""
    
    SIGNS = [
        'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ]
    
    SANSKRIT_SIGNS = [
        'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
        'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'
    ]
    
    def __init__(self):
        self.varga_names = {
            1: 'Rasi', 2: 'Hora', 3: 'Drekkana', 4: 'Chaturthamsa', 5: 'Panchamsa',
            6: 'Shashtamsa', 7: 'Saptamsa', 8: 'Ashtamsa', 9: 'Navamsa', 10: 'Dasamsa',
            11: 'Rudramsa', 12: 'Dvadasamsa', 16: 'Shodasamsa', 20: 'Vimsamsa',
            24: 'Chaturvimsamsa', 30: 'Trimsamsa'
        }
        
        self.varga_purposes = {
            1: 'Overall life pattern, personality, health',
            2: 'Wealth accumulation, financial prosperity',
            3: 'Siblings, courage, communication skills',
            4: 'Property ownership, real estate, mother',
            5: 'Spiritual merit, intelligence, mantras',
            6: 'Health issues, diseases, enemies',
            7: 'Children prospects, creativity',
            8: 'Longevity, sudden events, transformation',
            9: 'Marriage, spouse, dharma, fortune',
            10: 'Career achievements, profession, status',
            11: 'Death, destruction, major life changes',
            12: 'Parents, inheritance, ancestral karma',
            16: 'Vehicles, luxuries, comforts',
            20: 'Spiritual progress, religious inclinations',
            24: 'Education, learning, academic success',
            30: 'Evils, misfortunes, hidden enemies'
        }
    
    def get_sign_and_degree(self, longitude: float) -> Tuple[int, float]:
        """Convert longitude to sign number (1-12) and degree within sign (0-30)"""
        sign_num = int(longitude / 30) + 1
        degree = longitude % 30
        return sign_num, degree
    
    def get_varga_general(self, sign: int, degree: float, divisions: int) -> int:
        """
        Generic Varga calculation using authentic Vedic methodology
        Returns the varga sign for any divisional chart
        """
        arc_length = 30.0 / divisions
        division = int(degree / arc_length)
        varga_sign = (divisions * (sign - 1) + division) % 12 + 1
        return varga_sign
    
    def get_navamsa(self, sign: int, degree: float) -> Tuple[int, int]:
        """
        Calculate Navamsa (D-9) using traditional method
        Each sign (30°) divided into 9 parts = 3°20' = 3.3333°
        """
        part = int(degree / 3.333333)
        navamsa_sign = (9 * (sign - 1) + part) % 12 + 1
        return navamsa_sign, part + 1
    
    def get_hora(self, sign: int, degree: float) -> int:
        """Calculate Hora (D-2) - wealth chart"""
        if degree < 15.0:
            # First half belongs to Sun's hora
            return 5 if sign % 2 == 1 else 4  # Leo for odd signs, Cancer for even
        else:
            # Second half belongs to Moon's hora
            return 4 if sign % 2 == 1 else 5  # Cancer for odd signs, Leo for even
    
    def get_drekkana(self, sign: int, degree: float) -> int:
        """Calculate Drekkana (D-3) - siblings chart"""
        third = int(degree / 10.0)
        if third == 0:
            return sign
        elif third == 1:
            return (sign + 3) % 12 + 1 if (sign + 3) % 12 != 0 else 12
        else:
            return (sign + 7) % 12 + 1 if (sign + 7) % 12 != 0 else 12
    
    def calculate_all_vargas(self, planetary_positions: Dict) -> Dict:
        """Calculate all major divisional charts for given planetary positions"""
        varga_charts = {}
        
        for planet, data in planetary_positions.items():
            longitude = data.get('longitude', 0)
            sign, degree = self.get_sign_and_degree(longitude)
            
            planet_vargas = {
                'rasi_sign': sign,
                'rasi_degree': degree,
                'rasi_name': self.SIGNS[sign - 1],
                'rasi_sanskrit': self.SANSKRIT_SIGNS[sign - 1]
            }
            
            # Calculate major divisional charts
            planet_vargas['d2_hora'] = self.get_hora(sign, degree)
            planet_vargas['d3_drekkana'] = self.get_drekkana(sign, degree)
            planet_vargas['d4_chaturthamsa'] = self.get_varga_general(sign, degree, 4)
            planet_vargas['d5_panchamsa'] = self.get_varga_general(sign, degree, 5)
            planet_vargas['d6_shashtamsa'] = self.get_varga_general(sign, degree, 6)
            planet_vargas['d7_saptamsa'] = self.get_varga_general(sign, degree, 7)
            planet_vargas['d8_ashtamsa'] = self.get_varga_general(sign, degree, 8)
            
            # Special calculation for Navamsa
            navamsa_sign, navamsa_part = self.get_navamsa(sign, degree)
            planet_vargas['d9_navamsa'] = navamsa_sign
            planet_vargas['d9_navamsa_part'] = navamsa_part
            
            planet_vargas['d10_dasamsa'] = self.get_varga_general(sign, degree, 10)
            planet_vargas['d12_dvadasamsa'] = self.get_varga_general(sign, degree, 12)
            planet_vargas['d16_shodasamsa'] = self.get_varga_general(sign, degree, 16)
            planet_vargas['d20_vimsamsa'] = self.get_varga_general(sign, degree, 20)
            planet_vargas['d24_chaturvimsamsa'] = self.get_varga_general(sign, degree, 24)
            planet_vargas['d30_trimsamsa'] = self.get_varga_general(sign, degree, 30)
            
            varga_charts[planet] = planet_vargas
        
        return varga_charts
    
    def create_divisional_chart_positions(self, varga_charts: Dict, varga_number: int) -> Dict:
        """Create planetary positions for specific divisional chart"""
        varga_key = f'd{varga_number}_{self.varga_names[varga_number].lower()}'
        if varga_number == 1:
            varga_key = 'rasi_sign'
        
        chart_positions = {}
        for planet, vargas in varga_charts.items():
            if varga_key in vargas:
                sign_num = vargas[varga_key]
                chart_positions[planet] = {
                    'sign': self.SIGNS[sign_num - 1],
                    'sign_sanskrit': self.SANSKRIT_SIGNS[sign_num - 1],
                    'sign_number': sign_num,
                    'house': sign_num,  # In divisional charts, sign and house are same
                    'longitude': vargas.get('rasi_degree', 0) + (sign_num - 1) * 30,
                    'degree_in_sign': vargas.get('rasi_degree', 0)
                }
        
        return chart_positions
    
    def get_varga_strength_analysis(self, varga_charts: Dict, planet: str) -> Dict:
        """Analyze planetary strength across multiple divisional charts"""
        if planet not in varga_charts:
            return {}
        
        vargas = varga_charts[planet]
        strength_analysis = {
            'own_signs_count': 0,
            'exaltation_count': 0,
            'debilitation_count': 0,
            'friend_signs_count': 0,
            'enemy_signs_count': 0,
            'total_strength_score': 0
        }
        
        # Simplified strength calculation across major vargas
        major_vargas = ['d1', 'd9', 'd10', 'd12', 'd30']
        
        for varga in major_vargas:
            varga_key = f'{varga}_{self.varga_names[int(varga[1:])].lower()}'
            if varga == 'd1':
                varga_key = 'rasi_sign'
            
            if varga_key in vargas:
                sign_num = vargas[varga_key]
                # Add strength analysis logic here
                strength_analysis['total_strength_score'] += 1
        
        return strength_analysis

def main():
    """Test function for varga calculator"""
    calculator = VargaCalculator()
    
    # Test with dynamically calculated positions (sample for testing only)
    # NOTE: In production, this would use authentic Swiss Ephemeris data
    test_positions = {
        'Sun': {'longitude': 30.0},    # Example: Taurus
        'Moon': {'longitude': 90.0},   # Example: Cancer
        'Mars': {'longitude': 120.0},  # Example: Leo
        'Mercury': {'longitude': 60.0}, # Example: Gemini
        'Jupiter': {'longitude': 210.0}, # Example: Scorpio
        'Venus': {'longitude': 150.0},  # Example: Virgo
        'Saturn': {'longitude': 270.0}  # Example: Capricorn
    }
    
    varga_charts = calculator.calculate_all_vargas(test_positions)
    
    print("🔯 SHODASHAVARGA CALCULATION RESULTS")
    print("=" * 50)
    
    for planet, vargas in varga_charts.items():
        print(f"\n{planet}:")
        print(f"  Rasi (D-1): {vargas['rasi_name']} {vargas['rasi_degree']:.2f}°")
        print(f"  Navamsa (D-9): {calculator.SIGNS[vargas['d9_navamsa'] - 1]} (Part {vargas['d9_navamsa_part']})")
        print(f"  Dasamsa (D-10): {calculator.SIGNS[vargas['d10_dasamsa'] - 1]}")
    
    # Test creating divisional chart for D-9
    d9_positions = calculator.create_divisional_chart_positions(varga_charts, 9)
    print(f"\n📊 D-9 Navamsa Chart Positions:")
    for planet, pos in d9_positions.items():
        print(f"  {planet}: {pos['sign']} (House {pos['house']})")

if __name__ == "__main__":
    main()