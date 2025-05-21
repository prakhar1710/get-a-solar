
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Project, Bid } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export function useVendorDashboard() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showBidForm, setShowBidForm] = useState(false);
  const [submittedBids, setSubmittedBids] = useState<Bid[]>([]);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch all available projects
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setAvailableProjects((data as Project[]) || []);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error fetching projects",
        description: error.message || "Failed to load available projects.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
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
    } catch (error: any) {
      console.error('Error fetching bids:', error);
      toast({
        title: "Error fetching bids",
        description: error.message || "Failed to load your bids.",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  // Load both projects and bids on initial render
  useEffect(() => {
    fetchProjects();
    fetchBids();
  }, [fetchProjects, fetchBids]);

  // Handle bid submission
  const handleBidSubmit = async (data: any) => {
    if (!user || !selectedProject) {
      toast({
        title: "Error",
        description: "User or project data missing. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log("Submitting bid with vendor_id:", user.id);
      console.log("Bid data:", data);
      
      const newBid = {
        project_id: selectedProject.id,
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
      
      console.log("Bid submitted successfully:", createdBid);
      
      if (createdBid && createdBid.length > 0) {
        const typedBid = {
          ...createdBid[0],
          equipment_tier: createdBid[0].equipment_tier as 'tier1' | 'tier2' | 'tier3'
        } as Bid;
        
        setSubmittedBids([typedBid, ...submittedBids]);
        setShowBidForm(false);
        
        toast({
          title: "Bid submitted successfully",
          description: "Your bid has been sent to the customer for review.",
        });
      }
    } catch (error: any) {
      console.error("Full error details:", error);
      toast({
        title: "Error submitting bid",
        description: error.message || "Failed to submit your bid. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle project selection
  const handleProjectSelect = useCallback((project: Project) => {
    setSelectedProject(project);
    setShowBidForm(true);
  }, []);

  // Refresh projects list
  const refreshProjects = useCallback(async () => {
    await fetchProjects();
    toast({
      title: "Projects refreshed",
      description: "Available projects have been updated.",
    });
  }, [fetchProjects, toast]);

  const handleViewAvailableProjects = useCallback(() => {
    document.querySelector('[data-value="available"]')?.dispatchEvent(new MouseEvent('click'));
  }, []);

  return {
    selectedProject,
    showBidForm,
    setShowBidForm,
    submittedBids,
    availableProjects,
    isLoading,
    handleBidSubmit,
    handleProjectSelect,
    refreshProjects,
    handleViewAvailableProjects
  };
}
