import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useUploadTemplate, useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { CATEGORIES } from '../constants/categories';
import { ExternalBlob } from '../backend';
import { Upload, X } from 'lucide-react';

export default function UploadTemplatePage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const uploadMutation = useUploadTemplate();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState<ExternalBlob | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const isPro = userProfile?.subscription === 'pro';

  if (!isPro) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <CardTitle>Pro Subscription Required</CardTitle>
            <CardDescription>
              Upgrade to Pro to upload your own templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/pricing' })}>
              View Pricing
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleThumbnailSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      setThumbnail(blob);
      setThumbnailPreview(blob.getDirectURL());
      toast.success('Thumbnail uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload thumbnail');
      console.error(error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !category || !description.trim() || !thumbnail) {
      toast.error('Please fill in all fields and upload a thumbnail');
      return;
    }

    try {
      const editableContent = new TextEncoder().encode(JSON.stringify({
        title: name,
        bio: description,
        links: [],
        socialHandles: [],
      }));

      await uploadMutation.mutateAsync({
        name,
        category,
        description,
        thumbnail,
        editableContent,
      });

      toast.success('Template uploaded successfully!');
      navigate({ to: '/templates' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload template');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Upload Template</h1>
          <p className="text-muted-foreground">
            Share your template with the Liinks community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Awesome Template"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your template..."
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thumbnail</CardTitle>
              <CardDescription>
                Upload a preview image for your template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-6">
                {thumbnailPreview ? (
                  <div className="relative">
                    <img
                      src={thumbnailPreview}
                      alt="Template thumbnail"
                      className="w-full max-w-md mx-auto rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setThumbnail(null);
                        setThumbnailPreview(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Upload a thumbnail image for your template
                      </p>
                      <label htmlFor="thumbnail-upload">
                        <Button type="button" variant="outline" disabled={uploading} asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            {uploading ? `Uploading ${uploadProgress}%` : 'Upload Thumbnail'}
                          </span>
                        </Button>
                      </label>
                      <input
                        id="thumbnail-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleThumbnailSelect}
                        disabled={uploading}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="submit"
              size="lg"
              className="flex-1"
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? 'Uploading...' : 'Upload Template'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate({ to: '/templates' })}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
