
import React, { useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType?: 'customer' | 'vendor';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, userType }) => {
  const { user, profile, isLoading } = useAuth();
  const { toast } = useToast();
  const initialCheckDone = useRef(false);
  const toastShown = useRef(false);

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

  // If no profile exists yet or user_type is null, allow access but show loading
  if (!profile || profile.user_type === null) {
    return <div className="flex justify-center items-center h-screen">Setting up your profile...</div>;
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
