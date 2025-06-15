
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Project, Bid } from '@/types';
import { rankBids } from '@/utils/bidRanking';

export const useCustomerProjects = (userId: string | undefined) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectBids, setProjectBids] = useState<Bid[]>([]);
  const [rankedBids, setRankedBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBidsDialog, setShowBidsDialog] = useState(false);

  // Fetch customer projects
  const fetchProjects = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setProjects(data as Project[] || []);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error fetching projects",
        description: error.message || "Failed to load your projects.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast]);

  // Handle viewing project details and bids
  const handleViewDetails = useCallback(async (project: Project) => {
    setSelectedProject(project);
    
    try {
      // Fetch bids for the selected project with vendor profile information
      const { data: bidsData, error: bidsError } = await supabase
        .from('bids')
        .select(`
          *,
          vendor_profile:profiles!bids_vendor_id_fkey (
            full_name,
            phone_number
          )
        `)
        .eq('project_id', project.id);
        
      if (bidsError) throw bidsError;
      
      console.log('Fetched bids data:', bidsData);
      
      const bidsWithVendorInfo = bidsData?.map(bid => {
        const vendorName = bid.vendor_profile?.full_name || 'Vendor';
        console.log('Processing bid:', bid.id, 'Vendor name:', vendorName);
        
        return {
          ...bid,
          vendor_name: vendorName,
          vendor_rating: 4.5, // Mock rating for now
          equipment_tier: bid.equipment_tier as 'tier1' | 'tier2' | 'tier3'
        };
      }) || [];
      
      setProjectBids(bidsWithVendorInfo as Bid[]);
      
      // Rank the bids using our algorithm
      const ranked = rankBids(bidsWithVendorInfo as Bid[], project);
      setRankedBids(ranked);
      
      setShowBidsDialog(true);
    } catch (error: any) {
      console.error('Error fetching bids:', error);
      toast({
        title: "Error fetching bids",
        description: error.message || "Failed to fetch bids for this project.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Initial load of projects
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    isLoading,
    selectedProject,
    projectBids: rankedBids,
    showBidsDialog,
    setShowBidsDialog,
    handleViewDetails,
    refreshProjects: fetchProjects
  };
};
