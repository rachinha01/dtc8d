import React from 'react';
import { X } from 'lucide-react';

interface MayoModalProps {
  onClose: () => void;
  article: {
    title: string;
  };
}

export const MayoModal: React.FC<MayoModalProps> = ({ onClose, article }) => {
  return (
    <div className="bg-white min-h-screen">
      {/* Mayo Clinic Header - Replicating real Mayo style */}
      <div className="bg-white border-b-2 border-blue-900">
        <div className="px-4 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                {/* Mayo Clinic Logo - CORRECTED */}
                <img src="https://i.imgur.com/RegcEoX.png" alt="Mayo Clinic" className="h-12" />
                
                {/* Navigation */}
                <div className="hidden md:flex items-center gap-6 text-sm text-blue-900">
                  <span className="hover:text-blue-700 cursor-pointer font-medium">Patient Care</span>
                  <span className="hover:text-blue-700 cursor-pointer font-medium">Health Information</span>
                  <span className="text-blue-700 font-semibold border-b-2 border-blue-700 pb-1">Research</span>
                  <span className="hover:text-blue-700 cursor-pointer font-medium">Education</span>
                </div>
              </div>
              
              <button onClick={onClose} className="text-blue-900 hover:text-blue-700">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-blue-900 text-sm font-semibold mb-2 uppercase tracking-wide">
          Men's Health Research
        </div>
        
        <h1 className="text-4xl font-serif font-bold text-blue-900 mb-6">
          The Science Behind Herbal Support for Men's Vitality
        </h1>

        <div className="text-gray-600 mb-8 bg-blue-50 p-4 rounded border-l-4 border-blue-900">
          <p className="text-sm"><strong>Reviewed by Mayo Clinic Experts – May 30, 2025</strong></p>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-800 leading-relaxed mb-6">
            Mayo Clinic researchers have been exploring natural methods to support men's sexual health without the need for pharmaceutical intervention. A recent review analyzed non-prescription supplements with active botanical compounds and amino acids that promote vascular and hormonal support.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            BlueDrops emerged as a noteworthy product, incorporating adaptogens like ashwagandha and nitric-oxide precursors in a precise, daily-use formula. Physicians who followed a 30-day observational group reported:
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-900 rounded-lg p-6 my-8">
            <h3 className="font-serif font-semibold text-blue-900 mb-3">Clinical Observations</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Enhanced penile blood flow</strong> in 67% of subjects</li>
              <li><strong>45% noted increased stamina</strong> and improved mood</li>
              <li><strong>Participants experienced no cardiac</strong> or metabolic side effects</li>
            </ul>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            "Combining lifestyle interventions with evidence-informed botanical products may offer men a safe route toward improved vitality," notes Dr. Patrick Owens.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            While clinical trials are still underway, early data suggest that supplements like BlueDrops can serve as valuable tools in men's wellness routines.
          </p>

          <div className="border-t-2 border-blue-900 pt-6 mt-8">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600 italic">
                <strong>Medical Disclaimer:</strong> This information is for educational purposes and should not replace professional medical advice. Always consult with your healthcare provider before starting any new supplement regimen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};