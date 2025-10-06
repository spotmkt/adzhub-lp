import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Send } from 'lucide-react';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'file' | 'select';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface DynamicAppFormProps {
  appName: string;
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  onCancel?: () => void;
}

export const DynamicAppForm = ({ appName, fields, onSubmit, onCancel }: DynamicAppFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<Record<string, File>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const missingFields = fields
      .filter(f => f.required && !formData[f.id] && !files[f.id])
      .map(f => f.label);
    
    if (missingFields.length > 0) {
      alert(`Por favor, preencha os campos obrigatórios: ${missingFields.join(', ')}`);
      return;
    }

    // Merge form data with files
    const submitData = { ...formData };
    Object.keys(files).forEach(key => {
      submitData[key] = files[key];
    });

    onSubmit(submitData);
  };

  const handleFileChange = (fieldId: string, file: File | null) => {
    if (file) {
      setFiles({ ...files, [fieldId]: file });
    } else {
      const newFiles = { ...files };
      delete newFiles[fieldId];
      setFiles(newFiles);
    }
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <Input
            type={field.type}
            value={formData[field.id] || ''}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            placeholder={field.placeholder}
            required={field.required}
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            value={formData[field.id] || ''}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            placeholder={field.placeholder}
            required={field.required}
            className="min-h-[100px]"
          />
        );
      
      case 'file':
        return (
          <Input
            type="file"
            onChange={(e) => handleFileChange(field.id, e.target.files?.[0] || null)}
            required={field.required}
          />
        );
      
      case 'select':
        return (
          <Select
            value={formData[field.id] || ''}
            onValueChange={(value) => setFormData({ ...formData, [field.id]: value })}
            required={field.required}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || 'Selecione...'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{appName}</CardTitle>
        <CardDescription>Preencha as informações necessárias</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              {renderField(field)}
            </div>
          ))}

          <div className="flex justify-end gap-2 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit">
              <Send className="h-4 w-4 mr-2" />
              Enviar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
