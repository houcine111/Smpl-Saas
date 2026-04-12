-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists to avoid errors on rerun
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

-- 2. Update Products Table
-- Use IF NOT EXISTS for columns to allow safe execution multiple times
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='description') THEN
        ALTER TABLE public.products ADD COLUMN description TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='category_id') THEN
        ALTER TABLE public.products ADD COLUMN category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 3. Insert a comprehensive list of categories
INSERT INTO public.categories (name) 
SELECT name FROM (VALUES 
    -- Artisanat & Maison
    ('Tapis & Textiles'), 
    ('Poterie & Céramique'), 
    ('Luminaires'), 
    ('Décoration d''Intérieur'),
    ('Table & Service'),
    
    -- Cosmétique & Bien-être
    ('Huiles & Sérums'), 
    ('Savons Artisanaux'), 
    ('Soins du Corps'),
    ('Bien-être & SPA'),
    
    -- Épicerie Fine & Saveurs
    ('Épices & Condiments'), 
    ('Miel & Amlou'), 
    ('Thé & Infusions'),
    ('Huiles Alimentaires'),
    
    -- Mode & Accessoires
    ('Sacs & Maroquinerie'), 
    ('Bijoux Artisanaux'), 
    ('Vêtements Traditionnels'),
    ('Accessoires de Mode')
) AS t(name)
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = t.name);
