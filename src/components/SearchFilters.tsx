import React, { useState, useEffect } from 'react';
import { Search, Filter, Bus, Users, Calendar, MapPin, Route, X, Sparkles, Zap, ChevronDown, Clock, CheckCircle, AlertCircle, Navigation } from 'lucide-react';
import { Direction, Gender, BusType, ScheduleType, RouteFilter } from '../types/BusSchedule';

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  direction: Direction;
  onDirectionChange: (direction: Direction) => void;
  gender: Gender;
  onGenderChange: (gender: Gender) => void;
  busType: BusType;
  onBusTypeChange: (busType: BusType) => void;
  scheduleType: ScheduleType;
  onScheduleTypeChange: (scheduleType: ScheduleType) => void;
  routeFilter: RouteFilter;
  onRouteFilterChange: (routeFilter: RouteFilter) => void;
  routeAreas: string[];
  // Additional props for enhanced functionality
  totalFiltered?: number;
  totalAvailable?: number;
  activeFilterCount?: number;
  onResetFilters?: () => void;
  onQuickFilter?: (filterType: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  direction,
  onDirectionChange,
  gender,
  onGenderChange,
  busType,
  onBusTypeChange,
  scheduleType,
  onScheduleTypeChange,
  routeFilter,
  onRouteFilterChange,
  routeAreas,
  totalFiltered = 0,
  totalAvailable = 0,
  activeFilterCount = 0,
  onResetFilters,
  onQuickFilter,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLiveUpdatesModal, setShowLiveUpdatesModal] = useState(false);

  // Auto-close modal after 5 seconds
  useEffect(() => {
    if (showLiveUpdatesModal) {
      const timer = setTimeout(() => {
        setShowLiveUpdatesModal(false);
      }, 5000); // Auto-close after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [showLiveUpdatesModal]);

  // Enhanced search suggestions based on current input
  useEffect(() => {
    if (searchTerm.length > 0) {
      const suggestions = [];
      const term = searchTerm.toLowerCase();
      
      // Time-based suggestions
      if (term.includes('7') || term.includes('morning')) {
        suggestions.push('7:00 AM buses', '7:30 AM Friday special');
      }
      if (term.includes('8')) {
        suggestions.push('8:00 AM routes', '8:30 AM CUET connection');
      }
      
      // Location-based suggestions
      if (term.includes('bot') || term.includes('b')) {
        suggestions.push('BOT to IIUC', 'BOT morning buses');
      }
      if (term.includes('agra') || term.includes('a')) {
        suggestions.push('Agrabad routes', 'Agrabad to IIUC');
      }
      if (term.includes('chat') || term.includes('c')) {
        suggestions.push('Chatteswari buses', 'Chatteswari GEC route');
      }
      
      // Type-based suggestions
      if (term.includes('ac') || term.includes('air')) {
        suggestions.push('AC Bus Friday', 'Air conditioned buses');
      }
      if (term.includes('female') || term.includes('women')) {
        suggestions.push('Female buses morning', 'Women-only routes');
      }
      if (term.includes('friday') || term.includes('fri')) {
        suggestions.push('Friday special schedule', 'Friday AC buses');
      }
      
      setSearchSuggestions(suggestions.slice(0, 5));
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const clearAllFilters = () => {
    if (onResetFilters) {
      onResetFilters();
    } else {
      onSearchChange('');
      onDirectionChange('All');
      onGenderChange('All');
      onBusTypeChange('All');
      onScheduleTypeChange('All');
      onRouteFilterChange('All');
    }
    setShowSuggestions(false);
  };

  const hasActiveFilters = searchTerm !== '' || direction !== 'All' || gender !== 'All' || 
                          busType !== 'All' || scheduleType !== 'All' || routeFilter !== 'All';

  // Enhanced quick search suggestions with better categorization
  const quickSearches = [
    { label: '7:00 AM', icon: Clock, color: 'blue', category: 'time' },
    { label: 'BOT', icon: MapPin, color: 'emerald', category: 'location' },
    { label: 'Agrabad', icon: MapPin, color: 'teal', category: 'location' },
    { label: 'Chatteswari', icon: MapPin, color: 'purple', category: 'location' },
    { label: 'Friday', icon: Calendar, color: 'orange', category: 'schedule' },
    { label: 'Female', icon: Users, color: 'pink', category: 'gender' },
    { label: 'AC Bus', icon: Bus, color: 'indigo', category: 'type' }
  ];

  const handleQuickSearch = (term: string) => {
    if (onQuickFilter) {
      onQuickFilter(term.toLowerCase());
    } else {
      onSearchChange(term);
    }
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSearchChange(suggestion);
    setShowSuggestions(false);
  };

  const handleLiveUpdatesClick = () => {
    setShowLiveUpdatesModal(true);
  };

  // Filter validation
  const getFilterValidation = () => {
    const issues = [];
    
    if (busType !== 'All' && scheduleType !== 'Friday') {
      issues.push({
        type: 'warning',
        message: 'Bus type filtering is only available for Friday schedules'
      });
    }
    
    if (hasActiveFilters && totalFiltered === 0) {
      issues.push({
        type: 'error',
        message: 'No schedules match your current filters'
      });
    }
    
    if (searchTerm.length > 0 && searchTerm.length < 2) {
      issues.push({
        type: 'info',
        message: 'Enter at least 2 characters for better search results'
      });
    }
    
    return issues;
  };

  const validationIssues = getFilterValidation();

  return (
    <>
      <div className="relative gpu-accelerated">
        {/* Main Search Container - Enhanced with Validation */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/50 p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 -mt-12 sm:-mt-16 relative z-10 overflow-hidden mx-2 sm:mx-0 transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-1">
          
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/50 opacity-60 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full blur-3xl transition-all duration-700 hover:scale-110"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-tr from-emerald-100/30 to-transparent rounded-full blur-3xl transition-all duration-700 hover:scale-110"></div>

          <div className="relative z-10">
            {/* Enhanced Header with Real-time Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4 transform transition-all duration-500 hover:scale-105">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl blur-lg opacity-20 transition-all duration-500 group-hover:opacity-40"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl p-3 sm:p-4 transform transition-all duration-300 hover:scale-110 hover:rotate-3">
                    <Sparkles className="h-5 w-5 sm:h-7 sm:w-7 text-white animate-pulse" />
                  </div>
                </div>
                <div className="transform transition-all duration-300 hover:translate-x-1">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                    Smart Search
                  </h2>
                  <p className="text-gray-600 font-medium text-sm sm:text-base">
                    {hasActiveFilters ? `${totalFiltered} of ${totalAvailable} schedules` : 'Find your perfect bus schedule instantly'}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Enhanced Active Filters Badge */}
                {hasActiveFilters && (
                  <div className="flex items-center space-x-2 sm:space-x-3 transform transition-all duration-300 hover:scale-105">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                      <span className="flex items-center space-x-1 sm:space-x-2">
                        <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{activeFilterCount} Active</span>
                      </span>
                    </div>
                    <button
                      onClick={clearAllFilters}
                      className="group bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-medium transition-all duration-300 border border-red-200 hover:border-red-300 text-xs sm:text-sm hover:scale-105 button-smooth"
                    >
                      <span className="flex items-center space-x-1 sm:space-x-2">
                        <X className="h-3 w-3 sm:h-4 sm:w-4 group-hover:rotate-90 transition-transform duration-300" />
                        <span>Clear All</span>
                      </span>
                    </button>
                  </div>
                )}
                
                {/* Real-time Status Indicator - Clickable */}
                <button
                  onClick={handleLiveUpdatesClick}
                  className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 bg-green-50 px-2 sm:px-3 py-1 sm:py-2 rounded-full border border-green-200 transition-all duration-300 hover:bg-green-100 hover:scale-105 hover:shadow-md"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">
                    {hasActiveFilters ? `${totalFiltered} Found` : 'Live Updates'}
                  </span>
                </button>
              </div>
            </div>
            
            {/* Enhanced Search Input with Suggestions */}
            <div className="mb-6 sm:mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-3 sm:mb-4 flex items-center space-x-2">
                <Search className="h-4 w-4 text-blue-500" />
                <span>Search by time, area, or route</span>
              </label>
              
              <div className="relative group">
                <div className={`absolute inset-0 rounded-2xl sm:rounded-3xl transition-all duration-500 ${
                  searchFocused 
                    ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-xl scale-105' 
                    : 'bg-gradient-to-r from-gray-200/50 to-gray-300/50 blur-lg'
                }`}></div>
                
                <div className="relative">
                  <Search className={`absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 transition-all duration-300 ${
                    searchFocused ? 'text-blue-500 scale-110' : 'text-gray-400'
                  }`} />
                  
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                    placeholder="e.g., 7:00 AM, Baroyarhat, Mirshorai, AC Bus..."
                    className="w-full pl-12 sm:pl-16 pr-12 sm:pr-16 py-4 sm:py-5 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl sm:rounded-3xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-500 text-gray-900 placeholder-gray-500 text-base sm:text-lg font-medium shadow-lg hover:shadow-xl form-input"
                  />
                  
                  {searchTerm && (
                    <button
                      onClick={() => {
                        onSearchChange('');
                        setShowSuggestions(false);
                      }}
                      className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 transition-all duration-300 rounded-full hover:bg-red-50 hover:scale-110"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  )}
                </div>

                {/* Search Suggestions Dropdown */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-48 overflow-y-auto">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors text-sm border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center space-x-2">
                          <Search className="h-4 w-4 text-gray-400" />
                          <span>{suggestion}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Enhanced Quick Search Suggestions */}
              <div className="mt-3 sm:mt-4">
                <p className="text-sm font-semibold text-gray-600 mb-2 sm:mb-3 flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>Quick Search</span>
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {quickSearches.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(item.label)}
                      className={`group flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md text-xs sm:text-sm button-smooth ${
                        item.color === 'blue' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200' :
                        item.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' :
                        item.color === 'teal' ? 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200' :
                        item.color === 'purple' ? 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200' :
                        item.color === 'orange' ? 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200' :
                        item.color === 'pink' ? 'bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200' :
                        'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                      }`}
                    >
                      <item.icon className="h-3 w-3 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform duration-300" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Validation Messages */}
            {validationIssues.length > 0 && (
              <div className="mb-4 sm:mb-6 space-y-2">
                {validationIssues.map((issue, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 p-3 rounded-xl text-sm ${
                      issue.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                      issue.type === 'warning' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                      'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {issue.type === 'error' ? <AlertCircle className="h-4 w-4" /> :
                     issue.type === 'warning' ? <AlertCircle className="h-4 w-4" /> :
                     <CheckCircle className="h-4 w-4" />}
                    <span>{issue.message}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Advanced Filters Toggle - Enhanced */}
            <div className="mb-4 sm:mb-6">
              <button
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="group flex items-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl sm:rounded-2xl font-semibold text-gray-700 transition-all duration-300 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md text-sm sm:text-base hover:scale-105 button-smooth"
              >
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Advanced Filters</span>
                <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-500 ${isAdvancedOpen ? 'rotate-180' : ''}`} />
                {hasActiveFilters && (
                  <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                    {activeFilterCount}
                  </div>
                )}
              </button>
            </div>

            {/* Advanced Filter Grid - Enhanced with Better UX */}
            <div className={`transition-all duration-700 ease-out overflow-hidden ${
              isAdvancedOpen ? 'max-h-96 opacity-100 transform translate-y-0' : 'max-h-0 opacity-0 transform -translate-y-4'
            }`}>
              <div className="bg-gradient-to-br from-gray-50/80 to-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200/50 transform transition-all duration-500 hover:shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
                  
                  {/* Route/Area Filter - Enhanced */}
                  <div className="space-y-2 sm:space-y-3 transform transition-all duration-300 hover:scale-105">
                    <label className="block text-sm font-bold text-gray-700 flex items-center space-x-2">
                      <Route className="h-4 w-4 text-emerald-500" />
                      <span>Route/Area</span>
                      {routeFilter !== 'All' && <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>}
                    </label>
                    <div className="relative group">
                      <select
                        value={routeFilter}
                        onChange={(e) => onRouteFilterChange(e.target.value as RouteFilter)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-gray-900 appearance-none cursor-pointer hover:bg-gray-50 font-medium shadow-sm text-sm sm:text-base form-input"
                      >
                        <option value="All">All Areas ({routeAreas.length} available)</option>
                        {routeAreas.map((area) => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </div>

                  {/* Schedule Type Filter - Enhanced */}
                  <div className="space-y-2 sm:space-y-3 transform transition-all duration-300 hover:scale-105">
                    <label className="block text-sm font-bold text-gray-700 flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>Schedule Type</span>
                      {scheduleType !== 'All' && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </label>
                    <div className="relative group">
                      <select
                        value={scheduleType}
                        onChange={(e) => onScheduleTypeChange(e.target.value as ScheduleType)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 appearance-none cursor-pointer hover:bg-gray-50 font-medium shadow-sm text-sm sm:text-base form-input"
                      >
                        <option value="All">All Schedules</option>
                        <option value="Regular">Regular (Sat-Wed)</option>
                        <option value="Friday">Friday Only</option>
                      </select>
                      <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </div>

                  {/* Direction Filter - Enhanced */}
                  <div className="space-y-2 sm:space-y-3 transform transition-all duration-300 hover:scale-105">
                    <label className="block text-sm font-bold text-gray-700 flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-purple-500" />
                      <span>Direction</span>
                      {direction !== 'All' && <div className="w-2 h-2 bg-purple-500 rounded-full"></div>}
                    </label>
                    <div className="relative group">
                      <select
                        value={direction}
                        onChange={(e) => onDirectionChange(e.target.value as Direction)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 appearance-none cursor-pointer hover:bg-gray-50 font-medium shadow-sm text-sm sm:text-base form-input"
                      >
                        <option value="All">All Directions</option>
                        <option value="CityToIIUC">City → IIUC</option>
                        <option value="IIUCToCity">IIUC → City</option>
                        <option value="ToUniversity">To University</option>
                        <option value="FromUniversity">From University</option>
                      </select>
                      <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </div>

                  {/* Gender Filter - Enhanced */}
                  <div className="space-y-2 sm:space-y-3 transform transition-all duration-300 hover:scale-105">
                    <label className="block text-sm font-bold text-gray-700 flex items-center space-x-2">
                      <Users className="h-4 w-4 text-pink-500" />
                      <span>Gender</span>
                      {gender !== 'All' && <div className="w-2 h-2 bg-pink-500 rounded-full"></div>}
                    </label>
                    <div className="relative group">
                      <select
                        value={gender}
                        onChange={(e) => onGenderChange(e.target.value as Gender)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 text-gray-900 appearance-none cursor-pointer hover:bg-gray-50 font-medium shadow-sm text-sm sm:text-base form-input"
                      >
                        <option value="All">All</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </div>

                  {/* Bus Type Filter - Enhanced with Smart Validation */}
                  <div className={`space-y-2 sm:space-y-3 transform transition-all duration-300 hover:scale-105 ${scheduleType !== 'Friday' ? 'opacity-50' : ''}`}>
                    <label className="block text-sm font-bold text-gray-700 flex items-center space-x-2">
                      <Bus className="h-4 w-4 text-indigo-500" />
                      <span>Bus Type</span>
                      {busType !== 'All' && <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>}
                      {scheduleType !== 'Friday' && <AlertCircle className="h-3 w-3 text-yellow-500" />}
                    </label>
                    <div className="relative group">
                      <select
                        value={busType}
                        onChange={(e) => onBusTypeChange(e.target.value as BusType)}
                        disabled={scheduleType !== 'Friday'}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-gray-900 appearance-none cursor-pointer hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 font-medium shadow-sm text-sm sm:text-base form-input"
                      >
                        <option value="All">All Bus Types</option>
                        <option value="IIUC Bus">IIUC Bus</option>
                        <option value="IIUC A&H B">IIUC A&H B</option>
                        <option value="AC Bus">AC Bus</option>
                        <option value="Non-AC Bus">Non-AC Bus</option>
                      </select>
                      <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Filter Info Cards */}
            <div className="mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {scheduleType !== 'Friday' && busType !== 'All' && (
                <div className="p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl sm:rounded-2xl border border-yellow-200 shadow-sm transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                  <div className="flex items-center space-x-2 mb-1">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-bold text-yellow-700">Bus Type Filter Disabled</span>
                  </div>
                  <p className="text-xs sm:text-sm text-yellow-600">
                    Bus type filtering is only available for Friday schedules. Switch to Friday to filter by bus type.
                  </p>
                </div>
              )}
              
              {routeFilter !== 'All' && (
                <div className="p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl sm:rounded-2xl border border-emerald-200 shadow-sm transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                  <div className="flex items-center space-x-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-700">Route Filter Active</span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-600">
                    Showing schedules for <span className="font-semibold">"{routeFilter}"</span> area.
                  </p>
                </div>
              )}

              {hasActiveFilters && totalFiltered > 0 && (
                <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl border border-blue-200 shadow-sm transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                  <div className="flex items-center space-x-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-bold text-blue-700">Search Results</span>
                  </div>
                  <p className="text-xs sm:text-sm text-blue-600">
                    Found <span className="font-semibold">{totalFiltered}</span> schedules matching your criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FIXED: Live Updates Coming Soon Modal - Mobile Responsive */}
      {showLiveUpdatesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-slide-up">
          {/* Backdrop */}
          <div 
            className="absolute inset-0" 
            onClick={() => setShowLiveUpdatesModal(false)}
          />
          
          {/* FIXED: Modal Content - Fully Mobile Responsive */}
          <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-300 scale-100 max-h-[90vh] flex flex-col">
            
            {/* Header - Compact for Mobile */}
            <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white p-4 sm:p-6 text-center relative flex-shrink-0">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
              
              <button
                onClick={() => setShowLiveUpdatesModal(false)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              <div className="relative z-10">
                <div className="bg-white/20 rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                  <Zap className="h-6 w-6 sm:h-8 sm:w-8 animate-pulse" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Live Updates</h3>
                <p className="text-green-100 text-sm">Real-time schedule updates</p>
              </div>
            </div>

            {/* FIXED: Content - Scrollable on Mobile */}
            <div className="p-4 sm:p-6 text-center overflow-y-auto flex-1">
              <div className="mb-4 sm:mb-6">
                <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full p-2 sm:p-3 w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Coming Soon!</h4>
                <p className="text-gray-600 leading-relaxed text-sm">
                  We're developing a real-time update system that will automatically refresh bus schedules and notify you of any changes or delays.
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <h5 className="font-semibold text-green-900 mb-2 sm:mb-3 flex items-center justify-center space-x-2 text-sm sm:text-base">
                  <Navigation className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Upcoming Features</span>
                </h5>
                <ul className="text-xs sm:text-sm text-green-700 space-y-1.5 sm:space-y-2 text-left">
                  <li className="flex items-start space-x-2">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Real-time schedule updates and changes</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Instant notifications for delays or cancellations</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Live passenger count and bus capacity</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Weather-based schedule adjustments</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Emergency alerts and service announcements</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={() => setShowLiveUpdatesModal(false)}
                  className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Awesome! Keep me posted
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

export default SearchFilters;