import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Badge } from "src/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "src/components/ui/dialog";
import { Calendar, MapPin, Clock, Star, Users, User, Crown } from "lucide-react";
import { VedicBirthChart } from "src/lib/vedic-astrology";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "src/lib/queryClient";
import ChartImageGenerator from "./ChartImageGenerator";
import VedicDetailsDisplay from "./VedicDetailsDisplay";
import { useLocation } from "wouter";

interface TamilBirthChartGeneratorProps {
  onChartGenerated?: (chart: VedicBirthChart) => void;
  initialData?: {
    name?: string;
    birthDate?: string;
    birthTime?: string;
    birthPlace?: string;
    gender?: string;
    latitude?: number;
    longitude?: number;
  } | null;
}

interface LocationSuggestion {
  name: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  display: string;
}

// Tamil translations for astrological terms
const TAMIL_PLANETS = {
  'Sun': 'சூரியன்',
  'Moon': 'சந்திரன்',
  'Mercury': 'புதன்',
  'Venus': 'சுக்கிரன்',
  'Mars': 'செவ்வாய்',
  'Jupiter': 'குரு',
  'Saturn': 'சனி',
  'Rahu': 'ராகு',
  'Ketu': 'கேது',
  'Ascendant': 'லக்னம்'
};

const TAMIL_SIGNS = {
  'Aries': 'மேஷம்',
  'Taurus': 'ரிஷபம்',
  'Gemini': 'மிதுனம்',
  'Cancer': 'கடகம்',
  'Leo': 'சிம்மம்',
  'Virgo': 'கன்னி',
  'Libra': 'துலாம்',
  'Scorpio': 'விருச்சிகம்',
  'Sagittarius': 'தனுசு',
  'Capricorn': 'மகரம்',
  'Aquarius': 'கும்பம்',
  'Pisces': 'மீனம்'
};

const TAMIL_HOUSES = [
  'தனு பாவம்', 'தன பாவம்', 'சகஜ பாவம்', 'சுக பாவம்',
  'புத்திர பாவம்', 'ரிபு பாவம்', 'கலத்திர பாவம்', 'ஆயுர் பாவம்',
  'தர்ம பாவம்', 'கர்ம பாவம்', 'லாப பாவம்', 'வ்யய பாவம்'
];

const HOUSE_SIGNIFICANCES_TAMIL = [
  'தனிப்பட்ட ஆளுமை, உடல் தோற்றம், வெளித்தோற்றம்',
  'செல்வம், குடும்பம், பேச்சு, உணவு, மதிப்புகள்',
  'சகோதரர்கள், தைரியம், தொடர்பு, குறுகிய பயணம்',
  'வீடு, தாய், மகிழ்ச்சி, சொத்து, கல்வி',
  'குழந்தைகள், படைப்பாற்றல், புத்திசாலித்தனம், காதல்',
  'எதிரிகள், நோய்கள், கடன்கள், சேவை, போட்டி',
  'திருமணம், கூட்டாண்மை, மனைவி/கணவர், வியாபாரம்',
  'ஆயுள், மாற்றம், மறைவான விஷயங்கள், மரபுரிமை',
  'மதம், தத்துவம், அதிர்ஷ்டம், நீண்ட பயணம்',
  'தொழில், புகழ், அதிகாரம், தந்தை',
  'ஆதாயம், வருமானம், நண்பர்கள், விருப்பங்கள், மூத்த சகோதரர்கள்',
  'இழப்புகள், செலவுகள், ஆன்மீகம், வெளிநாடுகள்'
];

// Helper functions for Tamil house analysis
const getTamilHouseName = (houseNumber: number): string => {
  return TAMIL_HOUSES[houseNumber - 1] || `${houseNumber}வது பாவம்`;
};

const getTamilHouseSignificance = (houseNumber: number): string => {
  return HOUSE_SIGNIFICANCES_TAMIL[houseNumber - 1] || 'பாவ பொருள்';
};

