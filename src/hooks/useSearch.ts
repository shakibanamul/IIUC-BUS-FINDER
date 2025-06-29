import { useState, useMemo } from 'react';
import { BusSchedule, Direction, Gender, BusType, ScheduleType, RouteFilter } from '../types/BusSchedule';

export const useSearch = (schedules: BusSchedule[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [direction, setDirection] = useState<Direction>('All');
  const [gender, setGender] = useState<Gender>('All');
  const [busType, setBusType] = useState<BusType>('All');
  const [scheduleType, setScheduleType] = useState<ScheduleType>('All');
  const [routeFilter, setRouteFilter] = useState<RouteFilter>('All');

  // Extract unique route areas from schedules with better parsing
  const routeAreas = useMemo(() => {
    const areas = new Set<string>();
    schedules.forEach(schedule => {
      // Extract key areas from routes with improved parsing
      const routeParts = schedule.route.split(/[–—-]/).map(part => part.trim());
      routeParts.forEach(part => {
        if (part && part !== 'IIUC' && part.length > 2) {
          // Clean up common variations
          const cleanPart = part
            .replace(/\s+/g, ' ')
            .replace(/\(.*?\)/g, '') // Remove parentheses content
            .trim();
          if (cleanPart) {
            areas.add(cleanPart);
          }
        }
      });
      
      // Also add starting points and end points
      if (schedule.startingPoint && schedule.startingPoint !== 'IIUC') {
        areas.add(schedule.startingPoint);
      }
      if (schedule.endPoint && schedule.endPoint !== 'IIUC') {
        areas.add(schedule.endPoint);
      }
    });
    
    return Array.from(areas).sort();
  }, [schedules]);

  // Enhanced filtering logic with better search capabilities
  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      // Enhanced search matching with multiple criteria
      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch = searchTerm === '' || 
        schedule.time.toLowerCase().includes(searchLower) ||
        schedule.startingPoint.toLowerCase().includes(searchLower) ||
        schedule.route.toLowerCase().includes(searchLower) ||
        schedule.endPoint.toLowerCase().includes(searchLower) ||
        (schedule.busType && schedule.busType.toLowerCase().includes(searchLower)) ||
        (schedule.remarks && schedule.remarks.toLowerCase().includes(searchLower)) ||
        (schedule.description && schedule.description.toLowerCase().includes(searchLower)) ||
        // Additional search patterns
        (searchLower.includes('morning') && schedule.time.match(/^[6-9]:/)) ||
        (searchLower.includes('afternoon') && schedule.time.match(/^1[0-6]:/)) ||
        (searchLower.includes('evening') && schedule.time.match(/^1[7-9]:|^2[0-3]:/)) ||
        (searchLower.includes('ac') && schedule.busType?.toLowerCase().includes('ac')) ||
        (searchLower.includes('friday') && schedule.scheduleType === 'Friday') ||
        (searchLower.includes('regular') && schedule.scheduleType === 'Regular');

      // Direction filtering
      const matchesDirection = direction === 'All' || schedule.direction === direction;
      
      // Gender filtering
      const matchesGender = gender === 'All' || schedule.gender === gender;
      
      // Bus type filtering (only applicable for Friday schedules)
      const matchesBusType = busType === 'All' || 
        (schedule.busType && schedule.busType === busType);
      
      // Schedule type filtering
      const matchesScheduleType = scheduleType === 'All' || schedule.scheduleType === scheduleType;
      
      // Enhanced route filtering with fuzzy matching
      const matchesRoute = routeFilter === 'All' || 
        schedule.route.toLowerCase().includes(routeFilter.toLowerCase()) ||
        schedule.startingPoint.toLowerCase().includes(routeFilter.toLowerCase()) ||
        schedule.endPoint.toLowerCase().includes(routeFilter.toLowerCase()) ||
        // Fuzzy matching for common variations
        (routeFilter.toLowerCase().includes('bot') && schedule.route.toLowerCase().includes('bahaddarhat')) ||
        (routeFilter.toLowerCase().includes('bahaddarhat') && schedule.route.toLowerCase().includes('bot'));

      return matchesSearch && matchesDirection && matchesGender && matchesBusType && matchesScheduleType && matchesRoute;
    });
  }, [schedules, searchTerm, direction, gender, busType, scheduleType, routeFilter]);

  // Check if any filters are active
  const isSearching = searchTerm !== '' || direction !== 'All' || gender !== 'All' || 
                     busType !== 'All' || scheduleType !== 'All' || routeFilter !== 'All';

  // Reset all filters function
  const resetAllFilters = () => {
    setSearchTerm('');
    setDirection('All');
    setGender('All');
    setBusType('All');
    setScheduleType('All');
    setRouteFilter('All');
  };

  // Quick filter presets
  const applyQuickFilter = (filterType: string) => {
    resetAllFilters();
    
    switch (filterType) {
      case 'morning':
        setSearchTerm('morning');
        break;
      case 'friday':
        setScheduleType('Friday');
        break;
      case 'female':
        setGender('Female');
        break;
      case 'male':
        setGender('Male');
        break;
      case 'ac':
        setScheduleType('Friday');
        setBusType('AC Bus');
        break;
      case 'bot':
        setRouteFilter('BOT');
        break;
      case 'agrabad':
        setRouteFilter('Agrabad');
        break;
      case 'chatteswari':
        setRouteFilter('Chatteswari');
        break;
      default:
        setSearchTerm(filterType);
    }
  };

  return {
    // State
    searchTerm,
    direction,
    gender,
    busType,
    scheduleType,
    routeFilter,
    
    // Setters
    setSearchTerm,
    setDirection,
    setGender,
    setBusType,
    setScheduleType,
    setRouteFilter,
    
    // Computed values
    routeAreas,
    filteredSchedules,
    isSearching,
    
    // Helper functions
    resetAllFilters,
    applyQuickFilter,
    
    // Statistics
    totalFiltered: filteredSchedules.length,
    totalAvailable: schedules.length,
    activeFilterCount: [
      searchTerm !== '',
      direction !== 'All',
      gender !== 'All',
      busType !== 'All',
      scheduleType !== 'All',
      routeFilter !== 'All'
    ].filter(Boolean).length
  };
};