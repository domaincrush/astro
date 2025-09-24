#!/usr/bin/env python3
import sys
import json
import os
import tempfile
import base64
import contextlib
from io import StringIO

# Add jyotishyam to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'jyotishyam'))

@contextlib.contextmanager
def suppress_stdout():
    """Context manager to suppress stdout and stderr"""
    old_stdout = sys.stdout
    old_stderr = sys.stderr
    sys.stdout = StringIO()
    sys.stderr = StringIO()
    try:
        yield
    finally:
        sys.stdout = old_stdout
        sys.stderr = old_stderr

def test_jyotishyam(birth_data):
    """Test jyotishyam library with birth data"""
    try:
        # Suppress all output from jyotishyam library
        with suppress_stdout():
            # Import jyotishyam modules
            import mod_astrodata as data
            import mod_json as js
            import chart_calc.mod_lagna as mod_lagna
            import drawCharts.mod_drawChart as dc
            import generic.mod_constants as c
            
            # Update birth data
            data.birthdata = {
                "name": birth_data.get("name", "Test Person"),
                "date": birth_data.get("date", "1980-09-09"),
                "time": birth_data.get("time", "19:15:00"),
                "timezone": birth_data.get("timezone", "Asia/Kolkata"),
                "latitude": birth_data.get("latitude", 13.0827),
                "longitude": birth_data.get("longitude", 80.2707),
                "place": birth_data.get("place", "Chennai, India")
            }
            
            # Compute lagna chart
            mod_lagna.compute_lagnaChart()
            
            # Try to get chart data
            chart_data = {
                "lagna_ascendant": data.lagna_ascendant,
                "birth_data": data.birthdata
            }
            
            # Try to check if D1 chart exists
            if hasattr(data, 'D1'):
                chart_data["D1"] = data.D1
            
            # Try to create SVG chart using our North Indian layout
            try:
                # Import our chart generator
                sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'chart-generators'))
                
                # Create a custom North Indian chart
                chart_data["custom_north_indian_chart"] = generate_custom_north_indian_chart(data, birth_data)
                
                # Also try jyotishyam's built-in chart generation
                original_cwd = os.getcwd()
                jyotishyam_dir = os.path.join(os.path.dirname(__file__), 'jyotishyam')
                os.chdir(jyotishyam_dir)
                
                try:
                    js.load_drawChartConfig()
                    dc.create_chartSVG(data.D1 if hasattr(data, 'D1') else {})
                    
                    # Look for generated SVG files in chart_images directory
                    chart_images_dir = os.path.join('.', 'drawCharts', 'chart_images')
                    if os.path.exists(chart_images_dir):
                        svg_files = [f for f in os.listdir(chart_images_dir) if f.endswith('.svg')]
                        
                        if svg_files:
                            # Read the most recent SVG file
                            latest_svg = os.path.join(chart_images_dir, svg_files[-1])
                            with open(latest_svg, 'rb') as f:
                                svg_content = f.read()
                            
                            svg_base64 = f"data:image/svg+xml;base64,{base64.b64encode(svg_content).decode('utf-8')}"
                            chart_data["jyotishyam_svg_chart"] = svg_base64
                        
                finally:
                    os.chdir(original_cwd)
                        
            except Exception as svg_error:
                chart_data["svg_error"] = str(svg_error)
        
        return {
            "success": True,
            "chart_data": chart_data,
            "message": "Jyotishyam computation successful"
        }
        
    except Exception as e:
        import traceback
        return {
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc()
        }

