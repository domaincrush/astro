import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Badge } from 'src/components/ui/badge';
import { Input } from 'src/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select';
import { Calendar, Star, Gift, Flower, Sun, Moon, Sparkles, Search, Filter, Crown, Heart } from 'lucide-react';
import AstroTickHeader from 'src/components/layout/AstroTickHeader';
import Footer from 'src/components/layout/Footer';

export default function HinduFestivals() {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const months = [
    { value: 'all', label: 'All Months' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const festivals2025 = [
    // January 2025
    { date: '2025-01-01', name: 'New Year', type: 'Modern', significance: 'Gregorian New Year celebration', tithi: 'Pratipada', paksha: 'Shukla', month: 'Paush', color: 'from-blue-400 to-cyan-500' },
    { date: '2025-01-14', name: 'Makar Sankranti', type: 'Major', significance: 'Sun enters Capricorn, harvest festival', tithi: 'Pratipada', paksha: 'Shukla', month: 'Magh', color: 'from-orange-400 to-red-500' },
    { date: '2025-01-15', name: 'Pongal', type: 'Regional', significance: 'Tamil harvest festival', tithi: 'Dwitiya', paksha: 'Shukla', month: 'Magh', color: 'from-green-400 to-teal-500' },
    { date: '2025-01-26', name: 'Basant Panchami', type: 'Religious', significance: 'Goddess Saraswati worship', tithi: 'Panchami', paksha: 'Shukla', month: 'Magh', color: 'from-yellow-400 to-orange-500' },
    
    // February 2025
    { date: '2025-02-12', name: 'Maha Shivratri', type: 'Major', significance: 'Great night of Lord Shiva', tithi: 'Chaturdashi', paksha: 'Krishna', month: 'Phalgun', color: 'from-purple-400 to-indigo-500' },
    { date: '2025-02-13', name: 'Holi (Holika Dahan)', type: 'Major', significance: 'Bonfire night before Holi', tithi: 'Purnima', paksha: 'Shukla', month: 'Phalgun', color: 'from-pink-400 to-rose-500' },
    { date: '2025-02-14', name: 'Holi', type: 'Major', significance: 'Festival of colors', tithi: 'Pratipada', paksha: 'Krishna', month: 'Chaitra', color: 'from-pink-400 to-rose-500' },
    
    // March 2025
    { date: '2025-03-14', name: 'Ugadi/Gudi Padwa', type: 'Regional', significance: 'Telugu/Marathi New Year', tithi: 'Pratipada', paksha: 'Shukla', month: 'Chaitra', color: 'from-green-400 to-teal-500' },
    { date: '2025-03-30', name: 'Chaitra Navratri Begins', type: 'Religious', significance: '9 nights of Goddess Durga', tithi: 'Pratipada', paksha: 'Shukla', month: 'Chaitra', color: 'from-orange-400 to-red-500' },
    
    // April 2025
    { date: '2025-04-06', name: 'Rama Navami', type: 'Major', significance: 'Lord Rama\'s birth anniversary', tithi: 'Navami', paksha: 'Shukla', month: 'Chaitra', color: 'from-orange-400 to-red-500' },
    { date: '2025-04-07', name: 'Chaitra Navratri Ends', type: 'Religious', significance: 'Last day of 9-day festival', tithi: 'Navami', paksha: 'Shukla', month: 'Chaitra', color: 'from-orange-400 to-red-500' },
    { date: '2025-04-14', name: 'Baisakhi', type: 'Regional', significance: 'Sikh New Year, harvest festival', tithi: 'Pratipada', paksha: 'Shukla', month: 'Vaisakha', color: 'from-yellow-400 to-orange-500' },
    { date: '2025-04-18', name: 'Hanuman Jayanti', type: 'Religious', significance: 'Lord Hanuman\'s birth anniversary', tithi: 'Purnima', paksha: 'Shukla', month: 'Chaitra', color: 'from-red-400 to-orange-500' },
    
    // May 2025
    { date: '2025-05-23', name: 'Buddha Purnima', type: 'Religious', significance: 'Lord Buddha\'s birth anniversary', tithi: 'Purnima', paksha: 'Shukla', month: 'Vaisakha', color: 'from-blue-400 to-cyan-500' },
    
    // June 2025
    { date: '2025-06-21', name: 'Jagannath Rath Yatra', type: 'Religious', significance: 'Chariot procession of Lord Jagannath', tithi: 'Dwitiya', paksha: 'Shukla', month: 'Ashadha', color: 'from-yellow-400 to-orange-500' },
    
    // July 2025
    { date: '2025-07-16', name: 'Guru Purnima', type: 'Religious', significance: 'Teacher appreciation day', tithi: 'Purnima', paksha: 'Shukla', month: 'Ashadha', color: 'from-purple-400 to-indigo-500' },
    
    // August 2025
    { date: '2025-08-09', name: 'Raksha Bandhan', type: 'Major', significance: 'Brother-sister bond celebration', tithi: 'Purnima', paksha: 'Shukla', month: 'Shravana', color: 'from-pink-400 to-rose-500' },
    { date: '2025-08-16', name: 'Janmashtami', type: 'Major', significance: 'Lord Krishna\'s birth anniversary', tithi: 'Ashtami', paksha: 'Krishna', month: 'Bhadrapada', color: 'from-blue-400 to-cyan-500' },
    { date: '2025-08-29', name: 'Ganesh Chaturthi', type: 'Major', significance: 'Lord Ganesha\'s birth anniversary', tithi: 'Chaturthi', paksha: 'Shukla', month: 'Bhadrapada', color: 'from-orange-400 to-red-500' },
    
    // September 2025
    { date: '2025-09-07', name: 'Anant Chaturdashi', type: 'Religious', significance: 'Ganesh Visarjan day', tithi: 'Chaturdashi', paksha: 'Shukla', month: 'Bhadrapada', color: 'from-orange-400 to-red-500' },
    { date: '2025-09-17', name: 'Pitru Paksha Begins', type: 'Religious', significance: 'Fortnight for ancestor worship', tithi: 'Pratipada', paksha: 'Krishna', month: 'Ashwin', color: 'from-gray-400 to-slate-500' },
    
    // October 2025
    { date: '2025-10-01', name: 'Pitru Paksha Ends', type: 'Religious', significance: 'Last day of ancestor worship', tithi: 'Amavasya', paksha: 'Krishna', month: 'Ashwin', color: 'from-gray-400 to-slate-500' },
    { date: '2025-10-02', name: 'Sharad Navratri Begins', type: 'Major', significance: '9 nights of Goddess Durga', tithi: 'Pratipada', paksha: 'Shukla', month: 'Ashwin', color: 'from-orange-400 to-red-500' },
    { date: '2025-10-10', name: 'Dussehra', type: 'Major', significance: 'Victory of good over evil', tithi: 'Dashami', paksha: 'Shukla', month: 'Ashwin', color: 'from-orange-400 to-red-500' },
    { date: '2025-10-20', name: 'Karva Chauth', type: 'Religious', significance: 'Wives fast for husbands\' longevity', tithi: 'Chaturthi', paksha: 'Krishna', month: 'Kartik', color: 'from-pink-400 to-rose-500' },
    
    // November 2025
    { date: '2025-11-01', name: 'Dhanteras', type: 'Major', significance: 'Diwali celebrations begin', tithi: 'Trayodashi', paksha: 'Krishna', month: 'Kartik', color: 'from-yellow-400 to-orange-500' },
    { date: '2025-11-02', name: 'Naraka Chaturdashi', type: 'Major', significance: 'Chhoti Diwali', tithi: 'Chaturdashi', paksha: 'Krishna', month: 'Kartik', color: 'from-yellow-400 to-orange-500' },
    { date: '2025-11-03', name: 'Diwali', type: 'Major', significance: 'Festival of lights', tithi: 'Amavasya', paksha: 'Krishna', month: 'Kartik', color: 'from-yellow-400 to-orange-500' },
    { date: '2025-11-04', name: 'Govardhan Puja', type: 'Religious', significance: 'Mountain worship, Annakut', tithi: 'Pratipada', paksha: 'Shukla', month: 'Kartik', color: 'from-green-400 to-teal-500' },
    { date: '2025-11-05', name: 'Bhai Dooj', type: 'Religious', significance: 'Brother-sister celebration', tithi: 'Dwitiya', paksha: 'Shukla', month: 'Kartik', color: 'from-pink-400 to-rose-500' },
    { date: '2025-11-15', name: 'Tulsi Vivah', type: 'Religious', significance: 'Marriage of Tulsi with Lord Vishnu', tithi: 'Dwadashi', paksha: 'Shukla', month: 'Kartik', color: 'from-green-400 to-teal-500' },
    
    // December 2025
    { date: '2025-12-25', name: 'Christmas', type: 'Modern', significance: 'Christian festival', tithi: 'Purnima', paksha: 'Shukla', month: 'Paush', color: 'from-red-400 to-green-500' },
    { date: '2025-12-31', name: 'New Year\'s Eve', type: 'Modern', significance: 'Year-end celebration', tithi: 'Saptami', paksha: 'Shukla', month: 'Paush', color: 'from-blue-400 to-cyan-500' }
  ];

  const festivalTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'Major', label: 'Major Festivals' },
    { value: 'Religious', label: 'Religious Observances' },
    { value: 'Regional', label: 'Regional Celebrations' },
    { value: 'Modern', label: 'Modern Celebrations' }
  ];

  const filteredFestivals = festivals2025.filter(festival => {
    const matchesMonth = selectedMonth === 'all' || new Date(festival.date).getMonth() + 1 === parseInt(selectedMonth);
    const matchesType = selectedType === 'all' || festival.type === selectedType;
    const matchesSearch = !searchTerm || 
      festival.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      festival.significance.toLowerCase().includes(searchTerm.toLowerCase()) ||
      festival.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMonth && matchesType && matchesSearch;
  });

  const festivalStats = {
    total: festivals2025.length,
    major: festivals2025.filter(f => f.type === 'Major').length,
    religious: festivals2025.filter(f => f.type === 'Religious').length,
    regional: festivals2025.filter(f => f.type === 'Regional').length,
    modern: festivals2025.filter(f => f.type === 'Modern').length
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'Major': return Crown;
      case 'Religious': return Heart;
      case 'Regional': return Flower;
      case 'Modern': return Star;
      default: return Calendar;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <AstroTickHeader />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full shadow-lg">
                <Star className="h-8 w-8 text-white" />
              </div>
              <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Hindu Festivals 2025
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Complete calendar of Hindu festivals with authentic Panchang details, significance, and traditional observances
            </p>
          </motion.div>

          {/* Festival Statistics */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12"
          >
            {[
              { label: 'Total Festivals', count: festivalStats.total, color: 'from-blue-500 to-purple-600', icon: Calendar },
              { label: 'Major Festivals', count: festivalStats.major, color: 'from-orange-500 to-red-600', icon: Crown },
              { label: 'Religious', count: festivalStats.religious, color: 'from-purple-500 to-indigo-600', icon: Heart },
              { label: 'Regional', count: festivalStats.regional, color: 'from-green-500 to-teal-600', icon: Flower },
              { label: 'Modern', count: festivalStats.modern, color: 'from-blue-500 to-cyan-600', icon: Star }
            ].map((stat, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} mb-3`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">{stat.count}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-orange-600 flex items-center justify-center gap-2">
                  <Filter className="h-6 w-6" />
                  Filter Festivals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger className="bg-white border-gray-300">
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map(month => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="bg-white border-gray-300">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {festivalTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Search festivals..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white border-gray-300"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    Showing {filteredFestivals.length} of {festivals2025.length} festivals
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Festivals Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredFestivals.map((festival, index) => {
              const IconComponent = getTypeIcon(festival.type);
              return (
                <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardHeader className={`bg-gradient-to-r ${festival.color} text-white rounded-t-lg`}>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <IconComponent className="h-6 w-6" />
                        {festival.name}
                      </CardTitle>
                      <Badge className="bg-white/20 text-white border-white/30">
                        {festival.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">{formatDate(festival.date)}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-orange-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-800">Significance</p>
                          <p className="text-sm text-gray-600">{festival.significance}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Tithi</p>
                        <p className="font-semibold text-gray-800">{festival.tithi}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Paksha</p>
                        <p className="font-semibold text-gray-800">{festival.paksha}</p>
                      </div>
                    </div>

                    <div className="text-center pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500">Vedic Month</p>
                      <p className="font-semibold text-gray-800">{festival.month}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>

          {/* No Results Message */}
          {filteredFestivals.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No festivals found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters</p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}