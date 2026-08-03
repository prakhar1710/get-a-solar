
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileSetupDialogProps {
  open: boolean;
  onProfileUpdated: () => void;
}

const ProfileSetupDialog: React.FC<ProfileSetupDialogProps> = ({ open, onProfileUpdated }) => {
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'vendor'>('customer');
  const [fullName, setFullName] = useState(
    (user?.user_metadata?.full_name as string) || (user?.user_metadata?.name as string) || ''
  );
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pincode, setPincode] = useState('');
  const [electricityBill, setElectricityBill] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "No user found. Please try logging in again.",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    if (fullName.trim().length < 2) {
      toast({
        title: "Invalid name",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }

    if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }

    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      toast({
        title: "Invalid PIN code",
        description: "Please enter a valid 6-digit PIN code.",
        variant: "destructive",
      });
      return;
    }

    if (userType === 'customer' && (!electricityBill || Number(electricityBill) <= 0)) {
      toast({
        title: "Invalid electricity bill",
        description: "Please enter a valid electricity bill amount.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const profileData = {
        id: user.id,
        full_name: fullName.trim().slice(0, 100),
        email: user.email ?? null,
        user_type: userType,
        phone_number: phoneNumber,
        pincode: pincode,
        electricity_bill: userType === 'customer' ? Number(electricityBill) : null,
        updated_at: new Date().toISOString(),
      };


      console.log('Updating profile with data:', profileData);

      const { error, data } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select();

      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }

      console.log('Profile updated successfully:', data);

      toast({
        title: "Profile updated",
        description: `Your profile has been set up as a ${userType}.`,
      });

      // Refresh the profile data
      await refreshProfile();
      onProfileUpdated();

    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        title: "Profile update failed",
        description: error.message || "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please complete your profile setup to continue using the platform.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full-name">Full Name</Label>
            <Input
              id="full-name"
              type="text"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value.slice(0, 100))}
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
            {isLoading ? 'Updating Profile...' : 'Complete Setup'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSetupDialog;
