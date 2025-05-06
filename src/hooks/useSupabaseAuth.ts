
import { useSupabaseAuthState } from './auth/useSupabaseAuthState';

export function useSupabaseAuth() {
  return useSupabaseAuthState();
}
