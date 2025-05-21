
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfileManagement } from './useProfileManagement';
import { useSessionManagement } from './useSessionManagement';

export function useSupabaseAuthState() {
  const {
    profile, setProfile, fetchProfile, refreshProfile, completeInitialLoad
  } = useProfileManagement();
  
  const {
    session, setSession, user, setUser, isLoading, setIsLoading, signOut
  } = useSessionManagement();

  const authInitialized = useRef(false);
  const authStateSubscription = useRef<{ unsubscribe: () => void } | null>(null);

  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    if (authInitialized.current) return;
    
    try {
      setIsLoading(true);
      authInitialized.current = true;
      
      console.log('Initializing auth state...');
      
      // First check for existing session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      console.log('Current session:', currentSession ? 'Found' : 'None');
      
      // Update session and user states
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // If we have a user, fetch their profile
      if (currentSession?.user) {
        console.log('Found user, fetching profile:', currentSession.user.id);
        const profileData = await fetchProfile(currentSession.user.id);
        if (profileData) {
          console.log('Profile found:', profileData);
          setProfile(profileData);
        } else {
          console.log('No profile found for user');
        }
      }
      
      // Then set up the auth state listener
      console.log('Setting up auth state listener...');
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          console.log('Auth state changed:', event);
          
          // Update session and user states
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
            console.log('User signed in or token refreshed:', currentSession.user.id);
            // Use setTimeout to avoid potential deadlock with Supabase auth state changes
            setTimeout(async () => {
              try {
                const profileData = await fetchProfile(currentSession.user.id);
                if (profileData) {
                  console.log('Profile retrieved after auth change:', profileData);
                  setProfile(profileData);
                } else {
                  console.log('No profile found after auth change');
                }
              } catch (err) {
                console.error('Error fetching profile after auth change:', err);
              }
            }, 0);
          } else if (event === 'SIGNED_OUT') {
            console.log('User signed out');
            setProfile(null);
          }
        }
      );
      
      authStateSubscription.current = subscription;
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setIsLoading(false);
      completeInitialLoad();
    }
  }, [
    setIsLoading, 
    setSession, 
    setUser, 
    fetchProfile, 
    setProfile,
    completeInitialLoad
  ]);

  // Set up auth state and cleanup
  useEffect(() => {
    console.log('Setting up auth state...');
    initializeAuth();
    
    // Cleanup
    return () => {
      if (authStateSubscription.current) {
        console.log('Cleaning up auth state subscription...');
        authStateSubscription.current.unsubscribe();
      }
    };
  }, [initializeAuth]);

  // Wrap refreshProfile to handle user check
  const handleRefreshProfile = useCallback(async () => {
    if (!user) return null;
    console.log('Refreshing profile for user:', user.id);
    return await refreshProfile(user);
  }, [user, refreshProfile]);

  return {
    session,
    user,
    profile,
    isLoading,
    signOut,
    refreshProfile: handleRefreshProfile
  };
}
