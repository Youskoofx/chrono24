-- Active l'extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des pneus
CREATE TABLE IF NOT EXISTS public.pneus (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  marque text       NOT NULL,
  dimensions text   NOT NULL,
  saison text       NOT NULL,    -- "été" / "hiver" / "4 saisons"
  etat text         NOT NULL,    -- "neuf" / "occasion"
  quantite integer  NOT NULL,
  reference text,
  commentaire text,
  date_ajout timestamptz NOT NULL DEFAULT now()
);

-- Table de l'historique
CREATE TABLE IF NOT EXISTS public.historique (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type_action text     NOT NULL, -- "ajout"/"modification"/"suppression"
  marque text,
  etat text,
  date_action timestamptz NOT NULL DEFAULT now()
);

-- Policies RLS pour pneus
DROP POLICY IF EXISTS "Allow select pneus"   ON public.pneus;
DROP POLICY IF EXISTS "Allow insert pneus"   ON public.pneus;
DROP POLICY IF EXISTS "Allow update pneus"   ON public.pneus;
DROP POLICY IF EXISTS "Allow delete pneus"   ON public.pneus;

CREATE POLICY "Allow select pneus" 
  ON public.pneus FOR SELECT USING (true);
CREATE POLICY "Allow insert pneus"
  ON public.pneus FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update pneus"
  ON public.pneus FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete pneus"
  ON public.pneus FOR DELETE USING (true);

-- Policies RLS pour historique
DROP POLICY IF EXISTS "Allow select historique" ON public.historique;
DROP POLICY IF EXISTS "Allow insert historique" ON public.historique;

CREATE POLICY "Allow select historique"
  ON public.historique FOR SELECT USING (true);
CREATE POLICY "Allow insert historique"
  ON public.historique FOR INSERT WITH CHECK (true);

-- Enable RLS
ALTER TABLE public.pneus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historique ENABLE ROW LEVEL SECURITY;

-- Enable realtime
alter publication supabase_realtime add table public.pneus;
alter publication supabase_realtime add table public.historique;