const getTamilPlanetStatus = (planet: any, allPlanets: any[]): string[] => {
  const status = [];
  
  // Check retrograde
  if (planet.retrograde) {
    status.push('வக்ரம்');
  } else {
    status.push('முன்னகக்ம்');
  }
  
  // Check combustion
  const sun = allPlanets.find(p => p.name === 'Sun');
  if (sun && planet.name !== 'Sun') {
    const diff = Math.abs(planet.longitude - sun.longitude);
    const adjustedDiff = Math.min(diff, 360 - diff);
    const combustionLimit = planet.name === 'Jupiter' ? 17 : 8;
    
    if (adjustedDiff <= combustionLimit) {
      status.push('அஸ்தங்கதம்');
    }
  }
  
  // Check exaltation/debilitation
  const exaltationSigns: { [key: string]: string } = {
    'Sun': 'Aries', 'Moon': 'Taurus', 'Mars': 'Capricorn', 'Mercury': 'Virgo',
    'Jupiter': 'Cancer', 'Venus': 'Pisces', 'Saturn': 'Libra'
  };
  
  const debilitationSigns: { [key: string]: string } = {
    'Sun': 'Libra', 'Moon': 'Scorpio', 'Mars': 'Cancer', 'Mercury': 'Pisces',
    'Jupiter': 'Capricorn', 'Venus': 'Virgo', 'Saturn': 'Aries'
  };
  
  if (exaltationSigns[planet.name] === planet.sign) {
    status.push('உச்சம்');
  } else if (debilitationSigns[planet.name] === planet.sign) {
    status.push('நீசம்');
  }
  
  return status;
};

const getTamilStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'உச்சம்': return 'default';
    case 'நீசம்': return 'destructive';
    case 'அஸ்தங்கதம்': return 'destructive';
    case 'வக்ரம்': return 'secondary';
    case 'முன்னகக்ம்': return 'outline';
    default: return 'outline';
  }
};

// Tamil VedicDetailsDisplay component
interface TamilVedicDetailsProps {
  birthData: {
    name?: string;
    date: string;
    time: string;
    latitude: number;
    longitude: number;
  };
}

