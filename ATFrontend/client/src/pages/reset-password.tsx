import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "src/lib/queryClient";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form";
import { useToast } from "src/hooks/use-toast";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

const resetPasswordSchema = z.object({
  newPin: z
    .string()
    .min(6, "PIN must be exactly 6 digits")
    .max(6, "PIN must be exactly 6 digits")
    .regex(/^\d{6}$/, "PIN must contain only numbers"),
  confirmPin: z
    .string()
    .min(6, "PIN must be exactly 6 digits")
    .max(6, "PIN must be exactly 6 digits")
    .regex(/^\d{6}$/, "PIN must contain only numbers"),
}).refine((data) => data.newPin === data.confirmPin, {
  message: "PINs don't match",
  path: ["confirmPin"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPin: "",
      confirmPin: "",
    },
  });

  // Get user email from URL params or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email') || localStorage.getItem('userEmail') || '';
    setUserEmail(email);
    
    if (!email) {
      toast({
        title: "Access denied",
        description: "Please use the link from your email to reset your password.",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [navigate, toast]);

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordFormData) => {
      return apiRequest("POST", "/api/auth/reset-password", {
        email: userEmail,
        newPin: data.newPin,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        setIsSuccess(true);
        
        // Auto-login the user with the token from the response
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          console.log('✅ [RESET PASSWORD] User auto-logged in after PIN reset');
        }
        
        toast({
          title: "Password reset successful",
          description: "Your new 6-digit PIN has been set. Redirecting to your reports...",
        });
        
        // Redirect to reports dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard/reports');
        }, 2000);
      } else {
        toast({
          title: "Reset failed",
          description: data.message || "Failed to reset password",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Reset failed",
        description: error.message || "An error occurred while resetting password",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate(data);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <AstroTickHeader />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="border-green-200 shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-green-800">Password Reset Successful!</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600">
                  Your new 6-digit PIN has been set successfully.
                </p>
                <p className="text-sm text-gray-500">
                  You will be redirected to your reports dashboard in 2 seconds...
                </p>
                <Button 
                  onClick={() => navigate('/dashboard/reports')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Go to Reports Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <AstroTickHeader />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="border-orange-200 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-orange-800">Set Your New PIN</CardTitle>
              <p className="text-gray-600 mt-2">
                Create a 6-digit PIN that you'll use to log in to your account.
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="newPin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New 6-Digit PIN</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPin ? "text" : "password"}
                              placeholder="Enter 6-digit PIN"
                              maxLength={6}
                              {...field}
                              className="pr-10"
                              onInput={(e) => {
                                // Only allow numbers
                                const value = e.currentTarget.value.replace(/\D/g, '');
                                field.onChange(value);
                              }}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPin(!showPin)}
                            >
                              {showPin ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm PIN</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPin ? "text" : "password"}
                              placeholder="Confirm 6-digit PIN"
                              maxLength={6}
                              {...field}
                              className="pr-10"
                              onInput={(e) => {
                                // Only allow numbers
                                const value = e.currentTarget.value.replace(/\D/g, '');
                                field.onChange(value);
                              }}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowConfirmPin(!showConfirmPin)}
                            >
                              {showConfirmPin ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    disabled={resetPasswordMutation.isPending}
                  >
                    {resetPasswordMutation.isPending ? "Setting PIN..." : "Set New PIN"}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Remember this PIN - you'll need it to log in to your account.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}