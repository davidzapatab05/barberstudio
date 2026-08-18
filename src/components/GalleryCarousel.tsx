import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

interface GalleryCarouselProps {
  images: string[];
}

export default function GalleryCarousel({ images }: GalleryCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: false,
    dragFree: false,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedImg, setZoomedImg] = useState('');

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const openLightbox = (imgSrc: string) => {
    setZoomedImg(imgSrc.replace('w=400', 'w=1200').replace('q=50', 'q=80'));
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setZoomedImg('');
    setIsZoomed(false);
    document.body.style.overflow = '';
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && zoomedImg) {
        closeLightbox();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [zoomedImg]);

  return (
    <div className="relative w-full max-w-[1400px] mx-auto px-12 group/carousel">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {images.map((img, i) => (
            <div key={i} className="flex-none pl-4 w-full sm:w-1/2 lg:w-1/3">
              <div 
                className="aspect-[4/5] rounded-md overflow-hidden border border-[#1a1a1a] group cursor-pointer relative"
                onClick={() => openLightbox(img)}
              >
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-center justify-center pointer-events-none">
                  <span className="text-white font-sans text-xs tracking-[0.2em] uppercase border border-white/30 px-4 py-2 backdrop-blur-sm">Ver</span>
                </div>
                <img 
                  src={img} 
                  alt="Barber Gallery" 
                  loading="lazy"
                  className="w-full h-full object-cover grayscale opacity-80 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 pointer-events-none" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Botones de navegación tipo Shadcn */}
      <button 
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-[#1a1a1a] bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-colors z-20"
        aria-label="Anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      
      <button 
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-[#1a1a1a] bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-colors z-20"
        aria-label="Siguiente"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>

      {/* Lightbox Integrado */}
      {zoomedImg && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center transition-opacity duration-300">
          <button onClick={closeLightbox} className="absolute top-6 right-6 text-white hover:text-primary transition-colors z-50 p-2" aria-label="Cerrar">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          
          <div 
            className="relative w-full h-full p-4 md:p-12 flex items-center justify-center overflow-auto" 
            onClick={(e) => {
              // Si clic en el fondo, cerramos
              if (e.target === e.currentTarget) closeLightbox();
            }}
          >
            <img 
              src={zoomedImg} 
              alt="Gallery Full" 
              onClick={toggleZoom}
              className={`transition-all duration-300 cursor-zoom-in ${isZoomed ? 'max-w-none max-h-none w-auto h-auto cursor-zoom-out' : 'max-w-full max-h-full object-contain'}`} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
