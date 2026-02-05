import { useNavigate, useSearch } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Check, Sparkles, Crown, AlertCircle } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { SubscriptionTier } from '../backend';

export default function PricingPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const navigate = useNavigate();
  const search = useSearch({ from: '/pricing' }) as { reason?: string; action?: string; templateId?: string };

  const currentTier = userProfile?.subscription;
  const showGatingMessage = search.reason === 'subscription-required';

  const handleSelectPlan = (tier: 'premium' | 'pro') => {
    navigate({ to: '/checkout/$tier', params: { tier } });
  };

  const premiumFeatures = [
    'Access to all premium templates',
    'Copy and customize templates',
    'Create unlimited bio pages',
    'Custom social handles',
    'Custom links',
    'Share your bio pages',
  ];

  const proFeatures = [
    'Everything in Premium',
    'Upload your own templates',
    'Earn from template sales',
    'Priority support',
    'Early access to new features',
    'Pro badge on profile',
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Subscribe to unlock the ability to copy and customize templates for your bio pages
          </p>
        </div>

        {showGatingMessage && (
          <Alert className="max-w-3xl mx-auto border-primary/40 bg-primary/5">
            <AlertCircle className="h-5 w-5 text-primary" />
            <AlertTitle className="text-lg font-semibold">Subscription Required</AlertTitle>
            <AlertDescription className="text-base mt-2">
              {search.action === 'copy' || search.action === 'customize'
                ? 'An active subscription is required to copy and customize templates. Browsing templates is free for all registered users, but to create your own bio pages you need a Premium or Pro subscription.'
                : 'An active subscription is required to access this feature. Choose a plan below to get started.'}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="relative border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Sparkles className="h-8 w-8 text-chart-1" />
                {currentTier === SubscriptionTier.premium && (
                  <Badge variant="default">Current Plan</Badge>
                )}
              </div>
              <CardTitle className="text-3xl">Premium</CardTitle>
              <CardDescription className="text-lg">
                Perfect for individuals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <div className="text-4xl font-bold">₹199</div>
                <div className="text-muted-foreground">per month</div>
              </div>
              <ul className="space-y-3">
                {premiumFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-chart-1 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                size="lg"
                className="w-full"
                onClick={() => handleSelectPlan('premium')}
                disabled={currentTier === SubscriptionTier.premium}
              >
                {currentTier === SubscriptionTier.premium ? 'Current Plan' : 'Get Premium'}
              </Button>
            </CardFooter>
          </Card>

          <Card className="relative border-chart-2/40 hover:border-chart-2/60 transition-colors bg-gradient-to-br from-card to-chart-2/5">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-chart-1 to-chart-2 text-white px-4 py-1">
                Most Popular
              </Badge>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Crown className="h-8 w-8 text-chart-2" />
                {currentTier === SubscriptionTier.pro && (
                  <Badge variant="default">Current Plan</Badge>
                )}
              </div>
              <CardTitle className="text-3xl">Pro</CardTitle>
              <CardDescription className="text-lg">
                For creators and professionals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <div className="text-4xl font-bold">₹499</div>
                <div className="text-muted-foreground">per month</div>
              </div>
              <ul className="space-y-3">
                {proFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-chart-2 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-chart-1 to-chart-2 hover:opacity-90"
                onClick={() => handleSelectPlan('pro')}
                disabled={currentTier === SubscriptionTier.pro}
              >
                {currentTier === SubscriptionTier.pro ? 'Current Plan' : 'Get Pro'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
          <p>
            All plans include access to view all templates. Subscription is required only for copying and customizing templates.
          </p>
        </div>
      </div>
    </div>
  );
}
