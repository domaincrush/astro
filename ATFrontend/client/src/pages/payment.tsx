import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Alert, AlertDescription } from "src/components/ui/alert";
import { Loader2, CreditCard, AlertTriangle, ArrowLeft } from "lucide-react";
import { useAuth } from "src/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "src/lib/queryClient";
import { formatPrice } from "src/lib/utils";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";

export default function Payment() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Add comprehensive error handling at the top level
  useEffect(() => {
    const handleError = (event: ErrorEvent | PromiseRejectionEvent) => {
      console.error('Payment page error caught:', {
        type: event.type,
        error: 'error' in event ? event.error : event.reason,
        message: 'message' in event ? event.message : 'Unknown error',
        stack: 'error' in event && event.error?.stack ? event.error.stack : 'No stack trace'
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);
  
  // Get URL parameters with proper decoding
  const urlParams = new URLSearchParams(window.location.search);
  const astrologerId = urlParams.get('astrologer');
  const duration = parseInt(urlParams.get('duration') || '0');
  const packagePrice = parseInt(urlParams.get('price') || '0');
  const amount = parseInt(urlParams.get('amount') || '0');
  const service = urlParams.get('service');
  const packageName = decodeURIComponent(urlParams.get('package') || '');
  
  // Queue payment specific parameters
  const paymentType = urlParams.get('type'); // 'queue' for queue payments
  const consultationId = urlParams.get('consultation');
  const queueId = urlParams.get('queue');
  
  // Force service detection for debugging
  const isServicePayment = service && service.length > 0;
  const isQueuePayment = paymentType === 'queue';

  // Add error boundary
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Payment page error:', event.error);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  const { data: userProfile } = useQuery({
    queryKey: ["/api/auth/user"],
    enabled: !!user?.id,
  });

  const { data: astrologer } = useQuery({
    queryKey: [`/api/astrologer/${astrologerId}`],
    enabled: !!astrologerId,
  });

  useEffect(() => {
    // For service payments, we need service and amount
    if (service && amount) {
      return; // Valid service payment
    }
    // For astrologer payments, we need astrologer, duration, and price
    if (!astrologerId || !duration || !packagePrice) {
      setLocation("/astrologers");
    }
  }, [astrologerId, duration, packagePrice, service, amount, setLocation]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AstroTickHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Required - Login First
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Show payment details even when not logged in */}
                {service && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Service Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Service:</span>
                        <span className="font-medium">
                          {service === 'match-making' ? 'Match Making' : 
                           service?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Package:</span>
                        <span className="font-medium">{packageName || 'Service Package'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="font-medium">{amount ? formatPrice(amount) : '₹0.00'}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2">Login Required</h2>
                  <p className="text-gray-600 mb-4">Please log in to continue with payment</p>
                  <Button onClick={() => {
                    const currentUrl = encodeURIComponent(window.location.pathname + window.location.search);
                    setLocation(`/login?redirect=${currentUrl}`);
                  }} className="w-full">
                    Login to Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const userBalance = (userProfile as any)?.balance || 0;
  
  // Determine payment amount based on payment type
  let finalPaymentAmount;
  let shortfall = 0;
  
  if (isServicePayment && amount) {
    // Service payment (Match Making, etc.) - amount is already in rupees
    finalPaymentAmount = amount;
  } else {
    // Astrologer consultation payment
    shortfall = Math.max(0, packagePrice - userBalance);
    finalPaymentAmount = shortfall / 100; // Convert paise to rupees
    
  }

  const handlePayment = async () => {
    if (!isServicePayment && shortfall <= 0) {
      // User has sufficient balance for astrologer consultation, redirect back to packages
      setLocation(`/packages/${astrologerId}?auto_book=true&duration=${duration}&price=${packagePrice}`);
      return;
    }

    setIsProcessing(true);
    
    try {
      let paymentResponse;
      
      if (isQueuePayment) {
        // Queue payment for consultation
        paymentResponse = await apiRequest("POST", "/api/payment/queue/create", {
          amount: finalPaymentAmount,
          astrologerId: astrologerId,
          consultationId: consultationId,
          queueId: queueId,
          service: service,
          duration: duration,
          description: `Queue payment for ${service} consultation (${duration}min) with astrologer`
        });
      } else if (isServicePayment) {
        // Service payment (Match Making, etc.)
        paymentResponse = await apiRequest("POST", "/api/payment/service/create", {
          amount: finalPaymentAmount,
          service: service,
          packageName: packageName,
          description: `${packageName || 'Service Package'} - ${service.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`
        });
      } else {
        // Wallet recharge for astrologer consultation
        paymentResponse = await apiRequest("POST", "/api/payment/wallet/create", {
          amount: finalPaymentAmount,
          description: `Wallet Recharge for ${duration} min consultation with ${(astrologer as any)?.name || 'Astrologer'}`,
          astrologerId: astrologerId,
          duration: duration
        });
      }
      console.log(paymentResponse)
      const paymentData = await paymentResponse
      
      console.log('PayU Payment Data:', paymentData);
      console.log('Required fields check:', {
        key: !!paymentData.key,
        txnid: !!paymentData.txnid,
        hash: !!paymentData.hash,
        amount: !!paymentData.amount,
        productinfo: !!paymentData.productinfo,
        firstname: !!paymentData.firstname,
        email: !!paymentData.email
      });
      
      if (!paymentData.key || !paymentData.txnid || !paymentData.hash) {
        throw new Error('Invalid payment data received from server');
      }
      
      // Create form and submit to PayU Production
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://secure.payu.in/_payment';
      form.target = '_self';
      
      // Add all PayU fields
      Object.keys(paymentData).forEach(key => {
        if (paymentData[key] !== undefined && paymentData[key] !== null) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(paymentData[key]);
          form.appendChild(input);
        }
      });

      // Add form to body and submit
      document.body.appendChild(form);
      
      // Debug form before submission
      console.log('Form created:', form);
      console.log('Form action:', form.action);
      console.log('Form method:', form.method);
      console.log('Form fields:', Array.from(form.elements).map(el => ({
        name: (el as HTMLInputElement).name,
        value: (el as HTMLInputElement).value
      })));
      
      // Try immediate submission first
      try {
        console.log('Attempting form submission...');
        form.submit();
        console.log('Form submitted successfully');
        
        // Don't remove form immediately to allow submission to complete
        setTimeout(() => {
          if (document.body.contains(form)) {
            document.body.removeChild(form);
          }
        }, 2000);
        
      } catch (submitError) {
        console.error('Direct form submission failed:', submitError);
        
        // Fallback: try with timeout
        setTimeout(() => {
          try {
            console.log('Attempting delayed form submission...');
            form.submit();
            setTimeout(() => {
              if (document.body.contains(form)) {
                document.body.removeChild(form);
              }
            }, 2000);
          } catch (delayedError) {
            console.error('Delayed form submission also failed:', delayedError);
            setIsProcessing(false);
            if (document.body.contains(form)) {
              document.body.removeChild(form);
            }
          }
        }, 100);
      }
      
    } catch (error) {
      console.error("Payment initialization failed:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AstroTickHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {!service && (
            <Button
              variant="ghost"
              onClick={() => setLocation(`/packages/${astrologerId}`)}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Packages
            </Button>
          )}

          {service && (
            <Button
              variant="ghost"
              onClick={() => {
                // Navigate back to the correct service page
                if (service === 'match-making') {
                  setLocation('/match-making');
                } else if (service === 'packages') {
                  setLocation('/packages');
                } else {
                  setLocation(`/${service}`);
                }
              }}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {service === 'match-making' ? 'Match Making' : 
                       service === 'packages' ? 'Packages' :
                       service?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Button>
          )}

          <div className="space-y-6">
            {/* Payment Alert */}
            <Alert className="border-blue-200 bg-blue-50">
              <CreditCard className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                {service ? (
                  <>
                    <strong>Service Payment</strong>
                    <br />
                    Complete payment for your {packageName || 'service package'} to access expert consultation.
                  </>
                ) : (
                  <>
                    <strong>Insufficient Wallet Balance</strong>
                    <br />
                    You need to add ₹{finalPaymentAmount.toFixed(2)} to your wallet to book this consultation.
                  </>
                )}
              </AlertDescription>
            </Alert>

            {/* Payment Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Service/Consultation Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">
                    {isServicePayment ? 'Service Package' : 'Consultation Package'}
                  </h3>
                  <div className="space-y-2 text-sm">
                    {isServicePayment ? (
                      <>
                        <div className="flex justify-between">
                          <span>Service:</span>
                          <span className="font-medium">
                            {service === 'match-making' ? 'Match Making' : 
                             service?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Package:</span>
                          <span className="font-medium">{packageName || 'Service Package'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span className="font-medium">₹{amount}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span>Astrologer:</span>
                          <span className="font-medium">{(astrologer as any)?.name || 'Loading...'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-medium">{duration} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Package Price:</span>
                          <span className="font-medium">{formatPrice(packagePrice)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Payment Summary */}
                {service ? (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Payment Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Service Amount:</span>
                        <span className="font-medium">₹{amount}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between text-orange-600 font-semibold">
                        <span>Total to Pay:</span>
                        <span>₹{finalPaymentAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Wallet Balance</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Current Balance:</span>
                        <span className="font-medium">{formatPrice(userBalance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Required Amount:</span>
                        <span className="font-medium">{formatPrice(packagePrice)}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between text-orange-600 font-semibold">
                        <span>Amount to Pay:</span>
                        <span>₹{finalPaymentAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Button */}
                <div className="space-y-3">
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full h-12 text-lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Pay ₹{finalPaymentAmount.toFixed(2)} with PayU
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-center text-gray-500">
                    You will be redirected to PayU secure payment gateway
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800">Secure Payment</h4>
                    <p className="text-sm text-green-700">
                      Your payment is protected with bank-grade security and SSL encryption
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}