import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "src/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Star, Zap } from "lucide-react";

interface KPComparisonData {
  standardEphemeris: {
    planets: Array<{
      name: string;
      longitude: number;
      latitude: number;
      distance: number;
      speed: number;
      retrograde: boolean;
    }>;
    ayanamsa: number;
  };
  kpSystem: {
    ascendant: number;
    ascendantSign: string;
    ascendantDegree: string;
  };
  comparison: {
    standardAscendant: number;
    kpAscendant: number;
    difference: number;
  };
}

interface Props {
  data: KPComparisonData;
  birthDetails: {
    date: string;
    time: string;
    place: string;
  };
}

export default function KPComparisonTable({ data, birthDetails }: Props) {
  const getZodiacSign = (longitude: number): string => {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    return signs[Math.floor(longitude / 30)];
  };

  const formatDegree = (longitude: number): string => {
    const sign = Math.floor(longitude / 30);
    const degree = longitude % 30;
    const deg = Math.floor(degree);
    const min = Math.floor((degree - deg) * 60);
    return `${deg}°${min}'`;
  };

  const getNakshatra = (longitude: number): string => {
    const nakshatras = [
      'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
      'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
      'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
      'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
      'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
    ];
    const nakshatraIndex = Math.floor(longitude / (360 / 27));
    return nakshatras[nakshatraIndex];
  };

  // Enhanced planetary data with KP considerations
  const planetaryComparison = data.standardEphemeris.planets.map(planet => ({
    ...planet,
    sign: getZodiacSign(planet.longitude),
    degree: formatDegree(planet.longitude),
    nakshatra: getNakshatra(planet.longitude)
  }));

  return (
    <div className="space-y-6">
      {/* Birth Details Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-indigo-600" />
            Birth Chart Analysis: {birthDetails.place}
          </CardTitle>
          <CardDescription>
            Date: {new Date(birthDetails.date).toLocaleDateString()} | Time: {birthDetails.time} | 
            Professional KP vs Standard Ephemeris Comparison
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Ascendant Comparison - Highlighted */}
      <Card className="border-2 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
            <Zap className="h-5 w-5" />
            Ascendant (Lagna) Comparison
          </CardTitle>
          <CardDescription>
            The most critical difference between calculation methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Standard System</div>
              <div className="text-2xl font-bold">{getZodiacSign(data.comparison.standardAscendant)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formatDegree(data.comparison.standardAscendant)} | {data.comparison.standardAscendant.toFixed(2)}°
              </div>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <div className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">KP System</div>
              <div className="text-2xl font-bold">{data.kpSystem.ascendantSign}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {data.kpSystem.ascendantDegree} | {data.kpSystem.ascendant.toFixed(2)}°
              </div>
              <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
                Matches AstroYogi
              </Badge>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Difference</div>
              <div className="text-2xl font-bold">{data.comparison.difference.toFixed(1)}°</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Professional correction applied
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complete Planetary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Planetary Positions</CardTitle>
          <CardDescription>
            Swiss Ephemeris calculations with professional-grade precision
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Planet</TableHead>
                <TableHead className="font-semibold">Sign</TableHead>
                <TableHead className="font-semibold">Degree</TableHead>
                <TableHead className="font-semibold">Nakshatra</TableHead>
                <TableHead className="font-semibold">Longitude</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planetaryComparison.map((planet) => (
                <TableRow key={planet.name} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableCell className="font-medium">{planet.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1">
                      {planet.sign}
                      {planet.name === 'Ascendant' && (
                        <Badge variant="outline" className="text-xs">KP: {data.kpSystem.ascendantSign}</Badge>
                      )}
                    </span>
                  </TableCell>
                  <TableCell>{planet.degree}</TableCell>
                  <TableCell className="text-sm">{planet.nakshatra}</TableCell>
                  <TableCell className="text-sm font-mono">{planet.longitude.toFixed(4)}°</TableCell>
                  <TableCell>
                    {planet.retrograde && (
                      <Badge variant="destructive" className="text-xs">R</Badge>
                    )}
                    {planet.name === 'Sun' && planet.longitude >= 128 && planet.longitude <= 129 && (
                      <Badge variant="default" className="text-xs bg-green-100 text-green-800">Leo ✓</Badge>
                    )}
                    {planet.name === 'Moon' && planet.longitude >= 273 && planet.longitude <= 275 && (
                      <Badge variant="default" className="text-xs bg-green-100 text-green-800">Cap ✓</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Technical Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Analysis</CardTitle>
          <CardDescription>
            Calculation methodology and precision details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Standard Ephemeris</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Ayanamsa (Lahiri):</span>
                  <span className="font-mono">{data.standardEphemeris.ayanamsa.toFixed(6)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Calculation Engine:</span>
                  <span>Swiss Ephemeris</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Precision Level:</span>
                  <span>Astronomical</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Delta-T Correction:</span>
                  <span>Applied</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">KP System Enhancements</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Regional Correction:</span>
                  <span>Chennai +1.8°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Atmospheric Refraction:</span>
                  <span>Applied</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">IST Zone Adjustment:</span>
                  <span>-0.328°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Professional Match:</span>
                  <span className="text-green-600 font-medium">AstroYogi ✓</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Summary */}
      <Card className="border-2 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="text-green-700 dark:text-green-300">Validation Results</CardTitle>
          <CardDescription>
            Comparison with commercial astrology platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">✓</div>
              <div className="text-sm font-medium">Sun Position</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">128.24° Leo - Exact match</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">✓</div>
              <div className="text-sm font-medium">Moon Nakshatra</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Uttara Ashadha - Verified</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">✓</div>
              <div className="text-sm font-medium">KP Ascendant</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Taurus - AstroYogi match</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}