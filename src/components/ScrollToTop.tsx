import React, { useState, useEffect } from 'react';
import { Rocket } from 'lucide-react';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Rocket launch animation and scroll to top
  const launchRocket = () => {
    setIsLaunching(true);
    
    // Start scroll after a brief delay to show launch animation
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 300);

    // Reset launch animation after scroll completes
    setTimeout(() => {
      setIsLaunching(false);
    }, 1500);
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-6 right-6 z-50 gpu-accelerated">
          {/* Rocket Button - Enhanced Smoothness */}
          <button
            onClick={launchRocket}
            disabled={isLaunching}
            className={`group relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white p-4 rounded-full shadow-2xl hover:shadow-orange-500/25 transition-all duration-500 ease-out border-2 border-white/20 backdrop-blur-sm ${
              isLaunching 
                ? 'animate-rocket-launch cursor-not-allowed' 
                : 'hover:scale-110 animate-bounce-in hover:animate-rocket-hover transform-gpu'
            }`}
            aria-label="Launch rocket to top"
          >
            <div className="relative">
              {/* Rocket Icon - Enhanced Animation */}
              <Rocket className={`h-6 w-6 relative z-10 transition-transform duration-500 ease-out ${
                isLaunching ? 'rotate-0' : 'group-hover:rotate-12 group-hover:scale-110'
              }`} />
              
              {/* Fire/Exhaust Effects - Ultra Smooth */}
              <div className={`absolute top-full left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-out ${
                isLaunching ? 'opacity-100 scale-100' : 'opacity-0 scale-50 group-hover:opacity-70 group-hover:scale-75'
              }`}>
                {/* Main Fire */}
                <div className="relative">
                  {/* Large flame */}
                  <div className={`w-4 h-8 bg-gradient-to-b from-yellow-400 via-orange-500 to-red-600 rounded-b-full animate-fire-flicker ${
                    isLaunching ? 'h-12 w-6' : ''
                  } transition-all duration-500 ease-out`}></div>
                  
                  {/* Side flames */}
                  <div className={`absolute -left-1 top-2 w-2 h-4 bg-gradient-to-b from-yellow-300 to-orange-400 rounded-b-full animate-fire-flicker-left ${
                    isLaunching ? 'h-6 w-3' : ''
                  } transition-all duration-500 ease-out`}></div>
                  <div className={`absolute -right-1 top-2 w-2 h-4 bg-gradient-to-b from-yellow-300 to-orange-400 rounded-b-full animate-fire-flicker-right ${
                    isLaunching ? 'h-6 w-3' : ''
                  } transition-all duration-500 ease-out`}></div>
                  
                  {/* Sparks - Enhanced */}
                  <div className={`absolute left-1/2 top-6 transform -translate-x-1/2 ${
                    isLaunching ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                  } transition-opacity duration-500`}>
                    <div className="w-1 h-1 bg-yellow-300 rounded-full animate-spark-1"></div>
                    <div className="w-0.5 h-0.5 bg-orange-400 rounded-full animate-spark-2 absolute -left-2 top-1"></div>
                    <div className="w-0.5 h-0.5 bg-red-400 rounded-full animate-spark-3 absolute left-2 top-1"></div>
                    <div className="w-1 h-1 bg-yellow-400 rounded-full animate-spark-4 absolute -left-1 top-2"></div>
                    <div className="w-0.5 h-0.5 bg-orange-300 rounded-full animate-spark-5 absolute left-1 top-2"></div>
                  </div>
                </div>
              </div>

              {/* Launch Trail Effect - Enhanced */}
              {isLaunching && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-1 h-20 bg-gradient-to-b from-orange-400 via-red-500 to-transparent opacity-80 animate-trail-fade"></div>
              )}

              {/* Pulsing Ring Effect - Smoother */}
              <div className={`absolute inset-0 rounded-full border-2 border-orange-400 ${
                isLaunching ? 'animate-ping' : 'opacity-0 group-hover:opacity-50'
              } transition-opacity duration-500`}></div>
              
              {/* Tooltip - Enhanced */}
              <div className={`absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg transition-all duration-300 whitespace-nowrap ${
                isLaunching ? 'opacity-0 scale-95' : 'opacity-0 group-hover:opacity-100 group-hover:scale-100'
              }`}>
                🚀 Launch to Top!
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </button>

          {/* Launch Success Message - Enhanced */}
          {isLaunching && (
            <div className="absolute bottom-full right-0 mb-4 px-4 py-2 bg-green-500 text-white text-sm rounded-lg animate-fade-slide-up shadow-lg transform transition-all duration-300">
              🚀 Launching to space! 
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ScrollToTop;