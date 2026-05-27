import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Eye, Download, FileSpreadsheet, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useToast } from '@/hooks/use-toast';

interface VendorCertification {
  id: string;
  vendor_id: string;
  certification_type: string;
  file_name: string;
  file_path: string;
  status: string;
  uploaded_at: string;
  reviewed_at?: string;
  rejection_reason?: string;
  profiles?: {
    full_name: string;
    email: string;
    phone_number: string;
  } | null;
}

const AdminDashboard: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [certifications, setCertifications] = useState<VendorCertification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertification, setSelectedCertification] = useState<VendorCertification | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_certifications')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      // Fetch vendor profiles separately
      if (data && data.length > 0) {
        const vendorIds = [...new Set(data.map(cert => cert.vendor_id))];
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email, phone_number')
          .in('id', vendorIds);

        if (profilesError) throw profilesError;

        const certificationsWithProfiles = data.map(cert => ({
          ...cert,
          profiles: profiles?.find(profile => profile.id === cert.vendor_id) || null
        }));

        setCertifications(certificationsWithProfiles);
      } else {
        setCertifications([]);
      }
    } catch (error) {
      console.error('Error fetching certifications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch certifications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (certificationId: string) => {
    setIsApproving(true);
    try {
      const { error } = await supabase
        .from('vendor_certifications')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id
        })
        .eq('id', certificationId);

      if (error) throw error;

      toast({
        title: "Approved",
        description: "Certification has been approved"
      });

      fetchCertifications();
    } catch (error) {
      console.error('Error approving certification:', error);
      toast({
        title: "Error",
        description: "Failed to approve certification",
        variant: "destructive"
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!selectedCertification || !rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a rejection reason",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('vendor_certifications')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id,
          rejection_reason: rejectionReason
        })
        .eq('id', selectedCertification.id);

      if (error) throw error;

      toast({
        title: "Rejected",
        description: "Certification has been rejected"
      });

      setShowReviewDialog(false);
      setRejectionReason('');
      setSelectedCertification(null);
      fetchCertifications();
    } catch (error) {
      console.error('Error rejecting certification:', error);
      toast({
        title: "Error",
        description: "Failed to reject certification",
        variant: "destructive"
      });
    }
  };

  const downloadFile = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('vendor-certifications')
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const pendingCertifications = certifications.filter(cert => cert.status === 'pending');
  const reviewedCertifications = certifications.filter(cert => cert.status !== 'pending');

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Review and approve vendor certifications
          </p>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Reviews ({pendingCertifications.length})
            </TabsTrigger>
            <TabsTrigger value="reviewed">
              Reviewed ({reviewedCertifications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : pendingCertifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending certifications
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Certification Type</TableHead>
                        <TableHead>File Name</TableHead>
                        <TableHead>Uploaded</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingCertifications.map((cert) => (
                        <TableRow key={cert.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{cert.profiles?.full_name}</p>
                              <p className="text-sm text-muted-foreground">{cert.profiles?.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{cert.certification_type}</TableCell>
                          <TableCell>{cert.file_name}</TableCell>
                          <TableCell>
                            {new Date(cert.uploaded_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadFile(cert.file_path, cert.file_name)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(cert.id)}
                                disabled={isApproving}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setSelectedCertification(cert);
                                  setShowReviewDialog(true);
                                }}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviewed">
            <Card>
              <CardHeader>
                <CardTitle>Reviewed Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                {reviewedCertifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No reviewed certifications
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Certification Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reviewed</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviewedCertifications.map((cert) => (
                        <TableRow key={cert.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{cert.profiles?.full_name}</p>
                              <p className="text-sm text-muted-foreground">{cert.profiles?.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{cert.certification_type}</TableCell>
                          <TableCell>{getStatusBadge(cert.status)}</TableCell>
                          <TableCell>
                            {cert.reviewed_at ? new Date(cert.reviewed_at).toLocaleDateString() : '-'}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadFile(cert.file_path, cert.file_name)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Certification</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="rejection-reason">Rejection Reason</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Please provide a reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleReject}>
                  Reject Certification
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;