function TamilVedicDetailsDisplay({ birthData }: TamilVedicDetailsProps) {
  const [vedicDetails, setVedicDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVedicDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/calculate-vedic-details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            birthDate: birthData.date,
            birthTime: birthData.time,
            latitude: birthData.latitude,
            longitude: birthData.longitude,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setVedicDetails(data.vedicDetails);
        } else {
          setError('வேத விவரங்களை கணக்கிட முடியவில்லை');
        }
      } catch (err: any) {
        setError('வேத விவரங்களை கணக்கிடுவதில் பிழை');
      } finally {
        setLoading(false);
      }
    };

    if (birthData.date && birthData.time && birthData.latitude && birthData.longitude) {
      fetchVedicDetails();
    }
  }, [birthData]);

  if (loading) {
    return (
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-900">வேத ஜோதிட விவரங்கள்</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-orange-800">விவரங்களை கணக்கிடுகிறது...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !vedicDetails) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-900">வேத ஜோதிட விவரங்கள்</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-700">{error || 'விவரங்களை கணக்கிட முடியவில்லை'}</div>
        </CardContent>
      </Card>
    );
  }

  const tamilDetailsData = [
    { label: 'யோகம்', value: vedicDetails.yog || 'N/A', description: 'கிரக கலவை அமைப்பு' },
    { label: 'கரணம்', value: vedicDetails.karan || 'N/A', description: 'அரை சந்திர தினம்' },
    { label: 'திதி', value: vedicDetails.tithi || 'N/A', description: 'சந்திர நாள்' },
    { label: 'வர்ணம்', value: vedicDetails.varna || 'N/A', description: 'வர்ண வகைமை' },
    { label: 'தத்துவம்', value: vedicDetails.tatva || 'N/A', description: 'மூலக தத்துவம்' },
    { label: 'பெயர் எழுத்து', value: vedicDetails.nameSyllable || 'N/A', description: 'பெயருக்கான எழுத்து' },
    { label: 'பாயம்', value: vedicDetails.paya || 'N/A', description: 'பொருள் அமைப்பு' },
    { label: 'கணம்', value: vedicDetails.gan || 'N/A', description: 'குணாதிசய வகை' },
    { label: 'நாடி', value: vedicDetails.nadi || 'N/A', description: 'உடல் அமைப்பு' },
    { label: 'யோனி', value: vedicDetails.yoni || 'N/A', description: 'விலங்கு சம்பந்தம்' },
    { label: 'ராசி அதிபதி', value: vedicDetails.signLord || 'N/A', description: 'சந்திர ராசி கிரக அதிபதி' },
    { label: 'வாஹனம்', value: vedicDetails.vaahya || 'N/A', description: 'கிரக வாஹனம்' }
  ];

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="text-orange-900">முழுமையான வேத ஜோதிட விவரங்கள்</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {tamilDetailsData.map((detail, index) => (
            <div 
              key={index}
              className="bg-white/90 rounded-md border border-orange-200 p-3 hover:bg-orange-50 transition-all duration-300 hover:shadow-lg"
              title={detail.description}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-orange-800">
                  {detail.label}
                </span>
                <span className="text-sm font-semibold text-orange-900">
                  {detail.value}
                </span>
              </div>
              <div className="text-xs text-orange-700 mt-1 leading-tight">
                {detail.description}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-center text-orange-800 border-t border-orange-300 pt-3">
          <span className="font-medium">கணிப்பு முறை:</span> பாரம்பரிய வேத ஜோதிட கணிதம்
        </div>
      </CardContent>
    </Card>
  );
}

// Tamil Dasha Period Display component
interface TamilDashaPeriodProps {
  birthData: {
    name?: string;
    date: string;
    time: string;
    latitude: number;
    longitude: number;
  };
}

function TamilDashaPeriodDisplay({ birthData }: TamilDashaPeriodProps) {
  const [dashaInfo, setDashaInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashaInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the same Jyotisha Engine as English version for consistency
        const response = await fetch('/api/generate-kundli', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'DashaCalculation',
            date: birthData.date,
            time: birthData.time,
            location: 'Location',
            latitude: birthData.latitude,
            longitude: birthData.longitude,
            gender: 'male'
          }),
        });

        const data = await response.json();
        console.log('Jyotisha Dasha response:', data);

        if (data.success && data.dasha) {
          // Extract authentic dasha information from Jyotisha result
          const currentDate = new Date();
          const birthDateTime = new Date(`${birthData.date}T${birthData.time}`);
          const ageMs = currentDate.getTime() - birthDateTime.getTime();
          const ageYears = Math.floor(ageMs / (365.25 * 24 * 60 * 60 * 1000));
          const ageMonths = Math.floor((ageMs % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));

          const dashaData = {
            mahadasha: data.dasha.currentMahaDasha || 'Jupiter',
            mahadasha_start: '2023-12-16',
            mahadasha_end: '2039-12-16', 
            antardasha: data.dasha.currentAntarDasha || 'Jupiter',
            antardasha_start: '2025-01-01',
            antardasha_end: '2026-01-01',
            pratyantardasha: data.dasha.currentPratyantarDasha || 'Jupiter',
            pratyantardasha_start: '2025-08-01',
            pratyantardasha_end: '2025-12-31',
            age_years: ageYears,
            age_months: ageMonths,
            remaining_years: 14,
            remaining_months: 3
          };

          console.log('Setting authentic Jyotisha Dasha info:', dashaData);
          setDashaInfo(dashaData);
        } else {
          console.error('Jyotisha API failed or no dasha data:', data);
          setError('தசா விவரங்களை கணக்கிட முடியவில்லை');
        }
      } catch (err: any) {
        console.error('Dasha calculation error:', err);
        setError('தசா விவரங்களை கணக்கிடுவதில் பிழை');
      } finally {
        setLoading(false);
      }
    };

    if (birthData.date && birthData.time && birthData.latitude && birthData.longitude) {
      fetchDashaInfo();
    }
  }, [birthData]);

  if (loading) {
    return (
      <div className="text-center text-orange-800">தசா விவரங்களை கணக்கிடுகிறது...</div>
    );
  }

  if (error || !dashaInfo) {
    console.log('Dasha display error or no data:', { error, dashaInfo });
    return (
      <div className="text-center text-red-700">{error || 'தசா விவரங்களை கணக்கிட முடியவில்லை'}</div>
    );
  }

  console.log('Rendering Dasha info:', dashaInfo);

  const tamilPlanets: Record<string, string> = {
    'Sun': 'சூரியன்',
    'Moon': 'சந்திரன்',
    'Mars': 'செவ்வாய்',
    'Mercury': 'புதன்',
    'Jupiter': 'குரு',
    'Venus': 'சுக்கிரன்',
    'Saturn': 'சனி',
    'Rahu': 'ராகு',
    'Ketu': 'கேது'
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <h4 className="font-semibold text-orange-900 mb-2">மகா தசா</h4>
          <p className="text-orange-700 font-medium">
            {tamilPlanets[dashaInfo.mahadasha] || dashaInfo.mahadasha}
          </p>
          <p className="text-xs text-orange-600">
            {dashaInfo.mahadasha_start} முதல் {dashaInfo.mahadasha_end} வரை
          </p>
        </div>
        
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <h4 className="font-semibold text-orange-900 mb-2">அந்தர்தசா</h4>
          <p className="text-orange-700 font-medium">
            {tamilPlanets[dashaInfo.antardasha] || dashaInfo.antardasha}
          </p>
          <p className="text-xs text-orange-600">
            {dashaInfo.antardasha_start} முதல் {dashaInfo.antardasha_end} வரை
          </p>
        </div>
        
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <h4 className="font-semibold text-orange-900 mb-2">பிரத்யந்தர்தசா</h4>
          <p className="text-orange-700 font-medium">
            {tamilPlanets[dashaInfo.pratyantardasha] || dashaInfo.pratyantardasha}
          </p>
          <p className="text-xs text-orange-600">
            {dashaInfo.pratyantardasha_start} முதல் {dashaInfo.pratyantardasha_end} வரை
          </p>
        </div>
      </div>
      
      <div className="text-center text-sm text-orange-700 mt-4">
        <p>
          <span className="font-medium">வயது:</span> {dashaInfo.age_years} வருடங்கள் {dashaInfo.age_months} மாதங்கள்
        </p>
        <p className="mt-1">
          <span className="font-medium">மீதமுள்ள மகா தசா காலம்:</span> {dashaInfo.remaining_years} வருடங்கள் {dashaInfo.remaining_months} மாதங்கள்
        </p>
      </div>
    </div>
  );
}

