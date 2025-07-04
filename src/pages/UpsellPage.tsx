import React, { useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

interface UpsellPageProps {
  variant: '1-bottle' | '3-bottle' | '6-bottle';
}

export const UpsellPage: React.FC<UpsellPageProps> = ({ variant }) => {
  const { trackVideoPlay, trackVideoProgress } = useAnalytics();

  // Generate unique video ID for each upsell variant
  const getVideoId = (variant: string) => {
    const videoIds = {
      '1-bottle': 'upsell_1bt_video_id', // Replace with actual VTurb video ID
      '3-bottle': 'upsell_3bt_video_id', // Replace with actual VTurb video ID
      '6-bottle': 'upsell_6bt_video_id', // Replace with actual VTurb video ID
    };
    return videoIds[variant as keyof typeof videoIds] || 'default_upsell_video_id';
  };

  const getHeadline = (variant: string) => {
    const headlines = {
      '1-bottle': 'Special Upsell: 1 Bottle Enhanced Formula',
      '3-bottle': 'Limited Time: 3 Bottle Power Pack',
      '6-bottle': 'Best Value: 6 Bottle Complete System',
    };
    return headlines[variant as keyof typeof headlines] || 'Special Upsell Offer';
  };

  const videoId = getVideoId(variant);
  const headline = getHeadline(variant);

  useEffect(() => {
    // Inject VTurb script for upsell video
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
    document.head.appendChild(script);
    
    // Setup video tracking
    setTimeout(() => {
      setupVideoTracking();
    }, 2000);

    return () => {
      const scriptToRemove = document.getElementById(`scr_${videoId}`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [videoId]);

  const setupVideoTracking = () => {
    let hasTrackedPlay = false;

    const checkForPlayer = () => {
      // Check for VTurb player events
      if (window.smartplayer && window.smartplayer.instances) {
        const playerInstance = window.smartplayer.instances[videoId];
        if (playerInstance) {
          // Track video play
          playerInstance.on('play', () => {
            if (!hasTrackedPlay) {
              hasTrackedPlay = true;
              trackVideoPlay();
            }
          });

          // Track video progress
          playerInstance.on('timeupdate', (event) => {
            const currentTime = event.detail.currentTime;
            const duration = event.detail.duration;
            
            if (duration && currentTime) {
              trackVideoProgress(currentTime, duration);
            }
          });
        }
      }

      // Fallback: Track clicks on video container as play events
      const videoContainer = document.getElementById(`vid_${videoId}`);
      if (videoContainer && !hasTrackedPlay) {
        const handleClick = () => {
          if (!hasTrackedPlay) {
            hasTrackedPlay = true;
            trackVideoPlay();
          }
        };
        
        videoContainer.addEventListener('click', handleClick);
        
        // Also track any video elements that might be created
        const videos = videoContainer.querySelectorAll('video');
        videos.forEach(video => {
          video.addEventListener('play', () => {
            if (!hasTrackedPlay) {
              hasTrackedPlay = true;
              trackVideoPlay();
            }
          });
          
          video.addEventListener('timeupdate', () => {
            if (video.duration) {
              trackVideoProgress(video.currentTime, video.duration);
            }
          });
        });
      }
    };

    // Check immediately and then periodically
    checkForPlayer();
    const interval = setInterval(checkForPlayer, 1000);
    setTimeout(() => clearInterval(interval), 15000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 overflow-x-hidden">
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-6 sm:py-8 max-w-full">
        
        {/* Header */}
        <header className="mb-6 sm:mb-8 animate-fadeInDown animation-delay-200">
          <img 
            src="https://i.imgur.com/QJxTIcN.png" 
            alt="Blue Drops Logo"
            className="h-8 w-auto"
          />
        </header>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
          
          {/* Headline */}
          <div className="mb-6 text-center w-full animate-fadeInUp animation-delay-400">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[0.85] mb-3 px-2">
              <span className="text-blue-900 block mb-0.5">{headline.split(':')[0]}:</span>
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent block">
                {headline.split(':')[1]?.trim() || 'Special Offer'}
              </span>
            </h1>
          </div>

          {/* Video Section */}
          <div className="w-full mb-6 sm:mb-8 animate-fadeInUp animation-delay-600">
            <div className="aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl">
              <div
                id={`vid_${videoId}`}
                style={{
                  position: 'relative',
                  width: '100%',
                  padding: '177.77777777777777% 0 0'
                }}
              >
                <img 
                  id={`thumb_${videoId}`} 
                  src={`https://images.converteai.net/b792ccfe-b151-4538-84c6-42bb48a19ba4/players/${videoId}/thumbnail.jpg`} 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  alt="thumbnail"
                />
                <div 
                  id={`backdrop_${videoId}`} 
                  style={{
                    WebkitBackdropFilter: 'blur(5px)',
                    backdropFilter: 'blur(5px)',
                    position: 'absolute',
                    top: 0,
                    height: '100%',
                    width: '100%'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};