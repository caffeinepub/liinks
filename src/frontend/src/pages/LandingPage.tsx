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
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Premium Bio Page Templates
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1]">
              One link. Endless ways to stand out.
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Create stunning bio pages with premium templates, smart customization, and creator-first features — all in minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <div className="flex flex-col items-center gap-2">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  disabled={isLoggingIn}
                  className="text-lg px-10 py-7 bg-gradient-to-r from-primary to-chart-1 hover:opacity-90 shadow-premium hover:shadow-premium-lg transition-all duration-300"
                >
                  {isLoggingIn ? 'Loading...' : 'Get your link page'}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Free to start · No credit card required
                </p>
              </div>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ to: '/templates' })}
                className="text-lg px-10 py-7 shadow-sm hover:shadow transition-all duration-300"
              >
                Explore templates
              </Button>
            </div>
          </div>
        </section>

        {/* Value Proposition Block */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 tracking-tight">
              Why creators choose Liinks
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">Premium templates inspired by top creators</p>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">Fully customizable — no design skills needed</p>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">Optimized for clicks, engagement, and growth</p>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">Built for creators, brands, and communities</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 tracking-tight">
            Designed to perform, not just exist
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-primary/20 bg-card/50 backdrop-blur hover:shadow-premium transition-all duration-300 hover:border-primary/40 transform hover:-translate-y-1">
              <CardContent className="pt-8 space-y-5">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight">Premium Templates</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Curated bio page designs inspired by top creators across 13+ niches
                </p>
              </CardContent>
            </Card>

            <Card className="border-chart-1/20 bg-card/50 backdrop-blur hover:shadow-premium transition-all duration-300 hover:border-chart-1/40 transform hover:-translate-y-1">
              <CardContent className="pt-8 space-y-5">
                <div className="h-14 w-14 rounded-2xl bg-chart-1/10 flex items-center justify-center shadow-sm">
                  <Zap className="h-7 w-7 text-chart-1" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight">Easy Customization</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Customize links, colors, fonts, and layouts in minutes — no code required
                </p>
              </CardContent>
            </Card>

            <Card className="border-chart-2/20 bg-card/50 backdrop-blur hover:shadow-premium transition-all duration-300 hover:border-chart-2/40 transform hover:-translate-y-1">
              <CardContent className="pt-8 space-y-5">
                <div className="h-14 w-14 rounded-2xl bg-chart-2/10 flex items-center justify-center shadow-sm">
                  <Upload className="h-7 w-7 text-chart-2" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight">Create & Share</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Publish instantly and share one powerful link everywhere you show up
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Differentiation Callout */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="relative p-8 md:p-10 rounded-2xl bg-gradient-to-br from-primary/10 via-chart-1/10 to-chart-2/10 border border-primary/20 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl" />
              <p className="relative text-lg md:text-xl text-center leading-relaxed font-medium">
                Liinks isn't just a list of links — it's a customizable, performance-focused bio page designed to help creators stand out and grow.
              </p>
            </div>
          </div>
        </section>

        {/* Templates Categories */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 tracking-tight">
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
                  className="flex items-center gap-2.5 p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/40 hover:bg-accent/30 transition-all duration-200"
                >
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium">{category}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust & Credibility Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Built for creators who care about quality
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join creators across multiple niches who use Liinks to showcase their content, grow their audience, and make every click count.
            </p>
            <div className="grid md:grid-cols-3 gap-6 pt-8">
              <div className="p-6 rounded-xl bg-muted/30 border border-border/50">
                <div className="text-3xl font-bold text-primary mb-2">13+</div>
                <p className="text-sm text-muted-foreground">Creator Categories</p>
              </div>
              <div className="p-6 rounded-xl bg-muted/30 border border-border/50">
                <div className="text-3xl font-bold text-chart-1 mb-2">130+</div>
                <p className="text-sm text-muted-foreground">Premium Templates</p>
              </div>
              <div className="p-6 rounded-xl bg-muted/30 border border-border/50">
                <div className="text-3xl font-bold text-chart-2 mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Customizable</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
