alter table public.functions add column variables text[];
alter table public.functions add column js_code text;

alter table public.functions
add column name_jp text not null default '';

alter table public.functions
add column description_jp text not null default '';

alter table public.functions
add column wikipedia_url_jp text default '';

alter table public.functions
add column wikipedia_id_jp text;

alter table public.function_modify_history
add column diff_jp text not null;