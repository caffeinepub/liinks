import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useSubscribe } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { Check, Copy } from 'lucide-react';
import PaymentQrUploader from '../components/PaymentQrUploader';
import { SubscriptionTier } from '../backend';

export default function CheckoutPage() {
  const { tier } = useParams({ from: '/checkout/$tier' });
  const navigate = useNavigate();
  const subscribeMutation = useSubscribe();
  const [paymentReference, setPaymentReference] = useState('');
  const [confirming, setConfirming] = useState(false);

  const upiId = '8767572764-2@ybl';
  const amount = tier === 'pro' ? 499 : 199;
  const tierName = tier === 'pro' ? 'Pro' : 'Premium';

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    toast.success('UPI ID copied to clipboard');
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
      });
      toast.success('Subscription activated successfully!');
      navigate({ to: '/templates' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to activate subscription');
    } finally {
      setConfirming(false);
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
              <CardDescription>Pay using UPI or scan the QR code</CardDescription>
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

                <div className="space-y-2">
                  <Label>UPI ID</Label>
                  <div className="flex gap-2">
                    <Input value={upiId} readOnly className="font-mono" />
                    <Button variant="outline" size="icon" onClick={copyUpiId}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Send payment to this UPI ID using any UPI app
                  </p>
                </div>
              </div>

              <PaymentQrUploader />
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
                  <Label htmlFor="reference">Payment Reference / Transaction ID</Label>
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
