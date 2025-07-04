import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';

export const VideoSection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check if video is loaded
    const checkVideoLoad = () => {
      const videoContainer = document.getElementById('vid_683ba3d1b87ae17c6e07e7db');
      if (videoContainer) {
        // Check for actual video content
        const hasVideo = videoContainer.querySelector('video') || 
                         videoContainer.querySelector('iframe') ||
                         videoContainer.querySelector('[data-vturb-player]') ||
                         window.vslVideoLoaded;
        
        if (hasVideo) {
          setIsLoading(false);
          setHasError(false);
        }
      }
    };

    // Check immediately
    checkVideoLoad();

    // Check periodically for up to 15 seconds
    const interval = setInterval(checkVideoLoad, 1000);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
      }
    }, 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isLoading]);

  const handleRetryLoad = () => {
    setIsLoading(true);
    setHasError(false);
    
    // Force reload the VTurb script
    const existingScript = document.getElementById('scr_683ba3d1b87ae17c6e07e7db');
    if (existingScript) {
      existingScript.remove();
    }

    // Re-inject script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = 'scr_683ba3d1b87ae17c6e07e7db';
    script.async = true;
    script.innerHTML = `
      (function() {
        try {
          var s = document.createElement("script");
          s.src = "https://scripts.converteai.net/b792ccfe-b151-4538-84c6-42bb48a19ba4/players/683ba3d1b87ae17c6e07e7db/player.js";
          s.async = true;
          s.onload = function() {
            console.log('VTurb player reloaded');
            window.vslVideoLoaded = true;
          };
          document.head.appendChild(s);
        } catch (error) {
          console.error('Error reloading VTurb script:', error);
        }
      })();
    `;
    document.head.appendChild(script);
  };

  return (
    <div className="w-full mb-6 sm:mb-8 animate-fadeInUp animation-delay-600">
      <div className="aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl relative">
        {/* VTurb Video Container */}
        <div
          id="vid_683ba3d1b87ae17c6e07e7db"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            padding: '177.77777777777777% 0 0'
          }}
        >
          {/* Thumbnail - Always show as fallback */}
          <img 
            id="thumb_683ba3d1b87ae17c6e07e7db" 
            src="https://images.converteai.net/b792ccfe-b151-4538-84c6-42bb48a19ba4/players/683ba3d1b87ae17c6e07e7db/thumbnail.jpg" 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              zIndex: 1
            }}
            alt="VSL Thumbnail"
            loading="eager"
          />
          
          {/* Backdrop */}
          <div 
            id="backdrop_683ba3d1b87ae17c6e07e7db" 
            style={{
              WebkitBackdropFilter: 'blur(5px)',
              backdropFilter: 'blur(5px)',
              position: 'absolute',
              top: 0,
              height: '100%',
              width: '100%',
              zIndex: 2
            }}
          />

          {/* Loading Overlay */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <div className="text-center text-white">
                <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4 mx-auto"></div>
                <p className="text-sm font-medium">Carregando vídeo...</p>
              </div>
            </div>
          )}

          {/* Error Overlay */}
          {hasError && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
              <div className="text-center text-white p-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Play className="w-8 h-8 text-red-400" />
                </div>
                <p className="text-sm font-medium mb-4">Erro ao carregar o vídeo</p>
                <button
                  onClick={handleRetryLoad}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          )}

          {/* Play Button Overlay - Always visible for better UX */}
          <div className="absolute inset-0 flex items-center justify-center z-5 pointer-events-none">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
              <Play className="w-10 h-10 text-white ml-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};