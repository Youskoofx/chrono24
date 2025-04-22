import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Edit, Trash2, AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { pneuService, Pneu } from "../services/supabase";
import Loader from "./Loader";
import TireForm from "./TireForm";

const Stock = () => {
  const [pneus, setPneus] = useState<Pneu[]>([]);
  const [filteredPneus, setFilteredPneus] = useState<Pneu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres
  const [marqueFilter, setMarqueFilter] = useState("");
  const [saisonFilter, setSaisonFilter] = useState("");
  const [etatFilter, setEtatFilter] = useState("");

  // Dialogue de modification
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPneu, setCurrentPneu] = useState<Pneu | null>(null);

  // Dialogue de confirmation de suppression
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pneuToDelete, setPneuToDelete] = useState<Pneu | null>(null);

  useEffect(() => {
    const fetchPneus = async () => {
      try {
        setLoading(true);
        const data = await pneuService.getAllPneus();
        setPneus(data);
        setFilteredPneus(data);
      } catch (err) {
        console.error("Erreur lors du chargement des pneus:", err);
        setError(
          "Impossible de charger les données. Veuillez réessayer plus tard.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPneus();

    // Mettre en place un écouteur pour les mises à jour en temps réel
    const subscription = pneuService.supabase
      .channel("public:pneus")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pneus" },
        fetchPneus,
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    let result = pneus;

    if (marqueFilter) {
      result = result.filter((pneu) =>
        pneu.marque.toLowerCase().includes(marqueFilter.toLowerCase()),
      );
    }

    if (saisonFilter) {
      result = result.filter((pneu) => pneu.saison === saisonFilter);
    }

    if (etatFilter) {
      result = result.filter((pneu) => pneu.etat === etatFilter);
    }

    setFilteredPneus(result);
  }, [pneus, marqueFilter, saisonFilter, etatFilter]);

  const handleEdit = (pneu: Pneu) => {
    setCurrentPneu(pneu);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (pneu: Pneu) => {
    setPneuToDelete(pneu);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!pneuToDelete || !pneuToDelete.id) return;

    try {
      await pneuService.deletePneu(
        pneuToDelete.id,
        pneuToDelete.marque,
        pneuToDelete.etat,
      );
      setIsDeleteDialogOpen(false);
      setPneuToDelete(null);
      // La mise à jour sera gérée par l'écouteur en temps réel
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setError(
        "Impossible de supprimer le pneu. Veuillez réessayer plus tard.",
      );
    }
  };

  const handleUpdatePneu = async (updatedPneu: Pneu) => {
    if (!currentPneu || !currentPneu.id) return;

    try {
      await pneuService.updatePneu(currentPneu.id, updatedPneu);
      setIsEditDialogOpen(false);
      setCurrentPneu(null);
      // La mise à jour sera gérée par l'écouteur en temps réel
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
      setError(
        "Impossible de mettre à jour le pneu. Veuillez réessayer plus tard.",
      );
    }
  };

  const resetFilters = () => {
    setMarqueFilter("");
    setSaisonFilter("");
    setEtatFilter("");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader size="large" text="Chargement du stock..." />
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
            Stock de pneus
          </h1>
          <p className="text-gray-400 mt-2">Gérez votre inventaire de pneus</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h2 className="text-xl font-bold flex items-center mb-4 md:mb-0">
              <Filter className="mr-2 h-5 w-5 text-yellow-500" />
              Filtres
            </h2>
            <Button
              variant="outline"
              onClick={resetFilters}
              className="text-sm border-zinc-700 hover:bg-zinc-800"
            >
              Réinitialiser les filtres
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Marque
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Rechercher une marque..."
                  value={marqueFilter}
                  onChange={(e) => setMarqueFilter(e.target.value)}
                  className="pl-10 bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Saison
              </label>
              <Select value={saisonFilter} onValueChange={setSaisonFilter}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Toutes les saisons" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les saisons</SelectItem>
                  <SelectItem value="été">Été</SelectItem>
                  <SelectItem value="hiver">Hiver</SelectItem>
                  <SelectItem value="4 saisons">4 saisons</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">État</label>
              <Select value={etatFilter} onValueChange={setEtatFilter}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Tous les états" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les états</SelectItem>
                  <SelectItem value="neuf">Neuf</SelectItem>
                  <SelectItem value="occasion">Occasion</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Tableau de stock */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-zinc-800/50">
                  <TableHead className="text-yellow-500">Marque</TableHead>
                  <TableHead className="text-yellow-500">Dimensions</TableHead>
                  <TableHead className="text-yellow-500">Saison</TableHead>
                  <TableHead className="text-yellow-500">État</TableHead>
                  <TableHead className="text-yellow-500">Quantité</TableHead>
                  <TableHead className="text-yellow-500">Référence</TableHead>
                  <TableHead className="text-yellow-500">Commentaire</TableHead>
                  <TableHead className="text-right text-yellow-500">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPneus.length > 0 ? (
                  filteredPneus.map((pneu) => (
                    <TableRow
                      key={pneu.id}
                      className="hover:bg-zinc-800/50 border-zinc-800"
                      as={motion.tr}
                      variants={itemVariants}
                    >
                      <TableCell className="font-medium">
                        {pneu.marque}
                      </TableCell>
                      <TableCell>{pneu.dimensions}</TableCell>
                      <TableCell>{pneu.saison}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${pneu.etat === "neuf" ? "bg-green-900/30 text-green-400" : "bg-blue-900/30 text-blue-400"}`}
                        >
                          {pneu.etat}
                        </span>
                      </TableCell>
                      <TableCell
                        className={
                          pneu.quantite <= 5 ? "text-red-500 font-bold" : ""
                        }
                      >
                        {pneu.quantite}
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {pneu.reference || "-"}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-gray-400">
                        {pneu.commentaire || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(pneu)}
                            className="text-yellow-500 hover:text-yellow-400 hover:bg-zinc-800"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(pneu)}
                            className="text-red-500 hover:text-red-400 hover:bg-zinc-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-24 text-center text-gray-400"
                    >
                      Aucun pneu trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>

        {/* Dialogue de modification */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center">
                <span className="bg-yellow-500 h-6 w-2 mr-3"></span>
                Modifier un pneu
              </DialogTitle>
            </DialogHeader>
            {currentPneu && (
              <TireForm
                initialData={currentPneu}
                onSubmit={handleUpdatePneu}
                submitButtonText="Enregistrer les modifications"
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Dialogue de confirmation de suppression */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center">
                <span className="bg-red-500 h-6 w-2 mr-3"></span>
                Confirmer la suppression
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Êtes-vous sûr de vouloir supprimer ce pneu ?</p>
              {pneuToDelete && (
                <div className="mt-2 p-3 bg-zinc-800 rounded-md">
                  <p className="font-medium">
                    {pneuToDelete.marque} - {pneuToDelete.dimensions}
                  </p>
                  <p className="text-sm text-gray-400">
                    {pneuToDelete.saison} - {pneuToDelete.etat}
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="border-zinc-700 hover:bg-zinc-800"
              >
                Annuler
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Stock;
