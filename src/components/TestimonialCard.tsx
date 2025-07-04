import React, { useEffect } from 'react';
import { CheckCircle, Star, Play } from 'lucide-react';

interface TestimonialCardProps {
  testimonial: {
    id: number;
    name: string;
    location: string;
    profileImage: string;
    videoId: string;
    caption: string;
  };
  isActive: boolean;
  isDragging: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  testimonial, 
  isActive, 
  isDragging 
}) => {
  // ✅ Check if this is Michael R. with real VTurb video
  const hasRealVideo = testimonial.videoId === "68677fbfd890d9c12c549f94";

  // ✅ FIXED: Inject VTurb script only when card is active and has real video
  useEffect(() => {
    if (isActive && hasRealVideo) {
      // Remove any existing script first
      const existingScript = document.getElementById(`scr_testimonial_${testimonial.videoId}`);
      if (existingScript) {
        existingScript.remove();
      }

      // Inject VTurb script specifically for this testimonial
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.id = `scr_testimonial_${testimonial.videoId}`;
      script.async = true;
      script.innerHTML = `
        var s=document.createElement("script");
        s.src="https://scripts.converteai.net/b792ccfe-b151-4538-84c6-42bb48a19ba4/players/${testimonial.videoId}/v4/player.js";
        s.async=true;
        s.onload = function() {
          console.log('VTurb testimonial video loaded: ${testimonial.videoId}');
        };
        document.head.appendChild(s);
      `;
      
      document.head.appendChild(script);
    }

    // Cleanup when card becomes inactive
    return () => {
      if (hasRealVideo) {
        const scriptToRemove = document.getElementById(`scr_testimonial_${testimonial.videoId}`);
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      }
    };
  }, [isActive, hasRealVideo, testimonial.videoId]);

  return (
    <div className={`bg-white backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-blue-200 hover:bg-white/95 transition-all duration-300 max-w-md w-full mx-4 ${
      isDragging ? 'shadow-2xl' : 'shadow-lg'
    } ${isActive ? 'ring-2 ring-blue-300' : ''}`}>
      
      {/* Customer Info - Photo + Name Side by Side */}
      <div className="flex items-center gap-4 mb-4">
        <img 
          src={testimonial.profileImage}
          alt={testimonial.name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-blue-300 flex-shrink-0 shadow-lg"
          draggable={false}
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-blue-900 leading-tight mb-1">
            {testimonial.name}
          </h3>
          <p className="text-sm sm:text-base text-blue-700 font-medium leading-tight mb-2">
            {testimonial.location}
          </p>
          <div className="inline-flex">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
              <CheckCircle className="w-3 h-3" />
              <span className="text-xs font-bold">VERIFIED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Testimonial Quote */}
      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 mb-4 border border-blue-100">
        <p className="text-sm sm:text-base text-blue-800 leading-relaxed italic">
          "{testimonial.caption}"
        </p>
      </div>

      {/* ✅ FIXED: Video only appears when card is active */}
      {isActive && (
        <div className="mb-4">
          <div className="aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-900 relative">
            {hasRealVideo ? (
              // ✅ VTurb Video Container for Michael R. - FIXED positioning
              <div
                id={`vid-${testimonial.videoId}`}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  zIndex: 1
                }}
              >
                {/* Fallback content while video loads */}
                <div className="w-full h-full bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 mx-auto">
                      <Play className="w-6 h-6 text-white ml-0.5" />
                    </div>
                    <p className="text-white/90 text-base font-medium mb-1">
                      {testimonial.name}
                    </p>
                    <p className="text-white/70 text-sm">
                      Customer Story
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Placeholder for other testimonials
              <div className="w-full h-full bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 mx-auto">
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  </div>
                  <p className="text-white/90 text-base font-medium mb-1">
                    {testimonial.name}
                  </p>
                  <p className="text-white/70 text-sm">
                    Customer Story
                  </p>
                  <p className="text-white/50 text-xs mt-2">
                    Video coming soon
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rating */}
      <div className="flex items-center justify-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
        ))}
        <span className="ml-1 text-gray-600 text-sm font-medium">5.0</span>
      </div>
    </div>
  );
};

export default TestimonialCard;