import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Target, Tag, Hash, Globe } from "lucide-react";

interface ContentIdea {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  client_id: string;
  created_at: string;
  slug?: string;
  primary_keyword?: string;
  secondary_keywords?: string[];
  intent?: string;
  justification?: string;
  alternatives?: string[];
  tags?: string[];
  scheduled_date?: string;
}

interface IdeaViewDialogProps {
  idea: ContentIdea | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'default';
    case 'low':
      return 'secondary';
    default:
      return 'secondary';
  }
};

export const IdeaViewDialog = ({ idea, open, onOpenChange }: IdeaViewDialogProps) => {
  if (!idea) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{idea.title}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-full">
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={getPriorityColor(idea.priority)}>
                {idea.priority.toUpperCase()}
              </Badge>
              {idea.scheduled_date && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {new Date(idea.scheduled_date).toLocaleDateString('pt-BR')}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-medium mb-2">Descrição</h3>
              <p className="text-sm text-muted-foreground">{idea.description}</p>
            </div>

            {/* SEO & Metadata */}
            {(idea.slug || idea.primary_keyword || idea.secondary_keywords?.length || idea.intent) && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  SEO & Metadata
                </h3>
                
                <div className="space-y-2 text-sm">
                  {idea.slug && (
                    <div>
                      <span className="font-medium">Slug:</span> {idea.slug}
                    </div>
                  )}
                  
                  {idea.primary_keyword && (
                    <div>
                      <span className="font-medium">Palavra-chave:</span> {idea.primary_keyword}
                    </div>
                  )}
                  
                  {idea.secondary_keywords && idea.secondary_keywords.length > 0 && (
                    <div>
                      <span className="font-medium">Keywords secundárias:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {idea.secondary_keywords.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {idea.intent && (
                    <div>
                      <span className="font-medium">Intenção:</span> {idea.intent}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Justification */}
            {idea.justification && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Justificativa
                </h3>
                <p className="text-sm">{idea.justification}</p>
              </div>
            )}

            {/* Alternatives */}
            {idea.alternatives && idea.alternatives.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Alternativas</h3>
                <ul className="list-disc list-inside space-y-1">
                  {idea.alternatives.map((alternative, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {alternative}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {idea.tags && idea.tags.length > 0 && (
              <div>
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-1">
                  {idea.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Hash className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Footer info */}
            <div className="text-xs text-muted-foreground pt-4 border-t">
              Criado em {new Date(idea.created_at).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};