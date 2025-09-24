import React from 'react';
import { Card, CardContent } from 'src/components/ui/card';
import { Badge } from 'src/components/ui/badge';
import { Star, Lightbulb, Shield, Heart, Gem, BookOpen } from 'lucide-react';

interface SidebarCalloutsProps {
  reportData: any;
}

export const SidebarCallouts: React.FC<SidebarCalloutsProps> = ({ reportData }) => {
  const getKeyInsights = () => {
    // Use authentic data from ashtakavarga_highlights and unified_dasha_system
    const dashaData = reportData.unified_dasha_system || {};
    const currentDashaItem = dashaData.comprehensive_timeline?.find(item => item.status === 'current');
    const currentDasha = currentDashaItem?.lord || dashaData.current_analysis?.mahadasha?.lord || 'Unknown';
    
    // Use authentic ashtakavarga data
    const ashtakavarga = reportData.ashtakavarga_highlights || {};
    const houseStrengths = ashtakavarga.house_strengths || {};
    const totalBindus = Object.values(houseStrengths).reduce((sum: number, bindus: any) => sum + (bindus || 0), 0);
    const careerScore = Math.round((houseStrengths['10'] || 0) / 35 * 100);
    
    const insights = [
      {
        icon: Star,
        title: "Growth Period Active",
        text: `Your ${currentDasha} Mahadasha (current period) is ideal for spiritual and professional growth. This is your prime opportunity window.`,
        color: "bg-yellow-50 border-yellow-200 text-yellow-800"
      },
      {
        icon: Lightbulb,
        title: "Strength Assessment",
        text: `With ${totalBindus} total Ashtakavarga bindus, you have ${totalBindus >= 350 ? 'excellent' : totalBindus >= 300 ? 'good' : 'moderate'} planetary support across all life areas.`,
        color: "bg-blue-50 border-blue-200 text-blue-800"
      },
      {
        icon: Heart,
        title: "Career Potential",
        text: `Your 10th house shows ${careerScore}% strength, indicating ${careerScore >= 75 ? 'excellent' : careerScore >= 50 ? 'good' : 'developing'} career prospects with focused effort.`,
        color: "bg-green-50 border-green-200 text-green-800"
      }
    ];

    return insights;
  };

  const getRemedySnapshots = () => {
    // Use authentic current dasha data
    const dashaData = reportData.unified_dasha_system || {};
    const currentDashaItem = dashaData.comprehensive_timeline?.find(item => item.status === 'current');
    const currentDasha = currentDashaItem?.lord || dashaData.current_analysis?.mahadasha?.lord || 'Jupiter';
    const ascendantSign = reportData.ascendant_sign || 'Unknown';
    
    const remedyMappings = {
      'Jupiter': {
        mantra: 'Om Brihaspataye Namaha',
        gemstone: 'Yellow Sapphire',
        charity: 'Donate to educational institutions',
        color: 'bg-yellow-50 border-yellow-200'
      },
      'Sun': {
        mantra: 'Om Suryaya Namaha',
        gemstone: 'Ruby',
        charity: 'Feed the needy on Sundays',
        color: 'bg-orange-50 border-orange-200'
      },
      'Moon': {
        mantra: 'Om Chandraya Namaha',
        gemstone: 'Pearl',
        charity: 'Help mothers and children',
        color: 'bg-blue-50 border-blue-200'
      },
      'Mars': {
        mantra: 'Om Angarakaya Namaha',
        gemstone: 'Red Coral',
        charity: 'Support military families',
        color: 'bg-red-50 border-red-200'
      },
      'Mercury': {
        mantra: 'Om Budhaya Namaha',
        gemstone: 'Emerald',
        charity: 'Support students and education',
        color: 'bg-green-50 border-green-200'
      },
      'Venus': {
        mantra: 'Om Shukraya Namaha',
        gemstone: 'Diamond',
        charity: 'Support arts and culture',
        color: 'bg-pink-50 border-pink-200'
      },
      'Saturn': {
        mantra: 'Om Shanaye Namaha',
        gemstone: 'Blue Sapphire',
        charity: 'Help the elderly and disabled',
        color: 'bg-purple-50 border-purple-200'
      },
      'Rahu': {
        mantra: 'Om Rahave Namaha',
        gemstone: 'Hessonite Garnet',
        charity: 'Feed street animals',
        color: 'bg-gray-50 border-gray-200'
      },
      'Ketu': {
        mantra: 'Om Ketave Namaha',
        gemstone: 'Cat\'s Eye',
        charity: 'Support spiritual causes',
        color: 'bg-indigo-50 border-indigo-200'
      }
    };

    return remedyMappings[currentDasha] || remedyMappings['Sun'];
  };

  const getModuleSpecificInsights = () => {
    // Get current dasha for dynamic insights
    const dashaData = reportData.unified_dasha_system || {};
    const currentDashaItem = dashaData.comprehensive_timeline?.find(item => item.status === 'current');
    const currentDasha = currentDashaItem?.lord || dashaData.current_analysis?.mahadasha?.lord || 'Unknown';
    
    const insights = [
      {
        module: "Timing Analysis",
        icon: BookOpen,
        insight: "Your current dasha period supports long-term planning and educational pursuits. Ideal time for skill development.",
        color: "bg-purple-50 border-purple-200 text-purple-800"
      },
      {
        module: "Strength Analysis", 
        icon: Shield,
        insight: `${currentDasha}'s position in your chart provides natural support and guidance. Your inherent qualities are key strengths.`,
        color: "bg-blue-50 border-blue-200 text-blue-800"
      },
      {
        module: "Career Guidance",
        icon: Gem,
        insight: "Professional roles aligned with your planetary influences would maximize your natural abilities during this period.",
        color: "bg-green-50 border-green-200 text-green-800"
      }
    ];

    return insights;
  };

  const keyInsights = getKeyInsights();
  const remedySnapshot = getRemedySnapshots();
  const moduleInsights = getModuleSpecificInsights();

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Key Insights</h3>
        {keyInsights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <Card key={index} className={`${insight.color} border-l-4`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-white/50 rounded-full">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">🌟 {insight.title}</h4>
                    <p className="text-sm leading-relaxed">{insight.text}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Remedy Snapshot */}
      <Card className={`${remedySnapshot.color} border-l-4`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-white/50 rounded-full">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold mb-3">🛡️ Current Period Remedies</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">🕉️ Mantra:</span>
                  <Badge variant="outline" className="text-xs">
                    {remedySnapshot.mantra}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">💎 Gemstone:</span>
                  <Badge variant="outline" className="text-xs">
                    {remedySnapshot.gemstone}
                  </Badge>
                </div>
                <div className="text-sm">
                  <span className="font-medium">🙏 Charity:</span> {remedySnapshot.charity}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module-Specific Insights */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Module Insights</h3>
        {moduleInsights.map((module, index) => {
          const Icon = module.icon;
          return (
            <Card key={index} className={`${module.color} border-l-4`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-white/50 rounded-full">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{module.module}</h4>
                    <p className="text-sm leading-relaxed">{module.insight}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Action Items */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-white/50 rounded-full">
              <Lightbulb className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-orange-800">Quick Action Items</h4>
              <ul className="text-sm space-y-1 text-orange-700">
                <li>• Begin daily Jupiter mantra practice</li>
                <li>• Plan major decisions for Thursday</li>
                <li>• Focus on educational pursuits</li>
                <li>• Strengthen spiritual practices</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};