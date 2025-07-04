import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAnalytics } from '../hooks/useAnalytics';
import { AlertTriangle, CheckCircle, Shield, Truck, Clock } from 'lucide-react';

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
        originalPrice: 'R$ 712,00',
        newPrice: 'R$ 212,00',
        installments: '12x R$ 17,67',
        bottlesOffered: '+8 BOTTLES',
        totalBottles: '9 BOTTLES TOTAL'
      },
      '3-bottle': {
        warning: '⚠️ WARNING:',
        headline: 'You\'re Not Done Yet',
        subheadline: 'You just ordered 3 bottles of BlueDrops — that\'s a great step... But it\'s still not enough to reach permanent, long-term results.',
        description: [
          'According to our clinical observations, you need 9 full months of treatment to fully eliminate the root cause of your problem.',
          'Stopping before that point?',
          'That\'s how men lose their progress, and sometimes can\'t get it back — even with more product.'
        ],
        truth: {
          title: '💧 Think About It:',
          content: [
            'Your body is in the middle of a battle.',
            'The drops you\'re taking are pushing back the toxins and improving blood flow.',
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
        originalPrice: 'R$ 474,00',
        newPrice: 'R$ 174,00',
        installments: '12x R$ 14,50',
        bottlesOffered: '+6 BOTTLES',
        totalBottles: '9 BOTTLES TOTAL'
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
            'Your results vanish.',
            'And next time, the treatment might not work anymore.',
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
        originalPrice: 'R$ 237,00',
        newPrice: 'R$ 87,00',
        installments: '12x R$ 7,25',
        bottlesOffered: '+3 BOTTLES',
        totalBottles: '9 BOTTLES TOTAL'
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
          SUA COMPRA AINDA NÃO FOI FINALIZADA
        </h1>
      </div>

      {/* Pink Section */}
      <div className="bg-pink-400 text-center py-4 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          ESTAMOS QUASE LÁ...
        </h2>
        <p className="text-white text-sm sm:text-base max-w-4xl mx-auto leading-relaxed">
          SEU PEDIDO ESTÁ CONFIRMADO E EM PREPARAÇÃO PARA ENVIAR PARA SUA RESIDÊNCIA, MAS 
          ANTES TENHO UMA ÓTIMA NOTÍCIA PARA VOCÊ, VOCÊ FOI CONTEMPLADO!
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Product Image */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Purple background with discount */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-sm font-bold">
                  33% DE DESCONTO
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
                    <span className="text-sm">de </span>
                    <span className="line-through text-lg">{content.originalPrice}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-white text-sm">POR </span>
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
            <div className="border-2 border-gray-300 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                VOCÊ ACABA DE GANHAR
              </h3>
              <div className="text-2xl font-bold text-gray-800 mb-2">
                33% DE DESCONTO PARA
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-4">
                COMPRAR {content.bottlesOffered}!
              </div>
              
              <div className="bg-pink-500 text-white px-4 py-2 rounded-lg inline-block mb-4">
                <span className="text-lg font-bold">
                  SÃO {content.bottlesOffered} PELA{' '}
                  <span className="bg-pink-600 px-2 py-1 rounded">METADE</span> DO PREÇO.
                </span>
              </div>

              <div className="text-gray-700 mb-4">
                <div className="text-lg">
                  De <span className="line-through text-red-600">{content.originalPrice}</span> por apenas
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {content.installments}
                </div>
                <div className="text-gray-600">
                  ou, {content.newPrice} à vista
                </div>
              </div>

              {/* Accept Button */}
              <button
                onClick={handleAccept}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-6 rounded-lg text-lg transition-colors mb-4 border-2 border-gray-400"
              >
                SIM, EU QUERO ESSA PROMOÇÃO
              </button>
            </div>

            {/* Warning Message */}
            <div className="text-center">
              <p className="text-red-600 font-semibold text-sm">
                <span className="font-bold">Aviso Importante:</span> Esta é a sua única chance de garantir o {content.bottlesOffered.toUpperCase()} por este 
                preço. Você não terá outra oportunidade!
              </p>
            </div>
          </div>
        </div>

        {/* Warning Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-red-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-red-800 mb-3">
                  {content.warning} {content.headline}
                </h3>
                <p className="text-red-700 mb-4">
                  {content.subheadline}
                </p>
                
                <div className="space-y-2 mb-6">
                  {content.description.map((desc, index) => (
                    <p key={index} className="text-red-700">
                      {desc}
                    </p>
                  ))}
                </div>

                <div className="mb-6">
                  <h4 className="font-bold text-red-800 mb-3">
                    {content.truth.title}
                  </h4>
                  <div className="space-y-2">
                    {content.truth.content.map((item, index) => (
                      <p key={index} className="text-red-700">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-bold text-red-800 mb-3">
                    {content.upgrade.title}
                  </h4>
                  <p className="text-red-700 mb-3">
                    We're giving you a final, one-time offer to complete the full 9-month protocol — by adding {content.bottlesOffered.toLowerCase()} at the lowest price ever.
                  </p>
                  <div className="space-y-1">
                    {content.upgrade.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center text-red-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 max-w-2xl mx-auto space-y-4">
          <button
            onClick={handleAccept}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-6 rounded-xl text-lg transition-colors border-2 border-gray-400"
          >
            🟨 YES — I WANT TO COMPLETE MY TREATMENT
          </button>
          
          <button
            onClick={handleReject}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors border border-gray-300"
          >
            ❌ No thanks — I'll risk losing everything
          </button>
        </div>

        {/* Benefits Icons */}
        <div className="mt-8 flex justify-center items-center gap-8 flex-wrap">
          <div className="flex items-center gap-2 text-gray-600">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium">180-Day Guarantee</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Truck className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium">Free Shipping</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium">Limited Time Offer</span>
          </div>
        </div>
      </div>
    </div>
  );
};