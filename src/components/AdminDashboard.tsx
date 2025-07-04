import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SalesChart } from './SalesChart';
import { ConversionFunnel } from './ConversionFunnel';
import { ConversionHeatmap } from './ConversionHeatmap';
import { TrackingTestPanel } from './TrackingTestPanel';
import { 
  BarChart3, 
  Users, 
  Play, 
  Target, 
  ShoppingCart, 
  Clock, 
  TrendingUp,
  RefreshCw,
  Calendar,
  Eye,
  Globe,
  UserCheck,
  Activity,
  MapPin,
  Zap,
  Settings,
  Lock,
  LogOut
} from 'lucide-react';

interface AnalyticsData {
  totalSessions: number;
  videoPlayRate: number;
  pitchReachRate: number;
  leadReachRate: number;
  offerClickRates: {
    '1-bottle': number;
    '3-bottle': number;
    '6-bottle': number;
  };
  averageTimeOnPage: number;
  totalOfferClicks: number;
  recentSessions: any[];
  liveUsers: number;
  countryStats: { [key: string]: number };
  topCountries: Array<{ country: string; count: number; flag: string }>;
  topCities: Array<{ city: string; country: string; count: number }>;
  liveCountryBreakdown: Array<{ country: string; countryCode: string; count: number; flag: string }>;
}

interface LiveSession {
  sessionId: string;
  country: string;
  countryCode: string;
  city: string;
  ip: string;
  lastActivity: Date;
  isActive: boolean;
}

