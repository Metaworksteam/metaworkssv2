-- Create subdomains table
CREATE TABLE IF NOT EXISTS subdomains (
    id SERIAL PRIMARY KEY,
    domain_id INTEGER NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    UNIQUE(domain_id, name)
);

-- Add subdomain_id column to controls table
ALTER TABLE controls 
ADD COLUMN subdomain_id INTEGER REFERENCES subdomains(id) ON DELETE CASCADE;

-- Create default subdomains for each domain
INSERT INTO subdomains (domain_id, name, display_name, description, "order")
SELECT id, name, display_name, 'Default subdomain', 1
FROM domains;

-- We'll keep subdomain_id nullable for now to avoid issues during migration
-- Once all controls have subdomains, you can use this command to make it NOT NULL
-- ALTER TABLE controls 
-- ALTER COLUMN subdomain_id SET NOT NULL;

-- Create index for better performance
CREATE INDEX idx_controls_subdomain_id ON controls(subdomain_id);

-- Update existing controls to point to the new subdomains
UPDATE controls c
SET subdomain_id = (
    SELECT s.id 
    FROM subdomains s 
    WHERE s.domain_id = c.domain_id
    LIMIT 1
)
WHERE c.domain_id IS NOT NULL;