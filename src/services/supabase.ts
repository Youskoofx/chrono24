import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Create client only if environment variables are available
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey)
    : createClient<Database>(
        "https://placeholder-url.supabase.co",
        "placeholder-key",
      );

// Types pour les tables
export type Pneu = {
  id?: string;
  marque: string;
  dimensions: string;
  saison: string;
  etat: string;
  quantite: number;
  reference?: string;
  commentaire?: string;
  date_ajout?: string;
};

export type HistoriqueItem = {
  id?: string;
  type_action: string;
  marque: string;
  etat: string;
  date_action?: string;
};

// Ensure supabase client has channel method
if (!supabase.channel) {
  // Mock implementation for environments where channel is not available
  supabase.channel = (name: string): any => {
    console.warn(
      "Supabase realtime channel not available, using mock implementation",
    );
    return {
      on: (event: string, filter: any, callback: () => void) => {
        console.log(`Mock channel on ${event} called`);
        return {
          subscribe: () => {
            console.log(`Mock channel subscribe called`);
            return {
              unsubscribe: () => console.log("Mock unsubscribe called"),
            };
          },
        };
      },
    };
  };
}

// Service pour les pneus
export const pneuService = {
  // Référence à supabase pour l'utilisation dans les composants
  supabase,

  // S'abonner aux changements d'une table
  subscribeToChanges(
    channelName: string,
    tableName: string,
    callback: () => void,
  ): { unsubscribe: () => void } {
    try {
      const channel = supabase.channel(channelName);
      return channel
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: tableName },
          callback,
        )
        .subscribe();
    } catch (error) {
      console.error("Erreur lors de l'abonnement aux changements:", error);
      // Return a dummy subscription object
      return {
        unsubscribe: () => console.log("Dummy unsubscribe called"),
      };
    }
  },
  // Récupérer tous les pneus
  async getAllPneus() {
    const { data, error } = await supabase
      .from("pneus")
      .select("*")
      .order("date_ajout", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Récupérer un pneu par son ID
  async getPneuById(id: string) {
    const { data, error } = await supabase
      .from("pneus")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Ajouter un nouveau pneu
  async addPneu(pneu: Pneu) {
    const { data, error } = await supabase
      .from("pneus")
      .insert([pneu])
      .select();

    if (error) throw error;

    // Ajouter une entrée dans l'historique
    await historiqueService.addHistorique({
      type_action: "ajout",
      marque: pneu.marque,
      etat: pneu.etat,
    });

    return data[0];
  },

  // Mettre à jour un pneu
  async updatePneu(id: string, pneu: Partial<Pneu>) {
    const { data, error } = await supabase
      .from("pneus")
      .update(pneu)
      .eq("id", id)
      .select();

    if (error) throw error;

    // Ajouter une entrée dans l'historique
    await historiqueService.addHistorique({
      type_action: "modification",
      marque: pneu.marque || "",
      etat: pneu.etat || "",
    });

    return data[0];
  },

  // Supprimer un pneu
  async deletePneu(id: string, marque: string, etat: string) {
    const { error } = await supabase.from("pneus").delete().eq("id", id);

    if (error) throw error;

    // Ajouter une entrée dans l'historique
    await historiqueService.addHistorique({
      type_action: "suppression",
      marque,
      etat,
    });

    return true;
  },

  // Récupérer les statistiques des pneus
  async getPneuStats() {
    const { data, error } = await supabase
      .from("pneus")
      .select("etat, quantite");

    if (error) throw error;

    const stats = {
      total: 0,
      neufs: 0,
      occasions: 0,
    };

    data.forEach((pneu) => {
      stats.total += pneu.quantite;
      if (pneu.etat === "neuf") {
        stats.neufs += pneu.quantite;
      } else {
        stats.occasions += pneu.quantite;
      }
    });

    return stats;
  },

  // Récupérer les pneus avec stock faible (≤ 5)
  async getLowStockPneus() {
    const { data, error } = await supabase
      .from("pneus")
      .select("*")
      .lte("quantite", 5)
      .order("quantite");

    if (error) throw error;
    return data;
  },
};

// Service pour l'historique
export const historiqueService = {
  // Référence à supabase pour l'utilisation dans les composants
  supabase,

  // S'abonner aux changements d'une table
  subscribeToChanges(
    channelName: string,
    tableName: string,
    callback: () => void,
  ): { unsubscribe: () => void } {
    try {
      const channel = supabase.channel(channelName);
      return channel
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: tableName },
          callback,
        )
        .subscribe();
    } catch (error) {
      console.error("Erreur lors de l'abonnement aux changements:", error);
      // Return a dummy subscription object
      return {
        unsubscribe: () => console.log("Dummy unsubscribe called"),
      };
    }
  },

  // Récupérer tout l'historique
  async getAllHistorique() {
    const { data, error } = await supabase
      .from("historique")
      .select("*")
      .order("date_action", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Ajouter une entrée dans l'historique
  async addHistorique(historique: HistoriqueItem) {
    const { data, error } = await supabase
      .from("historique")
      .insert([historique])
      .select();

    if (error) throw error;
    return data[0];
  },
};
