import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Crop, RotateCcw, Download, X, Move } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ImageEditorProps {
  imageFile: File;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (croppedBlob: Blob) => void;
}

export const ImageEditor = ({ imageFile, open, onOpenChange, onSave }: ImageEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const canvasSize = 400;
  const cropSize = 300;

  useEffect(() => {
    if (!open || !imageFile) return;

    console.log('ImageEditor - Loading image:', imageFile.name);

    const img = new Image();
    img.onload = () => {
      console.log('ImageEditor - Image loaded successfully');
      
      // Calculate initial scale and position
      const scale = Math.min(canvasSize / img.width, canvasSize / img.height) * 0.8;
      const x = (canvasSize - img.width * scale) / 2;
      const y = (canvasSize - img.height * scale) / 2;
      
      setImage(img);
      setImageScale(scale);
      setImagePosition({ x, y });
      setRotation(0);
    };

    img.onerror = () => {
      console.error('ImageEditor - Failed to load image');
      toast({
        title: 'Erro',
        description: 'Erro ao carregar a imagem.',
        variant: 'destructive',
      });
    };

    img.src = URL.createObjectURL(imageFile);

    return () => {
      URL.revokeObjectURL(img.src);
    };
  }, [imageFile, open]);

  // Redraw canvas
  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Save context
    ctx.save();

    // Move to image center for rotation
    const centerX = imagePosition.x + (image.width * imageScale) / 2;
    const centerY = imagePosition.y + (image.height * imageScale) / 2;
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Draw image
    ctx.drawImage(
      image,
      -(image.width * imageScale) / 2,
      -(image.height * imageScale) / 2,
      image.width * imageScale,
      image.height * imageScale
    );

    // Restore context
    ctx.restore();

    // Draw crop area
    const cropX = (canvasSize - cropSize) / 2;
    const cropY = (canvasSize - cropSize) / 2;
    
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    
    // Clear crop area
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillRect(cropX, cropY, cropSize, cropSize);
    
    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
    
    // Draw crop border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(cropX, cropY, cropSize, cropSize);
    
    // Reset line dash
    ctx.setLineDash([]);
  }, [image, imagePosition, imageScale, rotation]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsDragging(true);
    setDragStart({
      x: e.clientX - rect.left - imagePosition.x,
      y: e.clientY - rect.top - imagePosition.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setImagePosition({
      x: e.clientX - rect.left - dragStart.x,
      y: e.clientY - rect.top - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    if (!image) return;
    
    const scale = Math.min(canvasSize / image.width, canvasSize / image.height) * 0.8;
    const x = (canvasSize - image.width * scale) / 2;
    const y = (canvasSize - image.height * scale) / 2;
    
    setImageScale(scale);
    setImagePosition({ x, y });
    setRotation(0);
  };

  const handleZoom = (delta: number) => {
    setImageScale(prev => Math.max(0.1, Math.min(3, prev + delta)));
  };

  const handleSave = () => {
    if (!image || !canvasRef.current) return;

    try {
      // Create temporary canvas for cropped image
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      
      if (!tempCtx) throw new Error('Could not get canvas context');

      // Set final image size (square for profile photos)
      const finalSize = 300;
      tempCanvas.width = finalSize;
      tempCanvas.height = finalSize;

      // Calculate crop area on original canvas
      const cropX = (canvasSize - cropSize) / 2;
      const cropY = (canvasSize - cropSize) / 2;

      // Copy the cropped area
      const sourceCanvas = canvasRef.current;
      
      // First, we need to render just the image without overlays
      const imageCanvas = document.createElement('canvas');
      const imageCtx = imageCanvas.getContext('2d');
      
      if (!imageCtx) throw new Error('Could not get image canvas context');
      
      imageCanvas.width = canvasSize;
      imageCanvas.height = canvasSize;
      
      // Draw image with rotation
      imageCtx.save();
      const centerX = imagePosition.x + (image.width * imageScale) / 2;
      const centerY = imagePosition.y + (image.height * imageScale) / 2;
      imageCtx.translate(centerX, centerY);
      imageCtx.rotate((rotation * Math.PI) / 180);
      
      imageCtx.drawImage(
        image,
        -(image.width * imageScale) / 2,
        -(image.height * imageScale) / 2,
        image.width * imageScale,
        image.height * imageScale
      );
      
      imageCtx.restore();
      
      // Copy cropped area to final canvas
      tempCtx.drawImage(
        imageCanvas,
        cropX, cropY, cropSize, cropSize,
        0, 0, finalSize, finalSize
      );

      // Convert to blob
      tempCanvas.toBlob((blob) => {
        if (blob) {
          onSave(blob);
          onOpenChange(false);
          toast({
            title: 'Sucesso',
            description: 'Imagem editada com sucesso!',
          });
        }
      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error('Error saving cropped image:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar a imagem editada.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crop className="h-5 w-5" />
            Editor de Imagem
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative border-2 border-dashed border-border rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              width={canvasSize}
              height={canvasSize}
              className="max-w-full cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>
          
          <div className="text-sm text-muted-foreground text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Move className="h-4 w-4" />
              Arraste a imagem para posicionar
            </div>
            
            {/* Zoom controls */}
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleZoom(-0.1)}
                disabled={imageScale <= 0.1}
              >
                -
              </Button>
              <span className="text-xs">Zoom: {Math.round(imageScale * 100)}%</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleZoom(0.1)}
                disabled={imageScale >= 3}
              >
                +
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRotate}
              title="Girar 90°"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              title="Resetar"
            >
              <X className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={handleSave}
              size="sm"
              className="flex-1"
              disabled={!image}
            >
              <Download className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};