import React from 'react';
import { Phone, Mail, MapPin, Heart, ExternalLink, Clock, Bus, Users, Globe, MessageCircle, Navigation } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white mt-12 sm:mt-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.02%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      {/* Top Wave */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" fill="none" className="w-full h-6 sm:h-8 transform rotate-180">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="rgb(248 250 252)" />
        </svg>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-12 lg:pb-16">
        {/* FIXED: Main Footer Content - Mobile First Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
          
          {/* IIUC Transport Cell - Mobile Optimized */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 lg:mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                IIUC Transport
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                Safe and reliable transportation for IIUC community.
              </p>
            </div>
            
            {/* Contact Info - Mobile Stack */}
            <div className="space-y-2 sm:space-y-3">
              <a 
                href="tel:+880-31-2510500"
                className="flex items-center space-x-2 sm:space-x-3 group hover:text-blue-300 transition-colors"
              >
                <div className="bg-blue-500/20 rounded-lg p-1.5 sm:p-2 group-hover:bg-blue-500/30 transition-colors">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                </div>
                <span className="text-xs sm:text-sm font-medium">+880-31-2510500</span>
              </a>
              
              <a 
                href="mailto:transport@iiuc.ac.bd"
                className="flex items-center space-x-2 sm:space-x-3 group hover:text-emerald-300 transition-colors"
              >
                <div className="bg-emerald-500/20 rounded-lg p-1.5 sm:p-2 group-hover:bg-emerald-500/30 transition-colors">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400" />
                </div>
                <span className="text-xs sm:text-sm font-medium">transport@iiuc.ac.bd</span>
              </a>
              
              <div className="flex items-center space-x-2 sm:space-x-3 text-gray-300">
                <div className="bg-purple-500/20 rounded-lg p-1.5 sm:p-2">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                </div>
                <span className="text-xs sm:text-sm">Kumira, Chittagong</span>
              </div>
            </div>
          </div>

          {/* Quick Links - Mobile Optimized */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 lg:mb-4 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <a 
                href="https://iiuc.ac.bd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 sm:space-x-3 text-gray-300 hover:text-white transition-colors group"
              >
                <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-medium">IIUC Website</span>
                <ExternalLink className="h-2 w-2 sm:h-3 sm:w-3 opacity-60" />
              </a>
              
              <a 
                href="https://www.facebook.com/iiuc.ac.bd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 sm:space-x-3 text-gray-300 hover:text-white transition-colors group"
              >
                <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-medium">IIUC Facebook</span>
                <ExternalLink className="h-2 w-2 sm:h-3 sm:w-3 opacity-60" />
              </a>
              
              <a 
                href="https://www.facebook.com/groups/186698172643552" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 sm:space-x-3 text-gray-300 hover:text-white transition-colors group"
              >
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-medium">IIUC Community</span>
                <ExternalLink className="h-2 w-2 sm:h-3 sm:w-3 opacity-60" />
              </a>
              
              <a 
                href="https://www.iiuc.ac.bd/home/transport" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 sm:space-x-3 text-gray-300 hover:text-white transition-colors group"
              >
                <Navigation className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-medium">Transport Info</span>
                <ExternalLink className="h-2 w-2 sm:h-3 sm:w-3 opacity-60" />
              </a>
            </div>
          </div>

          {/* Service Hours - Mobile Stack */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 lg:mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Service Hours
            </h3>
            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
              <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                  <span className="font-semibold text-white text-xs sm:text-sm">Regular Days</span>
                </div>
                <p className="text-gray-300 text-xs mb-1">Saturday - Wednesday</p>
                <p className="text-white font-semibold text-xs sm:text-sm">6:40 AM - 4:35 PM</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400" />
                  <span className="font-semibold text-white text-xs sm:text-sm">Friday</span>
                </div>
                <p className="text-gray-300 text-xs mb-1">Special Schedule</p>
                <p className="text-white font-semibold text-xs sm:text-sm">7:30 AM - 6:30 PM</p>
              </div>
            </div>
          </div>

          {/* Statistics - Mobile 2x2 Grid */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 lg:mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Service Stats
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-2 sm:p-3 border border-blue-500/30 text-center">
                <Bus className="h-4 w-4 sm:h-6 sm:w-6 text-blue-400 mb-1 mx-auto" />
                <div className="text-sm sm:text-lg font-bold text-white">50+</div>
                <div className="text-xs text-blue-200">Routes</div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl p-2 sm:p-3 border border-emerald-500/30 text-center">
                <Users className="h-4 w-4 sm:h-6 sm:w-6 text-emerald-400 mb-1 mx-auto" />
                <div className="text-sm sm:text-lg font-bold text-white">2K+</div>
                <div className="text-xs text-emerald-200">Users</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-xl p-2 sm:p-3 border border-purple-500/30 text-center">
                <MapPin className="h-4 w-4 sm:h-6 sm:w-6 text-purple-400 mb-1 mx-auto" />
                <div className="text-sm sm:text-lg font-bold text-white">15+</div>
                <div className="text-xs text-purple-200">Areas</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-2 sm:p-3 border border-orange-500/30 text-center">
                <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-orange-400 mb-1 mx-auto" />
                <div className="text-sm sm:text-lg font-bold text-white">24/7</div>
                <div className="text-xs text-orange-200">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* FIXED: Bottom Section - Mobile Responsive */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8">
          <div className="flex flex-col space-y-4 sm:space-y-6 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
            <div className="text-center lg:text-left">
              <p className="text-gray-400 text-xs sm:text-sm">
                © 2025 IIUC Bus Finder. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            {/* FIXED: Developer Contact Section - Mobile Stack */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 border border-blue-500/20 w-full lg:w-auto">
              <div className="text-center lg:text-left mb-2 sm:mb-3">
                <span className="text-gray-300 text-xs sm:text-sm">Developed with</span>
                <Heart className="inline h-3 w-3 text-red-400 mx-1" />
                <span className="text-white font-semibold text-xs sm:text-sm">by Md Anamul Haque</span>
              </div>
              
              {/* FIXED: Developer Contact Info - Mobile Stack */}
              <div className="space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:justify-center lg:justify-start sm:gap-2 lg:gap-4">
                {/* Phone */}
                <a
                  href="tel:+8801680478706"
                  className="flex items-center justify-center sm:justify-start space-x-1.5 sm:space-x-2 text-green-300 hover:text-green-400 transition-colors group"
                >
                  <div className="bg-green-500/20 rounded-lg p-1 group-hover:bg-green-500/30 transition-colors">
                    <Phone className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </div>
                  <span className="text-xs font-medium">+880 1680-478706</span>
                </a>
                
                {/* Email */}
                <a
                  href="mailto:anamulshakib6450@gmail.com"
                  className="flex items-center justify-center sm:justify-start space-x-1.5 sm:space-x-2 text-blue-300 hover:text-blue-400 transition-colors group"
                >
                  <div className="bg-blue-500/20 rounded-lg p-1 group-hover:bg-blue-500/30 transition-colors">
                    <Mail className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </div>
                  <span className="text-xs font-medium">Email</span>
                </a>
                
                {/* Social Links - Mobile Center */}
                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <a
                    href="https://github.com/Anamulc211001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition text-xs underline"
                  >
                    GitHub
                  </a>
                  <span className="text-gray-500 text-xs">•</span>
                  <a
                    href="https://www.linkedin.com/in/md-anamul-haque-shakib/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition text-xs underline"
                  >
                    LinkedIn
                  </a>
                  <span className="text-gray-500 text-xs">•</span>
                  <a
                    href="https://www.behance.net/mdanamulhaque6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition text-xs underline"
                  >
                    Behance
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;