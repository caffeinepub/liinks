import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { useRequestOtp, useVerifyOtp } from '../hooks/useQueries';
import { toast } from 'sonner';
import { CheckCircle2, Info, Loader2 } from 'lucide-react';

interface PhoneOtpGateProps {
  onVerified: (phoneNumber: string) => void;
  title?: string;
  description?: string;
}

export default function PhoneOtpGate({ onVerified, title, description }: PhoneOtpGateProps) {
  const [step, setStep] = useState<'phone' | 'otp' | 'verified'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const requestOtpMutation = useRequestOtp();
  const verifyOtpMutation = useVerifyOtp();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber || phoneNumber.length < 5) {
      toast.error('Please enter a valid phone number (at least 5 characters)');
      return;
    }

    // Generate a 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);

    try {
      await requestOtpMutation.mutateAsync({ phoneNumber, otpCode: otp });
      toast.success('OTP generated successfully');
      setStep('otp');
    } catch (error: any) {
      toast.error(error.message || 'Failed to request OTP');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpCode || otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    try {
      await verifyOtpMutation.mutateAsync({ phoneNumber, otpCode });
      toast.success('Phone number verified successfully!');
      setStep('verified');
      onVerified(phoneNumber);
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setOtpCode('');

    try {
      await requestOtpMutation.mutateAsync({ phoneNumber, otpCode: otp });
      toast.success('New OTP generated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend OTP');
    }
  };

  if (step === 'verified') {
    return (
      <Card className="w-full max-w-md border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Phone Verified!</h3>
              <p className="text-muted-foreground">
                Your phone number has been successfully verified.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'otp') {
    return (
      <Card className="w-full max-w-md border-primary/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Enter OTP</CardTitle>
          <CardDescription className="text-center">
            Enter the 6-digit code to verify your phone number
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-primary/30 bg-primary/5">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Development Mode:</strong> SMS is not enabled in this build. Your OTP code is: <strong className="text-primary text-lg">{generatedOtp}</strong>
            </AlertDescription>
          </Alert>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-center block">OTP Code</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otpCode}
                  onChange={(value) => setOtpCode(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Verifying: {phoneNumber}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={verifyOtpMutation.isPending || otpCode.length !== 6}
            >
              {verifyOtpMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep('phone')}
                disabled={requestOtpMutation.isPending || verifyOtpMutation.isPending}
              >
                Change Number
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResendOtp}
                disabled={requestOtpMutation.isPending || verifyOtpMutation.isPending}
              >
                {requestOtpMutation.isPending ? 'Sending...' : 'Resend OTP'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-primary/20">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {title || 'Verify Your Phone'}
        </CardTitle>
        <CardDescription className="text-center">
          {description || 'Enter your phone number to receive a verification code'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+91 98765 43210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              minLength={5}
            />
            <p className="text-xs text-muted-foreground">
              Enter your phone number with country code
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={requestOtpMutation.isPending}
          >
            {requestOtpMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating OTP...
              </>
            ) : (
              'Request OTP'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
