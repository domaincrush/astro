import { useState } from "react";
import { Star, MessageCircle, Phone, Video, Clock, Users, Award, CheckCircle } from "lucide-react";
import { Card, CardContent } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "src/components/ui/dialog";
import { Astrologer } from "@shared/schema";
import { useLocation } from "wouter";
import { useAuth } from "src/hooks/useAuth";
import QueueStatus from "src/components/QueueStatus";
import { getAstrologerUrl } from "src/utils/seoUtils";

interface EnhancedAstrologerCardProps {
  astrologer: Astrologer;
  onStartChat?: () => void;
}

interface ConsultationPackage {
  type: 'chat' | 'call' | 'video';
  duration: number;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
}

export default function EnhancedAstrologerCard({ astrologer, onStartChat }: EnhancedAstrologerCardProps) {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<ConsultationPackage | null>(null);
  const [showConsultationDialog, setShowConsultationDialog] = useState(false);

  const handleViewProfile = () => {
    setLocation(getAstrologerUrl(astrologer.name));
  };

  const handleBookConsultation = (pkg: ConsultationPackage) => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }
    
    // Redirect to payment page with consultation details
    const paymentParams = new URLSearchParams({
      astrologer: astrologer.id.toString(),
      service: pkg.type,
      duration: pkg.duration.toString(),
      price: pkg.discountedPrice.toString(),
      originalPrice: pkg.originalPrice.toString(),
      type: 'consultation'
    });
    
    setLocation(`/payment?${paymentParams.toString()}`);
  };

  const handleConsultationStart = (consultationId: number) => {
    setShowConsultationDialog(false);
    setLocation(`/chat/${consultationId}`);
  };

  // Calculate consultation packages with discounts - ratePerMinute is in rupees
  const packages: ConsultationPackage[] = [
    {
      type: 'chat',
      duration: 20,
      originalPrice: astrologer.ratePerMinute * 20, // Already in rupees
      discountedPrice: Math.round(astrologer.ratePerMinute * 20 * 0.85), // 15% discount
      discount: 15
    },
    {
      type: 'call',
      duration: 15,
      originalPrice: astrologer.ratePerMinute * 15, // Already in rupees
      discountedPrice: Math.round(astrologer.ratePerMinute * 15 * 0.9), // 10% discount
      discount: 10
    },
    {
      type: 'video',
      duration: 30,
      originalPrice: astrologer.ratePerMinute * 30, // Already in rupees
      discountedPrice: Math.round(astrologer.ratePerMinute * 30 * 0.8), // 20% discount
      discount: 20
    }
  ];

  const reviewCount = astrologer.reviewCount || Math.floor(astrologer.totalConsultations * 0.3);

  return (
    <>
      <Card 
        className="group hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white overflow-hidden rounded-lg cursor-pointer"
        onClick={(e) => {
          // Prevent navigation when clicking on buttons or interactive elements
          if (e.target instanceof Element && e.target.closest('button, [role="button"]')) {
            e.stopPropagation();
            return;
          }
          handleViewProfile();
        }}
      >
        <CardContent className="p-4">
          {/* Header with image and basic info */}
          <div className="flex items-start gap-4 mb-3">
            {/* Profile Image with online indicator */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
                {astrologer.image ? (
                  <img 
                    src={astrologer.image} 
                    alt={astrologer.name}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('?retry=')) {
                        target.src = `${astrologer.image}?retry=${Date.now()}`;
                        return;
                      }
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `<div class="w-full h-full bg-purple-200 flex items-center justify-center"><span class="text-purple-600 text-2xl">${astrologer.name.charAt(0)}</span></div>`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-purple-200 flex items-center justify-center">
                    <Star className="w-8 h-8 text-purple-600" />
                  </div>
                )}
              </div>
              {/* Online/Offline Status Indicator */}
              <div className={`absolute -top-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${
                astrologer.isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`} title={astrologer.isOnline ? 'Online' : 'Offline'}></div>
            </div>

            {/* Name, Rating, Experience */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 truncate">{astrologer.name}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs px-2 py-1 h-auto border-blue-300 text-blue-600 hover:bg-blue-50"
                  onClick={handleViewProfile}
                >
                  + Follow
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <div className="flex items-center gap-1">
                  <span className="text-blue-600">🗣️</span>
                  <span>{Array.isArray(astrologer.languages) ? astrologer.languages.slice(0, 2).join(", ") : astrologer.languages}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{astrologer.experience} Years</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-orange-500">🔮</span>
                  <span>{Array.isArray(astrologer.specializations) ? astrologer.specializations[0] : astrologer.specializations}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between mb-3 text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{astrologer.rating}</span>
              <span className="text-gray-400">| {reviewCount}</span>
            </div>
            <div className="flex items-center gap-1 text-blue-600">
              <Users className="w-3 h-3" />
              <span className="font-medium">{astrologer.totalConsultations}</span>
            </div>
          </div>

          {/* Quick Service Options */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {packages.map((pkg) => (
              <Button
                key={pkg.type}
                variant="outline"
                size="sm"
                className={`flex flex-col items-center py-3 h-auto ${
                  astrologer.isOnline 
                    ? 'hover:bg-blue-50 hover:border-blue-300' 
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
                onClick={() => astrologer.isOnline && handleBookConsultation(pkg)}
                disabled={!astrologer.isOnline}
              >
                {pkg.type === 'chat' && <MessageCircle className="w-4 h-4 mb-1" />}
                {pkg.type === 'call' && <Phone className="w-4 h-4 mb-1" />}
                {pkg.type === 'video' && <Video className="w-4 h-4 mb-1" />}
                <span className="text-xs font-medium capitalize">
                  {astrologer.isOnline ? pkg.type : 'Offline'}
                </span>
                <span className="text-xs text-gray-600">{pkg.duration}min</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-green-600">₹{pkg.discountedPrice}</span>
                  <span className="text-xs text-gray-400 line-through">₹{pkg.originalPrice}</span>
                </div>
              </Button>
            ))}
          </div>

          {/* Premium Features */}
          <div className="flex items-center gap-2 mb-3">
            {astrologer.ratePerMinute >= 35 && (
              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                <Award className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
            {/* Status Badge */}
            <Badge variant="secondary" className={`text-xs ${
              astrologer.isOnline 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              <CheckCircle className="w-3 h-3 mr-1" />
              {astrologer.isOnline ? 'Available' : 'Offline'}
            </Badge>
          </div>

          {/* Pricing Info */}
          <div className="text-center">
            <div className="text-sm text-gray-600">Starting from</div>
            <div className="text-lg font-bold text-blue-600">₹{astrologer.ratePerMinute}/min</div>
          </div>
        </CardContent>
      </Card>

      {/* Consultation Dialog with Queue Integration */}
      <Dialog open={showConsultationDialog} onOpenChange={setShowConsultationDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                {astrologer.image ? (
                  <img src={astrologer.image} alt={astrologer.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-purple-200 flex items-center justify-center">
                    <Star className="w-4 h-4 text-purple-600" />
                  </div>
                )}
              </div>
              Consult with {astrologer.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedPackage && (
            <div className="space-y-4">
              {/* Package Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {selectedPackage.type === 'chat' && <MessageCircle className="w-4 h-4" />}
                    {selectedPackage.type === 'call' && <Phone className="w-4 h-4" />}
                    {selectedPackage.type === 'video' && <Video className="w-4 h-4" />}
                    <span className="font-medium capitalize">{selectedPackage.type} Consultation</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {selectedPackage.discount}% OFF
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{selectedPackage.duration} minutes</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-600">₹{selectedPackage.discountedPrice}</span>
                    <span className="text-sm text-gray-400 line-through">₹{selectedPackage.originalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Queue Status Integration */}
              <QueueStatus
                astrologerId={astrologer.id}
                consultationType={selectedPackage.type}
                duration={selectedPackage.duration}
                amount={selectedPackage.discountedPrice}
                onConsultationStart={handleConsultationStart}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}