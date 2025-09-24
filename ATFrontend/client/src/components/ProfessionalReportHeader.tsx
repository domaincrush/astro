import { Card, CardContent } from 'src/components/ui/card';

interface ProfessionalReportHeaderProps {
  reportData: any;
}

export function ProfessionalReportHeader({ reportData }: ProfessionalReportHeaderProps) {
  const birthDetails = reportData.birth_details || {};
  const chartData = reportData.chart_data || {};
  
  // Extract astronomical data from report
  const getWeekday = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const formatCoordinates = (lat: number, lng: number) => {
    return `Lat: ${Math.abs(lat).toFixed(4)}°${lat >= 0 ? 'N' : 'S'}, Long: ${Math.abs(lng).toFixed(4)}°${lng >= 0 ? 'E' : 'W'}`;
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'N/A';
    const [hours, minutes] = timeString.split(':');
    const hour12 = ((parseInt(hours) % 12) || 12);
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
    return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const formatDegreeMinuteSecond = (degrees: number) => {
    const deg = Math.floor(degrees);
    const min = Math.floor((degrees - deg) * 60);
    const sec = Math.floor(((degrees - deg) * 60 - min) * 60);
    return `${deg}° ${min}' ${sec}"`;
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg border shadow-sm">
      <h1 className="text-2xl font-bold text-center text-blue-900 mb-8">
        Professional Horoscope Report
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Personal Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Personal Information
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex">
              <span className="font-medium w-20">Name:</span>
              <span>{birthDetails.name || 'N/A'}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-20">Date:</span>
              <span>{birthDetails.date || 'N/A'}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-20">Time:</span>
              <span>{birthDetails.time ? formatTime(birthDetails.time) : 'N/A'}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-20">Place:</span>
              <span>{birthDetails.place || 'N/A'}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-20">Weekday:</span>
              <span>{birthDetails.date ? getWeekday(birthDetails.date) : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Astronomical Details */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Astronomical Details
          </h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Coordinates:</span>
              <span className="ml-2">
                {birthDetails.latitude && birthDetails.longitude ? 
                  formatCoordinates(birthDetails.latitude, birthDetails.longitude) : 
                  birthDetails.coordinates || 'N/A'}
              </span>
            </div>
            <div className="flex">
              <span className="font-medium w-24">Latitude:</span>
              <span>{birthDetails.latitude ? `${birthDetails.latitude.toFixed(4)}°` : 'N/A'}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-24">Longitude:</span>
              <span>{birthDetails.longitude ? `${birthDetails.longitude.toFixed(4)}°` : 'N/A'}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-24">Sunrise:</span>
              <span>{birthDetails.sunrise || 'N/A'}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-24">Sunset:</span>
              <span>{birthDetails.sunset || 'N/A'}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-24">Day Duration:</span>
              <span>{birthDetails.day_duration || 'N/A'}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-24">Timezone:</span>
              <span>{birthDetails.timezone || 'N/A'}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-24">Ayanamsa:</span>
              <span>{birthDetails.ayanamsa || 'N/A'}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-24">Chart System:</span>
              <span>Sidereal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Astrological Summary */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
          Astrological Summary
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          {/* Ascendant Card */}
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold text-orange-800 mb-2">
                Ascendant (Lagna):
              </h3>
              <div className="text-xl font-bold text-orange-900">
                {reportData.ascendant_sign || chartData.ascendant?.sign || 'Unknown'}
              </div>
              <div className="text-sm text-orange-700 mt-1">
                {chartData.ascendant?.nakshatra || birthDetails.birth_nakshatra || 'Unknown'} - Pada {chartData.ascendant?.pada || 'Unknown'}
              </div>
            </CardContent>
          </Card>

          {/* Moon Sign Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold text-blue-800 mb-2">
                Moon Sign (Rashi):
              </h3>
              <div className="text-xl font-bold text-blue-900">
                {reportData.moon_sign || chartData.moon_sign || 'Unknown'}
              </div>
              <div className="text-sm text-blue-700 mt-1">
                Lord: {chartData.rashi_lord || 'Unknown'}
              </div>
            </CardContent>
          </Card>

          {/* Birth Nakshatra Card */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold text-yellow-800 mb-2">
                Birth Nakshatra:
              </h3>
              <div className="text-xl font-bold text-yellow-900">
                {chartData.birth_nakshatra || birthDetails.birth_nakshatra || 'Unknown'}
              </div>
              <div className="text-sm text-yellow-700 mt-1">
                Lord: {chartData.nakshatra_lord || 'Unknown'}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}