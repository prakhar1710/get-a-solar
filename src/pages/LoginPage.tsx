
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MainLayout from '@/components/layout/MainLayout';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const LoginPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
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

  // Add test credentials to make logging in easier during development
  const fillTestCustomerCredentials = () => {
    setLoginEmail('customer@example.com');
    setLoginPassword('password123');
  };

  const fillTestVendorCredentials = () => {
    setLoginEmail('vendor@example.com');
    setLoginPassword('password123');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Attempting login with:', { email: loginEmail });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      
      if (error) {
        console.error('Login error:', error);
        throw error;
      }
      
      console.log('Login successful:', data);
      
      toast({
        title: "Login successful",
        description: "Welcome back to Get A Solar!",
      });
      
      // Redirect based on user type
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error fetching profile after login:", profileError);
        throw profileError;
      }
      
      console.log('Profile data:', profileData);
      
      if (profileData?.user_type === 'vendor') {
        navigate('/vendor');
      } else if (profileData?.user_type === 'customer') {
        navigate('/customer');
      } else {
        // If user_type is null or undefined, let's set a default
        const userId = (await supabase.auth.getUser()).data.user?.id;
        if (userId) {
          await supabase
            .from('profiles')
            .update({ user_type: 'customer' })
            .eq('id', userId);
          navigate('/customer');
        } else {
          navigate('/');
        }
      }
    } catch (error: any) {
      console.error('Login error details:', error);
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
    
    setIsLoading(true);
    
    try {
      console.log('Attempting signup with:', { email: signupEmail });
      
      // Create the user account
      const { error: signUpError, data: authData } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (signUpError) throw signUpError;
      
      console.log('Signup successful:', authData);
      
      // Update the profile with additional information
      if (authData?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            full_name: fullName,
            phone_number: phoneNumber,
            pincode: pincode,
            user_type: userType,
            electricity_bill: userType === 'customer' ? Number(electricityBill) : null,
          }, { onConflict: 'id' });
        
        if (profileError) {
          console.error("Error updating profile:", profileError);
          throw profileError;
        }
        
        // Wait a moment to ensure profile is updated
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Log in the user automatically
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: signupEmail,
          password: signupPassword,
        });
        
        if (signInError) {
          toast({
            title: "Account created but couldn't log in automatically",
            description: "Please log in with your new account.",
          });
          return;
        }
        
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
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
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
                    
                    {/* Dev tools for easy login */}
                    <div className="pt-4 border-t mt-4">
                      <p className="text-sm text-gray-500 mb-2">Development testing accounts:</p>
                      <div className="flex gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="text-xs flex-1"
                          onClick={fillTestCustomerCredentials}
                        >
                          Test Customer
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="text-xs flex-1"
                          onClick={fillTestVendorCredentials}
                        >
                          Test Vendor
                        </Button>
                      </div>
                    </div>
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
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone-number">Phone Number</Label>
                      <Input 
                        id="phone-number" 
                        type="tel" 
                        placeholder="10-digit phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">PIN Code</Label>
                      <Input 
                        id="pincode" 
                        type="text" 
                        placeholder="6-digit PIN code"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
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
    </MainLayout>
  );
};

export default LoginPage;
