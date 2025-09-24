import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CreditCard, User, Mail, Phone } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "src/components/ui/form";
import { apiRequest } from "src/lib/queryClient";
import { useToast } from "src/hooks/use-toast";
import { formatPrice } from "src/lib/utils";

const paymentFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

interface PayUPaymentProps {
  consultationId: number;
  amount: number;
  astrologerName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PayUPayment({ 
  consultationId, 
  amount, 
  astrologerName, 
  onSuccess, 
  onCancel 
}: PayUPaymentProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (userDetails: z.infer<typeof paymentFormSchema>) => {
      const response = await apiRequest("POST", "/api/payment/create", {
        consultationId,
        amount,
        userDetails,
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Create and submit PayU form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.paymentUrl;
      form.style.display = 'none';

      Object.entries(data.paymentData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    },
  });

  const onSubmit = async (values: z.infer<typeof paymentFormSchema>) => {
    setIsProcessing(true);
    createPaymentMutation.mutate(values);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="bg-gradient-to-r from-mystical-blue to-mystical-purple text-white">
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Complete Payment</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-mystical-blue mb-2">Session Details</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p>Astrologer: <span className="font-medium">{astrologerName}</span></p>
            <p>Amount: <span className="font-medium text-mystical-gold text-lg">{formatPrice(amount)}</span></p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>Full Name</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>Email Address</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>Phone Number</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4 space-y-3">
              <Button
                type="submit"
                className="w-full bg-mystical-gold text-mystical-blue hover:bg-yellow-400 py-3 text-lg font-semibold"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-mystical-blue border-t-transparent rounded-full mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Pay {formatPrice(amount)}
                  </>
                )}
              </Button>
              
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={onCancel}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Secured by PayU • All transactions are encrypted</p>
          <p>Supports Credit Cards, Debit Cards, Net Banking & UPI</p>
        </div>
      </CardContent>
    </Card>
  );
}