import React from 'react';
import { X } from 'lucide-react';

interface WebMDModalProps {
  onClose: () => void;
  article: {
    title: string;
  };
}

export const WebMDModal: React.FC<WebMDModalProps> = ({ onClose, article }) => {
  return (
    <div className="bg-white min-h-screen">
      {/* WebMD Header - Replicating real WebMD style */}
      <div className="bg-blue-900 text-white">
        <div className="px-4 py-3">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                {/* WebMD Logo - UPDATED */}
                <img src="https://i.imgur.com/RegcEoX.png" alt="WebMD" className="h-8" />
                
                {/* Navigation */}
                <div className="hidden md:flex items-center gap-6 text-sm">
                  <span className="hover:text-blue-200 cursor-pointer">Symptoms</span>
                  <span className="hover:text-blue-200 cursor-pointer">Drugs & Supplements</span>
                  <span className="text-blue-200 font-semibold border-b border-blue-200 pb-1">Men's Health</span>
                  <span className="hover:text-blue-200 cursor-pointer">Find a Doctor</span>
                </div>
              </div>
              
              <button onClick={onClose} className="text-white hover:text-blue-200">
                <X className="w-6 h-6" />
              </button>
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
                <li><a href="#" className="text-blue-600 hover:underline">Men's Health Basics</a></li>
                <li><a href="#" className="text-blue-600 hover:underline">Natural Supplements Guide</a></li>
                <li><a href="#" className="text-blue-600 hover:underline">Performance Enhancement</a></li>
                <li><a href="#" className="text-blue-600 hover:underline">Erectile Dysfunction</a></li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Health Tools</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-blue-600 hover:underline">Symptom Checker</a></li>
                <li><a href="#" className="text-blue-600 hover:underline">Drug Interaction Checker</a></li>
                <li><a href="#" className="text-blue-600 hover:underline">Find a Doctor</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};