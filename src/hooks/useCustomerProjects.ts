
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Project, Bid } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { rankBids } from '@/utils/bidRanking';

export const useCustomerProjects = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectBids, setProjectBids] = useState<Bid[]>([]);
  const [showBidsDialog, setShowBidsDialog] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      console.log('Fetching projects for customer:', user.id);
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }

      console.log('Fetched projects:', data);
      setProjects((data as Project[]) || []);
    } catch (error: any) {
      console.error('Error in fetchProjects:', error);
      toast({
        title: "Error fetching projects",
        description: error.message || "Failed to load your projects.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBidsForProject = async (projectId: string): Promise<Bid[]> => {
    try {
      console.log('Fetching bids for project:', projectId);
      
      // Get the project details first for ranking context
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError) {
        console.error('Error fetching project:', projectError);
        throw projectError;
      }

      // Fetch bids with vendor profile information
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

      if (bidsError) {
        console.error('Error fetching bids:', bidsError);
        throw bidsError;
      }

      console.log('Fetched bids data:', bidsData);

      // Transform the data to match our Bid interface
      const bids: Bid[] = (bidsData || []).map((bid: any) => {
        const vendorName = bid.vendor_profile?.full_name || 'Vendor';
        console.log(`Processing bid: ${bid.id} Vendor name: ${vendorName}`);
        
        return {
          ...bid,
          vendor_name: vendorName,
          vendor_rating: 4.0, // Default rating since we don't have ratings yet
          equipment_tier: bid.equipment_tier as 'tier1' | 'tier2' | 'tier3'
        };
      });

      // Rank the bids with project context
      const rankedBids = rankBids(bids, projectData as Project);
      console.log('Ranked bids:', rankedBids);
      
      return rankedBids;
    } catch (error: any) {
      console.error('Error fetching bids for project:', error);
      toast({
        title: "Error fetching bids",
        description: error.message || "Failed to load bids for this project.",
        variant: "destructive",
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

  const createProject = async (projectData: any) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a project.",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log('Creating project with customer_id:', user.id);
      
      const newProject = {
        ...projectData,
        customer_id: user.id,
      };

      const { data, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select();

      if (error) {
        console.error('Project creation error:', error);
        throw error;
      }

      console.log('Project created successfully:', data);

      if (data && data.length > 0) {
        setProjects([data[0] as Project, ...projects]);
        toast({
          title: "Project created successfully",
          description: "Your solar project has been posted and vendors can now submit bids.",
        });
        return true;
      }
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: "Error creating project",
        description: error.message || "Failed to create your project. Please try again.",
        variant: "destructive",
      });
    }

    return false;
  };

  return {
    projects,
    isLoading,
    selectedProject,
    projectBids,
    showBidsDialog,
    setShowBidsDialog,
    handleViewDetails,
    createProject,
    fetchBidsForProject,
    refreshProjects: fetchProjects
  };
};
