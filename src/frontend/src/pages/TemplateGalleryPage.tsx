import { useState } from 'react';
import { useGetAllTemplates } from '../hooks/useQueries';
import { CATEGORIES } from '../constants/categories';
import TemplateCard from '../components/TemplateCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Skeleton } from '../components/ui/skeleton';

export default function TemplateGalleryPage() {
  const { data: templates, isLoading } = useGetAllTemplates();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTemplates = selectedCategory === 'all'
    ? templates || []
    : (templates || []).filter((t) => t.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Premium Templates
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our collection of professionally designed bio page templates
          </p>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="inline-flex w-auto min-w-full justify-start">
              <TabsTrigger value="all">All Templates</TabsTrigger>
              {CATEGORIES.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={selectedCategory} className="mt-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-64 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  No templates found in this category yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
