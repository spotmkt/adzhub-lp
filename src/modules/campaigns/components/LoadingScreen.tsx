import React from 'react';
import { Zap } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-pulse">
          <Zap className="w-12 h-12 text-primary animate-bounce" />
        </div>
        <p className="text-foreground font-medium">Carregando...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
