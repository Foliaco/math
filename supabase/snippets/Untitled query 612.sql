create or replace function public.generate_function_embeddings()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
    if NEW.embedding_enabled = false then
        return NEW;
    end if;

    if TG_OP = 'UPDATE'
        and NEW.name IS NOT DISTINCT FROM OLD.name
        and NEW.description IS NOT DISTINCT FROM OLD.description
        and NEW.latex IS NOT DISTINCT FROM OLD.latex
    then
        return NEW;
    end if;

    perform net.http_post(
        url := 'http://supabase_edge_runtime_math:8081/functions/v1/generate-embeddings',
        headers := jsonb_build_object(
            'Content-Type', 'application/json'
        ),
        body := jsonb_build_object(
            'id', NEW.id,
            'name', NEW.name,
            'description', NEW.description,
            'latex', NEW.latex
        )
    );

    return NEW;
end;
$$;