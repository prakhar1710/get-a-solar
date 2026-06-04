import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MainLayout from '@/components/layout/MainLayout';
import { SEOHead } from '@/components/common/SEOHead';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ResetPasswordPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Supabase parses the recovery tokens from the URL hash automatically
    // and emits a PASSWORD_RECOVERY event. We also check for an existing session.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setIsReady(true);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsReady(true);
      } else {
        // Check URL for error params
        const hash = new URLSearchParams(window.location.hash.replace('#', ''));
        const error = hash.get('error_description');
        if (error) {
          setErrorMsg(error);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({ title: 'Password too short', description: 'Use at least 6 characters.', variant: 'destructive' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      toast({ title: 'Password updated', description: 'You can now log in with your new password.' });
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error: any) {
      toast({
        title: 'Could not reset password',
        description: error.message || 'The reset link may have expired. Please request a new one.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <SEOHead
        title="Reset Password"
        description="Set a new password for your Get A Solar account."
      />
      <div className="container py-12 flex justify-center">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Reset your password</CardTitle>
              <CardDescription className="text-center">
                Enter a new password for your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errorMsg ? (
                <div className="space-y-4 text-center">
                  <p className="text-sm text-destructive">{errorMsg}</p>
                  <Button onClick={() => navigate('/login')} className="w-full">
                    Back to login
                  </Button>
                </div>
              ) : !isReady ? (
                <p className="text-center text-sm text-muted-foreground">
                  Validating reset link...
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-sbs-purple hover:bg-sbs-purple-dark"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Updating...' : 'Update password'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ResetPasswordPage;
