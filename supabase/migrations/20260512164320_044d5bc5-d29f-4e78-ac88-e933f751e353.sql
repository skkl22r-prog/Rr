
CREATE TABLE public.rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('attending','declined')),
  device_id TEXT NOT NULL UNIQUE,
  qr_token TEXT UNIQUE,
  scanned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Public invitation: anyone can insert and read (needed for guests without auth)
CREATE POLICY "Anyone can insert rsvp" ON public.rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read rsvp" ON public.rsvps FOR SELECT USING (true);

-- Enforce 5-attending limit
CREATE OR REPLACE FUNCTION public.enforce_rsvp_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'attending' THEN
    IF (SELECT COUNT(*) FROM public.rsvps WHERE status = 'attending') >= 5 THEN
      RAISE EXCEPTION 'rsvp_full';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER rsvp_limit_trigger
BEFORE INSERT ON public.rsvps
FOR EACH ROW EXECUTE FUNCTION public.enforce_rsvp_limit();
