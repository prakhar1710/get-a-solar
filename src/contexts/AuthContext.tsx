
import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Profile } from '@/types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const isInitialLoad = useRef(true);

  // Function to fetch user profile with better error handling
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      // First try to fetch the existing profile
      console.log(`Fetching profile for user: ${userId}`);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      if (data) {
        console.log('Profile found:', data);
        return data as Profile;
      }
      
      console.log('No profile found, attempting to create one');
      
      // If no profile exists, create one with minimal data
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([{ 
          id: userId,
          user_type: null, // Start with null, will be updated later by the user
          full_name: null,
          phone_number: null,
          pincode: null,
          electricity_bill: null
        }])
        .select()
        .single();
        
      if (insertError) {
        console.error('Error creating profile:', insertError);
        toast({
          title: "Profile Creation Error",
          description: "Unable to create your profile. Please try logging out and back in.",
          variant: "destructive",
        });
        return null;
      }
      
      console.log('Profile created successfully:', newProfile);
      return newProfile as Profile;
    } catch (error: any) {
      console.error('Error in profile management:', error);
      toast({
        title: "Profile Error",
        description: error.message || "An error occurred with your profile.",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  // Function to refresh profile data - using useCallback to ensure consistent reference
  const refreshProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      const profileData = await fetchProfile(user.id);
      if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    let authStateSubscription: { unsubscribe: () => void } | null = null;
    
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // First check for existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        // Update session and user states
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // If we have a user, fetch their profile - but use setTimeout to defer this
        if (currentSession?.user) {
          // Use setTimeout to avoid potential infinite loops by deferring profile fetch
          setTimeout(async () => {
            const profileData = await fetchProfile(currentSession.user.id);
            if (profileData) {
              setProfile(profileData);
            }
          }, 0);
        }
        
        // Set up the auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            console.log('Auth state changed:', event);
            
            // Update session and user states
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            
            // Use setTimeout to prevent potential infinite loops when handling profile updates
            if (currentSession?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
              setTimeout(async () => {
                const profileData = await fetchProfile(currentSession.user.id);
                if (profileData) {
                  setProfile(profileData);
                }
              }, 0);
            } else if (event === 'SIGNED_OUT') {
              setProfile(null);
            }
          }
        );
        
        authStateSubscription = subscription;
        
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
        isInitialLoad.current = false;
      }
    };
    
    initializeAuth();
    
    // Cleanup
    return () => {
      if (authStateSubscription) {
        authStateSubscription.unsubscribe();
      }
    };
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Create a memoized value to prevent unnecessary re-renders
  const authContextValue = React.useMemo(() => ({
    session, 
    user, 
    profile, 
    isLoading, 
    signOut, 
    refreshProfile
  }), [session, user, profile, isLoading, signOut, refreshProfile]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
