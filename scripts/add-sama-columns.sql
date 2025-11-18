-- Add frameworkSpecific column to controls table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='controls' AND column_name='framework_specific') THEN
        ALTER TABLE controls ADD COLUMN framework_specific JSONB;
    END IF;
END $$;

-- Add maturity_level column to assessment_results table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='assessment_results' AND column_name='maturity_level') THEN
        ALTER TABLE assessment_results ADD COLUMN maturity_level TEXT;
    END IF;
END $$;

-- Add maturity_score column to assessment_results table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='assessment_results' AND column_name='maturity_score') THEN
        ALTER TABLE assessment_results ADD COLUMN maturity_score INTEGER;
    END IF;
END $$;

-- Add framework_specific_data column to assessment_results table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='assessment_results' AND column_name='framework_specific_data') THEN
        ALTER TABLE assessment_results ADD COLUMN framework_specific_data JSONB;
    END IF;
END $$;