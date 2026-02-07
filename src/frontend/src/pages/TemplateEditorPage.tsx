import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetAllTemplates, useCreateBioPage, useIsRegistered, useIsPhoneVerified } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { toast } from 'sonner';
import LinksEditor from '../components/LinksEditor';
import SocialHandlesEditor from '../components/SocialHandlesEditor';
import BioFormulaHelper from '../components/BioFormulaHelper';
import { Copy, ExternalLink, Check, Palette, AlertCircle, LogIn, UserPlus, Phone } from 'lucide-react';
import type { Link, SocialHandle } from '../backend';
import { normalizeBackendError, isPrerequisiteError } from '../utils/backendErrors';

interface EditableContent {
  title?: string;
  bioText?: string;
  socialHandles?: SocialHandle[];
  links?: Link[];
}

export default function TemplateEditorPage() {
  const { templateId } = useParams({ from: '/editor/$templateId' });
  const { data: templates, isLoading: templatesLoading } = useGetAllTemplates();
  const createBioPageMutation = useCreateBioPage();
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  // Prerequisite checks
  const { data: isRegistered, isLoading: isRegisteredLoading } = useIsRegistered();
  const { data: isPhoneVerified, isLoading: isPhoneVerifiedLoading } = useIsPhoneVerified();

  const template = templates?.find((t) => t.id === templateId);

  const [title, setTitle] = useState('');
  const [bioText, setBioText] = useState('');
  const [links, setLinks] = useState<Link[]>([]);
  const [socialHandles, setSocialHandles] = useState<SocialHandle[]>([]);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [prerequisiteError, setPrerequisiteError] = useState<string | null>(null);

  const isAuthenticated = !!identity;
  const prerequisitesLoading = isRegisteredLoading || isPhoneVerifiedLoading;

  useEffect(() => {
    if (template) {
      // Try to parse editableContent if present
      if (template.editableContent && template.editableContent.length > 0) {
        try {
          const decoder = new TextDecoder();
          const jsonString = decoder.decode(template.editableContent);
          const content: EditableContent = JSON.parse(jsonString);
          
          // Initialize state from editableContent with robust fallbacks
          setTitle(content.title || template.name || '');
          setBioText(content.bioText || template.description || '');
          
          // Normalize social handles
          if (content.socialHandles && Array.isArray(content.socialHandles)) {
            const normalizedHandles = content.socialHandles.map((handle, idx) => ({
              id: handle.id || `social-${idx}`,
              platform: handle.platform || '',
              username: handle.username || '',
              url: handle.url || '',
            }));
            setSocialHandles(normalizedHandles);
          } else {
            setSocialHandles([]);
          }
          
          // Normalize links
          if (content.links && Array.isArray(content.links)) {
            const normalizedLinks = content.links.map((link, idx) => ({
              id: link.id || `link-${idx}`,
              title: link.title || '',
              url: link.url || '',
              description: link.description || '',
            }));
            setLinks(normalizedLinks);
          } else {
            setLinks([]);
          }
        } catch (error) {
          // Fallback to template name/description if JSON parsing fails
          console.warn('Failed to parse editableContent, using fallback:', error);
          setTitle(template.name || '');
          setBioText(template.description || '');
          setSocialHandles([]);
          setLinks([]);
        }
      } else {
        // Fallback when editableContent is empty
        setTitle(template.name || '');
        setBioText(template.description || '');
        setSocialHandles([]);
        setLinks([]);
      }
    }
  }, [template]);

  const handleInsertBioFormula = (starterText: string) => {
    if (bioText.trim()) {
      // If bio already has content, ask for confirmation
      if (window.confirm('This will replace your current bio text. Continue?')) {
        setBioText(starterText);
      }
    } else {
      setBioText(starterText);
    }
  };

  const checkPrerequisites = (): { canSave: boolean; error: string | null } => {
    if (!isAuthenticated) {
      return {
        canSave: false,
        error: 'Please log in to save and share your bio page.',
      };
    }

    if (prerequisitesLoading) {
      return { canSave: false, error: null };
    }

    if (!isRegistered) {
      return {
        canSave: false,
        error: 'Please complete signup to save and share your bio page.',
      };
    }

    if (!isPhoneVerified) {
      return {
        canSave: false,
        error: 'Please verify your phone number to save and share your bio page.',
      };
    }

    return { canSave: true, error: null };
  };

  const handleSaveAndShare = async () => {
    setPrerequisiteError(null);

    // Check prerequisites before attempting to save
    const { canSave, error } = checkPrerequisites();
    
    if (!canSave) {
      if (error) {
        setPrerequisiteError(error);
        toast.error(error);
      }
      return;
    }

    if (!title.trim() || !bioText.trim()) {
      toast.error('Please fill in at least the title and bio text');
      return;
    }

    try {
      await createBioPageMutation.mutateAsync({
        templateId: templateId || '',
        title,
        bioText,
        socialHandles,
        links,
      });

      const userId = identity?.getPrincipal().toString() || '';
      const shareId = `${userId}_${templateId}`;
      const url = `${window.location.origin}/share/${shareId}`;
      setShareUrl(url);
      setShowShareDialog(true);
      toast.success('Bio page saved successfully!');
    } catch (error: any) {
      const guidance = normalizeBackendError(error);
      
      // Show error in toast
      toast.error(guidance.message);
      
      // Set inline error for persistent display
      setPrerequisiteError(guidance.message);
      
      // If there's a navigation target, offer to navigate
      if (guidance.navigateTo) {
        setTimeout(() => {
          if (window.confirm(`${guidance.message}\n\nWould you like to go there now?`)) {
            navigate({ to: guidance.navigateTo as any });
          }
        }, 500);
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleOpenLink = () => {
    window.open(shareUrl, '_blank');
  };

  if (templatesLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Loading template...</div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Template not found</h1>
          <Button onClick={() => navigate({ to: '/templates' })}>
            Back to Templates
          </Button>
        </div>
      </div>
    );
  }

  const { canSave } = checkPrerequisites();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/templates' })}
          className="mb-4"
        >
          ← Back to Templates
        </Button>
        <h1 className="text-3xl font-bold mb-2">Customize Your Bio</h1>
        <p className="text-muted-foreground">
          Template: {template.name}
        </p>
      </div>

      {prerequisiteError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Action Required</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{prerequisiteError}</p>
            <div className="flex gap-2 mt-3">
              {!isAuthenticated && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    // Login button would trigger Internet Identity
                    toast.info('Please use the Login button in the header');
                  }}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Log In
                </Button>
              )}
              {isAuthenticated && !isRegistered && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate({ to: '/signup', search: { reason: 'registration-required' } })}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Complete Signup
                </Button>
              )}
              {isAuthenticated && isRegistered && !isPhoneVerified && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate({ to: '/verify-phone' })}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Verify Phone
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <BioFormulaHelper onInsert={handleInsertBioFormula} />

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Your profile title and bio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title / Name</Label>
              <Input
                id="title"
                placeholder="Your Name or Brand"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bioText">Bio Text</Label>
              <Textarea
                id="bioText"
                placeholder="Tell your story..."
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Tip: Use the Bio Formula Helper above for inspiration
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>Add your social media profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <SocialHandlesEditor
              socialHandles={socialHandles}
              onChange={setSocialHandles}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
            <CardDescription>Add important links</CardDescription>
          </CardHeader>
          <CardContent>
            <LinksEditor links={links} onChange={setLinks} />
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Design with Canva
            </CardTitle>
            <CardDescription>
              Want to customize the visual design? Use Canva to create stunning graphics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open('https://www.canva.com', '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Canva
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              Create your design in Canva, then come back here to add your content and links
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/templates' })}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveAndShare}
            disabled={createBioPageMutation.isPending || prerequisitesLoading || !canSave}
          >
            {createBioPageMutation.isPending ? 'Saving...' : 'Save & Share'}
          </Button>
        </div>
      </div>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Bio Page is Ready! 🎉</DialogTitle>
            <DialogDescription>
              Share your unique link with your audience
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input value={shareUrl} readOnly className="flex-1" />
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleOpenLink}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button className="flex-1" onClick={handleCopyLink}>
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
