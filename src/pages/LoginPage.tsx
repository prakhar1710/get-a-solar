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
import { Mail, CheckCircle } from 'lucide-react';

const LoginPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailVerificationDialog, setShowEmailVerificationDialog] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  
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
  }, [navigate, toast]);

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
                        <a href="#" className="text-xs text-sbs-purple hover:underline">
                          Forgot password?
                        </a>
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
    </MainLayout>
  );
};

export default LoginPage;
