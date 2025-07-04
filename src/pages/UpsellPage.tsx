import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAnalytics } from '../hooks/useAnalytics';
import { AlertTriangle, CheckCircle, Shield, Truck, Clock, Star, X } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 overflow-x-hidden">
      {/* Main container - Same as main page */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-6 sm:py-8 max-w-full">
        
        {/* Header - Same style as main page */}
        <header className="mb-6 sm:mb-8 animate-fadeInDown animation-delay-200">
          <img 
            src="https://i.imgur.com/QJxTIcN.png" 
            alt="Blue Drops Logo"
            className="h-8 w-auto"
          />
        </header>

        {/* Main Content Container - Same max-width as main page */}
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
          
          {/* Urgent Warning Header - Same style as hero section */}
          <div className="mb-6 text-center w-full animate-fadeInUp animation-delay-400">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full mb-4 shadow-lg">
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-black text-sm tracking-wide">⚠️ WAIT! YOUR ORDER IS NOT COMPLETE</span>
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[0.85] mb-3 px-2">
              <span className="text-blue-900 block mb-0.5">You're Just ONE Step</span>
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent block">
                Away From Success
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-blue-800 mb-2 font-semibold px-2">
              Congratulations on securing your first bottles — but{' '}
              <span className="text-red-600 font-bold">I need your attention right now</span>
            </p>
          </div>

          {/* Warning Message - Same card style as main page */}
          <div className="w-full mb-6 animate-fadeInUp animation-delay-600">
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-red-200 shadow-lg">
              <div className="text-center">
                <div className="bg-red-500 text-white px-4 py-2 rounded-full inline-block mb-4">
                  <span className="font-bold text-sm">CRITICAL WARNING</span>
                </div>
                
                <h2 className="text-xl sm:text-2xl font-bold text-red-700 mb-3 leading-tight">
                  If you skip this step, you might be wasting your entire investment.
                </h2>
                
                <p className="text-red-600 font-bold mb-2">Yes, I'm serious.</p>
                
                <p className="text-blue-800 text-sm leading-relaxed">
                  Because stopping this treatment too early will erase ALL your progress — and can even make your condition worse than before.
                </p>
              </div>
            </div>
          </div>

          {/* The Truth Section - Same card style */}
          <div className="w-full mb-6 animate-fadeInUp animation-delay-800">
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-blue-200 shadow-lg">
              <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                💧 Here's the Truth:
              </h3>
              
              <div className="space-y-3 text-blue-800 text-sm leading-relaxed">
                <p>
                  BlueDrops is a liquid formula designed to remove the toxins that disrupt blood flow and performance.
                </p>
                <p>
                  From the moment you take your first drops, your body begins a slow battle — fighting against the damage caused by years of poor circulation, stress, and hormonal imbalance.
                </p>
                <p className="font-bold text-red-600">
                  But here's the problem...
                </p>
                <p className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <strong className="text-red-700">🧠 These toxins are deeply rooted in your body.</strong> And they don't go down without a fight. They resist. They hide. They rebuild.
                </p>
              </div>
            </div>
          </div>

          {/* Consequences Section */}
          <div className="w-full mb-6 animate-fadeInUp animation-delay-1000">
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-red-200 shadow-lg">
              <h3 className="text-lg font-bold text-red-700 mb-4 text-center">
                ❌ If You Don't Complete 9 Months of Treatment…
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-red-600">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>Your blood flow will weaken again</span>
                </div>
                <div className="flex items-center gap-2 text-red-600">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>Your confidence and energy will drop</span>
                </div>
                <div className="flex items-center gap-2 text-red-600">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>Your body becomes immune to further treatment</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-200">
                <p className="text-blue-800 text-sm italic text-center">
                  "It's like sending your army into battle, winning the war... And then suddenly pulling them out, letting the enemy regroup and conquer your body again."
                </p>
              </div>
            </div>
          </div>

          {/* Solution Section */}
          <div className="w-full mb-6 animate-fadeInUp animation-delay-1200">
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-green-200 shadow-lg">
              <h3 className="text-lg font-bold text-green-700 mb-3 text-center">
                ✅ That's Why 9 Months of BlueDrops is NON‑NEGOTIABLE
              </h3>
              
              <div className="space-y-3 text-blue-800 text-sm leading-relaxed">
                <p>
                  Only after 9 months of consistent use will your body create a strong defensive wall — a new, healthier internal state where those performance-killing toxins can never return.
                </p>
                
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-green-700 font-bold text-center">Once that happens...</p>
                  <p className="text-green-600 text-center">You'll NEVER need another product again.</p>
                </div>
                
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <p className="text-red-700 font-bold text-center">But if you stop early…</p>
                  <p className="text-red-600 text-center">You might not be able to stand up again.</p>
                </div>
              </div>
            </div>
          </div>

          {/* FINAL OFFER - Same product style as main page */}
          <div className="w-full mb-6 relative animate-fadeInUp animation-delay-1400">
            {/* FINAL CHANCE Tag - Same style as BEST VALUE */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
              <div className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base font-black shadow-lg border-2 border-white/40 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 sm:w-5 h-4 sm:h-5 text-white fill-current" />
                  <span className="tracking-wide">🎁 FINAL CHANCE</span>
                </div>
              </div>
            </div>

            {/* Container with glow - Same as main page */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-3xl blur-lg opacity-60 animate-pulse"></div>
              
              <div className="relative bg-gradient-to-br from-blue-600/95 to-blue-800/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 pt-8 sm:pt-10 border-2 border-white/30 shadow-2xl">
                <div className="absolute inset-0 rounded-3xl border border-white/20 pointer-events-none"></div>
                
                {/* Product Image - Same style */}
                <div className="flex justify-center mb-3 px-2">
                  <img 
                    src={content.productImage} 
                    alt="BlueDrops Complete Treatment"
                    className="w-full h-auto object-contain drop-shadow-2xl max-h-48 sm:max-h-56 md:max-h-64 lg:max-h-72"
                  />
                </div>

                {/* Product Name - Same style */}
                <div className="text-center mb-4 sm:mb-5">
                  <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-none px-2">
                    BLUEDROPS
                  </h3>
                  <p className="text-white/80 text-base sm:text-lg md:text-xl font-bold tracking-wide -mt-1">
                    {content.offer.title}
                  </p>
                </div>

                {/* Offer Details */}
                <div className="text-center mb-4">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm sm:text-base shadow-lg mb-3">
                    {content.offer.subtitle}
                  </div>
                  
                  {/* Pricing - Same style as main page */}
                  <div className="space-y-2 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-4">
                    <div className="text-yellow-400 text-lg font-bold">
                      💰 {content.pricing.pricePerBottle}
                    </div>
                    <div className="text-white text-sm">
                      📦 {content.pricing.totalPrice}
                    </div>
                    <div className="text-green-300 text-sm font-bold">
                      💸 {content.pricing.savings}
                    </div>
                  </div>
                </div>

                {/* CTA Button - Same style as main page */}
                <div className="relative mb-2">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 rounded-xl blur opacity-75 animate-pulse"></div>
                  <button 
                    onClick={handleAccept}
                    className="relative w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-4 sm:py-5 px-4 sm:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg text-lg sm:text-xl border-2 border-white/40 backdrop-blur-sm overflow-hidden"
                  >
                    <div className="absolute inset-0 rounded-xl border border-white/30 pointer-events-none"></div>
                    <span className="relative z-10">{content.acceptButtonText}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>

                {/* Benefits - Same style as main page */}
                <div className="flex justify-center items-center gap-0.5 sm:gap-1 mb-2 px-1">
                  <div className="bg-gradient-to-r from-blue-500/30 to-cyan-500/30 backdrop-blur-sm rounded-md px-1 sm:px-1.5 py-1 sm:py-1.5 border border-blue-300/40 flex-1">
                    <div className="flex items-center justify-center gap-0.5 text-xs text-white">
                      <Shield className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-400 flex-shrink-0" />
                      <span className="text-center font-semibold text-xs">180-Day</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500/30 to-cyan-500/30 backdrop-blur-sm rounded-md px-1 sm:px-1.5 py-1 sm:py-1.5 border border-blue-300/40 flex-1">
                    <div className="flex items-center justify-center gap-0.5 text-xs text-white">
                      <Truck className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-400 flex-shrink-0" />
                      <span className="text-center font-semibold text-xs">Free Ship</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500/30 to-cyan-500/30 backdrop-blur-sm rounded-md px-1 sm:px-1.5 py-1 sm:py-1.5 border border-blue-300/40 flex-1">
                    <div className="flex items-center justify-center gap-0.5 text-xs text-white">
                      <Clock className="w-3 sm:w-4 h-3 sm:h-4 text-red-400 flex-shrink-0" />
                      <span className="text-center font-semibold text-xs">Final</span>
                    </div>
                  </div>
                </div>

                {/* Box branco com imagem - Same as main page */}
                <div>
                  <div className="bg-white rounded-md p-1 shadow-sm">
                    <img 
                      src="https://i.imgur.com/1in1oo5.png" 
                      alt="Product Benefits"
                      className="w-full h-auto object-contain max-h-12 sm:max-h-14"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reject Button - Same style as secondary products */}
          <div className="w-full mb-6 animate-fadeInUp animation-delay-1600">
            <button 
              onClick={handleReject}
              className="w-full bg-gradient-to-br from-gray-400/80 to-gray-600/80 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl text-white hover:bg-gray-500/80 transition-all duration-300"
            >
              <span className="text-sm font-medium">❌ {content.rejectButtonText}</span>
            </button>
          </div>
        </div>

        {/* Footer - Same as main page */}
        <footer className="mt-8 sm:mt-12 text-center text-blue-700 w-full px-4 animate-fadeInUp animation-delay-2000">
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 max-w-xl mx-auto border border-blue-200">
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg inline-block mb-2">
              <span className="font-bold text-sm">🔴 FINAL WARNING</span>
            </div>
            <p className="text-sm font-bold text-red-600 mb-2">
              Once this page closes, this offer disappears forever.
            </p>
            <p className="text-xs opacity-70">
              This is your last chance to complete the 9-month protocol at this special price.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};