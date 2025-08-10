import React, { useRef, useState } from 'react';
import { Paperclip, Image, Mic, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AudioRecorder } from './AudioRecorder';

interface FileUploadProps {
  onFileSelect: (file: File, type: 'image' | 'audio' | 'document') => void;
  onAudioRecord: (audioBlob: Blob) => void;
  className?: string;
}

export const FileUpload = ({ onFileSelect, onAudioRecord, className }: FileUploadProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
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

  const handleAudioRecordingComplete = (audioBlob: Blob) => {
    onAudioRecord(audioBlob);
    setShowAudioRecorder(false);
    setIsOpen(false);
  };

  const handleAudioClick = () => {
    setShowAudioRecorder(true);
    setIsOpen(false);
  };

  const uploadOptions = [
    {
      icon: Image,
      label: 'Imagem',
      type: 'image' as const,
      accept: 'image/*',
      ref: imageInputRef,
      onClick: () => imageInputRef.current?.click(),
    },
    {
      icon: Mic,
      label: 'Áudio',
      type: 'audio' as const,
      accept: 'audio/*',
      ref: audioInputRef,
      onClick: handleAudioClick,
    },
    {
      icon: FileText,
      label: 'Documento',
      type: 'document' as const,
      accept: '.pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx',
      ref: documentInputRef,
      onClick: () => documentInputRef.current?.click(),
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
                  {(option.type === 'image' || option.type === 'document') && (
                    <input
                      ref={option.ref}
                      type="file"
                      accept={option.accept}
                      onChange={(e) => handleFileUpload(e, option.type)}
                      className="hidden"
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={option.onClick}
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

      {/* Audio Recorder Overlay */}
      {showAudioRecorder && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <AudioRecorder
            onRecordingComplete={handleAudioRecordingComplete}
            onClose={() => setShowAudioRecorder(false)}
          />
        </div>
      )}
    </div>
  );
};