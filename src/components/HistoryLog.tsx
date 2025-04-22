import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  CalendarIcon,
  FilterIcon,
  SearchIcon,
  UserIcon,
  AlertTriangle,
} from "lucide-react";
import { historiqueService, HistoriqueItem } from "../services/supabase";
import Loader from "./Loader";
import { Alert, AlertDescription } from "./ui/alert";

const HistoryLog = () => {
  const [entries, setEntries] = useState<HistoriqueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");

  useEffect(() => {
    const fetchHistorique = async () => {
      try {
        setLoading(true);
        const data = await historiqueService.getAllHistorique();
        setEntries(data);
      } catch (err) {
        console.error("Erreur lors du chargement de l'historique:", err);
        setError(
          "Impossible de charger l'historique. Veuillez réessayer plus tard.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistorique();

    // Mettre en place un écouteur pour les mises à jour en temps réel
    const subscription = historiqueService.subscribeToChanges(
      "public:historique",
      "historique",
      fetchHistorique,
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Filtrer les entrées en fonction des filtres sélectionnés
  const filteredEntries = entries.filter((entry) => {
    // Filtrer par date si sélectionnée
    if (
      selectedDate &&
      format(new Date(entry.date_action || ""), "yyyy-MM-dd") !==
        format(selectedDate, "yyyy-MM-dd")
    ) {
      return false;
    }

    // Filtrer par type d'action si pas 'all'
    if (actionFilter !== "all" && entry.type_action !== actionFilter) {
      return false;
    }

    // Filtrer par recherche
    if (
      searchQuery &&
      !entry.marque.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader size="large" text="Chargement de l'historique..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Racing-themed background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 z-0" />

      <div className="relative z-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <span className="bg-yellow-500 h-8 w-2 mr-3"></span>
            Historique des mouvements
          </h1>
          <p className="text-gray-400 mt-2">
            Consultez l'historique des opérations sur votre stock
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="w-full bg-zinc-900 border-zinc-800 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <span className="bg-yellow-500 w-1 h-6 rounded-full mr-2"></span>
              Journal d'activité
            </CardTitle>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  placeholder="Rechercher par marque..."
                  className="pl-9 bg-zinc-800 border-zinc-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex gap-2 items-center border-zinc-700 bg-zinc-800"
                    >
                      <CalendarIcon className="h-4 w-4" />
                      {selectedDate
                        ? format(selectedDate, "dd MMMM yyyy", { locale: fr })
                        : "Choisir une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-[150px] border-zinc-700 bg-zinc-800">
                    <SelectValue placeholder="Type d'action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les actions</SelectItem>
                    <SelectItem value="ajout">Ajout</SelectItem>
                    <SelectItem value="modification">Modification</SelectItem>
                    <SelectItem value="suppression">Suppression</SelectItem>
                  </SelectContent>
                </Select>
                {(selectedDate || actionFilter !== "all" || searchQuery) && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectedDate(undefined);
                      setActionFilter("all");
                      setSearchQuery("");
                    }}
                  >
                    Effacer les filtres
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col md:flex-row gap-4 p-4 border border-zinc-800 rounded-lg relative overflow-hidden"
                  >
                    {/* Action type indicator */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 ${getActionColor(entry.type_action)}`}
                    ></div>

                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={getActionVariant(entry.type_action)}
                            className="capitalize"
                          >
                            {getActionLabel(entry.type_action)}
                          </Badge>
                          <span className="text-sm text-gray-400">
                            {format(
                              new Date(entry.date_action || ""),
                              "dd MMMM yyyy à HH:mm",
                              { locale: fr },
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2">
                        <p className="text-sm">
                          <span className="font-medium">{entry.marque}</span>
                          {entry.etat && (
                            <span className="ml-2 text-gray-400">
                              État: {entry.etat}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  Aucune entrée d'historique ne correspond à vos filtres.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper functions for styling
const getActionColor = (actionType: string) => {
  switch (actionType) {
    case "ajout":
      return "bg-green-500";
    case "suppression":
      return "bg-red-500";
    case "modification":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

const getActionVariant = (
  actionType: string,
): "default" | "destructive" | "outline" | "secondary" => {
  switch (actionType) {
    case "ajout":
      return "default";
    case "suppression":
      return "destructive";
    case "modification":
      return "secondary";
    default:
      return "outline";
  }
};

const getActionLabel = (actionType: string): string => {
  switch (actionType) {
    case "ajout":
      return "Ajout";
    case "suppression":
      return "Suppression";
    case "modification":
      return "Modification";
    default:
      return actionType;
  }
};

export default HistoryLog;
