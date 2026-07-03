import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Project, Bid } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useVendorDashboard = () => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [submittedBids, setSubmittedBids] = useState<Bid[]>([]);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [bidProjects, setBidProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all available projects
  useEffect(() => {
    const fetchProjects = async () => {
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
    };

    fetchProjects();
  }, [toast]);

  // Fetch vendor's submitted bids and their related projects
  useEffect(() => {
    if (!user) return;

    const fetchBidsAndProjects = async () => {
      try {
        // Fetch vendor's bids + project info for each bid
        const { data: bidsData, error: bidsError } = await supabase
          .from('bids')
          .select(`
            *,
            project:projects!bids_project_id_fkey (*)
          `)
          .eq('vendor_id', user.id)
          .order('created_at', { ascending: false });

        if (bidsError) {
          console.error('Error fetching bids:', bidsError);
          throw bidsError;
        }

        const bidsWithProjects: Bid[] = bidsData?.map((bid: any) => ({
            ...bid,
            project: bid.project ? {
              ...bid.project,
              status: bid.project.status as 'open' | 'closed' | 'awarded'
            } : undefined,
            equipment_tier: bid.equipment_tier as 'tier1' | 'tier2' | 'tier3'
          })) || [];

        setSubmittedBids(bidsWithProjects);

        // Collect unique projects from these bids
        const uniqueProjectsMap: { [id: string]: Project } = {};
        for (const bid of bidsWithProjects) {
          if (bid.project && bid.project.id) {
            uniqueProjectsMap[bid.project.id] = bid.project;
          }
        }
        setBidProjects(Object.values(uniqueProjectsMap));
      } catch (error: any) {
        console.error('Error fetching bids:', error);
        toast({
          title: "Error fetching bids",
          description: error.message || "Failed to load your bids.",
          variant: "destructive",
        });
      }
    };

    fetchBidsAndProjects();
  }, [user, toast]);

  const handleBidSubmit = async (data: any, selectedProject: Project) => {
    if (!user || !selectedProject) {
      toast({
        title: "Error",
        description: "User or project data missing. Please try again.",
        variant: "destructive",
      });
      return false;
    }
    try {
      console.log("Submitting bid with vendor_id:", user.id);
      console.log("Bid data:", data);

      const newBid = {
        project_id: selectedProject.id,
        vendor_id: user.id,
        vendor_name: profile?.full_name?.trim() || 'Vendor',
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
          equipment_tier: createdBid[0].equipment_tier as 'tier1' | 'tier2' | 'tier3',
          project: selectedProject,
        } as Bid;

        setSubmittedBids((prev) => [typedBid, ...prev]);
        setBidProjects((prev) =>
          prev.some((p) => p.id === selectedProject.id) ? prev : [selectedProject, ...prev]
        );

        toast({
          title: "Bid submitted successfully",
          description: "Your bid has been sent to the customer for review.",
        });

        return true;
      }
    } catch (error: any) {
      console.error("Full error details:", error);
      toast({
        title: "Error submitting bid",
        description: error.message || "Failed to submit your bid. Please try again.",
        variant: "destructive",
      });
    }

    return false;
  };

  const refreshProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAvailableProjects((data as Project[]) || []);

      toast({
        title: "Projects refreshed",
        description: "Available projects have been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error refreshing projects",
        description: error.message || "Failed to refresh available projects.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submittedBids,
    availableProjects,
    bidProjects, // <-- all projects corresponding to your bids (open, closed, awarded, etc.)
    isLoading,
    handleBidSubmit,
    refreshProjects
  };
};
