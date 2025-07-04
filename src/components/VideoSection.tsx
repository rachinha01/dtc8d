import React from 'react';

export const VideoSection: React.FC = () => {
  return (
    <div className="w-full mb-6 sm:mb-8 animate-fadeInUp animation-delay-600">
      <div className="aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl">
        <div
          id="vid_683ba3d1b87ae17c6e07e7db"
          style={{
            position: 'relative',
            width: '100%',
            padding: '177.77777777777777% 0 0'
          }}
        >
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
              display: 'block'
            }}
            alt="thumbnail"
          />
          <div 
            id="backdrop_683ba3d1b87ae17c6e07e7db" 
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
  );
};