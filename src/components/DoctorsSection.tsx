import React, { useEffect, useState, useRef } from 'react';
import { Shield, Play } from 'lucide-react';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  affiliation: string;
  testimonial: string;
  profileImage: string;
  videoId: string; // VTurb video ID for testimonial
}

export const DoctorsSection: React.FC = () => {
  const [currentDoctor, setCurrentDoctor] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [velocity, setVelocity] = useState(0);
  const [lastMoveTime, setLastMoveTime] = useState(0);
  const [lastMoveX, setLastMoveX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. Mehmet Oz",
      specialty: "Cardiothoracic Surgeon, MD",
      affiliation: "Columbia University",
      testimonial: "BlueDrops represents a breakthrough in natural men's health. Simple ingredients, impressive results.",
      profileImage: "https://i.imgur.com/oM0Uyij.jpeg",
      videoId: "dr_oz_testimonial_id" // Replace with actual VTurb video ID
    },
    {
      id: 2,
      name: "Dr. Steven Gundry",
      specialty: "Former Cardiac Surgeon, MD",
      affiliation: "Center for Restorative Medicine",
      testimonial: "Natural compounds like those in BlueDrops restore balance from within — exactly my philosophy.",
      profileImage: "https://i.imgur.com/z8WR0yL.jpeg",
      videoId: "dr_gundry_testimonial_id" // Replace with actual VTurb video ID
    },
    {
      id: 3,
      name: "Dr. Rena Malik",
      specialty: "Urologist, MD",
      affiliation: "University of Maryland",
      testimonial: "BlueDrops offers men a promising natural alternative that supports both confidence and wellness.",
      profileImage: "https://i.imgur.com/iNaQpa5.jpeg",
      videoId: "dr_malik_testimonial_id" // Replace with actual VTurb video ID
    }
  ];

  // Function to inject VTurb doctor testimonial videos
  const injectDoctorVideo = (videoId: string) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = `scr_${videoId}`;
    script.async = true;
    script.innerHTML = `
      var s=document.createElement("script");
      s.src="https://scripts.converteai.net/b792ccfe-b151-4538-84c6-42bb48a19ba4/players/${videoId}/player.js";
      s.async=true;
      document.head.appendChild(s);
    `;
    
    // Remove existing script if any
    const existingScript = document.getElementById(`scr_${videoId}`);
    if (existingScript) {
      existingScript.remove();
    }
    
    document.head.appendChild(script);
  };

  // Inject current doctor video when doctor changes
  useEffect(() => {
    const currentDoctorData = doctors[currentDoctor];
    if (currentDoctorData.videoId) {
      setTimeout(() => {
        injectDoctorVideo(currentDoctorData.videoId);
      }, 300);
    }

    // Cleanup function
    return () => {
      doctors.forEach((doctor) => {
        const scriptToRemove = document.getElementById(`scr_${doctor.videoId}`);
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      });
    };
  }, [currentDoctor]);

  // Smooth animation for drag offset
  const animateDragOffset = (targetOffset: number, duration: number = 300) => {
    const startOffset = dragOffset;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      const currentOffset = startOffset + (targetOffset - startOffset) * easeOutCubic;
      setDragOffset(currentOffset);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDragOffset(targetOffset);
        if (targetOffset === 0) {
          setIsTransitioning(false);
        }
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animate);
  };

  // Calculate velocity for momentum
  const calculateVelocity = (clientX: number) => {
    const now = performance.now();
    if (lastMoveTime > 0) {
      const timeDiff = now - lastMoveTime;
      const distanceDiff = clientX - lastMoveX;
      setVelocity(distanceDiff / timeDiff);
    }
    setLastMoveTime(now);
    setLastMoveX(clientX);
  };

  // Drag handlers with improved mechanics
  const handleDragStart = (clientX: number) => {
    if (isTransitioning) return;
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setIsDragging(true);
    setStartX(clientX);
    setDragOffset(0);
    setVelocity(0);
    setLastMoveTime(performance.now());
    setLastMoveX(clientX);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || isTransitioning) return;
    
    const diff = clientX - startX;
    const maxDrag = 150; // Reduced for slideshow feel
    
    // Apply resistance at the edges
    let clampedDiff;
    if (Math.abs(diff) <= maxDrag) {
      clampedDiff = diff;
    } else {
      const sign = diff > 0 ? 1 : -1;
      const excess = Math.abs(diff) - maxDrag;
      // Apply diminishing returns for over-drag
      clampedDiff = sign * (maxDrag + excess * 0.2);
    }
    
    setDragOffset(clampedDiff);
    calculateVelocity(clientX);
  };

  const handleDragEnd = () => {
    if (!isDragging || isTransitioning) return;
    
    setIsDragging(false);
    setIsTransitioning(true);
    
    const threshold = 50; // Lower threshold for easier swiping
    const velocityThreshold = 0.4; // Velocity threshold for momentum
    
    let shouldChange = false;
    let direction = 0;
    
    // Check if drag distance or velocity exceeds threshold
    if (Math.abs(dragOffset) > threshold || Math.abs(velocity) > velocityThreshold) {
      if (dragOffset > 0 || velocity > velocityThreshold) {
        // Dragged right or fast right velocity - go to previous
        direction = -1;
        shouldChange = true;
      } else if (dragOffset < 0 || velocity < -velocityThreshold) {
        // Dragged left or fast left velocity - go to next
        direction = 1;
        shouldChange = true;
      }
    }
    
    if (shouldChange) {
      if (direction > 0) {
        setCurrentDoctor((prev) => (prev + 1) % doctors.length);
      } else {
        setCurrentDoctor((prev) => (prev - 1 + doctors.length) % doctors.length);
      }
    }
    
    // Always snap back to center
    animateDragOffset(0, 250);
    
    // Reset velocity tracking
    setVelocity(0);
    setLastMoveTime(0);
    setLastMoveX(0);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    handleDragEnd();
  };

  // Global mouse events
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDragMove(e.clientX);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, startX, dragOffset, velocity]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const goToDoctor = (index: number) => {
    if (isTransitioning || isDragging || index === currentDoctor) return;
    setIsTransitioning(true);
    setCurrentDoctor(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Get position and styling for each doctor card - FIXED: Better overflow handling
  const getCardStyle = (index: number) => {
    const position = index - currentDoctor;
    const dragInfluence = dragOffset * 0.3; // Reduced influence for subtlety
    
    let translateX = 0;
    let translateZ = 0;
    let scale = 1;
    let opacity = 1;
    let blur = 0;
    let rotateY = 0;
    
    if (position === 0) {
      // Current/center card
      translateX = dragOffset;
      translateZ = 0;
      scale = 1 - Math.abs(dragOffset) * 0.0005;
      opacity = 1 - Math.abs(dragOffset) * 0.002;
      blur = Math.abs(dragOffset) * 0.01;
      rotateY = dragOffset * 0.02;
    } else if (position === 1 || (position === -2 && doctors.length === 3)) {
      // Next card (right side)
      translateX = 280 + dragInfluence;
      translateZ = -100;
      scale = 0.85;
      opacity = 0.6;
      blur = 2;
      rotateY = -15;
    } else if (position === -1 || (position === 2 && doctors.length === 3)) {
      // Previous card (left side)
      translateX = -280 + dragInfluence;
      translateZ = -100;
      scale = 0.85;
      opacity = 0.6;
      blur = 2;
      rotateY = 15;
    } else {
      // Hidden cards
      translateX = position > 0 ? 400 : -400;
      translateZ = -200;
      scale = 0.7;
      opacity = 0;
      blur = 5;
    }
    
    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`,
      opacity: Math.max(0, opacity),
      filter: `blur(${blur}px)`,
      zIndex: position === 0 ? 10 : 5 - Math.abs(position),
      transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    };
  };

  return (
    <section className="mt-16 sm:mt-20 w-full max-w-5xl mx-auto px-4 animate-fadeInUp animation-delay-1400">
      {/* Section Header - Grouped tightly */}
      <div className="text-center mb-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-blue-900 mb-2">
          <span className="block">Clinically Reviewed.</span>
          <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent block">
            Doctor Approved.
          </span>
        </h2>
        <p className="text-lg sm:text-xl text-blue-700 font-semibold">
          What Doctors Say About BlueDrops
        </p>
      </div>

      {/* Drag Instructions */}
      <div className="text-center mb-4">
        <p className="text-sm text-blue-600 font-medium">
          👆 Drag to navigate between doctors
        </p>
      </div>

      {/* Slideshow Container - FIXED: Better overflow and background */}
      <div 
        ref={containerRef}
        className="relative h-[500px] mb-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl"
        style={{ 
          perspective: '1200px',
          touchAction: 'pan-y pinch-zoom',
          overflow: 'hidden' // FIXED: Prevent cards from showing outside
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Doctor Cards */}
        {doctors.map((doctor, index) => (
          <div
            key={doctor.id}
            className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
            style={getCardStyle(index)}
          >
            <DoctorCard 
              doctor={doctor} 
              isActive={index === currentDoctor}
              isDragging={isDragging}
            />
          </div>
        ))}
      </div>

      {/* Navigation Controls - Closer to box */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center gap-3">
          {doctors.map((doctor, index) => (
            <button
              key={doctor.id}
              onClick={() => goToDoctor(index)}
              disabled={isTransitioning || isDragging}
              className={`w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 disabled:cursor-not-allowed ${
                index === currentDoctor
                  ? 'bg-blue-600 text-white shadow-lg scale-110'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Trust Badge */}
      <div className="text-center">
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-blue-200 inline-block">
          <p className="text-sm text-blue-700 font-medium mb-1">
            🏥 <strong>Medical Advisory Board</strong>
          </p>
          <p className="text-xs text-blue-600">
            Reviewed and approved by licensed medical professionals
          </p>
        </div>
      </div>
    </section>
  );
};

// Separate Doctor Card Component for cleaner code - FIXED: Better opacity
const DoctorCard: React.FC<{ doctor: any; isActive: boolean; isDragging: boolean }> = ({ 
  doctor, 
  isActive, 
  isDragging 
}) => {
  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-blue-200 hover:bg-white/95 transition-all duration-300 max-w-md w-full mx-4 ${
      isDragging ? 'shadow-2xl' : 'shadow-lg'
    } ${isActive ? 'ring-2 ring-blue-300' : ''}`}>
      
      {/* Doctor Info - Photo + Name Side by Side */}
      <div className="flex items-center gap-4 mb-4">
        <img 
          src={doctor.profileImage}
          alt={doctor.name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-blue-300 flex-shrink-0 shadow-lg"
          draggable={false}
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-blue-900 leading-tight mb-1">
            {doctor.name}
          </h3>
          <p className="text-sm sm:text-base text-blue-700 font-medium leading-tight mb-1">
            {doctor.specialty}
          </p>
          <p className="text-xs sm:text-sm text-blue-600 leading-tight mb-2">
            {doctor.affiliation}
          </p>
          <div className="inline-flex">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
              <Shield className="w-3 h-3" />
              <span className="text-xs font-bold">MD VERIFIED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Testimonial Quote */}
      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 mb-4 border border-blue-100">
        <p className="text-sm sm:text-base text-blue-800 leading-relaxed italic">
          "{doctor.testimonial}"
        </p>
      </div>

      {/* Doctor Video Testimonial - Only show for active card */}
      {isActive && (
        <div className="mb-4">
          <div className="aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-900 relative">
            <div
              id={`doctor_vid_${doctor.videoId}`}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%'
              }}
            >
              {/* Video Placeholder while loading */}
              <div className="w-full h-full bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 mx-auto">
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  </div>
                  <p className="text-white/90 text-base font-medium mb-1">
                    {doctor.name}
                  </p>
                  <p className="text-white/70 text-sm">
                    Video Testimonial
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};