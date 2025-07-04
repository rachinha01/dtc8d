import React from 'react';
import { X, Search, ChevronDown } from 'lucide-react';

interface WebMDModalProps {
  onClose: () => void;
  article: {
    title: string;
  };
}

export const WebMDModal: React.FC<WebMDModalProps> = ({ onClose, article }) => {
  // ✅ FIXED: Redirect to home page function
  const redirectToHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="bg-white min-h-screen">
      {/* ✅ FIXED: WebMD Header - Exatamente como na imagem */}
      <div className="bg-blue-900 text-white">
        <div className="px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Left side - Logo e Navigation */}
              <div className="flex items-center gap-8">
                {/* WebMD Logo - ✅ FIXED: Redirect to home */}
                <img 
                  src="https://i.imgur.com/hEggmdK.png" 
                  alt="WebMD" 
                  className="h-8 cursor-pointer hover:opacity-80 transition-opacity" 
                  onClick={redirectToHome}
                />
                
                {/* Navigation Menu - ✅ FIXED: All redirect to home */}
                <div className="hidden md:flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-blue-200" onClick={redirectToHome}>
                    <span>Conditions</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1 cursor-pointer hover:text-blue-200" onClick={redirectToHome}>
                    <span>Drugs & Supplements</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1 cursor-pointer hover:text-blue-200" onClick={redirectToHome}>
                    <span>Well-Being</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  <span className="cursor-pointer hover:text-blue-200" onClick={redirectToHome}>
                    Symptom Checker
                  </span>
                  <span className="cursor-pointer hover:text-blue-200" onClick={redirectToHome}>
                    Find a Doctor
                  </span>
                  <div className="flex items-center gap-1 cursor-pointer hover:text-blue-200" onClick={redirectToHome}>
                    <span>More</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
              
              {/* Right side - Subscribe, Login, Search, Close */}
              <div className="flex items-center gap-4">
                <button 
                  className="bg-transparent border border-white text-white px-3 py-1.5 rounded text-sm hover:bg-white hover:text-blue-900 transition-colors"
                  onClick={redirectToHome}
                >
                  Subscribe
                </button>
                <button 
                  className="text-white hover:text-blue-200 text-sm"
                  onClick={redirectToHome}
                >
                  Log In
                </button>
                <button 
                  className="text-white hover:text-blue-200"
                  onClick={redirectToHome}
                >
                  <Search className="w-5 h-5" />
                </button>
                <button onClick={onClose} className="text-white hover:text-blue-200">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="text-blue-600 text-sm font-semibold mb-2 uppercase tracking-wide">
              Men's Health
            </div>
            
            <h1 className="text-3xl font-bold text-blue-900 mb-4">
              Natural Male Enhancers Gaining Ground in 2025
            </h1>
            
            <div className="text-gray-600 text-sm mb-6 bg-blue-50 p-3 rounded border-l-4 border-blue-400">
              <strong>WebMD Medical Review: June 22, 2025</strong>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-800 leading-relaxed mb-4">
                In 2025, the shift toward natural wellness continues growing—especially in male health supplements. Among up-and-coming products, BlueDrops stands out for combining traditional herbs like Tribulus and L-Arginine with scientifically backed nitric-oxide boosters in a simple daily drop format.
              </p>

              <p className="text-gray-700 leading-relaxed mb-4">
                WebMD consulted five men enrolled in a 30‑day trial:
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>4 out of 5</strong> reported stronger erections</li>
                  <li><strong>3 improved</strong> their performance and confidence in the bedroom</li>
                  <li><strong>All participants</strong> noted better energy levels and mood</li>
                </ul>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">
                Dr. Julia Nguyen, a men's health specialist, commented:
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">EXPERT OPINION</span>
                </h4>
                <p className="text-blue-800 italic">
                  "While not a replacement for prescription therapy, BlueDrops may offer a reliable, low‑risk starting point for men who prefer natural options. The compound appears safe and user-friendly."
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                WebMD classifies BlueDrops as a "promising breakthrough"—especially given the absence of harsh pills or major side effects.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-900 mb-3">Related Topics</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-blue-600 hover:underline" onClick={redirectToHome}>Men's Health Basics</a></li>
                <li><a href="#" className="text-blue-600 hover:underline" onClick={redirectToHome}>Natural Supplements Guide</a></li>
                <li><a href="#" className="text-blue-600 hover:underline" onClick={redirectToHome}>Performance Enhancement</a></li>
                <li><a href="#" className="text-blue-600 hover:underline" onClick={redirectToHome}>Erectile Dysfunction</a></li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Health Tools</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-blue-600 hover:underline" onClick={redirectToHome}>Symptom Checker</a></li>
                <li><a href="#" className="text-blue-600 hover:underline" onClick={redirectToHome}>Drug Interaction Checker</a></li>
                <li><a href="#" className="text-blue-600 hover:underline" onClick={redirectToHome}>Find a Doctor</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ FIXED: WebMD Footer - Exatamente como na imagem */}
      <div className="bg-blue-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Newsletter Section */}
          <div className="mb-8">
            <h3 className="text-white font-bold text-lg mb-4">Sign up for our free Good Health Newsletter</h3>
            <p className="text-blue-200 mb-4">Get wellness tips to help you live happier and healthier</p>
            
            <div className="flex gap-2 max-w-md">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-3 py-2 rounded text-gray-900"
                onClick={redirectToHome}
              />
              <button 
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                onClick={redirectToHome}
              >
                Subscribe
              </button>
            </div>
          </div>

          {/* Social Media and App Download */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Follow WebMD on Social Media</h4>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center cursor-pointer hover:bg-blue-700" onClick={redirectToHome}>
                  <span className="text-white text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-black rounded flex items-center justify-center cursor-pointer hover:bg-gray-800" onClick={redirectToHome}>
                  <span className="text-white text-sm">X</span>
                </div>
                <div className="w-8 h-8 bg-pink-500 rounded flex items-center justify-center cursor-pointer hover:bg-pink-600" onClick={redirectToHome}>
                  <span className="text-white text-sm">📷</span>
                </div>
                <div className="w-8 h-8 bg-black rounded flex items-center justify-center cursor-pointer hover:bg-gray-800" onClick={redirectToHome}>
                  <span className="text-white text-sm">🎵</span>
                </div>
                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center cursor-pointer hover:bg-red-700" onClick={redirectToHome}>
                  <span className="text-white text-sm">📌</span>
                </div>
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center cursor-pointer hover:bg-green-700" onClick={redirectToHome}>
                  <span className="text-white text-sm">💬</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Download WebMD App</h4>
              <div className="flex gap-2">
                <img 
                  src="https://via.placeholder.com/120x40/000000/FFFFFF?text=App+Store" 
                  alt="Download on App Store" 
                  className="h-10 cursor-pointer hover:opacity-80"
                  onClick={redirectToHome}
                />
                <img 
                  src="https://via.placeholder.com/120x40/000000/FFFFFF?text=Google+Play" 
                  alt="Get it on Google Play" 
                  className="h-10 cursor-pointer hover:opacity-80"
                  onClick={redirectToHome}
                />
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <h4 className="font-semibold mb-3">Policies</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><a href="#" className="hover:text-white" onClick={redirectToHome}>Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white" onClick={redirectToHome}>Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white" onClick={redirectToHome}>Editorial Policy</a></li>
                <li><a href="#" className="hover:text-white" onClick={redirectToHome}>Advertising Policy</a></li>
                <li><a href="#" className="hover:text-white" onClick={redirectToHome}>Correction Policy</a></li>
                <li><a href="#" className="hover:text-white" onClick={redirectToHome}>Terms of Use</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">About</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><a href="#" className="hover:text-white" onClick={redirectToHome}>About WebMD</a></li>
                <li><a href="#" className="hover:text-white" onClick={redirectToHome}>WebMD Corporate</a></li>
                <li><a href="#" className="hover:text-white" onClick={redirectToHome}>WebMD Health Services</a></li>
                <li><a href="#" className="hover:text-white" onClick={redirectToHome}>First Aid</a></li>
                <li><a href="#" className="hover:text-white" onClick={redirectToHome}>WebMD Magazine</a></li>
                <li><a href="#" className="hover:text-white" onClick={redirectToHome}>WebMD Health Record</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">For Advertisers</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><a href="#" className="hover:text-white" onClick={redirectToHome}>Advertise with Us</a></li>
                <li><a href="#" className="hover:text-white" onClick={redirectToHome}>Advertising Policy</a></li>
                <li><a href="#" className="hover:text-white" onClick={redirectToHome}>Sponsor Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-blue-800 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <img 
                  src="https://i.imgur.com/hEggmdK.png" 
                  alt="WebMD" 
                  className="h-8 cursor-pointer hover:opacity-80"
                  onClick={redirectToHome}
                />
                <div className="text-xs text-blue-200">
                  <p>© 2005-2025 WebMD LLC, an Internet Brands company. All rights reserved.</p>
                  <p>WebMD does not provide medical advice, diagnosis or treatment.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <img 
                  src="https://via.placeholder.com/80x30/4CAF50/FFFFFF?text=TRUSTe" 
                  alt="TRUSTe Certified Privacy" 
                  className="h-8 cursor-pointer hover:opacity-80"
                  onClick={redirectToHome}
                />
                <img 
                  src="https://via.placeholder.com/80x30/2196F3/FFFFFF?text=AdChoices" 
                  alt="AdChoices" 
                  className="h-8 cursor-pointer hover:opacity-80"
                  onClick={redirectToHome}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};