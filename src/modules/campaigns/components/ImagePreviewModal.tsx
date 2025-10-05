import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File | null;
  imageUrl: string;
}

const ImagePreviewModal = ({ isOpen, onClose, imageFile, imageUrl }: ImagePreviewModalProps) => {
  if (!imageFile && !imageUrl) {
    return null;
  }

  const displayUrl = imageUrl || (imageFile ? URL.createObjectURL(imageFile) : '');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-dark-primary">
            Prévia da Imagem do Disparo
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-center">
          <img 
            src={displayUrl} 
            alt="Prévia da imagem do disparo" 
            className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
          />
        </div>
        
        {imageFile && (
          <div className="text-sm text-gray-600 mt-4">
            <strong>Nome do arquivo:</strong> {imageFile.name}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewModal;
