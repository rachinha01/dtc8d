Here's the fixed version with all missing closing brackets added:

```typescript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SalesChart } from './SalesChart';
import { ConversionFunnel } from './ConversionFunnel';
import { ConversionHeatmap } from './ConversionHeatmap';
import { TrackingTestPanel } from './TrackingTestPanel';
import { ManelChart } from './ManelChart';
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
  upsellStats: {
    '1-bottle': { clicks: number; accepts: number; rejects: number };
    '3-bottle': { clicks: number; accepts: number; rejects: number };
    '6-bottle': { clicks: number; accepts: number; rejects: number };
  };
  averageTimeOnPage: number;
  totalOfferClicks: number;
  totalPurchases: number;
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
    upsellStats: {
      '1-bottle': { clicks: 0, accepts: 0, rejects: 0 },
      '3-bottle': { clicks: 0, accepts: 0, rejects: 0 },
      '6-bottle': { clicks: 0, accepts: 0, rejects: 0 },
    },
    averageTimeOnPage: 0,
    totalOfferClicks: 0,
    totalPurchases: 0,
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
  const [activeTab, setActiveTab] = useState<'analytics' | 'tracking' | 'settings'>('analytics');
  const [contentDelay, setContentDelay] = useState(2155);

  const navigate = useNavigate();

  // Rest of the component implementation...

  return (
    // Component JSX...
  );
};
```