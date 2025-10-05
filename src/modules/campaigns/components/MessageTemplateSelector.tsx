import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { useMessageTemplatesV2, MessageTemplateV2 } from '../hooks/useMessageTemplatesV2';

interface MessageTemplateSelectorProps {
  onSelectTemplate: (content: string) => void;
}

export const MessageTemplateSelector = ({ onSelectTemplate }: MessageTemplateSelectorProps) => {
  const { data: templates, isLoading } = useMessageTemplatesV2();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  const handleSelectTemplate = (templateId: string) => {
    const template = templates?.find(t => t.id === templateId);
    if (template) {
      onSelectTemplate(template.content);
      setSelectedTemplateId(templateId);
    }
  };

  if (isLoading) {
    return (
      <div className="text-xs text-muted-foreground">Carregando...</div>
    );
  }

  return (
    <Select value={selectedTemplateId} onValueChange={handleSelectTemplate}>
      <SelectTrigger className="w-full sm:w-64">
        <SelectValue placeholder={templates && templates.length > 0 ? "Usar template..." : "Sem templates"} />
      </SelectTrigger>
      <SelectContent className="bg-background border border-border shadow-lg z-50">
        {templates && templates.length > 0 ? (
          templates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-medium">{template.name}</span>
                  <div className="flex items-center gap-1 ml-2">
                    {template.usage_count > 0 && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                        {template.usage_count} usos
                      </Badge>
                    )}
                    {template.usage_count > 0 && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                        {Math.round((template.response_count / template.usage_count) * 100)}%
                      </Badge>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground truncate max-w-64">
                  {template.content.substring(0, 60)}...
                </span>
              </div>
            </SelectItem>
          ))
        ) : (
          <SelectItem value="no-templates" disabled>
            Nenhum template disponível
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};
