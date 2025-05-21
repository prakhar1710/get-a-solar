
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types';

export function useVendorProjects() {
  const { toast } = useToast();
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
      return data;
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error fetching projects",
        description: error.message || "Failed to load available projects.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Refresh projects list
  const refreshProjects = useCallback(async () => {
    const data = await fetchProjects();
    toast({
      title: "Projects refreshed",
      description: "Available projects have been updated.",
    });
    return data;
  }, [fetchProjects, toast]);

  return {
    availableProjects,
    isLoading,
    fetchProjects,
    refreshProjects
  };
}
