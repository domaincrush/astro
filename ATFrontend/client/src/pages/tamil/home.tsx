import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import TamilHeader from 'src/components/layout/TamilHeader';
import LocationSearch from 'src/components/LocationSearch';
import Footer from 'src/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs';
import { Badge } from 'src/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from 'src/components/ui/avatar';
import { 
  Star, Heart, Play, MessageCircle, Crown, Sparkles, 
  Calendar, Clock, Users, Award, MapPin, Phone, TrendingUp, Shield,
  ChevronRight, BookOpen, Gift, Target, Zap, Globe, CheckCircle,
  ArrowRight, BarChart3, Compass, Sun, Timer, PhoneCall, Video,
  Lightbulb, Gem, Hand, Hash, Home as HomeIcon, Calculator, Building,
  DollarSign, Plane, FileSpreadsheet
} from 'lucide-react';

// Tamil Birth Chart Form Schema
const tamilKundliFormSchema = z.object({
  name: z.string().min(2, 'பெயர் குறைந்தது 2 எழுத்துகள் இருக்க வேண்டும்'),
  birthDate: z.string().min(1, 'பிறந்த தேதி தேவை'),
  birthTime: z.string().min(1, 'பிறந்த நேரம் தேவை'),
  birthPlace: z.string().min(1, 'பிறந்த இடம் தேவை'),
  gender: z.enum(['male', 'female'], { required_error: 'பாலினம் தேர்ந்தெடுக்கவும்' })
});

// Tamil Kundli Matching Form Schema
const tamilMatchingFormSchema = z.object({
  boyName: z.string().min(2, 'மணமகன் பெயர் தேவை'),
  boyBirthDate: z.string().min(1, 'மணமகன் பிறந்த தேதி தேவை'),
  boyBirthTime: z.string().min(1, 'மணமகன் பிறந்த நேரம் தேவை'),
  boyBirthPlace: z.string().min(1, 'மணமகன் பிறந்த இடம் தேவை'),
  girlName: z.string().min(2, 'மணமகள் பெயர் தேவை'),
  girlBirthDate: z.string().min(1, 'மணமகள் பிறந்த தேதி தேவை'),
  girlBirthTime: z.string().min(1, 'மணமகள் பிறந்த நேரம் தேவை'),
  girlBirthPlace: z.string().min(1, 'மணமகள் பிறந்த இடம் தேவை')
});