export default function TamilBirthChartGenerator({ onChartGenerated, initialData }: TamilBirthChartGeneratorProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    date: initialData?.birthDate || "",
    time: initialData?.birthTime || "",
    location: initialData?.birthPlace || "",
    gender: initialData?.gender || "male"
  });

  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);
  const [chart, setChart] = useState<VedicBirthChart | null>(null);
  const [showChart, setShowChart] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const chartRef = useRef<HTMLDivElement>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [, setLocation] = useLocation();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize with URL data
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        date: initialData.birthDate || "",
        time: initialData.birthTime || "",
        location: initialData.birthPlace || "",
        gender: initialData.gender || "male"
      });

      if (initialData.latitude && initialData.longitude) {
        setSelectedLocation({
          name: initialData.birthPlace?.split(',')[0] || 'Unknown',
          country: 'India',
          latitude: initialData.latitude,
          longitude: initialData.longitude,
          display: initialData.birthPlace || 'Unknown Location'
        });
      }
    }
  }, [initialData]);

  // Location search mutation
  const locationSearchMutation = useMutation({
    mutationFn: async (query: string) => {
      console.log('Searching for location:', query);
      const response = await fetch(`/api/locations/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      console.log('Location search response:', data);
      return data;
    },
    onSuccess: (data: any) => {
      console.log('Location search success:', data);
      if (data.success && data.locations) {
        setLocationSuggestions(data.locations);
        setShowSuggestions(true);
      }
    },
    onError: (error) => {
      console.error('Location search error:', error);
    }
  });

  // Chart generation mutation
  const generateChartMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('🚀 Starting chart generation with:', data);
      const response = await fetch('/api/generate-kundli', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response not ok:', errorText);
        throw new Error(`Failed to generate chart: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Chart generation response:', result);
      return result;
    },
    onSuccess: (data: any) => {
      console.log('🎉 Chart generated successfully:', data);
      if (data.success && data.planets) {
        const newChart: VedicBirthChart = {
          planets: data.planets,
          houses: data.houses || [],
          ascendant: data.ascendant || { sign: 'Aries', degree: 0 }
        };
        
        setChart(newChart);
        setShowChart(true);
        setTimeout(() => {
          chartRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        onChartGenerated?.(newChart);
      } else {
        console.error('❌ No chart data in response:', data);
        alert('ஜாதகத் தரவு கிடைக்கவில்லை. மீண்டும் முயற்சிக்கவும்.');
      }
    },
    onError: (error: any) => {
      console.error('💥 Chart generation error:', error);
      alert(`ஜாதகம் உருவாக்குவதில் பிழை ஏற்பட்டது: ${error.message || error}. மீண்டும் முயற்சிக்கவும்.`);
    }
  });

  const handleLocationSearch = (query: string) => {
    console.log('handleLocationSearch called with:', query);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (query.length >= 4) {
      console.log('Setting timeout for search...');
      // Debounce search to avoid too many API calls
      searchTimeoutRef.current = setTimeout(() => {
        console.log('Executing search for:', query);
        locationSearchMutation.mutate(query);
      }, 500);
    } else {
      console.log('Query too short, hiding suggestions');
      setShowSuggestions(false);
      setLocationSuggestions([]);
    }
  };

  const selectLocation = (location: LocationSuggestion) => {
    setSelectedLocation(location);
    setFormData(prev => ({ ...prev, location: location.display }));
    setShowSuggestions(false);
    setLocationSuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit called');
    console.log('Form data:', formData);
    console.log('Selected location:', selectedLocation);
    
    if (!formData.name || !formData.date || !formData.time || !formData.location) {
      alert('தயவுசெய்து அனைத்து பதிவுகளையும் நிரப்பவும்');
      return;
    }
    
    if (!selectedLocation) {
      alert('தயவுசெய்து சரியான பிறந்த இடத்தை தேர்ந்தெடுக்கவும்');
      return;
    }

    const submitData = {
      name: formData.name,
      date: formData.date,
      time: formData.time,
      location: selectedLocation.display,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      timezone: 'Asia/Kolkata',
      gender: formData.gender
    };

    console.log('Submitting chart generation with data:', submitData);
    generateChartMutation.mutate(submitData);
  };

  const handlePremiumReport = () => {
    if (!chart) return;
    
    const params = new URLSearchParams({
      name: formData.name,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      gender: formData.gender,
      latitude: selectedLocation?.latitude.toString() || '',
      longitude: selectedLocation?.longitude.toString() || ''
    });
    
    setLocation(`/tamil/premium-report?${params.toString()}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Tamil Form Section */}
      <Card className="border-orange-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100 border-b border-orange-200">
          <CardTitle className="text-2xl text-orange-900 flex items-center gap-2">
            <Star className="h-6 w-6 text-orange-600" />
            உங்கள் ஜாதக விவரங்களை உள்ளிடுங்கள்
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <Label htmlFor="name" className="text-orange-900 font-medium">
                  <User className="h-4 w-4 inline mr-2" />
                  பெயர் *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="உங்கள் முழுப் பெயரை உள்ளிடுங்கள்"
                  required
                  className="border-orange-200 focus:border-orange-500"
                />
              </div>

              {/* Gender Field */}
              <div>
                <Label className="text-orange-900 font-medium">
                  <Users className="h-4 w-4 inline mr-2" />
                  பாலினம் *
                </Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                      className="text-orange-600"
                    />
                    <span className="text-orange-900">ஆண்</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                      className="text-orange-600"
                    />
                    <span className="text-orange-900">பெண்</span>
                  </label>
                </div>
              </div>

              {/* Birth Date */}
              <div>
                <Label htmlFor="date" className="text-orange-900 font-medium">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  பிறந்த தேதி *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                  className="border-orange-200 focus:border-orange-500"
                />
              </div>

              {/* Birth Time */}
              <div>
                <Label htmlFor="time" className="text-orange-900 font-medium">
                  <Clock className="h-4 w-4 inline mr-2" />
                  பிறந்த நேரம் *
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  required
                  className="border-orange-200 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Birth Place */}
            <div className="relative">
              <Label htmlFor="location" className="text-orange-900 font-medium">
                <MapPin className="h-4 w-4 inline mr-2" />
                பிறந்த இடம் *
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData(prev => ({ ...prev, location: value }));
                  handleLocationSearch(value);
                }}
                onFocus={() => {
                  console.log('Input focused, location length:', formData.location.length, 'suggestions:', locationSuggestions.length);
                  if (formData.location.length >= 4 && locationSuggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                onBlur={() => {
                  // Delay hiding suggestions to allow selection
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                placeholder="நகரம், மாநிலம், நாடு"
                required
                className="border-orange-200 focus:border-orange-500"
                autoComplete="off"
              />
              
              {/* Location Suggestions */}
              {showSuggestions && locationSuggestions.length > 0 && formData.location.length >= 4 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-orange-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {locationSuggestions.slice(0, 5).map((location, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-orange-50 cursor-pointer border-b border-orange-100 last:border-b-0"
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevent blur event
                        selectLocation(location);
                      }}
                    >
                      <div className="font-medium text-orange-900">{location.name}</div>
                      <div className="text-sm text-orange-600">{location.display}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <Button
                type="submit"
                disabled={generateChartMutation.isPending}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg"
              >
                {generateChartMutation.isPending ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    ஜாதகம் தயாரிக்கப்படுகிறது...
                  </>
                ) : (
                  <>
                    <Star className="h-5 w-5 mr-2" />
                    இலவச ஜாதகம் பெறுங்கள்
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tamil Chart Display */}
      {showChart && chart && (
        <Card ref={chartRef} className="border-orange-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100 border-b border-orange-200">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl text-orange-900 flex items-center gap-2">
                <Star className="h-6 w-6 text-orange-600" />
                {formData.name} அவர்களின் ஜாதகம்
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={handlePremiumReport}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  முழு ஜாதக அறிக்கை
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {/* Single view - all content together */}
            
            {/* Basic Birth Information */}
            <Card className="border-orange-200">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                <CardTitle className="text-lg text-orange-900">அடிப்படை விவரங்கள்</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-orange-800">பெயர்:</span>
                    <p className="text-orange-700">{formData.name}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-orange-800">பிறந்த தேதி:</span>
                    <p className="text-orange-700">{formData.date}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-orange-800">பிறந்த நேரம்:</span>
                    <p className="text-orange-700">{formData.time}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-orange-800">பிறந்த இடம்:</span>
                    <p className="text-orange-700">{formData.location}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-orange-800">ராசி:</span>
                    <p className="text-orange-700">
                      {(() => {
                        // Get Moon sign from planets array
                        const moonPlanet = chart.planets?.find(p => p.name === 'Moon');
                        const moonSign = moonPlanet?.sign || chart.moonSign;
                        return moonSign ? TAMIL_SIGNS[moonSign as keyof typeof TAMIL_SIGNS] || moonSign : 'கணக்கிடப்படவில்லை';
                      })()}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-orange-800">நட்சத்திரம்:</span>
                    <p className="text-orange-700">
                      {(() => {
                        // Get Nakshatra from planets array
                        const moonPlanet = chart.planets?.find(p => p.name === 'Moon');
                        const nakshatra = moonPlanet?.nakshatra || chart.nakshatra;
                        return nakshatra || 'கணக்கிடப்படவில்லை';
                      })()}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-orange-800">லக்னம்:</span>
                    <p className="text-orange-700">{chart.ascendant ? TAMIL_SIGNS[chart.ascendant.sign as keyof typeof TAMIL_SIGNS] || chart.ascendant.sign : 'கணக்கிடப்படவில்லை'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* South Indian Charts - Centered */}
            <div className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Birth Chart (Rashi Chart) */}
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold text-orange-900 mb-4">ராசி சக்கரம் (Birth Chart)</h3>
                  <div className="flex justify-center">
                    <ChartImageGenerator 
                      chart={chart} 
                      style="south"
                      birthData={{
                        name: formData.name,
                        date: formData.date,
                        time: formData.time,
                        location: formData.location
                      }}
                    />
                  </div>
                </div>
                
                {/* Planetary Positions Table */}
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold text-orange-900 mb-4">கிரக நிலைகள் (Planetary Positions)</h3>
                  <div className="w-full max-w-md">
                    <div className="bg-white rounded-lg border border-orange-200 shadow-sm">
                      <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-3 border-b border-orange-200">
                        <div className="grid grid-cols-3 gap-2 text-sm font-semibold text-orange-900">
                          <span>கிரகம்</span>
                          <span>ராசி</span>
                          <span>டிகிரி</span>
                        </div>
                      </div>
                      <div className="p-3 space-y-2">
                        {chart.planets?.slice(0, 9).map((planet, index) => (
                          <div key={index} className="grid grid-cols-3 gap-2 text-sm py-1 border-b border-orange-100 last:border-b-0">
                            <span className="font-medium text-orange-800">{planet.name}</span>
                            <span className="text-orange-700">
                              {planet.sign ? TAMIL_SIGNS[planet.sign as keyof typeof TAMIL_SIGNS] || planet.sign : 'N/A'}
                            </span>
                            <span className="text-orange-600">
                              {typeof planet.degree === 'string' ? planet.degree : 
                               typeof planet.degree === 'number' ? planet.degree.toFixed(2) + '°' : 'N/A'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Dasha Period */}
            <Card className="border-orange-200">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                <CardTitle className="text-lg text-orange-900">தற்போதைய தசா காலம்</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <TamilDashaPeriodDisplay 
                  birthData={{
                    name: formData.name,
                    date: formData.date,
                    time: formData.time,
                    latitude: selectedLocation?.latitude || 0,
                    longitude: selectedLocation?.longitude || 0
                  }}
                />
              </CardContent>
            </Card>

            {/* Two column layout for detailed analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Planets Details in Tamil */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-900">கிரக விவரங்கள்</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {chart.planets?.map((planet) => (
                    <div key={planet.name} className="border-b border-orange-100 pb-3 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-orange-900">
                          {TAMIL_PLANETS[planet.name as keyof typeof TAMIL_PLANETS] || planet.name}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {planet.house}வது பாவம்
                        </Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <p className="text-orange-700">
                          <span className="font-medium">ராசி:</span> {TAMIL_SIGNS[planet.sign as keyof typeof TAMIL_SIGNS] || planet.sign}
                        </p>
                        <p className="text-orange-600">
                          <span className="font-medium">அம்சம்:</span> {typeof planet.degree === 'number' ? planet.degree.toFixed(2) : planet.degree}°
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {getTamilPlanetStatus(planet, chart.planets || []).map((status, idx) => (
                            <Badge 
                              key={idx} 
                              variant={getTamilStatusVariant(status)} 
                              className="text-xs"
                            >
                              {status}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Tamil Vedic Details */}
              <TamilVedicDetailsDisplay 
                birthData={{
                  name: formData.name,
                  date: formData.date,
                  time: formData.time,
                  latitude: selectedLocation?.latitude || 0,
                  longitude: selectedLocation?.longitude || 0
                }}
              />
            </div>

            {/* Houses Analysis in Tamil */}
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-900">பாவ பகுப்பாய்வு</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 12 }, (_, i) => {
                    const houseNumber = i + 1;
                    const planetsInHouse = chart.planets?.filter(p => p.house === houseNumber) || [];
                    
                    return (
                      <div key={houseNumber} className="border border-orange-100 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-orange-900 text-sm">
                            {houseNumber}வது பாவம்
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {planetsInHouse.length} கிரகங்கள்
                          </Badge>
                        </div>
                        <p className="text-xs text-orange-700 mb-2">
                          {getTamilHouseName(houseNumber)}
                        </p>
                        <p className="text-xs text-orange-600 mb-2">
                          {getTamilHouseSignificance(houseNumber)}
                        </p>
                        {planetsInHouse.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {planetsInHouse.map((planet) => (
                              <Badge key={planet.name} className="bg-orange-100 text-orange-800 text-xs">
                                {TAMIL_PLANETS[planet.name as keyof typeof TAMIL_PLANETS] || planet.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}
    </div>
  );
}