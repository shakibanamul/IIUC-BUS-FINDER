import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, Lock, User, Eye, EyeOff, AlertCircle, Loader2, Mail, Phone, GraduationCap, Users, CheckCircle, ArrowLeft, Sparkles, Star } from 'lucide-react';

const SignupPage: React.FC = () => {
  const { signUp, user, userProfile, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university_id: '',
    mobile: '',
    gender: 'Male' as 'Male' | 'Female',
    role: 'student' as 'student' | 'teacher',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // Multi-step form for mobile

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
    setSuccess('');
    setNeedsConfirmation(false);
    setIsLoading(true);

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.university_id.trim() || 
        !formData.mobile.trim() || !formData.password.trim()) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    // Check for valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Check university ID format (basic validation)
    if (formData.university_id.length < 3) {
      setError('University ID must be at least 3 characters long');
      setIsLoading(false);
      return;
    }

    const { error, needsConfirmation: confirmationRequired } = await signUp(formData.email, formData.password, {
      name: formData.name,
      email: formData.email,
      university_id: formData.university_id,
      mobile: formData.mobile,
      gender: formData.gender,
      role: formData.role,
    });

    if (error) {
      console.error('Signup error:', error);
      if (error.message?.includes('already registered') || error.message?.includes('already been registered')) {
        setError('This email is already registered. Please try logging in instead.');
      } else if (error.message?.includes('email')) {
        setError('Please enter a valid email address.');
      } else if (error.message?.includes('password')) {
        setError('Password must be at least 6 characters long.');
      } else {
        setError(error.message || 'Registration failed. Please try again.');
      }
    } else if (confirmationRequired) {
      setNeedsConfirmation(true);
      setSuccess('Registration successful! Please check your email and click the confirmation link to activate your account.');
    } else {
      setSuccess('Registration successful! You can now sign in.');
    }

    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!formData.name.trim() || !formData.email.trim()) {
        setError('Please fill in your name and email');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.university_id.trim() || !formData.mobile.trim()) {
        setError('Please fill in your university ID and mobile number');
        return;
      }
    }
    
    setError('');
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setError('');
    setCurrentStep(currentStep - 1);
  };

  const totalSteps = 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background Pattern - Mobile Optimized */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.02%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      {/* Mobile-First Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Mobile Header - Compact */}
        <div className="flex-shrink-0 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm sm:text-base font-medium">Back to Home</span>
            </Link>
            
            {/* Step Indicator - Mobile */}
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i + 1 <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
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
                Join IIUC Bus
              </h1>
              <p className="text-gray-600 text-sm sm:text-base px-2">
                Step {currentStep} of {totalSteps}: Create your account
              </p>
            </div>

            {/* Signup Form - Mobile-First Multi-Step Design */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/50 p-6 sm:p-8 mb-6">
              
              {/* Success Message for Email Confirmation */}
              {needsConfirmation && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <p className="font-semibold mb-2">Check Your Email!</p>
                      <p className="mb-2">We've sent a confirmation link to <strong>{formData.email}</strong></p>
                      <p>Please click the link in your email to activate your account, then return here to sign in.</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                
                {/* Error Message - Mobile Optimized */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 flex items-start space-x-3">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm leading-relaxed">{error}</p>
                  </div>
                )}

                {/* Success Message */}
                {success && !needsConfirmation && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4 flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-green-700">
                      <p className="font-semibold mb-1">{success}</p>
                      <Link to="/login" className="text-green-600 hover:text-green-800 font-medium underline">
                        Go to Login Page →
                      </Link>
                    </div>
                  </div>
                )}

                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-4 sm:space-y-5">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Basic Information</h3>
                      <p className="text-sm text-gray-600">Let's start with your basic details</p>
                    </div>

                    {/* Name Field */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 text-base form-input"
                          required
                          disabled={isLoading}
                          autoComplete="name"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email address"
                          className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 text-base form-input"
                          required
                          disabled={isLoading}
                          autoComplete="email"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: University Information */}
                {currentStep === 2 && (
                  <div className="space-y-4 sm:space-y-5">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">University Details</h3>
                      <p className="text-sm text-gray-600">Your IIUC information</p>
                    </div>

                    {/* University ID Field */}
                    <div>
                      <label htmlFor="university_id" className="block text-sm font-semibold text-gray-700 mb-2">
                        University ID *
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        <input
                          type="text"
                          id="university_id"
                          name="university_id"
                          value={formData.university_id}
                          onChange={handleChange}
                          placeholder="Enter your student/employee ID"
                          className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 text-base form-input"
                          required
                          disabled={isLoading}
                          autoComplete="username"
                        />
                      </div>
                    </div>

                    {/* Mobile Field */}
                    <div>
                      <label htmlFor="mobile" className="block text-sm font-semibold text-gray-700 mb-2">
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        <input
                          type="tel"
                          id="mobile"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          placeholder="Enter your mobile number"
                          className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 text-base form-input"
                          required
                          disabled={isLoading}
                          autoComplete="tel"
                        />
                      </div>
                    </div>

                    {/* Gender and Role Fields - Mobile Stack */}
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                          Gender *
                        </label>
                        <div className="relative">
                          <Users className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 appearance-none cursor-pointer text-base form-input"
                            required
                            disabled={isLoading}
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                          Role *
                        </label>
                        <div className="relative">
                          <GraduationCap className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 appearance-none cursor-pointer text-base form-input"
                            required
                            disabled={isLoading}
                          >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher/Staff</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Password Setup */}
                {currentStep === 3 && (
                  <div className="space-y-4 sm:space-y-5">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Secure Your Account</h3>
                      <p className="text-sm text-gray-600">Create a strong password</p>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create a password (min. 6 characters)"
                          className="w-full pl-10 sm:pl-12 pr-12 sm:pr-14 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 text-base form-input"
                          required
                          disabled={isLoading}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                          disabled={isLoading}
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm your password"
                          className="w-full pl-10 sm:pl-12 pr-12 sm:pr-14 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 text-base form-input"
                          required
                          disabled={isLoading}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                          disabled={isLoading}
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Password Strength Indicator */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-700 mb-2">Password Requirements:</p>
                      <div className="space-y-1">
                        <div className={`flex items-center space-x-2 text-xs ${formData.password.length >= 6 ? 'text-green-600' : 'text-gray-500'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${formData.password.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span>At least 6 characters</span>
                        </div>
                        <div className={`flex items-center space-x-2 text-xs ${formData.password === formData.confirmPassword && formData.password.length > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${formData.password === formData.confirmPassword && formData.password.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span>Passwords match</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons - Mobile Optimized */}
                <div className="flex space-x-3 pt-4">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 px-4 py-3 sm:py-4 bg-gray-100 text-gray-700 rounded-xl sm:rounded-2xl hover:bg-gray-200 transition-colors font-semibold text-base"
                    >
                      Previous
                    </button>
                  )}
                  
                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl sm:rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-base button-smooth"
                    >
                      <span>Continue</span>
                      <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 rotate-180" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl sm:rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-base button-smooth"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <Star className="h-4 w-4 sm:h-5 sm:w-5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>

              {/* Sign In Link - Mobile Friendly */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>

            {/* Benefits Section - Mobile Optimized */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200 mb-6">
              <h3 className="font-semibold text-green-900 mb-3 text-center text-sm sm:text-base">
                🎉 Join the IIUC Bus Community
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-green-700">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Personalized schedules</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Real-time notifications</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Submit feedback</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Priority support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;