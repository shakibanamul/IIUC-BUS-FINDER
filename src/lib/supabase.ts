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

// Enhanced Google Sign-In function with automatic profile creation
export const signInWithGoogle = async (): Promise<{ data?: any; error?: any; needsSetup?: boolean }> => {
  try {
    console.log('🔐 Starting Google Sign-In process...');

    // Check if Supabase is configured
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

    // Attempt Google OAuth sign-in
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account', // Allow users to select account
        },
        skipBrowserRedirect: false,
      }
    });

    if (error) {
      console.error('❌ Google OAuth error:', error);
      
      // Enhanced error handling
      if (error.message?.includes('not enabled') || error.message?.includes('provider')) {
        return {
          error: { 
            message: 'Google Sign-In is not enabled. Please contact the administrator to enable Google OAuth in Supabase.' 
          },
          needsSetup: true
        };
      } else if (error.message?.includes('redirect') || error.message?.includes('url')) {
        return {
          error: { 
            message: 'Google Sign-In redirect URL is not configured properly. Please contact the administrator.' 
          },
          needsSetup: true
        };
      } else if (error.message?.includes('client_id') || error.message?.includes('client')) {
        return {
          error: { 
            message: 'Google OAuth client is not configured. Please contact the administrator.' 
          },
          needsSetup: true
        };
      } else {
        return {
          error: { 
            message: `Google Sign-In failed: ${error.message}. Please try again or contact support.` 
          }
        };
      }
    }

    console.log('✅ Google Sign-In initiated successfully');
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

// Function to create user profile from Google OAuth data
export const createUserProfileFromGoogle = async (user: any): Promise<{ success: boolean; error?: any }> => {
  try {
    console.log('👤 Creating user profile from Google data:', user);

    // Extract information from Google OAuth
    const googleData = user.user_metadata || {};
    const email = user.email;
    const fullName = googleData.full_name || googleData.name || 'Google User';
    
    // Generate a temporary university ID (admin can update later)
    const tempUniversityId = `GOOGLE_${user.id.substring(0, 8).toUpperCase()}`;

    const profileData = {
      id: user.id,
      email: email,
      name: fullName,
      university_id: tempUniversityId,
      mobile: '', // Will be updated by user later
      gender: 'Male', // Default, user can update
      role: 'student' // Default role
    };

    console.log('📝 Profile data to insert:', profileData);

    const { data, error } = await supabase
      .from('users')
      .insert([profileData])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating user profile:', error);
      return { success: false, error };
    }

    console.log('✅ User profile created successfully:', data);
    return { success: true };

  } catch (error) {
    console.error('❌ Unexpected error creating user profile:', error);
    return { success: false, error };
  }
};

// Function to handle Google OAuth callback
export const handleGoogleCallback = async (): Promise<{ success: boolean; user?: any; error?: any }> => {
  try {
    console.log('🔄 Handling Google OAuth callback...');

    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('❌ Session error:', sessionError);
      return { success: false, error: sessionError };
    }

    if (!session || !session.user) {
      console.log('⚠️ No session found');
      return { success: false, error: { message: 'No session found' } };
    }

    const user = session.user;
    console.log('👤 User from session:', user);

    // Check if user profile already exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('❌ Error checking existing profile:', profileError);
      return { success: false, error: profileError };
    }

    if (!existingProfile) {
      console.log('📝 No existing profile found, creating new one...');
      const { success, error } = await createUserProfileFromGoogle(user);
      
      if (!success) {
        return { success: false, error };
      }
    } else {
      console.log('✅ Existing profile found:', existingProfile);
    }

    return { success: true, user };

  } catch (error) {
    console.error('❌ Unexpected error in Google callback:', error);
    return { success: false, error };
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