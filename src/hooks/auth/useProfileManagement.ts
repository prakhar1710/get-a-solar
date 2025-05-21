
import { useState, useRef, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Profile } from '@/types';

export function useProfileManagement() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();
  const profileFetchInProgress = useRef(false);
  const isInitialLoad = useRef(true);
  
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
          user_type: 'vendor', // Default to vendor for testing
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
  }, [toast]);

  // Function to refresh profile data
  const refreshProfile = useCallback(async (user: User | null) => {
    if (!user || profileFetchInProgress.current) return null;
    
    console.log("Refreshing profile for user:", user.id);
    
    try {
      const profileData = await fetchProfile(user.id);
      if (profileData) {
        setProfile(profileData);
        return profileData;
      }
      return null;
    } catch (error) {
      console.error('Error refreshing profile:', error);
      return null;
    }
  }, [fetchProfile]);

  // Set initial load to false after first use
  const completeInitialLoad = useCallback(() => {
    isInitialLoad.current = false;
  }, []);

  return {
    profile,
    setProfile,
    fetchProfile,
    refreshProfile,
    completeInitialLoad
  };
}
