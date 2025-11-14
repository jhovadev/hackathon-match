'use client';

import { Progress } from '@/components/ui/progress';

interface ShuffleProgressBarProps {
  progress: number;
}

export function ShuffleProgressBar({ progress }: ShuffleProgressBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-background/80 backdrop-blur-sm border-t-2 border-foreground">
        <div className="px-4 py-3 relative">
          <Progress 
            value={progress}
            className="h-4 border-2 border-foreground rounded-sm bg-muted/20"
          />
          
          <div className="absolute inset-x-4 top-3 h-4 pointer-events-none">
            <div className="flex h-full">
              {Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={i} 
                  className="flex-1 border-r border-foreground/10 last:border-r-0"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
