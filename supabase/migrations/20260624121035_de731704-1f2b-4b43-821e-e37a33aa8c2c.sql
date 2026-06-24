
REVOKE EXECUTE ON FUNCTION public.vendor_has_bid_on_project(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_project_owner(uuid, uuid) FROM PUBLIC, anon, authenticated;
