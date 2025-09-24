#!/usr/bin/env python3
"""
Enhanced Dosha Detection System
Implements authentic Vedic astrology dosha calculations

Based on classical texts and traditional methodologies:
- Manglik Dosha (Mars placement analysis)
- Kaal Sarp Dosha (Rahu-Ketu planetary alignment)
- Other important doshas

Author: AstroTick Platform  
Date: July 8, 2025
"""

import sys
import json
import math
from typing import Dict, List, Tuple, Any

class EnhancedDoshaDetector:
    """
    Authentic Dosha Detection based on classical Vedic principles
    Implements multiple dosha calculations with detailed analysis
    """
    
    def __init__(self):
        # Houses for Manglik Dosha
        self.manglik_houses = [1, 4, 7, 8, 12]
        
        # Planet order for Kaal Sarp calculation
        self.planet_order = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']
        
    def detect_manglik_dosha(self, chart_data: Dict) -> Dict:
        """
        Detect Manglik Dosha based on Mars placement
        Traditional rules: Mars in 1st, 4th, 7th, 8th, or 12th house
        """
        mars_data = chart_data.get('planets', {}).get('Mars', {})
        mars_house = mars_data.get('house', 0)
        mars_sign = mars_data.get('sign', '')
        
        is_manglik = mars_house in self.manglik_houses
        
        # Determine severity
        severity = 'None'
        if is_manglik:
            if mars_house == 7:
                severity = 'High'  # 7th house is most severe
            elif mars_house in [1, 8]:
                severity = 'Medium'
            else:
                severity = 'Low'
        
        # Cancellation factors
        cancellations = []
        if is_manglik:
            # Age-based cancellation (after 28 years)
            cancellations.append("Age factor: Manglik effects reduce after 28 years")
            
            # Partner also being Manglik
            cancellations.append("If partner is also Manglik, dosha gets cancelled")
            
            # Jupiter's aspect on Mars
            cancellations.append("Jupiter's benefic aspect can reduce Manglik effects")
        
        # Remedial measures
        remedies = []
        if is_manglik:
            remedies.extend([
                "Recite Hanuman Chalisa daily",
                "Fast on Tuesdays",
                "Donate red lentils and jaggery",
                "Wear red coral gemstone (if suitable)",
                "Visit Hanuman temple regularly"
            ])
        
        return {
            'present': is_manglik,
            'severity': severity,
            'mars_house': mars_house,
            'mars_sign': mars_sign,
            'cancellation_factors': cancellations,
            'remedies': remedies,
            'description': self._get_manglik_description(is_manglik, severity, mars_house)
        }
    
    def detect_kaal_sarp_dosha(self, chart_data: Dict) -> Dict:
        """
        Detect Kaal Sarp Dosha based on Rahu-Ketu axis alignment
        All planets should be between Rahu and Ketu (or Ketu and Rahu)
        """
        planets = chart_data.get('planets', {})
        
        rahu_data = planets.get('Rahu', {})
        ketu_data = planets.get('Ketu', {})
        
        if not rahu_data or not ketu_data:
            return {'present': False, 'type': 'None', 'description': 'Insufficient data'}
        
        rahu_longitude = rahu_data.get('longitude', 0)
        ketu_longitude = ketu_data.get('longitude', 0)
        
        # Normalize Ketu longitude (should be opposite to Rahu)
        expected_ketu = (rahu_longitude + 180) % 360
        
        # Check if all planets are on one side of Rahu-Ketu axis
        planets_between_rahu_ketu = 0
        planets_between_ketu_rahu = 0
        
        for planet_name in self.planet_order:
            if planet_name in planets:
                planet_longitude = planets[planet_name].get('longitude', 0)
                
                if self._is_between_longitudes(rahu_longitude, expected_ketu, planet_longitude):
                    planets_between_rahu_ketu += 1
                else:
                    planets_between_ketu_rahu += 1
        
        # Determine if Kaal Sarp exists
        total_planets = len(self.planet_order)
        is_kaal_sarp = (planets_between_rahu_ketu == total_planets or 
                       planets_between_ketu_rahu == total_planets)
        
        # Partial Kaal Sarp (6 out of 7 planets)
        is_partial = (planets_between_rahu_ketu >= total_planets - 1 or 
                     planets_between_ketu_rahu >= total_planets - 1)
        
        # Determine type
        dosha_type = 'None'
        if is_kaal_sarp:
            dosha_type = 'Complete'
        elif is_partial:
            dosha_type = 'Partial'
        
        # Specific Kaal Sarp Yoga types based on Rahu house
        rahu_house = rahu_data.get('house', 1)
        yoga_name = self._get_kaal_sarp_yoga_name(rahu_house)
        
        # Remedial measures
        remedies = []
        if is_kaal_sarp or is_partial:
            remedies.extend([
                "Recite Mahamrityunjaya Mantra 108 times daily",
                "Perform Rahu-Ketu puja on eclipses",
                "Donate sesame seeds and black cloth",
                "Visit Kalahasti or Srikalahasti temple",
                "Chant 'Om Namah Shivaya' regularly"
            ])
        
        return {
            'present': is_kaal_sarp or is_partial,
            'type': dosha_type,
            'yoga_name': yoga_name,
            'rahu_house': rahu_house,
            'ketu_house': ketu_data.get('house', 7),
            'planets_count_rahu_side': planets_between_rahu_ketu,
            'planets_count_ketu_side': planets_between_ketu_rahu,
            'remedies': remedies,
            'description': self._get_kaal_sarp_description(dosha_type, yoga_name)
        }
    
    def detect_other_doshas(self, chart_data: Dict, birth_details: Dict) -> Dict:
        """
        Detect other important doshas
        """
        other_doshas = {}
        
        # Pitru Dosha
        other_doshas['pitru_dosha'] = self._detect_pitru_dosha(chart_data)
        
        # Grahan Dosha
        other_doshas['grahan_dosha'] = self._detect_grahan_dosha(chart_data)
        
        # Nadi Dosha (for marriage compatibility)
        other_doshas['nadi_dosha'] = self._detect_nadi_dosha(chart_data)
        
        return other_doshas
    
    def _detect_pitru_dosha(self, chart_data: Dict) -> Dict:
        """Detect Pitru Dosha (ancestral karma)"""
        planets = chart_data.get('planets', {})
        
        # Pitru Dosha indicated by Sun-Rahu conjunction or 9th house affliction
        sun_house = planets.get('Sun', {}).get('house', 1)
        rahu_house = planets.get('Rahu', {}).get('house', 1)
        
        is_present = (sun_house == rahu_house or  # Sun-Rahu conjunction
                     rahu_house == 9 or           # Rahu in 9th house
                     sun_house == 9)              # Afflicted 9th house
        
        return {
            'present': is_present,
            'description': 'Indicates ancestral karma requiring spiritual remedies',
            'remedies': ['Perform Pitra Paksha rituals', 'Donate to Brahmins', 'Feed crows and dogs']
        }
    
    def _detect_grahan_dosha(self, chart_data: Dict) -> Dict:
        """Detect Grahan Dosha (eclipse effects)"""
        planets = chart_data.get('planets', {})
        
        sun_longitude = planets.get('Sun', {}).get('longitude', 0)
        moon_longitude = planets.get('Moon', {}).get('longitude', 0)
        rahu_longitude = planets.get('Rahu', {}).get('longitude', 0)
        ketu_longitude = planets.get('Ketu', {}).get('longitude', 0)
        
        # Check for close conjunctions (within 12 degrees)
        sun_rahu_close = abs(sun_longitude - rahu_longitude) <= 12
        sun_ketu_close = abs(sun_longitude - ketu_longitude) <= 12
        moon_rahu_close = abs(moon_longitude - rahu_longitude) <= 12
        moon_ketu_close = abs(moon_longitude - ketu_longitude) <= 12
        
        is_present = sun_rahu_close or sun_ketu_close or moon_rahu_close or moon_ketu_close
        
        return {
            'present': is_present,
            'description': 'Eclipse effects on luminaries causing mental disturbances',
            'remedies': ['Donate during eclipses', 'Chant Surya or Chandra mantras']
        }
    
    def _detect_nadi_dosha(self, chart_data: Dict) -> Dict:
        """Detect Nadi Dosha for marriage compatibility"""
        # This would typically be checked between two charts
        # For now, just return structure
        return {
            'present': False,
            'description': 'Requires comparison with partner chart',
            'remedies': ['Perform Nadi dosha nivaran puja']
        }
    
    def _is_between_longitudes(self, start: float, end: float, check: float) -> bool:
        """Check if a longitude is between two other longitudes"""
        # Handle circular nature of zodiac
        if start <= end:
            return start <= check <= end
        else:
            return check >= start or check <= end
    
    def _get_manglik_description(self, is_manglik: bool, severity: str, house: int) -> str:
        """Get description for Manglik Dosha"""
        if not is_manglik:
            return "No Manglik Dosha detected. Marriage compatibility is favorable."
        
        descriptions = {
            1: "Mars in 1st house creates aggressive nature, affecting marital harmony",
            4: "Mars in 4th house affects domestic happiness and family relationships",
            7: "Mars in 7th house directly impacts marriage partner and married life",
            8: "Mars in 8th house creates obstacles and delays in marriage",
            12: "Mars in 12th house affects expenses and foreign connections in marriage"
        }
        
        return descriptions.get(house, f"Mars in {house}th house creates Manglik Dosha")
    
    def _get_kaal_sarp_yoga_name(self, rahu_house: int) -> str:
        """Get specific Kaal Sarp Yoga name based on Rahu position"""
        yoga_names = {
            1: "Anant Kaal Sarp Yoga",
            2: "Kulik Kaal Sarp Yoga", 
            3: "Vasuki Kaal Sarp Yoga",
            4: "Shankhapal Kaal Sarp Yoga",
            5: "Padma Kaal Sarp Yoga",
            6: "Mahapadma Kaal Sarp Yoga",
            7: "Takshak Kaal Sarp Yoga",
            8: "Karkotak Kaal Sarp Yoga",
            9: "Shankhnaad Kaal Sarp Yoga",
            10: "Ghatak Kaal Sarp Yoga",
            11: "Vishdhar Kaal Sarp Yoga",
            12: "Sheshnag Kaal Sarp Yoga"
        }
        
        return yoga_names.get(rahu_house, "Kaal Sarp Yoga")
    
    def _get_kaal_sarp_description(self, dosha_type: str, yoga_name: str) -> str:
        """Get description for Kaal Sarp Dosha"""
        if dosha_type == 'None':
            return "No Kaal Sarp Dosha detected. Planetary alignment is favorable."
        elif dosha_type == 'Partial':
            return f"Partial {yoga_name} present. Some delays and obstacles in life progress."
        else:
            return f"Complete {yoga_name} present. Significant life challenges requiring spiritual remedies."

def main():
    """Main function for standalone execution"""
    try:
        # Read input from command line or stdin
        if len(sys.argv) > 1:
            input_data = json.loads(sys.argv[1])
        else:
            input_data = json.loads(sys.stdin.read())
        
        detector = EnhancedDoshaDetector()
        
        chart_data = input_data.get('chart_data', {})
        birth_details = input_data.get('birth_details', {})
        
        # Detect all doshas
        dosha_results = {
            'manglik_dosha': detector.detect_manglik_dosha(chart_data),
            'kaal_sarp_dosha': detector.detect_kaal_sarp_dosha(chart_data),
            'other_doshas': detector.detect_other_doshas(chart_data, birth_details)
        }
        
        # Summary
        dosha_results['summary'] = {
            'total_doshas': sum(1 for dosha in [
                dosha_results['manglik_dosha']['present'],
                dosha_results['kaal_sarp_dosha']['present']
            ] if dosha),
            'severity_level': 'High' if dosha_results['manglik_dosha']['severity'] == 'High' 
                           or dosha_results['kaal_sarp_dosha']['type'] == 'Complete' else 'Medium'
        }
        
        print(json.dumps(dosha_results, indent=2))
        
    except Exception as e:
        print(f"Error in dosha detection: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()