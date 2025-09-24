import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Textarea } from "src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "src/components/ui/form";
import { Calendar, Clock, MapPin, User, Star, Download, FileText } from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { useToast } from "src/hooks/use-toast";

const reportFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select your gender",
  }),
  birthDate: z.string().min(1, "Birth date is required"),
  birthTime: z.string().min(1, "Birth time is required"),
  birthPlace: z.string().min(2, "Birth place is required"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  timezone: z.string().optional(),
  questions: z.string().optional(),
  reportType: z.enum(["basic", "comprehensive", "premium"], {
    required_error: "Please select a report type",
  }),
});

type ReportFormData = z.infer<typeof reportFormSchema>;

const reportTypes = [
  {
    value: "basic",
    name: "Basic Report",
    price: 199,
    originalPrice: 499,
    features: [
      "Birth chart analysis",
      "Planetary positions",
      "Basic predictions",
      "PDF format (10-15 pages)"
    ]
  },
  {
    value: "comprehensive",
    name: "Comprehensive Report",
    price: 399,
    originalPrice: 799,
    features: [
      "Detailed birth chart analysis",
      "Planetary positions & aspects",
      "Nakshatra analysis",
      "Dasha periods (10 years)",
      "Career & relationship guidance",
      "PDF format (25-30 pages)"
    ],
    popular: true
  },
  {
    value: "premium",
    name: "Premium Report",
    price: 599,
    originalPrice: 999,
    features: [
      "Complete astrological analysis",
      "Planetary positions & aspects",
      "Nakshatra & pada analysis",
      "Dasha periods (20+ years)",
      "Career, marriage & health timing",
      "Remedial measures",
      "Annual predictions",
      "PDF format (40+ pages)"
    ]
  }
];

export default function AstrologicalReportForm() {
  const [selectedReportType, setSelectedReportType] = useState<string>("comprehensive");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      reportType: "comprehensive",
      questions: ""
    },
  });

  const selectedReport = reportTypes.find(type => type.value === selectedReportType);

  const handleLocationSearch = async (query: string) => {
    if (query.length < 3) return;
    
    try {
      const response = await fetch(`/api/locations/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const locations = await response.json();
        if (locations.length > 0) {
          const location = locations[0];
          form.setValue('latitude', location.latitude.toString());
          form.setValue('longitude', location.longitude.toString());
          form.setValue('timezone', location.timezone);
        }
      }
    } catch (error) {
      console.error('Location search error:', error);
    }
  };

  const onSubmit = async (data: ReportFormData) => {
    setIsSubmitting(true);
    
    try {
      // Prepare payment data for astrological report
      const selectedReportData = reportTypes.find(type => type.value === data.reportType);
      
      if (selectedReportData) {
        const formData = encodeURIComponent(JSON.stringify(data));
        
        // Create payment with PayU
        const response = await fetch('/api/payment/astrological-report/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: selectedReportData.price,
            formData: formData,
            packageName: selectedReportData.name,
            description: `Professional ${selectedReportData.name} with detailed birth chart analysis`
          }),
        });

        if (response.ok) {
          const paymentData = await response.json();
          
          // Create PayU form and submit
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = 'https://secure.payu.in/_payment';
          
          Object.keys(paymentData).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = paymentData[key];
            form.appendChild(input);
          });
          
          document.body.appendChild(form);
          form.submit();
        } else {
          throw new Error('Failed to create payment');
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
      <AstroTickHeader />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Professional <span className="text-purple-600">Astrological Report</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Get your comprehensive Vedic astrology analysis with detailed birth chart, 
            planetary positions, and personalized predictions in a professional PDF format.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Report Type Selection */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Choose Your Report
                </CardTitle>
                <CardDescription>
                  Select the report type that best suits your needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {reportTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedReportType === type.value
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => {
                      setSelectedReportType(type.value);
                      form.setValue('reportType', type.value as any);
                    }}
                  >
                    {type.popular && (
                      <div className="absolute -top-2 -right-2 bg-purple-500 text-white px-2 py-1 text-xs rounded-full">
                        Popular
                      </div>
                    )}
                    
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg">{type.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-purple-600">₹{type.price}</span>
                        <span className="text-lg text-gray-500 line-through">₹{type.originalPrice}</span>
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        Save ₹{type.originalPrice - type.price} ({Math.round(((type.originalPrice - type.price) / type.originalPrice) * 100)}% off)
                      </div>
                    </div>
                    
                    <ul className="space-y-2">
                      {type.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Star className="w-3 h-3 text-purple-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal & Birth Information
                </CardTitle>
                <CardDescription>
                  Please provide accurate birth details for precise astrological calculations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormDescription>
                              Report will be sent to this email
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 9876543210" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Birth Information */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Birth Details
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="birthDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Birth Date *</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="birthTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Birth Time *</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormDescription>
                                Exact time for accurate calculations
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="birthPlace"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Birth Place *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="City, State, Country" 
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleLocationSearch(e.target.value);
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Enter your birth city for location coordinates
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Questions Section */}
                    <div className="border-t pt-6">
                      <FormField
                        control={form.control}
                        name="questions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Specific Questions (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Do you have any specific questions about career, relationships, health, or other life areas?"
                                rows={4}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Add any specific areas you'd like the report to focus on
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t">
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">Selected: {selectedReport?.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Professional PDF report delivered via email
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-purple-600">₹{selectedReport?.price}</div>
                            <div className="text-sm text-gray-500 line-through">₹{selectedReport?.originalPrice}</div>
                          </div>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5 mr-2" />
                            Proceed to Payment - ₹{selectedReport?.price}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}