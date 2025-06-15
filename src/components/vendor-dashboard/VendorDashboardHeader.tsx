
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

const VendorDashboardHeader: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
      <div>
        <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Browse available solar projects and submit competitive bids
        </p>
      </div>
      <Button 
        className="bg-sbs-orange hover:bg-sbs-orange/90 text-white flex items-center gap-2"
      >
        <Upload className="h-4 w-4" /> Upload Certifications
      </Button>
    </div>
  );
};

export default VendorDashboardHeader;
