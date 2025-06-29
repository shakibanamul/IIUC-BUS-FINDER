import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Supabase Configuration Check:');
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('Anon Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing');

// Create client even if credentials are missing (with fallbacks)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);

// Test connection only if we have valid credentials
if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co') {
  // Non-blocking connection test
  setTimeout(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('❌ Supabase connection error:', error.message);
      } else {
        console.log('✅ Supabase connected successfully');
      }
    }).catch((error) => {
      console.error('❌ Supabase connection failed:', error.message);
    });
  }, 100);
} else {
  console.warn('⚠️ Supabase credentials missing - running in offline mode');
}

// Enhanced Google OAuth configuration check
export const checkGoogleOAuthConfig = async (): Promise<{ isConfigured: boolean; error?: string }> => {
  try {
    // Check if Supabase is properly configured
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://placeholder.supabase.co') {
      return {
        isConfigured: false,
        error: 'Supabase is not properly configured. Please set up your Supabase project first.'
      };
    }

    // Try to get the auth configuration
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      return {
        isConfigured: false,
        error: `Supabase connection error: ${error.message}`
      };
    }

    // Check if we can access auth providers (this will help determine if Google is configured)
    try {
      // Try a test OAuth call to see if providers are available
      const testResult = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login?test=true`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      
      // If we get here without error, Google OAuth is likely configured
      return { isConfigured: true };
      
    } catch (oauthError: any) {
      // If OAuth fails, it might be a configuration issue
      if (oauthError.message?.includes('not enabled') || 
          oauthError.message?.includes('provider') ||
          oauthError.message?.includes('client_id')) {
        return {
          isConfigured: false,
          error: 'Google OAuth is not properly configured in Supabase. Please check your provider settings.'
        };
      }
      
      // For other errors, assume it might be configured but there's a different issue
      return { isConfigured: true };
    }
    
  } catch (error: any) {
    return {
      isConfigured: false,
      error: `Configuration check failed: ${error.message}`
    };
  }
};

// Enhanced Google Sign-In function with better error handling
export const signInWithGoogle = async (): Promise<{ data?: any; error?: any; needsSetup?: boolean }> => {
  try {
    console.log('🔐 Attempting Google Sign-In...');

    // First check if Supabase is configured
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://placeholder.supabase.co') {
      return {
        error: { message: 'Supabase is not properly configured. Please contact the administrator.' },
        needsSetup: true
      };
    }

    // Get current URL for redirect
    const currentUrl = window.location.origin;
    const redirectUrl = `${currentUrl}/login?google=success`;

    console.log('🔗 Redirect URL:', redirectUrl);

    // Attempt Google OAuth sign-in with enhanced options
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
          hd: '', // Allow any domain, remove if you want to restrict to specific domains
        },
        skipBrowserRedirect: false, // Ensure browser redirect happens
      }
    });

    if (error) {
      console.error('❌ Google OAuth error:', error);
      
      // Enhanced error handling with specific messages
      if (error.message?.includes('not enabled') || error.message?.includes('provider')) {
        return {
          error: { 
            message: 'Google Sign-In is not enabled in Supabase. Please contact the administrator to enable the Google OAuth provider in the Supabase dashboard.' 
          },
          needsSetup: true
        };
      } else if (error.message?.includes('redirect') || error.message?.includes('url')) {
        return {
          error: { 
            message: 'Google Sign-In redirect URL is not configured properly. Please contact the administrator to add the correct redirect URLs in Supabase.' 
          },
          needsSetup: true
        };
      } else if (error.message?.includes('client_id') || error.message?.includes('client')) {
        return {
          error: { 
            message: 'Google OAuth client is not configured. Please contact the administrator to set up Google OAuth credentials in Supabase.' 
          },
          needsSetup: true
        };
      } else if (error.message?.includes('unauthorized') || error.message?.includes('invalid')) {
        return {
          error: { 
            message: 'Google OAuth configuration is invalid. Please contact the administrator to verify the Google OAuth settings.' 
          },
          needsSetup: true
        };
      } else {
        return {
          error: { 
            message: `Google Sign-In failed: ${error.message}. Please try again or contact support if the issue persists.` 
          }
        };
      }
    }

    console.log('✅ Google Sign-In initiated successfully');
    console.log('📊 OAuth data:', data);
    
    return { data };

  } catch (err: any) {
    console.error('❌ Unexpected Google Sign-In error:', err);
    return {
      error: { 
        message: 'An unexpected error occurred with Google Sign-In. Please try again or use email/password login.' 
      }
    };
  }
};

// Database types
export interface User {
  id: string;
  email: string;
  name: string;
  university_id: string;
  mobile: string;
  gender: 'Male' | 'Female';
  role: 'student' | 'teacher' | 'admin';
  created_at: string;
}

export interface BusScheduleDB {
  id: string;
  time: string;
  starting_point: string;
  route: string;
  end_point: string;
  direction: string;
  gender?: 'Male' | 'Female';
  bus_type?: string;
  remarks?: string;
  description?: string;
  schedule_type: 'Regular' | 'Friday';
  created_at: string;
}

export interface Feedback {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  user?: User;
}

export interface Complaint {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: 'delay' | 'safety' | 'driver_behavior' | 'bus_condition' | 'route_issue' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  bus_route?: string;
  incident_time?: string;
  created_at: string;
  resolved_at?: string;
  admin_response?: string;
  user?: User;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  published_at: string;
}