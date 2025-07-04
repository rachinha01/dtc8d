import React from 'react';

export const SEOContent: React.FC = () => {
  return (
    <section className="mt-16 sm:mt-20 w-full max-w-4xl mx-auto px-4 animate-fadeInUp animation-delay-1800">
      {/* ✅ SEO OTIMIZADO: Seção com H2 e palavras-chave virais */}
      <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-blue-200 shadow-lg">
        
        {/* ✅ H2 com palavra-chave viral */}
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-4 text-center">
          The Baking Soda Trick vs. BlueDrops: What Really Works?
        </h2>
        
        <p className="text-blue-800 leading-relaxed mb-6 text-center">
          While the viral <strong>baking soda trick</strong> may give temporary results, BlueDrops goes deeper — eliminating the root cause with a concentrated dose of <strong>curcumin</strong>, the powerhouse behind the <strong>turmeric trick</strong>.
        </p>

        {/* ✅ H3 com outra palavra-chave viral */}
        <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-3 text-center">
          Is the Watermelon Trick a Myth?
        </h3>
        
        <p className="text-blue-800 leading-relaxed mb-6 text-center">
          Watermelon contains citrulline, but BlueDrops delivers clinical-level performance support with proven, bioavailable compounds that outperform the <strong>watermelon trick</strong>.
        </p>

        {/* ✅ H3 com foco no produto */}
        <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-3 text-center">
          This Liquid "Trick for ED" is Changing Lives
        </h3>
        
        <p className="text-blue-800 leading-relaxed text-center">
          Thousands of men are turning to BlueDrops, a <strong>natural ED support formula</strong>, using ingredients trusted by doctors and inspired by ancient remedies like the <strong>turmeric trick</strong>. Forget pills — this science-backed <strong>ED trick</strong> is helping men across the U.S. regain control fast.
        </p>

        {/* ✅ Lista de benefícios com palavras-chave */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-2">✅ Better Than Baking Soda Trick</h4>
            <p className="text-blue-700 text-sm">Clinical-grade ingredients that work long-term, not just temporarily</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-bold text-green-900 mb-2">✅ Curcumin Power</h4>
            <p className="text-green-700 text-sm">Concentrated turmeric extract for maximum bioavailability</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-bold text-yellow-900 mb-2">✅ No Side Effects</h4>
            <p className="text-yellow-700 text-sm">Natural formula without the risks of prescription drugs</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-bold text-purple-900 mb-2">✅ Fast Results</h4>
            <p className="text-purple-700 text-sm">Men report improvements within days, not weeks</p>
          </div>
        </div>
      </div>
    </section>
  );
};