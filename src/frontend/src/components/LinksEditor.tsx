import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Plus, Trash2 } from 'lucide-react';
import type { Link } from '../backend';

interface LinksEditorProps {
  links: Link[];
  onChange: (links: Link[]) => void;
}

export default function LinksEditor({ links, onChange }: LinksEditorProps) {
  const addLink = () => {
    const newLink: Link = {
      id: `link-${Date.now()}`,
      title: '',
      url: '',
      description: '',
    };
    onChange([...links, newLink]);
  };

  const removeLink = (id: string) => {
    onChange(links.filter((link) => link.id !== id));
  };

  const updateLink = (id: string, field: keyof Link, value: string) => {
    onChange(
      links.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Links</CardTitle>
          <Button variant="outline" size="sm" onClick={addLink}>
            <Plus className="h-4 w-4 mr-2" />
            Add Link
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {links.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No links added yet. Click "Add Link" to get started.
          </p>
        ) : (
          links.map((link) => (
            <div key={link.id} className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Link</Label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLink(link.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Link title"
                  value={link.title}
                  onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                />
                <Input
                  placeholder="https://example.com"
                  value={link.url}
                  onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                />
                <Input
                  placeholder="Description (optional)"
                  value={link.description}
                  onChange={(e) => updateLink(link.id, 'description', e.target.value)}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
