-- Create delete_account function (security definer)
create or replace function delete_account()
returns void
language plpgsql
security definer
as $$
declare
  v_user_id uuid := auth.uid();
begin
  -- Delete in correct order due to foreign keys
  -- First delete connection_shares where user is sharer
  delete from connection_shares where user_id = v_user_id;

  -- Delete connections where user is owner or helper
  delete from connections where owner_id = v_user_id or helper_id = v_user_id;

  -- Delete offers where user is helper
  delete from offers where helper_id = v_user_id;

  -- Delete tasks where user is owner (this will cascade to offers)
  delete from tasks where owner_id = v_user_id;

  -- Delete contact_methods
  delete from contact_methods where user_id = v_user_id;

  -- Delete blocks where user is blocker or blocked
  delete from blocks where blocker_id = v_user_id or blocked_id = v_user_id;

  -- Delete reports where user is reporter
  delete from reports where reporter_id = v_user_id;

  -- Delete profile
  delete from profiles where id = v_user_id;

  -- Note: auth.users deletion is handled by Supabase Auth separately
  -- This function only deletes application data
end;
$$;