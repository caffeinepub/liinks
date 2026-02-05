import { useNavigate } from '@tanstack/react-router';
import type { Template } from '../backend';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Eye } from 'lucide-react';

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={template.thumbnail.getDirectURL()}
          alt={template.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardContent className="pt-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-1">{template.name}</h3>
          <Badge variant="secondary" className="text-xs shrink-0">
            {template.category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {template.description}
        </p>
      </CardContent>
      
      <CardFooter>
        <Button
          onClick={() => navigate({ to: '/templates/$templateId', params: { templateId: template.id } })}
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
          variant="outline"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Template
        </Button>
      </CardFooter>
    </Card>
  );
}
