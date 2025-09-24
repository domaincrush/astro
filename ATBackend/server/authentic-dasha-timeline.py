"""
Authentic Vimśottari Dasha Timeline Calculator
Uses jyotisha library for precise astronomical calculations
Following the exact methodology provided by user
"""

import sys
import json
import traceback
from datetime import datetime, date
# Import our existing jyotisha engine instead of direct jyotisha library
import os
import subprocess
from pathlib import Path

def jdn_to_date(jdn):
    """Convert Julian Day Number to Gregorian date"""
    try:
        # Fallback Julian Day to Gregorian conversion
        import math
        a = int(jdn + 0.5)
        if a < 2299161:
            c = a
        else:
            alpha = int((a - 1867216.25) / 36524.25)
            c = a + 1 + alpha - int(alpha / 4)
        
        d = c + 1524
        e = int((d - 122.1) / 365.25)
        f = int(365.25 * e)
        g = int((d - f) / 30.6001)
        
        day = d - f - int(30.6001 * g)
        month = g - 1 if g < 14 else g - 13
        year = e - 4716 if month > 2 else e - 4715
        
        return date(year, month, day)
    except Exception as e:
        # Fallback to current date on error
        return date.today()

def calculate_authentic_dasha_timeline(birth_data):
    """
    Calculate authentic Vimśottari Dasha timeline using our enhanced jyotisha engine
    """
    try:
        # Parse birth data
        name = birth_data.get('name', 'User')
        birth_date_str = birth_data.get('date', '')
        birth_time_str = birth_data.get('time', '')
        place = birth_data.get('place', 'Chennai')
        latitude = birth_data.get('latitude')
        longitude = birth_data.get('longitude')
        
        print(f"[DEBUG] Processing birth data: {name}, {birth_date_str}, {birth_time_str}, {place}", file=sys.stderr)
        
        # Use our existing jyotisha engine for authentic calculations
        engine_data = {
            "name": name,
            "date": birth_date_str,
            "time": birth_time_str,
            "place": place,
            "latitude": latitude if latitude else 13.0827,  # Default to Chennai if not provided
            "longitude": longitude if longitude else 80.2707
        }
        
        # Call our existing jyotisha engine via stdin (not command line argument)
        # Security: Use only static script name, prevent path traversal
        script_name = "jyotisha-engine.py"
        validated_engine_path = Path(__file__).parent / script_name
        if not validated_engine_path.exists():
            raise FileNotFoundError(f"Engine not found: {validated_engine_path}")
        
        # Security: Command uses only static strings, data passed via stdin
        result = subprocess.run(
            ["python3", script_name],  # Use script name directly instead of full path
            input=json.dumps(engine_data),
            capture_output=True,
            text=True,
            shell=False,
            timeout=30,
            cwd=str(Path(__file__).parent)
        )
        
        if result.returncode != 0:
            print(f"[DEBUG] Engine failed with return code {result.returncode}: {result.stderr}", file=sys.stderr)
            raise Exception(f"Jyotisha engine failed with return code {result.returncode}: {result.stderr}")
        
        # The jyotisha engine may output status messages to stderr (like "✅ Swiss Ephemeris available")
        # These are not errors, so we only check stdout for actual data
        print(f"[DEBUG] Engine stderr (status messages): {result.stderr.strip()}", file=sys.stderr)
        print(f"[DEBUG] Engine stdout length: {len(result.stdout)}", file=sys.stderr)
        
        # Parse the jyotisha engine output from stdout
        try:
            engine_output = json.loads(result.stdout)
            print(f"[DEBUG] Engine output received successfully", file=sys.stderr)
            print(f"[DEBUG] Engine success: {engine_output.get('success', False)}", file=sys.stderr)
        except json.JSONDecodeError as e:
            print(f"[DEBUG] JSON decode error: {e}", file=sys.stderr)
            print(f"[DEBUG] Raw stdout: {result.stdout[:500]}...", file=sys.stderr)
            raise Exception(f"Failed to parse jyotisha engine output: {e}")
        
        # Extract dasha information from engine output
        dasha_info = engine_output.get('dasha', {})
        if not dasha_info:
            # Check if the engine output is using a different structure
            if 'success' in engine_output and not engine_output['success']:
                raise Exception(f"Jyotisha engine failed: {engine_output.get('error', 'Unknown error')}")
            
            print(f"[DEBUG] No dasha found, checking birth_chart structure", file=sys.stderr)
            birth_chart = engine_output.get('birth_chart', {})
            if birth_chart:
                dasha_info = birth_chart.get('dasha', {})
            
            if not dasha_info:
                print(f"[DEBUG] Full engine output: {json.dumps(engine_output, indent=2)[:500]}...", file=sys.stderr)
                raise Exception("No dasha information found in engine output")
        
        # Extract current dasha and sequence
        current_dasha = dasha_info.get('current')
        dasha_sequence = dasha_info.get('sequence', [])
        
        print(f"[DEBUG] Current dasha: {current_dasha['lord'] if current_dasha else 'None'}", file=sys.stderr)
        print(f"[DEBUG] Dasha sequence contains {len(dasha_sequence)} periods", file=sys.stderr)
        
        # Transform the dasha sequence into the required format
        dasha_timeline = []
        birth_date = datetime.strptime(birth_date_str, '%Y-%m-%d').date()
        
        for period in dasha_sequence:
            # Convert dates and calculate ages
            start_date = datetime.fromisoformat(period['start_date'].replace('Z', '+00:00')).date()
            end_date = datetime.fromisoformat(period['end_date'].replace('Z', '+00:00')).date()
            
            age_start = (start_date - birth_date).days / 365.25
            age_end = (end_date - birth_date).days / 365.25
            
            # Calculate antardashas (sub-periods) if available
            antardashas = []
            if period.get('sub_periods') and period['sub_periods'].get('antardashas'):
                for sub_period in period['sub_periods']['antardashas']:
                    sub_start = datetime.fromisoformat(sub_period['start_date'].replace('Z', '+00:00')).date()
                    sub_end = datetime.fromisoformat(sub_period['end_date'].replace('Z', '+00:00')).date()
                    
                    antardashas.append({
                        "lord": sub_period['lord'],
                        "start": sub_start.isoformat(),
                        "end": sub_end.isoformat(),
                        "age_start": round((sub_start - birth_date).days / 365.25, 1),
                        "age_end": round((sub_end - birth_date).days / 365.25, 1)
                    })
            
            # If no sub-periods were generated, at least provide current dasha sub-periods
            if not antardashas and period.get('status') == 'current':
                # Get current dasha sub-periods from the engine
                current_sub_periods = dasha_info.get('sub_periods', {})
                if current_sub_periods.get('antardashas'):
                    for sub_period in current_sub_periods['antardashas']:
                        sub_start = datetime.fromisoformat(sub_period['start_date'].replace('Z', '+00:00')).date()
                        sub_end = datetime.fromisoformat(sub_period['end_date'].replace('Z', '+00:00')).date()
                        
                        antardashas.append({
                            "lord": sub_period['lord'],
                            "start": sub_start.isoformat(),
                            "end": sub_end.isoformat(),
                            "age_start": round((sub_start - birth_date).days / 365.25, 1),
                            "age_end": round((sub_end - birth_date).days / 365.25, 1)
                        })
            
            dasha_timeline.append({
                "mahadasha": period['lord'],
                "start": start_date.isoformat(),
                "end": end_date.isoformat(),
                "age_start": round(age_start, 1),
                "age_end": round(age_end, 1),
                "duration_years": round(age_end - age_start, 1),
                "status": period.get('status', 'future'),
                "antardashas": antardashas
            })
        
        # Find current dasha and antardasha
        current_date = date.today()
        current_dasha_info = None
        current_antardasha_info = None
        
        for dasha in dasha_timeline:
            dasha_start = date.fromisoformat(dasha["start"])
            dasha_end = date.fromisoformat(dasha["end"])
            
            if dasha_start <= current_date <= dasha_end:
                current_dasha_info = dasha
                
                # Find current antardasha
                for antardasha in dasha["antardashas"]:
                    ad_start = date.fromisoformat(antardasha["start"])
                    ad_end = date.fromisoformat(antardasha["end"])
                    
                    if ad_start <= current_date <= ad_end:
                        current_antardasha_info = antardasha
                        break
                break
        
        # Calculate current age
        current_age = round((current_date - birth_date).days / 365.25, 1)
        
        print(f"[DEBUG] Timeline generated with {len(dasha_timeline)} periods", file=sys.stderr)
        print(f"[DEBUG] Current age: {current_age}", file=sys.stderr)
        
        return {
            "success": True,
            "birth_details": {
                "name": name,
                "date": birth_date_str,
                "time": birth_time_str,
                "place": place,
                "coordinates": {
                    "latitude": engine_output.get('latitude'),
                    "longitude": engine_output.get('longitude')
                }
            },
            "current_status": {
                "current_age": current_age,
                "current_date": current_date.isoformat(),
                "current_dasha": current_dasha_info,
                "current_antardasha": current_antardasha_info
            },
            "dasha_timeline": dasha_timeline,
            "calculation_method": "Authentic Vimśottari using Swiss Ephemeris with Lahiri Ayanamsa",
            "calculation_timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        error_msg = f"Authentic Dasha calculation failed: {str(e)}"
        print(f"[DEBUG] {error_msg}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        
        return {
            "success": False,
            "error": error_msg,
            "fallback_message": "Please verify birth details and try again",
            "calculation_timestamp": datetime.now().isoformat()
        }

def main():
    """Main function for API integration"""
    try:
        # Read input from stdin
        input_data = sys.stdin.read()
        birth_data = json.loads(input_data)
        
        # Calculate authentic dasha timeline
        result = calculate_authentic_dasha_timeline(birth_data)
        
        # Output result as JSON
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        error_result = {
            "success": False,
            "error": f"Script execution failed: {str(e)}",
            "calculation_timestamp": datetime.now().isoformat()
        }
        print(json.dumps(error_result, indent=2))

if __name__ == "__main__":
    main()