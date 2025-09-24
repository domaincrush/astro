import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Textarea } from "src/components/ui/textarea";
import { Badge } from "src/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "src/components/ui/dialog";
import { useToast } from "src/hooks/use-toast";
import { useAuth } from "src/hooks/useAuth";
import { apiRequest } from "src/lib/queryClient";
import { formatDate, formatPrice, formatDuration } from "src/lib/utils";
import {
  User,
  Calendar,
  Clock,
  Star,
  TrendingUp,
  Bell,
  Heart,
} from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";

const profileUpdateSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .optional()
    .or(z.literal("")),
  dateOfBirth: z.string().optional(),
  timeOfBirth: z.string().optional(),
  placeOfBirth: z.string().optional(),
  bio: z.string().optional(),
  preferredLanguages: z.array(z.string()).optional(),
});

const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
type PasswordChange = z.infer<typeof passwordChangeSchema>;

interface UserProfile {
  id: number;
  username: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  profileImage?: string;
  bio?: string;
  totalConsultations: number;
  totalSpent: number;
  preferredLanguages: string[];
  createdAt: string;
}

interface ConsultationStats {
  totalConsultations: number;
  totalSpent: number;
  averageRating: number;
  totalMinutes: number;
  topAstrologer?: {
    name: string;
    consultations: number;
  };
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile>({
    queryKey: ["/api/profile", user?.id],
    enabled: !!user?.id,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache
  });

  const { data: stats } = useQuery<ConsultationStats>({
    queryKey: ["/api/profile/stats", user?.id],
    enabled: !!user?.id,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache
  });

  const { data: consultations } = useQuery<any[]>({
    queryKey: ["/api/consultations/user", user?.id],
    enabled: !!user?.id,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache
  });

  const { data: notifications } = useQuery<any[]>({
    queryKey: ["/api/notifications", user?.id],
    enabled: !!user?.id,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache
  });

  const { data: favorites } = useQuery<any[]>({
    queryKey: ["/api/favorites", user?.id],
    enabled: !!user?.id,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache
  });

