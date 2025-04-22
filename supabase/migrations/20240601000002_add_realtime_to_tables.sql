-- Enable RLS
ALTER TABLE public.pneus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historique ENABLE ROW LEVEL SECURITY;

-- Enable realtime for both tables
BEGIN;
  -- Drop from publication if it exists already (to avoid errors)
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.pneus;
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.historique;
  
  -- Add to publication
  ALTER PUBLICATION supabase_realtime ADD TABLE public.pneus;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.historique;
COMMIT;