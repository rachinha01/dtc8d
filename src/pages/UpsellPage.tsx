import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAnalytics } from '../hooks/useAnalytics';
import { AlertTriangle, CheckCircle, Shield, Truck, Clock, Zap, Star, Gift, XCircle, Target } from 'lucide-react';

interface UpsellPageProps {
  variant: '1-bottle' | '3-bottle' | '6-bottle';
}

interface UpsellContent {
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
        offer: {
          title: 'COMPLETE 9-MONTH TREATMENT',
          subtitle: 'Add 5 More Bottles + Get 4 Extra Bottles FREE',
          description: 'All at our lowest price ever...'
        },
        pricing: {
          pricePerBottle: 'Only $39 per bottle',
          totalPrice: 'That\'s a total of 9 bottles (270 days) for just $195',
          savings: 'Save up to $585 compared to the regular price ($89/bottle)',
          freeBottles: '4 FREE',
          paidBottles: '5 PAID'
        },
        acceptUrl: 'https://pagamento.paybluedrops.com/ex-ocu/next-offer/mWYd5nGjgx?accepted=yes',
        rejectUrl: 'https://pagamento.paybluedrops.com/ex-ocu/next-offer/mWYd5nGjgx?accepted=no',
        productImage: 'https://i.imgur.com/hsfqxVP.png',
        acceptButtonText: 'YES — COMPLETE MY 9-MONTH TREATMENT',
        rejectButtonText: 'No thanks — I\'ll risk losing everything'
      },
      '3-bottle': {
        offer: {
          title: 'UPGRADE TO 9-MONTH TREATMENT',
          subtitle: 'Add 3 More Bottles + Get 3 Extra Bottles FREE',
          description: 'Complete your transformation with the full protocol'
        },
        pricing: {
          pricePerBottle: 'Only $59 per bottle',
          totalPrice: 'Total of 9 bottles for $177',
          savings: 'You get 3 FREE bottles with zero shipping fees',
          freeBottles: '3 FREE',
          paidBottles: '3 PAID'
        },
        acceptUrl: 'https://pagamento.paybluedrops.com/ex-ocu/next-offer/qJjMdRwYNl?accepted=yes',
        rejectUrl: 'https://pagamento.paybluedrops.com/ex-ocu/next-offer/qJjMdRwYNl?accepted=no',
        productImage: 'https://i.imgur.com/hsfqxVP.png',
        acceptButtonText: 'YES — UPGRADE TO 9-MONTH TREATMENT',
        rejectButtonText: 'No thanks — I\'ll take the risk'
      },
      '6-bottle': {
        offer: {
          title: 'COMPLETE YOUR JOURNEY',
          subtitle: 'Add 1 More Bottle + Get 2 Extra Bottles FREE',
          description: 'Just 3 more bottles to ensure complete, permanent results'
        },
        pricing: {
          pricePerBottle: 'Only $39 per bottle',
          totalPrice: 'Total: 3 bonus bottles added to your order — no extra shipping',
          savings: 'Maximum cellular impact guaranteed',
          freeBottles: '2 FREE',
          paidBottles: '1 PAID'
        },
        acceptUrl: 'https://pagamento.paybluedrops.com/ex-ocu/next-offer/46jLdobjp3?accepted=yes',
        rejectUrl: 'https://pagamento.paybluedrops.com/ex-ocu/next-offer/46jLdobjp3?accepted=no',
        productImage: 'https://i.imgur.com/hsfqxVP.png',
        acceptButtonText: 'YES — GIVE ME 3 MORE TO FINISH STRONG',
        rejectButtonText: 'No thanks — I\'ll stop before it\'s complete'
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
    window.location.href = url;
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
      <div className="relative bg-gradient-to-r from-red-600 to-red-700 text-white text-center py-4 px-4 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 animate-pulse"></div>
        <div className="relative">
          <div className="flex items-center justify-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 animate-bounce" />
            <h1 className="text-xl sm:text-2xl font-black tracking-wide">
              ⚠️ WAIT! YOUR ORDER IS NOT COMPLETE
            </h1>
            <AlertTriangle className="w-6 h-6 animate-bounce" />
          </div>
          <p className="text-sm font-bold opacity-90">
            ⏳ You're Just ONE Step Away From Changing Your Life — Forever.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Opening Message */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-700/50 to-blue-600/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/30">
            <p className="text-xl text-blue-100 font-medium leading-relaxed">
              Congratulations on securing your first bottles of BlueDrops — but I need your attention right now.
            </p>
          </div>
        </div>

        {/* Warning Section */}
        <div className="bg-gradient-to-r from-red-600/30 to-red-700/30 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-red-400/30 shadow-2xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-red-600 px-6 py-3 rounded-full mb-6 shadow-lg">
              <XCircle className="w-6 h-6 text-white" />
              <span className="text-xl font-black text-white">CRITICAL WARNING</span>
              <XCircle className="w-6 h-6 text-white" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 leading-tight">
              If you skip this step, you might be wasting your entire investment.
            </h2>
            
            <p className="text-xl text-red-100 font-bold mb-4">
              Yes, I'm serious.
            </p>
            
            <p className="text-lg text-white leading-relaxed">
              Because stopping this treatment too early will erase ALL your progress — and can even make your condition worse than before.
            </p>
          </div>
        </div>

        {/* The Truth Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Left Side - The Truth */}
          <div className="bg-gradient-to-br from-blue-600/30 to-purple-600/30 backdrop-blur-xl rounded-2xl p-8 border border-blue-400/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-500 p-3 rounded-full">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-blue-300">💧 Here's the Truth:</h3>
            </div>
            
            <div className="space-y-4 text-white leading-relaxed">
              <p>
                BlueDrops is a liquid formula designed to remove the toxins that disrupt blood flow and performance.
              </p>
              <p>
                From the moment you take your first drops, your body begins a slow battle — fighting against the damage caused by years of poor circulation, stress, and hormonal imbalance.
              </p>
              <p className="font-bold text-yellow-300">
                But here's the problem...
              </p>
            </div>
          </div>

          {/* Right Side - The Problem */}
          <div className="bg-gradient-to-br from-red-600/30 to-orange-600/30 backdrop-blur-xl rounded-2xl p-8 border border-red-400/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-500 p-3 rounded-full">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-red-300">🧠 The Enemy Fights Back:</h3>
            </div>
            
            <div className="space-y-4 text-white leading-relaxed">
              <p className="font-bold">
                These toxins are deeply rooted in your body. And they don't go down without a fight.
              </p>
              <p>They resist. They hide. They rebuild.</p>
              <p className="text-red-200">
                And if you stop the treatment too soon — before they're completely eliminated — they'll come back stronger.
              </p>
            </div>
          </div>
        </div>

        {/* Consequences Section */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-gray-600/30 shadow-2xl">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-black text-red-400 mb-4">
              ❌ If You Don't Complete 9 Months of Treatment…
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-red-500/20 rounded-xl border border-red-400/30">
              <div className="text-4xl mb-3">💔</div>
              <p className="text-red-200 font-bold">Your blood flow will weaken again</p>
            </div>
            <div className="text-center p-4 bg-red-500/20 rounded-xl border border-red-400/30">
              <div className="text-4xl mb-3">📉</div>
              <p className="text-red-200 font-bold">Your confidence and energy will drop</p>
            </div>
            <div className="text-center p-4 bg-red-500/20 rounded-xl border border-red-400/30">
              <div className="text-4xl mb-3">🚫</div>
              <p className="text-red-200 font-bold">Your body becomes immune to further treatment</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-500/30">
              <p className="text-white text-lg leading-relaxed italic">
                "It's like sending your army into battle, winning the war... And then suddenly pulling them out, letting the enemy regroup and conquer your body again."
              </p>
              <p className="text-red-300 font-bold mt-4">
                You'll lose everything you gained — and worse — you may not be able to recover again.
              </p>
            </div>
          </div>
        </div>

        {/* Solution Section */}
        <div className="bg-gradient-to-r from-green-600/30 to-emerald-600/30 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-green-400/30 shadow-2xl">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-black text-green-300 mb-4">
              ✅ That's Why 9 Months of BlueDrops is NON‑NEGOTIABLE
            </h3>
          </div>
          
          <div className="space-y-4 text-white leading-relaxed text-center">
            <p className="text-lg">
              Only after 9 months of consistent use will your body create a strong defensive wall — a new, healthier internal state where those performance-killing toxins can never return.
            </p>
            
            <div className="bg-green-500/20 rounded-xl p-6 border border-green-400/30">
              <p className="text-green-200 font-bold text-xl mb-4">Once that happens...</p>
              <p className="text-white text-lg">You'll NEVER need another product again.</p>
            </div>
            
            <div className="bg-red-500/20 rounded-xl p-6 border border-red-400/30">
              <p className="text-red-200 font-bold text-xl mb-4">But if you stop early…</p>
              <div className="space-y-2">
                <p className="text-white">You'll fall back.</p>
                <p className="text-red-300 font-bold">And this time, you might not be able to stand up again.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final Offer Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Left Side - Product */}
          <div className="relative">
            <div className="bg-gradient-to-br from-yellow-500/30 to-orange-500/30 backdrop-blur-xl rounded-3xl p-8 border border-yellow-400/30 shadow-2xl">
              
              {/* Final Chance Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full font-black text-sm shadow-lg animate-pulse">
                  🎁 FINAL CHANCE
                </div>
              </div>

              {/* Product Image */}
              <div className="text-center mb-6 mt-4">
                <img 
                  src={content.productImage}
                  alt="BlueDrops Complete Treatment"
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
                
                {/* Pricing */}
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

          {/* Right Side - Action */}
          <div className="space-y-6">
            
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
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-2xl blur opacity-75 animate-pulse"></div>
                <button
                  onClick={handleAccept}
                  className="relative w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black py-6 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl border-2 border-white/20"
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
            <div className="flex justify-center items-center gap-6 flex-wrap pt-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="bg-green-500/20 p-3 rounded-full border border-green-400/30">
                  <Shield className="w-6 h-6 text-green-300" />
                </div>
                <span className="text-xs font-bold text-green-300">180-Day<br />Guarantee</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="bg-blue-500/20 p-3 rounded-full border border-blue-400/30">
                  <Truck className="w-6 h-6 text-blue-300" />
                </div>
                <span className="text-xs font-bold text-blue-300">Free<br />Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="bg-red-500/20 p-3 rounded-full border border-red-400/30">
                  <Clock className="w-6 h-6 text-red-300" />
                </div>
                <span className="text-xs font-bold text-red-300">Final<br />Chance</span>
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
            🔴 Once this page closes, this offer disappears forever.
          </span>
          <AlertTriangle className="w-5 h-5 animate-bounce" />
        </div>
      </div>
    </div>
  );
};