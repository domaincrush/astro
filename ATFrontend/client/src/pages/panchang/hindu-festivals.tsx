import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, Star, MapPin, Clock, Sun, Moon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Badge } from 'src/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select';
import AstroTickHeader from 'src/components/layout/AstroTickHeader';

interface Festival {
  name: string;
  date: string;
  description: string;
  significance: string;
  category: 'major' | 'minor' | 'ekadashi' | 'purnima' | 'amavasya';
  monthlyOccurrence?: boolean;
}

const HinduFestivals: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(false);

  const cities = [
    'Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bangalore', 'Hyderabad',
    'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Varanasi', 'Rishikesh'
  ];

  const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' },
    { value: 3, label: 'March' }, { value: 4, label: 'April' },
    { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' },
    { value: 9, label: 'September' }, { value: 10, label: 'October' },
    { value: 11, label: 'November' }, { value: 12, label: 'December' }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'major': return 'bg-red-100 text-red-800';
      case 'minor': return 'bg-blue-100 text-blue-800';
      case 'ekadashi': return 'bg-green-100 text-green-800';
      case 'purnima': return 'bg-yellow-100 text-yellow-800';
      case 'amavasya': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const fetchFestivals = async () => {
    setLoading(true);
    try {
      // For demo purposes, providing sample festival data
      const sampleFestivals: Festival[] = [
        {
          name: 'Makar Sankranti',
          date: '2025-01-14',
          description: 'Festival marking the transition of the sun into Capricorn',
          significance: 'Celebrates the end of winter solstice and beginning of longer days',
          category: 'major'
        },
        {
          name: 'Vasant Panchami',
          date: '2025-02-02',
          description: 'Festival dedicated to Goddess Saraswati',
          significance: 'Marks the arrival of spring and celebrates knowledge and wisdom',
          category: 'major'
        },
        {
          name: 'Maha Shivratri',
          date: '2025-02-26',
          description: 'Great night of Lord Shiva',
          significance: 'Most auspicious night for spiritual practices and devotion to Shiva',
          category: 'major'
        },
        {
          name: 'Holi',
          date: '2025-03-14',
          description: 'Festival of colors',
          significance: 'Celebrates the victory of good over evil and arrival of spring',
          category: 'major'
        },
        {
          name: 'Ram Navami',
          date: '2025-04-06',
          description: 'Birth anniversary of Lord Rama',
          significance: 'Celebrates the birth of Lord Rama, seventh avatar of Vishnu',
          category: 'major'
        },
        {
          name: 'Akshaya Tritiya',
          date: '2025-04-30',
          description: 'Auspicious day for new beginnings',
          significance: 'Considered highly auspicious for starting new ventures',
          category: 'major'
        },
        {
          name: 'Guru Purnima',
          date: '2025-07-13',
          description: 'Full moon day dedicated to spiritual teachers',
          significance: 'Honors gurus and spiritual guides',
          category: 'purnima'
        },
        {
          name: 'Krishna Janmashtami',
          date: '2025-08-16',
          description: 'Birth anniversary of Lord Krishna',
          significance: 'Celebrates the birth of Lord Krishna, eighth avatar of Vishnu',
          category: 'major'
        },
        {
          name: 'Ganesh Chaturthi',
          date: '2025-08-27',
          description: 'Festival of Lord Ganesha',
          significance: 'Celebrates the birth of Lord Ganesha, remover of obstacles',
          category: 'major'
        },
        {
          name: 'Navaratri',
          date: '2025-09-21',
          description: 'Nine nights dedicated to Goddess Durga',
          significance: 'Celebrates the divine feminine power and victory of good over evil',
          category: 'major'
        },
        {
          name: 'Diwali',
          date: '2025-10-20',
          description: 'Festival of lights',
          significance: 'Celebrates the return of Lord Rama and victory of light over darkness',
          category: 'major'
        },
        {
          name: 'Ekadashi',
          date: 'Monthly',
          description: 'Eleventh day of lunar fortnight',
          significance: 'Auspicious for fasting and spiritual practices',
          category: 'ekadashi',
          monthlyOccurrence: true
        }
      ];

      const filteredFestivals = sampleFestivals.filter(festival => {
        if (festival.monthlyOccurrence) return true;
        const festivalMonth = new Date(festival.date).getMonth() + 1;
        return festivalMonth === selectedMonth;
      });

      setFestivals(filteredFestivals);
    } catch (error) {
      console.error('Error fetching festivals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFestivals();
  }, [selectedMonth, selectedCity]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <Helmet>
        <title>Hindu Festivals Calendar | AstroTick</title>
        <meta name="description" content="Complete calendar of Hindu festivals, ekadashi, purnima, amavasya and vratham dates with spiritual significance." />
        <meta name="keywords" content="hindu festivals, ekadashi, purnima, amavasya, diwali, holi, navratri, festival calendar" />
      </Helmet>
      
      <AstroTickHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Calendar className="h-8 w-8 text-orange-600" />
              <h1 className="text-4xl font-bold text-gray-900">Hindu Festivals</h1>
              <Star className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete calendar of Hindu festivals, ekadashi, purnima, amavasya and vratham dates
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
            <Card className="w-full max-w-xs">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Select Month</span>
                  </div>
                  <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(Number(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map(month => (
                        <SelectItem key={month.value} value={month.value.toString()}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="w-full max-w-xs">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>Select City</span>
                  </div>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Status */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-orange-100 to-red-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-orange-800">Today's Date</h3>
                    <p className="text-orange-600">{new Date().toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-lg font-semibold text-orange-800">Location</h3>
                    <p className="text-orange-600">{selectedCity}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Festivals List */}
          <div className="grid gap-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading festivals...</p>
              </div>
            ) : festivals.length > 0 ? (
              festivals.map((festival, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-900">{festival.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">
                            {festival.monthlyOccurrence ? 'Monthly Occurrence' : 
                             new Date(festival.date).toLocaleDateString('en-IN', { 
                               weekday: 'long', 
                               year: 'numeric', 
                               month: 'long', 
                               day: 'numeric' 
                             })}
                          </span>
                        </div>
                      </div>
                      <Badge className={getCategoryColor(festival.category)}>
                        {festival.category.charAt(0).toUpperCase() + festival.category.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Description</h4>
                        <p className="text-gray-700">{festival.description}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Spiritual Significance</h4>
                        <p className="text-gray-700">{festival.significance}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No festivals found for selected month</p>
              </div>
            )}
          </div>

          {/* Educational Content */}
          <div className="mt-12">
            <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
              <CardHeader>
                <CardTitle className="text-xl text-orange-800">About Hindu Festivals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Hindu festivals are deeply rooted in ancient traditions and astronomical observations. They follow the lunar calendar and are celebrated to honor deities, mark seasonal changes, and maintain spiritual harmony.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-2">Festival Categories</h4>
                      <ul className="space-y-1 text-sm">
                        <li><strong>Major Festivals:</strong> Diwali, Holi, Navratri, Durga Puja</li>
                        <li><strong>Ekadashi:</strong> Monthly spiritual fasting days</li>
                        <li><strong>Purnima:</strong> Full moon celebrations</li>
                        <li><strong>Amavasya:</strong> New moon observances</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-2">Spiritual Benefits</h4>
                      <ul className="space-y-1 text-sm">
                        <li>Purification of mind and soul</li>
                        <li>Community bonding and harmony</li>
                        <li>Connection with divine energies</li>
                        <li>Preservation of cultural heritage</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HinduFestivals;