import React from 'react';
import { Play } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <div className="mb-6 text-center w-full animate-fadeInUp animation-delay-400">
      {/* ✅ SEO OTIMIZADO: H1 principal com palavras-chave virais */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[0.85] mb-3 px-2">
        <span className="text-blue-900 block mb-0.5">This "ED Trick" Has Helped</span>
        <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent block">
          Thousands of Men
        </span>
      </h1>
      
      {/* ✅ SEO OTIMIZADO: Subtitle com palavras-chave */}
      <p className="text-base sm:text-lg text-blue-800 mb-2 font-semibold px-2">
        BlueDrops uses the <span className="text-yellow-600 font-bold">turmeric curcumin trick</span> and other natural ingredients — without pills or prescriptions
      </p>
      
      <div className="flex items-center justify-center gap-2 text-blue-700 text-sm">
        <Play className="w-4 h-4" />
        <span className="font-medium tracking-wider">REVEAL THE TRICK</span>
      </div>
    </div>
  );
};