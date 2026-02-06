import { useNavigate } from '@tanstack/react-router';
import PhoneOtpGate from '../components/PhoneOtpGate';

export default function PhoneVerificationPage() {
  const navigate = useNavigate();

  const handleVerified = () => {
    // After verification, redirect to signup with a flag
    navigate({ 
      to: '/signup',
      search: { reason: 'phone-verified' }
    });
  };

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <PhoneOtpGate
        onVerified={handleVerified}
        title="Verify Your Phone Number"
        description="Secure your account by verifying your phone number"
      />
    </div>
  );
}
