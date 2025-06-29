import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle, checkGoogleOAuthConfig } from '../lib/supabase';
import { Bus, Lock, User, Eye, EyeOff, AlertCircle, Loader2, Mail, CheckCircle, Wifi, WifiOff, ArrowLeft, Sparkles, Key, Info, Settings, ExternalLink, Shield, Globe, Star } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { signIn, user, userProfile, loading } = useAuth();
  const [formData, setFormData] = useState({
    identifier: '', // Can be email or university ID
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [googleConfigStatus, setGoogleConfigStatus] = useState<'checking' | 'available' | 'needs-setup'>('checking');

  // Check Google OAuth configuration on component mount
  useEffect(() => {
    const checkGoogleConfig = async () => {
      try {
        const { isConfigured } = await checkGoogleOAuthConfig();
        setGoogleConfigStatus(isConfigured ? 'available' : 'needs-setup');
      } catch (error) {
        console.error('Error checking Google config:', error);
        setGoogleConfigStatus('needs-setup');
      }
    };

    checkGoogleConfig();
  }, []);

  // Show loading spinner while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Initializing...</p>
        </div>
      </div>
    );
  }

  // Redirect if already logged in
  if (user && userProfile) {
    const dashboardRoutes = {
      student: '/student-dashboard',
      teacher: '/teacher-dashboard',
      admin: '/admin-dashboard',
    };
    return <Navigate to={dashboardRoutes[userProfile.role]} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.identifier.trim() || !formData.password.trim()) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔐 Starting login process...');
      
      // Add a timeout wrapper for the entire login process
      const loginPromise = signIn(formData.identifier, formData.password);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Login process timeout')), 15000)
      );

      const { error } = await Promise.race([loginPromise, timeoutPromise]) as any;

      if (error) {
        console.error('❌ Login error:', error);
        
        if (error.message?.includes('timeout')) {
          setError('Connection timeout. Please check your internet connection and try again.');
        } else if (error.message?.includes('confirmation')) {
          setError('Please check your email and click the confirmation link before signing in.');
        } else if (error.message?.includes('Invalid login credentials')) {
          setError('Invalid email/university ID or password. Please check your credentials.');
        } else {
          setError(error.message || 'Login failed. Please try again.');
        }
      } else {
        console.log('✅ Login successful, waiting for redirect...');
        // Don't set loading to false here - let the auth context handle it
        return;
      }
    } catch (err: any) {
      console.error('❌ Unexpected login error:', err);
      if (err.message?.includes('timeout')) {
        setError('Connection timeout. Please check your internet connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }

    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsGoogleLoading(true);

    try {
      console.log('🔐 Starting Google sign-in...');
      
      const { data, error, needsSetup } = await signInWithGoogle();

      if (error) {
        console.error('❌ Google sign-in error:', error);
        setError(error.message);
        
        if (needsSetup) {
          setShowSetupGuide(true);
        }
      } else if (data) {
        console.log('✅ Google sign-in initiated successfully');
        // The redirect will happen automatically
        // Don't set loading to false here as the page will redirect
        return;
      }
    } catch (err: any) {
      console.error('❌ Unexpected Google sign-in error:', err);
      setError('An unexpected error occurred with Google Sign-In. Please try again or use email/password login.');
    }

    setIsGoogleLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background Pattern - Mobile Optimized */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.02%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      {/* Mobile-First Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Mobile Header - Compact */}
        <div className="flex-shrink-0 p-4 sm:p-6">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm sm:text-base font-medium">Back to Home</span>
          </Link>
        </div>

        {/* Main Content - Centered and Responsive */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-sm sm:max-w-md">
            
            {/* Header Section - Mobile Optimized */}
            <div className="text-center mb-6 sm:mb-8">
              {/* Logo Section - Compact for Mobile */}
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-400 rounded-full blur-lg opacity-30"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-2 sm:p-3 border border-white/20">
                    <img 
                      src="/iiuc.png" 
                      alt="IIUC"
                      className="h-6 w-6 sm:h-8 sm:w-8 object-contain"
                    />
                  </div>
                </div>
                <div className="h-6 sm:h-8 w-px bg-gradient-to-b from-transparent via-blue-300 to-transparent"></div>
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-400 rounded-full blur-lg opacity-30"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-2 sm:p-3 border border-white/20">
                    <Bus className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" />
                  </div>
                </div>
              </div>
              
              {/* Title - Mobile Responsive */}
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 text-sm sm:text-base px-2">Sign in to access your IIUC Bus Dashboard</p>
            </div>

            {/* Login Form - Mobile-First Design */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/50 p-6 sm:p-8 mb-6">
              
              {/* Error Message - Mobile Optimized */}
              {error && (
                <div className="space-y-3 mb-6">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 flex items-start space-x-3">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm leading-relaxed">{error}</p>
                  </div>
                  
                  {/* Connection issue help - Mobile Friendly */}
                  {error.includes('timeout') && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 sm:p-4 flex items-start space-x-3">
                      <WifiOff className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-orange-700">
                        <p className="font-medium mb-1">Connection Issue</p>
                        <p className="text-xs sm:text-sm">Please check your internet connection and try again.</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Email verification reminder - Mobile Friendly */}
                  {error.includes('confirmation') && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 flex items-start space-x-3">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-700">
                        <p className="font-medium mb-1">Email Verification Required</p>
                        <p className="text-xs sm:text-sm">Please check your email and click the verification link.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Google Sign-In Section - Enhanced */}
              <div className="space-y-4 mb-6">
                {googleConfigStatus === 'checking' ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400 mr-2" />
                    <span className="text-gray-500 text-sm">Checking Google Sign-In availability...</span>
                  </div>
                ) : googleConfigStatus === 'available' ? (
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading || isLoading}
                    className="w-full flex items-center justify-center space-x-3 px-4 sm:px-6 py-3 sm:py-4 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl hover:border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md text-base button-smooth group"
                  >
                    {isGoogleLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                        <span className="text-gray-600 font-medium">Signing in with Google...</span>
                      </>
                    ) : (
                      <>
                        {/* Google Icon */}
                        <svg className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="text-gray-700 font-medium">Continue with Google</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs text-gray-500">Fast</span>
                        </div>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <Settings className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-orange-800">
                        <p className="font-medium mb-2">⚙️ Google Sign-In Setup Required</p>
                        <p className="mb-3 leading-relaxed">
                          Google Sign-In is not configured yet. The administrator needs to set up Google OAuth in Supabase to enable this feature.
                        </p>
                        <button
                          onClick={() => setShowSetupGuide(!showSetupGuide)}
                          className="text-orange-600 hover:text-orange-700 font-medium text-xs underline"
                        >
                          {showSetupGuide ? 'Hide' : 'Show'} Setup Instructions
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Or continue with email</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Identifier Field - Mobile Optimized */}
                <div>
                  <label htmlFor="identifier" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email or University ID
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <input
                      type="text"
                      id="identifier"
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleChange}
                      placeholder="Enter your email or university ID"
                      className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 text-base form-input"
                      required
                      disabled={isLoading || isGoogleLoading}
                      autoComplete="username"
                      autoCapitalize="none"
                      autoCorrect="off"
                    />
                  </div>
                </div>

                {/* Password Field - Mobile Optimized */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="w-full pl-10 sm:pl-12 pr-12 sm:pr-14 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 text-base form-input"
                      required
                      disabled={isLoading || isGoogleLoading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      disabled={isLoading || isGoogleLoading}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button - Mobile Optimized */}
                <button
                  type="submit"
                  disabled={isLoading || isGoogleLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl sm:rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-base button-smooth"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Sign Up Link - Mobile Friendly */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </div>

            {/* Google Setup Guide - Mobile Optimized */}
            {showSetupGuide && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-200 mb-6">
                <div className="flex items-start space-x-3">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-purple-800">
                    <p className="font-semibold mb-2 flex items-center space-x-2">
                      <span>🔧 For Administrators - Google OAuth Setup</span>
                    </p>
                    <p className="text-xs mb-3">To enable Google Sign-In, configure these settings in Supabase:</p>
                    
                    <div className="bg-white/50 rounded-lg p-3 mb-3">
                      <p className="font-medium text-xs mb-2">📋 Step-by-Step Setup:</p>
                      <ol className="text-xs space-y-1 list-decimal list-inside">
                        <li>Open your Supabase Dashboard</li>
                        <li>Go to Authentication → Providers</li>
                        <li>Enable Google provider</li>
                        <li>Get Google OAuth credentials from Google Cloud Console</li>
                        <li>Add Client ID and Client Secret to Supabase</li>
                        <li>Configure redirect URLs</li>
                        <li>Test the integration</li>
                      </ol>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <a
                        href="https://supabase.com/docs/guides/auth/social-login/auth-google"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-xs text-purple-600 hover:text-purple-700 font-medium"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Google OAuth Docs</span>
                      </a>
                      <a
                        href="https://supabase.com/dashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-xs text-purple-600 hover:text-purple-700 font-medium"
                      >
                        <Settings className="h-3 w-3" />
                        <span>Supabase Dashboard</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Google Sign-In Benefits - Mobile Optimized */}
            {googleConfigStatus === 'available' && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200 mb-6">
                <h3 className="font-semibold text-green-900 mb-3 text-center text-sm sm:text-base flex items-center justify-center space-x-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Why Use Google Sign-In?</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-green-700">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>No password to remember</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>Instant account creation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>Enhanced security</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>One-click access</span>
                  </div>
                </div>
              </div>
            )}

            {/* Success Notice - Mobile Optimized */}
            <div className="bg-green-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200 mb-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-700">
                  <p className="font-semibold mb-1">Just Verified Your Email?</p>
                  <p className="text-xs sm:text-sm">Perfect! You can now sign in with your credentials{googleConfigStatus === 'available' ? ' or use Google Sign-In' : ''}.</p>
                </div>
              </div>
            </div>

            {/* Connection Status - Mobile Friendly */}
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <Wifi className="h-3 w-3 text-green-500" />
              <span>Connected to IIUC Bus System</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;