const TamilHomePage = () => {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('generate');

  // Tamil Kundli Form
  const tamilKundliForm = useForm<z.infer<typeof tamilKundliFormSchema>>({
    resolver: zodResolver(tamilKundliFormSchema),
    defaultValues: {
      name: '',
      birthDate: '',
      birthTime: '',
      birthPlace: '',
      gender: 'male'
    }
  });

  // Tamil Matching Form
  const tamilMatchingForm = useForm<z.infer<typeof tamilMatchingFormSchema>>({
    resolver: zodResolver(tamilMatchingFormSchema),
    defaultValues: {
      boyName: '',
      boyBirthDate: '',
      boyBirthTime: '',
      boyBirthPlace: '',
      girlName: '',
      girlBirthDate: '',
      girlBirthTime: '',
      girlBirthPlace: ''
    }
  });

  // State for location coordinates
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const [matchingCoordinates, setMatchingCoordinates] = useState({
    boy: { latitude: 0, longitude: 0 },
    girl: { latitude: 0, longitude: 0 }
  });

  // Form Handlers
  const onTamilKundliSubmit = (values: z.infer<typeof tamilKundliFormSchema>) => {
    console.log('Tamil Kundli Form:', values);
    setLocation('/tamil/kundli-results');
  };

  const onTamilMatchingSubmit = (values: z.infer<typeof tamilMatchingFormSchema>) => {
    console.log('Tamil Matching Form:', values);
    setLocation('/tamil/kundli-matching?matched=true');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <Helmet>
        <title>இலவச தமிழ் ஜோதிடம் | Tamil Astrology - AstroTick</title>
        <meta name="description" content="இலவச தமிழ் ஜாதகம், திருமண பொருத்தம், ராசி பலன்கள், நிபுணர் ஜோதிடர் ஆலோசனை. வேத ஜோதிடத்தின் மூலம் உங்கள் எதிர்காலத்தை அறியுங்கள். AstroTick Tamil." />
        <meta property="og:title" content="இலவச தமிழ் ஜோதிடம் | Tamil Astrology - AstroTick" />
        <meta property="og:description" content="இலவச தமிழ் ஜாதகம், திருமண பொருத்தம், ராசி பலன்கள், நிபுணர் ஜோதிடர் ஆலோசனை. வேத ஜோதிடத்தின் மூலம் உங்கள் எதிர்காலத்தை அறியுங்கள்." />
        <meta name="keywords" content="தமிழ் ஜோதிடம், இலவச ஜாதகம், திருமண பொருத்தம், ராசி பலன், Tamil astrology, free kundli Tamil, horoscope matching Tamil, AstroTick Tamil" />
        <link rel="canonical" href="https://astrotick.com/tamil" />
        <meta property="og:url" content="https://astrotick.com/tamil" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ta_IN" />
      </Helmet>
      <TamilHeader />
      
      {/* Tamil Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 text-sm font-medium mb-4">
              <Crown className="h-4 w-4 mr-2" />
              தமிழ் ஜோதிடம்
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              உங்கள் எதிர்காலத்தை அறியுங்கள்
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              வேத ஜோதிடத்தின் மூலம் உங்கள் வாழ்க்கையின் ரகசியங்களை கண்டறியுங்கள். 
              இலவச ஜாதகம், திருமண பொருத்தம், தினசரி ராசி பலன்கள் மற்றும் நிபுணர் ஆலோசனைகள்.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3"
                onClick={() => setLocation('/tamil/kundli')}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                இலவச ஜாதகம் உருவாக்கவும்
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-orange-200 text-orange-600 hover:bg-orange-50 px-8 py-3"
                onClick={() => setLocation('/tamil/astrologers')}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                ஜோதிடருடன் பேசுங்கள்
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                10L+ பயனர்கள்
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                நம்பகமான ஜோதிடர்கள்
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                100% தனியுரிமை
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tamil Kundli Generation Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-slate-800">
              இலவச தமிழ் ஜாதகம்
            </h2>
            <p className="text-lg text-slate-600">
              உங்கள் முழுமையான வேத ஜாதகத்தை உடனே பெறுங்கள்
            </p>
          </motion.div>

          <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-2xl p-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="generate" className="text-base">ஜாதகம் உருவாக்கவும்</TabsTrigger>
                    <TabsTrigger value="matching" className="text-base">திருமண பொருத்தம்</TabsTrigger>
                  </TabsList>

                  <TabsContent value="generate">
                    <Form {...tamilKundliForm}>
                      <form onSubmit={tamilKundliForm.handleSubmit(onTamilKundliSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={tamilKundliForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>பெயர்</FormLabel>
                                <FormControl>
                                  <Input placeholder="உங்கள் பெயர்" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={tamilKundliForm.control}
                            name="gender"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>பாலினம்</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="பாலினம் தேர்ந்தெடுக்கவும்" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="male">ஆண்</SelectItem>
                                    <SelectItem value="female">பெண்</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={tamilKundliForm.control}
                            name="birthDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>பிறந்த தேதி</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={tamilKundliForm.control}
                            name="birthTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>பிறந்த நேரம்</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={tamilKundliForm.control}
                          name="birthPlace"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>பிறந்த இடம்</FormLabel>
                              <FormControl>
                                <LocationSearch
                                  value={field.value}
                                  onChange={(location, latitude, longitude) => {
                                    field.onChange(location);
                                    if (latitude && longitude) {
                                      setCoordinates({ latitude, longitude });
                                    }
                                  }}
                                  placeholder="உங்கள் பிறந்த ஊர்..."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 text-lg font-semibold">
                          <Sparkles className="h-5 w-5 mr-2" />
                          என் ஜாதகத்தை உருவாக்கவும்
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>

                  <TabsContent value="matching">
                    <Form {...tamilMatchingForm}>
                      <form onSubmit={tamilMatchingForm.handleSubmit(onTamilMatchingSubmit)} className="space-y-6">
                        {/* Groom Details */}
                        <div className="bg-blue-50 p-6 rounded-xl">
                          <h3 className="text-lg font-semibold text-blue-900 mb-4">மணமகன் விவரங்கள்</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={tamilMatchingForm.control}
                              name="boyName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>பெயர்</FormLabel>
                                  <FormControl>
                                    <Input placeholder="மணமகன் பெயர்" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={tamilMatchingForm.control}
                              name="boyBirthDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>பிறந்த தேதி</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={tamilMatchingForm.control}
                              name="boyBirthTime"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>பிறந்த நேரம்</FormLabel>
                                  <FormControl>
                                    <Input type="time" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={tamilMatchingForm.control}
                              name="boyBirthPlace"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>பிறந்த இடம்</FormLabel>
                                  <FormControl>
                                    <LocationSearch
                                      value={field.value}
                                      onChange={(location, latitude, longitude) => {
                                        field.onChange(location);
                                        if (latitude && longitude) {
                                          setMatchingCoordinates(prev => ({
                                            ...prev,
                                            boy: { latitude, longitude }
                                          }));
                                        }
                                      }}
                                      placeholder="மணமகன் பிறந்த ஊர்..."
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Bride Details */}
                        <div className="bg-pink-50 p-6 rounded-xl">
                          <h3 className="text-lg font-semibold text-pink-900 mb-4">மணமகள் விவரங்கள்</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={tamilMatchingForm.control}
                              name="girlName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>பெயர்</FormLabel>
                                  <FormControl>
                                    <Input placeholder="மணமகள் பெயர்" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={tamilMatchingForm.control}
                              name="girlBirthDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>பிறந்த தேதி</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={tamilMatchingForm.control}
                              name="girlBirthTime"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>பிறந்த நேரம்</FormLabel>
                                  <FormControl>
                                    <Input type="time" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={tamilMatchingForm.control}
                              name="girlBirthPlace"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>பிறந்த இடம்</FormLabel>
                                  <FormControl>
                                    <LocationSearch
                                      value={field.value}
                                      onChange={(location, latitude, longitude) => {
                                        field.onChange(location);
                                        if (latitude && longitude) {
                                          setMatchingCoordinates(prev => ({
                                            ...prev,
                                            girl: { latitude, longitude }
                                          }));
                                        }
                                      }}
                                      placeholder="மணமகள் பிறந்த ஊர்..."
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white py-3 text-lg font-semibold">
                          <Heart className="h-5 w-5 mr-2" />
                          பொருத்தம் சரிபார்க்கவும்
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tamil Zodiac Signs Section */}
      <section className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              இன்றைய ராசி பலன்கள்
            </h2>
            <p className="text-xl text-gray-600">
              உங்கள் ராசிக்கான இன்றைய நட்சத்திர கணிப்புகளை கண்டறியுங்கள்
            </p>
          </div>

          {/* Tamil Zodiac Signs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
            {[
              { english: 'aries', tamil: 'மேஷம்', transliteration: 'Mesham', icon: '♈', tamilUrl: 'mesham' },
              { english: 'taurus', tamil: 'ரிஷபம்', transliteration: 'Rishabam', icon: '♉', tamilUrl: 'rishabam' },
              { english: 'gemini', tamil: 'மிதுனம்', transliteration: 'Mithunam', icon: '♊', tamilUrl: 'mithunam' },
              { english: 'cancer', tamil: 'கடகம்', transliteration: 'Kadagam', icon: '♋', tamilUrl: 'karkatakam' },
              { english: 'leo', tamil: 'சிம்மம்', transliteration: 'Simmam', icon: '♌', tamilUrl: 'simham' },
              { english: 'virgo', tamil: 'கன்னி', transliteration: 'Kanni', icon: '♍', tamilUrl: 'kanyaa' },
              { english: 'libra', tamil: 'துலாம்', transliteration: 'Thulam', icon: '♎', tamilUrl: 'tulaam' },
              { english: 'scorpio', tamil: 'விருச்சிகம்', transliteration: 'Viruchigam', icon: '♏', tamilUrl: 'vrischikam' },
              { english: 'sagittarius', tamil: 'தனுசு', transliteration: 'Dhanusu', icon: '♐', tamilUrl: 'dhanusu' },
              { english: 'capricorn', tamil: 'மகரம்', transliteration: 'Magaram', icon: '♑', tamilUrl: 'makaram' },
              { english: 'aquarius', tamil: 'கும்பம்', transliteration: 'Kumbam', icon: '♒', tamilUrl: 'kumbham' },
              { english: 'pisces', tamil: 'மீனம்', transliteration: 'Meenam', icon: '♓', tamilUrl: 'meenam' }
            ].map((sign, index) => (
              <motion.div
                key={sign.english}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setLocation(`/tamil/daily-horoscope/${sign.tamilUrl}`)}
              >
                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100 hover:border-amber-200 text-center">
                  <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                      {sign.icon}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-amber-700 group-hover:text-amber-800">{sign.tamil}</h3>
                  <p className="text-xs text-amber-600 mt-1">{sign.transliteration}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              onClick={() => setLocation('/tamil/daily-horoscope')}
            >
              அனைத்து ராசி பலன்களையும் பார்க்கவும்
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Tamil Service Cards Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-slate-800">
              தமிழ் ஜோதிட சேவைகள்
            </h2>
            <p className="text-lg text-slate-600">
              உங்கள் அனைத்து ஜோதிட தேவைகளும் ஒரே இடத்தில்
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Panchang Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800">தமிழ் பஞ்சாங்கம்</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-6">
                    இன்றைய திதி, நட்சத்திரம், யோகம், கரணம் மற்றும் சுப முகூர்த்த காலங்கள்.
                  </p>
                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                    onClick={() => setLocation('/tamil/panchang')}
                  >
                    பஞ்சாங்கம் பார்க்கவும்
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Astrology Tools Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800">ஜோதிட கருவிகள்</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-6">
                    லக்ன கணக்கீடு, சந்திர ராசி, நட்சத்திர கண்டுபிடிப்பு மற்றும் பல கருவிகள்.
                  </p>
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                    onClick={() => setLocation('/tamil/astrology-tools')}
                  >
                    கருவிகளை பயன்படுத்தவும்
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Talk to Astrologers Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800">ஜோதிடருடன் பேசுங்கள்</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-6">
                    அனுபவமிக்க தமிழ் ஜோதிடர்களுடன் நேரடியாக பேசி உங்கள் கேள்விகளுக்கு விடை பெறுங்கள்.
                  </p>
                  <Button 
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                    onClick={() => setLocation('/tamil/astrologers')}
                  >
                    இப்போதே பேசுங்கள்
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tamil Featured Astrologers Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-slate-800">
              சிறந்த தமிழ் ஜோதிடர்கள்
            </h2>
            <p className="text-lg text-slate-600">
              அனுபவமிக்க மற்றும் நம்பகமான ஜோதிடர்களுடன் பேசுங்கள்
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Sample Tamil Astrologers */}
            {[
              { name: 'குரு ராமச்சந்திரன்', experience: '25+ ஆண்டுகள்', rating: '4.9', specialty: 'வேத ஜோதிடம்' },
              { name: 'ஸ்ரீ முருகன்', experience: '20+ ஆண்டுகள்', rating: '4.8', specialty: 'திருமண பொருத்தம்' },
              { name: 'அம்மா கமலா', experience: '30+ ஆண்டுகள்', rating: '4.9', specialty: 'குழந்தை பேறு' },
            ].map((astrologer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarImage src={`/api/placeholder/80/80`} alt={astrologer.name} />
                      <AvatarFallback className="text-lg font-semibold">
                        {astrologer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{astrologer.name}</h3>
                    <p className="text-slate-600 mb-2">{astrologer.specialty}</p>
                    <div className="flex items-center justify-center gap-4 text-sm text-slate-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        {astrologer.rating}
                      </span>
                      <span>{astrologer.experience}</span>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                      onClick={() => setLocation('/tamil/astrologers')}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      உடனே பேசுங்கள்
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
              onClick={() => setLocation('/tamil/astrologers')}
            >
              மேலும் ஜோதிடர்களை பார்க்கவும்
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TamilHomePage;