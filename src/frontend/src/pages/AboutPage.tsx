import { ABOUT_US_TEXT } from '../constants/platformCopy';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
              About Us
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-primary to-chart-2 mx-auto rounded-full"></div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border border-border/60 rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="prose prose-lg max-w-none">
              <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                {ABOUT_US_TEXT}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-card/30 border border-border/40 rounded-xl p-6 text-center space-y-2">
              <div className="text-3xl font-bold text-primary">Flexibility</div>
              <p className="text-sm text-muted-foreground">
                Customize templates your way, with full control over your design
              </p>
            </div>
            <div className="bg-card/30 border border-border/40 rounded-xl p-6 text-center space-y-2">
              <div className="text-3xl font-bold text-chart-1">Transparency</div>
              <p className="text-sm text-muted-foreground">
                Clear pricing and features, no hidden surprises
              </p>
            </div>
            <div className="bg-card/30 border border-border/40 rounded-xl p-6 text-center space-y-2">
              <div className="text-3xl font-bold text-chart-2">Control</div>
              <p className="text-sm text-muted-foreground">
                Stay in charge of your creative process from start to finish
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
