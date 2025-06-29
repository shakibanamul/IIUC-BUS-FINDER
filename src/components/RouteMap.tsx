import React, { useState } from 'react';
import { MapPin, Navigation, Bus, Clock, Users, Route, X, Maximize2, Minimize2, Layers, Satellite, Map as MapIcon, AlertCircle, Wifi, WifiOff, Globe, Settings, Wrench, CheckCircle } from 'lucide-react';
import { BusSchedule } from '../types/BusSchedule';

interface RouteMapProps {
  schedule?: BusSchedule;
  schedules?: BusSchedule[];
  isFullscreen?: boolean;
  onClose?: () => void;
}

// Coming Soon map component
const ComingSoonRouteMap: React.FC<RouteMapProps> = ({ schedule, schedules = [] }) => {
  const routesToShow = schedule ? [schedule] : schedules;
  
  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto shadow-lg border border-white/50">
        <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Wrench className="h-8 w-8 text-blue-600" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3">Maps Feature is on Working!</h3>
        <p className="text-gray-600 mb-4 leading-relaxed text-sm">
          We're excited to bring you interactive route maps very soon! Our team is working hard to create an amazing experience for planning your bus journeys. Thank you for your patience and trust in our service.
        </p>
        
        {schedule ? (
          <div className="space-y-3 text-left">
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <p className="font-semibold text-blue-900 mb-2 text-sm">Current Route:</p>
              <div className="space-y-1 text-xs text-blue-800">
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3 text-blue-500" />
                  <span className="font-semibold">{schedule.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-3 w-3 text-green-500" />
                  <span>{schedule.startingPoint}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Navigation className="h-3 w-3 text-purple-500" />
                  <span>{schedule.endPoint}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 leading-relaxed">{schedule.route}</p>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {schedule.gender && (
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  schedule.gender === 'Female' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {schedule.gender} Only
                </span>
              )}
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                schedule.scheduleType === 'Friday' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
              }`}>
                {schedule.scheduleType}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-600 mb-4 text-sm">
              {routesToShow.length} bus routes will be visualized here
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-pink-50 rounded-lg p-2">
                <div className="w-3 h-3 bg-pink-500 rounded-full mx-auto mb-1"></div>
                <div className="text-pink-700 font-medium text-xs">Female</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
                <div className="text-blue-700 font-medium text-xs">Male</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-1"></div>
                <div className="text-orange-700 font-medium text-xs">Friday</div>
              </div>
              <div className="bg-green-50 rounded-lg p-2">
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                <div className="text-green-700 font-medium text-xs">Regular</div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 text-blue-700 mb-2">
            <Wrench className="h-4 w-4" />
            <span className="text-sm font-medium">Coming Soon Features</span>
          </div>
          <div className="space-y-1 text-xs text-blue-600 text-left">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-blue-600" />
              <span>Interactive route maps</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-blue-600" />
              <span>Real-time bus tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-blue-600" />
              <span>Turn-by-turn directions</span>
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2 font-medium">
            ⏰ We appreciate your patience and trust!
          </p>
        </div>
      </div>
    </div>
  );
};

const RouteMap: React.FC<RouteMapProps> = ({ 
  schedule, 
  schedules = [], 
  isFullscreen = false, 
  onClose 
}) => {
  // Always show the coming soon message
  return (
    <div className="relative">
      <ComingSoonRouteMap 
        schedule={schedule}
        schedules={schedules}
        isFullscreen={isFullscreen}
        onClose={onClose}
      />
    </div>
  );
};

export default RouteMap;