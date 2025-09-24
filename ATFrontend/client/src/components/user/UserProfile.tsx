import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { Switch } from "src/components/ui/switch";
import { Badge } from "src/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { User, Star, Bell, Settings, Calendar, MapPin, Clock } from "lucide-react";
import { ZODIAC_SIGNS } from "src/lib/astrology";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "src/lib/queryClient";
import { useToast } from "src/hooks/use-toast";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  profileImage?: string;
  birthDate?: string;
  birthTime?: string;
  birthLocation?: string;
  zodiacSign?: string;
  moonSign?: string;
  risingSign?: string;
  preferences: {
    dailyHoroscope: boolean;
    weeklyHoroscope: boolean;
    transitAlerts: boolean;
    articleRecommendations: boolean;
    consultationReminders: boolean;
    language: string;
    privacy: {
      profileVisibility: 'public' | 'private' | 'friends';
      birthChartVisibility: 'public' | 'private' | 'friends';
      showOnlineStatus: boolean;
    };
  };
  stats: {
    articlesRead: number;
    consultationsCompleted: number;
    chartsGenerated: number;
    favoriteAstrologers: number;
  };
}

export default function UserProfile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<Partial<UserProfile>>({});

  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ["/api/user/profile"],
    retry: false,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      return await apiRequest("/api/user/profile", "PATCH", updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      toast({
        title: "Profile updated successfully",
        description: "Your changes have been saved.",
      });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Error updating profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (profile && !isEditing) {
      setProfileData(profile);
    }
  }, [profile, isEditing]);

  const handleSave = () => {
    updateProfileMutation.mutate(profileData);
  };

  const handleCancel = () => {
    setProfileData(profile || {});
    setIsEditing(false);
  };

  const updatePreference = (key: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const updatePrivacySetting = (key: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        privacy: {
          ...prev.preferences?.privacy,
          [key]: value
        }
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.profileImage} />
              <AvatarFallback className="text-2xl">
                {profile.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{profile.username}</h1>
                {profile.zodiacSign && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {profile.zodiacSign}
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 mb-4">{profile.email}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-lg">{profile.stats.articlesRead}</div>
                  <div className="text-gray-500">Articles Read</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg">{profile.stats.consultationsCompleted}</div>
                  <div className="text-gray-500">Consultations</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg">{profile.stats.chartsGenerated}</div>
                  <div className="text-gray-500">Charts Generated</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg">{profile.stats.favoriteAstrologers}</div>
                  <div className="text-gray-500">Favorite Astrologers</div>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="astrology">Astrology</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={profileData.username || ""}
                    onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email || ""}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="astrology" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Birth Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birth-date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Birth Date
                  </Label>
                  <Input
                    id="birth-date"
                    type="date"
                    value={profileData.birthDate || ""}
                    onChange={(e) => setProfileData(prev => ({ ...prev, birthDate: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birth-time" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Birth Time
                  </Label>
                  <Input
                    id="birth-time"
                    type="time"
                    value={profileData.birthTime || ""}
                    onChange={(e) => setProfileData(prev => ({ ...prev, birthTime: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birth-location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Birth Location
                  </Label>
                  <Input
                    id="birth-location"
                    placeholder="City, Country"
                    value={profileData.birthLocation || ""}
                    onChange={(e) => setProfileData(prev => ({ ...prev, birthLocation: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zodiac-sign">Sun Sign</Label>
                  <Select
                    value={profileData.zodiacSign || ""}
                    onValueChange={(value) => setProfileData(prev => ({ ...prev, zodiacSign: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your sign" />
                    </SelectTrigger>
                    <SelectContent>
                      {ZODIAC_SIGNS.map((sign) => (
                        <SelectItem key={sign.name} value={sign.name}>
                          <div className="flex items-center gap-2">
                            <span>{sign.symbol}</span>
                            <span>{sign.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moon-sign">Moon Sign</Label>
                  <Select
                    value={profileData.moonSign || ""}
                    onValueChange={(value) => setProfileData(prev => ({ ...prev, moonSign: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select moon sign" />
                    </SelectTrigger>
                    <SelectContent>
                      {ZODIAC_SIGNS.map((sign) => (
                        <SelectItem key={sign.name} value={sign.name}>
                          <div className="flex items-center gap-2">
                            <span>{sign.symbol}</span>
                            <span>{sign.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rising-sign">Rising Sign</Label>
                  <Select
                    value={profileData.risingSign || ""}
                    onValueChange={(value) => setProfileData(prev => ({ ...prev, risingSign: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rising sign" />
                    </SelectTrigger>
                    <SelectContent>
                      {ZODIAC_SIGNS.map((sign) => (
                        <SelectItem key={sign.name} value={sign.name}>
                          <div className="flex items-center gap-2">
                            <span>{sign.symbol}</span>
                            <span>{sign.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'dailyHoroscope', label: 'Daily Horoscope', description: 'Receive your daily horoscope each morning' },
                { key: 'weeklyHoroscope', label: 'Weekly Horoscope', description: 'Get weekly astrological insights' },
                { key: 'transitAlerts', label: 'Transit Alerts', description: 'Important planetary transit notifications' },
                { key: 'articleRecommendations', label: 'Article Recommendations', description: 'Personalized content suggestions' },
                { key: 'consultationReminders', label: 'Consultation Reminders', description: 'Reminders for scheduled consultations' }
              ].map((pref) => (
                <div key={pref.key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{pref.label}</div>
                    <div className="text-sm text-gray-500">{pref.description}</div>
                  </div>
                  <Switch
                    checked={profileData.preferences?.[pref.key as keyof typeof profileData.preferences] || false}
                    onCheckedChange={(checked) => updatePreference(pref.key, checked)}
                    disabled={!isEditing}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select
                    value={profileData.preferences?.privacy?.profileVisibility || "private"}
                    onValueChange={(value) => updatePrivacySetting('profileVisibility', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can see</SelectItem>
                      <SelectItem value="friends">Friends - Only connected users</SelectItem>
                      <SelectItem value="private">Private - Only you</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Birth Chart Visibility</Label>
                  <Select
                    value={profileData.preferences?.privacy?.birthChartVisibility || "private"}
                    onValueChange={(value) => updatePrivacySetting('birthChartVisibility', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can see</SelectItem>
                      <SelectItem value="friends">Friends - Only connected users</SelectItem>
                      <SelectItem value="private">Private - Only you</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Show Online Status</div>
                    <div className="text-sm text-gray-500">Let others see when you're online</div>
                  </div>
                  <Switch
                    checked={profileData.preferences?.privacy?.showOnlineStatus || false}
                    onCheckedChange={(checked) => updatePrivacySetting('showOnlineStatus', checked)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isEditing && (
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
}