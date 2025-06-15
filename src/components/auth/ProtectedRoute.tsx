
import React, { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import ProfileSetupDialog from './ProfileSetupDialog';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType?: 'customer' | 'vendor';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, userType }) => {
  const { user, profile, isLoading, refreshProfile } = useAuth();
  const { toast } = useToast();
  const initialCheckDone = useRef(false);
  const toastShown = useRef(false);
  const profileRefreshAttempted = useRef(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  useEffect(() => {
    // If we have a user but no profile data, try to refresh it once
    if (user && !profile && !isLoading && !profileRefreshAttempted.current) {
      profileRefreshAttempted.current = true;
      console.log('User exists but no profile found, attempting to refresh...');
      refreshProfile();
    }
  }, [user, profile, isLoading, refreshProfile]);

  useEffect(() => {
    // Show profile setup dialog if user_type is null after a short delay
    if (user && profile && profile.user_type === null && !showProfileSetup) {
      const timer = setTimeout(() => {
        setShowProfileSetup(true);
      }, 2000); // Wait 2 seconds before showing the dialog
      
      return () => clearTimeout(timer);
    }
  }, [user, profile, showProfileSetup]);

  useEffect(() => {
    // Only show toast messages after initial authentication check is complete
    // and only if we haven't shown this toast before
    if (!isLoading && 
        user && 
        profile && 
        userType && 
        profile.user_type !== userType && 
        initialCheckDone.current && 
        !toastShown.current) {
      
      toastShown.current = true;
      toast({
        title: "Access Denied",
        description: `This page is only accessible to ${userType}s.`,
        variant: "destructive",
      });
    }
    
    // Mark initial check as done after first render
    if (!isLoading && !initialCheckDone.current) {
      initialCheckDone.current = true;
    }
  }, [user, profile, userType, toast, isLoading]);

  const handleProfileUpdated = () => {
    setShowProfileSetup(false);
    // Refresh the page or trigger a re-render
    window.location.reload();
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    // Only show toast if this isn't the initial page load and we haven't shown this toast before
    if (initialCheckDone.current && !toastShown.current) {
      toastShown.current = true;
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page",
        variant: "destructive",
      });
    }
    return <Navigate to="/login" />;
  }

  // If no profile exists yet, show a different loading message and try to refresh
  if (!profile) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <div>Loading your profile...</div>
        <div className="text-sm text-muted-foreground">
          If this takes too long, try refreshing the page
        </div>
      </div>
    );
  }

  // If user_type is null, show the profile setup dialog
  if (profile.user_type === null) {
    return (
      <>
        <div className="flex flex-col justify-center items-center h-screen gap-4">
          <div>Setting up your profile...</div>
          <div className="text-sm text-muted-foreground">
            Complete your profile setup to continue
          </div>
        </div>
        <ProfileSetupDialog 
          open={showProfileSetup} 
          onProfileUpdated={handleProfileUpdated}
        />
      </>
    );
  }

  // If user type is specified and we have profile data, check if user has the correct role
  if (userType && profile && profile.user_type !== userType) {
    // Redirect to the appropriate dashboard based on actual user type
    const redirectPath = profile.user_type === 'customer' ? '/customer' : '/vendor';
    return <Navigate to={redirectPath} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
