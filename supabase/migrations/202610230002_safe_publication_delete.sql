-- Run this file by itself in the Supabase SQL Editor.
-- Repairs the existing function without changing content or admin permissions.
begin;
do $repair$
declare
  definition text := pg_get_functiondef('public.save_portfolio(jsonb,bigint)'::regprocedure);
  old_statement text := $old$'delete from public.%I'$old$;
  new_statement text := $new$'delete from public.%I where position >= 0'$new$;
begin
  if strpos(definition, new_statement) > 0 then
    return; -- Already repaired; safe to run again.
  end if;
  if strpos(definition, old_statement) = 0 then
    raise exception 'Unexpected publication function version; no changes made';
  end if;
  execute replace(definition, old_statement, new_statement);
end;
$repair$;
notify pgrst, 'reload schema';
commit;
