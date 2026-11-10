alter table public.functions
add column name_en text not null default '';

alter table public.functions
add column description_en text not null default '';

alter table public.functions
add column wikipedia_url_en text default '';

alter table public.functions
add column wikipedia_id_en text;

alter table public.function_modify_history
add column diff_latex text not null;

alter table public.function_modify_history
add column diff_en text not null;