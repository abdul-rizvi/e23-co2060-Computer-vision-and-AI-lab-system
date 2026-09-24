-- Additive migration for existing databases. Run once before deploying the updated project API.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS team_members TEXT;
