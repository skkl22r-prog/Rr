-- Remove the RSVP limit trigger and function so any number of guests can register
DROP TRIGGER IF EXISTS rsvp_limit_trigger ON public.rsvps;
DROP FUNCTION IF EXISTS public.enforce_rsvp_limit() CASCADE;