import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { Button } from "src/components/ui/button";
import { Calendar, Clock, Star, Sun, Moon, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface EnhancedPanchangProps {
  date: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export function EnhancedPanchangDisplay({ date, latitude, longitude, timezone = "Asia/Kolkata" }: EnhancedPanchangProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: basicPanchang, isLoading: basicLoading } = useQuery({
    queryKey: ["/api/panchang/daily", date, latitude, longitude],
    queryFn: async () => {
      const response = await fetch("/api/panchang/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, latitude, longitude, timezone })
      });
      return response.json();
    }
  });

  const { data: enhancedData, isLoading: enhancedLoading } = useQuery({
    queryKey: ["/api/panchang/enhanced", date, latitude, longitude],
    queryFn: async () => {
      const response = await fetch("/api/panchang/enhanced", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, latitude, longitude, timezone })
      });
      return response.json();
    }
  });

  const { data: choghadiyaData, isLoading: choghadiyaLoading } = useQuery({
    queryKey: ["/api/panchang/choghadiya", date, latitude, longitude],
    queryFn: async () => {
      const response = await fetch("/api/panchang/choghadiya", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, latitude, longitude, timezone })
      });
      return response.json();
    }
  });

  if (basicLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!basicPanchang?.success) {
    return (
      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <CardContent className="p-6">
          <div className="text-red-600 dark:text-red-400">
            Error loading Panchang data: {basicPanchang?.error || "Unknown error"}
          </div>
        </CardContent>
      </Card>
    );
  }

  const panchang = basicPanchang.panchang;
  const tithi = panchang.tithi.current;
  const nakshatra = panchang.nakshatra.current;
  const yoga = panchang.yoga.current;
  const karana = panchang.karana.current;

  return (
    <div className="space-y-6">
      {/* Core Panchang Overview */}
      <Card className="bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-950 dark:to-cyan-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Daily Panchang - {new Date(date).toLocaleDateString()}
          </CardTitle>
          <CardDescription>
            Sunrise: {basicPanchang.sunrise} | Sunset: {basicPanchang.sunset}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="font-semibold text-purple-600 dark:text-purple-400">Tithi</div>
              <div className="text-sm">{tithi.paksha}</div>
              <div className="text-lg font-bold">{tithi.name}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-cyan-600 dark:text-cyan-400">Nakshatra</div>
              <div className="text-sm">Lord: {nakshatra.lord}</div>
              <div className="text-lg font-bold">{nakshatra.name}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-orange-600 dark:text-orange-400">Moon Sign</div>
              <div className="text-lg font-bold">{basicPanchang.moonsign}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-amber-600 dark:text-amber-400">Sun Sign</div>
              <div className="text-lg font-bold">{basicPanchang.sunsign}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Features Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="choghadiya">Choghadiya</TabsTrigger>
          <TabsTrigger value="times">Auspicious Times</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Yoga & Karana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Yoga:</span> {yoga.name}
                  </div>
                  <div>
                    <span className="font-semibold">Karana:</span> {karana.name}
                  </div>
                  <div>
                    <span className="font-semibold">Vara:</span> {panchang.vara.name}
                  </div>
                </div>
              </CardContent>
            </Card>

            {basicPanchang.festivals && basicPanchang.festivals.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Festivals & Observances
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {basicPanchang.festivals.map((festival: any, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant={festival.type === 'Vrat' ? 'default' : 'secondary'}>
                          {festival.type}
                        </Badge>
                        <span className="font-semibold">{festival.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="choghadiya" className="space-y-4">
          {choghadiyaLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : choghadiyaData?.success && choghadiyaData.choghadiya?.day ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Choghadiya Periods
                </CardTitle>
                <CardDescription>
                  Auspicious and inauspicious periods throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {choghadiyaData.choghadiya.day.map((period: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={period.nature === 'Auspicious' ? 'default' : 
                                   period.nature === 'Inauspicious' ? 'destructive' : 'secondary'}
                        >
                          {period.name}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {period.start} - {period.end}
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {period.nature}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-muted-foreground">
                  Choghadiya data not available
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="times" className="space-y-4">
          {enhancedLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : enhancedData?.success && enhancedData.auspiciousTimes ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(enhancedData.auspiciousTimes).map(([timeName, timeData]: [string, any]) => (
                <Card key={timeName}>
                  <CardHeader>
                    <CardTitle className="text-base capitalize">
                      {timeName.replace(/([A-Z])/g, ' $1').trim()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-semibold">
                          {timeData.start} - {timeData.end}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {timeData.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-muted-foreground">
                  Auspicious times data not available
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {enhancedData?.success ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enhancedData.tithiDetails && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Tithi Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div><span className="font-semibold">Nature:</span> {enhancedData.tithiDetails.nature}</div>
                      <div><span className="font-semibold">Deity:</span> {enhancedData.tithiDetails.deity}</div>
                      <div><span className="font-semibold">Activity:</span> {enhancedData.tithiDetails.recommendedActivity}</div>
                      {enhancedData.tithiDetails.fastingDay && (
                        <Badge variant="default">Fasting Day</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {enhancedData.nakshatraDetails && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Nakshatra Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div><span className="font-semibold">Symbol:</span> {enhancedData.nakshatraDetails.symbol}</div>
                      <div><span className="font-semibold">Deity:</span> {enhancedData.nakshatraDetails.deity}</div>
                      <div><span className="font-semibold">Nature:</span> {enhancedData.nakshatraDetails.nature}</div>
                      <div><span className="font-semibold">Quality:</span> {enhancedData.nakshatraDetails.quality}</div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {enhancedData.gandamool && (
                <Card>
                  <CardHeader>
                    <CardTitle>Gandamool</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={enhancedData.gandamool.isGandamool ? "destructive" : "default"}>
                          {enhancedData.gandamool.isGandamool ? "Yes" : "No"}
                        </Badge>
                      </div>
                      {enhancedData.gandamool.isGandamool && (
                        <p className="text-sm text-muted-foreground">
                          {enhancedData.gandamool.remedies}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {enhancedData.samvat && (
                <Card>
                  <CardHeader>
                    <CardTitle>Traditional Calendars</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div><span className="font-semibold">Vikram Samvat:</span> {enhancedData.samvat.vikramSamvat}</div>
                      <div><span className="font-semibold">Shaka Samvat:</span> {enhancedData.samvat.shakaSamvat}</div>
                      <div><span className="font-semibold">Kali Year:</span> {enhancedData.samvat.kaliYear}</div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-muted-foreground">
                  Detailed information not available
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}