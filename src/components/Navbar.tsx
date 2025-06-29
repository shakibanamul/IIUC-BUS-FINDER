import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, Menu, X, Clock, MapPin, Phone, Search, User, LogOut, Map } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, userProfile, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) &&
          menuButtonRef.current && !menuButtonRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
        setIsHovering(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsHovering(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Auto-close on route change (for SPA navigation)
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false);
      setIsHovering(false);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    // Auto-close menu after navigation
    setIsMobileMenuOpen(false);
    setIsHovering(false);
  };

  const getDashboardRoute = () => {
    if (!userProfile) return '/login';
    
    switch (userProfile.role) {
      case 'student':
        return '/student-dashboard';
      case 'teacher':
        return '/teacher-dashboard';
      case 'admin':
        return '/admin-dashboard';
      default:
        return '/login';
    }
  };

  const handleLogout = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
    setIsHovering(false);
  };

  const handleLinkClick = () => {
    // Auto-close menu when clicking any link
    setIsMobileMenuOpen(false);
    setIsHovering(false);
  };

  // Modern hover handlers for menu button
  const handleMenuButtonMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovering(true);
    setIsMobileMenuOpen(true);
  };

  const handleMenuButtonMouseLeave = () => {
    // Add a small delay before closing to prevent accidental closes
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isHovering) {
        setIsMobileMenuOpen(false);
      }
    }, 150);
  };

  const handleMenuMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovering(true);
  };

  const handleMenuMouseLeave = () => {
    setIsHovering(false);
    // Close menu after a short delay when mouse leaves menu area
    hoverTimeoutRef.current = setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 200);
  };

  const handleMenuButtonClick = () => {
    // Toggle menu on click (for touch devices)
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsHovering(!isMobileMenuOpen);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Section - Enhanced Mobile Responsiveness */}
          <Link 
            to="/" 
            onClick={handleLinkClick}
            className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0"
          >
            <div className="relative">
              <div className={`absolute inset-0 rounded-full blur-lg opacity-30 transition-colors ${
                isScrolled ? 'bg-blue-400' : 'bg-white'
              }`}></div>
              <div className={`relative rounded-full p-1.5 sm:p-2 border transition-all ${
                isScrolled 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-white/10 backdrop-blur-sm border-white/20'
              }`}>
                <img 
                  src="/iiuc.png" 
                  alt="IIUC"
                  className="h-6 w-6 sm:h-8 sm:w-8 object-contain"
                />
              </div>
            </div>
            
            {/* Desktop Logo Text - Full Title */}
            <div className="hidden md:block">
              <h1 className={`text-lg sm:text-xl font-bold transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                IIUC Bus Finder
              </h1>
              <p className={`text-xs sm:text-sm transition-colors ${
                isScrolled ? 'text-gray-600' : 'text-blue-200'
              }`}>
                Smart Transport Solution
              </p>
            </div>
            
            {/* Tablet Logo Text - Medium Title */}
            <div className="hidden sm:block md:hidden">
              <h1 className={`text-base sm:text-lg font-bold transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                IIUC Bus Finder
              </h1>
              <p className={`text-xs transition-colors ${
                isScrolled ? 'text-gray-600' : 'text-blue-200'
              }`}>
                Transport Solution
              </p>
            </div>
            
            {/* Mobile Logo Text - Full Title (Fixed) */}
            <div className="block sm:hidden">
              <h1 className={`text-sm font-bold transition-colors leading-tight ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                IIUC Bus Finder
              </h1>
              <p className={`text-xs transition-colors leading-tight ${
                isScrolled ? 'text-gray-600' : 'text-blue-200'
              }`}>
                Smart Transport
              </p>
            </div>
          </Link>

          {/* Desktop Navigation - Hidden on mobile/tablet */}
          <div className="hidden xl:flex items-center space-x-6">
            <button
              onClick={() => scrollToSection('home')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl font-medium transition-all hover:scale-105 ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Bus className="h-4 w-4" />
              <span>Home</span>
            </button>
            
            <button
              onClick={() => scrollToSection('search-filters')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl font-medium transition-all hover:scale-105 ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
            
            <button
              onClick={() => scrollToSection('schedules')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl font-medium transition-all hover:scale-105 ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>Schedules</span>
            </button>
            
            <Link
              to="/routes"
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl font-medium transition-all hover:scale-105 ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Map className="h-4 w-4" />
              <span>Route Maps</span>
            </Link>
          </div>

          {/* Right Side Actions - FIXED: Consistent Button Sizes */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Desktop User Authentication Section */}
            {user && userProfile ? (
              <div className="hidden lg:flex items-center space-x-3">
                <Link
                  to={getDashboardRoute()}
                  className={`flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 rounded-2xl font-semibold transition-all hover:scale-105 shadow-lg ${
                    isScrolled 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700' 
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    isScrolled 
                      ? 'text-red-600 hover:bg-red-50' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    isScrolled 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={`px-4 py-2 sm:px-6 sm:py-3 rounded-2xl font-semibold transition-all hover:scale-105 shadow-lg ${
                    isScrolled 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700' 
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
                  }`}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Contact Button - Hidden on small screens */}
            <a
              href="tel:+880-31-2510500"
              className={`hidden lg:flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 rounded-2xl font-semibold transition-all hover:scale-105 shadow-lg ${
                isScrolled 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700' 
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
              }`}
            >
              <Phone className="h-4 w-4" />
              <span>Contact</span>
            </a>

            {/* FIXED: Mobile Contact Button - Matching Size with Menu Button */}
            <a
              href="tel:+880-31-2510500"
              className={`lg:hidden w-11 h-11 rounded-xl transition-all shadow-md border flex items-center justify-center ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-100 border-gray-200' 
                  : 'text-white hover:bg-white/10 border-white/20'
              }`}
            >
              <Phone className="h-5 w-5" />
            </a>

            {/* ENHANCED: Mobile Menu Button with Hover/Drag Feature */}
            <button
              ref={menuButtonRef}
              onClick={handleMenuButtonClick}
              onMouseEnter={handleMenuButtonMouseEnter}
              onMouseLeave={handleMenuButtonMouseLeave}
              className={`lg:hidden relative w-11 h-11 rounded-xl transition-all duration-300 shadow-md border flex items-center justify-center group ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-gray-100 border-gray-200' 
                  : 'text-white hover:bg-white/10 border-white/20'
              } ${isMobileMenuOpen ? 'scale-110 shadow-lg' : ''}`}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {/* User Status Indicator */}
              {user && userProfile && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              )}
              
              {/* Enhanced Icon with Smooth Transition */}
              <div className="relative">
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 transition-all duration-300 rotate-90 group-hover:rotate-180" />
                ) : (
                  <Menu className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                )}
              </div>

              {/* Hover Indicator */}
              <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                isMobileMenuOpen 
                  ? 'bg-blue-500/20 scale-110' 
                  : 'bg-transparent scale-100 group-hover:bg-blue-500/10 group-hover:scale-105'
              }`}></div>
            </button>
          </div>
        </div>

        {/* ENHANCED: Mobile Menu with Hover/Drag Support */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop for click-outside detection */}
            <div 
              className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsHovering(false);
              }}
            />
            
            {/* ENHANCED: Mobile Menu Container with Hover Support */}
            <div 
              ref={mobileMenuRef}
              onMouseEnter={handleMenuMouseEnter}
              onMouseLeave={handleMenuMouseLeave}
              className="lg:hidden absolute top-full left-4 right-4 mt-2 bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-2xl rounded-2xl overflow-hidden z-50 max-h-[80vh] overflow-y-auto transform transition-all duration-300 ease-out animate-fade-slide-up"
              style={{
                animation: isMobileMenuOpen 
                  ? 'fadeSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards' 
                  : 'fadeSlideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards'
              }}
            >
              <div className="p-4 space-y-3">
                
                {/* Hover Indicator */}
                <div className="text-center py-2 border-b border-gray-200">
                  <p className="text-xs text-gray-500 flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Hover or click to navigate</span>
                  </p>
                </div>
                
                {/* User Info Section - Compact */}
                {user && userProfile && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200 mb-3 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 text-sm truncate">{userProfile.name}</p>
                        <p className="text-xs text-gray-600">{userProfile.university_id} • {userProfile.role}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Links - Enhanced with Hover Effects */}
                <div className="space-y-1">
                  <button
                    onClick={() => scrollToSection('home')}
                    className="flex items-center space-x-3 w-full px-3 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 text-sm font-medium group hover:scale-[1.02] hover:shadow-sm"
                  >
                    <Bus className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    <span>Home</span>
                  </button>
                  
                  <button
                    onClick={() => scrollToSection('search-filters')}
                    className="flex items-center space-x-3 w-full px-3 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 text-sm font-medium group hover:scale-[1.02] hover:shadow-sm"
                  >
                    <Search className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    <span>Search Schedules</span>
                  </button>
                  
                  <button
                    onClick={() => scrollToSection('schedules')}
                    className="flex items-center space-x-3 w-full px-3 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 text-sm font-medium group hover:scale-[1.02] hover:shadow-sm"
                  >
                    <Clock className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    <span>All Schedules</span>
                  </button>
                  
                  <Link
                    to="/routes"
                    onClick={handleLinkClick}
                    className="flex items-center space-x-3 w-full px-3 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 text-sm font-medium group hover:scale-[1.02] hover:shadow-sm"
                  >
                    <Map className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    <span>Route Maps</span>
                  </Link>
                </div>
                
                {/* Authentication Section - Enhanced with Hover Effects */}
                <div className="pt-3 border-t border-gray-200">
                  {user && userProfile ? (
                    <div className="space-y-2">
                      {/* Dashboard Button */}
                      <Link
                        to={getDashboardRoute()}
                        onClick={handleLinkClick}
                        className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm hover:scale-[1.02]"
                      >
                        <User className="h-4 w-4" />
                        <span>Go to Dashboard</span>
                      </Link>

                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-all duration-200 border border-red-200 text-sm hover:scale-[1.02] hover:shadow-sm"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Welcome Message - Compact */}
                      <div className="text-center py-2">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">Welcome to IIUC Bus Finder</h3>
                        <p className="text-xs text-gray-600">Login or create account for personalized features</p>
                      </div>

                      {/* Authentication Buttons - Enhanced with Hover Effects */}
                      <div className="space-y-2">
                        <Link
                          to="/login"
                          onClick={handleLinkClick}
                          className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 bg-white text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-all duration-200 shadow-sm border border-blue-200 text-sm hover:scale-[1.02] hover:shadow-md"
                        >
                          <User className="h-4 w-4" />
                          <span>Login</span>
                        </Link>
                        
                        <Link
                          to="/signup"
                          onClick={handleLinkClick}
                          className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm hover:scale-[1.02]"
                        >
                          <span>Sign Up</span>
                        </Link>
                      </div>

                      {/* Benefits List - Compact */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200 hover:shadow-sm transition-all duration-200">
                        <h4 className="font-semibold text-green-900 mb-1 text-xs">📋 Account Benefits:</h4>
                        <ul className="text-xs text-green-700 space-y-0.5">
                          <li>• Personalized schedules</li>
                          <li>• Submit feedback</li>
                          <li>• Real-time notifications</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Close Menu Hint */}
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-center text-xs text-gray-500 flex items-center justify-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>Hover away or tap outside to close</span>
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;