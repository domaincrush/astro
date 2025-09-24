import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { Calendar, Globe, TrendingUp, AlertTriangle, Star, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "src/lib/queryClient";

interface PlanetaryTransit {
  id: number;
  planet: string;
  fromSign: string;
  toSign: string;
  transitDate: string;
  endDate?: string;
  impact: 'major' | 'moderate' | 'minor';
  aspects: string[];
  description: string;
  affectedAreas: string[];
  recommendations: string[];
}

interface TransitAlert {
  id: number;
  userId: number;
  transitId: number;
  transit: PlanetaryTransit;
  alertDate: string;
  isRead: boolean;
  personalizedMessage: string;
}

export default function TransitTracker() {
  const [selectedPlanet, setSelectedPlanet] = useState<string>("all");
  const [timeframe, setTimeframe] = useState<string>("month");

  const { data: transits = [], isLoading } = useQuery<PlanetaryTransit[]>({
    queryKey: ["/api/transits", selectedPlanet, timeframe],
    queryFn: () => apiRequest(`/api/transits?planet=${selectedPlanet}&timeframe=${timeframe}`, "GET"),
    retry: false,
  });

  const { data: alerts = [] } = useQuery<TransitAlert[]>({
    queryKey: ["/api/transits/alerts"],
    queryFn: () => apiRequest("/api/transits/alerts", "GET"),
    retry: false,
  });

  const planets = [
    { name: "all", label: "All Planets", emoji: "🌌" },
    { name: "mercury", label: "Mercury", emoji: "☿" },
    { name: "venus", label: "Venus", emoji: "♀" },
    { name: "mars", label: "Mars", emoji: "♂" },
    { name: "jupiter", label: "Jupiter", emoji: "♃" },
    { name: "saturn", label: "Saturn", emoji: "♄" },
    { name: "uranus", label: "Uranus", emoji: "♅" },
    { name: "neptune", label: "Neptune", emoji: "♆" },
    { name: "pluto", label: "Pluto", emoji: "♇" }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'major': return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'minor': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'major': return <AlertTriangle className="h-4 w-4" />;
      case 'moderate': return <TrendingUp className="h-4 w-4" />;
      case 'minor': return <Star className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPlanetEmoji = (planetName: string) => {
    const planet = planets.find(p => p.name.toLowerCase() === planetName.toLowerCase());
    return planet?.emoji || "🪐";
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {planets.map((planet) => (
            <Button
              key={planet.name}
              variant={selectedPlanet === planet.name ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPlanet(planet.name)}
              className="flex items-center gap-2"
            >
              <span>{planet.emoji}</span>
              <span>{planet.label}</span>
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          {["week", "month", "quarter", "year"].map((period) => (
            <Button
              key={period}
              variant={timeframe === period ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Active Transit Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="bg-white p-3 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getPlanetEmoji(alert.transit.planet)}</span>
                      <span className="font-medium">{alert.transit.planet} Transit</span>
                      <Badge className={`${getImpactColor(alert.transit.impact)} border`}>
                        {alert.transit.impact}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(alert.alertDate)}</span>
                  </div>
                  <p className="text-sm text-gray-700">{alert.personalizedMessage}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Transits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transits.map((transit) => (
          <Card key={transit.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getPlanetEmoji(transit.planet)}</span>
                  <div>
                    <CardTitle className="text-lg">{transit.planet}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {transit.fromSign} → {transit.toSign}
                    </p>
                  </div>
                </div>
                <Badge className={`${getImpactColor(transit.impact)} border`}>
                  {getImpactIcon(transit.impact)}
                  {transit.impact}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(transit.transitDate)}</span>
                {transit.endDate && (
                  <>
                    <span>→</span>
                    <span>{formatDate(transit.endDate)}</span>
                  </>
                )}
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">
                {transit.description}
              </p>

              {transit.affectedAreas.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Affected Areas:</h4>
                  <div className="flex flex-wrap gap-1">
                    {transit.affectedAreas.map((area, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {transit.aspects.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Planetary Aspects:</h4>
                  <div className="flex flex-wrap gap-1">
                    {transit.aspects.map((aspect, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {aspect}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {transit.recommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {transit.recommendations.slice(0, 2).map((rec, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-purple-500 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {transits.length === 0 && (
        <div className="text-center py-12">
          <Globe className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No Active Transits</h3>
          <p className="text-gray-600">
            There are no significant planetary transits for the selected timeframe.
          </p>
        </div>
      )}

      {/* Information Panel */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Understanding Planetary Transits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2 text-red-700">Major Transits</h4>
              <p className="text-gray-600">
                Outer planet movements that create significant life changes and long-term influences.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-yellow-700">Moderate Transits</h4>
              <p className="text-gray-600">
                Inner planet movements that bring noticeable shifts in daily life and emotions.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-green-700">Minor Transits</h4>
              <p className="text-gray-600">
                Fast-moving planet aspects that create brief but meaningful influences.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}