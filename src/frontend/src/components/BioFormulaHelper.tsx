import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface BioFormulaHelperProps {
  onInsert: (bioText: string) => void;
}

export default function BioFormulaHelper({ onInsert }: BioFormulaHelperProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const starterTemplate = `[Your Title/Identity]
[Why You Matter - Proof/Vibe]
[Your Brand/Business]
[Call to Action]`;

  const handleInsert = () => {
    onInsert(starterTemplate);
  };

  return (
    <Card className="border-chart-1/30 bg-gradient-to-br from-card to-chart-1/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-chart-1" />
            <CardTitle className="text-lg">Bio Formula</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <CardDescription>
          The 4-part formula used by top influencers
        </CardDescription>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4 pt-0">
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                1
              </div>
              <div>
                <p className="font-medium">Who I am / What I do</p>
                <p className="text-muted-foreground text-xs mt-0.5">Your title or identity (authority)</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                2
              </div>
              <div>
                <p className="font-medium">Why you should care</p>
                <p className="text-muted-foreground text-xs mt-0.5">Proof, vibe, or social credibility</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                3
              </div>
              <div>
                <p className="font-medium">Brand / Business</p>
                <p className="text-muted-foreground text-xs mt-0.5">Your company, project, or brand (if any)</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                4
              </div>
              <div>
                <p className="font-medium">CTA or Link</p>
                <p className="text-muted-foreground text-xs mt-0.5">Call to action or important link</p>
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleInsert}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Insert Starter Template
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
