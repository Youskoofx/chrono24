export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      pneus: {
        Row: {
          id: string;
          marque: string;
          dimensions: string;
          saison: string;
          etat: string;
          quantite: number;
          reference: string | null;
          commentaire: string | null;
          date_ajout: string;
        };
        Insert: {
          id?: string;
          marque: string;
          dimensions: string;
          saison: string;
          etat: string;
          quantite: number;
          reference?: string | null;
          commentaire?: string | null;
          date_ajout?: string;
        };
        Update: {
          id?: string;
          marque?: string;
          dimensions?: string;
          saison?: string;
          etat?: string;
          quantite?: number;
          reference?: string | null;
          commentaire?: string | null;
          date_ajout?: string;
        };
      };
      historique: {
        Row: {
          id: string;
          type_action: string;
          marque: string;
          etat: string;
          date_action: string;
        };
        Insert: {
          id?: string;
          type_action: string;
          marque: string;
          etat: string;
          date_action?: string;
        };
        Update: {
          id?: string;
          type_action?: string;
          marque?: string;
          etat?: string;
          date_action?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
