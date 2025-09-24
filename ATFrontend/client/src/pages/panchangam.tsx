import { useEffect } from "react";
import PanchangamWidget from "src/components/astrology/PanchangamWidget";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Sun, Star, Calendar } from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";

export default function PanchangamPage() {
  useEffect(() => {
    document.title = "Daily Panchangam - AstroTick";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <AstroTickHeader />
      <div className="p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <Sun className="h-8 w-8 text-orange-500" />
            Daily Panchangam
            <Star className="h-8 w-8 text-purple-500" />
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Authentic Vedic Panchangam calculated using Swiss Ephemeris with Lahiri Ayanamsa. 
            Get precise calculations for Tithi, Nakshatra, Yoga, Karana, and Vara for any date and location.
          </p>
        </div>

        {/* About Panchangam */}
        <Card className="bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              About Panchangam (पञ्चाङ्ग)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-700">Tithi (तिथि)</h4>
                <p className="text-gray-600">
                  Lunar day based on the angular relationship between Sun and Moon. 
                  Determines auspicious timing for religious activities.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-700">Nakshatra (नक्षत्र)</h4>
                <p className="text-gray-600">
                  Lunar mansion where the Moon is positioned. 
                  Influences personality traits and spiritual qualities.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-green-700">Yoga (योग)</h4>
                <p className="text-gray-600">
                  Combination of Sun and Moon positions. 
                  Indicates the general quality and outcome of the day.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-orange-700">Karana (करण)</h4>
                <p className="text-gray-600">
                  Half of a Tithi period. 
                  Used for determining appropriate times for specific activities.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-red-700">Vara (वार)</h4>
                <p className="text-gray-600">
                  Day of the week with its planetary ruler. 
                  Each day has specific qualities and recommended activities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Panchangam Calculator */}
        <PanchangamWidget />

        {/* Traditional Significance */}
        <Card className="bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Traditional Significance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-gray-700">
              <p>
                The Panchangam is the foundation of Hindu calendar system and forms the basis for determining 
                muhurtas (auspicious times) for important life events. Our calculations use the authentic 
                Swiss Ephemeris astronomical data with traditional Lahiri Ayanamsa, ensuring accuracy that 
                matches classical Jyotisha texts.
              </p>
              <p className="mt-3">
                Each element of the Panchangam carries deep spiritual and practical significance, guiding 
                devotees in timing their religious observances, festivals, and important decisions according 
                to cosmic rhythms established in ancient Vedic traditions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
      <Footer />
    </div>
  );
}