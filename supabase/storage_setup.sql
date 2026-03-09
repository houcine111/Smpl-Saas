-- 1. Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Define Policies

-- Allow public read access to all images
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Allow vendors to upload images to their own directory
-- We assume the folder name is the user's ID
CREATE POLICY "Vendor Upload Access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'product-images' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow vendors to update/delete their own images
CREATE POLICY "Vendor Update Delete Access"
ON storage.objects FOR ALL
TO authenticated
USING (
    bucket_id = 'product-images' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);
