import { useParams } from '@tanstack/react-router';
import { useGetSharedBio } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

export default function SharedBioPage() {
  const { shareId } = useParams({ from: '/share/$shareId' });
  const { data: bioPage, isLoading, error } = useGetSharedBio(shareId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error || !bioPage) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="border-destructive/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
                <h1 className="text-2xl font-bold">Bio page not found</h1>
                <p className="text-muted-foreground">
                  The bio page you're looking for doesn't exist or has been removed.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pb-6 border-b border-border">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {bioPage.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto whitespace-pre-wrap">
            {bioPage.bioText}
          </p>
        </div>

        {/* Social Handles */}
        {bioPage.socialHandles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Connect With Me</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bioPage.socialHandles.map((handle) => (
                  <a
                    key={handle.id}
                    href={handle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{handle.platform}</div>
                      <div className="text-sm text-muted-foreground">@{handle.username}</div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Links */}
        {bioPage.links.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Important Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bioPage.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="p-4 rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-1">
                          <div className="font-semibold">{link.title}</div>
                          {link.description && (
                            <div className="text-sm text-muted-foreground">{link.description}</div>
                          )}
                        </div>
                        <ExternalLink className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer CTA */}
        <div className="text-center pt-8">
          <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Create your own beautiful bio page
                </p>
                <Button size="lg" asChild>
                  <a href="/">Get Started with Liinks</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
