set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
  begin
    insert into public.users (account_id, onboarded, deactivated)
    values (new.id, false, false);
    return new;
  end;
$function$
;


