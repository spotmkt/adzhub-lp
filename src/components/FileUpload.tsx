import React, { useRef, useState } from 'react';
import { Paperclip, Image, Mic, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File, type: 'image' | 'audio' | 'document') => void;
  className?: string;
}

export const FileUpload = ({ onFileSelect, className }: FileUploadProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'audio' | 'document') => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file, type);
      setIsOpen(false);
      // Reset input
      event.target.value = '';
    }
  };

  const uploadOptions = [
    {
      icon: Image,
      label: 'Imagem',
      type: 'image' as const,
      accept: 'image/*',
      ref: imageInputRef,
    },
    {
      icon: Mic,
      label: 'Áudio',
      type: 'audio' as const,
      accept: 'audio/*',
      ref: audioInputRef,
    },
    {
      icon: FileText,
      label: 'Documento',
      type: 'document' as const,
      accept: '.pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx',
      ref: documentInputRef,
    },
  ];

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 rounded-lg hover:bg-accent"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Paperclip className="h-4 w-4" />}
      </Button>

      {isOpen && (
        <div className="absolute bottom-10 left-0 bg-background border border-border rounded-xl shadow-lg p-2 z-50">
          <div className="flex flex-col gap-1">
            {uploadOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div key={option.type}>
                  <input
                    ref={option.ref}
                    type="file"
                    accept={option.accept}
                    onChange={(e) => handleFileUpload(e, option.type)}
                    className="hidden"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => option.ref.current?.click()}
                    className="w-full justify-start gap-2 h-8"
                  >
                    <Icon className="h-4 w-4" />
                    {option.label}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};