import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from './hooks/useAnalytics';

// Import all components
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { VideoSection } from './components/VideoSection';
import { ProductOffers } from './components/ProductOffers';
import { TestimonialsSection } from './components/TestimonialsSection';
import { DoctorsSection } from './components/DoctorsSection';
import { NewsSection } from './components/NewsSection';
import { GuaranteeSection } from './components/GuaranteeSection';
import { Footer } from './components/Footer';
import { Modals } from './components/Modals';

function App() {
  const [showPurchaseButton, setShowPurchaseButton] = useState(true); // Show immediately
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [showUpsellPopup, setShowUpsellPopup] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();
  const { trackVideoPlay, trackVideoProgress, trackOfferClick } = useAnalytics();

  useEffect(() => {
    // Inject VTurb script immediately when component mounts
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = 'scr_683ba3d1b87ae17c6e07e7db';
    script.async = true;
    script.innerHTML = `
      var s=document.createElement("script");
      s.src="https://scripts.converteai.net/b792ccfe-b151-4538-84c6-42bb48a19ba4/players/683ba3d1b87ae17c6e07e7db/player.js";
      s.async=true;
      document.head.appendChild(s);
    `;
    document.head.appendChild(script);
    
    // Set video as loaded and setup tracking
    setTimeout(() => {
      setIsVideoLoaded(true);
      setupVideoTracking();
    }, 2000);

    return () => {
      const scriptToRemove = document.getElementById('scr_683ba3d1b87ae17c6e07e7db');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  const setupVideoTracking = () => {
    // Setup tracking for VTurb player
    let hasTrackedPlay = false;

    const checkForPlayer = () => {
      // Check for VTurb player events
      if (window.smartplayer && window.smartplayer.instances) {
        const playerInstance = window.smartplayer.instances['683ba3d1b87ae17c6e07e7db'];
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
      const videoContainer = document.getElementById('vid_683ba3d1b87ae17c6e07e7db');
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

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleLogoClick = () => {
    setShowLoginModal(true);
    setLoginError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginEmail === 'admin@magicbluedrops.com' && loginPassword === 'gotinhaazul') {
      setShowLoginModal(false);
      navigate('/admin');
    } else {
      setLoginError('Email ou senha incorretos');
    }
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    setLoginEmail('');
    setLoginPassword('');
    setLoginError('');
  };

  const handleSecondaryPackageClick = (packageType: '1-bottle' | '3-bottle') => {
    setSelectedPackage(packageType);
    setShowUpsellPopup(true);
  };

  const closeUpsellPopup = () => {
    setShowUpsellPopup(false);
    setSelectedPackage('');
  };

  const getUpsellSavings = (packageType: string) => {
    if (packageType === '3-bottle') {
      return 102;
    } else if (packageType === '1-bottle') {
      return 240;
    }
    return 0;
  };

  const handlePurchase = (packageType: '1-bottle' | '3-bottle' | '6-bottle') => {
    // Track the offer click
    trackOfferClick(packageType);
    
    const links = {
      '1-bottle': 'https://pagamento.paybluedrops.com/checkout/176654642:1',
      '3-bottle': 'https://pagamento.paybluedrops.com/checkout/176845818:1',
      '6-bottle': 'https://pagamento.paybluedrops.com/checkout/176849703:1'
    };
    
    window.open(links[packageType], '_blank');
  };

  const handleUpsellAccept = () => {
    handlePurchase('6-bottle');
    closeUpsellPopup();
  };

  const handleUpsellRefuse = () => {
    if (selectedPackage) {
      handlePurchase(selectedPackage as '1-bottle' | '3-bottle' | '6-bottle');
    }
    closeUpsellPopup();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 overflow-x-hidden">
      {/* Main container - Always visible */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-6 sm:py-8 max-w-full">
        
        {/* Header */}
        <Header onLogoClick={handleLogoClick} />

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
          
          {/* Hero Section */}
          <HeroSection />

          {/* Video Section */}
          <VideoSection />

          {/* Product Offers */}
          <ProductOffers 
            showPurchaseButton={showPurchaseButton}
            onPurchase={handlePurchase}
            onSecondaryPackageClick={handleSecondaryPackageClick}
          />
        </div>

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Doctors Section */}
        <DoctorsSection />

        {/* News Section */}
        <NewsSection />

        {/* Guarantee Section */}
        <GuaranteeSection />

        {/* Footer */}
        <Footer />
      </div>

      {/* All Modals - Only show popup on main page */}
      <Modals 
        showPopup={showPopup}
        showLoginModal={showLoginModal}
        showUpsellPopup={showUpsellPopup}
        selectedPackage={selectedPackage}
        loginEmail={loginEmail}
        loginPassword={loginPassword}
        loginError={loginError}
        onClosePopup={closePopup}
        onCloseLoginModal={closeLoginModal}
        onCloseUpsellPopup={closeUpsellPopup}
        onLoginEmailChange={setLoginEmail}
        onLoginPasswordChange={setLoginPassword}
        onLogin={handleLogin}
        onUpsellAccept={handleUpsellAccept}
        onUpsellRefuse={handleUpsellRefuse}
        getUpsellSavings={getUpsellSavings}
      />
    </div>
  );
}

// Add global type for smartplayer
declare global {
  interface Window {
    smartplayer?: {
      instances?: {
        [key: string]: {
          on: (event: string, callback: (event?: any) => void) => void;
        };
      };
    };
  }
}

export default App;