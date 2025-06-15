
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Project, Bid } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const useCustomerProjects = (customerId?: string) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectBids, setProjectBids] = useState<Bid[]>([]);
  const [showBidsDialog, setShowBidsDialog] = useState(false);

  const fetchProjects = useCallback(async () => {
    if (!customerId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }

      setProjects((data as Project[]) || []);
    } catch (error: any) {
      console.error('Error in fetchProjects:', error);
      toast({
        title: "Error loading projects",
        description: error.message || "Failed to load your projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [customerId, toast]);

  const fetchProjectBids = useCallback(async (projectId: string) => {
    try {
      console.log('Fetching bids for project:', projectId);
      
      const { data: bidsData, error } = await supabase
        .from('bids')
        .select(`
          *,
          vendor_profile:profiles!bids_vendor_id_fkey (*)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bids:', error);
        throw error;
      }

      console.log('Fetched bids data:', bidsData);

      const processedBids: Bid[] = bidsData?.map((bid: any) => {
        console.log('Processing bid:', bid.id, 'Vendor name:', bid.vendor_profile?.full_name || 'Vendor');
        
        return {
          ...bid,
          equipment_tier: bid.equipment_tier as 'tier1' | 'tier2' | 'tier3',
          vendor_profile: bid.vendor_profile
        };
      }) || [];

      setProjectBids(processedBids);
    } catch (error: any) {
      console.error('Error fetching project bids:', error);
      toast({
        title: "Error loading bids",
        description: error.message || "Failed to load project bids.",
        variant: "destructive",
      });
      setProjectBids([]);
    }
  }, [toast]);

  const handleViewDetails = useCallback(async (project: Project) => {
    setSelectedProject(project);
    await fetchProjectBids(project.id);
    setShowBidsDialog(true);
  }, [fetchProjectBids]);

  const refreshProjects = useCallback(async () => {
    await fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    isLoading,
    selectedProject,
    projectBids,
    showBidsDialog,
    setShowBidsDialog,
    handleViewDetails,
    refreshProjects
  };
};
