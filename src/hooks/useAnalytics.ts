import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

interface GeolocationData {
  ip: string;
  country_code: string;
  country_name: string;
  city: string;
  region: string;
}

export const useAnalytics = () => {
  const sessionId = useRef<string>(generateSessionId());
  const pageEnterTime = useRef<number>(Date.now());
  const hasTrackedVideoPlay = useRef<boolean>(false);
  const hasTrackedLeadReached = useRef<boolean>(false);
  const hasTrackedPitchReached = useRef<boolean>(false);
  const geolocationData = useRef<GeolocationData | null>(null);
  const isGeolocationLoaded = useRef<boolean>(false);
  const pingInterval = useRef<NodeJS.Timeout | null>(null);
  const sessionRecordId = useRef<string | null>(null);
  const isInitialized = useRef<boolean>(false);
  const isBrazilianIP = useRef<boolean>(false); // ✅ NEW: Track if IP is Brazilian

  function generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Function to get geolocation data with multiple stable APIs and fallbacks
  const getGeolocationData = async (): Promise<GeolocationData> => {
    // Check if we already have the data in sessionStorage
    const cachedData = sessionStorage.getItem('geolocation_data');
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        console.log('Using cached geolocation data:', parsed);
        
        // ✅ NEW: Check if cached data is Brazilian
        if (parsed.country_code === 'BR' || parsed.country_name === 'Brazil') {
          isBrazilianIP.current = true;
          console.log('🇧🇷 Brazilian IP detected - analytics tracking will be skipped');
        }
        
        return parsed;
      } catch (error) {
        console.error('Error parsing cached geolocation data:', error);
      }
    }

    // Skip geolocation in development/preview environments
    if (window.location.hostname.includes("local") || 
        window.location.hostname.includes("preview") ||
        window.location.hostname.includes("localhost") ||
        window.location.hostname.includes("127.0.0.1")) {
      const devData: GeolocationData = {
        ip: "127.0.0.1",
        country_code: "US", // ✅ CHANGED: Use US for dev to test analytics
        country_name: "United States",
        city: "New York",
        region: "New York"
      };
      sessionStorage.setItem('geolocation_data', JSON.stringify(devData));
      console.log('Using development fallback data:', devData);
      return devData;
    }

    // Default fallback data
    const defaultData: GeolocationData = {
      ip: 'Unknown',
      country_code: 'XX',
      country_name: 'Unknown',
      city: 'Unknown',
      region: 'Unknown'
    };

    // Multiple stable geolocation services with proper data mapping
    const services = [
      {
        url: 'https://ipwhois.app/json/',
        mapper: (data: any) => ({
          ip: data.ip || 'Unknown',
          country_code: data.country_code || 'XX',
          country_name: data.country || 'Unknown',
          city: data.city || 'Unknown',
          region: data.region || 'Unknown'
        })
      },
      {
        url: 'https://ipinfo.io/json?token=demo',
        mapper: (data: any) => ({
          ip: data.ip || 'Unknown',
          country_code: data.country || 'XX',
          country_name: data.country || 'Unknown',
          city: data.city || 'Unknown',
          region: data.region || 'Unknown'
        })
      },
      {
        url: 'https://ipapi.co/json/',
        mapper: (data: any) => ({
          ip: data.ip || 'Unknown',
          country_code: data.country_code || 'XX',
          country_name: data.country_name || 'Unknown',
          city: data.city || 'Unknown',
          region: data.region || 'Unknown'
        })
      }
    ];

    for (const service of services) {
      try {
        console.log(`Trying geolocation service: ${service.url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
        
        const response = await fetch(service.url, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; Analytics/1.0)'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Geolocation API response from ${service.url}:`, data);
        
        const geolocation = service.mapper(data);

        // Validate that we got meaningful data
        if (geolocation.ip && geolocation.ip !== 'Unknown' && 
            geolocation.country_name && geolocation.country_name !== 'Unknown') {
          
          // ✅ NEW: Check if IP is Brazilian and set flag
          if (geolocation.country_code === 'BR' || geolocation.country_name === 'Brazil') {
            isBrazilianIP.current = true;
            console.log('🇧🇷 Brazilian IP detected - analytics tracking will be skipped');
          }
          
          // Cache the data in sessionStorage
          sessionStorage.setItem('geolocation_data', JSON.stringify(geolocation));
          console.log('Successfully obtained geolocation data:', geolocation);
          
          return geolocation;
        } else {
          console.warn(`Service ${service.url} returned incomplete data:`, geolocation);
          continue; // Try next service
        }
        
      } catch (error) {
        console.error(`Error with geolocation service ${service.url}:`, error);
        continue; // Try next service
      }
    }

    // If all services fail, try to get basic browser info
    try {
      const browserLang = navigator.language || 'en-US';
      const countryFromLang = browserLang.split('-')[1] || 'XX';
      
      const browserData = {
        ...defaultData,
        ip: `Browser-${Date.now()}`,
        country_code: countryFromLang,
        country_name: getCountryNameFromCode(countryFromLang),
        city: 'Browser Location',
        region: 'Browser Region'
      };
      
      // ✅ NEW: Check if browser-detected country is Brazil
      if (browserData.country_code === 'BR' || browserData.country_name === 'Brazil') {
        isBrazilianIP.current = true;
        console.log('🇧🇷 Brazilian IP detected via browser - analytics tracking will be skipped');
      }
      
      sessionStorage.setItem('geolocation_data', JSON.stringify(browserData));
      console.log('Using browser-based fallback data:', browserData);
      return browserData;
    } catch (error) {
      console.error('Error getting browser data:', error);
    }

    // Final fallback
    console.log('Using default fallback data:', defaultData);
    sessionStorage.setItem('geolocation_data', JSON.stringify(defaultData));
    return defaultData;
  };

  // Helper function to get country name from country code
  const getCountryNameFromCode = (code: string): string => {
    const countryMap: { [key: string]: string } = {
      'BR': 'Brazil',
      'US': 'United States',
      'PT': 'Portugal',
      'ES': 'Spain',
      'AR': 'Argentina',
      'MX': 'Mexico',
      'CA': 'Canada',
      'GB': 'United Kingdom',
      'FR': 'France',
      'DE': 'Germany',
      'IT': 'Italy',
      'JP': 'Japan',
      'CN': 'China',
      'IN': 'India',
      'AU': 'Australia',
      'RU': 'Russia',
      'KR': 'South Korea',
      'NL': 'Netherlands'
    };
    return countryMap[code.toUpperCase()] || 'Unknown';
  };

  // Function to update last_ping for live user tracking
  const updatePing = async () => {
    if (!sessionRecordId.current || isBrazilianIP.current) return; // ✅ SKIP if Brazilian
    
    try {
      await supabase
        .from('vsl_analytics')
        .update({ last_ping: new Date().toISOString() })
        .eq('id', sessionRecordId.current);
      
      console.log('Updated ping for session:', sessionId.current);
    } catch (error) {
      console.error('Error updating ping:', error);
    }
  };

  // Start ping interval for live user tracking
  const startPingInterval = () => {
    if (isBrazilianIP.current) return; // ✅ SKIP if Brazilian
    
    // Clear any existing interval
    if (pingInterval.current) {
      clearInterval(pingInterval.current);
    }

    // Update ping every 30 seconds
    pingInterval.current = setInterval(updatePing, 30000);
    
    console.log('Started ping interval for live user tracking');
  };

  // Stop ping interval
  const stopPingInterval = () => {
    if (pingInterval.current) {
      clearInterval(pingInterval.current);
      pingInterval.current = null;
      console.log('Stopped ping interval');
    }
  };

  const trackEvent = async (
    eventType: 'page_enter' | 'video_play' | 'video_progress' | 'pitch_reached' | 'offer_click' | 'page_exit',
    eventData?: any
  ) => {
    try {
      // Wait for geolocation data if not loaded yet
      if (!isGeolocationLoaded.current) {
        geolocationData.current = await getGeolocationData();
        isGeolocationLoaded.current = true;
      }

      // ✅ NEW: Skip tracking for Brazilian IPs
      if (isBrazilianIP.current) {
        console.log('🇧🇷 Skipping analytics tracking for Brazilian IP');
        return;
      }

      // Include geolocation data in event
      const enrichedEventData = {
        ...eventData,
        country: geolocationData.current?.country_name || 'Unknown'
      };

      const { data, error } = await supabase.from('vsl_analytics').insert({
        session_id: sessionId.current,
        event_type: eventType,
        event_data: enrichedEventData,
        timestamp: new Date().toISOString(),
        ip: geolocationData.current?.ip || null,
        country_code: geolocationData.current?.country_code || null,
        country_name: geolocationData.current?.country_name || null,
        city: geolocationData.current?.city || null,
        region: geolocationData.current?.region || null,
        last_ping: new Date().toISOString(),
      }).select('id');

      // Store the record ID for the first event (page_enter) to use for ping updates
      if (eventType === 'page_enter' && data && data[0]) {
        sessionRecordId.current = data[0].id;
        console.log('Stored session record ID:', sessionRecordId.current);
        
        // Start ping interval after successful page_enter tracking
        startPingInterval();
      }

      if (error) throw error;
      
      console.log(`✅ Tracked event: ${eventType}`, enrichedEventData);
    } catch (error) {
      console.error('Error tracking event:', error);
      // Don't throw error - analytics should never break the app
    }
  };

  // Track page enter on mount - FIXED: Remove recursive call
  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initializeAnalytics = async () => {
      try {
        // Load geolocation data first
        geolocationData.current = await getGeolocationData();
        isGeolocationLoaded.current = true;
        
        // ✅ NEW: Only track if not Brazilian IP
        if (!isBrazilianIP.current) {
          // Track page enter with geolocation data
          await trackEvent('page_enter', { 
            country: geolocationData.current?.country_name || 'Unknown',
            city: geolocationData.current?.city || 'Unknown',
            region: geolocationData.current?.region || 'Unknown'
          });
        } else {
          console.log('🇧🇷 Brazilian IP detected - skipping page_enter tracking');
        }
      } catch (error) {
        console.error('Error initializing analytics:', error);
        // Continue without breaking the app
      }
    };

    initializeAnalytics();

    // Track page exit on unmount and stop ping
    return () => {
      stopPingInterval();
      
      // ✅ NEW: Only track page exit if not Brazilian IP
      if (!isBrazilianIP.current) {
        const timeOnPage = Date.now() - pageEnterTime.current;
        trackEvent('page_exit', { 
          time_on_page_ms: timeOnPage,
          country: geolocationData.current?.country_name || 'Unknown'
        });
      }
    };
  }, []); // Empty dependency array to run only once

  // Track page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isBrazilianIP.current) return; // ✅ SKIP if Brazilian
      
      if (document.hidden) {
        // Stop ping when page is hidden
        stopPingInterval();
        
        const timeOnPage = Date.now() - pageEnterTime.current;
        trackEvent('page_exit', { 
          time_on_page_ms: timeOnPage,
          country: geolocationData.current?.country_name || 'Unknown'
        });
      } else {
        // Resume ping when page becomes visible again
        if (sessionRecordId.current) {
          startPingInterval();
          updatePing(); // Immediate ping on visibility change
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Handle beforeunload to stop ping
  useEffect(() => {
    const handleBeforeUnload = () => {
      stopPingInterval();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const trackVideoPlay = () => {
    if (isBrazilianIP.current) return; // ✅ SKIP if Brazilian
    
    if (!hasTrackedVideoPlay.current) {
      hasTrackedVideoPlay.current = true;
      trackEvent('video_play', { 
        country: geolocationData.current?.country_name || 'Unknown'
      });
    }
  };

  const trackVideoProgress = (currentTime: number, duration: number) => {
    if (isBrazilianIP.current) return; // ✅ SKIP if Brazilian
    
    // ✅ NEW: Track when user reaches the pitch moment (35:55 = 2155 seconds)
    if (currentTime >= 2155 && !hasTrackedPitchReached.current) {
      hasTrackedPitchReached.current = true;
      trackEvent('pitch_reached', { 
        milestone: 'pitch_reached_35_55',
        time_reached: currentTime,
        current_time: currentTime,
        country: geolocationData.current?.country_name || 'Unknown'
      });
      console.log('🎯 User reached pitch moment at 35:55 (2155 seconds)');
    }
    
    const progressPercent = (currentTime / duration) * 100;
    
    // Track lead reached at 7:45 (465 seconds)
    if (currentTime >= 465 && !hasTrackedLeadReached.current) {
      hasTrackedLeadReached.current = true;
      trackEvent('video_progress', { 
        milestone: 'lead_reached',
        time_reached: currentTime,
        current_time: currentTime,
        country: geolocationData.current?.country_name || 'Unknown'
      });
    }
    
    // Track pitch reached at 35:55 (2155 seconds)
    if (currentTime >= 2155 && !hasTrackedPitchReached.current) {
      hasTrackedPitchReached.current = true;
      trackEvent('video_progress', { 
        milestone: 'pitch_reached',
        time_reached: currentTime,
        current_time: currentTime,
        country: geolocationData.current?.country_name || 'Unknown'
      });
    }

    // Track progress milestones every 25%
    const milestone25 = Math.floor(duration * 0.25);
    const milestone50 = Math.floor(duration * 0.50);
    const milestone75 = Math.floor(duration * 0.75);

    if (currentTime >= milestone25 && currentTime < milestone50) {
      trackEvent('video_progress', { 
        progress: 25, 
        current_time: currentTime,
        country: geolocationData.current?.country_name || 'Unknown'
      });
    } else if (currentTime >= milestone50 && currentTime < milestone75) {
      trackEvent('video_progress', { 
        progress: 50, 
        current_time: currentTime,
        country: geolocationData.current?.country_name || 'Unknown'
      });
    } else if (currentTime >= milestone75) {
      trackEvent('video_progress', { 
        progress: 75, 
        current_time: currentTime,
        country: geolocationData.current?.country_name || 'Unknown'
      });
    }
  };

  const trackOfferClick = (offerType: '1-bottle' | '3-bottle' | '6-bottle' | string) => {
    if (isBrazilianIP.current) return; // ✅ SKIP if Brazilian
    
    trackEvent('offer_click', { 
      offer_type: offerType,
      country: geolocationData.current?.country_name || 'Unknown'
    });
  };

  return {
    trackVideoPlay,
    trackVideoProgress,
    trackOfferClick,
  };
};