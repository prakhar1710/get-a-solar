
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import ProfileSetupDialog from '@/components/auth/ProfileSetupDialog';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType: 'customer' | 'vendor';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, userType }) => {
  const { user, profile, isLoading, refreshProfile } = useAuth();
  const { toast } = useToast();

  // Use useEffect to handle side effects like showing toasts
  useEffect(() => {
    if (!isLoading && user && profile && profile.user_type && profile.user_type !== userType) {
      toast({
        title: "Access denied",
        description: `This page is only accessible to ${userType}s.`,
        variant: "destructive",
      });
    }
  }, [isLoading, user, profile, userType, toast]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sbs-purple"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Setting up your profile...</h2>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sbs-purple mx-auto"></div>
        </div>
      </div>
    );
  }

  // No role chosen yet (e.g. Google sign-up): let the user pick customer or vendor
  if (!profile.user_type) {
    return (
      <ProfileSetupDialog open onProfileUpdated={() => { void refreshProfile(); }} />
    );
  }

  if (profile.user_type !== userType) {
    return <Navigate to={profile.user_type === 'customer' ? '/customer' : '/vendor'} replace />;
  }


  return <>{children}</>;
};

export default ProtectedRoute;
