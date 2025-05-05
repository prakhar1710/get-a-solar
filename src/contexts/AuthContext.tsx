
import React, { createContext, useContext } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useSupabaseAuth();
  
  // Create a memoized value to prevent unnecessary re-renders
  const authContextValue = React.useMemo(() => ({
    session: auth.session, 
    user: auth.user, 
    profile: auth.profile, 
    isLoading: auth.isLoading, 
    signOut: auth.signOut, 
    refreshProfile: auth.refreshProfile
  }), [
    auth.session, 
    auth.user, 
    auth.profile, 
    auth.isLoading, 
    auth.signOut, 
    auth.refreshProfile
  ]);

  return (
    <AuthContext.Provider value={authContextValue}>
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
