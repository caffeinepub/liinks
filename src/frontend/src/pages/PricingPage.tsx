import { useNavigate } from '@tanstack/react-router';
import { useHasActiveSubscription, useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Check, Sparkles, Zap } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export default function PricingPage() {
  const navigate = useNavigate();
  const { data: hasSubscription } = useHasActiveSubscription();
  const { data: userProfile } = useGetCallerUserProfile();

  const currentTier = userProfile?.subscription || null;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock premium templates and start building your perfect bio page
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="relative border-primary/50 shadow-lg shadow-primary/10">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Premium</CardTitle>
                {currentTier === 'premium' && (
                  <Badge variant="default" className="bg-primary">
                    Current Plan
                  </Badge>
                )}
              </div>
              <CardDescription>Perfect for creators getting started</CardDescription>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">₹199</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Access to all premium templates</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Copy and customize templates</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Edit bio, links, and social handles</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Mobile-responsive designs</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={() => navigate({ to: '/checkout/$tier', params: { tier: 'premium' } })}
                disabled={currentTier === 'premium'}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                {currentTier === 'premium' ? 'Current Plan' : 'Get Premium'}
              </Button>
            </CardFooter>
          </Card>

          <Card className="relative border-chart-1/50 shadow-lg shadow-chart-1/10 bg-gradient-to-br from-card to-chart-1/5">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-chart-1 to-chart-2 text-white px-4 py-1">
                Most Popular
              </Badge>
            </div>
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Pro</CardTitle>
                {currentTier === 'pro' && (
                  <Badge variant="default" className="bg-chart-1">
                    Current Plan
                  </Badge>
                )}
              </div>
              <CardDescription>For creators who want to do more</CardDescription>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">₹499</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-chart-1 shrink-0 mt-0.5" />
                  <span className="font-medium">Everything in Premium, plus:</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-chart-1 shrink-0 mt-0.5" />
                  <span>Create and upload your own templates</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-chart-1 shrink-0 mt-0.5" />
                  <span>Share templates with the community</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-chart-1 shrink-0 mt-0.5" />
                  <span>Priority support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-gradient-to-r from-chart-1 to-chart-2 hover:opacity-90"
                size="lg"
                onClick={() => navigate({ to: '/checkout/$tier', params: { tier: 'pro' } })}
                disabled={currentTier === 'pro'}
              >
                <Zap className="h-5 w-5 mr-2" />
                {currentTier === 'pro' ? 'Current Plan' : 'Get Pro'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
