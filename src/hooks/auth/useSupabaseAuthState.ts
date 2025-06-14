
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfileManagement } from './useProfileManagement';
import { useSessionManagement } from './useSessionManagement';

export function useSupabaseAuthState() {
  const {
    profile, setProfile, fetchProfile, refreshProfile: originalRefreshProfile, completeInitialLoad
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
      
      // First set up the auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, currentSession) => {
          console.log('Auth state changed:', event);
          
          // Update session and user states
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
            // Use setTimeout to avoid potential deadlock with Supabase auth state changes
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
      
      authStateSubscription.current = subscription;
      
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
    initializeAuth();
    
    // Cleanup
    return () => {
      if (authStateSubscription.current) {
        authStateSubscription.current.unsubscribe();
      }
    };
  }, [initializeAuth]);

  // Wrap refreshProfile to handle user check and use current user
  const handleRefreshProfile = useCallback(async () => {
    console.log('Refresh profile called with user:', user?.id);
    if (!user) {
      console.log('No user available for profile refresh');
      return null;
    }
    return await originalRefreshProfile(user);
  }, [user, originalRefreshProfile]);

  return {
    session,
    user,
    profile,
    isLoading,
    signOut,
    refreshProfile: handleRefreshProfile
  };
}
