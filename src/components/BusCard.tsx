import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Route, ArrowRight, Users, Bus, Calendar, Star, Navigation, ChevronDown, ChevronUp, Zap, Sparkles, X, Map } from 'lucide-react';
import { BusSchedule } from '../types/BusSchedule';
import RouteMapModal from './RouteMapModal';

interface BusCardProps {
  schedule: BusSchedule;
}

const BusCard: React.FC<BusCardProps> = ({ schedule }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLiveTrackingModal, setShowLiveTrackingModal] = useState(false);
  const [showRouteMap, setShowRouteMap] = useState(false);

  // Auto-close modal after 5 seconds
  useEffect(() => {
    if (showLiveTrackingModal) {
      const timer = setTimeout(() => {
        setShowLiveTrackingModal(false);
      }, 5000); // Auto-close after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [showLiveTrackingModal]);

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'CityToIIUC':
        return 'bg-gradient-to-r from-emerald-500 to-green-600 text-white';
      case 'IIUCToCity':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
      case 'ToUniversity':
        return 'bg-gradient-to-r from-purple-500 to-violet-600 text-white';
      case 'FromUniversity':
        return 'bg-gradient-to-r from-orange-500 to-red-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-600 text-white';
    }
  };

  const getGenderColor = (gender?: string) => {
    if (!gender) return '';
    return gender === 'Male' 
      ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300' 
      : 'bg-gradient-to-r from-pink-100 to-rose-200 text-pink-800 border border-pink-300';
  };

  const getBusTypeColor = (busType?: string) => {
    if (!busType) return '';
    switch (busType) {
      case 'AC Bus':
        return 'bg-gradient-to-r from-purple-100 to-violet-200 text-purple-800 border border-purple-300';
      case 'IIUC A&H B':
        return 'bg-gradient-to-r from-orange-100 to-amber-200 text-orange-800 border border-orange-300';
      case 'Non-AC Bus':
        return 'bg-gradient-to-r from-gray-100 to-slate-200 text-gray-800 border border-gray-300';
      default:
        return 'bg-gradient-to-r from-indigo-100 to-blue-200 text-indigo-800 border border-indigo-300';
    }
  };

  const getRemarksColor = (remarks?: string) => {
    if (!remarks) return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200';
    if (remarks.toLowerCase().includes('student')) {
      return 'bg-gradient-to-r from-green-50 to-emerald-100 text-green-700 border border-green-200';
    } else if (remarks.toLowerCase().includes('teacher')) {
      return 'bg-gradient-to-r from-blue-50 to-indigo-100 text-blue-700 border border-blue-200';
    } else if (remarks.toLowerCase().includes('staff') || remarks.toLowerCase().includes('officer')) {
      return 'bg-gradient-to-r from-yellow-50 to-amber-100 text-yellow-700 border border-yellow-200';
    }
    return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200';
  };

  const getScheduleTypeColor = (scheduleType: string) => {
    return scheduleType === 'Friday' 
      ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white' 
      : 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white';
  };

  const formatRoute = (route: string) => {
    if (route.length > 60 && !isExpanded) {
      return route.substring(0, 60) + '...';
    }
    return route;
  };

  const formatDirection = (direction: string) => {
    switch (direction) {
      case 'CityToIIUC':
        return 'City → IIUC';
      case 'IIUCToCity':
        return 'IIUC → City';
      case 'ToUniversity':
        return 'To University';
      case 'FromUniversity':
        return 'From University';
      default:
        return direction;
    }
  };

  // Calculate estimated travel time (mock calculation)
  const getEstimatedTime = () => {
    const routeLength = schedule.route.split('–').length;
    return `${Math.max(15, routeLength * 8)} min`;
  };

  const handleLiveTrackingClick = () => {
    setShowLiveTrackingModal(true);
  };

  const handleViewRouteMap = () => {
    setShowRouteMap(true);
  };

  return (
    <>
      <div className="group bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out border border-gray-100 overflow-hidden transform hover:-translate-y-2 hover:scale-[1.02] relative card-hover gpu-accelerated">
        
        {/* Compact Header - Enhanced Smoothness */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-4 sm:p-6 border-b border-gray-100 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl p-2 sm:p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="transform transition-all duration-300 group-hover:translate-x-1">
                <span className="text-xl sm:text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">{schedule.time}</span>
                <div className="flex items-center space-x-2 sm:space-x-3 mt-1">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-600 font-medium">Live</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Navigation className="h-3 w-3 transition-transform duration-300 group-hover:rotate-12" />
                    <span>{getEstimatedTime()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-1.5 sm:space-y-2 transform transition-all duration-300 group-hover:scale-105">
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${getScheduleTypeColor(schedule.scheduleType)} shadow-sm transition-all duration-300 hover:shadow-md`}>
                {schedule.scheduleType === 'Friday' ? '🕌 Friday' : '📅 Regular'}
              </span>
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${getDirectionColor(schedule.direction)} shadow-sm transition-all duration-300 hover:shadow-md`}>
                {formatDirection(schedule.direction)}
              </span>
            </div>
          </div>
        </div>

        {/* Compact Route Display - Enhanced Animations */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {/* Route Summary - Smooth Hover Effects */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3 flex-1 transform transition-all duration-300 group-hover:translate-x-1">
              <div className="bg-green-100 rounded-xl p-2 transition-all duration-300 group-hover:bg-green-200 group-hover:scale-110">
                <MapPin className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate text-sm sm:text-base transition-colors duration-300 group-hover:text-green-600">{schedule.startingPoint}</p>
                <p className="text-xs sm:text-sm text-gray-500 transition-colors duration-300 group-hover:text-gray-600">Starting Point</p>
              </div>
            </div>
            
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mx-auto sm:mx-4 flex-shrink-0 rotate-90 sm:rotate-0 transition-all duration-500 group-hover:text-blue-500 group-hover:scale-125 group-hover:translate-x-1" />
            
            <div className="flex items-center space-x-3 flex-1 transform transition-all duration-300 group-hover:translate-x-1">
              <div className="bg-blue-100 rounded-xl p-2 transition-all duration-300 group-hover:bg-blue-200 group-hover:scale-110">
                <MapPin className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate text-sm sm:text-base transition-colors duration-300 group-hover:text-blue-600">{schedule.endPoint}</p>
                <p className="text-xs sm:text-sm text-gray-500 transition-colors duration-300 group-hover:text-gray-600">Destination</p>
              </div>
            </div>
          </div>

          {/* Expandable Route Details - Smooth Transitions */}
          <div className="space-y-2 sm:space-y-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-xl sm:rounded-2xl hover:bg-gray-100 transition-all duration-300 hover:shadow-md transform hover:scale-[1.02] button-smooth"
            >
              <div className="flex items-center space-x-2">
                <Route className="h-4 w-4 text-gray-600 transition-transform duration-300 group-hover:rotate-12" />
                <span className="text-sm font-medium text-gray-700">Route Details</span>
              </div>
              <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </button>
            
            <div className={`overflow-hidden transition-all duration-500 ease-out ${
              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-indigo-100 transform transition-all duration-300 hover:shadow-md">
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{formatRoute(schedule.route)}</p>
              </div>
            </div>
          </div>

          {/* Compact Tags - Enhanced Hover Effects */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {schedule.gender && (
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getGenderColor(schedule.gender)} shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105 cursor-default`}>
                👤 {schedule.gender}
              </span>
            )}
            {schedule.busType && (
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getBusTypeColor(schedule.busType)} shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105 cursor-default`}>
                🚌 {schedule.busType}
              </span>
            )}
            {(schedule.remarks || schedule.description) && (
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getRemarksColor(schedule.remarks || schedule.description)} shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105 cursor-default`}>
                {schedule.remarks || schedule.description}
              </span>
            )}
          </div>
        </div>

        {/* Enhanced Footer - Smooth Interactions */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-50 group-hover:to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={handleViewRouteMap}
                className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 transition-all duration-300 hover:text-blue-600 hover:scale-105 bg-white rounded-lg px-2 py-1 shadow-sm hover:shadow-md"
              >
                <Map className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 hover:scale-110" />
                <span>View on Map</span>
              </button>
              
              <button
                onClick={handleLiveTrackingClick}
                className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 transition-all duration-300 hover:text-green-600 hover:scale-105 bg-white rounded-lg px-2 py-1 shadow-sm hover:shadow-md"
              >
                <Bus className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 hover:scale-110" />
                <span>Live tracking</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium transition-all duration-300 hover:bg-green-200 hover:scale-105">
                ✓ Active
              </span>
              <button
                onClick={handleViewRouteMap}
                className="p-1.5 sm:p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-300 hover:scale-110 hover:rotate-12 transform"
              >
                <Navigation className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5"></div>
      </div>

      {/* Route Map Modal */}
      <RouteMapModal
        isOpen={showRouteMap}
        onClose={() => setShowRouteMap(false)}
        schedule={schedule}
        title={`${schedule.startingPoint} → ${schedule.endPoint}`}
      />

      {/* FIXED: Live Tracking Coming Soon Modal - Mobile Responsive */}
      {showLiveTrackingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-slide-up">
          {/* Backdrop */}
          <div 
            className="absolute inset-0" 
            onClick={() => setShowLiveTrackingModal(false)}
          />
          
          {/* FIXED: Modal Content - Fully Mobile Responsive */}
          <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-300 scale-100 max-h-[90vh] flex flex-col">
            
            {/* Header - Compact for Mobile */}
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white p-4 sm:p-6 text-center relative flex-shrink-0">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
              
              <button
                onClick={() => setShowLiveTrackingModal(false)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              <div className="relative z-10">
                <div className="bg-white/20 rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                  <Navigation className="h-6 w-6 sm:h-8 sm:w-8 animate-pulse" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Live Bus Tracking</h3>
                <p className="text-blue-100 text-sm">Real-time location updates</p>
              </div>
            </div>

            {/* FIXED: Content - Scrollable on Mobile */}
            <div className="p-4 sm:p-6 text-center overflow-y-auto flex-1">
              <div className="mb-4 sm:mb-6">
                <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full p-2 sm:p-3 w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Coming Soon!</h4>
                <p className="text-gray-600 leading-relaxed text-sm">
                  We're working hard to bring you real-time bus tracking. This feature will allow you to see live locations of all IIUC buses on an interactive map.
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <h5 className="font-semibold text-blue-900 mb-2 sm:mb-3 flex items-center justify-center space-x-2 text-sm sm:text-base">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Upcoming Features</span>
                </h5>
                <ul className="text-xs sm:text-sm text-blue-700 space-y-1.5 sm:space-y-2 text-left">
                  <li className="flex items-start space-x-2">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Real-time bus locations on interactive map</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Estimated arrival times at your stop</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Push notifications for bus updates</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Route progress tracking</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Delay and disruption alerts</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={() => setShowLiveTrackingModal(false)}
                  className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Got it! I'll wait for updates
                </button>
                
                <p className="text-xs text-gray-500">
                  This message will close automatically in a few seconds
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BusCard;