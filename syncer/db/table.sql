-- Drop existing table
DROP TABLE IF EXISTS public.news;

-- Create new optimized table
CREATE TABLE public.news
(
    id SERIAL PRIMARY KEY,
    source_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    headline VARCHAR(255) NOT NULL,
    story TEXT NOT NULL,
    summary TEXT,
    bullet_points TEXT[],
    image_link TEXT,
    source_link TEXT NOT NULL,
    meta_description TEXT,
    meta_keywords TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create composite index for common query patterns
CREATE INDEX idx_news_source_category_created 
    ON public.news(source_name, category, created_at DESC);

-- Create index for headline searches
CREATE INDEX idx_news_headline 
    ON public.news(headline);

-- Create unique index on source_link for quick duplicate detection
CREATE UNIQUE INDEX idx_news_source_link 
    ON public.news(source_link);

-- Grant appropriate permissions
ALTER TABLE public.news OWNER TO postgres;

-- Create trigger function for timestamp management
CREATE OR REPLACE FUNCTION manage_timestamps()
RETURNS TRIGGER AS $$
BEGIN
    -- For INSERT operations
    IF TG_OP = 'INSERT' THEN
        NEW.created_at = CURRENT_TIMESTAMP;
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END IF;
    
    -- For UPDATE operations
    IF TG_OP = 'UPDATE' THEN
        NEW.updated_at = CURRENT_TIMESTAMP;
        NEW.created_at = OLD.created_at; -- Preserve the original created_at
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER news_timestamps
    BEFORE INSERT OR UPDATE ON public.news
    FOR EACH ROW
    EXECUTE FUNCTION manage_timestamps();