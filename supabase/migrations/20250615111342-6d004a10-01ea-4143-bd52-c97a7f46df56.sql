
-- Add the accepted_bid_id column to the projects table to store a reference to the winning bid.
ALTER TABLE public.projects
ADD COLUMN accepted_bid_id UUID;

-- Add a foreign key constraint to ensure data integrity.
-- This links the project to a specific bid in the bids table.
-- If an accepted bid is ever deleted, the reference in the project will be set to NULL.
ALTER TABLE public.projects
ADD CONSTRAINT projects_accepted_bid_id_fkey
FOREIGN KEY (accepted_bid_id)
REFERENCES public.bids(id) ON DELETE SET NULL;
