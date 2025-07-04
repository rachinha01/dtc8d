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
  // ✅ UPDATED: ALL testimonials now have real VTurb videos
  const hasRealVideo = testimonial.videoId === "68677fbfd890d9c12c549f94" || // Michael R.
                       testimonial.videoId === "6867816a78c1d68a675981f1" ||   // Robert S.
                       testimonial.videoId === "68678320c5ab1e6abe6e5b6f";     // John O.

  // ✅ FIXED: Inject VTurb script only when card is active and has real video
  useEffect(() => {
    if (isActive && hasRealVideo) {
      // ✅ CRITICAL: Wait for main video to be fully loaded first
      if (!window.vslVideoLoaded) {
        console.log('⏳ Waiting for main video to load before injecting testimonial video');
        return;
      }

      console.log('🎬 Injecting testimonial video:', testimonial.videoId);
      
      // Remove any existing script first
      const existingScript = document.getElementById(`scr_testimonial_${testimonial.videoId}`);
      if (existingScript) {
        existingScript.remove();
      }

      // ✅ CRITICAL: Ensure container exists and is properly isolated BEFORE injecting script
      const targetContainer = document.getElementById(`vid-${testimonial.videoId}`);
      if (!targetContainer) {
        console.error('❌ Target container not found for video:', testimonial.videoId);
        return;
      }

      // ✅ Setup container isolation and positioning
      targetContainer.style.position = 'absolute';
      targetContainer.style.top = '0';
      targetContainer.style.left = '0';
      targetContainer.style.width = '100%';
      targetContainer.style.height = '100%';
      targetContainer.style.zIndex = '20';
      targetContainer.style.overflow = 'hidden';
      targetContainer.style.borderRadius = '0.75rem';
      targetContainer.style.isolation = 'isolate';
      targetContainer.innerHTML = ''; // ✅ Clear any existing content

      // ✅ NEW: Add the HTML structure that you provided - SAME AS DR. OZ
      if (testimonial.videoId === "68678320c5ab1e6abe6e5b6f") {
        // ✅ JOHN O. - Using the EXACT same HTML structure as Dr. Oz
        targetContainer.innerHTML = `
          <div id="vid_${testimonial.videoId}" style="position:relative;width:100%;padding: 56.25% 0 0 0;">
            <img id="thumb_${testimonial.videoId}" src="https://images.converteai.net/b792ccfe-b151-4538-84c6-42bb48a19ba4/players/${testimonial.videoId}/thumbnail.jpg" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;display:block;">
            <div id="backdrop_${testimonial.videoId}" style="position:absolute;top:0;width:100%;height:100%;-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);"></div>
          </div>
          <style>
            .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border-width:0;}
          </style>
        `;
      } else if (testimonial.videoId === "68677fbfd890d9c12c549f94") {
        // ✅ Michael R. - Same HTML structure
        targetContainer.innerHTML = `
          <div id="vid_${testimonial.videoId}" style="position:relative;width:100%;padding: 56.25% 0 0 0;">
            <img id="thumb_${testimonial.videoId}" src="https://images.converteai.net/b792ccfe-b151-4538-84c6-42bb48a19ba4/players/${testimonial.videoId}/thumbnail.jpg" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;display:block;">
            <div id="backdrop_${testimonial.videoId}" style="position:absolute;top:0;width:100%;height:100%;-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);"></div>
          </div>
          <style>
            .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border-width:0;}
          </style>
        `;
      } else if (testimonial.videoId === "6867816a78c1d68a675981f1") {
        // ✅ Robert S. - Same HTML structure
        targetContainer.innerHTML = `
          <div id="vid_${testimonial.videoId}" style="position:relative;width:100%;padding: 56.25% 0 0 0;">
            <img id="thumb_${testimonial.videoId}" src="https://images.converteai.net/b792ccfe-b151-4538-84c6-42bb48a19ba4/players/${testimonial.videoId}/thumbnail.jpg" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;display:block;">
            <div id="backdrop_${testimonial.videoId}" style="position:absolute;top:0;width:100%;height:100%;-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);"></div>
          </div>
          <style>
            .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border-width:0;}
          </style>
        `;
      }

      // ✅ Inject VTurb script with the EXACT same structure as Dr. Oz
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.id = `scr_testimonial_${testimonial.videoId}`;
      script.async = true;
      script.innerHTML = `
        (function() {
          try {
            console.log('🎬 Loading testimonial video: ${testimonial.videoId}');
            
            var s = document.createElement("script");
            // ✅ UPDATED: Use the correct VTurb script URL - SAME AS DR. OZ
            s.src = "https://scripts.converteai.net/b792ccfe-b151-4538-84c6-42bb48a19ba4/players/${testimonial.videoId}/player.js";
            s.async = true;
            
            s.onload = function() {
              console.log('✅ VTurb testimonial video loaded: ${testimonial.videoId}');
              
              // ✅ FIXED: Ensure video elements stay in correct container
              setTimeout(function() {
                // ✅ CRITICAL: Prevent video from appearing in main video container
                var mainVideoContainer = document.getElementById('vid_683ba3d1b87ae17c6e07e7db');
                var testimonialContainer = document.getElementById('vid-${testimonial.videoId}');
                
                if (mainVideoContainer && testimonialContainer) {
                  // ✅ Move any testimonial video elements that ended up in main container
                  var orphanedElements = mainVideoContainer.querySelectorAll('[src*="${testimonial.videoId}"], [data-video-id="${testimonial.videoId}"]');
                  orphanedElements.forEach(function(element) {
                    if (element.parentNode === mainVideoContainer) {
                      testimonialContainer.appendChild(element);
                      console.log('🔄 Moved testimonial video element back to correct container');
                    }
                  });
                }
                
              }, 2000);
              window.testimonialVideoLoaded_${testimonial.videoId} = true;
            };
            s.onerror = function() {
              console.error('❌ Failed to load VTurb testimonial video: ${testimonial.videoId}');
            };
            document.head.appendChild(s);
          } catch (error) {
            console.error('Error injecting testimonial video script:', error);
          }
        })();
      `;
      
      document.head.appendChild(script);
    }

    // Cleanup when card becomes inactive
    return () => {
      if (!isActive) {
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

      {/* ✅ FIXED: Video container with proper z-index layering */}
      {isActive && (
        <div className="mb-4">
          <div className="aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-900 relative">
            {hasRealVideo ? (
              <>
                {/* ✅ VTurb Video Container - HIGHEST z-index */}
                <div
                  id={`vid-${testimonial.videoId}`}
                  style={{
                    display: 'block',
                    margin: '0 auto',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 20,
                    isolation: 'isolate',
                    contain: 'layout style paint size'
                  }}
                ></div>
                
                {/* ✅ Placeholder - Only show while loading */}
                <div 
                  id={`placeholder_${testimonial.videoId}`}
                  className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center"
                  style={{ zIndex: 10 }}
                >
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
              </>
            ) : (
              // Placeholder for other testimonials (no real video)
              <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center">
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