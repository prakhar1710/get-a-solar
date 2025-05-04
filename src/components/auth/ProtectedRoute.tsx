
import React, { useEffect } from 'react';
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

  useEffect(() => {
    // Check if user exists but doesn't have the correct user type
    if (user && profile && userType && profile.user_type !== userType) {
      toast({
        title: "Access Denied",
        description: `This page is only accessible to ${userType}s.`,
        variant: "destructive",
      });
    }
  }, [user, profile, userType, toast]);

  if (isLoading) {
    // Could add a loading spinner here
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    toast({
      title: "Authentication Required",
      description: "Please log in to access this page",
      variant: "destructive",
    });
    return <Navigate to="/login" />;
  }

  // If user type is specified, check if user has the correct role
  if (userType && profile && profile.user_type !== userType) {
    // Redirect to the appropriate dashboard
    const redirectPath = profile.user_type === 'customer' ? '/customer' : '/vendor';
    return <Navigate to={redirectPath} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
