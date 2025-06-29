import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Clock, MapPin, Bus, Phone, Mail, ExternalLink, Zap, Star, Github, Linkedin, Palette, Route, Calendar, Users } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  suggestions?: string[];
}

interface AIAssistantProps {
  schedules: any[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ schedules }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Hi! I'm your IIUC Smart Bus Assistant! I can help you find specific bus schedules, routes, timings, and answer any transport-related questions. Ask me anything about IIUC buses! 🚌✨",
      isBot: true,
      timestamp: new Date(),
      suggestions: [
        "Show buses from BOT at 7:00 AM",
        "Female buses to IIUC morning",
        "Friday AC bus schedule",
        "Who is Anamul Haque?"
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // SMART AI Response Logic with EXACT answers and ROUTE INTELLIGENCE
  const generateResponse = (userMessage: string): { text: string; suggestions?: string[] } => {
    const message = userMessage.toLowerCase();
    
    // WHO IS ANAMUL HAQUE - Exact answer
    if (
      message.includes('who is anamul') ||
      message.includes('anamul haque') ||
      message.includes('who is the developer') ||
      message.includes('who developed') ||
      message.includes('who made') ||
      message.includes('who created') ||
      (message.includes('developer') && !message.includes('bus')) ||
      message.includes('creator')
    ) {
      return {
        text: "Anamul Haque is the developer of this website and he is a CS engineer & UI/UX designer.",
        suggestions: [
          "Get his phone number",
          "Get his email",
          "View his LinkedIn",
          "View his Behance",
          "Back to bus schedules"
        ]
      };
    }

    // PHONE NUMBER - Exact answer
    if (
      (message.includes('phone') || message.includes('number') || message.includes('mobile') || message.includes('call')) &&
      (message.includes('anamul') || message.includes('developer') || message.includes('his') || message.includes('contact'))
    ) {
      return {
        text: "+880 1680-478706",
        suggestions: [
          "Call now",
          "Get his email",
          "View LinkedIn",
          "View Behance",
          "Back to schedules"
        ]
      };
    }

    // EMAIL - Exact answer
    if (
      (message.includes('email') || message.includes('mail')) &&
      (message.includes('anamul') || message.includes('developer') || message.includes('his'))
    ) {
      return {
        text: "anamulshakib6450@gmail.com",
        suggestions: [
          "Send email",
          "Get his phone",
          "View LinkedIn",
          "View Behance",
          "Back to schedules"
        ]
      };
    }

    // LINKEDIN - Exact answer
    if (
      message.includes('linkedin') &&
      (message.includes('anamul') || message.includes('developer') || message.includes('his'))
    ) {
      return {
        text: "https://www.linkedin.com/in/md-anamul-haque-shakib/",
        suggestions: [
          "Visit LinkedIn",
          "Get his phone",
          "Get his email",
          "View Behance",
          "Back to schedules"
        ]
      };
    }

    // BEHANCE - Exact answer
    if (
      message.includes('behance') &&
      (message.includes('anamul') || message.includes('developer') || message.includes('his'))
    ) {
      return {
        text: "https://www.behance.net/mdanamulhaque6",
        suggestions: [
          "Visit Behance",
          "Get his phone",
          "Get his email",
          "View LinkedIn",
          "Back to schedules"
        ]
      };
    }

    // GITHUB - Exact answer
    if (
      message.includes('github') &&
      (message.includes('anamul') || message.includes('developer') || message.includes('his'))
    ) {
      return {
        text: "https://github.com/Anamulc211001",
        suggestions: [
          "Visit GitHub",
          "Get his phone",
          "Get his email",
          "View LinkedIn",
          "Back to schedules"
        ]
      };
    }

    // ===== SMART BUS SCHEDULE QUERIES =====

    // SPECIFIC TIME QUERIES (e.g., "7:00 AM buses", "buses at 8:30")
    const timeMatch = message.match(/(\d{1,2}):?(\d{0,2})\s*(am|pm)?/i);
    if (timeMatch) {
      let hour = parseInt(timeMatch[1]);
      const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      const period = timeMatch[3]?.toLowerCase();
      
      // Convert to 24-hour format
      if (period === 'pm' && hour !== 12) hour += 12;
      if (period === 'am' && hour === 12) hour = 0;
      
      const searchTime = `${hour}:${minute.toString().padStart(2, '0')}`;
      const displayTime = timeMatch[0];
      
      const timeBuses = schedules.filter(s => {
        const busTime = s.time.toLowerCase();
        return busTime.includes(displayTime.toLowerCase()) || 
               busTime.includes(searchTime) ||
               busTime.includes(`${hour}:${minute.toString().padStart(2, '0')}`);
      });

      if (timeBuses.length > 0) {
        let response = `🕐 Found ${timeBuses.length} bus(es) at ${displayTime}:\n\n`;
        timeBuses.forEach((bus, index) => {
          response += `${index + 1}. ${bus.time} - ${bus.startingPoint} → ${bus.endPoint}\n`;
          response += `   Route: ${bus.route}\n`;
          if (bus.gender) response += `   Gender: ${bus.gender}\n`;
          if (bus.scheduleType) response += `   Schedule: ${bus.scheduleType}\n`;
          response += `\n`;
        });
        
        return {
          text: response,
          suggestions: [
            "More morning buses",
            "Friday schedules",
            "Return timings",
            "Route details"
          ]
        };
      }
    }

    // ROUTE-SPECIFIC QUERIES (e.g., "buses from BOT", "Agrabad to IIUC")
    const routeKeywords = ['bot', 'agrabad', 'chatteswari', 'baroyarhat', 'hathazari', 'kotowali', 'cuet', 'gec', 'oxygen', 'navy hospital', 'lucky plaza', 'kaptai', 'shah amanath'];
    const foundRoute = routeKeywords.find(keyword => message.includes(keyword));
    
    if (foundRoute || message.includes('from') || message.includes('to')) {
      let routeBuses = [];
      
      if (foundRoute) {
        routeBuses = schedules.filter(s => 
          s.startingPoint.toLowerCase().includes(foundRoute) ||
          s.route.toLowerCase().includes(foundRoute) ||
          s.endPoint.toLowerCase().includes(foundRoute)
        );
      }

      if (routeBuses.length > 0) {
        let response = `🚌 Found ${routeBuses.length} bus(es) for ${foundRoute?.toUpperCase() || 'your route'}:\n\n`;
        
        // Group by schedule type
        const regularBuses = routeBuses.filter(b => b.scheduleType === 'Regular');
        const fridayBuses = routeBuses.filter(b => b.scheduleType === 'Friday');
        
        if (regularBuses.length > 0) {
          response += `📅 REGULAR SCHEDULE (Sat-Wed):\n`;
          regularBuses.forEach((bus, index) => {
            response += `• ${bus.time} - ${bus.startingPoint} → ${bus.endPoint}`;
            if (bus.gender) response += ` (${bus.gender})`;
            response += `\n`;
          });
          response += `\n`;
        }
        
        if (fridayBuses.length > 0) {
          response += `🕌 FRIDAY SCHEDULE:\n`;
          fridayBuses.forEach((bus, index) => {
            response += `• ${bus.time} - ${bus.startingPoint} → ${bus.endPoint}`;
            if (bus.busType) response += ` (${bus.busType})`;
            response += `\n`;
          });
        }
        
        return {
          text: response,
          suggestions: [
            "Route details",
            "Travel time",
            "Return buses",
            "Alternative routes"
          ]
        };
      }
    }

    // GENDER-SPECIFIC QUERIES
    if (message.includes('female') || message.includes('women') || message.includes('girls') || message.includes('ladies')) {
      const femaleBuses = schedules.filter(s => s.gender === 'Female');
      let response = `👩 FEMALE BUSES (${femaleBuses.length} schedules):\n\n`;
      
      // Group by time
      const morningFemale = femaleBuses.filter(s => {
        const hour = parseInt(s.time.split(':')[0]);
        return hour >= 6 && hour <= 9;
      });
      
      response += `🌅 MORNING BUSES:\n`;
      morningFemale.forEach(bus => {
        response += `• ${bus.time} - ${bus.startingPoint} → ${bus.endPoint}\n`;
      });
      
      const shuttleFemale = femaleBuses.filter(s => s.description?.includes('Shuttle'));
      if (shuttleFemale.length > 0) {
        response += `\n🔄 RETURN SHUTTLES:\n`;
        shuttleFemale.forEach(bus => {
          response += `• ${bus.time} - ${bus.startingPoint} → ${bus.endPoint}\n`;
        });
      }
      
      return {
        text: response,
        suggestions: [
          "Female morning buses",
          "Female return shuttles",
          "Safety features",
          "Pickup points"
        ]
      };
    }

    if (message.includes('male') || message.includes('men') || message.includes('boys')) {
      const maleBuses = schedules.filter(s => s.gender === 'Male');
      let response = `👨 MALE BUSES (${maleBuses.length} schedules):\n\n`;
      
      const morningMale = maleBuses.filter(s => {
        const hour = parseInt(s.time.split(':')[0]);
        return hour >= 8 && hour <= 10;
      });
      
      response += `🌅 MORNING BUSES:\n`;
      morningMale.forEach(bus => {
        response += `• ${bus.time} - ${bus.startingPoint} → ${bus.endPoint}\n`;
      });
      
      return {
        text: response,
        suggestions: [
          "Male morning buses",
          "CUET connection",
          "Male return shuttles",
          "Timing details"
        ]
      };
    }

    // FRIDAY SCHEDULE QUERIES
    if (message.includes('friday')) {
      const fridayBuses = schedules.filter(s => s.scheduleType === 'Friday');
      let response = `🕌 FRIDAY SPECIAL SCHEDULE (${fridayBuses.length} buses):\n\n`;
      
      // Group by direction
      const toUniversity = fridayBuses.filter(s => s.direction === 'ToUniversity');
      const fromUniversity = fridayBuses.filter(s => s.direction === 'FromUniversity');
      
      response += `➡️ TO UNIVERSITY:\n`;
      toUniversity.forEach(bus => {
        response += `• ${bus.time} - ${bus.startingPoint} → ${bus.endPoint}`;
        if (bus.busType) response += ` (${bus.busType})`;
        if (bus.remarks) response += ` - ${bus.remarks}`;
        response += `\n`;
      });
      
      response += `\n⬅️ FROM UNIVERSITY:\n`;
      fromUniversity.forEach(bus => {
        response += `• ${bus.time} - ${bus.startingPoint} → ${bus.endPoint}`;
        if (bus.busType) response += ` (${bus.busType})`;
        if (bus.remarks) response += ` - ${bus.remarks}`;
        response += `\n`;
      });
      
      return {
        text: response,
        suggestions: [
          "AC bus timings",
          "Teacher buses",
          "Student buses",
          "Return timings"
        ]
      };
    }

    // AC BUS QUERIES
    if (message.includes('ac') || message.includes('air condition')) {
      const acBuses = schedules.filter(s => s.busType?.includes('AC'));
      let response = `❄️ AC BUSES (${acBuses.length} schedules - Friday only):\n\n`;
      
      acBuses.forEach(bus => {
        response += `• ${bus.time} - ${bus.startingPoint} → ${bus.endPoint}\n`;
        response += `  Route: ${bus.route}\n`;
        if (bus.remarks) response += `  For: ${bus.remarks}\n`;
        response += `\n`;
      });
      
      return {
        text: response,
        suggestions: [
          "AC bus routes",
          "Teacher schedule",
          "Booking info",
          "Friday timings"
        ]
      };
    }

    // MORNING/EVENING QUERIES
    if (message.includes('morning') || message.includes('early')) {
      const morningBuses = schedules.filter(s => {
        const hour = parseInt(s.time.split(':')[0]);
        return hour >= 6 && hour <= 9;
      });
      
      let response = `🌅 MORNING BUSES (${morningBuses.length} schedules):\n\n`;
      
      // Group by gender
      const femaleMorning = morningBuses.filter(s => s.gender === 'Female');
      const maleMorning = morningBuses.filter(s => s.gender === 'Male');
      
      if (femaleMorning.length > 0) {
        response += `👩 FEMALE BUSES:\n`;
        femaleMorning.forEach(bus => {
          response += `• ${bus.time} - ${bus.startingPoint}\n`;
        });
        response += `\n`;
      }
      
      if (maleMorning.length > 0) {
        response += `👨 MALE BUSES:\n`;
        maleMorning.forEach(bus => {
          response += `• ${bus.time} - ${bus.startingPoint}\n`;
        });
      }
      
      return {
        text: response,
        suggestions: [
          "6:40 AM details",
          "Female morning buses",
          "Male morning buses",
          "Route information"
        ]
      };
    }

    // RETURN/SHUTTLE QUERIES
    if (message.includes('return') || message.includes('back') || message.includes('shuttle') || message.includes('iiuc to')) {
      const returnBuses = schedules.filter(s => 
        s.direction === 'IIUCToCity' || s.direction === 'FromUniversity'
      );
      
      let response = `🔄 RETURN SHUTTLES (${returnBuses.length} services):\n\n`;
      
      returnBuses.forEach(bus => {
        response += `• ${bus.time} - ${bus.startingPoint} → ${bus.endPoint}`;
        if (bus.gender) response += ` (${bus.gender})`;
        if (bus.description) response += ` - ${bus.description}`;
        response += `\n`;
      });
      
      return {
        text: response,
        suggestions: [
          "Shuttle timings",
          "Return routes",
          "Last shuttle",
          "Weekend returns"
        ]
      };
    }

    // GREETING RESPONSES
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return {
        text: "Hello! 👋 I'm your smart IIUC bus assistant. I can help you find specific bus schedules, routes, and timings. Try asking me:\n\n• 'Buses from BOT at 7:00 AM'\n• 'Female buses to IIUC'\n• 'Friday AC bus schedule'\n• 'Return shuttles from IIUC'\n\nWhat would you like to know?",
        suggestions: ["Morning buses", "Friday schedules", "Route information", "Who is Anamul Haque?"]
      };
    }

    // CONTACT INFORMATION (IIUC Transport)
    if (message.includes('contact') && !message.includes('developer')) {
      return {
        text: "📞 IIUC Transport Contact:\n• Phone: +880-31-2510500\n• Email: transport@iiuc.ac.bd\n• Address: Kumira, Chittagong-4318\n• Service Hours: 6:40 AM - 4:35 PM (Regular), 7:30 AM - 6:30 PM (Friday)",
        suggestions: ["Call transport", "Email query", "Office location", "Developer contact"]
      };
    }

    // ROUTE INFORMATION
    if (message.includes('route') || message.includes('path') || message.includes('way')) {
      return {
        text: "🗺️ IIUC buses cover 15+ major routes including:\n• Baroyarhat → Mirshorai → Sitakunda → IIUC\n• BOT → Muradpur → Baizid Link → IIUC\n• Agrabad → Boropool → AK Khan → IIUC\n• Chatteswari → GEC → Khulshi → IIUC\n• Hathazari → Borodighirpar → Baizid Link → IIUC",
        suggestions: ["Specific route details", "Travel time", "Stops information", "Alternative routes"]
      };
    }

    // HELP AND GENERAL QUERIES
    if (message.includes('help') || message.includes('assist') || message.includes('support')) {
      return {
        text: "🤝 I'm your smart bus assistant! I can help you with:\n\n🚌 **Bus Schedules:**\n• Specific time queries (e.g., '7:00 AM buses')\n• Route-based searches (e.g., 'buses from BOT')\n• Gender-specific buses\n• Friday special schedules\n\n📍 **Route Information:**\n• Detailed route maps\n• Travel times\n• Pickup points\n\n👨‍💻 **Developer Info:**\n• Contact details\n• Social profiles\n\nJust ask me anything!",
        suggestions: ["Find my bus", "Route planner", "Contact support", "Who is Anamul Haque?"]
      };
    }

    // DEFAULT SMART RESPONSE
    return {
      text: "🤔 I'd love to help! I'm a smart bus assistant and can answer specific questions like:\n\n• 'Show buses from BOT at 7:00 AM'\n• 'Female buses to IIUC morning'\n• 'Friday AC bus schedule'\n• 'Return shuttles from IIUC'\n• 'Route from Agrabad to IIUC'\n\nWhat specific bus information do you need?",
      suggestions: [
        "Morning buses from BOT",
        "Female buses 7:00 AM", 
        "Friday AC buses",
        "Who is Anamul Haque?"
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = generateResponse(inputText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        isBot: true,
        timestamp: new Date(),
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 seconds delay
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Toggle function with debugging
  const toggleChat = () => {
    console.log('AI Assistant button clicked, current state:', isOpen);
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Widget Button - Fixed positioning on left side */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={toggleChat}
          className={`group relative bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm ${
            isOpen ? 'scale-110' : 'hover:scale-110 animate-pulse'
          }`}
          aria-label="Open AI Assistant"
          type="button"
        >
          {/* Notification Badge */}
          {!isOpen && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-bounce">
              <Sparkles className="h-3 w-3" />
            </div>
          )}

          {/* Icon */}
          {isOpen ? (
            <X className="h-6 w-6 transition-transform duration-300" />
          ) : (
            <div className="relative">
              <Bot className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
          )}

          {/* Tooltip */}
          <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg transition-all duration-200 whitespace-nowrap ${
            isOpen ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
          }`}>
            🤖 Smart Bus Assistant
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      </div>

      {/* FIXED: Chat Window - Mobile Responsive with Proper Sizing */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-slide-up">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* FIXED: Chat Container - Mobile First Design */}
          <div className="relative w-full h-full sm:w-full sm:max-w-lg sm:h-auto sm:max-h-[90vh] bg-white rounded-none sm:rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
            
            {/* Header - Mobile Optimized */}
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white p-3 sm:p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 sm:h-6 sm:w-6" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">Smart Bus Assistant</h3>
                  <p className="text-blue-100 text-xs sm:text-sm flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>AI-Powered & Ready</span>
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                type="button"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            {/* FIXED: Messages - Mobile Scrollable */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50 min-h-0">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] px-3 sm:px-4 py-2 sm:py-3 rounded-2xl ${
                    message.isBot 
                      ? 'bg-white text-gray-800 shadow-md border border-gray-200' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  }`}>
                    
                    {/* Message Header */}
                    <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                      {message.isBot ? (
                        <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                      ) : (
                        <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      )}
                      <span className="text-xs opacity-75">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Message Text */}
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">{message.text}</p>

                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="mt-2 sm:mt-3 space-y-2">
                        <p className="text-xs opacity-75 font-medium">Quick actions:</p>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors border border-blue-200"
                              type="button"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-md border border-gray-200 max-w-xs">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">AI analyzing...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* FIXED: Input - Mobile Optimized */}
            <div className="p-3 sm:p-4 border-t border-gray-200 bg-white flex-shrink-0">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask: 'Buses from BOT at 7:00 AM'"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-xs sm:text-sm"
                    disabled={isTyping}
                  />
                  
                  {/* Quick Action Buttons - Mobile Sized */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    <button
                      onClick={() => handleSuggestionClick("Buses from BOT at 7:00 AM")}
                      className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                      title="BOT buses"
                      type="button"
                    >
                      <Bus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    <button
                      onClick={() => handleSuggestionClick("Who is Anamul Haque?")}
                      className="p-1 text-gray-400 hover:text-purple-500 transition-colors"
                      title="Developer info"
                      type="button"
                    >
                      <User className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                  type="button"
                >
                  <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              {/* Powered by indicator - Mobile Sized */}
              <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
                <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                <span>Smart AI • Real-time Bus Intelligence</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;