import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetAllTemplates } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Sparkles, Eye, LogIn, ExternalLink, Wand2 } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { useEffect, useState } from 'react';
import { getInfluencersByCategory } from '../data/topInfluencers';
import { SiInstagram } from 'react-icons/si';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export default function TemplateDetailPage() {
  const { templateId } = useParams({ from: '/templates/$templateId' });
  const { data: templates, isLoading } = useGetAllTemplates();
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a prompt for AI generation');
      return;
    }

    setIsGenerating(true);
    setAiResponse('');

    try {
      const apiKey = localStorage.getItem('openai_api_key');
      if (!apiKey) {
        toast.error('Please set your OpenAI API key in settings');
        setIsGenerating(false);
        return;
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a creative bio designer for ${template?.category} influencers. Generate engaging, professional bio content based on the user's request. Keep it concise and impactful.`,
            },
            {
              role: 'user',
              content: aiPrompt,
            },
          ],
          temperature: 0.8,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI content');
      }

      const data = await response.json();
      const generatedText = data.choices[0]?.message?.content || '';
      setAiResponse(generatedText);
      toast.success('AI content generated successfully!');
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error('Failed to generate AI content. Please check your API key.');
    } finally {
      setIsGenerating(false);
    }
  };

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

        <Card className="overflow-hidden border-primary/20">
          <div className="aspect-[3/4] md:aspect-video relative">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted">
              <div className="text-center space-y-4 p-8">
                <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold">Customizable Template</h3>
                  <p className="text-muted-foreground max-w-md">
                    This template has no fixed background. Customize it completely with your own colors, images, and style.
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Fully Customizable</span>
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
                    className="flex items-center gap-3 p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-accent/50 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {influencer.displayName.charAt(0)}
                    </div>
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

        <Card className="border-primary/20 bg-gradient-to-br from-card to-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
              AI-Powered Design Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ai-prompt">Describe what you want to create</Label>
              <Textarea
                id="ai-prompt"
                placeholder={`Example: Create a bio for a ${template.category.toLowerCase()} influencer who focuses on sustainable fashion and has 50k followers...`}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
            <Button
              onClick={handleGenerateWithAI}
              disabled={isGenerating || !aiPrompt.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate with AI
                </>
              )}
            </Button>
            {aiResponse && (
              <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm font-medium mb-2">AI Generated Content:</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{aiResponse}</p>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Note: You need to set your OpenAI API key in localStorage with key 'openai_api_key' to use this feature.
            </p>
          </CardContent>
        </Card>

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
