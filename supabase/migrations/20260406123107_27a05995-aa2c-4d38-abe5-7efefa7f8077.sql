
-- UPDATE: only file owner or admin
CREATE POLICY "Vendors can update own certification files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'vendor-certifications'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.has_role(auth.uid(), 'admin')
  )
);

-- DELETE: only file owner or admin
CREATE POLICY "Vendors can delete own certification files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'vendor-certifications'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.has_role(auth.uid(), 'admin')
  )
);
