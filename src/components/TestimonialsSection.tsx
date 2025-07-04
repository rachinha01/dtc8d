import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { CheckCircle, Star, Play } from 'lucide-react';

// Lazy load testimonial card to improve initial load
const TestimonialCard = lazy(() => import('./TestimonialCard'));

interface Testimonial {
  id: number;
  name: string;
  location: string;
  profileImage: string;
  videoId: string;
  caption: string;
}

export const TestimonialsSection: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Testimonials data - Simplified post style
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Michael R.",
      location: "Texas",
      profileImage: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
      videoId: "your_vturb_video_id_1",
      caption: "BlueDrops completely changed my life. I felt the difference in just 2 weeks!"
    },
    {
      id: 2,
      name: "Robert S.",
      location: "California",
      profileImage: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
      videoId: "your_vturb_video_id_2",
      caption: "After 50, I thought there was no hope. BlueDrops proved me wrong!"
    },
    {
      id: 3,
      name: "John O.",
      location: "Florida",
      profileImage: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
      videoId: "your_vturb_video_id_3",
      caption: "My wife noticed the difference before I even told her about BlueDrops!"
    }
  ];

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Optimized drag handlers
  const handleDragStart = (clientX: number) => {
    if (isTransitioning) return;
    setIsDragging(true);
    setStartX(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || isTransitioning) return;
    const diff = clientX - startX;
    const maxDrag = 100;
    const clampedDiff = Math.max(-maxDrag, Math.min(maxDrag, diff));
    setDragOffset(clampedDiff);
  };

  const handleDragEnd = () => {
    if (!isDragging || isTransitioning) return;
    setIsDragging(false);
    setIsTransitioning(true);
    
    const threshold = 30;
    
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      } else {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }
    }
    
    setDragOffset(0);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Global mouse events
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) handleDragMove(e.clientX);
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) handleDragEnd();
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
      document.addEventListener('mouseup', handleGlobalMouseUp, { passive: true });
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, startX, dragOffset]);

  const goToTestimonial = (index: number) => {
    if (isTransitioning || isDragging || index === currentTestimonial) return;
    setIsTransitioning(true);
    setCurrentTestimonial(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Optimized card styling - FIXED: Better overflow handling
  const getCardStyle = (index: number) => {
    const position = index - currentTestimonial;
    let translateX = 0;
    let scale = 1;
    let opacity = 1;
    let zIndex = 1;
    
    if (position === 0) {
      translateX = dragOffset;
      scale = 1 - Math.abs(dragOffset) * 0.001;
      opacity = 1 - Math.abs(dragOffset) * 0.003;
      zIndex = 10;
    } else if (position === 1 || (position === -2 && testimonials.length === 3)) {
      translateX = 280 + dragOffset * 0.3;
      scale = 0.85;
      opacity = 0.6;
      zIndex = 5;
    } else if (position === -1 || (position === 2 && testimonials.length === 3)) {
      translateX = -280 + dragOffset * 0.3;
      scale = 0.85;
      opacity = 0.6;
      zIndex = 5;
    } else {
      translateX = position > 0 ? 400 : -400;
      scale = 0.7;
      opacity = 0;
      zIndex = 1;
    }
    
    return {
      transform: `translateX(${translateX}px) scale(${scale})`,
      opacity: Math.max(0, opacity),
      zIndex,
      transition: isDragging ? 'none' : 'all 0.3s ease-out',
    };
  };

  if (!isVisible) {
    return (
      <section 
        ref={sectionRef}
        className="mt-16 sm:mt-20 w-full max-w-5xl mx-auto px-4 h-96"
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm">Carregando depoimentos...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16 sm:mt-20 w-full max-w-5xl mx-auto px-4 animate-fadeInUp animation-delay-1200">
      {/* Section Header */}
      <div className="text-center mb-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-blue-900 mb-2">
          <span className="block">No Filters.</span>
          <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent block">
            Just Real Results.
          </span>
        </h2>
        <p className="text-lg sm:text-xl text-blue-700 font-semibold">
          What Real Men Are Saying About BlueDrops
        </p>
      </div>

      {/* Drag Instructions */}
      <div className="text-center mb-4">
        <p className="text-sm text-blue-600 font-medium">
          👆 Drag to navigate between testimonials
        </p>
      </div>

      {/* Slideshow Container - FIXED: Better overflow and background */}
      <div 
        className="relative h-[500px] mb-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl"
        style={{ 
          perspective: '1000px',
          touchAction: 'pan-y pinch-zoom',
          overflow: 'hidden' // FIXED: Prevent cards from showing outside
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Testimonial Cards */}
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
            style={getCardStyle(index)}
          >
            <Suspense fallback={
              <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-lg max-w-md w-full mx-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
            }>
              <TestimonialCard 
                testimonial={testimonial} 
                isActive={index === currentTestimonial}
                isDragging={isDragging}
              />
            </Suspense>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-3">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              onClick={() => goToTestimonial(index)}
              disabled={isTransitioning || isDragging}
              className={`w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 disabled:cursor-not-allowed ${
                index === currentTestimonial
                  ? 'bg-blue-600 text-white shadow-lg scale-110'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};