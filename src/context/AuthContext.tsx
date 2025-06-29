import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, User } from '../lib/supabase';

interface AuthContextType {
  user: SupabaseUser | null;
  userProfile: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Omit<User, 'id' | 'created_at'>) => Promise<{ error: any; needsConfirmation?: boolean }>;
  signIn: (identifier: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let initTimeout: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth...');
        
        // Check if we have valid Supabase credentials
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://placeholder.supabase.co') {
          console.warn('⚠️ Supabase credentials missing - running in offline mode');
          if (mounted) {
            setLoading(false);
          }
          return;
        }
        
        // Get initial session with increased timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 8000) // Increased from 2000 to 8000ms
        );
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (error) {
          console.error('❌ Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        console.log('✅ Session check complete:', {
          hasUser: !!session?.user,
          email: session?.user?.email,
          confirmed: !!session?.user?.email_confirmed_at
        });
        
        if (mounted) {
          setUser(session?.user ?? null);
          
          if (session?.user && session.user.email_confirmed_at) {
            await fetchUserProfile(session.user.id);
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set a maximum initialization time with increased timeout
    initTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.log('⏰ Auth initialization timeout - forcing load completion');
        setLoading(false);
      }
    }, 10000); // Increased from 1500 to 10000ms

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', {
        event,
        hasUser: !!session?.user,
        email: session?.user?.email,
        confirmed: !!session?.user?.email_confirmed_at
      });
      
      if (!mounted) return;

      setUser(session?.user ?? null);
      
      if (session?.user && session.user.email_confirmed_at) {
        await fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      if (initTimeout) {
        clearTimeout(initTimeout);
      }
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('👤 Fetching profile for user:', userId);
      
      // Add increased timeout to profile fetch
      const profilePromise = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000) // Increased from 3000 to 10000ms
      );

      const { data, error } = await Promise.race([
        profilePromise,
        timeoutPromise
      ]) as any;

      if (error) {
        console.error('❌ Error fetching user profile:', error);
        setLoading(false);
        return;
      }

      if (data) {
        console.log('✅ Profile found:', { name: data.name, role: data.role });
        setUserProfile(data);
      } else {
        console.log('⚠️ No profile found for user:', userId);
        // Try to create profile from auth metadata
        await createUserProfileFromAuth(userId);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      setLoading(false);
    }
  };

  const createUserProfileFromAuth = async (userId: string) => {
    try {
      console.log('🔨 Creating user profile from auth metadata');
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('❌ Error getting user data:', userError);
        return;
      }

      const metadata = user.user_metadata || {};
      
      const profileData = {
        id: userId,
        email: user.email!,
        name: metadata.name || 'User',
        university_id: metadata.university_id || `TEMP_${userId.substring(0, 8)}`,
        mobile: metadata.mobile || '',
        gender: metadata.gender || 'Male',
        role: metadata.role || 'student'
      };

      const { data, error } = await supabase
        .from('users')
        .insert([profileData])
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating user profile:', error);
        return;
      }

      console.log('✅ Profile created successfully:', data);
      setUserProfile(data);
    } catch (error) {
      console.error('❌ Error creating user profile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData: Omit<User, 'id' | 'created_at'>) => {
    try {
      console.log('📝 Signing up user:', email);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            name: userData.name,
            university_id: userData.university_id,
            mobile: userData.mobile,
            gender: userData.gender,
            role: userData.role
          }
        }
      });

      if (authError) {
        console.error('❌ Auth signup error:', authError);
        return { error: authError };
      }

      console.log('✅ Signup result:', {
        hasUser: !!authData.user,
        hasSession: !!authData.session,
        needsConfirmation: !!authData.user && !authData.session
      });

      if (authData.user && !authData.session) {
        return { error: null, needsConfirmation: true };
      }

      return { error: null };
    } catch (error) {
      console.error('❌ Signup error:', error);
      return { error };
    }
  };

  const signIn = async (identifier: string, password: string) => {
    try {
      console.log('🔐 Attempting login with:', identifier);
      
      // Add timeout to sign-in process
      const signInPromise = supabase.auth.signInWithPassword({
        email: identifier,
        password,
      });
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign-in timeout')), 10000)
      );
      
      let { data, error } = await Promise.race([
        signInPromise,
        timeoutPromise
      ]) as any;

      // If email login fails, try university ID lookup
      if (error && error.message.includes('Invalid login credentials')) {
        console.log('🔍 Email login failed, trying university ID lookup');
        try {
          const lookupPromise = supabase
            .from('users')
            .select('email')
            .eq('university_id', identifier)
            .single();
            
          const lookupTimeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Lookup timeout')), 5000)
          );

          const { data: userData, error: userError } = await Promise.race([
            lookupPromise,
            lookupTimeoutPromise
          ]) as any;

          if (!userError && userData) {
            console.log('✅ Found email for university ID');
            
            const retrySignInPromise = supabase.auth.signInWithPassword({
              email: userData.email,
              password,
            });
            
            const retryTimeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Retry sign-in timeout')), 10000)
            );
            
            const { data: authData, error: authError } = await Promise.race([
              retrySignInPromise,
              retryTimeoutPromise
            ]) as any;
            
            data = authData;
            error = authError;
          }
        } catch (fallbackError) {
          console.error('❌ University ID lookup error:', fallbackError);
        }
      }

      if (error) {
        console.error('❌ Login error:', error);
        
        if (error.message?.includes('Email not confirmed')) {
          return { error: { ...error, message: 'Please check your email and click the confirmation link before signing in.' } };
        } else if (error.message?.includes('Invalid login credentials')) {
          return { error: { ...error, message: 'Invalid email/university ID or password. Please check your credentials.' } };
        } else if (error.message?.includes('timeout')) {
          return { error: { ...error, message: 'Connection timeout. Please check your internet connection and try again.' } };
        }
      } else {
        console.log('✅ Login successful:', data?.user?.email);
      }

      return { error };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { error: { message: 'An unexpected error occurred. Please try again.' } };
    }
  };

  const signOut = async () => {
    console.log('🚪 Signing out...');
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
    setLoading(false);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (!error && userProfile) {
        setUserProfile({ ...userProfile, ...updates });
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};