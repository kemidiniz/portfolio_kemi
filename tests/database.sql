insert into auth.users values('00000000-0000-0000-0000-000000000001','admin@example.test'),('00000000-0000-0000-0000-000000000002','reader@example.test');
insert into public.portfolio_admins(user_id) values('00000000-0000-0000-0000-000000000001');
set role anon;
do $$ begin
  if (public.read_portfolio()->>'revision')::int <> 0 then raise exception 'Unexpected initial revision'; end if;
  if public.read_portfolio()->'content' <> 'null'::jsonb then raise exception 'Expected uninitialized content'; end if;
  begin
    perform public.save_portfolio((select content from test.fixture),0);
    raise exception 'Anonymous publish succeeded';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',false);
do $$ begin
  if public.is_portfolio_admin() then raise exception 'Reader identified as admin'; end if;
  begin
    insert into public.portfolio_admins(user_id) values(auth.uid());
    raise exception 'Self-promotion succeeded';
  exception when insufficient_privilege then null; end;
  begin
    perform public.save_portfolio((select content from test.fixture),0);
    raise exception 'Reader publish succeeded';
  exception when insufficient_privilege then null; end;
  begin
    insert into storage.objects(id,bucket_id,name) values(gen_random_uuid(),'portfolio-media','bad.jpg');
    raise exception 'Reader upload succeeded';
  exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
do $$ declare fixture jsonb; changed jsonb; begin
  select content into fixture from test.fixture;
  if not public.is_portfolio_admin() then raise exception 'Admin authorization failed'; end if;
  if public.save_portfolio(fixture,0) <> 1 then raise exception 'First publish failed'; end if;
  if public.read_portfolio()->'content' <> fixture then raise exception 'Published content differs'; end if;
  begin
    perform public.save_portfolio(fixture,0);
    raise exception 'Stale save succeeded';
  exception when serialization_failure then null; end;
  begin
    perform public.save_portfolio('{}'::jsonb,1);
    raise exception 'Malformed save succeeded';
  exception when invalid_parameter_value then null; end;
  begin
    perform public.save_portfolio(jsonb_set(fixture,'{personal,linkedin}','"javascript:alert(1)"'),1);
    raise exception 'Executable URL saved';
  exception when invalid_parameter_value then null; end;
  begin
    perform public.save_portfolio(jsonb_set(fixture,'{personal,age}','200'),1);
    raise exception 'Invalid age saved';
  exception when invalid_parameter_value then null; end;
  begin
    perform public.save_portfolio(jsonb_set(fixture,'{projects}',jsonb_build_array(fixture->'projects'->0,fixture->'projects'->0)),1);
    raise exception 'Duplicate project saved';
  exception when unique_violation then null; end;
  if public.read_portfolio()->'content' <> fixture then raise exception 'Failed save was not atomic'; end if;
  changed:=jsonb_set(fixture,'{personal,name}','"Nome atualizado"');
  changed:=jsonb_set(changed,'{projects}','[]');
  if public.save_portfolio(changed,1) <> 2 then raise exception 'Update failed'; end if;
  if public.read_portfolio()->'content' <> changed then raise exception 'Deletion not published'; end if;
  begin
    update public.portfolio_profile set content='{}';
    raise exception 'Direct table write succeeded';
  exception when insufficient_privilege then null; end;
  insert into storage.objects(id,bucket_id,name) values(gen_random_uuid(),'portfolio-media','admin.jpg');
end $$;
reset role;
set role anon;
do $$ begin
  if public.read_portfolio()->'content'->'personal'->>'name' <> 'Nome atualizado' then raise exception 'Public read failed'; end if;
  if (select count(*) from storage.objects where name='admin.jpg') <> 1 then raise exception 'Public media read failed'; end if;
end $$;
reset role;
select 'PASS: anonymous read, admin-only publish/upload, self-promotion denied, payload validation, atomic rollback, stale revision protection, update and deletion' as result;
