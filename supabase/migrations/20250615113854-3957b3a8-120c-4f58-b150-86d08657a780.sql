
-- Check current constraint on projects table
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'projects'::regclass 
AND contype = 'c';

-- Drop the existing check constraint if it exists
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;

-- Add the correct check constraint that includes 'awarded' status
ALTER TABLE projects ADD CONSTRAINT projects_status_check 
CHECK (status IN ('open', 'closed', 'awarded'));
