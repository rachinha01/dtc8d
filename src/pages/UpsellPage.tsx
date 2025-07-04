import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAnalytics } from '../hooks/useAnalytics';
import { AlertTriangle, CheckCircle, Shield, Truck, Clock, Zap, Star, Gift } from 'lucide-react';

interface UpsellPageProps {
  variant: '1-bottle' | '3-bottle' | '6-bottle';
}

interface UpsellContent {
  warning: string;
  headline: string;
  subheadline: string;
  offer: {
    title: string;
    subtitle: string;
    description: string;
  };
  pricing: {
    pricePerBottle: string;
    totalPrice: string;
    savings: string;
    freeBottles: string;
    paidBottles: string;
  };
  remember: string;
  acceptUrl: string;
  rejectUrl: string;
  productImage: string;
  acceptButtonText: string;
  rejectButtonText: string;
}

export const UpsellPage: React.FC<UpsellPageProps> = ({ variant }) => {
  const [searchParams] = useSearchParams();
  const { trackOfferClick } = useAnalytics();
  const [cartParams, setCartParams] = useState<string>('');

  // Preserve CartPanda parameters
  useEffect(() => {
    const params = new URLSearchParams();
    
    // Common CartPanda parameters to preserve
    const cartPandaParams = [
      'order_id', 'customer_id', 'transaction_id', 'email', 'phone',
      'first_name', 'last_name', 'address', 'city', 'state', 'zip',
      'country', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term',
      'utm_content', 'fbclid', 'gclid', 'affiliate_id', 'sub_id'
    ];

    cartPandaParams.forEach(param => {
      const value = searchParams.get(param);
      if (value) {
        params.append(param, value);
      }
    });

    // Also preserve any other parameters that might be present
    searchParams.forEach((value, key) => {
      if (!cartPandaParams.includes(key)) {
        params.append(key, value);
      }
    });

    setCartParams(params.toString());
  }, [searchParams]);

  const getUpsellContent = (variant: string): UpsellContent => {
    const contents = {
      '1-bottle': {
        warning: 'WAIT! Don\'t Miss This VIP Opportunity',
        headline: 'As a VIP customer who just secured 1 bottle of BlueDrops, you\'re getting an exclusive one-time chance to claim the full 9-month treatment.',
        subheadline: 'Add 5 More Bottles to your order and Get 4 Extra Bottles FREE',
        offer: {
          title: 'VIP EXCLUSIVE OFFER',
          subtitle: '5 paid + 4 free = 9 bottles total',
          description: 'All at our lowest price ever...'
        },
        pricing: {
          pricePerBottle: 'Only $39 per bottle',
          totalPrice: 'That\'s a total of 9 bottles (270 days) for just $195',
          savings: 'Save up to $585 compared to the regular price ($89/bottle)',
          freeBottles: '4 FREE',
          paidBottles: '5 PAID'
        },
        remember: 'You buy 5 bottles at our deepest discount and get 4 FREE — a full 9-month supply to lock in permanent results.',
        acceptUrl: 'https://pagamento.paybluedrops.com/ex-ocu/next-offer/mWYd5nGjgx?accepted=yes',
        rejectUrl: 'https://pagamento.paybluedrops.com/ex-ocu/next-offer/mWYd5nGjgx?accepted=no',
        productImage: 'https://i.imgur.com/hsfqxVP.png',
        acceptButtonText: 'GET MY VIP DISCOUNT NOW',
        rejectButtonText: 'No thanks, I\'ll pass on this exclusive offer'
      },
      '3-bottle': {
        warning: 'You\'re halfway there. Let\'s finish the mission.',
        headline: 'As our VIP customer, we\'re giving you a final upgrade to complete your transformation.',
        subheadline: 'You purchased 3 bottles — now let\'s make it 9.',
        offer: {
          title: 'COMPLETE YOUR MISSION',
          subtitle: '3 paid + 3 free = 6 additional bottles',
          description: 'Add 3 More Bottles and Get 3 Extra Bottles FREE'
        },
        pricing: {
          pricePerBottle: 'Only $59 per bottle',
          totalPrice: 'Total of 9 bottles for $177',
          savings: 'You get 3 FREE bottles with zero shipping fees.',
          freeBottles: '3 FREE',
          paidBottles: '3 PAID'
        },
        remember: 'You pay for 3 bottles and we double it. A perfect 9-month supply to guarantee full results.',
        acceptUrl: 'https://pagamento.paybluedrops.com/ex-ocu/next-offer/qJjMdRwYNl?accepted=yes',
        rejectUrl: 'https://pagamento.paybluedrops.com/ex-ocu/next-offer/qJjMdRwYNl?accepted=no',
        productImage: 'https://i.imgur.com/hsfqxVP.png',
        acceptButtonText: 'COMPLETE MY TRANSFORMATION',
        rejectButtonText: 'No thanks, I\'ll stop halfway'
      },
      '6-bottle': {
        warning: 'You\'re almost done — just one step left.',
        headline: 'Since you\'ve already secured 6 bottles, you\'re closer than most.',
        subheadline: 'But if you want to ensure complete, permanent results, this is your final step.',
        offer: {
          title: 'FINAL STEP TO PERFECTION',
          subtitle: '1 paid + 2 free = 3 bonus bottles',
          description: 'Add 1 More Bottle and Get 2 Extra Bottles FREE'
        },
        pricing: {
          pricePerBottle: 'Only $39 per bottle',
          totalPrice: 'Total: 3 bonus bottles added to your order — no extra shipping.',
          savings: 'Maximum cellular impact guaranteed',
          freeBottles: '2 FREE',
          paidBottles: '1 PAID'
        },
        remember: 'This is your moment to go beyond average and secure the best possible outcome. A full 9-month supply with maximum cellular impact.',
        acceptUrl: 'https://pagamento.paybluedrops.com/ex-ocu/next-offer/46jLdobjp3?accepted=yes',
        rejectUrl: 'https://pagamento.paybluedrops.com/ex-ocu/next-offer/46jLdobjp3?accepted=no',
        productImage: 'https://i.imgur.com/hsfqxVP.png',
        acceptButtonText: 'SECURE MAXIMUM RESULTS',
        rejectButtonText: 'No thanks, I\'ll settle for average'
      }
    };

    return contents[variant as keyof typeof contents];
  };

  const content = getUpsellContent(variant);

  const handleAccept = () => {
    trackOfferClick(`upsell-${variant}-accept`);
    const url = cartParams ? `${content.acceptUrl}&${cartParams}` : content.acceptUrl;
    window.location.href = url;
  };

  const handleReject = () => {
    trackOfferClick(`upsell-${variant}-reject`);
    const url = cartParams ? `${content.rejectUrl}&${cartParams}` : content.rejectUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-cyan-400/10 rounded-full blur-xl animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-300/10 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Header - Urgent Banner */}
      <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-center py-4 px-4 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 to-orange-400/20 animate-pulse"></div>
        <div className="relative">
          <div className="flex items-center justify-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 animate-bounce" />
            <h1 className="text-xl sm:text-2xl font-black tracking-wide">
              VIP EXCLUSIVE OPPORTUNITY
            </h1>
            <AlertTriangle className="w-6 h-6 animate-bounce" />
          </div>
          <p className="text-sm font-bold opacity-90">
            Limited Time • VIP Customers Only • This Page Expires Soon
          </p>
        </div>
      </div>

      {/* Main Hero Section */}
      <div className="relative py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Warning Badge */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 rounded-full mb-8 shadow-2xl animate-pulse">
            <Zap className="w-6 h-6 text-yellow-300" />
            <span className="text-xl font-black text-white tracking-wide">
              {content.warning}
            </span>
            <Zap className="w-6 h-6 text-yellow-300" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
              {content.headline}
            </span>
          </h1>

          {/* Subheadline */}
          <div className="bg-gradient-to-r from-blue-700/50 to-blue-600/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-blue-400/30">
            <h2 className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-4">
              👉 {content.subheadline}
            </h2>
            <p className="text-xl text-blue-100 font-medium">
              {content.offer.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Product Showcase */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-blue-600/30 to-purple-600/30 backdrop-blur-xl rounded-3xl p-8 border border-blue-400/30 shadow-2xl">
              
              {/* VIP Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-black text-sm shadow-lg">
                  <Star className="w-4 h-4 inline mr-2" />
                  VIP EXCLUSIVE
                </div>
              </div>

              {/* Product Image */}
              <div className="text-center mb-8 mt-4">
                <img 
                  src={content.productImage}
                  alt="BlueDrops VIP Package"
                  className="w-80 h-auto mx-auto object-contain drop-shadow-2xl"
                />
              </div>

              {/* Offer Details */}
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-black text-yellow-300">
                  {content.offer.title}
                </h3>
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg">
                  {content.offer.subtitle}
                </div>
                
                {/* Pricing Breakdown */}
                <div className="space-y-3 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-yellow-300 text-xl font-bold">
                    💰 {content.pricing.pricePerBottle}
                  </div>
                  <div className="text-white text-lg">
                    📦 {content.pricing.totalPrice}
                  </div>
                  <div className="text-green-300 text-lg font-bold">
                    💸 {content.pricing.savings}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Call to Action */}
          <div className="space-y-8">
            
            {/* Remember Section */}
            <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 backdrop-blur-xl rounded-2xl p-8 border border-purple-400/30 shadow-2xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-yellow-400 p-3 rounded-full flex-shrink-0">
                  <Gift className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-yellow-300 mb-4">
                    🧠 REMEMBER:
                  </h3>
                  <p className="text-white text-lg leading-relaxed">
                    {content.remember}
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/30 text-center">
                <div className="text-3xl font-black text-green-300 mb-2">
                  {content.pricing.freeBottles}
                </div>
                <div className="text-white font-bold">BOTTLES FREE</div>
              </div>
              <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl p-4 border border-blue-400/30 text-center">
                <div className="text-3xl font-black text-blue-300 mb-2">
                  {content.pricing.paidBottles}
                </div>
                <div className="text-white font-bold">BOTTLES PAID</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              
              {/* Accept Button */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl blur opacity-75 animate-pulse"></div>
                <button
                  onClick={handleAccept}
                  className="relative w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-black py-6 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl border-2 border-white/20"
                >
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="w-6 h-6" />
                    <span>{content.acceptButtonText}</span>
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </button>
              </div>
              
              {/* Reject Button */}
              <button
                onClick={handleReject}
                className="w-full bg-gray-600/30 hover:bg-gray-600/50 text-gray-300 hover:text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 border border-gray-500/30 text-lg backdrop-blur-sm"
              >
                ❌ {content.rejectButtonText}
              </button>
            </div>

            {/* Guarantee Badges */}
            <div className="flex justify-center items-center gap-8 flex-wrap pt-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="bg-green-500/20 p-4 rounded-full border border-green-400/30">
                  <Shield className="w-8 h-8 text-green-300" />
                </div>
                <span className="text-sm font-bold text-green-300">180-Day<br />Guarantee</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="bg-blue-500/20 p-4 rounded-full border border-blue-400/30">
                  <Truck className="w-8 h-8 text-blue-300" />
                </div>
                <span className="text-sm font-bold text-blue-300">Free<br />Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="bg-purple-500/20 p-4 rounded-full border border-purple-400/30">
                  <Clock className="w-8 h-8 text-purple-300" />
                </div>
                <span className="text-sm font-bold text-purple-300">Limited Time<br />VIP Offer</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Urgency Bar */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white text-center py-4 px-4 shadow-2xl">
        <div className="flex items-center justify-center gap-3">
          <AlertTriangle className="w-5 h-5 animate-bounce" />
          <span className="font-bold text-lg">
            This VIP offer expires when you leave this page • Don't miss out!
          </span>
          <AlertTriangle className="w-5 h-5 animate-bounce" />
        </div>
      </div>
    </div>
  );
};