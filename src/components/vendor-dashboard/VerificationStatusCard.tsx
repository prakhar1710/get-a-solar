
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Clock, X, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface CertificationStatus {
  id: string;
  certification_type: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
}

interface VerificationStatusCardProps {
  onUploadClick: () => void;
}

const VerificationStatusCard: React.FC<VerificationStatusCardProps> = ({ onUploadClick }) => {
  const { user } = useSupabaseAuth();
  const [certifications, setCertifications] = useState<CertificationStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCertifications();
    }
  }, [user]);

  const fetchCertifications = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_certifications')
        .select('id, certification_type, status, rejection_reason')
        .eq('vendor_id', user?.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setCertifications((data as CertificationStatus[]) || []);
    } catch (error) {
      console.error('Error fetching certifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (cert: CertificationStatus) => {
    switch (cert.status) {
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <Check className="h-3 w-3 mr-1" /> {cert.certification_type} Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="h-3 w-3 mr-1" /> {cert.certification_type} Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
            <X className="h-3 w-3 mr-1" /> {cert.certification_type} Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const approvedCertifications = certifications.filter(cert => cert.status === 'approved');
  const pendingCertifications = certifications.filter(cert => cert.status === 'pending');
  const rejectedCertifications = certifications.filter(cert => cert.status === 'rejected');

  const hasApprovedCertifications = approvedCertifications.length > 0;
  const hasOnlyApprovedCertifications = certifications.length > 0 && certifications.every(cert => cert.status === 'approved');

  if (loading) {
    return (
      <Card className="mb-8 border-orange-200 bg-orange-50">
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">Loading verification status...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`mb-8 ${hasOnlyApprovedCertifications ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Verification Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {certifications.length === 0 ? (
            <>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  <Check className="h-3 w-3 mr-1" /> GSTIN Verified
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Upload your certifications to complete verification and improve your visibility and bid ranking.
              </p>
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  <Check className="h-3 w-3 mr-1" /> GSTIN Verified
                </Badge>
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    {getStatusBadge(cert)}
                  </div>
                ))}
              </div>
              
              {hasOnlyApprovedCertifications ? (
                <p className="text-sm text-green-700">
                  🎉 Verification complete! Your certifications have been approved.
                </p>
              ) : (
                <>
                  {pendingCertifications.length > 0 && (
                    <p className="text-sm text-yellow-700">
                      Your certifications are under review. You'll be notified once they're approved.
                    </p>
                  )}
                  {rejectedCertifications.length > 0 && (
                    <div className="text-sm text-red-700">
                      <p className="font-medium">Some certifications were rejected:</p>
                      {rejectedCertifications.map((cert) => (
                        <div key={cert.id} className="mt-1 pl-2 border-l-2 border-red-200">
                          <p className="font-medium">{cert.certification_type}</p>
                          {cert.rejection_reason && (
                            <p className="text-xs">{cert.rejection_reason}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {!hasApprovedCertifications && (
                    <p className="text-sm text-muted-foreground">
                      Complete your verification process to improve your visibility and bid ranking.
                    </p>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </CardContent>
      {!hasOnlyApprovedCertifications && (
        <CardFooter className="pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-sbs-orange border-sbs-orange hover:bg-sbs-orange hover:text-white"
            onClick={onUploadClick}
          >
            <Upload className="h-4 w-4 mr-2" />
            {certifications.length === 0 ? 'Upload Certifications' : 'Upload More Certifications'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default VerificationStatusCard;
