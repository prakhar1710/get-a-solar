
import { useState, useEffect, useCallback } from 'react';
import { useVendorBids } from './useVendorBids';
import { useVendorProjects } from './useVendorProjects';
import { Project } from '@/types';

export function useVendorDashboard() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showBidForm, setShowBidForm] = useState(false);
  
  const {
    submittedBids,
    fetchBids,
    submitBid
  } = useVendorBids();
  
  const {
    availableProjects,
    isLoading,
    fetchProjects,
    refreshProjects
  } = useVendorProjects();

  // Load both projects and bids on initial render
  useEffect(() => {
    fetchProjects();
    fetchBids();
  }, [fetchProjects, fetchBids]);

  // Handle bid submission
  const handleBidSubmit = async (data: any) => {
    if (!selectedProject) return;
    
    const bid = await submitBid(selectedProject.id, data);
    if (bid) {
      setShowBidForm(false);
    }
  };

  // Handle project selection
  const handleProjectSelect = useCallback((project: Project) => {
    setSelectedProject(project);
    setShowBidForm(true);
  }, []);

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
