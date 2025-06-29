import React, { useState } from 'react';
import { X, Maximize2, Minimize2, Map, Navigation, Bus, Clock, AlertCircle, Settings, Globe, Star, Wrench, CheckCircle } from 'lucide-react';
import { BusSchedule } from '../types/BusSchedule';
import RouteMap from './RouteMap';

interface RouteMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule?: BusSchedule;
  schedules?: BusSchedule[];
  title?: string;
}

const RouteMapModal: React.FC<RouteMapModalProps> = ({
  isOpen,
  onClose,
  schedule,
  schedules = [],
  title
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMapInfo, setShowMapInfo] = useState(false);

  if (!isOpen) return null;

  const displayTitle = title || (schedule ? `${schedule.startingPoint} → ${schedule.endPoint}` : 'Bus Routes Map');

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-slide-up">
        {/* Backdrop */}
        <div 
          className="absolute inset-0" 
          onClick={onClose}
        />
        
        {/* Modal Content */}
        <div className={`relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 ${
          isFullscreen 
            ? 'w-full h-full max-w-none max-h-none rounded-none sm:rounded-2xl' 
            : 'w-full max-w-5xl h-[90vh] max-h-[700px]'
        }`}>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 sm:p-6 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="bg-white/20 rounded-full p-2 flex-shrink-0">
                <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl font-bold truncate">{displayTitle}</h3>
                <p className="text-blue-100 text-sm flex items-center space-x-2">
                  <Wrench className="h-3 w-3" />
                  <span>Maps Feature Coming Soon</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={() => setShowMapInfo(!showMapInfo)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Feature Information"
              >
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4 sm:h-5 sm:w-5" /> : <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Close"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>

          {/* Feature Info Panel */}
          {showMapInfo && (
            <div className="bg-blue-50 border-b border-blue-200 p-4">
              <div className="flex items-start space-x-3">
                <Wrench className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-2">🚧 Interactive Maps Under Development</p>
                  <p className="mb-3 leading-relaxed">
                    We're working hard to bring you an amazing interactive maps experience! Our development team is implementing advanced features to make your bus journey planning easier and more intuitive.
                  </p>
                  <div className="space-y-1 text-xs">
                    <p>✅ <strong>Coming Soon:</strong> Interactive route visualization</p>
                    <p>✅ <strong>Real-time Tracking:</strong> Live bus locations</p>
                    <p>✅ <strong>Smart Navigation:</strong> Turn-by-turn directions</p>
                    <p>✅ <strong>Stop Finder:</strong> Nearby bus stops locator</p>
                    <p>✅ <strong>Route Planner:</strong> Best route suggestions</p>
                  </div>
                  <p className="text-xs text-blue-600 mt-2 font-medium">
                    ⏰ Thank you for your patience and trust! This feature will be available very soon.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Schedule Info Bar (if single schedule) */}
          {schedule && (
            <div className="bg-gray-50 border-b border-gray-200 p-3 sm:p-4 flex-shrink-0">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="font-semibold text-gray-900">{schedule.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bus className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">{schedule.scheduleType} Schedule</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Navigation className="h-4 w-4 text-purple-500" />
                  <span className="text-gray-700">{schedule.direction.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
                {schedule.gender && (
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                    schedule.gender === 'Female' 
                      ? 'bg-pink-100 text-pink-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {schedule.gender} Only
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Map Container - Coming Soon Message */}
          <div className="flex-1 relative min-h-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Wrench className="h-8 w-8 text-blue-600" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">Maps Feature Coming Soon!</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  We're working hard to bring you interactive route maps. This feature will help you visualize bus routes and plan your journey better.
                </p>
                
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="font-semibold text-blue-900 mb-2 text-sm">🎯 What's Coming:</p>
                  <div className="space-y-1 text-xs text-blue-800 text-left">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-blue-600" />
                      <span>Interactive route visualization</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-blue-600" />
                      <span>Real-time bus tracking</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-blue-600" />
                      <span>Turn-by-turn directions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-blue-600" />
                      <span>Nearby stops finder</span>
                    </div>
                  </div>
                </div>
                
                {schedule && (
                  <div className="bg-gray-50 rounded-lg p-3 text-left">
                    <p className="font-semibold text-gray-900 mb-2 text-sm">Current Route Info:</p>
                    <div className="space-y-1 text-xs text-gray-600">
                      <p><strong>Time:</strong> {schedule.time}</p>
                      <p><strong>From:</strong> {schedule.startingPoint}</p>
                      <p><strong>To:</strong> {schedule.endPoint}</p>
                      <p><strong>Route:</strong> {schedule.route}</p>
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-blue-600 font-medium mt-4">
                  ⏰ Thank you for your patience! We're working to make this available soon.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 p-3 sm:p-4 flex items-center justify-between text-sm text-gray-600 flex-shrink-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <span className="flex items-center space-x-1">
                <Settings className="h-3 w-3 text-blue-500" />
                <span className="hidden sm:inline">Feature in Development</span>
                <span className="sm:hidden">In Development</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>🚧</span>
                <span className="hidden sm:inline">Coming Soon</span>
                <span className="sm:hidden">Soon</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs">IIUC Bus System</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RouteMapModal;