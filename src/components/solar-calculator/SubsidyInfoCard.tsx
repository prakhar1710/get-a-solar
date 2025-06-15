
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { stateSubsidies } from '@/utils/solarSubsidyData';

interface SubsidyInfoCardProps {
  location: string;
}

const SubsidyInfoCard: React.FC<SubsidyInfoCardProps> = ({ location }) => {
  const selectedStateSubsidy = stateSubsidies[location as keyof typeof stateSubsidies];

  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <Info className="h-5 w-5" />
          Government Solar Subsidies Available
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-700 mb-2">Central Government (MNRE)</h4>
            <ul className="text-sm space-y-1">
              <li>• ₹14,588 per kW (up to 3kW)</li>
              <li>• ₹7,294 per kW (above 3kW)</li>
              <li>• Maximum: ₹78,000 per household</li>
            </ul>
          </div>
          
          {location && selectedStateSubsidy && (
            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-700 mb-2">{location} State Subsidy</h4>
              <p className="text-sm">{selectedStateSubsidy.description}</p>
            </div>
          )}
        </div>
        
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Subsidies are subject to availability and government policy changes. 
            Please verify current rates with local authorities before making final decisions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubsidyInfoCard;
