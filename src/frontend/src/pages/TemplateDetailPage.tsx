import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetAllTemplates } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Sparkles, Eye, LogIn, ExternalLink } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { useEffect } from 'react';
import { getInfluencersByCategory } from '../data/topInfluencers';
import { SiInstagram } from 'react-icons/si';

export default function TemplateDetailPage() {
  const { templateId } = useParams({ from: '/templates/$templateId' });
  const { data: templates, isLoading } = useGetAllTemplates();
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  const template = templates?.find((t) => t.id === templateId);
  const influencers = template ? getInfluencersByCategory(template.category) : [];

  const isAuthenticated = !!identity;

  // Disable right-click, keyboard shortcuts, and other screenshot methods
  useEffect(() => {
    const preventScreenshot = (e: Event) => {
      e.preventDefault();
      return false;
    };

    const preventKeyboardShortcuts = (e: KeyboardEvent) => {
      // Prevent Print Screen, Cmd+Shift+3/4/5 (Mac), Windows+Shift+S, etc.
      if (
        e.key === 'PrintScreen' ||
        (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key)) ||
        (e.key === 's' && e.metaKey && e.shiftKey) ||
        (e.key === 's' && e.ctrlKey && e.shiftKey)
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Prevent context menu (right-click)
    document.addEventListener('contextmenu', preventScreenshot);
    // Prevent keyboard shortcuts
    document.addEventListener('keydown', preventKeyboardShortcuts);
    // Prevent drag and drop
    document.addEventListener('dragstart', preventScreenshot);

    return () => {
      document.removeEventListener('contextmenu', preventScreenshot);
      document.removeEventListener('keydown', preventKeyboardShortcuts);
      document.removeEventListener('dragstart', preventScreenshot);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Template not found</h1>
          <Button onClick={() => navigate({ to: '/templates' })}>
            Back to Templates
          </Button>
        </div>
      </div>
    );
  }

  const handleCopyTemplate = () => {
    if (!isAuthenticated) {
      navigate({ to: '/' });
    } else {
      navigate({ to: '/editor/$templateId', params: { templateId: template.id } });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-bold">{template.name}</h1>
              <Badge variant="secondary">{template.category}</Badge>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">{template.description}</p>
          </div>
        </div>

        <Card className="overflow-hidden border-primary/20 screenshot-protected">
          <div className="aspect-[3/4] md:aspect-video bg-muted relative">
            <img
              src={template.thumbnail.getDirectURL()}
              alt={template.name}
              className="object-cover w-full h-full select-none pointer-events-none"
              draggable="false"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Preview Only</span>
            </div>
          </div>
        </Card>

        {influencers.length > 0 && (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SiInstagram className="h-5 w-5 text-pink-500" />
                Top Influencers in {template.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {influencers.map((influencer, idx) => (
                  <a
                    key={idx}
                    href={`https://instagram.com/${influencer.instagramHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-accent/50 transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{influencer.displayName}</p>
                      <p className="text-sm text-muted-foreground truncate">@{influencer.instagramHandle}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Ready to use this template?</h2>
              <p className="text-muted-foreground leading-relaxed">
                {!isAuthenticated
                  ? 'Login to copy and customize this template with your own links, bio, and social handles.'
                  : 'Click below to copy this template and start customizing it with your own content.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={handleCopyTemplate}
                className="flex-1 text-lg py-6"
              >
                {!isAuthenticated ? (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Login to Customize
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Copy & Customize
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ to: '/templates' })}
                className="flex-1 text-lg py-6"
              >
                Browse More Templates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