def generate_custom_north_indian_chart(jyotishyam_data, birth_data):
    """Generate a custom North Indian chart using the provided layout logic"""
    import math
    
    # House number mapping - 1st house at top center, anticlockwise
    house_numbers = [7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6]
    
    # House polygons with exact coordinates - 180 degree flipped layout
    house_polygons = [
        [(100,225), (200,150), (300,225), (200,300)],  # H1 (1st House - Bottom Center) - flipped
        [(200,300), (300,225), (400,300)],             # H2 (2nd House - Bottom Center Right) - flipped
        [(300,225), (400,150), (400,300)],             # H3 (3rd House - Bottom Right Corner) - flipped
        [(300,75), (200,150), (300,225), (400,150)],   # H4 (4th House - Bottom Right) - flipped
        [(300,75), (400,0), (400,150)],                # H5 (5th House - Right Side) - flipped
        [(200,0), (300,75), (400,0)],                  # H6 (6th House - Top Right) - flipped
        [(100,75), (200,0), (300,75), (200,150)],      # H7 (7th House - Center Diamond) - flipped
        [(0,0), (100,75), (200,0)],                    # H8 (8th House - Top Left) - flipped
        [(0,0), (0,150), (100,75)],                    # H9 (9th House - Left Side) - flipped
        [(0,150), (100,225), (200,150), (100,75)],     # H10 (10th House - Top Left) - flipped
        [(0,150), (0,300), (100,225)],                 # H11 (11th House - Bottom Left Corner) - flipped
        [(0,300), (100,225), (200,300)],               # H12 (12th House - Bottom Center Left) - flipped
    ]
    
    # House center coordinates for planet placement - 180 degree flipped
    house_centers = [
        (200, 225),  # 1st house (bottom center) - flipped
        (300, 275),  # 2nd house (bottom center right) - flipped
        (366, 225),  # 3rd house (bottom right corner) - flipped
        (300, 150),  # 4th house (bottom right) - flipped
        (333, 75),   # 5th house (right side) - flipped
        (300, 25),   # 6th house (top right) - flipped
        (200, 75),   # 7th house (center diamond) - flipped
        (100, 25),   # 8th house (top left) - flipped
        (33, 75),    # 9th house (left side) - flipped
        (100, 150),  # 10th house (top left) - flipped
        (66, 225),   # 11th house (bottom left corner) - flipped
        (100, 275)   # 12th house (bottom center left) - flipped
    ]
    
    # House number positions for display - 180 degree flipped
    house_number_positions = [
        (195, 200),  # 1st house number (bottom center) - flipped
        (285, 290),  # 2nd house number (bottom center right) - flipped
        (350, 235),  # 3rd house number (bottom right corner) - flipped
        (285, 160),  # 4th house number (bottom right) - flipped
        (350, 85),   # 5th house number (right side) - flipped
        (285, 35),   # 6th house number (top right) - flipped
        (185, 85),   # 7th house number (center diamond) - flipped
        (85, 35),    # 8th house number (top left) - flipped
        (15, 85),    # 9th house number (left side) - flipped
        (85, 160),   # 10th house number (top left) - flipped
        (25, 235),   # 11th house number (bottom left corner) - flipped
        (67, 290)    # 12th house number (bottom center left) - flipped
    ]
    
    # Planet symbols and colors
    planet_info = {
        'Sun': {'symbol': '☉', 'color': '#FFD700'},
        'Moon': {'symbol': '☽', 'color': '#C0C0C0'},
        'Mars': {'symbol': '♂', 'color': '#FF0000'},
        'Mercury': {'symbol': '☿', 'color': '#008000'},
        'Jupiter': {'symbol': '♃', 'color': '#0000FF'},
        'Venus': {'symbol': '♀', 'color': '#FFFFFF'},
        'Saturn': {'symbol': '♄', 'color': '#000000'},
        'Rahu': {'symbol': '☊', 'color': '#708090'},
        'Ketu': {'symbol': '☋', 'color': '#A52A2A'}
    }
    
    # Start building SVG
    svg_content = '''<svg width="400" height="320" viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="houseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:white;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f0f3bf;stop-opacity:1" />
        </linearGradient>
      </defs>
    '''
    
    # Draw house polygons
    for i, polygon in enumerate(house_polygons):
        points_str = ' '.join([f"{p[0]},{p[1]}" for p in polygon])
        svg_content += f'''
          <polygon points="{points_str}" 
                   fill="url(#houseGradient)" 
                   stroke="#333" 
                   stroke-width="1"/>
        '''
    
    # Add house numbers
    for i, house_num in enumerate(house_numbers):
        pos = house_number_positions[i]
        svg_content += f'''
          <text x="{pos[0]}" y="{pos[1]}" 
                font-size="12" 
                fill="teal" 
                text-anchor="middle">{house_num}</text>
        '''
    
    # Extract planet positions from jyotishyam data
    planets_in_houses = {}
    
    # Try to get planet positions from various jyotishyam data structures
    if hasattr(jyotishyam_data, 'D1') and jyotishyam_data.D1:
        # If D1 chart data is available
        d1_data = jyotishyam_data.D1
        for house_num in range(1, 13):
            if str(house_num) in d1_data:
                planets_in_houses[house_num] = d1_data[str(house_num)]
    
    elif hasattr(jyotishyam_data, 'lagna_ascendant'):
        # If we have lagna data, place it in 1st house
        planets_in_houses[1] = ['Asc']
    
    # If we have any planets data, distribute them
    if planets_in_houses:
        for house_num, planets in planets_in_houses.items():
            if planets and house_num <= 12:
                house_index = house_num - 1  # Convert to 0-based index
                center = house_centers[house_index]
                radius = 15
                
                for planet_index, planet in enumerate(planets):
                    # Calculate position for multiple planets in same house
                    angle = (2 * 3.14159 * planet_index) / len(planets)
                    x = center[0] + radius * math.cos(angle)
                    y = center[1] + radius * math.sin(angle)
                    
                    # Get planet info
                    planet_data = planet_info.get(planet, {'symbol': planet[:2], 'color': '#000000'})
                    
                    svg_content += f'''
                      <text x="{x}" y="{y}" 
                            font-size="11" 
                            fill="{planet_data['color']}" 
                            text-anchor="middle">{planet_data['symbol']}</text>
                    '''
    
    # Add birth details
    if birth_data:
        svg_content += f'''
          <text x="200" y="315" 
                font-size="10" 
                fill="#333" 
                text-anchor="middle">
            {birth_data.get('name', 'Birth Chart')}
          </text>
        '''
    
    svg_content += '</svg>'
    
    return svg_content

if __name__ == "__main__":
    try:
        if len(sys.argv) > 1:
            input_data = json.loads(sys.argv[1])
        else:
            # Default test data
            input_data = {
                "name": "Test Person",
                "date": "1980-09-09",
                "time": "19:15:00",
                "latitude": 13.0827,
                "longitude": 80.2707,
                "place": "Chennai, India"
            }
        
        result = test_jyotishyam(input_data)
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e),
            "message": "Script execution error"
        }))