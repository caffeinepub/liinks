import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useSubscribe } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { Check, Copy, Smartphone } from 'lucide-react';
import { SiGooglepay } from 'react-icons/si';
import PaymentQrUploader from '../components/PaymentQrUploader';
import { SubscriptionTier } from '../backend';
import { generateUpiLink, openGooglePay, openPhonePe, copyToClipboard } from '../utils/upi';

type PaymentMethod = 'razorpay' | 'gpay' | 'phonepe';

export default function CheckoutPage() {
  const { tier } = useParams({ from: '/checkout/$tier' });
  const navigate = useNavigate();
  const subscribeMutation = useSubscribe();
  const [paymentReference, setPaymentReference] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('razorpay');
  const [appOpenFailed, setAppOpenFailed] = useState(false);

  const upiId = '8767572764-2@ybl';
  const amount = tier === 'pro' ? 499 : 199;
  const tierName = tier === 'pro' ? 'Pro' : 'Premium';

  const upiLink = generateUpiLink({
    payeeVpa: upiId,
    payeeName: 'Liinks',
    amount,
    transactionNote: `${tierName} Subscription`,
  });

  const copyUpiId = async () => {
    const success = await copyToClipboard(upiId);
    if (success) {
      toast.success('UPI ID copied to clipboard');
    } else {
      toast.error('Failed to copy UPI ID');
    }
  };

  const copyUpiLink = async () => {
    const success = await copyToClipboard(upiLink);
    if (success) {
      toast.success('UPI payment link copied to clipboard');
    } else {
      toast.error('Failed to copy UPI link');
    }
  };

  const handleGooglePayClick = async () => {
    setAppOpenFailed(false);
    const success = await openGooglePay(upiLink);
    if (!success) {
      setAppOpenFailed(true);
      toast.info('Google Pay app not found. Use the copy options below.');
    }
  };

  const handlePhonePeClick = async () => {
    setAppOpenFailed(false);
    const success = await openPhonePe(upiLink);
    if (!success) {
      setAppOpenFailed(true);
      toast.info('PhonePe app not found. Use the copy options below.');
    }
  };

  const handleConfirmPayment = async () => {
    if (!paymentReference.trim()) {
      toast.error('Please enter a payment reference or transaction ID');
      return;
    }

    setConfirming(true);
    try {
      const duration = BigInt(Date.now() + 30 * 24 * 60 * 60 * 1000) * BigInt(1000000);
      const subscriptionTier = tier === 'pro' ? SubscriptionTier.pro : SubscriptionTier.premium;
      await subscribeMutation.mutateAsync({
        tier: subscriptionTier,
        duration,
        paymentReference: paymentReference.trim(),
      });
      toast.success('Subscription activated successfully!');
      navigate({ to: '/templates' });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to activate subscription';
      if (errorMessage.includes('not registered') || errorMessage.includes('register first')) {
        toast.error('Please complete signup before subscribing');
      } else if (errorMessage.includes('Unauthorized')) {
        toast.error('Please log in to continue');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setConfirming(false);
    }
  };

  const renderPaymentMethodInstructions = () => {
    switch (selectedMethod) {
      case 'gpay':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <SiGooglepay className="h-5 w-5" />
                Pay with Google Pay
              </h4>
              <p className="text-sm text-muted-foreground">
                Click the button below to open Google Pay and complete your payment of ₹{amount}.
              </p>
              <Button
                onClick={handleGooglePayClick}
                className="w-full"
                size="lg"
                variant="default"
              >
                <SiGooglepay className="h-5 w-5 mr-2" />
                Open Google Pay
              </Button>
              {appOpenFailed && (
                <div className="space-y-2 pt-2 border-t">
                  <p className="text-sm font-medium">App not installed? Use these options:</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyUpiId} className="flex-1">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy UPI ID
                    </Button>
                    <Button variant="outline" size="sm" onClick={copyUpiLink} className="flex-1">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Payment Link
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'phonepe':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Pay with PhonePe
              </h4>
              <p className="text-sm text-muted-foreground">
                Click the button below to open PhonePe and complete your payment of ₹{amount}.
              </p>
              <Button
                onClick={handlePhonePeClick}
                className="w-full"
                size="lg"
                variant="default"
              >
                <Smartphone className="h-5 w-5 mr-2" />
                Open PhonePe
              </Button>
              {appOpenFailed && (
                <div className="space-y-2 pt-2 border-t">
                  <p className="text-sm font-medium">App not installed? Use these options:</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyUpiId} className="flex-1">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy UPI ID
                    </Button>
                    <Button variant="outline" size="sm" onClick={copyUpiLink} className="flex-1">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Payment Link
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'razorpay':
      default:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>UPI ID</Label>
              <div className="flex gap-2">
                <Input value={upiId} readOnly className="font-mono" />
                <Button variant="outline" size="icon" onClick={copyUpiId}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Send payment to this UPI ID using any UPI app (Razorpay, Paytm, etc.)
              </p>
            </div>

            <PaymentQrUploader />
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Complete Your Purchase</h1>
          <p className="text-muted-foreground">
            Subscribe to {tierName} for ₹{amount}/month
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Choose your preferred payment method</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Amount</span>
                    <span className="text-2xl font-bold">₹{amount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Plan</span>
                    <span className="font-semibold">{tierName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Billing</span>
                    <span>Monthly</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Select Payment Method</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={selectedMethod === 'razorpay' ? 'default' : 'outline'}
                      onClick={() => {
                        setSelectedMethod('razorpay');
                        setAppOpenFailed(false);
                      }}
                      className="h-auto py-3 flex flex-col items-center gap-1"
                    >
                      <Smartphone className="h-5 w-5" />
                      <span className="text-xs">Razorpay</span>
                    </Button>
                    <Button
                      variant={selectedMethod === 'gpay' ? 'default' : 'outline'}
                      onClick={() => {
                        setSelectedMethod('gpay');
                        setAppOpenFailed(false);
                      }}
                      className="h-auto py-3 flex flex-col items-center gap-1"
                    >
                      <SiGooglepay className="h-5 w-5" />
                      <span className="text-xs">Google Pay</span>
                    </Button>
                    <Button
                      variant={selectedMethod === 'phonepe' ? 'default' : 'outline'}
                      onClick={() => {
                        setSelectedMethod('phonepe');
                        setAppOpenFailed(false);
                      }}
                      className="h-auto py-3 flex flex-col items-center gap-1"
                    >
                      <Smartphone className="h-5 w-5" />
                      <span className="text-xs">PhonePe</span>
                    </Button>
                  </div>
                </div>

                {renderPaymentMethodInstructions()}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Confirm Payment</CardTitle>
              <CardDescription>
                After completing the payment, enter your transaction details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reference">Payment Reference / Transaction ID *</Label>
                  <Input
                    id="reference"
                    placeholder="Enter transaction ID"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    You can find this in your UPI app after payment
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <h4 className="font-medium text-sm">What you'll get:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Access to all premium templates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Copy and customize templates</span>
                    </li>
                    {tier === 'pro' && (
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>Upload your own templates</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleConfirmPayment}
                disabled={confirming || subscribeMutation.isPending}
              >
                {confirming || subscribeMutation.isPending ? 'Confirming...' : 'Confirm Payment'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
