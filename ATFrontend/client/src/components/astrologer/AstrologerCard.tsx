import { Star, MessageCircle, Phone, Clock, Users, Award } from "lucide-react";
import { Card, CardContent } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { Astrologer } from "@shared/schema";
import { useLocation } from "wouter";
import { useAuth } from "src/hooks/useAuth";
import { getAstrologerUrl } from "src/utils/seoUtils";

interface AstrologerCardProps {
  astrologer: Astrologer;
  onStartChat?: () => void;
}

export default function AstrologerCard({ astrologer, onStartChat }: AstrologerCardProps) {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  const handleViewProfile = () => {
    setLocation(getAstrologerUrl(astrologer.name));
  };

  const handleStartChat = () => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }
    
    // Redirect to payment page with consultation details
    const paymentParams = new URLSearchParams({
      astrologer: astrologer.id.toString(),
      service: 'chat',
      duration: '20',
      price: Math.round(astrologer.ratePerMinute * 20 * 0.85).toString(), // 15% discount
      originalPrice: (astrologer.ratePerMinute * 20).toString(),
      type: 'consultation'
    });
    
    setLocation(`/payment?${paymentParams.toString()}`);
  };

  const handleStartCall = () => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }
    
    // Redirect to payment page with call consultation details
    const paymentParams = new URLSearchParams({
      astrologer: astrologer.id.toString(),
      service: 'call',
      duration: '15',
      price: Math.round(astrologer.ratePerMinute * 15 * 0.9).toString(), // 10% discount
      originalPrice: (astrologer.ratePerMinute * 15).toString(),
      type: 'consultation'
    });
    
    setLocation(`/payment?${paymentParams.toString()}`);
  };

  // Calculate FLATDEAL discount (showing 12 for premium astrologers)
  const flatDeal = astrologer.ratePerMinute >= 35 ? 12 : 8;
  const reviewCount = astrologer.reviewCount || Math.floor(astrologer.totalConsultations * 0.3);

  return (
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
                    console.log(`Image failed to load for ${astrologer.name}: ${astrologer.image}`);
                    // Try refreshing the image with a cache-busting timestamp
                    const originalSrc = e.currentTarget.src;
                    if (!originalSrc.includes('?retry=')) {
                      console.log(`Retrying image load for ${astrologer.name}...`);
                      e.currentTarget.src = `${astrologer.image}?retry=${Date.now()}`;
                      return;
                    }
                    // If retry also failed, show fallback
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full bg-purple-200 flex items-center justify-center"><span class="text-purple-600 text-2xl">${astrologer.name.charAt(0)}</span></div>`;
                  }}
                  onLoad={() => {
                    console.log(`Image loaded successfully for ${astrologer.name}: ${astrologer.image}`);
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
          
          <div className="flex items-center gap-1 text-gray-600">
            <Users className="w-3 h-3" />
            <span>{astrologer.totalConsultations}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-lg font-bold text-orange-600">
              ₹{astrologer.ratePerMinute}/Min
            </div>
            <div className="text-xs text-orange-500 font-medium">
              FLATDEAL {flatDeal}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500 line-through">
              ₹{Math.round(astrologer.ratePerMinute * 1.3)}/Min
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={handleStartChat}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2"
            disabled={!astrologer.isOnline}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            CHAT
          </Button>
          <Button 
            onClick={handleStartCall}
            variant="outline" 
            className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 text-sm py-2"
            disabled={!astrologer.isOnline}
          >
            <Phone className="w-4 h-4 mr-1" />
            CALL
          </Button>
          {!astrologer.isOnline && (
            <Button 
              variant="outline" 
              className="flex-1 border-gray-300 text-gray-400 text-sm py-2"
              disabled
            >
              OFFLINE
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
