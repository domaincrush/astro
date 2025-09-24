#!/usr/bin/env python3
"""
Test script to verify Jyotisha integration with Premium Report Engine
"""

import json
from premium_report_engine import PremiumReportEngine

def test_jyotisha_integration():
    """Test the Jyotisha integration in Premium Report Engine"""
    
    # Test birth details
    birth_details = {
        "name": "Test User",
        "date": "1990-06-15",
        "time": "10:30",
        "place": "Chennai, Tamil Nadu, India",
        "latitude": 13.0827,
        "longitude": 80.2707
    }
    
    print("🔧 Testing Jyotisha Integration with Premium Report Engine")
    print(f"Birth Details: {json.dumps(birth_details, indent=2)}")
    print("-" * 60)
    
    # Create report engine
    engine = PremiumReportEngine()
    
    # Test Jyotisha data retrieval
    print("\n1. Testing Jyotisha data retrieval...")
    jyotisha_data = engine.get_jyotisha_data(birth_details)
    
    if jyotisha_data:
        print("✅ Jyotisha engine connection successful!")
        print(f"Planets found: {len(jyotisha_data.get('planets', []))}")
        if jyotisha_data.get('ascendant'):
            print(f"Ascendant: {jyotisha_data['ascendant']['sign']}")
    else:
        print("⚠️  Jyotisha engine not available, falling back to Swiss Ephemeris/Manual")
    
    # Test planetary positions calculation
    print("\n2. Testing planetary positions calculation...")
    positions = engine.calculate_planetary_positions(birth_details)
    
    print(f"Planets calculated: {len(positions)}")
    for planet, data in positions.items():
        print(f"  {planet}: {data['sign']} {data['degree']:.1f}° (House {data['house']})")
    
    # Test calculation method detection
    print(f"\n3. Calculation method: {engine.get_calculation_method()}")
    
    # Test full report generation
    print("\n4. Testing complete report generation...")
    report = engine.generate_complete_report(birth_details)
    
    if 'error' in report:
        print(f"❌ Report generation failed: {report['error']}")
    else:
        print("✅ Report generation successful!")
        print(f"Method used: {report['report_metadata']['calculation_method']}")
        print(f"Yogas found: {len(report.get('yogas', []))}")
        print(f"Doshas found: {len(report.get('doshas', []))}")
        
        # Show sample planetary positions
        if report.get('chart_data', {}).get('planetary_positions'):
            print("\nSample planetary positions:")
            for planet, data in list(report['chart_data']['planetary_positions'].items())[:3]:
                print(f"  {planet}: {data.get('sign', 'N/A')} {data.get('degree', 0):.1f}°")

if __name__ == "__main__":
    test_jyotisha_integration()