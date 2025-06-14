
import React, { useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

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

  useEffect(() => {
    // If we have a user but no profile data, try to refresh it once
    if (user && !profile && !isLoading && !profileRefreshAttempted.current) {
      profileRefreshAttempted.current = true;
      console.log('User exists but no profile found, attempting to refresh...');
      refreshProfile();
    }
  }, [user, profile, isLoading, refreshProfile]);

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

  // If user_type is null, allow access but show a setup message
  if (profile.user_type === null) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <div>Setting up your profile...</div>
        <div className="text-sm text-muted-foreground">
          Please refresh the page if this doesn't complete automatically
        </div>
      </div>
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
