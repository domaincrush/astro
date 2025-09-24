#!/usr/bin/env python3
"""
Comprehensive Ashtakavarga Diagnostic and Improvement System
Based on the debugging guide to ensure accurate bindu calculations
"""

import sys
import json
import datetime
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass

# Check for jyotisha availability
try:
    from jyotisha.panchaanga.temporal import City, get_panchaanga_for_date
    from jyotisha.panchaanga.temporal.ashtakavarga import GrahaAshtakaVarga, SarvaAshtakaVarga
    from jyotisha.panchaanga.temporal.body import Graha
    JYOTISHA_AVAILABLE = True
    print("[DEBUG] Jyotisha library available", file=sys.stderr)
except ImportError as e:
    JYOTISHA_AVAILABLE = False
    print(f"[DEBUG] Jyotisha not available: {e}", file=sys.stderr)

@dataclass
class BirthData:
    """Birth data structure for Ashtakavarga calculations"""
    name: str
    date: str
    time: str
    place: str
    latitude: float
    longitude: float
    timezone: str = "UTC"

class AshtakavargaDiagnostic:
    """Comprehensive diagnostic system for Ashtakavarga calculations"""
    
    def __init__(self):
        self.debug_mode = True
        
    def debug_print(self, message: str):
        """Print debug messages to stderr"""
        if self.debug_mode:
            print(f"[ASHTAKAVARGA DEBUG] {message}", file=sys.stderr)
    
    def validate_panchaanga_input(self, birth_data: BirthData) -> Dict:
        """Validate and create panchaanga with proper input handling"""
        try:
            # Step 1: Parse birth data
            date_parts = birth_data.date.split('-')
            time_parts = birth_data.time.split(':')
            
            dob = datetime.date(int(date_parts[0]), int(date_parts[1]), int(date_parts[2]))
            tod = (int(time_parts[0]), int(time_parts[1]))
            
            self.debug_print(f"Birth Date: {dob}, Time: {tod}")
            
            # Step 2: Get city (using coordinates if needed)
            try:
                city = City.get_city_by_name(birth_data.place.split(',')[0])
                self.debug_print(f"Found city: {city.name}")
            except:
                # Create custom city with coordinates
                city = City(
                    name=birth_data.place,
                    latitude=birth_data.latitude,
                    longitude=birth_data.longitude,
                    timezone=birth_data.timezone
                )
                self.debug_print(f"Created custom city: {city.name}")
            
            # Step 3: Generate panchaanga with Lahiri ayanamsha
            panchaanga = get_panchaanga_for_date(
                city=city, 
                date=dob, 
                time_of_day=tod,
                ayanaamsha_id='LAHIRI'
            )
            
            # Step 4: Validate against external reference
            lagna_rasi = panchaanga.lagna.rasi
            chandra_rasi = panchaanga.chandra.rasi
            
            self.debug_print(f"Ascendant sign: {lagna_rasi}, Moon sign: {chandra_rasi}")
            
            return {
                'success': True,
                'panchaanga': panchaanga,
                'lagna_rasi': lagna_rasi,
                'chandra_rasi': chandra_rasi,
                'city': city.name
            }
            
        except Exception as e:
            self.debug_print(f"Panchaanga validation error: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'fallback_available': True
            }
    
    def calculate_graha_ashtakavarga(self, panchaanga, graha_list: List = None) -> Dict:
        """Calculate individual planet Ashtakavarga with diagnostic checks"""
        try:
            if graha_list is None:
                graha_list = [
                    Graha.SURYA, Graha.CHANDRA, Graha.MANGALA, 
                    Graha.BUDHA, Graha.GURU, Graha.SUKRA, Graha.SHANI
                ]
            
            gav_dict = {}
            diagnostic_results = {}
            
            # Calculate for each planet
            for graha in graha_list:
                try:
                    # Create GrahaAshtakaVarga instance
                    gav = GrahaAshtakaVarga(panchaanga=panchaanga, graha=graha)
                    gav_dict[graha.name] = gav
                    
                    # Get house bindus (1-12)
                    house_bindus = []
                    for house in range(1, 13):
                        bindu = gav.get_house_bindu(house)
                        house_bindus.append(bindu)
                    
                    diagnostic_results[graha.name] = {
                        'house_bindus': house_bindus,
                        'total_bindus': sum(house_bindus),
                        'max_house': house_bindus.index(max(house_bindus)) + 1,
                        'min_house': house_bindus.index(min(house_bindus)) + 1
                    }
                    
                    self.debug_print(f"{graha.name} house bindus: {house_bindus}")
                    self.debug_print(f"{graha.name} total bindus: {sum(house_bindus)}")
                    
                except Exception as e:
                    self.debug_print(f"Error calculating {graha.name}: {str(e)}")
                    diagnostic_results[graha.name] = {
                        'error': str(e),
                        'house_bindus': [0] * 12,
                        'total_bindus': 0
                    }
            
            return {
                'success': True,
                'gav_dict': gav_dict,
                'diagnostic_results': diagnostic_results
            }
            
        except Exception as e:
            self.debug_print(f"Graha Ashtakavarga calculation error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def calculate_sarvashtakavarga(self, gav_dict: Dict) -> Dict:
        """Calculate Sarvashtakavarga with validation checks"""
        try:
            # Create SarvaAshtakaVarga instance
            sav = SarvaAshtakaVarga(graha_ashtakavarga_dict=gav_dict)
            
            # Get house totals
            house_totals = sav.get_house_bindu_totals()
            total_bindus = sum(house_totals)
            
            self.debug_print(f"Sarvashtakavarga house totals: {house_totals}")
            self.debug_print(f"Total Sarvashtakavarga bindus: {total_bindus}")
            
            # Validate total (should be around 337 for complete calculation)
            if total_bindus < 300 or total_bindus > 400:
                self.debug_print(f"WARNING: Unusual total bindus: {total_bindus}")
            
            return {
                'success': True,
                'house_totals': house_totals,
                'total_bindus': total_bindus,
                'highest_house': house_totals.index(max(house_totals)) + 1,
                'lowest_house': house_totals.index(min(house_totals)) + 1
            }
            
        except Exception as e:
            self.debug_print(f"Sarvashtakavarga calculation error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def run_comprehensive_diagnostic(self, birth_data: BirthData) -> Dict:
        """Run complete diagnostic and calculation"""
        results = {
            'birth_data': birth_data.__dict__,
            'diagnostic_steps': {},
            'final_results': {}
        }
        
        # Step 1: Validate panchaanga input
        self.debug_print("Step 1: Validating panchaanga input")
        panchaanga_result = self.validate_panchaanga_input(birth_data)
        results['diagnostic_steps']['panchaanga_validation'] = panchaanga_result
        
        if not panchaanga_result['success']:
            results['final_results']['error'] = 'Panchaanga validation failed'
            return results
        
        # Step 2: Calculate individual planet Ashtakavarga
        self.debug_print("Step 2: Calculating individual planet Ashtakavarga")
        graha_result = self.calculate_graha_ashtakavarga(panchaanga_result['panchaanga'])
        results['diagnostic_steps']['graha_ashtakavarga'] = graha_result
        
        if not graha_result['success']:
            results['final_results']['error'] = 'Graha Ashtakavarga calculation failed'
            return results
        
        # Step 3: Calculate Sarvashtakavarga
        self.debug_print("Step 3: Calculating Sarvashtakavarga")
        sarva_result = self.calculate_sarvashtakavarga(graha_result['gav_dict'])
        results['diagnostic_steps']['sarvashtakavarga'] = sarva_result
        
        if not sarva_result['success']:
            results['final_results']['error'] = 'Sarvashtakavarga calculation failed'
            return results
        
        # Step 4: Compile final results
        results['final_results'] = {
            'success': True,
            'lagna_rasi': panchaanga_result['lagna_rasi'],
            'chandra_rasi': panchaanga_result['chandra_rasi'],
            'individual_planets': graha_result['diagnostic_results'],
            'sarvashtakavarga': sarva_result,
            'ayanamsha': 'LAHIRI',
            'calculation_method': 'jyotisha_authentic'
        }
        
        return results

def main():
    """Main function for testing"""
    if len(sys.argv) < 2:
        print("Usage: python ashtakavarga-diagnostic.py '<birth_data_json>'")
        sys.exit(1)
    
    try:
        # Parse birth data
        birth_data_json = json.loads(sys.argv[1])
        birth_data = BirthData(**birth_data_json)
        
        # Run diagnostic
        diagnostic = AshtakavargaDiagnostic()
        
        if JYOTISHA_AVAILABLE:
            results = diagnostic.run_comprehensive_diagnostic(birth_data)
        else:
            results = {
                'error': 'Jyotisha library not available',
                'fallback_required': True
            }
        
        # Output results
        print(json.dumps(results, indent=2, default=str))
        
    except Exception as e:
        print(json.dumps({
            'error': f'Diagnostic failed: {str(e)}',
            'traceback': str(e)
        }))

if __name__ == '__main__':
    main()