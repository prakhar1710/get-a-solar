
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MainLayout from '@/components/layout/MainLayout';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Authentication Required",
      description: "Please connect Supabase to enable authentication and login functionality.",
      variant: "destructive",
    });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Authentication Required",
      description: "Please connect Supabase to enable authentication and registration functionality.",
      variant: "destructive",
    });
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
                      <Input id="email" type="email" placeholder="you@example.com" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <a href="#" className="text-xs text-sbs-purple hover:underline">
                          Forgot password?
                        </a>
                      </div>
                      <Input id="password" type="password" />
                    </div>
                    <Button type="submit" className="w-full bg-sbs-purple hover:bg-sbs-purple-dark">
                      Login
                    </Button>
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
                      <Label htmlFor="signup-password">Password</Label>
                      <Input id="signup-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account-type">I am a</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Button type="button" variant="outline" className="border-2 border-sbs-purple/30 hover:border-sbs-purple hover:bg-sbs-purple/5">
                          Customer
                        </Button>
                        <Button type="button" variant="outline" className="border-2 border-sbs-orange/30 hover:border-sbs-orange hover:bg-sbs-orange/5">
                          Vendor
                        </Button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-sbs-orange hover:bg-sbs-orange/90">
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="relative w-full mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Connect with Supabase
                  </span>
                </div>
              </div>
              <Button 
                onClick={() => {
                  toast({
                    title: "Supabase Connection Required",
                    description: "Please connect Supabase to enable authentication and database functionality.",
                    variant: "destructive",
                  });
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Connect Supabase
              </Button>
            </CardFooter>
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
