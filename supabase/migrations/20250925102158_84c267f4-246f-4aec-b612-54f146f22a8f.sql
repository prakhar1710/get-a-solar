-- Create storage bucket for vendor certifications
INSERT INTO storage.buckets (id, name, public) VALUES ('vendor-certifications', 'vendor-certifications', false);

-- Create vendor_certifications table
CREATE TABLE public.vendor_certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL,
  certification_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  rejection_reason TEXT
);

-- Enable RLS on vendor_certifications
ALTER TABLE public.vendor_certifications ENABLE ROW LEVEL SECURITY;

-- Create policies for vendor_certifications
CREATE POLICY "Vendors can insert their own certifications" 
ON public.vendor_certifications 
FOR INSERT 
WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Vendors can view their own certifications" 
ON public.vendor_certifications 
FOR SELECT 
USING (auth.uid() = vendor_id);

CREATE POLICY "Admins can view all certifications" 
ON public.vendor_certifications 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND user_type = 'admin'
));

CREATE POLICY "Admins can update certification status" 
ON public.vendor_certifications 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND user_type = 'admin'
));

-- Create storage policies for vendor certifications
CREATE POLICY "Vendors can upload their own certifications" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'vendor-certifications' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Vendors can view their own certifications" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'vendor-certifications' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all vendor certifications" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'vendor-certifications' AND EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND user_type = 'admin'
));