import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetAllTemplates, useCreateBioPage } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';
import LinksEditor from '../components/LinksEditor';
import SocialHandlesEditor from '../components/SocialHandlesEditor';
import BioFormulaHelper from '../components/BioFormulaHelper';
import { Copy, ExternalLink, Check } from 'lucide-react';
import type { Link, SocialHandle } from '../backend';

interface EditableContent {
  title?: string;
  bioText?: string;
  socialHandles?: SocialHandle[];
  links?: Link[];
}

export default function TemplateEditorPage() {
  const { templateId } = useParams({ from: '/editor/$templateId' });
  const { data: templates } = useGetAllTemplates();
  const createBioPageMutation = useCreateBioPage();
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  const template = templates?.find((t) => t.id === templateId);

  const [title, setTitle] = useState('');
  const [bioText, setBioText] = useState('');
  const [links, setLinks] = useState<Link[]>([]);
  const [socialHandles, setSocialHandles] = useState<SocialHandle[]>([]);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (template) {
      // Try to parse editableContent if present
      if (template.editableContent && template.editableContent.length > 0) {
        try {
          const decoder = new TextDecoder();
          const jsonString = decoder.decode(template.editableContent);
          const content: EditableContent = JSON.parse(jsonString);
          
          // Initialize state from editableContent
          if (content.title) setTitle(content.title);
          if (content.bioText) setBioText(content.bioText);
          if (content.socialHandles && Array.isArray(content.socialHandles)) {
            setSocialHandles(content.socialHandles);
          }
          if (content.links && Array.isArray(content.links)) {
            setLinks(content.links);
          }
        } catch (error) {
          // Fallback to template name/description if JSON parsing fails
          console.warn('Failed to parse editableContent, using fallback:', error);
          setTitle(template.name);
          setBioText(template.description);
        }
      } else {
        // Fallback when editableContent is empty
        setTitle(template.name);
        setBioText(template.description);
      }
    }
  }, [template]);

  const handleInsertBioFormula = (starterText: string) => {
    if (bioText.trim()) {
      // If bio already has content, ask for confirmation
      if (window.confirm('This will replace your current bio text. Continue?')) {
        setBioText(starterText);
        toast.success('Bio formula template inserted');
      }
    } else {
      // If empty, insert directly
      setBioText(starterText);
      toast.success('Bio formula template inserted');
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !bioText.trim()) {
      toast.error('Please fill in title and bio');
      return;
    }

    if (!identity) {
      toast.error('You must be logged in to save');
      return;
    }

    try {
      await createBioPageMutation.mutateAsync({
        templateId,
        title,
        bioText,
        socialHandles,
        links,
      });
      
      // Generate share URL using principal as shareId
      const principalId = identity.getPrincipal().toString();
      const shareId = `${principalId}_${templateId}`;
      const url = `${window.location.origin}/share/${shareId}`;
      setShareUrl(url);
      setShowShareDialog(true);
      
      toast.success('Bio page saved successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save bio page');
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleOpenInNewTab = () => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  if (!template) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Template not found</h1>
          <Button onClick={() => navigate({ to: '/templates' })}>
            Back to Templates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Customize Your Bio Page</h1>
          <p className="text-muted-foreground text-lg">
            Edit your template and add your personal touch
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="shadow-sm border-border/60">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">Page Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Your Name or Brand"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bioText}
                    onChange={(e) => setBioText(e.target.value)}
                    placeholder="Tell people about yourself..."
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use the Bio Formula helper below for inspiration
                  </p>
                </div>
              </CardContent>
            </Card>

            <BioFormulaHelper onInsert={handleInsertBioFormula} />

            <SocialHandlesEditor
              socialHandles={socialHandles}
              onChange={setSocialHandles}
            />
          </div>

          <div className="space-y-6">
            <LinksEditor links={links} onChange={setLinks} />

            <Card className="border-primary/30 bg-gradient-to-br from-card to-primary/5 shadow-premium">
              <CardContent className="pt-6">
                <Button
                  className="w-full h-12 text-base shadow-sm hover:shadow transition-all"
                  size="lg"
                  onClick={handleSave}
                  disabled={createBioPageMutation.isPending}
                >
                  {createBioPageMutation.isPending ? 'Saving...' : 'Save & Share Bio Page'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Bio Page is Ready!</DialogTitle>
            <DialogDescription>
              Share this link with your audience
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopyUrl}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                variant="outline"
                onClick={handleOpenInNewTab}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
              <Button
                className="flex-1"
                onClick={() => setShowShareDialog(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
