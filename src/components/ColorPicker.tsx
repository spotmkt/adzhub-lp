import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Palette } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  children: React.ReactNode;
  mode?: 'edit' | 'add'; // Novo prop para controlar comportamento
}

const presetColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#F4D03F',
  '#A569BD', '#5DADE2', '#58D68D', '#F5B041', '#EC7063'
];

const recentColors = [
  '#2563EB', '#7C3AED', '#DC2626', '#059669', '#D97706',
  '#4338CA', '#9333EA', '#B91C1C', '#047857', '#B45309'
];

// Utility functions for color conversion
function hexToHsv(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  if (diff !== 0) {
    if (max === r) h = ((g - b) / diff) % 6;
    else if (max === g) h = (b - r) / diff + 2;
    else h = (r - g) / diff + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  const s = max === 0 ? 0 : diff / max;
  const v = max;

  return { h, s: s * 100, v: v * 100 };
}

function hsvToHex(h: number, s: number, v: number) {
  s /= 100;
  v /= 100;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0, g = 0, b = 0;
  if (h >= 0 && h < 60) [r, g, b] = [c, x, 0];
  else if (h >= 60 && h < 120) [r, g, b] = [x, c, 0];
  else if (h >= 120 && h < 180) [r, g, b] = [0, c, x];
  else if (h >= 180 && h < 240) [r, g, b] = [0, x, c];
  else if (h >= 240 && h < 300) [r, g, b] = [x, 0, c];
  else if (h >= 300 && h < 360) [r, g, b] = [c, 0, x];

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function ColorPicker({ color, onChange, children, mode = 'edit' }: ColorPickerProps) {
  const [inputColor, setInputColor] = useState(color);
  const [isOpen, setIsOpen] = useState(false);
  const [hsv, setHsv] = useState(() => hexToHsv(color));
  const [tempColor, setTempColor] = useState(color); // Cor temporária para modo 'add'
  const saturationRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<'saturation' | 'hue' | null>(null);

  useEffect(() => {
    if (color !== inputColor) {
      setInputColor(color);
      setTempColor(color);
      setHsv(hexToHsv(color));
    }
  }, [color]);

  const updateColor = (newHsv: { h: number; s: number; v: number }) => {
    const newHex = hsvToHex(newHsv.h, newHsv.s, newHsv.v);
    setInputColor(newHex);
    setTempColor(newHex);
    setHsv(newHsv);
    
    // Só chama onChange imediatamente no modo 'edit'
    if (mode === 'edit') {
      onChange(newHex);
    }
  };

  const handleSaturationMouseDown = (e: React.MouseEvent) => {
    setIsDragging('saturation');
    handleSaturationMove(e);
  };

  const handleSaturationMove = (e: React.MouseEvent) => {
    if (saturationRef.current) {
      const rect = saturationRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
      
      const s = (x / rect.width) * 100;
      const v = (1 - y / rect.height) * 100; // Invertido para corresponder ao novo gradiente
      
      updateColor({ ...hsv, s, v });
    }
  };

  const handleHueMouseDown = (e: React.MouseEvent) => {
    setIsDragging('hue');
    handleHueMove(e);
  };

  const handleHueMove = (e: React.MouseEvent) => {
    if (hueRef.current) {
      const rect = hueRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const h = (x / rect.width) * 360;
      
      updateColor({ ...hsv, h });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging === 'saturation') {
        handleSaturationMove(e as any);
      } else if (isDragging === 'hue') {
        handleHueMove(e as any);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, hsv]);

  const handleInputChange = (value: string) => {
    setInputColor(value);
    setTempColor(value);
    if (value.match(/^#[0-9A-Fa-f]{6}$/)) {
      const newHsv = hexToHsv(value);
      setHsv(newHsv);
      if (mode === 'edit') {
        onChange(value);
      }
    }
  };

  const handleConfirm = () => {
    onChange(tempColor);
    setIsOpen(false);
  };

  const handlePresetSelect = (presetColor: string) => {
    setInputColor(presetColor);
    setTempColor(presetColor);
    const newHsv = hexToHsv(presetColor);
    setHsv(newHsv);
    
    if (mode === 'edit') {
      onChange(presetColor);
    } else {
      // Para modo 'add', confirma imediatamente
      onChange(presetColor);
    }
    setIsOpen(false);
  };

  const hueColor = hsvToHex(hsv.h, 100, 100);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" side="bottom" align="start" sideOffset={5}>
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Palette className="h-4 w-4 text-primary" />
            <Label className="text-sm font-medium">Seletor de Cor</Label>
          </div>

          <Tabs defaultValue="solid" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="solid" className="text-sm">Cor Sólida</TabsTrigger>
              <TabsTrigger value="presets" className="text-sm">Predefinidas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="solid" className="space-y-4">
              {/* Saturation/Value Picker */}
              <div className="relative">
                <div 
                  ref={saturationRef}
                  className="w-full h-32 rounded-lg border-2 border-border cursor-crosshair relative overflow-hidden select-none"
                  style={{
                    background: `linear-gradient(to right, white, ${hueColor}), linear-gradient(to bottom, transparent, black)`
                  }}
                  onMouseDown={handleSaturationMouseDown}
                >
                  <div
                    className="absolute w-3 h-3 border-2 border-white rounded-full shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${hsv.s}%`,
                      top: `${hsv.v}%`,
                      backgroundColor: inputColor
                    }}
                  />
                </div>
              </div>

              {/* Hue Slider */}
              <div className="relative">
                <div 
                  ref={hueRef}
                  className="w-full h-4 rounded-full cursor-pointer relative select-none"
                  style={{
                    background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
                  }}
                  onMouseDown={handleHueMouseDown}
                >
                  <div
                    className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-0"
                    style={{
                      left: `${(hsv.h / 360) * 100}%`,
                      backgroundColor: hueColor
                    }}
                  />
                </div>
              </div>

              {/* Color Input */}
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-lg border-2 border-border flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: inputColor }}
                />
                <Input
                  value={inputColor.toUpperCase()}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="#000000"
                  className="font-mono text-sm bg-muted/30"
                  maxLength={7}
                />
                <Button
                  size="sm"
                  onClick={mode === 'add' ? handleConfirm : () => setIsOpen(false)}
                  className="flex-shrink-0 bg-primary hover:bg-primary/90"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="presets" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                    Cores Populares
                  </Label>
                  <div className="grid grid-cols-10 gap-2">
                    {presetColors.map((presetColor, index) => (
                      <button
                        key={index}
                        className="w-7 h-7 rounded-lg border-2 border-border hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-md"
                        style={{ backgroundColor: presetColor }}
                        onClick={() => handlePresetSelect(presetColor)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                    Usadas Recentemente
                  </Label>
                  <div className="grid grid-cols-10 gap-2">
                    {recentColors.map((recentColor, index) => (
                      <button
                        key={index}
                        className="w-7 h-7 rounded-lg border-2 border-border hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-md"
                        style={{ backgroundColor: recentColor }}
                        onClick={() => handlePresetSelect(recentColor)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  );
}