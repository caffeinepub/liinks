import { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useRegisterProfile } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { toast } from 'sonner';
import { Info, Loader2, AlertCircle } from 'lucide-react';
import PhoneOtpGate from '../components/PhoneOtpGate';
import { normalizeBackendError } from '../utils/backendErrors';

export default function SignupPage() {
  const [step, setStep] = useState<'phone-verification' | 'profile'>('phone-verification');
  const [verifiedPhoneNumber, setVerifiedPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const registerMutation = useRegisterProfile();
  const search = useSearch({ from: '/signup' });

  const [guidanceMessage, setGuidanceMessage] = useState<string | null>(null);

  useEffect(() => {
    // Show guidance message based on redirect reason
    if (search.reason === 'registration-required') {
      setGuidanceMessage('Please complete signup to customize templates and access all features.');
    } else if (search.reason === 'phone-verified') {
      // If coming from phone verification page, skip to profile step
      setStep('profile');
      setGuidanceMessage('Phone verified! Complete your profile to continue.');
    }
  }, [search.reason]);

  const handlePhoneVerified = (phoneNumber: string) => {
    setVerifiedPhoneNumber(phoneNumber);
    setStep('profile');
    setErrorMessage(null); // Clear any previous errors
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); // Clear previous errors

    if (!firstName || !lastName || !email || !verifiedPhoneNumber) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await registerMutation.mutateAsync({ 
        firstName, 
        lastName, 
        email, 
        phoneNumber: verifiedPhoneNumber 
      });
      toast.success('Profile created successfully!');
      navigate({ to: '/templates' });
    } catch (error: any) {
      const guidance = normalizeBackendError(error);
      
      // Show toast for immediate feedback
      toast.error(guidance.message);
      
      // Set inline error for persistent display
      setErrorMessage(guidance.message);
      
      // If already registered, navigate to templates
      if (guidance.navigateTo === '/templates') {
        setTimeout(() => {
          navigate({ to: '/templates' });
        }, 2000);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      {step === 'phone-verification' ? (
        <PhoneOtpGate
          onVerified={handlePhoneVerified}
          title="Verify Your Phone"
          description="First, let's verify your phone number to secure your account"
        />
      ) : (
        <Card className="w-full max-w-md border-primary/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Complete Your Profile</CardTitle>
            <CardDescription className="text-center">
              Tell us a bit about yourself to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {guidanceMessage && (
              <Alert className="border-primary/30 bg-primary/5">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {guidanceMessage}
                </AlertDescription>
              </Alert>
            )}
            
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Registration Error</AlertTitle>
                <AlertDescription className="text-sm">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={registerMutation.isPending}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={registerMutation.isPending}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={registerMutation.isPending}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={verifiedPhoneNumber}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  ✓ Verified
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
