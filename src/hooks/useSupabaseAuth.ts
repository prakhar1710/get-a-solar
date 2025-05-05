
import { useState, useEffect, useCallback, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Profile } from '@/types';

export function useSupabaseAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const isInitialLoad = useRef(true);
  const profileFetchInProgress = useRef(false);
  const authInitialized = useRef(false);

  // Function to fetch user profile with better error handling
  const fetchProfile = useCallback(async (userId: string) => {
    if (profileFetchInProgress.current) return null;
    
    try {
      profileFetchInProgress.current = true;
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
        // Only show toast if this is not the initial load
        if (!isInitialLoad.current) {
          toast({
            title: "Profile Creation Error",
            description: "Unable to create your profile. Please try logging out and back in.",
            variant: "destructive",
          });
        }
        return null;
      }
      
      console.log('Profile created successfully:', newProfile);
      return newProfile as Profile;
    } catch (error: any) {
      console.error('Error in profile management:', error);
      // Only show toast if this is not the initial load
      if (!isInitialLoad.current) {
        toast({
          title: "Profile Error",
          description: error.message || "An error occurred with your profile.",
          variant: "destructive",
        });
      }
      return null;
    } finally {
      profileFetchInProgress.current = false;
    }
  }, [toast, isInitialLoad]);

  // Function to refresh profile data - using useCallback to ensure consistent reference
  const refreshProfile = useCallback(async () => {
    if (!user || profileFetchInProgress.current) return;
    
    try {
      const profileData = await fetchProfile(user.id);
      if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  }, [user, fetchProfile]);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      // Reset all auth-related state
      setUser(null);
      setProfile(null);
      setSession(null);
      
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

  useEffect(() => {
    if (authInitialized.current) return;
    
    let authStateSubscription: { unsubscribe: () => void } | null = null;
    
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        authInitialized.current = true;
        
        // First set up the auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            console.log('Auth state changed:', event);
            
            // Update session and user states
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            
            if (currentSession?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
              // Use setTimeout to avoid potential deadlock with Supabase auth state changes
              setTimeout(async () => {
                if (!profileFetchInProgress.current) {
                  const profileData = await fetchProfile(currentSession.user.id);
                  if (profileData) {
                    setProfile(profileData);
                  }
                }
              }, 0);
            } else if (event === 'SIGNED_OUT') {
              setProfile(null);
            }
          }
        );
        
        authStateSubscription = subscription;
        
        // Then check for existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        // Update session and user states
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // If we have a user, fetch their profile
        if (currentSession?.user) {
          const profileData = await fetchProfile(currentSession.user.id);
          if (profileData) {
            setProfile(profileData);
          }
        }
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

  return {
    session,
    user,
    profile,
    isLoading,
    signOut,
    refreshProfile
  };
}
