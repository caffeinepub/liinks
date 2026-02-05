import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { SocialHandle } from '../backend';

interface SocialHandlesEditorProps {
  socialHandles: SocialHandle[];
  onChange: (handles: SocialHandle[]) => void;
}

const PLATFORMS = [
  'Instagram',
  'Twitter',
  'Facebook',
  'LinkedIn',
  'YouTube',
  'TikTok',
  'GitHub',
  'Website',
];

export default function SocialHandlesEditor({ socialHandles, onChange }: SocialHandlesEditorProps) {
  const addHandle = () => {
    const newHandle: SocialHandle = {
      id: `handle-${Date.now()}`,
      platform: '',
      username: '',
      url: '',
    };
    onChange([...socialHandles, newHandle]);
  };

  const removeHandle = (id: string) => {
    onChange(socialHandles.filter((handle) => handle.id !== id));
  };

  const updateHandle = (id: string, field: keyof SocialHandle, value: string) => {
    onChange(
      socialHandles.map((handle) =>
        handle.id === id ? { ...handle, [field]: value } : handle
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Social Handles</CardTitle>
          <Button variant="outline" size="sm" onClick={addHandle}>
            <Plus className="h-4 w-4 mr-2" />
            Add Handle
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {socialHandles.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No social handles added yet. Click "Add Handle" to get started.
          </p>
        ) : (
          socialHandles.map((handle) => (
            <div key={handle.id} className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Social Handle</Label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeHandle(handle.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="space-y-2">
                <Select
                  value={handle.platform}
                  onValueChange={(value) => updateHandle(handle.id, 'platform', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Username"
                  value={handle.username}
                  onChange={(e) => updateHandle(handle.id, 'username', e.target.value)}
                />
                <Input
                  placeholder="Profile URL"
                  value={handle.url}
                  onChange={(e) => updateHandle(handle.id, 'url', e.target.value)}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
