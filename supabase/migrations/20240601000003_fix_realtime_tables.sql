-- Fix realtime for both tables
DO $$
BEGIN
  -- Try to drop tables from publication, ignore errors if they don't exist
  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.pneus;
  EXCEPTION WHEN OTHERS THEN
    -- Do nothing, continue execution
  END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.historique;
  EXCEPTION WHEN OTHERS THEN
    -- Do nothing, continue execution
  END;
  
  -- Add tables to publication
  ALTER PUBLICATION supabase_realtime ADD TABLE public.pneus;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.historique;
END;
$$;
