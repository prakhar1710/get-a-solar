
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Project, Bid } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { rankBids } from '@/utils/bidRanking';

export interface AcceptedBidInfo {
  bid_id: string;
  vendor_id: string;
  vendor_name: string | null;
}

export const useCustomerProjects = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectBids, setProjectBids] = useState<Bid[]>([]);
  const [showBidsDialog, setShowBidsDialog] = useState(false);
  const [reviewedProjectIds, setReviewedProjectIds] = useState<Set<string>>(new Set());
  const [acceptedBidsByProject, setAcceptedBidsByProject] = useState<Record<string, AcceptedBidInfo>>({});

  const fetchProjects = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const projectList = (data as Project[]) || [];
      setProjects(projectList);

      // Fetch reviews for these projects
      const projectIds = projectList.map((p) => p.id);
      if (projectIds.length > 0) {
        const { data: reviewRows } = await supabase
          .from('reviews')
          .select('project_id')
          .in('project_id', projectIds);
        setReviewedProjectIds(new Set((reviewRows || []).map((r: any) => r.project_id)));

        // Fetch accepted bids + vendor info
        const acceptedBidIds = projectList
          .map((p) => p.accepted_bid_id)
          .filter((v): v is string => !!v);
        if (acceptedBidIds.length > 0) {
          const { data: bidRows } = await supabase
            .from('bids')
            .select('id, project_id, vendor_id, vendor_name')
            .in('id', acceptedBidIds);
          const map: Record<string, AcceptedBidInfo> = {};
          (bidRows || []).forEach((b: any) => {
            map[b.project_id] = {
              bid_id: b.id,
              vendor_id: b.vendor_id,
              vendor_name: b.vendor_name || null,
            };
          });
          setAcceptedBidsByProject(map);
        } else {
          setAcceptedBidsByProject({});
        }
      } else {
        setReviewedProjectIds(new Set());
        setAcceptedBidsByProject({});
      }
    } catch (error: any) {
      console.error('Error in fetchProjects:', error);
      toast({
        title: 'Error fetching projects',
        description: error.message || 'Failed to load your projects.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user, fetchProjects]);

  const fetchBidsForProject = async (projectId: string): Promise<Bid[]> => {
    try {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;

      const { data: bidsData, error: bidsError } = await supabase
        .from('bids')
        .select(`
          *,
          vendor_profile:profiles!bids_vendor_id_fkey (
            id,
            full_name,
            phone_number
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (bidsError) throw bidsError;

      const bids: Bid[] = (bidsData || []).map((bid: any) => ({
        ...bid,
        vendor_name: bid.vendor_profile?.full_name || 'Vendor',
        vendor_rating: 4.0,
        equipment_tier: bid.equipment_tier as 'tier1' | 'tier2' | 'tier3',
      }));

      return rankBids(bids, projectData as Project);
    } catch (error: any) {
      console.error('Error fetching bids for project:', error);
      toast({
        title: 'Error fetching bids',
        description: error.message || 'Failed to load bids for this project.',
        variant: 'destructive',
      });
      return [];
    }
  };

  const handleViewDetails = async (project: Project) => {
    setSelectedProject(project);
    const bids = await fetchBidsForProject(project.id);
    setProjectBids(bids);
    setShowBidsDialog(true);
  };

  const markProjectCompleted = async (project: Project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'completed' })
        .eq('id', project.id);
      if (error) throw error;
      toast({
        title: 'Project marked as completed',
        description: 'You can now rate the vendor.',
      });
      fetchProjects();
    } catch (error: any) {
      toast({
        title: 'Error updating project',
        description: error.message || 'Failed to mark project as completed.',
        variant: 'destructive',
      });
    }
  };

  return {
    projects,
    isLoading,
    selectedProject,
    projectBids,
    showBidsDialog,
    setShowBidsDialog,
    handleViewDetails,
    fetchBidsForProject,
    reviewedProjectIds,
    acceptedBidsByProject,
    markProjectCompleted,
    refreshProjects: fetchProjects,
  };
};
