import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAnalytics } from '../hooks/useAnalytics';
import { AlertTriangle, CheckCircle, Shield, Truck, Clock, Zap } from 'lucide-react';

interface UpsellPageProps {
  variant: '1-bottle' | '3-bottle' | '6-bottle';
}

interface UpsellContent {
  warning: string;
  headline: string;
  subheadline: string;
  description: string[];
  truth: {
    title: string;
    content: string[];
  };
  upgrade: {
    title: string;
    benefits: string[];
  };
  acceptUrl: string;
  rejectUrl: string;
  productImage: string;
  savings: string;
  originalPrice: string;
  newPrice: string;
  installments: string;
  bottlesOffered: string;
  totalBottles: string;
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
        warning: '⚠️ HOLD ON!',
        headline: 'You\'re About To Waste Everything You Just Started…',
        subheadline: 'You just purchased 1 bottle of BlueDrops — and we\'re already preparing your shipment.',
        description: [
          'But I need to warn you:',
          '1 bottle is NOT enough to fix the deep-rooted damage that\'s been building in your body for years.',
          '👉 If you stop your treatment now, everything you achieve will be lost — and you may never recover again.'
        ],
        truth: {
          title: '💀 The Truth You Need To Hear:',
          content: [
            'BlueDrops is working to eliminate toxic blockages in your blood flow and hormone response.',
            'But this enemy is strong.',
            'It\'s been inside you for years.',
            'And unless you stay in the fight for 9 months, it WILL return.',
            '',
            'Most men who stop early report losing all results — and some say they could never get them back.'
          ]
        },
        upgrade: {
          title: '🎯 That\'s Why You MUST Upgrade Now',
          benefits: [
            '✅ 9-Month Supply',
            '✅ Save up to $500',
            '✅ All bottles shipped together — no extra cost',
            '✅ 180-Day Risk-Free Guarantee'
          ]
        },
        acceptUrl: 'https://pagamento.paybluedrops.com/ex-ocu/next-offer/mWYd5nGjgx?accepted=yes',
        rejectUrl: 'https://pagamento.paybluedrops.com/ex-ocu/next-offer/mWYd5nGjgx?accepted=no',
        productImage: 'https://i.imgur.com/hsfqxVP.png',
        savings: 'SAVE $500',
        originalPrice: '$712.00',
        newPrice: '$212.00',
        installments: '12x $17.67',
        bottlesOffered: '+8 BOTTLES',
        totalBottles: '9 BOTTLES TOTAL',
        acceptButtonText: 'YES — I WANT TO COMPLETE MY TREATMENT',
        rejectButtonText: 'No thanks — I\'ll risk losing everything'
      },
      '3-bottle': {
        warning: '⚠️ WARNING:',
        headline: 'You\'re Not Done Yet',
        subheadline: 'You just ordered 3 bottles of BlueDrops — that\'s a great step... But it\'s still not enough to reach permanent, long-term results.',
        description: [
          'According to our clinical observations, you need 9 full months of treatment to fully eliminate the root cause of your problem.',
          '',
          'Stopping before that point?',
          'That\'s how men lose their progress, and sometimes can\'t get it back — even with more product.'
        ],
        truth: {
          title: '💧 Think About It:',
          content: [
            'Your body is in the middle of a battle.',
            'The drops you\'re taking are pushing back the toxins and improving blood flow.',
            '',
            'But if you stop before month 9...',
            'The bad cells return.',
            'Stronger, smarter, and more resistant.',
            'And that\'s when treatment may fail for good.'
          ]
        },
        upgrade: {
          title: '💥 Upgrade Now To Lock In Full Recovery',
          benefits: [
            '✅ No added shipping',
            '✅ Deep discount',
            '✅ Guaranteed supply while stocks last',
            '✅ 180-Day Risk-Free Guarantee'
          ]
        },
        acceptUrl: 'https://pagamento.paybluedrops.com/ex-ocu/next-offer/qJjMdRwYNl?accepted=yes',
        rejectUrl: 'https://pagamento.paybluedrops.com/ex-ocu/next-offer/qJjMdRwYNl?accepted=no',
        productImage: 'https://i.imgur.com/hsfqxVP.png',
        savings: 'SAVE $300',
        originalPrice: '$474.00',
        newPrice: '$174.00',
        installments: '12x $14.50',
        bottlesOffered: '+6 BOTTLES',
        totalBottles: '9 BOTTLES TOTAL',
        acceptButtonText: 'YES — UPGRADE TO 9-MONTH TREATMENT',
        rejectButtonText: 'No thanks — I\'ll take the risk'
      },
      '6-bottle': {
        warning: '🧠 You\'re 80% There...',
        headline: 'But 80% Is NOT Enough',
        subheadline: 'You made the smart decision of getting 6 bottles of BlueDrops. But let\'s be honest — if you stop there, you\'re leaving yourself exposed.',
        description: [
          'Our data shows the minimum effective cycle is 9 months.',
          'That\'s how long it takes to build a permanent defense inside your body — so the problem never comes back.'
        ],
        truth: {
          title: '❌ Stop Now And You Might Regret It',
          content: [
            'The worst thing that can happen?',
            'Your body begins to change... and then you cut it short.',
            '',
            'Your results vanish.',
            'And next time, the treatment might not work anymore.',
            '',
            'Don\'t stop 3 steps before the finish line.'
          ]
        },
        upgrade: {
          title: '🔒 Complete Your Journey — Just 3 More Bottles',
          benefits: [
            '✅ Full 9-Month Protocol',
            '✅ Same discount per bottle',
            '✅ Delivered together, no extra shipping',
            '✅ 180-Day Risk-Free Guarantee'
          ]
        },
        acceptUrl: 'https://pagamento.paybluedrops.com/ex-ocu/next-offer/46jLdobjp3?accepted=yes',
        rejectUrl: 'https://pagamento.paybluedrops.com/ex-ocu/next-offer/46jLdobjp3?accepted=no',
        productImage: 'https://i.imgur.com/hsfqxVP.png',
        savings: 'SAVE $150',
        originalPrice: '$237.00',
        newPrice: '$87.00',
        installments: '12x $7.25',
        bottlesOffered: '+3 BOTTLES',
        totalBottles: '9 BOTTLES TOTAL',
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
    <div className="min-h-screen bg-white">
      {/* Header - Red Banner */}
      <div className="bg-red-600 text-white text-center py-3 px-4">
        <h1 className="text-lg sm:text-xl font-bold tracking-wide">
          YOUR PURCHASE IS NOT FINALIZED YET
        </h1>
      </div>

      {/* Pink Section */}
      <div className="bg-pink-400 text-center py-4 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          WE'RE ALMOST THERE...
        </h2>
        <p className="text-white text-sm sm:text-base max-w-4xl mx-auto leading-relaxed">
          YOUR ORDER IS CONFIRMED AND BEING PREPARED FOR SHIPMENT TO YOUR ADDRESS, BUT 
          BEFORE THAT I HAVE GREAT NEWS FOR YOU, YOU'VE BEEN SELECTED!
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Product Image */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Purple background with discount */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-sm font-bold">
                  33% DISCOUNT
                </div>
                
                {/* Product Image */}
                <div className="flex justify-center mb-6">
                  <img 
                    src={content.productImage}
                    alt="BlueDrops Upsell Package"
                    className="w-64 h-auto object-contain drop-shadow-2xl"
                  />
                </div>

                {/* Price Badge */}
                <div className="text-center">
                  <div className="bg-red-600 text-white px-4 py-2 rounded-lg inline-block mb-2">
                    <span className="text-sm">from </span>
                    <span className="line-through text-lg">{content.originalPrice}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-white text-sm">FOR </span>
                    <span className="text-yellow-300 text-4xl font-bold">
                      {content.newPrice}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Offer Details */}
          <div className="space-y-6">
            
            {/* Discount Box */}
            <div className="border-2 border-gray-300 rounded-lg p-6 text-center bg-white shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                YOU JUST WON
              </h3>
              <div className="text-2xl font-bold text-gray-800 mb-2">
                33% DISCOUNT TO
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-4">
                BUY {content.bottlesOffered}!
              </div>
              
              <div className="bg-pink-500 text-white px-4 py-2 rounded-lg inline-block mb-4">
                <span className="text-lg font-bold">
                  GET {content.bottlesOffered} FOR{' '}
                  <span className="bg-pink-600 px-2 py-1 rounded">HALF</span> THE PRICE.
                </span>
              </div>

              <div className="text-gray-700 mb-4">
                <div className="text-lg">
                  From <span className="line-through text-red-600">{content.originalPrice}</span> for only
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {content.installments}
                </div>
                <div className="text-gray-600">
                  or, {content.newPrice} cash
                </div>
              </div>

              {/* Accept Button */}
              <button
                onClick={handleAccept}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-6 rounded-lg text-lg transition-colors mb-4 border-2 border-gray-400 shadow-lg transform hover:scale-105 active:scale-95"
              >
                YES, I WANT THIS PROMOTION
              </button>
            </div>

            {/* Warning Message */}
            <div className="text-center bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-red-600 font-semibold text-sm">
                <span className="font-bold">Important Notice:</span> This is your only chance to get {content.bottlesOffered.toLowerCase()} at this 
                price. You won't have another opportunity!
              </p>
            </div>
          </div>
        </div>

        {/* Warning Section - More Impactful Layout */}
        <div className="mt-12 max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-8 border-red-500 p-8 rounded-lg shadow-lg">
            <div className="flex items-start">
              <div className="bg-red-500 p-3 rounded-full mr-6 flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-black text-red-800 mb-4 leading-tight">
                  {content.warning}
                </h3>
                <h4 className="text-2xl font-bold text-red-700 mb-4">
                  {content.headline}
                </h4>
                <p className="text-lg text-red-700 mb-6 font-medium">
                  {content.subheadline}
                </p>
                
                <div className="space-y-3 mb-8">
                  {content.description.map((desc, index) => (
                    <p key={index} className="text-red-700 text-lg leading-relaxed">
                      {desc}
                    </p>
                  ))}
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 mb-8 border border-red-200">
                  <h4 className="font-black text-red-800 mb-4 text-xl flex items-center">
                    <Zap className="w-6 h-6 mr-2" />
                    {content.truth.title}
                  </h4>
                  <div className="space-y-3">
                    {content.truth.content.map((item, index) => (
                      <p key={index} className={`text-red-700 ${item === '' ? 'h-2' : 'text-lg leading-relaxed'}`}>
                        {item}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
                  <h4 className="font-black text-blue-800 mb-4 text-xl flex items-center">
                    <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
                    {content.upgrade.title}
                  </h4>
                  <p className="text-blue-700 mb-4 text-lg">
                    We're giving you a final, one-time offer to complete the full 9-month protocol — by adding {content.bottlesOffered.toLowerCase()} at the lowest price ever.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {content.upgrade.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center text-blue-700 bg-white/50 p-3 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                        <span className="font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - More Prominent */}
        <div className="mt-12 max-w-2xl mx-auto space-y-6">
          <button
            onClick={handleAccept}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-black py-6 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl border-4 border-white/50"
          >
            🟨 {content.acceptButtonText}
          </button>
          
          <button
            onClick={handleReject}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-4 px-6 rounded-xl transition-colors border border-gray-300 text-lg"
          >
            ❌ {content.rejectButtonText}
          </button>
        </div>

        {/* Benefits Icons - Enhanced */}
        <div className="mt-12 bg-gray-50 rounded-2xl p-8">
          <h3 className="text-center text-xl font-bold text-gray-800 mb-6">
            Your Purchase Is Protected By:
          </h3>
          <div className="flex justify-center items-center gap-12 flex-wrap">
            <div className="flex flex-col items-center gap-3 text-gray-600">
              <div className="bg-green-100 p-4 rounded-full">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <span className="text-sm font-bold text-center">180-Day<br />Guarantee</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-gray-600">
              <div className="bg-blue-100 p-4 rounded-full">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <span className="text-sm font-bold text-center">Free<br />Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-gray-600">
              <div className="bg-purple-100 p-4 rounded-full">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <span className="text-sm font-bold text-center">Limited Time<br />Offer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};