import React, { useState } from 'react';
import { Clock, Settings, Eye, EyeOff } from 'lucide-react';

interface DelayControllerProps {
  currentDelay: number;
  onDelayChange: (delay: number) => void;
}

export const DelayController: React.FC<DelayControllerProps> = ({
  currentDelay,
  onDelayChange
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tempDelay, setTempDelay] = useState(currentDelay);

  const handleApplyDelay = () => {
    onDelayChange(tempDelay);
    setIsVisible(false);
  };

  const presetDelays = [
    { label: 'Sem delay', value: 0 },
    { label: '30 segundos', value: 30 },
    { label: '1 minuto', value: 60 },
    { label: '2 minutos', value: 120 },
    { label: '5 minutos', value: 300 },
    { label: '10 minutos', value: 600 }
  ];

  return (
    <>
      {/* Toggle Button - Fixed position */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300"
        title="Configurar delay do conteúdo"
      >
        {isVisible ? <EyeOff className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
      </button>

      {/* Delay Controller Panel */}
      {isVisible && (
        <div className="fixed top-20 right-4 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 w-80 animate-slideInUp">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Delay do Conteúdo</h3>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Configure quanto tempo esperar antes de mostrar os botões de compra e seções abaixo do vídeo.
          </p>

          {/* Current Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Status atual: {currentDelay === 0 ? 'Sem delay' : `${currentDelay} segundos`}
              </span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {presetDelays.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setTempDelay(preset.value)}
                className={`p-2 text-sm rounded-lg border transition-colors ${
                  tempDelay === preset.value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delay personalizado (segundos):
            </label>
            <input
              type="number"
              min="0"
              max="3600"
              value={tempDelay}
              onChange={(e) => setTempDelay(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleApplyDelay}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
            >
              Aplicar
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>

          {/* Info */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-700">
              <strong>Dica:</strong> Use delays para testar diferentes estratégias de conversão. 
              O delay só afeta os botões de compra e seções abaixo do vídeo.
            </p>
          </div>
        </div>
      )}
    </>
  );
};