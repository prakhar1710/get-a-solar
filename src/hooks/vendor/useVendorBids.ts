
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Bid } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export function useVendorBids() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [submittedBids, setSubmittedBids] = useState<Bid[]>([]);
  
  // Fetch vendor's submitted bids
  const fetchBids = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('bids')
        .select('*')
        .eq('vendor_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setSubmittedBids((data?.map(bid => ({
        ...bid,
        equipment_tier: bid.equipment_tier as 'tier1' | 'tier2' | 'tier3'
      })) as Bid[]) || []);
      
      return data;
    } catch (error: any) {
      console.error('Error fetching bids:', error);
      toast({
        title: "Error fetching bids",
        description: error.message || "Failed to load your bids.",
        variant: "destructive",
      });
      return null;
    }
  }, [user, toast]);

  // Handle bid submission
  const submitBid = useCallback(async (projectId: string, data: any) => {
    if (!user) {
      toast({
        title: "Error",
        description: "User data missing. Please try again.",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      const newBid = {
        project_id: projectId,
        vendor_id: user.id,
        price_per_watt: data.price_per_watt,
        equipment_tier: data.equipment_tier,
        timeline_days: data.timeline_days,
        amc_included: data.amc_included
      };
      
      const { error, data: createdBid } = await supabase
        .from('bids')
        .insert([newBid])
        .select();
        
      if (error) {
        console.error("Bid submission error:", error);
        throw error;
      }
      
      if (createdBid && createdBid.length > 0) {
        const typedBid = {
          ...createdBid[0],
          equipment_tier: createdBid[0].equipment_tier as 'tier1' | 'tier2' | 'tier3'
        } as Bid;
        
        setSubmittedBids(prev => [typedBid, ...prev]);
        
        toast({
          title: "Bid submitted successfully",
          description: "Your bid has been sent to the customer for review.",
        });
        
        return typedBid;
      }
      
      return null;
    } catch (error: any) {
      console.error("Full error details:", error);
      toast({
        title: "Error submitting bid",
        description: error.message || "Failed to submit your bid. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }, [user, toast]);

  return {
    submittedBids,
    fetchBids,
    submitBid
  };
}
