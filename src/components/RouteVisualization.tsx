import React, { useState } from 'react';
import { Globe, Navigation, Bus, Clock, MapPin, Route, Eye, Maximize2, CheckCircle, Star, Settings, Wrench } from 'lucide-react';
import { BusSchedule } from '../types/BusSchedule';
import RouteMapModal from './RouteMapModal';

interface RouteVisualizationProps {
  schedules: BusSchedule[];
  selectedSchedule?: BusSchedule;
}

const RouteVisualization: React.FC<RouteVisualizationProps> = ({ 
  schedules, 
  selectedSchedule 
}) => {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [modalSchedule, setModalSchedule] = useState<BusSchedule | undefined>();

  // Group schedules by starting point for better visualization
  const groupedRoutes = schedules.reduce((acc, schedule) => {
    const key = schedule.startingPoint;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(schedule);
    return acc;
  }, {} as Record<string, BusSchedule[]>);

  const openMapModal = (schedule?: BusSchedule) => {
    setModalSchedule(schedule);
    setIsMapModalOpen(true);
  };

  const openAllRoutesMap = () => {
    setModalSchedule(undefined);
    setIsMapModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-3">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Route Visualization</h2>
              <p className="text-gray-600 text-sm sm:text-base">Interactive bus route maps and schedules</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={openAllRoutesMap}
              className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>View All Routes</span>
            </button>
          </div>
        </div>

        {/* Maps Feature Coming Soon Notice */}
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-500 rounded-full p-2 flex-shrink-0">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-2 flex items-center space-x-2">
                <Wrench className="h-4 w-4" />
                <span>🚧 Maps Feature Under Development</span>
              </p>
              <p className="mb-3 leading-relaxed">
                We're working hard to bring you an amazing interactive maps experience! Our development team is currently implementing advanced route visualization features that will make finding your bus routes even easier.
              </p>
              <div className="bg-white/50 rounded-lg p-3 mb-3">
                <p className="font-medium text-xs mb-2">🎯 What's Coming Soon:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-blue-600" />
                    <span className="text-xs">Interactive route maps</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-blue-600" />
                    <span className="text-xs">Real-time bus locations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-blue-600" />
                    <span className="text-xs">Turn-by-turn directions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-blue-600" />
                    <span className="text-xs">Nearby stops finder</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-blue-600 font-medium">
                ⏰ Expected launch: Very soon! Thank you for your patience and trust in our service.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-blue-50 rounded-xl p-3 sm:p-4 text-center">
            <Route className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mx-auto mb-2" />
            <div className="text-lg sm:text-2xl font-bold text-blue-600">{Object.keys(groupedRoutes).length}</div>
            <div className="text-xs sm:text-sm text-blue-700">Starting Points</div>
          </div>
          <div className="bg-green-50 rounded-xl p-3 sm:p-4 text-center">
            <Bus className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mx-auto mb-2" />
            <div className="text-lg sm:text-2xl font-bold text-green-600">{schedules.length}</div>
            <div className="text-xs sm:text-sm text-green-700">Total Routes</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 sm:p-4 text-center">
            <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500 mx-auto mb-2" />
            <div className="text-lg sm:text-2xl font-bold text-purple-600">
              {schedules.filter(s => s.scheduleType === 'Friday').length}
            </div>
            <div className="text-xs sm:text-sm text-purple-700">Friday Routes</div>
          </div>
          <div className="bg-orange-50 rounded-xl p-3 sm:p-4 text-center">
            <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 mx-auto mb-2" />
            <div className="text-lg sm:text-2xl font-bold text-orange-600">15+</div>
            <div className="text-xs sm:text-sm text-orange-700">Areas Covered</div>
          </div>
        </div>
      </div>

      {/* Route Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {Object.entries(groupedRoutes).map(([startingPoint, routeSchedules]) => (
          <div key={startingPoint} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            
            {/* Card Header */}
            <div className="bg-gradient-to-r from-gray-50 to-green-50 p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="bg-green-500 rounded-lg p-2 flex-shrink-0">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 truncate">{startingPoint}</h3>
                    <p className="text-sm text-gray-600">{routeSchedules.length} routes available</p>
                  </div>
                </div>
                
                <button
                  onClick={() => openMapModal(routeSchedules[0])}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex-shrink-0"
                >
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">View Map</span>
                  <span className="sm:hidden">Map</span>
                </button>
              </div>
            </div>

            {/* Route List */}
            <div className="p-4 space-y-3">
              {routeSchedules.slice(0, 3).map((schedule) => (
                <div 
                  key={schedule.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => openMapModal(schedule)}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span className="font-semibold text-gray-900">{schedule.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 min-w-0">
                      <Navigation className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600 truncate">{schedule.endPoint}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {schedule.gender && (
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        schedule.gender === 'Female' 
                          ? 'bg-pink-100 text-pink-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {schedule.gender}
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      schedule.scheduleType === 'Friday' 
                        ? 'bg-orange-100 text-orange-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {schedule.scheduleType}
                    </span>
                  </div>
                </div>
              ))}
              
              {routeSchedules.length > 3 && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => openMapModal(routeSchedules[0])}
                    className="text-green-600 hover:text-green-700 font-medium text-sm"
                  >
                    View {routeSchedules.length - 3} more routes →
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Map Modal */}
      <RouteMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        schedule={modalSchedule}
        schedules={modalSchedule ? undefined : schedules}
        title={modalSchedule ? undefined : 'All IIUC Bus Routes'}
      />
    </div>
  );
};

export default RouteVisualization;