import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Sparkles, Zap, Upload, Check } from 'lucide-react';
import { useEffect } from 'react';

export default function LandingPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity && !isLoading && userProfile) {
      navigate({ to: '/templates' });
    }
  }, [identity, userProfile, isLoading, navigate]);

  const handleGetStarted = async () => {
    if (!identity) {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
      }
    }
  };

  return (
    <div className="relative">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: 'url(/assets/generated/liinks-hero-bg.dim_1920x1080.png)' }}
      />
      
      <div className="relative">
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4">
              <Sparkles className="h-4 w-4" />
              Premium Bio Page Templates
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
                Liinks
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Link to your content and social accounts
            </p>
            
            <p className="text-base md:text-lg text-foreground/80 max-w-2xl mx-auto">
              Choose from premium templates inspired by top influencers across every niche. 
              Customize your bio page and share your links in style.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                onClick={handleGetStarted}
                disabled={isLoggingIn}
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-chart-1 hover:opacity-90"
              >
                {isLoggingIn ? 'Loading...' : 'Get Started'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ to: '/pricing' })}
                className="text-lg px-8 py-6"
              >
                View Pricing
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Premium Templates</h3>
                <p className="text-muted-foreground">
                  Browse templates inspired by famous influencers across 13+ categories
                </p>
              </CardContent>
            </Card>

            <Card className="border-chart-1/20 bg-card/50 backdrop-blur">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded-full bg-chart-1/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-chart-1" />
                </div>
                <h3 className="text-xl font-semibold">Easy Customization</h3>
                <p className="text-muted-foreground">
                  Copy any template and customize it with your own links, bio, and social handles
                </p>
              </CardContent>
            </Card>

            <Card className="border-chart-2/20 bg-card/50 backdrop-blur">
              <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded-full bg-chart-2/10 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-chart-2" />
                </div>
                <h3 className="text-xl font-semibold">Create & Share</h3>
                <p className="text-muted-foreground">
                  Pro users can create and upload their own templates to the platform
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Templates for Every Creator
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                'Digital Creators',
                'Video & Photography',
                'Music & Performances',
                'Brand & Commerce',
                'Communities',
                'Fitness & Coaching',
                'Travel & Real Estate',
                'Fashion',
                'Food',
                'Clothing',
                'Design',
                'Tech & Gaming',
                'Influencers & Bloggers',
              ].map((category) => (
                <div
                  key={category}
                  className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50"
                >
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium">{category}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
