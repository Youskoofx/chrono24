-- Create pneus table
CREATE TABLE IF NOT EXISTS pneus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  marque TEXT NOT NULL,
  dimensions TEXT NOT NULL,
  saison TEXT NOT NULL,
  etat TEXT NOT NULL,
  quantite INTEGER NOT NULL,
  reference TEXT,
  commentaire TEXT,
  date_ajout TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create historique table
CREATE TABLE IF NOT EXISTS historique (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type_action TEXT NOT NULL,
  marque TEXT NOT NULL,
  etat TEXT NOT NULL,
  date_action TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable realtime for both tables
alter publication supabase_realtime add table pneus;
alter publication supabase_realtime add table historique;
