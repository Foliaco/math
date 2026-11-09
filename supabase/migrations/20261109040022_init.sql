
-- ==========================================
-- 1. ENUM
-- ==========================================

DO $$
BEGIN
    CREATE TYPE public.status_publish AS ENUM (
        'draft',
        'in_review',
        'published',
        'archived'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END;
$$;


-- ==========================================
-- 2. FUNCTIONS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.functions (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    wikipedia_url TEXT,
    wikipedia_id TEXT UNIQUE,
    latex TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    embedding_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    status_publish public.status_publish NOT NULL DEFAULT 'draft',
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    last_edited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    search_vector TSVECTOR
);


-- ==========================================
-- 3. SEARCH VECTOR INDEX
-- ==========================================

CREATE INDEX IF NOT EXISTS functions_search_vector_idx
ON public.functions
USING GIN (search_vector);


-- ==========================================
-- 4. SEARCH VECTOR UPDATE FUNCTION
-- ==========================================

CREATE OR REPLACE FUNCTION public.functions_search_vector_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.search_vector :=
        setweight(
            to_tsvector('spanish', COALESCE(NEW.name, '')),
            'A'
        ) ||
        setweight(
            to_tsvector('spanish', COALESCE(NEW.description, '')),
            'B'
        ) ||
        setweight(
            to_tsvector('simple', COALESCE(NEW.latex, '')),
            'C'
        );

    RETURN NEW;
END;
$$;


-- ==========================================
-- 5. SEARCH VECTOR TRIGGER
-- ==========================================

DROP TRIGGER IF EXISTS functions_search_vector_trigger
ON public.functions;

CREATE TRIGGER functions_search_vector_trigger
BEFORE INSERT OR UPDATE OF name, description, latex
ON public.functions
FOR EACH ROW
EXECUTE FUNCTION public.functions_search_vector_update();


-- ==========================================
-- 6. UPDATE EXISTING RECORDS
-- ==========================================

UPDATE public.functions
SET search_vector =
    setweight(
        to_tsvector('spanish', COALESCE(name, '')),
        'A'
    ) ||
    setweight(
        to_tsvector('spanish', COALESCE(description, '')),
        'B'
    ) ||
    setweight(
        to_tsvector('simple', COALESCE(latex, '')),
        'C'
    )
WHERE search_vector IS NULL;


-- ==========================================
-- 7. SEARCH FUNCTION
-- ==========================================

CREATE OR REPLACE FUNCTION public.search_functions(
    search_query TEXT
)
RETURNS TABLE (
    id INTEGER,
    name TEXT,
    description TEXT,
    latex TEXT,
    relevance REAL
)
LANGUAGE SQL
STABLE
SET search_path = public
AS $$
    SELECT
        f.id,
        f.name,
        f.description,
        f.latex,
        ts_rank(
            f.search_vector,
            websearch_to_tsquery('spanish', search_query)
        ) AS relevance
    FROM public.functions f
    WHERE
        NULLIF(TRIM(search_query), '') IS NOT NULL
        AND f.search_vector @@ websearch_to_tsquery('spanish', search_query)
    ORDER BY relevance DESC
    LIMIT 20;
$$;


-- ==========================================
-- 8. FUNCTION MODIFY HISTORY
-- ==========================================

CREATE TABLE IF NOT EXISTS public.function_modify_history (
    id SERIAL PRIMARY KEY,
    function_id INTEGER NOT NULL
        REFERENCES public.functions(id) ON DELETE CASCADE,
    changed_by UUID NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,
    diff TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);


-- ==========================================
-- 9. ENABLE RLS
-- ==========================================

ALTER TABLE public.functions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.function_modify_history ENABLE ROW LEVEL SECURITY;


-- ==========================================
-- 10. FUNCTIONS POLICIES
-- ==========================================

DROP POLICY IF EXISTS "Public can read functions"
ON public.functions;

CREATE POLICY "Public can read functions"
ON public.functions
FOR SELECT
TO anon, authenticated
USING (true);


DROP POLICY IF EXISTS "Authenticated users can create functions"
ON public.functions;

CREATE POLICY "Authenticated users can create functions"
ON public.functions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);


DROP POLICY IF EXISTS "Users can update their own functions"
ON public.functions;

CREATE POLICY "Users can update their own functions"
ON public.functions
FOR UPDATE
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);


DROP POLICY IF EXISTS "Users can delete their own functions"
ON public.functions;

CREATE POLICY "Users can delete their own functions"
ON public.functions
FOR DELETE
TO authenticated
USING (auth.uid() = created_by);


-- ==========================================
-- 11. HISTORY POLICIES
-- ==========================================

DROP POLICY IF EXISTS "Public can read function history"
ON public.function_modify_history;

CREATE POLICY "Public can read function history"
ON public.function_modify_history
FOR SELECT
TO anon, authenticated
USING (true);


DROP POLICY IF EXISTS "Service role can manage function history"
ON public.function_modify_history;

CREATE POLICY "Service role can manage function history"
ON public.function_modify_history
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- ==========================================
-- 12. SQL PRIVILEGES
-- ==========================================

GRANT SELECT ON public.functions TO anon, authenticated;

GRANT INSERT, UPDATE, DELETE
ON public.functions TO authenticated;

GRANT SELECT
ON public.function_modify_history TO anon, authenticated;

GRANT ALL
ON public.function_modify_history TO service_role;


-- ==========================================
-- 13. SEQUENCES
-- ==========================================

GRANT USAGE, SELECT
ON SEQUENCE public.functions_id_seq
TO authenticated, service_role;

GRANT USAGE, SELECT
ON SEQUENCE public.function_modify_history_id_seq
TO service_role;


-- ==========================================
-- 14. RPC PERMISSIONS
-- ==========================================

GRANT EXECUTE
ON FUNCTION public.search_functions(TEXT)
TO anon, authenticated;
