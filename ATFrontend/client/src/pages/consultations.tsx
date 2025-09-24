import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, Star, MessageCircle } from "lucide-react";
import { Card, CardContent } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { Link } from "wouter";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import ConsultationCard from "src/components/consultation/ConsultationCard";
import { ConsultationWithAstrologer } from "@shared/schema";
import { formatDuration, formatPrice } from "src/lib/utils";
import { useAuth } from "src/hooks/useAuth";
import DeferredSection from "src/components/DeferredSection";
import LazyImage from "src/components/LazyImage";

export default function Consultations() {
  const { user } = useAuth();
  
  const { data: consultations = [], isLoading } = useQuery<ConsultationWithAstrologer[]>({
    queryKey: ["/api/consultations/user"],
    enabled: !!user?.id,
  });

  const activeConsultations = consultations.filter(c => c.status === "active");
  const completedConsultations = consultations.filter(c => c.status === "completed");

  const totalSpent = completedConsultations.reduce((sum, c) => sum + c.cost, 0);
  const totalDuration = completedConsultations.reduce((sum, c) => sum + c.duration, 0);
  const averageRating = completedConsultations.length > 0 
    ? completedConsultations.reduce((sum, c) => sum + (c.rating || 0), 0) / completedConsultations.filter(c => c.rating).length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <AstroTickHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Spiritual <span className="text-yellow-400">Journey</span>
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Track your consultations and continue your path to enlightenment
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <MessageCircle className="mx-auto h-8 w-8 text-mystical-blue mb-2" />
                <div className="text-2xl font-bold text-mystical-blue">{consultations.length}</div>
                <div className="text-sm text-gray-600">Total Sessions</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="mx-auto h-8 w-8 text-mystical-purple mb-2" />
                <div className="text-2xl font-bold text-mystical-blue">{formatDuration(totalDuration)}</div>
                <div className="text-sm text-gray-600">Total Time</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Star className="mx-auto h-8 w-8 text-mystical-gold mb-2" />
                <div className="text-2xl font-bold text-mystical-blue">
                  {averageRating > 0 ? averageRating.toFixed(1) : "N/A"}
                </div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="mx-auto h-8 w-8 text-green-600 mb-2" />
                <div className="text-2xl font-bold text-mystical-blue">{formatPrice(totalSpent)}</div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Active Consultations */}
      {activeConsultations.length > 0 && (
        <section className="py-12 bg-yellow-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-mystical-blue">Active Sessions</h2>
              <Badge className="bg-green-100 text-green-800">Live</Badge>
            </div>

            <div className="space-y-4">
              {activeConsultations.map((consultation) => (
                <ConsultationCard 
                  key={consultation.id} 
                  consultation={consultation} 
                  showActions={true}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Consultation History */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-mystical-blue mb-6">
            Consultation History ({completedConsultations.length})
          </h2>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : completedConsultations.length === 0 ? (
            <div className="text-center py-12">
              <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No consultations yet</h3>
              <p className="text-gray-600 mb-4">Start your spiritual journey today!</p>
              <Link href="/astrologers">
                <Button className="bg-mystical-gold text-mystical-blue hover:bg-yellow-400">
                  Book Your First Session
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {completedConsultations.map((consultation) => (
                <ConsultationCard key={consultation.id} consultation={consultation} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}