import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Clock, Users, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "src/components/ui/dialog";
import { useToast } from "src/hooks/use-toast";
import { apiRequest } from "src/lib/queryClient";
import { Astrologer } from "@shared/schema";
import { useLocation } from "wouter";

interface AvailableAstrologersProps {
  currentAstrologerId?: number;
  currentConsultationId?: number;
  onSwitch?: () => void;
}

export default function AvailableAstrologers({ 
  currentAstrologerId, 
  currentConsultationId,
  onSwitch 
}: AvailableAstrologersProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPackage, setSelectedPackage] = useState<{ duration: number; cost: number } | null>(null);

  // Get available astrologers (excluding current one)
  const { data: astrologers = [], isLoading } = useQuery<Astrologer[]>({
    queryKey: ["/api/astrologers"],
    select: (data) => {
      return data.filter(astrologer => 
        astrologer.id !== currentAstrologerId && astrologer.isOnline
      );
    },
  });

  // Check queue status for each astrologer
  const { data: queueStatuses = {} } = useQuery({
    queryKey: ["/api/astrologers/queue-status"],
    enabled: astrologers.length > 0,
  });

  const switchAstrologerMutation = useMutation({
    mutationFn: async ({ astrologerId, duration, cost }: { astrologerId: number; duration: number; cost: number }) => {
      // Cancel current consultation first
      if (currentConsultationId) {
        await apiRequest("POST", `/api/consultations/${currentConsultationId}/cancel`);
      }
      
      // Create new consultation with selected astrologer
      const response = await apiRequest("POST", "/api/consultations", {
        astrologerId,
        duration,
        cost,
        topic: "General Consultation"
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Astrologer Switched",
        description: "Successfully switched to new astrologer. Redirecting to chat...",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/consultations"] });
      onSwitch?.();
      setLocation("/chat");
    },
    onError: (error: any) => {
      toast({
        title: "Switch Failed",
        description: error.message || "Failed to switch astrologer",
        variant: "destructive",
      });
    },
  });

  const packages = [
    { duration: 15, cost: 29900 }, // ₹299
    { duration: 30, cost: 59900 }, // ₹599  
    { duration: 45, cost: 89900 }, // ₹899
  ];

  const getAvailabilityStatus = (astrologer: Astrologer) => {
    const queueStatus = (queueStatuses as any)?.[astrologer.id];
    if (!queueStatus) return { status: "available", waitTime: 0 };
    
    if (!queueStatus.isAstrologerBusy) {
      return { status: "available", waitTime: 0 };
    } else {
      return { 
        status: "busy", 
        waitTime: queueStatus.queueLength * 35 // 35 min per consultation
      };
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Gradient */}
      <div className="text-center bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Expert Astrologers Available</h2>
        <p className="text-purple-100">Connect with our certified Vedic astrology experts</p>
      </div>
      
      {/* Astrologers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {astrologers.map((astrologer) => {
          const availability = getAvailabilityStatus(astrologer);
          
          return (
            <Card 
              key={astrologer.id} 
              className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 cursor-pointer"
              onClick={(e) => {
                // Prevent navigation when clicking action buttons
                if (e.target instanceof Element && e.target.closest('button, [role="button"]')) {
                  e.stopPropagation();
                  return;
                }

                setLocation(`/astrologer/${astrologer.id}`);
              }}
            >
              <CardContent className="p-6">
                {/* Astrologer Header */}
                <div className="text-center mb-4">
                  <div className="relative inline-block">
                    <Avatar className="h-20 w-20 mx-auto border-4 border-purple-200 shadow-lg">
                      <AvatarImage 
                        src={astrologer.image || astrologer.profileImage || ''} 
                        alt={astrologer.name} 
                        className="object-cover"

                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-500 text-white text-lg font-semibold">
                        {astrologer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online Status Indicator */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mt-3 mb-1">{astrologer.name}</h3>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-semibold ml-1">{astrologer.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">({astrologer.reviewCount} reviews)</span>
                  </div>
                </div>

                {/* Specializations */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {astrologer.specializations.slice(0, 2).map((spec, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-xs px-2 py-1">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Experience & Languages */}
                <div className="space-y-2 mb-4 text-center">
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">{astrologer.experience}y exp</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">₹{astrologer.ratePerMinute}/min</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {astrologer.languages.slice(0, 3).join(', ')}
                  </div>
                </div>

                {/* Availability Status */}
                <div className="mb-4 text-center">
                  {availability.status === "available" ? (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white px-3 py-1">
                      Available Now
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="px-3 py-1">
                      Busy • {availability.waitTime}m wait
                    </Badge>
                  )}
                </div>

                {/* Action Button */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className={`w-full font-semibold ${
                        availability.status === "available" 
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      size="lg"
                    >
                      {availability.status === "available" ? "Connect Now" : "Join Queue"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-center">Connect with {astrologer.name}</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="text-center text-sm text-muted-foreground">
                        {currentConsultationId ? 
                          "Your current consultation will be cancelled. Choose a package to start with " + astrologer.name + ":" :
                          "Choose a consultation package to get started:"
                        }
                      </div>
                      
                      <div className="space-y-3">
                        {packages.map((pkg) => (
                          <div
                            key={pkg.duration}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              selectedPackage?.duration === pkg.duration
                                ? 'border-purple-500 bg-purple-50 shadow-md'
                                : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                            }`}
                            onClick={() => setSelectedPackage(pkg)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-semibold text-lg">{pkg.duration} Minutes</div>
                                <div className="text-sm text-gray-600">
                                  Best value for detailed consultation
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-purple-600">
                                  ₹{(pkg.cost / 100).toFixed(0)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ₹{Math.round(pkg.cost / pkg.duration / 100)}/min
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
                        disabled={!selectedPackage || switchAstrologerMutation.isPending}
                        onClick={() => {
                          if (selectedPackage) {
                            switchAstrologerMutation.mutate({
                              astrologerId: astrologer.id,
                              duration: selectedPackage.duration,
                              cost: selectedPackage.cost
                            });
                          }
                        }}
                      >
                        {switchAstrologerMutation.isPending ? "Connecting..." : "Start Consultation"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}