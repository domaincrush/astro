import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { useLocation } from "wouter";
import { useToast } from "src/hooks/use-toast";
import { apiRequest } from "src/lib/queryClient";
import { Mail, KeyRound, Shield, ArrowLeft } from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";

const requestOtpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetPinSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    otpCode: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
    newPin: z.string().regex(/^\d{6}$/, "PIN must be exactly 6 digits"),
    confirmPin: z.string(),
  })
  .refine((data) => data.newPin === data.confirmPin, {
    message: "PINs don't match",
    path: ["confirmPin"],
  });

type RequestOtpFormData = z.infer<typeof requestOtpSchema>;
type ResetPinFormData = z.infer<typeof resetPinSchema>;

export default function ResetPin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [userEmail, setUserEmail] = useState("");

  const requestForm = useForm<RequestOtpFormData>({
    resolver: zodResolver(requestOtpSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetForm = useForm<ResetPinFormData>({
    resolver: zodResolver(resetPinSchema),
    defaultValues: {
      email: "",
      otpCode: "",
      newPin: "",
      confirmPin: "",
    },
  });

  const requestOtpMutation = useMutation({
    mutationFn: async (data: RequestOtpFormData) => {
      const response = await apiRequest(
        "POST",
        "/api/auth/request-pin-reset",
        data,
      );
      return response;
    },
    onSuccess: (data, variables) => {
      if (data.success) {
        setStep("reset");
        setUserEmail(variables.email);
        resetForm.setValue("email", variables.email);
        toast({
          title: "Reset Code Sent",
          description: "Check your email for the 6-digit PIN reset code.",
        });
      } else {
        toast({
          title: "Failed to send reset code",
          description: data.message || "Please try again",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send reset code",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  const resetPinMutation = useMutation({
    mutationFn: async (data: ResetPinFormData) => {
      // Map otpCode to otp for backend compatibility
      const requestData = {
        email: data.email,
        otp: data.otpCode,  // Map otpCode to otp
        newPin: data.newPin
      };
      console.log("Sending PIN reset request:", requestData);
      const response = await apiRequest("POST", "/api/auth/reset-pin", requestData);
      return response;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "PIN Reset Successful",
          description:
            "Your PIN has been reset successfully. You can now login with your new PIN.",
        });
        setLocation("/login");
      } else {
        toast({
          title: "PIN reset failed",
          description: data.message || "Invalid OTP code or expired",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "PIN reset failed",
        description: error.message || "An error occurred during PIN reset",
        variant: "destructive",
      });
    },
  });

  const onRequestSubmit = (data: RequestOtpFormData) => {
    requestOtpMutation.mutate(data);
  };

  const onResetSubmit = (data: ResetPinFormData) => {
    resetPinMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <AstroTickHeader />

      <main className="flex items-center justify-center p-4 min-h-[calc(100vh-160px)]">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLocation("/login")}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <CardTitle className="text-2xl font-bold">
                Reset Your PIN
              </CardTitle>
            </div>
            <CardDescription>
              {step === "request"
                ? "Enter your email to receive a PIN reset code"
                : "Enter the code and create a new PIN"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "request" ? (
              <Form {...requestForm}>
                <form
                  onSubmit={requestForm.handleSubmit(onRequestSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={requestForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Enter your email address"
                              type="email"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={requestOtpMutation.isPending}
                  >
                    {requestOtpMutation.isPending
                      ? "Sending Code..."
                      : "Send Reset Code"}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...resetForm}>
                <form
                  onSubmit={resetForm.handleSubmit(onResetSubmit)}
                  className="space-y-4"
                >
                  <div className="text-center p-4 bg-green-50 rounded-lg mb-4">
                    <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-green-700">
                      Reset code sent to
                      <br />
                      <strong>{userEmail}</strong>
                    </p>
                  </div>

                  <FormField
                    control={resetForm.control}
                    name="otpCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>6-Digit Reset Code</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Enter the reset code"
                              type="text"
                              maxLength={6}
                              className="pl-10 text-center text-lg tracking-widest font-mono"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={resetForm.control}
                    name="newPin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New 6-Digit PIN</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Enter your new PIN"
                              type="password"
                              maxLength={6}
                              className="pl-10 text-center text-lg tracking-widest font-mono"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={resetForm.control}
                    name="confirmPin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New PIN</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Confirm your new PIN"
                              type="password"
                              maxLength={6}
                              className="pl-10 text-center text-lg tracking-widest font-mono"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={resetPinMutation.isPending}
                  >
                    {resetPinMutation.isPending
                      ? "Resetting PIN..."
                      : "Reset PIN"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setStep("request");
                      setUserEmail("");
                      requestForm.reset();
                      resetForm.reset();
                    }}
                  >
                    Try Different Email
                  </Button>
                </form>
              </Form>
            )}

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Remember your PIN? </span>
              <button
                onClick={() => setLocation("/login")}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Back to Login
              </button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