export const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalSessions: 0,
    videoPlayRate: 0,
    pitchReachRate: 0,
    leadReachRate: 0,
    offerClickRates: {
      '1-bottle': 0,
      '3-bottle': 0,
      '6-bottle': 0,
    },
    averageTimeOnPage: 0,
    totalOfferClicks: 0,
    recentSessions: [],
    liveUsers: 0,
    countryStats: {},
    topCountries: [],
    topCities: [],
    liveCountryBreakdown: [],
  });
  
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [activeTab, setActiveTab] = useState<'analytics' | 'tracking'>('analytics');

  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = sessionStorage.getItem('admin_authenticated') === 'true';
      const loginTime = sessionStorage.getItem('admin_login_time');
      
      // Check if login is still valid (24 hours)
      if (isLoggedIn && loginTime) {
        const loginTimestamp = parseInt(loginTime);
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        if (now - loginTimestamp < twentyFourHours) {
          setIsAuthenticated(true);
        } else {
          // Session expired
          sessionStorage.removeItem('admin_authenticated');
          sessionStorage.removeItem('admin_login_time');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    if (loginEmail === 'admin@magicbluedrops.com' && loginPassword === 'gotinhaazul') {
      // Set authentication
      sessionStorage.setItem('admin_authenticated', 'true');
      sessionStorage.setItem('admin_login_time', Date.now().toString());
      setIsAuthenticated(true);
      setLoginEmail('');
      setLoginPassword('');
    } else {
      setLoginError('Email ou senha incorretos');
    }
    
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_login_time');
    setIsAuthenticated(false);
    navigate('/');
  };

  // Enhanced country flag mapping
  const getCountryFlag = (countryCode: string, countryName?: string) => {
    // Use country code for more accurate flags
    const countryFlags: { [key: string]: string } = {
      'BR': '🇧🇷', 'US': '🇺🇸', 'PT': '🇵🇹', 'ES': '🇪🇸', 'AR': '🇦🇷',
      'MX': '🇲🇽', 'CA': '🇨🇦', 'GB': '🇬🇧', 'FR': '🇫🇷', 'DE': '🇩🇪',
      'IT': '🇮🇹', 'JP': '🇯🇵', 'CN': '🇨🇳', 'IN': '🇮🇳', 'AU': '🇦🇺',
      'RU': '🇷🇺', 'KR': '🇰🇷', 'NL': '🇳🇱', 'SE': '🇸🇪', 'NO': '🇳🇴',
      'DK': '🇩🇰', 'FI': '🇫🇮', 'PL': '🇵🇱', 'CZ': '🇨🇿', 'AT': '🇦🇹',
      'CH': '🇨🇭', 'BE': '🇧🇪', 'IE': '🇮🇪', 'GR': '🇬🇷', 'TR': '🇹🇷',
      'IL': '🇮🇱', 'SA': '🇸🇦', 'AE': '🇦🇪', 'EG': '🇪🇬', 'ZA': '🇿🇦',
      'NG': '🇳🇬', 'KE': '🇰🇪', 'MA': '🇲🇦', 'TN': '🇹🇳', 'DZ': '🇩🇿',
      'XX': '🌍', '': '🌍'
    };

    // Try country code first, then fallback to country name mapping
    if (countryCode && countryFlags[countryCode.toUpperCase()]) {
      return countryFlags[countryCode.toUpperCase()];
    }

    // Fallback to name-based mapping
    const nameFlags: { [key: string]: string } = {
      'Brazil': '🇧🇷', 'United States': '🇺🇸', 'Portugal': '🇵🇹',
      'Spain': '🇪🇸', 'Argentina': '🇦🇷', 'Mexico': '🇲🇽',
      'Canada': '🇨🇦', 'United Kingdom': '🇬🇧', 'France': '🇫🇷',
      'Germany': '🇩🇪', 'Italy': '🇮🇹', 'Unknown': '🌍'
    };

    return nameFlags[countryName || 'Unknown'] || '🌍';
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Get all analytics data with new geolocation fields
      const { data: allEvents, error } = await supabase
        .from('vsl_analytics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!allEvents) {
        setLoading(false);
        return;
      }

      // Group events by session
      const sessionGroups = allEvents.reduce((acc, event) => {
        if (!acc[event.session_id]) {
          acc[event.session_id] = [];
        }
        acc[event.session_id].push(event);
        return acc;
      }, {} as Record<string, any[]>);

      const sessions = Object.values(sessionGroups);
      const totalSessions = sessions.length;

      // Calculate live users using last_ping (users active in last 2 minutes)
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
      
      // Get unique sessions with recent last_ping
      const liveSessionsMap = new Map();
      allEvents.forEach(event => {
        if (event.last_ping && new Date(event.last_ping) > twoMinutesAgo) {
          const sessionId = event.session_id;
          if (!liveSessionsMap.has(sessionId) || 
              new Date(event.last_ping) > new Date(liveSessionsMap.get(sessionId).last_ping)) {
            liveSessionsMap.set(sessionId, event);
          }
        }
      });

      const liveSessionsArray = Array.from(liveSessionsMap.values());
      const liveUsers = liveSessionsArray.length;

      // Update live sessions with enhanced geolocation data
      const liveSessionsData: LiveSession[] = liveSessionsArray.map((sessionEvent) => {
        return {
          sessionId: sessionEvent.session_id,
          country: sessionEvent.country_name || 'Unknown',
          countryCode: sessionEvent.country_code || 'XX',
          city: sessionEvent.city || 'Unknown',
          ip: sessionEvent.ip || 'Unknown',
          lastActivity: new Date(sessionEvent.last_ping || sessionEvent.created_at),
          isActive: true
        };
      });

      setLiveSessions(liveSessionsData);

      // Calculate live country breakdown
      const liveCountryMap = new Map();
      liveSessionsData.forEach(session => {
        const key = session.country;
        if (liveCountryMap.has(key)) {
          liveCountryMap.get(key).count++;
        } else {
          liveCountryMap.set(key, {
            country: session.country,
            countryCode: session.countryCode,
            count: 1,
            flag: getCountryFlag(session.countryCode, session.country)
          });
        }
      });

      const liveCountryBreakdown = Array.from(liveCountryMap.values())
        .sort((a, b) => b.count - a.count);

      // Calculate enhanced country statistics
      const countryStats = liveSessionsData.reduce((acc, session) => {
        const key = session.country;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      // Calculate top countries from all sessions
      const allCountryStats = sessions.reduce((acc, session) => {
        const event = session.find(e => e.country_name) || session[0];
        const country = event.country_name || event.event_data?.country || 'Unknown';
        const countryCode = event.country_code || 'XX';
        
        if (!acc[country]) {
          acc[country] = { count: 0, countryCode };
        }
        acc[country].count++;
        return acc;
      }, {} as { [key: string]: { count: number; countryCode: string } });

      const topCountries = Object.entries(allCountryStats)
        .map(([country, data]) => ({
          country,
          count: data.count,
          flag: getCountryFlag(data.countryCode, country)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Calculate top cities
      const allCityStats = sessions.reduce((acc, session) => {
        const event = session.find(e => e.city) || session[0];
        const city = event.city || 'Unknown';
        const country = event.country_name || event.event_data?.country || 'Unknown';
        const key = `${city}, ${country}`;
        
        if (!acc[key]) {
          acc[key] = { city, country, count: 0 };
        }
        acc[key].count++;
        return acc;
      }, {} as { [key: string]: { city: string; country: string; count: number } });

      const topCities = Object.values(allCityStats)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Calculate video play rate
      const sessionsWithVideoPlay = sessions.filter(session =>
        session.some(event => event.event_type === 'video_play')
      ).length;
      const videoPlayRate = totalSessions > 0 ? (sessionsWithVideoPlay / totalSessions) * 100 : 0;

      // Calculate pitch reach rate (35:55 = 2155 seconds)
      const sessionsWithPitchReached = sessions.filter(session =>
        session.some(event => 
          event.event_type === 'video_progress' && 
          (event.event_data?.current_time >= 2155 || event.event_data?.milestone === 'pitch_reached')
        )
      ).length;
      const pitchReachRate = totalSessions > 0 ? (sessionsWithPitchReached / totalSessions) * 100 : 0;

      // Calculate lead reach rate (7:45 = 465 seconds)
      const sessionsWithLeadReached = sessions.filter(session =>
        session.some(event => 
          event.event_type === 'video_progress' && 
          (event.event_data?.current_time >= 465 || event.event_data?.milestone === 'lead_reached')
        )
      ).length;
      const leadReachRate = totalSessions > 0 ? (sessionsWithLeadReached / totalSessions) * 100 : 0;

      // Calculate offer click rates
      const offerClicks = allEvents.filter(event => event.event_type === 'offer_click');
      const totalOfferClicks = offerClicks.length;
      
      const offerClicksByType = offerClicks.reduce((acc, event) => {
        const offerType = event.event_data?.offer_type;
        if (offerType) {
          acc[offerType] = (acc[offerType] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const offerClickRates = {
        '1-bottle': totalSessions > 0 ? ((offerClicksByType['1-bottle'] || 0) / totalSessions) * 100 : 0,
        '3-bottle': totalSessions > 0 ? ((offerClicksByType['3-bottle'] || 0) / totalSessions) * 100 : 0,
        '6-bottle': totalSessions > 0 ? ((offerClicksByType['6-bottle'] || 0) / totalSessions) * 100 : 0,
      };

      // Calculate average time on page
      const pageExitEvents = allEvents.filter(event => 
        event.event_type === 'page_exit' && event.event_data?.time_on_page_ms
      );
      const totalTimeOnPage = pageExitEvents.reduce((sum, event) => 
        sum + (event.event_data.time_on_page_ms || 0), 0
      );
      const averageTimeOnPage = pageExitEvents.length > 0 ? 
        totalTimeOnPage / pageExitEvents.length / 1000 : 0; // Convert to seconds

      // Get recent sessions for the table with enhanced data
      const recentSessions = sessions.slice(0, 10).map(session => {
        const pageEnter = session.find(e => e.event_type === 'page_enter');
        const videoPlay = session.find(e => e.event_type === 'video_play');
        const leadReached = session.find(e => 
          e.event_type === 'video_progress' && 
          (e.event_data?.current_time >= 465 || e.event_data?.milestone === 'lead_reached')
        );
        const pitchReached = session.find(e => 
          e.event_type === 'video_progress' && 
          (e.event_data?.current_time >= 2155 || e.event_data?.milestone === 'pitch_reached')
        );
        const offerClick = session.find(e => e.event_type === 'offer_click');
        const pageExit = session.find(e => e.event_type === 'page_exit');

        const sessionEvent = session[0];

        return {
          sessionId: session[0].session_id,
          timestamp: pageEnter?.created_at,
          country: sessionEvent.country_name || sessionEvent.event_data?.country || 'Unknown',
          countryCode: sessionEvent.country_code || 'XX',
          city: sessionEvent.city || 'Unknown',
          ip: sessionEvent.ip || 'Unknown',
          playedVideo: !!videoPlay,
          reachedLead: !!leadReached,
          reachedPitch: !!pitchReached,
          clickedOffer: offerClick?.event_data?.offer_type || null,
          timeOnPage: pageExit?.event_data?.time_on_page_ms ? 
            Math.round(pageExit.event_data.time_on_page_ms / 1000) : null,
          isLive: liveSessionsData.some(liveSession => 
            liveSession.sessionId === session[0].session_id
          ),
        };
      });

      setAnalytics({
        totalSessions,
        videoPlayRate,
        pitchReachRate,
        leadReachRate,
        offerClickRates,
        averageTimeOnPage,
        totalOfferClicks,
        recentSessions,
        liveUsers,
        countryStats,
        topCountries,
        topCities,
        liveCountryBreakdown,
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics();
      
      // Set up real-time subscription for last_ping updates
      const subscription = supabase
        .channel('vsl_analytics_live_users')
        .on('postgres_changes', 
          { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'vsl_analytics',
            filter: 'last_ping=not.is.null'
          },
          () => {
            console.log('Live user ping detected, refreshing analytics...');
            fetchAnalytics();
          }
        )
        .on('postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'vsl_analytics'
          },
          () => {
            console.log('New session detected, refreshing analytics...');
            fetchAnalytics();
          }
        )
        .subscribe();

      // Auto-refresh every 10 seconds for live user count
      const interval = setInterval(fetchAnalytics, 10000);

      return () => {
        subscription.unsubscribe();
        clearInterval(interval);
      };
    }
  }, [isAuthenticated]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const maskIP = (ip: string) => {
    if (ip === 'Unknown') return ip;
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.***.**`;
    }
    return ip;
  };

  // Format live country breakdown for display
  const formatLiveCountryBreakdown = () => {
    if (analytics.liveCountryBreakdown.length === 0) return '';
    
    return analytics.liveCountryBreakdown
      .slice(0, 3) // Show top 3 countries
      .map(item => `${item.flag} ${item.count} ${item.countryCode}`)
      .join(' • ');
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Entre com suas credenciais para acessar</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="admin@magicbluedrops.com"
                required
                disabled={isLoggingIn}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="••••••••"
                required
                disabled={isLoggingIn}
              />
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm font-medium">{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar no Dashboard'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Acesso restrito apenas para administradores autorizados
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading screen while fetching analytics
  if (loading && analytics.totalSessions === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  // Main dashboard content (authenticated)
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard VSL Analytics
              </h1>
              <p className="text-gray-600">
                Monitoramento em tempo real da performance da sua VSL
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                <Calendar className="w-4 h-4 inline mr-1" />
                Última atualização: {formatDate(lastUpdated.toISOString())}
              </div>
              <button
                onClick={fetchAnalytics}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('tracking')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tracking'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="w-4 h-4 inline mr-2" />
                Tracking & Pixels
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'analytics' ? (
          <>
            {/* Live Users Highlight */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      <h2 className="text-2xl font-bold">
                        👤 {analytics.liveUsers} usuários ativos agora
                      </h2>
                    </div>
                    {analytics.liveCountryBreakdown.length > 0 && (
                      <p className="text-green-100 text-lg">
                        🌎 {formatLiveCountryBreakdown()}
                      </p>
                    )}
                  </div>
                  <div className="bg-white/20 p-4 rounded-xl">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Conversion Funnel */}
            <div className="mb-8">
              <ConversionFunnel />
            </div>

            {/* Conversion Heatmap */}
            <div className="mb-8">
              <ConversionHeatmap />
            </div>

            {/* Sales Chart */}
            <div className="mb-8">
              <SalesChart />
            </div>

            {/* Live Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* Live Users */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Usuários Online</p>
                    <p className="text-3xl font-bold text-green-600">{analytics.liveUsers}</p>
                    <p className="text-xs text-gray-500">Últimos 2 minutos</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Countries Online */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Países Online</p>
                    <p className="text-3xl font-bold text-blue-600">{analytics.liveCountryBreakdown.length}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="space-y-2 max-h-20 overflow-y-auto">
                  {analytics.liveCountryBreakdown.slice(0, 3).map((item) => (
                    <div key={item.country} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <span>{item.flag}</span>
                        <span className="truncate">{item.country}</span>
                      </span>
                      <span className="font-semibold text-blue-600">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Countries */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Top Países</p>
                    <p className="text-3xl font-bold text-purple-600">{analytics.topCountries.length}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="space-y-2 max-h-20 overflow-y-auto">
                  {analytics.topCountries.slice(0, 3).map((item) => (
                    <div key={item.country} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <span>{item.flag}</span>
                        <span className="truncate">{item.country}</span>
                      </span>
                      <span className="font-semibold text-purple-600">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Sessions */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Sessões</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.totalSessions}</p>
                    <p className="text-xs text-gray-500">Desde o início</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Video Play Rate */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa de Play no Vídeo</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.videoPlayRate.toFixed(1)}%</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Play className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Lead Reach Rate */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa de Lead (7:45)</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.leadReachRate.toFixed(1)}%</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <UserCheck className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Pitch Reach Rate */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa de Pitch (35:55)</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.pitchReachRate.toFixed(1)}%</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Target className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              {/* Average Time on Page */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tempo Médio na Página</p>
                    <p className="text-3xl font-bold text-gray-900">{formatTime(analytics.averageTimeOnPage)}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Offer Click Rates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Offer Performance */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Performance das Ofertas
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">6 Frascos (Best Value)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(analytics.offerClickRates['6-bottle'], 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-12">
                        {analytics.offerClickRates['6-bottle'].toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">3 Frascos</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(analytics.offerClickRates['3-bottle'], 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-12">
                        {analytics.offerClickRates['3-bottle'].toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">1 Frasco</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(analytics.offerClickRates['1-bottle'], 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-12">
                        {analytics.offerClickRates['1-bottle'].toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Total de Cliques em Ofertas</span>
                    <span className="text-lg font-bold text-gray-900">{analytics.totalOfferClicks}</span>
                  </div>
                </div>
              </div>

              {/* Conversion Funnel */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Funil de Conversão
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Visitantes</span>
                    <span className="text-lg font-bold text-gray-900">{analytics.totalSessions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Assistiram Vídeo</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        {Math.round((analytics.videoPlayRate / 100) * analytics.totalSessions)}
                      </span>
                      <span className="text-sm text-gray-500">({analytics.videoPlayRate.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Viraram Lead (7:45)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        {Math.round((analytics.leadReachRate / 100) * analytics.totalSessions)}
                      </span>
                      <span className="text-sm text-gray-500">({analytics.leadReachRate.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Chegaram ao Pitch (35:55)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        {Math.round((analytics.pitchReachRate / 100) * analytics.totalSessions)}
                      </span>
                      <span className="text-sm text-gray-500">({analytics.pitchReachRate.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Clicaram em Ofertas</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">{analytics.totalOfferClicks}</span>
                      <span className="text-sm text-gray-500">
                        ({analytics.totalSessions > 0 ? ((analytics.totalOfferClicks / analytics.totalSessions) * 100).toFixed(1) : 0}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Sessions Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Sessões Recentes
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        País
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cidade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data/Hora
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vídeo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lead
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pitch
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Oferta
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tempo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analytics.recentSessions.map((session, index) => (
                      <tr key={session.sessionId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${session.isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                            <span className={`text-xs font-medium ${session.isLive ? 'text-green-600' : 'text-gray-500'}`}>
                              {session.isLive ? 'ONLINE' : 'OFFLINE'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <span>{getCountryFlag(session.countryCode, session.country)}</span>
                            <span className="truncate max-w-20">{session.country}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="truncate max-w-24">{session.city}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {maskIP(session.ip)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {session.timestamp ? formatDate(session.timestamp) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            session.playedVideo 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {session.playedVideo ? 'Sim' : 'Não'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            session.reachedLead 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {session.reachedLead ? 'Sim' : 'Não'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            session.reachedPitch 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {session.reachedPitch ? 'Sim' : 'Não'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {session.clickedOffer ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              {session.clickedOffer}
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {session.timeOnPage ? formatTime(session.timeOnPage) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <TrackingTestPanel />
        )}
      </div>
    </div>
  );
};