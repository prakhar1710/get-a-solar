import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileIcon, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useToast } from '@/hooks/use-toast';

interface CertificationUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CERTIFICATION_TYPES = [
  { value: 'ALMM', label: 'ALMM Certification' },
  { value: 'BIS', label: 'BIS Certification' },
  { value: 'GST', label: 'GST Certificate' },
  { value: 'PAN', label: 'PAN Card' },
  { value: 'COMPANY', label: 'Company Registration' },
  { value: 'OTHER', label: 'Other Certification' }
];

const CertificationUploadDialog: React.FC<CertificationUploadDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [certificationType, setCertificationType] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive"
        });
        return;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF, JPG, or PNG file",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !certificationType || !user) {
      toast({
        title: "Missing information",
        description: "Please select a file and certification type",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      // Create unique file path
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('vendor-certifications')
        .upload(filePath, selectedFile);

      if (uploadError) {
        throw uploadError;
      }

      // Save certification record
      const { error: dbError } = await supabase
        .from('vendor_certifications')
        .insert({
          vendor_id: user.id,
          certification_type: certificationType,
          file_name: selectedFile.name,
          file_path: filePath,
          file_size: selectedFile.size,
          mime_type: selectedFile.type,
          status: 'pending'
        });

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Upload successful",
        description: "Your certification has been uploaded and is pending review"
      });

      // Reset form and close dialog
      setCertificationType('');
      setSelectedFile(null);
      onOpenChange(false);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your certification. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Certification</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="certification-type">Certification Type</Label>
            <Select value={certificationType} onValueChange={setCertificationType}>
              <SelectTrigger>
                <SelectValue placeholder="Select certification type" />
              </SelectTrigger>
              <SelectContent>
                {CERTIFICATION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-upload">Select File</Label>
            {selectedFile ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center gap-2">
                  <FileIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{selectedFile.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 10MB)</p>
                  </div>
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || !certificationType || uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Certification'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificationUploadDialog;