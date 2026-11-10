ALTER TABLE public.functions
    ADD COLUMN slug_es TEXT,
    ADD COLUMN slug_en TEXT,
    ADD COLUMN slug_ja TEXT;

UPDATE public.functions
SET
    slug_es = COALESCE(
        NULLIF(
            trim(both '-' FROM regexp_replace(
                translate(lower(name), 'áéíóúüñ', 'aeiouun'),
                '[^a-z0-9]+',
                '-',
                'g'
            )),
            ''
        ),
        'funcion'
    ) || '-' || id::TEXT,
    slug_en = COALESCE(
        NULLIF(
            trim(both '-' FROM regexp_replace(
                translate(lower(COALESCE(NULLIF(name_en, ''), name)), 'áéíóúüñ', 'aeiouun'),
                '[^a-z0-9]+',
                '-',
                'g'
            )),
            ''
        ),
        'function'
    ) || '-' || id::TEXT,
    slug_ja = 'sugaku-' || COALESCE(
        NULLIF(
            trim(both '-' FROM regexp_replace(
                translate(lower(COALESCE(NULLIF(name_en, ''), name)), 'áéíóúüñ', 'aeiouun'),
                '[^a-z0-9]+',
                '-',
                'g'
            )),
            ''
        ),
        'function'
    ) || '-' || id::TEXT;

ALTER TABLE public.functions
    ALTER COLUMN slug_es SET NOT NULL,
    ALTER COLUMN slug_en SET NOT NULL,
    ALTER COLUMN slug_ja SET NOT NULL,
    ADD CONSTRAINT functions_slug_es_format CHECK (slug_es ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    ADD CONSTRAINT functions_slug_en_format CHECK (slug_en ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    ADD CONSTRAINT functions_slug_ja_format CHECK (slug_ja ~ '^[a-z0-9]+(-[a-z0-9]+)*$');

CREATE UNIQUE INDEX functions_slug_es_idx ON public.functions (slug_es);
CREATE UNIQUE INDEX functions_slug_en_idx ON public.functions (slug_en);
CREATE UNIQUE INDEX functions_slug_ja_idx ON public.functions (slug_ja);

DROP FUNCTION public.search_functions(TEXT);

CREATE FUNCTION public.search_functions(search_query TEXT)
RETURNS TABLE (
    id INTEGER,
    name TEXT,
    description TEXT,
    latex TEXT,
    slug_es TEXT,
    slug_en TEXT,
    slug_ja TEXT,
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
        f.slug_es,
        f.slug_en,
        f.slug_ja,
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

GRANT EXECUTE ON FUNCTION public.search_functions(TEXT) TO anon, authenticated;
