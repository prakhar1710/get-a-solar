
import React, { createContext, useContext, useEffect, useState } from 'react';
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

  // Function to fetch user profile with better error handling
  const fetchProfile = async (userId: string) => {
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
  };

  // Function to refresh profile data
  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const profileData = await fetchProfile(user.id);
      if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  useEffect(() => {
    let authStateSubscription: { unsubscribe: () => void } | null = null;
    
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        // Set up the auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            console.log('Auth state changed:', event);
            
            // Update session and user states
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            
            // Use setTimeout to prevent potential infinite loops when handling profile updates
            if (currentSession?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
              setTimeout(async () => {
                const profileData = await fetchProfile(currentSession.user.id);
                setProfile(profileData);
              }, 0);
            } else if (event === 'SIGNED_OUT') {
              setProfile(null);
            }
          }
        );
        
        authStateSubscription = subscription;
        
        // Then check for existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // If we have a user, fetch their profile
        if (currentSession?.user) {
          const profileData = await fetchProfile(currentSession.user.id);
          setProfile(profileData);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    // Cleanup
    return () => {
      if (authStateSubscription) {
        authStateSubscription.unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
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
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      isLoading, 
      signOut, 
      refreshProfile 
    }}>
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
