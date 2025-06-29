import React, { useState } from 'react';
import { Bus, AlertCircle, Search, TrendingUp, Filter, ChevronDown, Loader2 } from 'lucide-react';
import { BusSchedule } from '../types/BusSchedule';
import BusCard from './BusCard';

interface ResultsSectionProps {
  schedules: BusSchedule[];
  totalSchedules: number;
  isSearching: boolean;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ schedules, totalSchedules, isSearching }) => {
  const [displayCount, setDisplayCount] = useState(6); // Show 6 schedules initially
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = async () => {
    setIsLoading(true);
    
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setDisplayCount(prev => Math.min(prev + 6, schedules.length)); // Load 6 more schedules
    setIsLoading(false);
  };

  const displayedSchedules = schedules.slice(0, displayCount);
  const hasMoreSchedules = displayCount < schedules.length;

  if (isSearching && schedules.length === 0) {
    return (
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12 text-center border border-gray-100 mx-2 sm:mx-0">
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-full p-4 sm:p-6 w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 text-orange-600" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">No schedules found</h3>
          <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
            We couldn't find any bus schedules matching your search criteria. 
            Try adjusting your filters or search terms.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl sm:rounded-2xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg text-sm sm:text-base">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Clear Filters
            </button>
            <button className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-gray-700 rounded-xl sm:rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200 border-2 border-gray-200 text-sm sm:text-base">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Reset Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Results Header - Enhanced with Pagination Info */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 mx-2 sm:mx-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <Bus className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {isSearching ? 'Search Results' : 'Bus Schedules'}
              </h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                {isSearching ? 'Filtered results based on your criteria' : 'IIUC transport schedules'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center lg:justify-end space-x-4 sm:space-x-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                {displayedSchedules.length}
                {hasMoreSchedules && (
                  <span className="text-lg text-gray-400">/{schedules.length}</span>
                )}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                {hasMoreSchedules ? 'Showing' : 'Total'}
              </div>
            </div>
            <div className="h-8 sm:h-12 w-px bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-400">{totalSchedules}</div>
              <div className="text-xs sm:text-sm text-gray-500">Available</div>
            </div>
            {isSearching && (
              <>
                <div className="h-8 sm:h-12 w-px bg-gray-200"></div>
                <div className="flex items-center space-x-2 text-green-600">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-sm font-semibold">Active Search</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Pagination Progress Bar */}
        {schedules.length > 6 && (
          <div className="mt-4 sm:mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                Showing {displayedSchedules.length} of {schedules.length} schedules
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((displayedSchedules.length / schedules.length) * 100)}% loaded
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(displayedSchedules.length / schedules.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Results Grid - Display Limited Schedules */}
      {displayedSchedules.length > 0 ? (
        <div className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-0">
            {displayedSchedules.map((schedule, index) => (
              <div 
                key={schedule.id} 
                className="animate-fade-slide-up"
                style={{ animationDelay: `${(index % 6) * 100}ms` }}
              >
                <BusCard schedule={schedule} />
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMoreSchedules && (
            <div className="text-center px-2 sm:px-0">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {schedules.length - displayCount} more schedules available
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Load more bus schedules to see additional routes and timings
                  </p>
                  
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl sm:rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed text-sm sm:text-base min-w-[160px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        <span>Load More Schedules</span>
                      </>
                    )}
                  </button>

                  {/* Quick Load All Option */}
                  <div className="mt-3">
                    <button
                      onClick={() => setDisplayCount(schedules.length)}
                      disabled={isLoading}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors disabled:text-gray-400"
                    >
                      Or load all {schedules.length} schedules at once
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Loaded Message */}
          {!hasMoreSchedules && schedules.length > 6 && (
            <div className="text-center px-2 sm:px-0">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center justify-center space-x-2 text-green-700">
                  <Bus className="h-5 w-5" />
                  <span className="font-semibold">All {schedules.length} schedules loaded!</span>
                </div>
                <p className="text-green-600 text-sm mt-1">
                  You've viewed all available bus schedules
                </p>
              </div>
            </div>
          )}
        </div>
      ) : !isSearching && (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12 text-center border border-gray-100 mx-2 sm:mx-0">
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full p-4 sm:p-6 w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
              <Bus className="h-8 w-8 sm:h-12 sm:w-12 text-blue-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">No schedules available</h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Bus schedules are currently being updated. Please check back later for the latest information.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsSection;