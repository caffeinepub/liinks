import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetAllTemplates, useHasActiveSubscription } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Lock, Sparkles } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

export default function TemplateDetailPage() {
  const { templateId } = useParams({ from: '/templates/$templateId' });
  const { data: templates, isLoading } = useGetAllTemplates();
  const { data: hasSubscription, isLoading: subLoading } = useHasActiveSubscription();
  const navigate = useNavigate();

  const template = templates?.find((t) => t.id === templateId);

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
    if (!hasSubscription) {
      navigate({ to: '/pricing' });
    } else {
      navigate({ to: '/editor/$templateId', params: { templateId: template.id } });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold">{template.name}</h1>
              <Badge variant="secondary">{template.category}</Badge>
            </div>
            <p className="text-lg text-muted-foreground">{template.description}</p>
          </div>
        </div>

        <Card className="overflow-hidden border-primary/20">
          <div className="aspect-[3/4] md:aspect-video bg-muted">
            <img
              src={template.thumbnail.getDirectURL()}
              alt={template.name}
              className="object-cover w-full h-full"
            />
          </div>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Ready to use this template?</h2>
              <p className="text-muted-foreground">
                {hasSubscription
                  ? 'Click below to copy this template and start customizing it with your own content.'
                  : 'Subscribe to Premium or Pro to copy and customize this template with your own links, bio, and social handles.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={handleCopyTemplate}
                disabled={subLoading}
                className="flex-1 text-lg py-6"
              >
                {hasSubscription ? (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Copy & Customize
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Subscribe to Use
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
