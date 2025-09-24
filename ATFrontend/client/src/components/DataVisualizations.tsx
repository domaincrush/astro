import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'src/components/ui/card';
import { Badge } from 'src/components/ui/badge';
import { Progress } from 'src/components/ui/progress';

interface DataVisualizationsProps {
  reportData: any;
}

export const DataVisualizations: React.FC<DataVisualizationsProps> = ({ reportData }) => {
  const getDashaTimeline = () => {
    const dashaData = reportData.unified_dasha_system || {};
    
    // Get authentic timeline data from comprehensive_timeline
    const authenticeTimeline = dashaData.comprehensive_timeline || [];
    
    console.log('DEBUG: Authentic timeline found:', authenticeTimeline.length > 0 ? 'YES' : 'NO');
    
    // If we have authentic timeline data, use it
    if (authenticeTimeline.length > 0) {
      const planetColors = {
        'Venus': 'bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500',
        'Sun': 'bg-gradient-to-br from-orange-400 via-amber-400 to-orange-500',
        'Moon': 'bg-gradient-to-br from-blue-400 via-sky-400 to-blue-500',
        'Mars': 'bg-gradient-to-br from-red-400 via-rose-500 to-red-600',
        'Rahu': 'bg-gradient-to-br from-gray-500 via-slate-500 to-gray-600',
        'Jupiter': 'bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500',
        'Saturn': 'bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600',
        'Mercury': 'bg-gradient-to-br from-green-400 via-emerald-400 to-green-500',
        'Ketu': 'bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700'
      };
      
      // Extract duration from period string (e.g., "Venus Mahadasha (2024-01-04 - 2044-01-04)")
      const extractDuration = (period: any) => {
        if (!period || period === 'N/A') return 20;
        const matches = period.match(/\((\d{4})-\d{2}-\d{2} - (\d{4})-\d{2}-\d{2}\)/);
        return matches ? parseInt(matches[2]) - parseInt(matches[1]) : 20;
      };
      
      // Format period display to remove N/A values
      const formatPeriod = (period: any) => {
        if (!period || period === 'N/A') return '';
        return period;
      };
      
      return authenticeTimeline.map((item: any, index: number) => ({
        planet: item.lord || 'Unknown',
        duration: extractDuration(item.period),
        color: (planetColors as any)[item.lord] || 'bg-gray-200',
        isCurrent: item.status === 'current',
        position: index,
        period: formatPeriod(item.period),
        effects: item.effects || 'Analyzing planetary influences...'
      }));
    }
    
    // Fallback: Find current dasha from current_analysis
    const currentDasha = dashaData.current_analysis?.mahadasha?.lord || 'Unknown';
    console.log('DEBUG: Using fallback with current dasha:', currentDasha);
    
    // Fallback to standard sequence if no authentic data
    const standardSequence = [
      { planet: 'Venus', duration: 20, color: 'bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500' },
      { planet: 'Sun', duration: 6, color: 'bg-gradient-to-br from-orange-400 via-amber-400 to-orange-500' },
      { planet: 'Moon', duration: 10, color: 'bg-gradient-to-br from-blue-400 via-sky-400 to-blue-500' },
      { planet: 'Mars', duration: 7, color: 'bg-gradient-to-br from-red-400 via-rose-500 to-red-600' },
      { planet: 'Rahu', duration: 18, color: 'bg-gradient-to-br from-gray-500 via-slate-500 to-gray-600' },
      { planet: 'Jupiter', duration: 16, color: 'bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500' },
      { planet: 'Saturn', duration: 19, color: 'bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600' },
      { planet: 'Mercury', duration: 17, color: 'bg-gradient-to-br from-green-400 via-emerald-400 to-green-500' },
      { planet: 'Ketu', duration: 7, color: 'bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700' }
    ];

    return standardSequence.map((item, index) => ({
      ...item,
      isCurrent: item.planet === currentDasha,
      position: index,
      period: 'N/A',
      effects: `${item.planet} period influences your life journey...`
    }));
  };

  const getAshtakavargaGrid = () => {
    // Use the same correct data source as House Strengths Bar Chart
    const houseStrengths = reportData.ashtakavarga_highlights?.house_strengths || {};
    
    if (Object.keys(houseStrengths).length > 0) {
      return Object.entries(houseStrengths).map(([house, bindus]: [string, any]) => ({
        house: parseInt(house),
        totalBindus: Number(bindus),
        strength: Number(bindus) >= 30 ? 'Strong' : Number(bindus) >= 20 ? 'Moderate' : 'Weak'
      }));
    }
    
    // If no data available, return empty array (don't use fallback hardcoded data)
    return [];
  };

  const getPlanetaryRadarData = () => {
    const planetaryData = reportData.planetary_strengths || {};
    
    const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    
    return planets.map(planet => ({
      planet,
      overall: Math.floor(Math.random() * 40) + 60,
      shadbala: Math.floor(Math.random() * 40) + 60,
      ashtakavarga: Math.floor(Math.random() * 40) + 60
    }));
  };

  const dashaTimeline = getDashaTimeline();
  const ashtakavargaGrid = getAshtakavargaGrid();
  const planetaryRadar = getPlanetaryRadarData();

  // Get top 3 and bottom 3 houses
  const sortedHouses = [...ashtakavargaGrid].sort((a, b) => b.totalBindus - a.totalBindus);
  const top3Houses = sortedHouses.slice(0, 3);
  const bottom3Houses = sortedHouses.slice(-3);

  return (
    <div className="space-y-8">

    </div>
  );
};