
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import MainLayout from '@/components/layout/MainLayout';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [customerType, setCustomerType] = useState<string>('residential');
  const [pin, setPin] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Login Successful",
      description: "You have been logged in successfully.",
    });
    navigate('/customer');
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Account Created",
      description: "Your account has been created successfully.",
    });
    navigate('/customer');
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
                Enter your details to get started with your solar journey
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
                      <Input id="email" type="email" placeholder="you@example.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+91 9876543210" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pin">6-Digit PIN</Label>
                      <InputOTP maxLength={6} value={pin} onChange={setPin}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    
                    <Button type="submit" className="w-full bg-sbs-purple hover:bg-sbs-purple-dark">
                      Login
                    </Button>
                    
                    <div className="text-xs text-center">
                      <a href="#" className="text-sbs-purple hover:underline">
                        Forgot your PIN?
                      </a>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input id="signup-name" type="text" placeholder="John Doe" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input id="signup-email" type="email" placeholder="you@example.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Phone Number</Label>
                      <Input id="signup-phone" type="tel" placeholder="+91 9876543210" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-pin">Create 6-Digit PIN</Label>
                      <InputOTP maxLength={6} value={pin} onChange={setPin}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Customer Type</Label>
                      <RadioGroup value={customerType} onValueChange={setCustomerType} className="grid grid-cols-2 gap-4 pt-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="residential" id="residential" />
                          <Label htmlFor="residential" className="cursor-pointer">Residential</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="commercial" id="commercial" />
                          <Label htmlFor="commercial" className="cursor-pointer">Commercial</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="electricity-bill">Last Month's Electricity Bill (₹)</Label>
                      <Input 
                        id="electricity-bill" 
                        type="number" 
                        min="0"
                        placeholder="e.g., 2500"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-sbs-orange hover:bg-sbs-orange/90">
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground text-center">
                By continuing, you agree to our{' '}
                <a href="#" className="text-sbs-purple underline underline-offset-4 hover:text-sbs-purple-dark">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-sbs-purple underline underline-offset-4 hover:text-sbs-purple-dark">
                  Privacy Policy
                </a>
                .
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
