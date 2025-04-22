// Mock client Supabase pour fonctionner sans connexion réelle
import type { Database } from "@/types/supabase";

// Simuler un client Supabase avec localStorage
export const supabase = {
  from: (table: string) => ({
    select: (columns: string = "*") => ({
      order: (column: string, { ascending }: { ascending: boolean }) => ({
        async then(
          callback: (result: { data: any[]; error: null | Error }) => void,
        ) {
          try {
            const data = getDataFromLocalStorage(table);
            callback({ data, error: null });
          } catch (error) {
            callback({ data: [], error: error as Error });
          }
        },
      }),
      eq: (column: string, value: any) => ({
        single: () => ({
          async then(
            callback: (result: { data: any; error: null | Error }) => void,
          ) {
            try {
              const items = getDataFromLocalStorage(table);
              const item = items.find((item: any) => item[column] === value);
              callback({ data: item || null, error: null });
            } catch (error) {
              callback({ data: null, error: error as Error });
            }
          },
        }),
      }),
    }),
    insert: (items: any[]) => ({
      select: () => ({
        async then(
          callback: (result: { data: any[]; error: null | Error }) => void,
        ) {
          try {
            const existingData = getDataFromLocalStorage(table);
            const newItems = items.map((item) => ({
              ...item,
              id: crypto.randomUUID(),
              created_at: new Date().toISOString(),
            }));
            const updatedData = [...existingData, ...newItems];
            localStorage.setItem(table, JSON.stringify(updatedData));
            callback({ data: newItems, error: null });
          } catch (error) {
            callback({ data: [], error: error as Error });
          }
        },
      }),
    }),
    update: (item: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          async then(
            callback: (result: { data: any[]; error: null | Error }) => void,
          ) {
            try {
              const existingData = getDataFromLocalStorage(table);
              const index = existingData.findIndex(
                (i: any) => i[column] === value,
              );
              if (index !== -1) {
                const updatedItem = { ...existingData[index], ...item };
                existingData[index] = updatedItem;
                localStorage.setItem(table, JSON.stringify(existingData));
                callback({ data: [updatedItem], error: null });
              } else {
                callback({ data: [], error: null });
              }
            } catch (error) {
              callback({ data: [], error: error as Error });
            }
          },
        }),
      }),
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        async then(callback: (result: { error: null | Error }) => void) {
          try {
            const existingData = getDataFromLocalStorage(table);
            const updatedData = existingData.filter(
              (item: any) => item[column] !== value,
            );
            localStorage.setItem(table, JSON.stringify(updatedData));
            callback({ error: null });
          } catch (error) {
            callback({ error: error as Error });
          }
        },
      }),
    }),
  }),
};

// Fonction utilitaire pour récupérer les données du localStorage
function getDataFromLocalStorage(table: string): any[] {
  const data = localStorage.getItem(table);
  return data ? JSON.parse(data) : [];
}

// Types pour les tables principales
export type Tire = {
  id?: string;
  brand: string;
  width: number;
  height: number;
  diameter: number;
  season: "summer" | "winter" | "all-season";
  condition: boolean; // true = new, false = used
  quantity: number;
  reference?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

export type HistoryEntry = {
  id?: string;
  tire_id: string;
  action_type: "add" | "remove" | "edit";
  quantity_changed: number;
  tire_details: {
    brand: string;
    dimensions: string;
    season: string;
    condition: string;
  };
  created_at?: string;
  user?: string;
};

// Fonctions d'aide pour interagir avec Supabase
export async function fetchTires() {
  const { data, error } = await supabase
    .from("tires")
    .select("*")
    .order("brand", { ascending: true });

  if (error) {
    console.error("Erreur lors de la récupération des pneus:", error);
    return [];
  }

  return data || [];
}

export async function addTire(tire: Tire) {
  const { data, error } = await supabase
    .from("tires")
    .insert([
      {
        brand: tire.brand,
        width: tire.width,
        height: tire.height,
        diameter: tire.diameter,
        season: tire.season,
        condition: tire.condition,
        quantity: tire.quantity,
        reference: tire.reference || null,
        notes: tire.notes || null,
        updated_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) {
    console.error("Erreur lors de l'ajout du pneu:", error);
    throw error;
  }

  // Ajouter une entrée dans l'historique
  if (data && data.length > 0) {
    await addHistoryEntry({
      tire_id: data[0].id,
      action_type: "add",
      quantity_changed: tire.quantity,
      tire_details: {
        brand: tire.brand,
        dimensions: `${tire.width}/${tire.height} R${tire.diameter}`,
        season: tire.season,
        condition: tire.condition ? "new" : "used",
      },
      user: "Utilisateur",
    });
  }

  return data;
}

export async function updateTire(id: string, tire: Partial<Tire>) {
  // Récupérer l'ancien pneu pour l'historique
  const { data: oldTire } = await supabase
    .from("tires")
    .select("*")
    .eq("id", id)
    .single();

  const { data, error } = await supabase
    .from("tires")
    .update({
      ...tire,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Erreur lors de la mise à jour du pneu:", error);
    throw error;
  }

  // Ajouter une entrée dans l'historique
  if (data && data.length > 0 && oldTire) {
    const quantityChanged = (tire.quantity || 0) - (oldTire.quantity || 0);

    await addHistoryEntry({
      tire_id: id,
      action_type: "edit",
      quantity_changed: quantityChanged,
      tire_details: {
        brand: data[0].brand,
        dimensions: `${data[0].width}/${data[0].height} R${data[0].diameter}`,
        season: data[0].season,
        condition: data[0].condition ? "new" : "used",
      },
      user: "Utilisateur",
    });
  }

  return data;
}

export async function deleteTire(id: string) {
  // Récupérer le pneu avant de le supprimer pour l'historique
  const { data: tireToDelete } = await supabase
    .from("tires")
    .select("*")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("tires").delete().eq("id", id);

  if (error) {
    console.error("Erreur lors de la suppression du pneu:", error);
    throw error;
  }

  // Ajouter une entrée dans l'historique
  if (tireToDelete) {
    await addHistoryEntry({
      tire_id: id,
      action_type: "remove",
      quantity_changed: -tireToDelete.quantity,
      tire_details: {
        brand: tireToDelete.brand,
        dimensions: `${tireToDelete.width}/${tireToDelete.height} R${tireToDelete.diameter}`,
        season: tireToDelete.season,
        condition: tireToDelete.condition ? "new" : "used",
      },
      user: "Utilisateur",
    });
  }

  return true;
}

export async function addHistoryEntry(entry: HistoryEntry) {
  const { error } = await supabase.from("history").insert([
    {
      tire_id: entry.tire_id,
      action_type: entry.action_type,
      quantity_changed: entry.quantity_changed,
      tire_details: entry.tire_details,
      user: entry.user || "Utilisateur",
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("Erreur lors de l'ajout de l'entrée d'historique:", error);
    return false;
  }

  return true;
}

export async function fetchHistory() {
  const { data, error } = await supabase
    .from("history")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur lors de la récupération de l'historique:", error);
    return [];
  }

  return data || [];
}
