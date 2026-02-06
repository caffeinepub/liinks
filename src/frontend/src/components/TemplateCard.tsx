import { useNavigate } from '@tanstack/react-router';
import type { Template } from '../backend';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Eye, Sparkles } from 'lucide-react';
import TemplateBadge from './TemplateBadge';

interface TemplateCardProps {
  template: Template;
  badge?: 'creator-favorite' | 'trending' | 'most-used';
}

export default function TemplateCard({ template, badge }: TemplateCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 flex flex-col h-full transform hover:-translate-y-1">
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
        <div className="text-center space-y-3 p-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">Fully Customizable</p>
        </div>
        {badge && (
          <div className="absolute top-3 right-3">
            <TemplateBadge variant={badge} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardContent className="pt-4 space-y-2 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-1 flex-1">{template.name}</h3>
          <Badge variant="secondary" className="text-xs shrink-0">
            {template.category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">
          {template.description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button
          onClick={() => navigate({ to: '/templates/$templateId', params: { templateId: template.id } })}
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200"
          variant="outline"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Template
        </Button>
      </CardFooter>
    </Card>
  );
}