  const form = useForm<ProfileUpdate>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      timeOfBirth: "",
      placeOfBirth: "",
      bio: "",
      preferredLanguages: [],
    },
  });

  // Update form values when profile data loads
  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username || "",
        email: profile.email || "",
        phone: profile.phone || "",
        dateOfBirth: profile.dateOfBirth
          ? profile.dateOfBirth.split("T")[0]
          : "",
        timeOfBirth: profile.timeOfBirth || "",
        placeOfBirth: profile.placeOfBirth || "",
        bio: profile.bio || "",
        preferredLanguages: profile.preferredLanguages || [],
      });
    }
  }, [profile, form]);

  const [emailVerificationCode, setEmailVerificationCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileUpdate) => {
      // Check if email has changed
      if (data.email !== profile?.email) {
        // Start email verification process
        const response = await apiRequest("POST", "/api/profile/email/verify", {
          newEmail: data.email,
        });
        return { emailVerificationRequired: true, newEmail: data.email };
      } else {
        // Update profile without email change
        const { email, ...profileData } = data;

        // Send dateOfBirth as string (backend will handle conversion if needed)
        const processedData = {
          ...profileData,
          dateOfBirth: profileData.dateOfBirth || undefined,
        };

        const response = await apiRequest(
          "PATCH",
          "/api/profile",
          processedData,
        );
        return response;
      }
    },
    onSuccess: (result) => {
      if (result.emailVerificationRequired) {
        setPendingEmail(result.newEmail);
        setShowEmailVerification(true);
        toast({
          title: "Verification Required",
          description: "Please check your new email for the verification code.",
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["/api/profile", user?.id] });
        queryClient.invalidateQueries({ queryKey: ["/api/profile/stats", user?.id] });
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });
      }
    },
    onError: (error: any) => {
      console.error("Profile update error:", error);
      toast({
        title: "Update failed",
        description:
          error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("POST", "/api/profile/email/confirm", {
        verificationCode: code,
      });
      return response.json();
    },
    onSuccess: () => {
      setShowEmailVerification(false);
      setPendingEmail("");
      setEmailVerificationCode("");
      queryClient.invalidateQueries({ queryKey: ["/api/profile", user?.id] });
      toast({
        title: "Email verified",
        description: "Your email address has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Verification failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const markNotificationReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      await apiRequest(
        "PATCH",
        `/api/notifications/${notificationId}/read`,
        {},
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications", user?.id] });
    },
  });

  const passwordForm = useForm<PasswordChange>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordChange) => {
      const response = await apiRequest("PATCH", "/api/profile/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      return response.json();
    },
    onSuccess: () => {
      setShowPasswordChange(false);
      passwordForm.reset();
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Password change failed",
        description:
          error.message || "Failed to update password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpdateProfile = (data: ProfileUpdate) => {
    updateProfileMutation.mutate(data);
  };

  const handlePasswordChange = (data: PasswordChange) => {
    changePasswordMutation.mutate(data);
  };

  const handleMarkAsRead = (notificationId: number) => {
    markNotificationReadMutation.mutate(notificationId);
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AstroTickHeader />

      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Profile
            </h1>
            <p className="text-gray-600">
              Manage your account and view consultation history
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={form.handleSubmit(handleUpdateProfile)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input {...form.register("username")} />
                        {form.formState.errors.username && (
                          <p className="text-sm text-red-600 mt-1">
                            {form.formState.errors.username.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input type="email" {...form.register("email")} />
                        {form.formState.errors.email && (
                          <p className="text-sm text-red-600 mt-1">
                            {form.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Mobile Number</Label>
                        <Input type="tel" {...form.register("phone")} />
                        {form.formState.errors.phone && (
                          <p className="text-sm text-red-600 mt-1">
                            {form.formState.errors.phone.message}
                          </p>
                        )}
                      </div>
                      <div></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input type="date" {...form.register("dateOfBirth")} />
                      </div>
                      <div>
                        <Label htmlFor="timeOfBirth">Time of Birth</Label>
                        <Input type="time" {...form.register("timeOfBirth")} />
                      </div>
                      <div>
                        <Label htmlFor="placeOfBirth">Place of Birth</Label>
                        <Input
                          {...form.register("placeOfBirth")}
                          placeholder="City, Country"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        {...form.register("bio")}
                        placeholder="Tell us about yourself..."
                        rows={3}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="w-full md:w-auto"
                    >
                      {updateProfileMutation.isPending
                        ? "Updating..."
                        : "Update Profile"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Password</h3>
                        <p className="text-sm text-gray-600">
                          Change your account password
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setShowPasswordChange(true)}
                      >
                        Change Password
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Consultations
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats?.totalConsultations || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Spent
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatPrice(stats?.totalSpent || 0)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Average Rating Given
                    </CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats?.averageRating?.toFixed(1) || "N/A"}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Minutes
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatDuration(stats?.totalMinutes || 0)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {stats?.topAstrologer && (
                <Card>
                  <CardHeader>
                    <CardTitle>Top Astrologer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {stats.topAstrologer.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {stats.topAstrologer.consultations} consultations
                        </p>
                      </div>
                      <Badge variant="secondary">Most Consulted</Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Consultation History</CardTitle>
                </CardHeader>
                <CardContent>
                  {consultations?.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      No consultations yet
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {consultations?.map((consultation: any) => (
                        <div
                          key={consultation.id}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">
                              {consultation.astrologer.name}
                            </h3>
                            <Badge
                              variant={
                                consultation.status === "completed"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {consultation.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Date:</span>{" "}
                              {formatDate(new Date(consultation.createdAt))}
                            </div>
                            <div>
                              <span className="font-medium">Duration:</span>{" "}
                              {formatDuration(consultation.duration)}
                            </div>
                            <div>
                              <span className="font-medium">Cost:</span>{" "}
                              {formatPrice(consultation.cost)}
                            </div>
                            {consultation.rating && (
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Rating:</span>
                                <div className="flex items-center">
                                  {Array.from({
                                    length: consultation.rating,
                                  }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          {consultation.review && (
                            <p className="mt-2 text-sm italic text-gray-600">
                              "{consultation.review}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {notifications?.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      No notifications
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {notifications?.map((notification: any) => (
                        <div
                          key={notification.id}
                          className={`border rounded-lg p-4 ${!notification.isRead ? "bg-blue-50 border-blue-200" : ""}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium">
                                {notification.title}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {formatDate(new Date(notification.createdAt))}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleMarkAsRead(notification.id)
                                }
                              >
                                Mark as Read
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Favorite Astrologers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {favorites?.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      No favorite astrologers yet
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {favorites?.map((favorite: any) => (
                        <div
                          key={favorite.id}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={favorite.astrologer.image}
                              alt={favorite.astrologer.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium">
                                {favorite.astrologer.name}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                  {favorite.astrologer.rating}
                                </div>
                                <span>•</span>
                                <span>
                                  {favorite.astrologer.experience} years
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Email Verification Dialog */}
          <Dialog
            open={showEmailVerification}
            onOpenChange={setShowEmailVerification}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Verify Your New Email Address</DialogTitle>
                <DialogDescription>
                  We've sent a 6-digit verification code to {pendingEmail}.
                  Please enter the code below to confirm your new email address.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="verification-code">Verification Code</Label>
                  <Input
                    id="verification-code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={emailVerificationCode}
                    onChange={(e) => setEmailVerificationCode(e.target.value)}
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() =>
                      verifyEmailMutation.mutate(emailVerificationCode)
                    }
                    disabled={
                      !emailVerificationCode ||
                      emailVerificationCode.length !== 6 ||
                      verifyEmailMutation.isPending
                    }
                    className="flex-1"
                  >
                    {verifyEmailMutation.isPending
                      ? "Verifying..."
                      : "Verify Email"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEmailVerification(false);
                      setPendingEmail("");
                      setEmailVerificationCode("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Password Change Dialog */}
          <Dialog
            open={showPasswordChange}
            onOpenChange={setShowPasswordChange}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>
                  Enter your current password and choose a new secure password.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={passwordForm.handleSubmit((data) =>
                  changePasswordMutation.mutate(data),
                )}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...passwordForm.register("currentPassword")}
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-sm text-red-600 mt-1">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...passwordForm.register("newPassword")}
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-red-600 mt-1">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...passwordForm.register("confirmPassword")}
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-600 mt-1">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                    className="flex-1"
                  >
                    {changePasswordMutation.isPending
                      ? "Changing..."
                      : "Change Password"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowPasswordChange(false);
                      passwordForm.reset();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Footer />
    </div>
  );
}
