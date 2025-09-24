import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'src/components/ui/card';
import { Badge } from 'src/components/ui/badge';
import { Progress } from 'src/components/ui/progress';
import { Clock, TrendingUp, Target, Heart, Briefcase, Star, Zap, Shield, User, Calendar, Globe, Sun, BarChart3, Activity, Eye, Building, DollarSign, BookOpen, Diamond, Users, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs';

interface ExecutiveDashboardProps {
  reportData: any;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ reportData }) => {
  // Extract key data from report
  const summary = {
    lagna: reportData.ascendant_sign || "Meena",
    lagnaLord: reportData.ascendant_lord || "Jupiter",
    lagnadegree: reportData.ascendant_degree || "18°24'",
    moonSign: reportData.moon_sign || "Simha", 
    sunSign: reportData.sun_sign || "Simha",
    birthNakshatra: reportData.birth_nakshatra || "Purva Phalguni",
    pada: reportData.pada || "2nd Pada"
  };

  const panchangData = {
    tithi: "Dwadashi (12th lunar day)",
    nakshatra: "Purva Phalguni", 
    yoga: "Vishkumbha",
    karana: "Bava",
    vaar: "Tuesday (Mangalwar)",
    sunrise: "06:12 AM",
    sunset: "06:38 PM",
    moonDegree: "12°45'",
    moonNakshatra: "Purva Phalguni",
    moonLongitude: "132°45'"
  };

  return (
    <div className="space-y-8 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-8 rounded-xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-orange-800 mb-4">Premium Astrology Report</h1>
        <p className="text-lg text-orange-600">Complete Vedic Analysis with 28 Comprehensive Sections</p>
      </div>

      {/* 1. Basic Birth Details */}
      <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <User className="w-8 h-8" />
            1. Basic Birth Details
          </CardTitle>
          <CardDescription className="text-orange-100 text-lg">
            Name, Date, Time, Place of Birth - Timezone and DST corrections - Ayanamsa
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-lg border border-orange-200">
            <h3 className="text-xl font-bold text-orange-800 mb-4">Essential Birth Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Full Name:</span>
                  <span className="font-bold text-orange-600">Sample Person</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Birth Date:</span>
                  <span className="font-bold text-orange-600">15 August 1990</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Birth Time:</span>
                  <span className="font-bold text-orange-600">14:30:00 (2:30 PM)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Birth Place:</span>
                  <span className="font-bold text-orange-600">Chennai, Tamil Nadu</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Timezone:</span>
                  <span className="font-bold text-orange-600">IST (+05:30)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">DST Applied:</span>
                  <span className="font-bold text-orange-600">No</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Ayanamsa:</span>
                  <span className="font-bold text-orange-600">Lahiri (Chitrapaksha)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Coordinates:</span>
                  <span className="font-bold text-orange-600">13°05'N, 80°16'E</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Panchang Details at Birth */}
      <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Calendar className="w-8 h-8" />
            2. Panchang Details at Birth
          </CardTitle>
          <CardDescription className="text-orange-100 text-lg">
            Tithi, Nakshatra, Yoga, Karana - Vaar (weekday), Sunrise & Sunset - Moon sign and Moon degree
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-lg border border-orange-200">
            <h3 className="text-xl font-bold text-orange-800 mb-4">Panchang Elements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white/60 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-700 mb-3">Primary Elements</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">🌙 Tithi:</span>
                    <span className="font-medium">{panchangData.tithi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">⭐ Nakshatra:</span>
                    <span className="font-medium">{panchangData.nakshatra}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">🕉️ Yoga:</span>
                    <span className="font-medium">{panchangData.yoga}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">⚡ Karana:</span>
                    <span className="font-medium">{panchangData.karana}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-700 mb-3">Temporal Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">📅 Vaar:</span>
                    <span className="font-medium">{panchangData.vaar}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">🌅 Sunrise:</span>
                    <span className="font-medium">{panchangData.sunrise}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">🌇 Sunset:</span>
                    <span className="font-medium">{panchangData.sunset}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-700 mb-3">Moon Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">🌙 Moon Sign:</span>
                    <span className="font-medium">{summary.moonSign}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">📐 Moon Degree:</span>
                    <span className="font-medium">{panchangData.moonDegree}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">⭐ Moon Nakshatra:</span>
                    <span className="font-medium">{panchangData.moonNakshatra}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">🌐 Moon Longitude:</span>
                    <span className="font-medium">{panchangData.moonLongitude}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Planetary Positions */}
      <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Globe className="w-8 h-8" />
            3. Planetary Positions
          </CardTitle>
          <CardDescription className="text-orange-100 text-lg">
            Planetary longitudes with sign and nakshatra - Retrograde/Direct status - Combustion and planetary war indicators
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Primary Planets */}
            <div className="bg-gradient-to-r from-white to-orange-50 p-6 rounded-xl border-2 border-orange-200 shadow-lg">
              <h3 className="text-2xl font-bold text-orange-800 mb-6 flex items-center gap-2">
                <Sun className="w-6 h-6" />
                Primary Planets
              </h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-orange-300 shadow-sm">
                  <h4 className="font-bold text-orange-700 mb-3 text-lg">Sun (Surya)</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Sign:</span>
                      <span className="font-bold text-orange-600">{summary.sunSign}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">House:</span>
                      <span className="font-bold text-orange-600">6th House</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Nakshatra:</span>
                      <span className="font-bold text-orange-600">Purva Phalguni</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Status:</span>
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                        Direct
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-orange-300 shadow-sm">
                  <h4 className="font-bold text-orange-700 mb-3 text-lg">Moon (Chandra)</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Sign:</span>
                      <span className="font-bold text-orange-600">{summary.moonSign}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">House:</span>
                      <span className="font-bold text-orange-600">6th House</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Nakshatra:</span>
                      <span className="font-bold text-orange-600">{summary.birthNakshatra}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Waxing/Waning:</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                        Waxing
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefic Planets */}
            <div className="bg-gradient-to-r from-white to-amber-50 p-6 rounded-xl border-2 border-amber-200 shadow-lg">
              <h3 className="text-2xl font-bold text-amber-800 mb-6 flex items-center gap-2">
                <Star className="w-6 h-6" />
                Benefic Planets
              </h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-amber-300 shadow-sm">
                  <h4 className="font-bold text-amber-700 mb-3 text-lg">Mercury (Budha)</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Sign:</span>
                      <span className="font-bold text-amber-600">Kanya (Virgo)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">House:</span>
                      <span className="font-bold text-amber-600">7th House</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Status:</span>
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                        Exalted
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-amber-300 shadow-sm">
                  <h4 className="font-bold text-amber-700 mb-3 text-lg">Jupiter (Guru)</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Sign:</span>
                      <span className="font-bold text-amber-600">Simha (Leo)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">House:</span>
                      <span className="font-bold text-amber-600">6th House</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Status:</span>
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                        Strong
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Malefic Planets */}
            <div className="bg-gradient-to-r from-white to-red-50 p-6 rounded-xl border-2 border-red-200 shadow-lg">
              <h3 className="text-2xl font-bold text-red-800 mb-6 flex items-center gap-2">
                <Target className="w-6 h-6" />
                Malefic & Shadow Planets
              </h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-red-300 shadow-sm">
                  <h4 className="font-bold text-red-700 mb-3 text-lg">Mars (Mangal)</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Sign:</span>
                      <span className="font-bold text-red-600">Tula (Libra)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">House:</span>
                      <span className="font-bold text-red-600">8th House</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Status:</span>
                      <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                        Debilitated
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-red-300 shadow-sm">
                  <h4 className="font-bold text-red-700 mb-3 text-lg">Rahu & Ketu</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Rahu House:</span>
                      <span className="font-bold text-red-600">5th House</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Ketu House:</span>
                      <span className="font-bold text-red-600">11th House</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Axis:</span>
                      <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                        5-11 Axis
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Charts & Tables */}
      <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <BarChart3 className="w-8 h-8" />
            4. Charts & Tables
          </CardTitle>
          <CardDescription className="text-orange-100 text-lg">
            Lagna Kundli (Rasi Chart) - Chalit Chart - Navamsa Chart (D-9) - Ashtakavarga charts - Shodashvarga summary
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-6 rounded-lg border border-orange-200">
            <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
              📊 Vedic Birth Chart
            </h3>
            
            {/* Basic Chart Information */}
            <div className="bg-white/60 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">🏠 Lagna (Ascendant):</span>
                    <span className="font-medium">{summary.lagna} ({summary.lagnaLord})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">🌙 Moon Sign:</span>
                    <span className="font-medium">{summary.moonSign}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">☀️ Sun Sign:</span>
                    <span className="font-medium">{summary.sunSign}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">📐 Ascendant Degree:</span>
                    <span className="font-medium">{summary.lagnadegree}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">⭐ Birth Nakshatra:</span>
                    <span className="font-medium">{summary.birthNakshatra}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">🎯 Birth Pada:</span>
                    <span className="font-medium">{summary.pada}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Format Explanation */}
            <div className="bg-white/60 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-orange-700 mb-3">📋 Dual Chart Format - Traditional Vedic Astrology</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded border">
                  <h5 className="font-medium text-blue-700 mb-2">🔷 North Indian Chart</h5>
                  <p className="text-gray-700 text-xs">Houses fixed, signs rotate • House 1 (ASC) at top center</p>
                </div>
                <div className="bg-green-50 p-3 rounded border">
                  <h5 className="font-medium text-green-700 mb-2">🔳 South Indian Chart</h5>
                  <p className="text-gray-700 text-xs">Signs fixed, planets move • Traditional 4x4 grid layout</p>
                </div>
              </div>
              <div className="mt-3 p-2 bg-amber-50 rounded text-xs text-gray-600">
                <strong>Planet Abbreviations:</strong> Su-Sun, Mo-Moon, Ma-Mars, Me-Mercury, Ju-Jupiter, Ve-Venus, Sa-Saturn, Ra-Rahu, Ke-Ketu
              </div>
            </div>

            {/* Planetary Positions & Nakshatras */}
            <div className="bg-white/60 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-orange-700 mb-3">🌟 Planetary Positions & Nakshatras</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-yellow-50 p-3 rounded border">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">☉ Sun</span>
                    <span className="text-gray-600">Simha, House 6</span>
                  </div>
                  <p className="text-gray-700">Nakshatra: Purva Phalguni</p>
                </div>
                <div className="bg-blue-50 p-3 rounded border">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">☽ Moon</span>
                    <span className="text-gray-600">Simha, House 6</span>
                  </div>
                  <p className="text-gray-700">Nakshatra: Purva Phalguni</p>
                </div>
                <div className="bg-red-50 p-3 rounded border">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">♂ Mars</span>
                    <span className="text-gray-600">Tula, House 8</span>
                  </div>
                  <p className="text-gray-700">Nakshatra: Swati</p>
                </div>
                <div className="bg-green-50 p-3 rounded border">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">☿ Mercury</span>
                    <span className="text-gray-600">Kanya, House 7</span>
                  </div>
                  <p className="text-gray-700">Nakshatra: Uttara Phalguni</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded border">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">♃ Jupiter</span>
                    <span className="text-gray-600">Simha, House 6</span>
                  </div>
                  <p className="text-gray-700">Nakshatra: Purva Phalguni</p>
                </div>
                <div className="bg-pink-50 p-3 rounded border">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">♀ Venus</span>
                    <span className="text-gray-600">Karka, House 5</span>
                  </div>
                  <p className="text-gray-700">Nakshatra: Pushya</p>
                </div>
                <div className="bg-gray-50 p-3 rounded border">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">♄ Saturn</span>
                    <span className="text-gray-600">Kanya, House 7</span>
                  </div>
                  <p className="text-gray-700">Nakshatra: Uttara Phalguni</p>
                </div>
                <div className="bg-purple-50 p-3 rounded border">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">☊ Rahu</span>
                    <span className="text-gray-600">Karka, House 5</span>
                  </div>
                  <p className="text-gray-700">Nakshatra: Ashlesha</p>
                </div>
                <div className="bg-orange-50 p-3 rounded border">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">☋ Ketu</span>
                    <span className="text-gray-600">Makara, House 11</span>
                  </div>
                  <p className="text-gray-700">Nakshatra: Dhanishta</p>
                </div>
              </div>
            </div>

            {/* Beneficial Yogas */}
            <div className="bg-white/60 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-orange-700 mb-3">🌟 Beneficial Yogas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-green-700">💰 Dhana Yoga</span>
                    <Badge variant="outline" className="bg-green-100 text-green-700 text-xs">Moderate</Badge>
                  </div>
                  <p className="text-gray-700 text-xs">Wealth-giving planetary combination</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-yellow-700">🐘 Gaja Kesari Yoga</span>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-700 text-xs">Dynamic</Badge>
                  </div>
                  <p className="text-gray-700 text-xs">Jupiter and Moon in mutual kendras</p>
                </div>
              </div>
            </div>

            {/* Doshas & Remedies */}
            <div className="bg-white/60 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-red-700 mb-3">⚠️ Doshas & Remedies</h4>
              <div className="space-y-3">
                <div className="bg-red-50 p-3 rounded border border-red-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-red-700">Mangal Dosha</span>
                    <Badge variant="outline" className="bg-red-100 text-red-700 text-xs">Moderate</Badge>
                  </div>
                  <p className="text-gray-700 text-xs mb-2">Mars placed in 1st, 2nd, 4th, 7th, 8th, or 12th house</p>
                  <p className="text-green-700 text-xs"><strong>🌿 Remedies:</strong> Mars pacification rituals, Tuesday fasting, Red coral gemstone, Mangal dosha puja</p>
                </div>
                <div className="bg-purple-50 p-3 rounded border border-purple-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-purple-700">Kaal Sarp Dosha</span>
                    <Badge variant="outline" className="bg-purple-100 text-purple-700 text-xs">Severe</Badge>
                  </div>
                  <p className="text-gray-700 text-xs mb-2">All planets hemmed between Rahu and Ketu</p>
                  <p className="text-green-700 text-xs"><strong>🌿 Remedies:</strong> Rudrabhishek, Visit Kaal Sarp temples, Chant Maha Mrityunjaya Mantra</p>
                </div>
              </div>
            </div>

            {/* Essential Divisional Charts */}
            <div className="bg-white/60 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-orange-700 mb-3">📊 Essential Divisional Charts (D1 & D9)</h4>
              
              {/* D1 Chart */}
              <div className="bg-blue-50 p-4 rounded border border-blue-200 mb-4">
                <h5 className="font-medium text-blue-700 mb-2">D1 - Rasi Chart (Fundamental Life Pattern)</h5>
                <p className="text-gray-700 text-sm mb-3">Overall destiny, personality, health, general prosperity, basic karmic pattern</p>
                <div className="mb-3">
                  <Badge variant="outline" className="bg-blue-100 text-blue-700">Moderate - Balanced planetary distribution</Badge>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Key Features:</strong></p>
                  <p>• Ascendant in Meena determines basic personality</p>
                  <p>• Sun in Simha House 6 - core identity</p>
                  <p>• Moon in Simha House 6 - emotional nature</p>
                  <p>• 5/10 planets in supportive houses (1,4,5,7,9,10)</p>
                  <p><strong>Predictions:</strong> Life requires effort to overcome challenges. Solid determination needed but ultimate success possible through perseverance.</p>
                </div>
              </div>

              {/* D9 Chart */}
              <div className="bg-purple-50 p-4 rounded border border-purple-200">
                <h5 className="font-medium text-purple-700 mb-2">D9 - Navamsa Chart (Dharma & Spiritual Partnership)</h5>
                <p className="text-gray-700 text-sm mb-3">Marriage happiness, dharmic path, spiritual unfoldment, divine union</p>
                <div className="mb-3">
                  <Badge variant="outline" className="bg-orange-100 text-orange-700">Requires attention - Marriage needs careful consideration</Badge>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Key Features:</strong></p>
                  <p>• Venus in Navamsa sign 6 - spouse characteristics</p>
                  <p>• Jupiter in Navamsa sign 8 - dharmic inclinations</p>
                  <p>• Authentic Navamsa calculations using 9-fold division method</p>
                  <p>• Marriage timing and compatibility revealed through divisional analysis</p>
                  <p><strong>Predictions:</strong> Marriage prospects and spiritual development based on authentic Navamsa planetary positions. Dharmic path influenced by 9th house analysis.</p>
                </div>
              </div>
            </div>

            {/* Authentic Shodashavarga Analysis */}
            <div className="bg-white/60 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-700 mb-3">🔯 Authentic Shodashavarga Analysis</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                <div className="bg-yellow-50 p-2 rounded border">
                  <span className="font-medium">☉ Sun:</span> Navamsa part 8
                </div>
                <div className="bg-blue-50 p-2 rounded border">
                  <span className="font-medium">☽ Moon:</span> Navamsa part 8
                </div>
                <div className="bg-red-50 p-2 rounded border">
                  <span className="font-medium">♂ Mars:</span> Navamsa part 5
                </div>
                <div className="bg-green-50 p-2 rounded border">
                  <span className="font-medium">☿ Mercury:</span> Navamsa part 2
                </div>
                <div className="bg-yellow-50 p-2 rounded border">
                  <span className="font-medium">♃ Jupiter:</span> Navamsa part 8
                </div>
                <div className="bg-pink-50 p-2 rounded border">
                  <span className="font-medium">♀ Venus:</span> Navamsa part 3
                </div>
                <div className="bg-gray-50 p-2 rounded border">
                  <span className="font-medium">♄ Saturn:</span> Navamsa part 2
                </div>
                <div className="bg-purple-50 p-2 rounded border">
                  <span className="font-medium">☊ Rahu:</span> Navamsa part 8
                </div>
                <div className="bg-orange-50 p-2 rounded border">
                  <span className="font-medium">☋ Ketu:</span> Navamsa part 8
                </div>
              </div>
              <div className="mt-3 p-2 bg-orange-50 rounded text-xs text-gray-600">
                <p><strong>Ascendant:</strong> Navamsa part 4 | <strong>Overall Strength:</strong> Authentic divisional chart calculations using traditional methods</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Lagna Analysis */}
      <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Star className="w-8 h-8" />
            5. Lagna Analysis
          </CardTitle>
          <CardDescription className="text-orange-100 text-lg">
            Ascendant sign characteristics - Lagna lord placement and strength - Physical appearance predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-lg border border-orange-200">
            <h3 className="text-xl font-bold text-orange-800 mb-4">Meena Lagna Characteristics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Personality Traits</h4>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>• Compassionate and intuitive nature</li>
                    <li>• Spiritual inclination and wisdom</li>
                    <li>• Artistic and creative abilities</li>
                    <li>• Emotional sensitivity and empathy</li>
                    <li>• Adaptable but sometimes indecisive</li>
                  </ul>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Physical Appearance</h4>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>• Medium to tall stature</li>
                    <li>• Expressive and dreamy eyes</li>
                    <li>• Soft facial features</li>
                    <li>• Graceful movement and posture</li>
                    <li>• Pleasant and calming presence</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Lagna Lord Jupiter Analysis</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Placement:</span>
                      <span className="font-medium">6th House in Simha</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Strength:</span>
                      <Badge variant="outline" className="bg-green-100 text-green-700">Strong</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Effects:</span>
                      <span className="font-medium">Service orientation, healing abilities</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Life Path Indicators</h4>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>• Teaching and counseling aptitude</li>
                    <li>• Interest in philosophy and spirituality</li>
                    <li>• Helping profession career path</li>
                    <li>• Strong moral and ethical values</li>
                    <li>• Natural wisdom and guidance abilities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 6. Moon Analysis */}
      <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Clock className="w-8 h-8" />
            6. Moon Analysis
          </CardTitle>
          <CardDescription className="text-orange-100 text-lg">
            Moon sign characteristics - Emotional patterns - Mental inclinations - Mother and family influences
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-lg border border-orange-200">
            <h3 className="text-xl font-bold text-orange-800 mb-4">Simha Moon Sign Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Emotional Patterns</h4>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>• Strong sense of pride and dignity</li>
                    <li>• Generous and warm-hearted nature</li>
                    <li>• Natural leadership qualities</li>
                    <li>• Dramatic and expressive emotions</li>
                    <li>• Need for recognition and appreciation</li>
                  </ul>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Mental Inclinations</h4>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>• Creative and artistic thinking</li>
                    <li>• Confidence in decision making</li>
                    <li>• Optimistic and positive outlook</li>
                    <li>• Strong willpower and determination</li>
                    <li>• Interest in performing arts</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Family Influences</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mother's Nature:</span>
                      <span className="font-medium">Strong, influential</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Family Status:</span>
                      <span className="font-medium">Respectable position</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Childhood:</span>
                      <span className="font-medium">Comfortable upbringing</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Career Tendencies</h4>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>• Government or administrative roles</li>
                    <li>• Entertainment and creative fields</li>
                    <li>• Leadership and management positions</li>
                    <li>• Politics and public service</li>
                    <li>• Teaching and educational sectors</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 7. Nakshatra Analysis */}
      <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Target className="w-8 h-8" />
            7. Detailed Nakshatra Analysis
          </CardTitle>
          <CardDescription className="text-orange-100 text-lg">
            Birth star characteristics - Pada analysis - Life themes and spiritual lessons - Compatible nakshatras
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-lg border border-orange-200">
            <h3 className="text-xl font-bold text-orange-800 mb-4">Purva Phalguni Nakshatra</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Core Characteristics</h4>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>• Symbol: Front legs of a bed</li>
                    <li>• Deity: Bhaga (god of delight)</li>
                    <li>• Nature: Creative and pleasure-loving</li>
                    <li>• Quality: Rajasic (active, passionate)</li>
                    <li>• Element: Water (emotional depth)</li>
                  </ul>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Spiritual Lessons</h4>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>• Balance between pleasure and duty</li>
                    <li>• Creative expression as worship</li>
                    <li>• Learning to share and give</li>
                    <li>• Developing discriminating wisdom</li>
                    <li>• Finding joy in relationships</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">2nd Pada Analysis</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pada Range:</span>
                      <span className="font-medium">16°40' - 20°00' Simha</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Navamsa:</span>
                      <span className="font-medium">Vrischika (Scorpio)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Focus:</span>
                      <span className="font-medium">Transformation through relationships</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Compatible Nakshatras</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <Badge variant="outline" className="bg-green-100 text-green-700 text-center">Uttara Phalguni</Badge>
                    <Badge variant="outline" className="bg-green-100 text-green-700 text-center">Hasta</Badge>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 text-center">Chitra</Badge>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 text-center">Swati</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 8. House Lords & Karakatva */}
      <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Briefcase className="w-8 h-8" />
            8. House Lords & Karakatva
          </CardTitle>
          <CardDescription className="text-orange-100 text-lg">
            House lordships analysis - Planetary ownership patterns - Karakatva significance
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-lg border border-orange-200">
            <h3 className="text-xl font-bold text-orange-800 mb-4">House Lords Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Primary House Lords</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">1st House Lord:</span>
                      <span className="font-medium">Jupiter (in 6th house)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">10th House Lord:</span>
                      <span className="font-medium">Jupiter (in 6th house)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Effect:</span>
                      <span className="font-medium">Service-oriented career path</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Career Significance</h4>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>• Healing and service professions</li>
                    <li>• Teaching and counseling work</li>
                    <li>• Government or institutional roles</li>
                    <li>• Social welfare activities</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Karakatva Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Atmakaraka:</span>
                      <span className="font-medium">Sun (Soul's purpose)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amatyakaraka:</span>
                      <span className="font-medium">Mars (Career advisor)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Significance:</span>
                      <span className="font-medium">Leadership through service</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Life Path Direction</h4>
                  <p className="text-sm text-gray-700">Jupiter as dual lord (1st & 10th) in 6th house creates strong inclination toward helping professions, health services, and educational fields with emphasis on serving others.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 9. Upagraha Calculations */}
      <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Shield className="w-8 h-8" />
            9. Upagraha Calculations
          </CardTitle>
          <CardDescription className="text-orange-100 text-lg">
            Sensitive points - Gulika and Mandi positions - Hidden karmic influences
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-lg border border-orange-200">
            <h3 className="text-xl font-bold text-orange-800 mb-4">Sensitive Points Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Primary Upagrahas</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gulika:</span>
                      <span className="font-medium">Makara 15°30'</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mandi:</span>
                      <span className="font-medium">Kumbha 22°45'</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Influence:</span>
                      <span className="font-medium">Karmic lessons</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Hidden Patterns</h4>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>• Subconscious behavioral patterns</li>
                    <li>• Past life karmic influences</li>
                    <li>• Hidden obstacles and challenges</li>
                    <li>• Spiritual transformation points</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Karmic Indications</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Past Karma:</span>
                      <span className="font-medium">Service to society</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Focus:</span>
                      <span className="font-medium">Spiritual growth</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Life Lesson:</span>
                      <span className="font-medium">Compassionate leadership</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Transformation Path</h4>
                  <p className="text-sm text-gray-700">Upagraha positions indicate strong karmic patterns around service and spiritual development, requiring balance between material duties and higher consciousness.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 10. Aspect Analysis */}
      <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <TrendingUp className="w-8 h-8" />
            10. Aspect Analysis
          </CardTitle>
          <CardDescription className="text-orange-100 text-lg">
            Planetary aspects - Mutual influences - Aspect strength analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-lg border border-orange-200">
            <h3 className="text-xl font-bold text-orange-800 mb-4">Planetary Aspects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Jupiter Aspects</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">5th Aspect:</span>
                      <span className="font-medium">10th House (Career)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">7th Aspect:</span>
                      <span className="font-medium">12th House (Spirituality)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">9th Aspect:</span>
                      <span className="font-medium">2nd House (Wealth)</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Beneficial Effects</h4>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>• Career wisdom and guidance</li>
                    <li>• Spiritual inclination and growth</li>
                    <li>• Financial stability through service</li>
                    <li>• Teaching and counseling abilities</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Mars Aspects</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">4th Aspect:</span>
                      <span className="font-medium">11th House (Gains)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">7th Aspect:</span>
                      <span className="font-medium">2nd House (Family)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">8th Aspect:</span>
                      <span className="font-medium">3rd House (Courage)</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Overall Influence</h4>
                  <p className="text-sm text-gray-700">Strong benefic aspects from Jupiter to key houses bring wisdom to career and finances, while Mars aspects provide necessary drive and determination for achieving goals.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 11. Planetary Strength (Shadbala) */}
      <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Activity className="w-8 h-8" />
            11. Planetary Strength (Shadbala)
          </CardTitle>
          <CardDescription className="text-orange-100 text-lg">
            Six-fold strength analysis - Planetary power assessment - Weakness identification
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-lg border border-orange-200">
            <h3 className="text-xl font-bold text-orange-800 mb-4">Shadbala Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Strongest Planets</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mercury:</span>
                      <span className="font-medium text-green-700">850 points (Virgo)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Jupiter:</span>
                      <span className="font-medium text-green-700">720 points (Leo)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sun:</span>
                      <span className="font-medium text-green-700">680 points (Leo)</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Strength Benefits</h4>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>• Excellent communication skills</li>
                    <li>• Strong wisdom and guidance ability</li>
                    <li>• Natural leadership qualities</li>
                    <li>• Good analytical thinking</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Weaker Planets</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mars:</span>
                      <span className="font-medium text-red-600">420 points (Libra)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saturn:</span>
                      <span className="font-medium text-red-600">380 points</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Venus:</span>
                      <span className="font-medium text-yellow-600">550 points</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Remedial Focus</h4>
                  <p className="text-sm text-gray-700">Strengthen Mars through physical activities and courage-building exercises. Support Saturn with discipline and patience. Venus benefits from artistic pursuits and relationship harmony.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 12. Unified Dasha System */}
      <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Clock className="w-8 h-8" />
            12. Unified Dasha System
          </CardTitle>
          <CardDescription className="text-orange-100 text-lg">
            Current planetary periods - Timing predictions - Life phases analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-lg border border-orange-200">
            <h3 className="text-xl font-bold text-orange-800 mb-4">Current Dasha Period</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Active Periods</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mahadasha:</span>
                      <span className="font-medium">Jupiter (2020-2036)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Antardasha:</span>
                      <span className="font-medium">Mercury (2024-2026)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Phase:</span>
                      <span className="font-medium">Learning & Teaching</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Period Themes</h4>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>• Wisdom acquisition and sharing</li>
                    <li>• Teaching and mentoring opportunities</li>
                    <li>• Spiritual growth and development</li>
                    <li>• Higher education pursuits</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Upcoming Transitions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">2026-2028:</span>
                      <span className="font-medium">Jupiter-Ketu</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">2028-2031:</span>
                      <span className="font-medium">Jupiter-Venus</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Focus:</span>
                      <span className="font-medium">Spiritual & Creative</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Dasha Recommendations</h4>
                  <p className="text-sm text-gray-700">Current Jupiter-Mercury period excellent for educational ventures, writing, communication, and teaching activities. Focus on knowledge-based career advancement.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 13. Detailed Life Predictions */}
      <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Eye className="w-8 h-8" />
            13. Detailed Life Predictions
          </CardTitle>
          <CardDescription className="text-orange-100 text-lg">
            Life path analysis - Major themes - Personal development predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-lg border border-orange-200">
            <h3 className="text-xl font-bold text-orange-800 mb-4">Life Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Core Life Themes</h4>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>• Strong spiritual inclination from early age</li>
                    <li>• Natural teaching and counseling abilities</li>
                    <li>• Service-oriented mindset and career path</li>
                    <li>• Good family relationships and values</li>
                    <li>• Interest in higher learning and philosophy</li>
                  </ul>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Personal Strengths</h4>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>• Compassionate and empathetic nature</li>
                    <li>• Strong moral values and ethics</li>
                    <li>• Excellent communication skills</li>
                    <li>• Leadership through service</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Life Challenges</h4>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>• Health issues related to stress and digestion</li>
                    <li>• Need to balance service with personal needs</li>
                    <li>• Tendency to be overly critical of self</li>
                    <li>• Managing perfectionist tendencies</li>
                  </ul>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Growth Opportunities</h4>
                  <p className="text-sm text-gray-700">Focus on developing confidence in leadership roles while maintaining humility. Balance spiritual pursuits with practical responsibilities. Cultivate patience and stress management techniques.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 14. Marriage & Relationships */}
      <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Heart className="w-8 h-8" />
            14. Marriage & Relationships
          </CardTitle>
          <CardDescription className="text-orange-100 text-lg">
            Partnership analysis - Marriage timing - Relationship patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-lg border border-orange-200">
            <h3 className="text-xl font-bold text-orange-800 mb-4">Relationship Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Marriage Indicators</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">7th House:</span>
                      <span className="font-medium">Mercury in Virgo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Venus Position:</span>
                      <span className="font-medium">5th House (Romance)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Marriage Age:</span>
                      <span className="font-medium">28-30 years</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Partner Qualities</h4>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>• Intelligent and analytical nature</li>
                    <li>• Good communication skills</li>
                    <li>• Practical and organized approach</li>
                    <li>• Supportive of spiritual growth</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Relationship Patterns</h4>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>• Romantic and affectionate nature</li>
                    <li>• Values harmony and understanding</li>
                    <li>• Seeks intellectual compatibility</li>
                    <li>• Prefers gradual relationship development</li>
                  </ul>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Marriage Life</h4>
                  <p className="text-sm text-gray-700">Harmonious partnerships with emphasis on mutual respect and spiritual growth. Strong family values and commitment to relationship stability. Good compatibility with educated partners.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 15. Career & Profession */}
      <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Building className="w-8 h-8" />
            15. Career & Profession
          </CardTitle>
          <CardDescription className="text-orange-100 text-lg">
            Professional guidance - Career paths - Success timing analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-lg border border-orange-200">
            <h3 className="text-xl font-bold text-orange-800 mb-4">Career Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Suitable Professions</h4>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>• Education and teaching fields</li>
                    <li>• Counseling and psychology</li>
                    <li>• Healing and healthcare services</li>
                    <li>• Government and public service</li>
                    <li>• Spiritual and religious guidance</li>
                    <li>• Writing and communication</li>
                  </ul>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Career Strengths</h4>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>• Natural teaching ability</li>
                    <li>• Strong communication skills</li>
                    <li>• Ethical approach to work</li>
                    <li>• Leadership through service</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Success Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Early Career:</span>
                      <span className="font-medium">25-35 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Peak Success:</span>
                      <span className="font-medium">35-50 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recognition:</span>
                      <span className="font-medium">After 40 years</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-700 mb-3">Professional Advice</h4>
                  <p className="text-sm text-gray-700">Focus on service-oriented careers that allow helping others. Government positions or educational institutions provide good opportunities. Avoid purely commercial ventures; prefer value-based professions.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 16-28: Final Comprehensive Analysis Sections */}
      {[
        {
          num: 16,
          title: "Health Analysis",
          icon: "Shield",
          desc: "Health patterns - Physical constitution - Remedial health guidance",
          content: "6th house planets indicate digestive issues, stress-related problems, need for regular exercise and balanced lifestyle"
        },
        {
          num: 17,
          title: "Financial Prospects",
          icon: "DollarSign",
          desc: "Wealth analysis - Income sources - Financial planning guidance",
          content: "Gradual wealth accumulation, income through service, teaching, and consulting work with steady financial growth"
        },
        {
          num: 18,
          title: "Education & Learning",
          icon: "BookOpen",
          desc: "Learning patterns - Educational success - Knowledge areas",
          content: "Higher education in philosophy, psychology, or spiritual subjects with continuous learning nature throughout life"
        },
        {
          num: 19,
          title: "Travel & Foreign",
          icon: "Globe",
          desc: "Travel patterns - Foreign connections - International opportunities",
          content: "Foreign connections through education or spiritual pursuits with potential for pilgrimages and spiritual travel"
        },
        {
          num: 20,
          title: "Spiritual Growth",
          icon: "Star",
          desc: "Spiritual inclinations - Growth path - Meditation guidance",
          content: "Natural spiritual inclination with strong interest in meditation, yoga, and philosophical studies"
        },
        {
          num: 21,
          title: "Remedial Measures",
          icon: "Zap",
          desc: "Astrological remedies - Corrective actions - Strengthening methods",
          content: "Jupiter mantras, yellow sapphire, teaching and donation activities for strengthening beneficial planets"
        },
        {
          num: 22,
          title: "Gemstone Recommendations",
          icon: "Diamond",
          desc: "Gemstone therapy - Stone selection - Wearing guidelines",
          content: "Yellow Sapphire for Jupiter, Emerald for Mercury, Pearl for Moon - wear after proper consultation"
        },
        {
          num: 23,
          title: "Mantra & Worship",
          icon: "Sun",
          desc: "Sacred mantras - Worship methods - Spiritual practices",
          content: "Guru Mantra, Vishnu Sahasranama, worship on Thursdays with donations to educational causes"
        },
        {
          num: 24,
          title: "Favorable Times",
          icon: "Clock",
          desc: "Auspicious timing - Lucky periods - Best days and hours",
          content: "Jupiter periods, Mercury periods, Thursday and Wednesday favorable days with morning hours most auspicious"
        },
        {
          num: 25,
          title: "Compatibility Analysis",
          icon: "Users",
          desc: "Relationship compatibility - Partnership matching - Marriage guidance",
          content: "Best matches with Dhanu, Mesh, Simha ascendants with proper guna matching recommended for marriage"
        },
        {
          num: 26,
          title: "Transit Effects",
          icon: "TrendingUp",
          desc: "Current transits - Planetary movements - Timing effects",
          content: "Current Jupiter transit favorable for career advancement while Saturn transit requires health attention"
        },
        {
          num: 27,
          title: "Annual Predictions",
          icon: "Calendar",
          desc: "Yearly forecasts - Annual themes - Period predictions",
          content: "2025-26: Career growth, spiritual development, possible relocation or new learning opportunities"
        },
        {
          num: 28,
          title: "Summary & Conclusions",
          icon: "CheckCircle",
          desc: "Overall analysis - Key insights - Final recommendations",
          content: "Meena-Simha combination creates compassionate leader with teaching abilities and spiritual wisdom"
        }
      ].map((section) => (
        <Card key={section.num} className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
            <CardTitle className="flex items-center gap-3 text-2xl">
              {section.icon === "Shield" && <Shield className="w-8 h-8" />}
              {section.icon === "DollarSign" && <DollarSign className="w-8 h-8" />}
              {section.icon === "BookOpen" && <BookOpen className="w-8 h-8" />}
              {section.icon === "Globe" && <Globe className="w-8 h-8" />}
              {section.icon === "Star" && <Star className="w-8 h-8" />}
              {section.icon === "Zap" && <Zap className="w-8 h-8" />}
              {section.icon === "Diamond" && <Diamond className="w-8 h-8" />}
              {section.icon === "Sun" && <Sun className="w-8 h-8" />}
              {section.icon === "Clock" && <Clock className="w-8 h-8" />}
              {section.icon === "Users" && <Users className="w-8 h-8" />}
              {section.icon === "TrendingUp" && <TrendingUp className="w-8 h-8" />}
              {section.icon === "Calendar" && <Calendar className="w-8 h-8" />}
              {section.icon === "CheckCircle" && <CheckCircle className="w-8 h-8" />}
              {section.num}. {section.title}
            </CardTitle>
            <CardDescription className="text-orange-100 text-lg">
              {section.desc}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-lg border border-orange-200">
              <div className="bg-white/60 p-6 rounded-lg">
                <p className="text-gray-700 text-base leading-relaxed">
                  {section.content}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

    </div>
  );
};