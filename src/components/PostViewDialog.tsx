import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, Image, Tag, Hash, Globe, FileText } from "lucide-react";

interface PendingPost {
  id: string;
  client_id: string;
  tipo_postagem: string;
  titulo: string;
  conteudo: string;
  canal: string;
  status: string;
  metadata: any;
  scheduled_date?: string;
  created_at: string;
  updated_at: string;
  slug?: string;
  primary_keyword?: string;
  imagem?: string;
  plataforma?: string;
}

interface PostViewDialogProps {
  post: PendingPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'default';
    case 'rejected':
      return 'destructive';
    case 'pending':
      return 'secondary';
    default:
      return 'secondary';
  }
};

export const PostViewDialog = ({ post, open, onOpenChange }: PostViewDialogProps) => {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{post.titulo}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">
                {post.tipo_postagem}
              </Badge>
              <Badge variant="secondary">
                {post.canal}
              </Badge>
              <Badge variant={getStatusColor(post.status)}>
                {post.status.toUpperCase()}
              </Badge>
              {post.scheduled_date && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Agendado: {new Date(post.scheduled_date).toLocaleDateString('pt-BR')}
                </div>
              )}
            </div>

            {/* Imagem */}
            {(post.metadata?.imagem || post.imagem) && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Imagem
                </h3>
                <div className="flex justify-center">
                  <img 
                    src={post.metadata?.imagem || post.imagem} 
                    alt={post.titulo}
                    className="max-w-full h-auto rounded-lg border"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
              </div>
            )}

            {/* Conteúdo */}
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Conteúdo
              </h3>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div 
                  className="prose prose-sm max-w-none dark:prose-invert 
                    prose-headings:font-bold prose-headings:text-foreground
                    prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8 prose-h1:leading-tight
                    prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6 prose-h2:leading-snug
                    prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5 prose-h3:leading-snug
                    prose-p:text-base prose-p:mb-4 prose-p:leading-7 prose-p:text-foreground/90
                    prose-strong:font-bold prose-strong:text-foreground
                    prose-em:italic prose-em:text-foreground/80
                    prose-a:text-primary prose-a:underline prose-a:font-medium hover:prose-a:text-primary/80
                    prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                    prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
                    prose-li:mb-2 prose-li:leading-7
                    first:prose-h1:mt-0 first:prose-h2:mt-0 first:prose-h3:mt-0"
                  dangerouslySetInnerHTML={{ __html: post.conteudo }}
                />
              </div>
            </div>

            {/* Blog-specific metadata */}
            {post.tipo_postagem === 'blog' && (
              (post.metadata?.slug || post.slug) ||
              (post.metadata?.primary_keyword || post.primary_keyword) ||
              (post.metadata?.plataforma || post.plataforma)
            ) && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Configurações do Blog
                </h3>
                
                <div className="space-y-2 text-sm">
                  {(post.metadata?.slug || post.slug) && (
                    <div>
                      <span className="font-medium">Slug:</span> {post.metadata?.slug || post.slug}
                    </div>
                  )}
                  
                  {(post.metadata?.primary_keyword || post.primary_keyword) && (
                    <div>
                      <span className="font-medium">Palavra-chave principal:</span> {post.metadata?.primary_keyword || post.primary_keyword}
                    </div>
                  )}
                  
                  {(post.metadata?.plataforma || post.plataforma) && (
                    <div>
                      <span className="font-medium">Plataforma:</span> {post.metadata?.plataforma || post.plataforma}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags e Categoria */}
            {post.metadata && (post.metadata.tags || post.metadata.categoria) && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Metadata
                </h3>
                
                <div className="space-y-3">
                  {post.metadata.categoria && (
                    <div>
                      <span className="font-medium text-sm">Categoria:</span>
                      <Badge variant="outline" className="ml-2">
                        {post.metadata.categoria}
                      </Badge>
                    </div>
                  )}
                  
                  {post.metadata.tags && post.metadata.tags.length > 0 && (
                    <div>
                      <span className="font-medium text-sm block mb-2">Tags:</span>
                      <div className="flex flex-wrap gap-1">
                        {post.metadata.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Hash className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Footer info */}
            <div className="text-xs text-muted-foreground pt-4 border-t">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Criado em {new Date(post.created_at).toLocaleDateString('pt-BR')}
                </div>
                {post.updated_at !== post.created_at && (
                  <div>
                    Atualizado em {new Date(post.updated_at).toLocaleDateString('pt-BR')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};