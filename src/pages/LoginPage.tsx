import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MainLayout from '@/components/layout/MainLayout';
import { SEOHead } from '@/components/common/SEOHead';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail, CheckCircle } from 'lucide-react';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C41 35.5 44 30.2 44 24c0-1.3-.1-2.3-.4-3.5z"/>
  </svg>
);

const LoginPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailVerificationDialog, setShowEmailVerificationDialog] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [showForgotDialog, setShowForgotDialog] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pincode, setPincode] = useState('');
  const [userType, setUserType] = useState<'customer' | 'vendor'>('customer');
  const [electricityBill, setElectricityBill] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: 'https://getasolar.in/login' },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: 'Google sign-in failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
      setGoogleLoading(false);
    }
  };

  // Handle email verification on page load
  useEffect(() => {
    const handleEmailVerification = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('access_token');
      const refreshToken = urlParams.get('refresh_token');
      const type = urlParams.get('type');

      if (type === 'signup' && accessToken && refreshToken) {
        try {
          // Set the session with the tokens from URL
          const { data: { session }, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) throw error;

          if (session?.user) {
            toast({
              title: "Email verified successfully!",
              description: "Welcome to Get A Solar!",
            });

            // Get user's profile to redirect to appropriate dashboard
            const { data: profile } = await supabase
              .from('profiles')
              .select('user_type')
              .eq('id', session.user.id)
              .single();

            // Redirect based on user type
            if (profile?.user_type === 'vendor') {
              navigate('/vendor');
            } else {
              navigate('/customer');
            }
          }
        } catch (error: any) {
          console.error('Email verification error:', error);
          toast({
            title: "Verification failed",
            description: "There was an issue verifying your email. Please try logging in.",
            variant: "destructive",
          });
        }
      }
    };

    handleEmailVerification();

    // Handle OAuth redirect (Google) — session is auto-set from URL hash by supabase-js
    const redirectToDashboard = async (userId: string) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', userId)
        .single();
      navigate(profile?.user_type === 'vendor' ? '/vendor' : '/customer');
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && window.location.hash.includes('access_token')) {
        toast({ title: 'Signed in successfully', description: 'Welcome to Get A Solar!' });
        redirectToDashboard(session.user.id);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user && window.location.pathname === '/login') {
        redirectToDashboard(session.user.id);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, toast]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setForgotSent(true);
    } catch (error: any) {
      toast({
        title: 'Could not send reset email',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      
      if (error) throw error;
      
      toast({
        title: "Login successful",
        description: "Welcome back to Get A Solar!",
      });
      
      // Get user profile to redirect appropriately
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();
        
        if (profile?.user_type === 'vendor') {
          navigate('/vendor');
        } else {
          navigate('/customer');
        }
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate pin code
    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      toast({
        title: "Invalid PIN code",
        description: "Please enter a valid 6-digit PIN code.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate phone number
    if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create the user account with metadata
      const { error: signUpError, data: authData } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            full_name: fullName,
            phone_number: phoneNumber,
            pincode: pincode,
            user_type: userType,
            electricity_bill: userType === 'customer' ? electricityBill : null,
          },
          emailRedirectTo: `${window.location.origin}/login`
        },
      });
      
      if (signUpError) throw signUpError;
      
      // Check if email confirmation is required
      if (authData.user && !authData.session) {
        // Show email verification dialog
        setVerificationEmail(signupEmail);
        setShowEmailVerificationDialog(true);
        
        // Clear form
        setSignupEmail('');
        setSignupPassword('');
        setFullName('');
        setPhoneNumber('');
        setPincode('');
        setElectricityBill('');
        setUserType('customer');
      } else if (authData.session) {
        // User is automatically logged in (email confirmation disabled)
        toast({
          title: "Account created successfully",
          description: "Welcome to Get A Solar!",
        });
        
        // Redirect based on user type
        if (userType === 'vendor') {
          navigate('/vendor');
        } else {
          navigate('/customer');
        }
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      
      // Handle specific error cases
      if (error.message?.includes("User already registered") || error.message?.includes("already been registered")) {
        toast({
          title: "Account already exists",
          description: "An account with this email already exists. Please try logging in instead.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign up failed",
          description: error.message || "An error occurred during sign up. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <SEOHead 
        title="Login or Sign Up"
        description="Join Get A Solar to connect with verified solar vendors, get competitive quotes, and start your solar energy journey. Create your customer or vendor account today."
        keywords="solar login, solar signup, solar platform, solar vendor registration, solar customer registration"
      />
      <div className="container py-8 flex justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">Welcome to <span className="text-sbs-purple">Get A Solar</span></h1>
          
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Sign in or create an account</CardTitle>
              <CardDescription className="text-center">
                Choose your account type to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full h-11 mb-4 bg-background hover:bg-accent border-input font-medium"
                >
                  <GoogleIcon />
                  {googleLoading ? 'Redirecting...' : 'Continue with Google'}
                </Button>

                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                  </div>
                </div>

                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="you@example.com" 
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <button
                          type="button"
                          onClick={() => { setForgotEmail(loginEmail); setForgotSent(false); setShowForgotDialog(true); }}
                          className="text-xs text-sbs-purple hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <Input 
                        id="password" 
                        type="password" 
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-sbs-purple hover:bg-sbs-purple-dark"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing in...' : 'Login'}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input 
                        id="signup-name" 
                        type="text" 
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input 
                        id="signup-email" 
                        type="email" 
                        placeholder="you@example.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input 
                        id="signup-password" 
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone-number">Phone Number</Label>
                      <Input 
                        id="phone-number" 
                        type="tel" 
                        placeholder="10-digit phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        required
                        maxLength={10}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">PIN Code</Label>
                      <Input 
                        id="pincode" 
                        type="text" 
                        placeholder="6-digit PIN code"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength={6}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>I am a</Label>
                      <RadioGroup 
                        value={userType} 
                        onValueChange={(value) => setUserType(value as 'customer' | 'vendor')}
                        className="grid grid-cols-2 gap-4 mt-1"
                      >
                        <div className={`border-2 rounded-md p-3 flex items-center space-x-2
                          ${userType === 'customer' ? 'border-sbs-purple bg-sbs-purple/5' : 'border-muted'}`}
                        >
                          <RadioGroupItem value="customer" id="customer" />
                          <Label htmlFor="customer" className="cursor-pointer w-full">Customer</Label>
                        </div>
                        <div className={`border-2 rounded-md p-3 flex items-center space-x-2
                          ${userType === 'vendor' ? 'border-sbs-orange bg-sbs-orange/5' : 'border-muted'}`}
                        >
                          <RadioGroupItem value="vendor" id="vendor" />
                          <Label htmlFor="vendor" className="cursor-pointer w-full">Vendor</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    {userType === 'customer' && (
                      <div className="space-y-2">
                        <Label htmlFor="electricity-bill">Last Month's Electricity Bill (₹)</Label>
                        <Input 
                          id="electricity-bill" 
                          type="number" 
                          placeholder="Amount in rupees"
                          value={electricityBill}
                          onChange={(e) => setElectricityBill(e.target.value)}
                          required={userType === 'customer'}
                          min="0"
                        />
                      </div>
                    )}
                    <Button 
                      type="submit" 
                      className={`w-full ${userType === 'customer' 
                        ? 'bg-sbs-purple hover:bg-sbs-purple-dark' 
                        : 'bg-sbs-orange hover:bg-sbs-orange/90'}`}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            By continuing, you agree to our{' '}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>

      {/* Email Verification Dialog */}
      <AlertDialog open={showEmailVerificationDialog} onOpenChange={setShowEmailVerificationDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-blue-100 p-3">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <AlertDialogTitle className="text-xl">Check Your Email</AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-2">
              <p>We've sent a verification link to:</p>
              <p className="font-semibold text-foreground">{verificationEmail}</p>
              <p className="text-sm text-muted-foreground mt-4">
                Click the link in your email to verify your account and complete the signup process.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-center mt-4">
            <Button 
              onClick={() => setShowEmailVerificationDialog(false)}
              className="w-full"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Got it
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotDialog} onOpenChange={setShowForgotDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset your password</DialogTitle>
            <DialogDescription>
              {forgotSent
                ? `We've sent a password reset link to ${forgotEmail}. Click the link in the email to set a new password.`
                : 'Enter your account email and we\'ll send you a link to reset your password.'}
            </DialogDescription>
          </DialogHeader>
          {forgotSent ? (
            <DialogFooter>
              <Button className="w-full" onClick={() => setShowForgotDialog(false)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Got it
              </Button>
            </DialogFooter>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="you@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full bg-sbs-purple hover:bg-sbs-purple-dark"
                  disabled={forgotLoading}
                >
                  {forgotLoading ? 'Sending...' : 'Send reset link'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default LoginPage;
