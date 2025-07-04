import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const { trackVideoPlay, trackVideoProgress, trackOfferClick } = useAnalytics();

  // Check if we're on the main page (show popup only on main page)
  const isMainPage = location.pathname === '/' || location.pathname === '/home';

  useEffect(() => {
    // Initialize URL tracking parameters
    const initializeUrlTracking = () => {
      try {
        // Store URL parameters in sessionStorage for persistence
        const urlParams = new URLSearchParams(window.location.search);
        const trackingParams: Record<string, string> = {};
        
        // Common tracking parameters to preserve
        const trackingKeys = [
          'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
          'fbclid', 'gclid', 'ttclid', 'twclid', 'li_fat_id',
          'affiliate_id', 'sub_id', 'click_id', 'transaction_id'
        ];
        
        trackingKeys.forEach(key => {
          const value = urlParams.get(key);
          if (value) {
            trackingParams[key] = value;
          }
        });
        
        if (Object.keys(trackingParams).length > 0) {
          sessionStorage.setItem('tracking_params', JSON.stringify(trackingParams));
        }
        
        // Track page view with external pixels
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'PageView');
        }
        
        if (typeof window !== 'undefined' && (window as any).utmify) {
          (window as any).utmify('track', 'PageView');
        }
      } catch (error) {
        console.error('Error initializing URL tracking:', error);
      }
    };

    initializeUrlTracking();
    
    // Inject VTurb script with proper error handling and optimization
    const injectVTurbScript = () => {
      // Remove any existing script first
      const existingScript = document.getElementById('scr_683ba3d1b87ae17c6e07e7db');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.id = 'scr_683ba3d1b87ae17c6e07e7db';
      script.async = true;
      script.defer = true; // Add defer for better performance
      
      // Optimized VTurb injection
      script.innerHTML = `
        (function() {
          try {
            var s = document.createElement("script");
            s.src = "https://scripts.converteai.net/b792ccfe-b151-4538-84c6-42bb48a19ba4/players/683ba3d1b87ae17c6e07e7db/player.js";
            s.async = true;
            s.onload = function() {
              console.log('VTurb player script loaded successfully');
              window.vslVideoLoaded = true;
            };
            s.onerror = function() {
              console.error('Failed to load VTurb player script');
            };
            document.head.appendChild(s);
          } catch (error) {
            console.error('Error injecting VTurb script:', error);
          }
        })();
      `;
      
      document.head.appendChild(script);
    };

    // Delay script injection to improve initial page load
    const scriptTimeout = setTimeout(() => {
      injectVTurbScript();
      setIsVideoLoaded(true);
      
      // Setup video tracking after script loads
      setTimeout(() => {
        setupVideoTracking();
      }, 3000);
    }, 1000); // Reduced delay for faster video loading

    return () => {
      clearTimeout(scriptTimeout);
      const scriptToRemove = document.getElementById('scr_683ba3d1b87ae17c6e07e7db');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  const setupVideoTracking = () => {
    // Setup tracking for VTurb player with improved detection
    let hasTrackedPlay = false;
    let trackingInterval: NodeJS.Timeout;

    const checkForPlayer = () => {
      try {
        // Multiple ways to detect VTurb player
        const playerContainer = document.getElementById('vid_683ba3d1b87ae17c6e07e7db');
        
        // Method 1: Check for smartplayer instances
        if (window.smartplayer && window.smartplayer.instances) {
          const playerInstance = window.smartplayer.instances['683ba3d1b87ae17c6e07e7db'];
          if (playerInstance) {
            console.log('VTurb player instance found');
            
            // Track video play
            playerInstance.on('play', () => {
              if (!hasTrackedPlay) {
                hasTrackedPlay = true;
                trackVideoPlay();
                console.log('Video play tracked');
              }
            });

            // Track video progress
            playerInstance.on('timeupdate', (event: any) => {
              const currentTime = event.detail?.currentTime || event.currentTime;
              const duration = event.detail?.duration || event.duration;
              
              if (duration && currentTime) {
                trackVideoProgress(currentTime, duration);
              }
            });

            clearInterval(trackingInterval);
            return;
          }
        }

        // Method 2: Check for video elements in container
        if (playerContainer) {
          const videos = playerContainer.querySelectorAll('video');
          if (videos.length > 0) {
            console.log('Video elements found in container');
            
            videos.forEach(video => {
              // Remove existing listeners to avoid duplicates
              video.removeEventListener('play', handleVideoPlay);
              video.removeEventListener('timeupdate', handleTimeUpdate);
              
              // Add new listeners
              video.addEventListener('play', handleVideoPlay);
              video.addEventListener('timeupdate', handleTimeUpdate);
            });

            clearInterval(trackingInterval);
            return;
          }

          // Method 3: Track clicks on video container as fallback
          if (!hasTrackedPlay) {
            playerContainer.removeEventListener('click', handleContainerClick);
            playerContainer.addEventListener('click', handleContainerClick);
          }
        }

        // Method 4: Check for iframe (some VTurb implementations use iframe)
        const iframe = document.querySelector('iframe[src*="converteai.net"]');
        if (iframe) {
          console.log('VTurb iframe found');
          iframe.removeEventListener('load', handleIframeLoad);
          iframe.addEventListener('load', handleIframeLoad);
        }

      } catch (error) {
        console.error('Error in checkForPlayer:', error);
      }
    };

    const handleVideoPlay = () => {
      if (!hasTrackedPlay) {
        hasTrackedPlay = true;
        trackVideoPlay();
        console.log('Video play tracked via video element');
      }
    };

    const handleTimeUpdate = (event: Event) => {
      const video = event.target as HTMLVideoElement;
      if (video.duration && video.currentTime) {
        trackVideoProgress(video.currentTime, video.duration);
      }
    };

    const handleContainerClick = () => {
      if (!hasTrackedPlay) {
        hasTrackedPlay = true;
        trackVideoPlay();
        console.log('Video play tracked via container click');
      }
    };

    const handleIframeLoad = () => {
      console.log('VTurb iframe loaded');
      // Try to access iframe content if same-origin
      try {
        const iframe = document.querySelector('iframe[src*="converteai.net"]') as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
          // Setup postMessage listener for cross-origin communication
          window.addEventListener('message', (event) => {
            if (event.origin.includes('converteai.net')) {
              if (event.data.type === 'video_play' && !hasTrackedPlay) {
                hasTrackedPlay = true;
                trackVideoPlay();
                console.log('Video play tracked via iframe message');
              }
              if (event.data.type === 'video_progress') {
                trackVideoProgress(event.data.currentTime, event.data.duration);
              }
            }
          });
        }
      } catch (error) {
        console.log('Cross-origin iframe, using fallback tracking');
      }
    };

    // Start checking for player immediately and then periodically
    checkForPlayer();
    trackingInterval = setInterval(checkForPlayer, 2000);
    
    // Stop checking after 30 seconds to avoid infinite loops
    setTimeout(() => {
      if (trackingInterval) {
        clearInterval(trackingInterval);
      }
    }, 30000);
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

        {/* Testimonials Section - Lazy load */}
        <TestimonialsSection />

        {/* Doctors Section - Lazy load */}
        <DoctorsSection />

        {/* News Section - Lazy load */}
        <NewsSection />

        {/* Guarantee Section */}
        <GuaranteeSection />

        {/* Footer */}
        <Footer />
      </div>

      {/* All Modals - Only show popup on main page */}
      <Modals 
        showPopup={isMainPage ? showPopup : false}
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

// Enhanced global type for smartplayer with better error handling
declare global {
  interface Window {
    smartplayer?: {
      instances?: {
        [key: string]: {
          on: (event: string, callback: (event?: any) => void) => void;
          play?: () => void;
          pause?: () => void;
          getCurrentTime?: () => number;
          getDuration?: () => number;
        };
      };
    };
    vslVideoLoaded?: boolean;
    pixelId?: string;
  }
}

export default App;