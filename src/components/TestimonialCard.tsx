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

  // ✅ FIXED: Inject VTurb script only when card is active and has real video with v4 API
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

      // ✅ FORCE clear any existing VTurb instances that might interfere
      if (window.smartplayer && window.smartplayer.instances) {
        Object.keys(window.smartplayer.instances).forEach(key => {
          if (key !== '683ba3d1b87ae17c6e07e7db' && key === testimonial.videoId) {
            delete window.smartplayer.instances[key];
          }
        });
      }

      // Inject VTurb script specifically for this testimonial with v4 API
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.id = `scr_testimonial_${testimonial.videoId}`;
      script.async = true;
      script.innerHTML = `
        (function() {
          try {
            // ✅ CRITICAL: Prevent interference with main video
            if (document.getElementById('vid_683ba3d1b87ae17c6e07e7db')) {
              console.log('🛡️ Main video detected, isolating testimonial video ${testimonial.videoId}');
            }
            
            // Remove any existing video container content first
            var existingContainer = document.getElementById('vid-${testimonial.videoId}');
            if (existingContainer) {
              existingContainer.innerHTML = '';
            }
            
            // ✅ CRITICAL: Create isolated smartplayer instance
            window.smartplayer = window.smartplayer || { instances: {} };
            
            // ✅ Ensure we don't override main video instance
            var mainVideoInstance = window.smartplayer.instances['683ba3d1b87ae17c6e07e7db'];
            
            // ✅ Clear only this specific video instance if it exists
            if (window.smartplayer.instances['${testimonial.videoId}']) {
              delete window.smartplayer.instances['${testimonial.videoId}'];
            }
            
            var s = document.createElement("script");
            s.src = "https://scripts.converteai.net/b792ccfe-b151-4538-84c6-42bb48a19ba4/players/${testimonial.videoId}/v4/player.js";
            s.async = true;
            s.onload = function() {
              console.log('✅ VTurb testimonial video loaded: ${testimonial.videoId}');
              
              // ✅ CRITICAL: Restore main video instance if it was affected
              if (mainVideoInstance && !window.smartplayer.instances['683ba3d1b87ae17c6e07e7db']) {
                window.smartplayer.instances['683ba3d1b87ae17c6e07e7db'] = mainVideoInstance;
              }
              
              // Hide placeholder when video loads
              setTimeout(function() {
                // ✅ CRITICAL: Ensure video stays in correct container
                var targetContainer = document.getElementById('vid-${testimonial.videoId}');
                if (targetContainer) {
                  var allVideos = document.querySelectorAll('video');
                  var allIframes = document.querySelectorAll('iframe');
                  
                  allVideos.forEach(function(video) {
                    // ✅ CRITICAL: Don't touch main video elements
                    var mainVideoContainer = document.getElementById('vid_683ba3d1b87ae17c6e07e7db');
                    if (mainVideoContainer && mainVideoContainer.contains(video)) {
                      return; // Skip main video elements
                    }
                    
                    if (!targetContainer.contains(video) && video.src && video.src.includes('${testimonial.videoId}')) {
                      targetContainer.appendChild(video);
                    }
                  });
                  
                  allIframes.forEach(function(iframe) {
                    // ✅ CRITICAL: Don't touch main video iframes
                    var mainVideoContainer = document.getElementById('vid_683ba3d1b87ae17c6e07e7db');
                    if (mainVideoContainer && mainVideoContainer.contains(iframe)) {
                      return; // Skip main video iframes
                    }
                    
                    if (!targetContainer.contains(iframe) && iframe.src && iframe.src.includes('${testimonial.videoId}')) {
                      targetContainer.appendChild(iframe);
                    }
                  });
                }
                
                var placeholder = document.getElementById('placeholder_${testimonial.videoId}');
                if (placeholder) {
                  placeholder.style.display = 'none';
                }
              }, 2000); // ✅ Increased delay for better stability
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
      if (hasRealVideo) {
        const scriptToRemove = document.getElementById(`scr_testimonial_${testimonial.videoId}`);
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
        // ✅ Also clean up the video instance
        if (window.smartplayer && window.smartplayer.instances && window.smartplayer.instances[testimonial.videoId]) {
          delete window.smartplayer.instances[testimonial.videoId];
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

      {/* ✅ FIXED: Video container with proper z-index layering and v4 API */}
      {isActive && (
        <div className="mb-4">
          <div className="aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-900 relative">
            {hasRealVideo ? (
              <>
                {/* ✅ VTurb Video Container - HIGHEST z-index with v4 API */}
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
                    zIndex: 20 // HIGHEST z-index for video
                  }}
                ></div>
                
                {/* ✅ Placeholder - LOWER z-index, hidden when video loads */}
                <div 
                  id={`placeholder_${testimonial.videoId}`}
                  className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center"
                  style={{ zIndex: 10 }} // LOWER z-index than video
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 mx-auto">
                      <Play className="w-6 h-6 text-white ml-0.5" />
                    </div>
                    <p className="text-white/90 text-base font-medium mb-1">
                      {testimonial.name}
                    </p>
                    <p className="text-white/70 text-sm">
                      Loading video...
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