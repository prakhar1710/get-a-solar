
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const VerificationStatusCard = () => {
  return (
    <Card className="mb-8 border-orange-200 bg-orange-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Verification Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              <Check className="h-3 w-3 mr-1" /> GSTIN Verified
            </Badge>
            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
              ALMM Certification Pending
            </Badge>
            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
              BIS Certification Pending
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Complete your verification process to improve your visibility and bid ranking.
          </p>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="text-sbs-orange border-sbs-orange hover:bg-sbs-orange hover:text-white">
          Complete Verification
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VerificationStatusCard;
