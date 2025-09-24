import React from 'react';
import { useLocation } from 'wouter';
import AstroTickHeader from 'src/components/layout/AstroTickHeader';
import { Card, CardContent } from 'src/components/ui/card';
import { Badge } from 'src/components/ui/badge';
import { Separator } from 'src/components/ui/separator';
import { Button } from 'src/components/ui/button';
import { ArrowLeft, Download, Share2, Moon, Sun, Star } from 'lucide-react';
import PanchangDropdown from 'src/components/astrology/PanchangDropdown';

interface BirthChartData {
  basicInfo: {
    name: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    moonSign: string;
    ascendant: {
      longitude: number;
      sign: string;
    };
    sunSign: string;
    nakshatra: string;
  };
  planets: Array<{
    name: string;
    longitude: number;
    sign: string;
    degree: string;
    nakshatra: string;
    nakshatraLord: string;
    house: number;
    retrograde: boolean;
  }>;
  dasha: {
    current: {
      lord: string;
      start_date: string;
      end_date: string;
      duration_years: number;
      status: string;
    };
    sequence: Array<{
      lord: string;
      start_date: string;
      end_date: string;
      duration_years: number;
      status: string;
    }>;
    sub_periods: {
      current_antardasha: {
        lord: string;
        start_date: string;
        end_date: string;
        duration_years: number;
        status: string;
      };
      pratyantardashas: Array<{
        lord: string;
        start_date: string;
        end_date: string;
        duration_days: number;
        status: string;
      }>;
    };
    moonNakshatra: {
      name: string;
      lord: string;
      number: number;
      pada: number;
    };
  };
  predictions: {
    general: string;
    career: string;
    marriage: string;
    health: string;
    finance: string;
  };
}

export default function BrihatKundliResults() {
  const [location, navigate] = useLocation();
  
  // Get data from URL state or localStorage
  const urlParams = new URLSearchParams(location.split('?')[1]);
  const dataParam = urlParams.get('data');
  
  let chartData: BirthChartData | null = null;
  
  if (dataParam) {
    try {
      chartData = JSON.parse(decodeURIComponent(dataParam));
    } catch (error) {
      console.error('Failed to parse chart data:', error);
    }
  }
  
  if (!chartData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <AstroTickHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Chart Data Found</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please generate a birth chart first to view the results.
            </p>
            <Button onClick={() => navigate('/brihat-kundli')} className="bg-purple-600 hover:bg-purple-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Generate New Chart
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getCurrentPratyantardasha = () => {
    return chartData?.dasha.sub_periods.pratyantardashas.find(p => p.status === 'current');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <AstroTickHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/brihat-kundli')}
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Generator
          </Button>
          
          <div className="flex gap-2 items-center">
            <PanchangDropdown />
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Brihat Kundli Report
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Complete Vedic Astrology Analysis for {chartData.basicInfo.name}
          </p>
        </div>

        {/* Basic Information */}
        <Card className="mb-6 border-purple-200 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Sun className="mr-2 h-5 w-5 text-yellow-500" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="font-medium text-gray-900 dark:text-white">{chartData.basicInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Birth Date</p>
                <p className="font-medium text-gray-900 dark:text-white">{chartData.basicInfo.birthDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Birth Time</p>
                <p className="font-medium text-gray-900 dark:text-white">{chartData.basicInfo.birthTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Birth Place</p>
                <p className="font-medium text-gray-900 dark:text-white">{chartData.basicInfo.birthPlace}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ascendant (Lagna)</p>
                <p className="font-medium text-gray-900 dark:text-white">{chartData.basicInfo.ascendant.sign}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Moon Sign (Rashi)</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {chartData.planets.find(p => p.name === 'Moon')?.sign || 'Unknown'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Planetary Positions */}
        <Card className="mb-6 border-purple-200 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Star className="mr-2 h-5 w-5 text-blue-500" />
              Planetary Positions
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-white">Planet</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-white">Sign</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-white">Degree</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-white">Nakshatra</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-white">Lord</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-white">House</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-white">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.planets.map((planet, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-2 px-3 font-medium text-gray-900 dark:text-white">{planet.name}</td>
                      <td className="py-2 px-3 text-gray-700 dark:text-gray-300">{planet.sign}</td>
                      <td className="py-2 px-3 text-gray-700 dark:text-gray-300">{planet.degree}</td>
                      <td className="py-2 px-3 text-gray-700 dark:text-gray-300">{planet.nakshatra}</td>
                      <td className="py-2 px-3 text-gray-700 dark:text-gray-300">{planet.nakshatraLord}</td>
                      <td className="py-2 px-3 text-gray-700 dark:text-gray-300">{planet.house}</td>
                      <td className="py-2 px-3">
                        {planet.retrograde ? (
                          <Badge variant="destructive" className="text-xs">Retrograde</Badge>
                        ) : (
                          <Badge variant="default" className="text-xs bg-green-100 text-green-800">Direct</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Dasha Analysis */}
        <Card className="mb-6 border-purple-200 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Moon className="mr-2 h-5 w-5 text-purple-500" />
              Dasha Analysis
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Dasha */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Current Mahadasha</h3>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-medium text-purple-800 dark:text-purple-300">
                      {chartData.dasha.current.lord} Dasha
                    </span>
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100">
                      {chartData.dasha.current.duration_years} years
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(chartData.dasha.current.start_date)} - {formatDate(chartData.dasha.current.end_date)}
                  </p>
                </div>
              </div>

              {/* Current Antardasha */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Current Antardasha</h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-medium text-blue-800 dark:text-blue-300">
                      {chartData.dasha.sub_periods.current_antardasha.lord} Antardasha
                    </span>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                      {chartData.dasha.sub_periods.current_antardasha.duration_years} years
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(chartData.dasha.sub_periods.current_antardasha.start_date)} - 
                    {formatDate(chartData.dasha.sub_periods.current_antardasha.end_date)}
                  </p>
                </div>
              </div>

              {/* Current Pratyantardasha */}
              {getCurrentPratyantardasha() && (
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Current Pratyantardasha</h3>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-medium text-green-800 dark:text-green-300">
                        {getCurrentPratyantardasha()?.lord} Pratyantardasha
                      </span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                        {getCurrentPratyantardasha()?.duration_days} days
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(getCurrentPratyantardasha()?.start_date || '')} - 
                      {formatDate(getCurrentPratyantardasha()?.end_date || '')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Moon Nakshatra */}
            <Separator className="my-4" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Birth Nakshatra</h3>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-medium text-yellow-800 dark:text-yellow-300">
                      {chartData.dasha.moonNakshatra.name}
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Nakshatra Lord: {chartData.dasha.moonNakshatra.lord} | 
                      Number: {chartData.dasha.moonNakshatra.number} | 
                      Pada: {chartData.dasha.moonNakshatra.pada}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Predictions */}
        <Card className="mb-6 border-purple-200 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Astrological Predictions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">General</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{chartData.predictions.general}</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Career</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{chartData.predictions.career}</p>
              </div>
              
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-2">Marriage</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{chartData.predictions.marriage}</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">Health</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{chartData.predictions.health}</p>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 md:col-span-2">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Finance</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{chartData.predictions.finance}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          <p>Generated by AstroTick - Professional Vedic Astrology Platform</p>
          <p>For consultations and detailed analysis, visit our astrologer section</p>
        </div>
      </div>
    </div>
  );
}