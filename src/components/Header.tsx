import React from 'react';
import { Bus, GraduationCap, Clock } from 'lucide-react';

const Header: React.FC = () => {
  return (
<header
  className="relative bg-cover bg-center bg-no-repeat text-white overflow-hidden h-[500px] sm:h-[600px] lg:h-[700px] pt-16 sm:pt-20 gpu-accelerated"
  style={{ backgroundImage: "url('/bg-iiuc3.png')" }}
>
  {/* Overlay for readability - Enhanced */}
<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent z-0 transition-all duration-700"></div>

  {/* Background Pattern - Animated */}
  <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-10 z-0 animate-gradient-shift"></div>

  <div className="relative container mx-auto px-4 sm:px-6 py-8 sm:py-12 z-10">
    <div className="text-center max-w-4xl mx-auto">

      {/* Animated Bus Icon - Enhanced */}
      <div className="hidden lg:block absolute top-20 right-10 opacity-10">
        <div className="animate-bus-drive transform transition-all duration-700 hover:scale-110">
          <Bus className="h-24 w-24 xl:h-32 xl:w-32 text-white transform" />
        </div>
      </div>  
      
      {/* Logo Section - Enhanced Smoothness */}
<div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-6 animate-fade-slide-up">
  <div className="relative transform transition-all duration-500 hover:scale-110">
    <div className="absolute inset-0 bg-blue-400 rounded-full blur-lg opacity-30 transition-all duration-500 hover:opacity-50"></div>
    <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-3 sm:p-4 border border-white/20 transition-all duration-300 hover:bg-white/20 hover:border-white/40">
      <img 
        src="/iiuc.png" 
        alt="iiuc"
        className="h-8 w-8 sm:h-10 sm:w-10 object-contain z-10 transition-transform duration-300 hover:rotate-12"
      />
    </div>
  </div>

  <div className="h-8 sm:h-12 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent transition-all duration-500"></div>

  <div className="relative transform transition-all duration-500 hover:scale-110">
    <div className="absolute inset-0 bg-emerald-400 rounded-full blur-lg opacity-30 transition-all duration-500 hover:opacity-50"></div>
    <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-3 sm:p-4 border border-white/20 transition-all duration-300 hover:bg-white/20 hover:border-white/40">
      <Bus className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-300 transition-transform duration-300 hover:rotate-12" />
    </div>
  </div>
</div>

{/* Title Section - Ultra Smooth Animations */}
<div className="space-y-3 sm:space-y-4">
  
  {/* Main Title - Enhanced Smoothness */}
  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent leading-tight animate-magnetic-pull px-2 transform transition-all duration-700 hover:scale-105">
    IIUC Bus Schedule 2025
  </h1>

  {/* Subtitle - Enhanced */}
  <div className="flex items-center justify-center space-x-2 sm:space-x-3 text-blue-200 animate-fade-slide-up px-4 transform transition-all duration-500 hover:scale-105" style={{ animationDelay: '0.3s' }}>
    <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent flex-1 max-w-12 sm:max-w-20 transition-all duration-500"></div>
    <p className="text-sm sm:text-base lg:text-lg font-medium text-center">International Islamic University Chittagong</p>
    <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent flex-1 max-w-12 sm:max-w-20 transition-all duration-500"></div>
  </div>

  {/* Description - Enhanced Marquee */}
  <div className="overflow-hidden w-full animate-fade-slide-up px-4 transform transition-all duration-500 hover:scale-105" style={{ animationDelay: '0.6s' }}>
    <p className="text-blue-100/80 text-sm sm:text-base lg:text-lg whitespace-nowrap animate-marquee font-medium transition-all duration-500 hover:text-blue-100">
      Find your perfect bus schedule with our comprehensive search system. Filter by time, location, and preferences for a seamless commute experience.
    </p>
  </div>
</div>

          {/* FIXED: Mobile Stats Boxes - Now All 3 Boxes Show on Mobile */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-8 mt-12 sm:mt-16 lg:mt-20 px-2 sm:px-4">
            
            {/* Daily Schedules Box - Mobile Optimized */}
            <div className="group bg-gradient-to-br from-blue-900/40 to-indigo-900/40 backdrop-blur-sm rounded-lg sm:rounded-2xl p-2 sm:p-4 lg:p-6 border border-white/10 animate-fade-slide-up hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:border-blue-400/30 cursor-pointer card-hover transform-gpu" style={{ animationDelay: '0.9s' }}>
              <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-2 mb-1 sm:mb-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-300 animate-pulse-grow relative z-10 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-base sm:text-xl lg:text-2xl font-bold text-white group-hover:text-blue-200 transition-colors duration-300">50+</span>
              </div>
              <p className="text-blue-200 text-xs sm:text-sm group-hover:text-white transition-colors duration-300 text-center leading-tight">Daily Schedules</p>
              
              {/* Hover Effect Glow - Enhanced */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 rounded-lg sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            {/* Routes Available Box - Mobile Optimized */}
            <div className="group bg-gradient-to-br from-emerald-900/40 to-green-900/40 backdrop-blur-sm rounded-lg sm:rounded-2xl p-2 sm:p-4 lg:p-6 border border-white/10 animate-fade-slide-up hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:border-emerald-400/30 cursor-pointer card-hover transform-gpu" style={{ animationDelay: '1.1s' }}>
              <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-2 mb-1 sm:mb-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                  <Bus className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-emerald-300 animate-pulse-grow relative z-10 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-base sm:text-xl lg:text-2xl font-bold text-white group-hover:text-emerald-200 transition-colors duration-300">15+</span>
              </div>
              <p className="text-blue-200 text-xs sm:text-sm group-hover:text-white transition-colors duration-300 text-center leading-tight">Routes Available</p>
              
              {/* Hover Effect Glow - Enhanced */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 rounded-lg sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            {/* Service Support Box - Mobile Optimized */}
            <div className="group bg-gradient-to-br from-purple-900/40 to-violet-900/40 backdrop-blur-sm rounded-lg sm:rounded-2xl p-2 sm:p-4 lg:p-6 border border-white/10 animate-fade-slide-up hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:border-purple-400/30 cursor-pointer card-hover transform-gpu" style={{ animationDelay: '1.3s' }}>
              <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-2 mb-1 sm:mb-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-400 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                  <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-300 animate-pulse-grow relative z-10 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-base sm:text-xl lg:text-2xl font-bold text-white group-hover:text-purple-200 transition-colors duration-300">24/7</span>
              </div>
              <p className="text-blue-200 text-xs sm:text-sm group-hover:text-white transition-colors duration-300 text-center leading-tight">Service Support</p>
              
              {/* Hover Effect Glow - Enhanced */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 rounded-lg sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Wave - Enhanced */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" fill="none" className="w-full h-6 sm:h-8 transition-all duration-500">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="rgb(248 250 252)" />
        </svg>
      </div>
    </header>
  );
};

export default Header;