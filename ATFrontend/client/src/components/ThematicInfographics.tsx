import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'src/components/ui/card';
import { Badge } from 'src/components/ui/badge';
import { Progress } from 'src/components/ui/progress';
import { ArrowRight, Briefcase, GraduationCap, Heart, TrendingUp, Target, Clock } from 'lucide-react';

interface ThematicInfographicsProps {
  reportData: any;
}

export const ThematicInfographics: React.FC<ThematicInfographicsProps> = ({ reportData }) => {
  const getCareerPathData = () => {
    // Extract career data from enhanced career analysis
    const careerAnalysis = reportData.enhanced_career_analysis || {};
    const careerOverview = careerAnalysis.career_overview || {};
    const idealDomains = careerAnalysis.ideal_career_domains || {};
    const careerStrengths = careerAnalysis.career_strengths || {};
    
    // Get 10th house sign from chart data or ascendant calculation
    const tenthHouseSign = reportData.chart_data?.houses?.[9]?.sign || 
                           reportData.ascendant_sign || 'Meena';
    
    // Use actual career analysis data or calculate from 10th house
    const careerPaths = {
      'Mesha': ['Engineering', 'Military', 'Sports', 'Surgery'],
      'Vrishabha': ['Finance', 'Arts', 'Agriculture', 'Luxury goods'],
      'Mithuna': ['Communication', 'Media', 'Sales', 'Technology'],
      'Karka': ['Healthcare', 'Hospitality', 'Real estate', 'Catering'],
      'Simha': ['Leadership', 'Politics', 'Entertainment', 'Government'],
      'Kanya': ['Analysis', 'Health', 'Service', 'Research'],
      'Tula': ['Law', 'Diplomacy', 'Arts', 'Fashion'],
      'Vrishchika': ['Investigation', 'Research', 'Surgery', 'Occult'],
      'Dhanu': ['Education', 'Publishing', 'Law', 'Philosophy'],
      'Makara': ['Administration', 'Management', 'Mining', 'Construction'],
      'Kumbha': ['Technology', 'Social work', 'Innovation', 'Networking'],
      'Meena': ['Spirituality', 'Arts', 'Healing', 'Service']
    };

    // Extract primary fields from actual analysis or use sign-based fallback
    let primaryFields = idealDomains.primary_fields || careerPaths[tenthHouseSign] || ['Professional Services'];
    
    // Get career strength from analysis
    const strengthLevel = careerStrengths.overall_strength_level || 'Moderate';
    
    // Get timing information from career timeline
    const careerTimeline = careerAnalysis.career_timeline || {};
    const optimalPeriods = careerTimeline.peak_period || 'Next 2-3 years';
    
    // Get key planet from dasha analysis
    const dashaData = reportData.unified_dasha_system || {};
    const keyPlanet = dashaData.current_lord || 'Jupiter';

    return {
      tenthHouseSign,
      primaryFields: Array.isArray(primaryFields) ? primaryFields : [primaryFields],
      currentStrength: strengthLevel,
      optimalTiming: Array.isArray(optimalPeriods) ? optimalPeriods : [optimalPeriods],
      keyPlanet: keyPlanet
    };
  };

  const getLifePhaseData = () => {
    const birthYear = parseInt(reportData.birth_details?.date?.split('-')[0] || '1990');
    const currentYear = new Date().getFullYear();
    const currentAge = currentYear - birthYear;
    
    const phases = [
      {
        name: 'Foundation Phase',
        ageRange: '0-30',
        period: `${birthYear}-${birthYear + 30}`,
        status: currentAge > 30 ? 'Completed' : 'Current',
        focus: 'Education, Skills, Early Career',
        icon: GraduationCap,
        color: 'bg-blue-500'
      },
      {
        name: 'Growth Phase',
        ageRange: '30-60',
        period: `${birthYear + 30}-${birthYear + 60}`,
        status: currentAge > 60 ? 'Completed' : currentAge > 30 ? 'Current' : 'Upcoming',
        focus: 'Career Peak, Family, Wealth Building',
        icon: TrendingUp,
        color: 'bg-green-500'
      },
      {
        name: 'Fulfillment Phase',
        ageRange: '60+',
        period: `${birthYear + 60}+`,
        status: currentAge > 60 ? 'Current' : 'Upcoming',
        focus: 'Wisdom, Service, Spiritual Growth',
        icon: Heart,
        color: 'bg-purple-500'
      }
    ];

    return { phases, currentAge };
  };

  const careerPath = getCareerPathData();
  const { phases, currentAge } = getLifePhaseData();

  return (
    <div className="space-y-8">
      {/* Career Path Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5" />
            <span>Career Path Flow Diagram</span>
          </CardTitle>
          <CardDescription>
            Your astrological career guidance from 10th house analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Flow diagram */}
            <div className="flex items-center justify-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  10th House
                </div>
                <div className="mt-2 text-sm font-medium">{careerPath.tenthHouseSign}</div>
                <div className="text-xs text-gray-600">Career Foundation</div>
              </div>
              
              <ArrowRight className="w-6 h-6 text-gray-400" />
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  D10
                </div>
                <div className="mt-2 text-sm font-medium">Dasamsa</div>
                <div className="text-xs text-gray-600">Career Details</div>
              </div>
              
              <ArrowRight className="w-6 h-6 text-gray-400" />
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  Fields
                </div>
                <div className="mt-2 text-sm font-medium">Best Match</div>
                <div className="text-xs text-gray-600">Optimal Choices</div>
              </div>
            </div>

            {/* Career fields grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {careerPath.primaryFields.map((field, index) => (
                <div key={field} className="p-4 bg-white border rounded-lg text-center hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-2">
                    {index === 0 ? '🎯' : index === 1 ? '⭐' : index === 2 ? '💼' : '🚀'}
                  </div>
                  <div className="font-medium text-sm">{field}</div>
                  <Badge 
                    variant="outline" 
                    className={`mt-2 text-xs ${index === 0 ? 'border-green-500 text-green-600' : 'border-gray-400'}`}
                  >
                    {index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Alternative'}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Career strength indicator */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Career Strength</span>
                <Badge variant="outline">{careerPath.currentStrength}</Badge>
              </div>
              <div className="text-sm text-gray-600">
                Best periods: {careerPath.optimalTiming.join(', ')} | Key planet: {careerPath.keyPlanet}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Life-Phase Milestone Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Life Phase Milestone Chart</span>
          </CardTitle>
          <CardDescription>
            Your three major life phases with current position (Age: {currentAge})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Horizontal timeline */}
            <div className="relative pb-32">
              <div className="flex items-center justify-between h-4 bg-gray-100 rounded-full">
                {phases.map((phase, index) => {
                  const Icon = phase.icon;
                  return (
                    <div key={phase.name} className="relative flex-1">
                      <div className={`h-4 rounded-full ${phase.color} ${phase.status === 'Current' ? 'animate-pulse' : ''}`}></div>
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center min-w-max">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${phase.color} text-white`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="text-sm font-medium mb-1">{phase.name}</div>
                        <div className="text-xs text-gray-600 mb-1">{phase.ageRange}</div>
                        <div className="text-xs text-gray-500 mb-2">{phase.period}</div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            phase.status === 'Current' ? 'border-blue-500 text-blue-600' : 
                            phase.status === 'Completed' ? 'border-green-500 text-green-600' : 
                            'border-gray-400'
                          }`}
                        >
                          {phase.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Current age indicator */}
              <div 
                className="absolute top-0 h-4 w-1 bg-red-500 rounded"
                style={{ left: `${Math.min((currentAge / 80) * 100, 100)}%` }}
              >
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                    Age {currentAge}
                  </div>
                </div>
              </div>
            </div>

            {/* Phase details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {phases.map((phase) => {
                const Icon = phase.icon;
                return (
                  <div key={phase.name} className={`p-4 rounded-lg border-2 ${phase.status === 'Current' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                    <div className="flex items-center space-x-2 mb-3">
                      <Icon className={`w-5 h-5 ${phase.status === 'Current' ? 'text-blue-600' : 'text-gray-600'}`} />
                      <h3 className="font-medium">{phase.name}</h3>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{phase.focus}</div>
                    <div className="text-xs text-gray-500">{phase.period}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spiritual Growth Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Spiritual Evolution Path</span>
          </CardTitle>
          <CardDescription>
            Your spiritual development milestones and growth opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current spiritual phase */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
              <h3 className="font-medium mb-2">Current Spiritual Phase</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">🧘</div>
                  <div className="text-sm font-medium">Meditation & Reflection</div>
                  <div className="text-xs text-gray-600">Current focus area</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">📚</div>
                  <div className="text-sm font-medium">Wisdom Study</div>
                  <div className="text-xs text-gray-600">Jupiter influence</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🙏</div>
                  <div className="text-sm font-medium">Service & Charity</div>
                  <div className="text-xs text-gray-600">Dharmic path</div>
                </div>
              </div>
            </div>

            {/* Spiritual milestones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Past Achievements</h4>
                <ul className="text-sm space-y-1">
                  <li>✅ Spiritual awakening period</li>
                  <li>✅ Initial wisdom seeking</li>
                  <li>✅ Karmic understanding</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Future Opportunities</h4>
                <ul className="text-sm space-y-1">
                  <li>🔮 Advanced spiritual practices</li>
                  <li>🔮 Teaching and guidance role</li>
                  <li>🔮 Spiritual leadership</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};