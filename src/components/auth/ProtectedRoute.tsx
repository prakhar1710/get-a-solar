
import React, { useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType?: 'customer' | 'vendor';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, userType }) => {
  const { user, profile, isLoading, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const initialCheckDone = useRef(false);
  const toastShown = useRef(false);
  const profileRefreshAttempted = useRef(false);

  useEffect(() => {
    // If we have a user but no profile or incomplete profile, try to refresh it
    const attemptProfileRefresh = async () => {
      if (user && (!profile || profile.user_type === null) && !profileRefreshAttempted.current) {
        profileRefreshAttempted.current = true;
        console.log("Protected route: Refreshing profile due to missing or incomplete profile");
        await refreshProfile();
      }
    };

    if (!isLoading) {
      attemptProfileRefresh();
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
        description: `This page is only accessible to ${userType}s. Redirecting to appropriate dashboard.`,
        variant: "destructive",
      });
      
      // Small delay before redirect to ensure toast is seen
      setTimeout(() => {
        const redirectPath = profile.user_type === 'customer' ? '/customer' : '/vendor';
        navigate(redirectPath);
      }, 1500);
    }
    
    // Mark initial check as done after first render
    if (!isLoading && !initialCheckDone.current) {
      initialCheckDone.current = true;
    }
  }, [user, profile, userType, toast, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sbs-purple"></div>
    </div>;
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

  // If profile is not loaded yet but we have a user, show loading
  if (user && !profile) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sbs-purple"></div>
    </div>;
  }

  // If user type is specified and we have profile data, check if user has the correct role
  if (userType && profile && profile.user_type !== userType) {
    // Redirect is handled in the useEffect above with a delay to show the toast
    return <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p className="mb-4">This page is only accessible to {userType}s.</p>
        <p>Redirecting to your dashboard...</p>
      </div>
    </div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
