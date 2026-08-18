import React, { useState, useRef, useEffect } from 'react';
import { Badge } from './ui/badge';

interface TransformationSliderProps {
  beforeImage: string;
  afterImage: string;
}

export default function TransformationSlider({ beforeImage, afterImage }: TransformationSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const onMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[4/5] md:aspect-video overflow-hidden cursor-ew-resize select-none border border-border"
      onMouseDown={(e) => {
        setIsDragging(true);
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
      }}
    >
      {/* After Image (Background) & Label */}
      <div className="absolute inset-0 pointer-events-none">
        <img src={afterImage} alt="Después" className="w-full h-full object-cover" />
        <div className="absolute bottom-6 right-6 z-0">
          <Badge variant="default" className="font-display tracking-widest text-sm bg-black/70 hover:bg-black/70 rounded-none border border-border text-foreground">DESPUÉS</Badge>
        </div>
      </div>
      
      {/* Before Image (Clipped overlay) & Label */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }} 
      >
        <img src={beforeImage} alt="Antes" className="w-full h-full object-cover" />
        <div className="absolute bottom-6 left-6 z-0">
          <Badge variant="default" className="font-display tracking-widest text-sm bg-black/70 hover:bg-black/70 rounded-none border border-border text-foreground">ANTES</Badge>
        </div>
      </div>
      
      {/* Slider handle */}
      <div 
        className="absolute inset-y-0 w-1 bg-primary z-10 flex items-center justify-center shadow-[0_0_10px_rgba(42,117,255,0.5)]"
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
      >
        <div className="w-10 h-10 bg-background border-2 border-primary rounded-full flex items-center justify-center shadow-lg text-primary text-xs font-bold gap-1 transition-transform hover:scale-110">
          <span>&larr;</span>
          <span>&rarr;</span>
        </div>
      </div>
    </div>
  );
}
