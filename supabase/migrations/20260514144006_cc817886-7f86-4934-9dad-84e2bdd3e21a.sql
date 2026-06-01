CREATE OR REPLACE FUNCTION public.scan_rsvp(_token text)
RETURNS TABLE(result text, guest_name text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r public.rsvps%ROWTYPE;
BEGIN
  SELECT * INTO r FROM public.rsvps WHERE qr_token = _token AND status = 'attending' LIMIT 1;
  IF NOT FOUND THEN
    RETURN QUERY SELECT 'not_found'::text, ''::text;
    RETURN;
  END IF;
  IF r.scanned THEN
    RETURN QUERY SELECT 'already'::text, r.name;
    RETURN;
  END IF;
  UPDATE public.rsvps SET scanned = true WHERE id = r.id;
  RETURN QUERY SELECT 'ok'::text, r.name;
END;
$$;

GRANT EXECUTE ON FUNCTION public.scan_rsvp(text) TO anon, authenticated;